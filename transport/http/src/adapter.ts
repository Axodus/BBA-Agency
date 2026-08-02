import { ApplicationError } from "@bba/platform-core/application";
import { randomBytes, randomUUID } from "node:crypto";
import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import { buildRequestIdentity, commandIdempotencyKey } from "./context.js";
import { cloneSchema, fastifyPath, loadContract, operations, resolveParameter, type OpenApiContract, type TransportOperation } from "./contract.js";
import { TransportAuthenticationError, TransportError, TransportInfrastructureError, type TransportErrorCode } from "./errors.js";
import type { HttpAdapterDependencies, HttpAdapterOptions, TransportApplicationPorts } from "./types.js";

type CallablePort = Readonly<Record<string, (request: never, context: never) => Promise<unknown>>>;
type JsonRecord = Record<string, unknown>;

const applicationErrorMapping: Readonly<Record<string, readonly [TransportErrorCode, number]>> = {
  VALIDATION_FAILED: ["INVALID_REQUEST", 400],
  INVALID_TRANSACTION_IDENTITY: ["INVALID_TRANSACTION_IDENTITY", 400],
  IDEMPOTENCY_CONFLICT: ["IDEMPOTENCY_CONFLICT", 409],
  NOT_FOUND: ["NOT_FOUND", 404],
  FORBIDDEN_CONTEXT: ["FORBIDDEN", 403],
  CONCURRENCY_CONFLICT: ["CONCURRENCY_CONFLICT", 409],
  APPLICATION_FAILURE: ["APPLICATION_FAILURE", 500]
};

function validateDependencies(dependencies: HttpAdapterDependencies): void {
  if (!dependencies.authentication || !dependencies.authorization) throw new TransportInfrastructureError("Authentication and authorization ports are required");
  const expected = ["mission", "governance", "ai-workforce", "institutional-assets", "knowledge-policy", "workflow", "review", "publication", "connector"] as const;
  for (const context of expected) if (!dependencies.application[context]) throw new TransportInfrastructureError(`Application API port group ${context} is required`);
}

function body(request: FastifyRequest): { readonly data: JsonRecord; readonly meta: { readonly reason: string } } {
  const value = request.body as { readonly data?: unknown; readonly meta?: { readonly reason?: unknown } } | undefined;
  if (!value || value.data === null || typeof value.data !== "object" || Array.isArray(value.data) || typeof value.meta?.reason !== "string") throw new TransportError("INVALID_REQUEST", 400, "Command body is invalid");
  return { data: value.data as JsonRecord, meta: { reason: value.meta.reason } };
}

function pathTarget(request: FastifyRequest): string | undefined {
  const values = Object.values((request.params ?? {}) as JsonRecord);
  const candidate = values.find((value): value is string => typeof value === "string");
  return candidate;
}

function responseMeta(identity: { readonly requestId: string; readonly correlationId: string; readonly traceId: string }): JsonRecord {
  return { requestId: identity.requestId, correlationId: identity.correlationId, traceId: identity.traceId };
}

function routeSchema(contract: OpenApiContract, descriptor: TransportOperation): JsonRecord {
  const parameters = (descriptor.operation.parameters ?? []).map((value) => resolveParameter(contract, value));
  const pathProperties: JsonRecord = {};
  const pathRequired: string[] = [];
  const headerProperties: JsonRecord = { authorization: { type: "string", minLength: 8, maxLength: 8192 } };
  const headerRequired: string[] = [];
  for (const parameter of parameters) {
    const name = parameter.name as string;
    if (parameter.in === "path") { pathProperties[name] = cloneSchema(parameter.schema); pathRequired.push(name); }
    if (parameter.in === "header") { const key = name.toLowerCase(); headerProperties[key] = cloneSchema(parameter.schema); if (parameter.required === true) headerRequired.push(key); }
  }
  const responses: JsonRecord = {};
  for (const [status, response] of Object.entries(descriptor.operation.responses)) {
    const schema = (response as { readonly content?: Readonly<Record<string, { readonly schema?: unknown }>> }).content?.["application/json"]?.schema;
    if (schema === undefined) throw new TransportInfrastructureError(`Response schema missing for ${descriptor.operationId} ${status}`);
    responses[status] = cloneSchema(schema);
  }
  const requestSchema = (descriptor.operation.requestBody as { readonly content?: Readonly<Record<string, { readonly schema?: unknown }>> } | undefined)?.content?.["application/json"]?.schema;
  return {
    headers: { type: "object", required: headerRequired, properties: headerProperties },
    ...(pathRequired.length === 0 ? {} : { params: { type: "object", additionalProperties: false, required: pathRequired, properties: pathProperties } }),
    ...(requestSchema === undefined ? {} : { body: cloneSchema(requestSchema) }),
    response: responses
  };
}

function publicError(error: unknown): TransportError {
  if (error instanceof TransportError) return error;
  if (error instanceof ApplicationError) {
    const mapped = applicationErrorMapping[error.code] ?? ["APPLICATION_FAILURE", 500];
    return new TransportError(mapped[0], mapped[1], mapped[1] === 500 ? "Application request failed" : error.message, mapped[1] === 500 ? {} : error.details, { cause: error });
  }
  const fastifyError = error as { readonly validation?: unknown };
  if (fastifyError?.validation !== undefined) return new TransportError("INVALID_REQUEST", 400, "Request does not match the public HTTP contract");
  return new TransportError("INTERNAL_FAILURE", 500, "Internal request failure", {}, { cause: error });
}

function docs(contract: OpenApiContract): string {
  const rows = [...operations(contract)].sort((a, b) => a.operationId.localeCompare(b.operationId)).map((operation) => `<tr><td>${operation.method}</td><td><code>${operation.path}</code></td><td>${operation.operationId}</td></tr>`).join("");
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>BBA Platform API v1</title><style>body{font:14px system-ui;margin:2rem;max-width:1100px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:.5rem;text-align:left}</style><h1>BBA Platform API v1</h1><p><a href="/openapi/v1.json">OpenAPI 3.1 contract</a></p><table><thead><tr><th>Method</th><th>Path</th><th>operationId</th></tr></thead><tbody>${rows}</tbody></table></html>`;
}

export async function buildHttpAdapter(dependencies: HttpAdapterDependencies, options: HttpAdapterOptions = {}): Promise<FastifyInstance> {
  validateDependencies(dependencies);
  const contract = await loadContract(options.contractPath);
  const descriptors = operations(contract);
  if (descriptors.length !== 74) throw new TransportInfrastructureError(`Expected 74 executable operations, found ${descriptors.length}`);
  const app = Fastify({ logger: false, genReqId: () => randomUUID() });
  for (const [name, schema] of Object.entries(contract.components.schemas)) app.addSchema({ ...cloneSchema(schema) as JsonRecord, $id: name });

  app.setErrorHandler((error, request, reply) => {
    const mapped = publicError(error);
    const requestId = request.id;
    const correlationHeader = request.headers["x-correlation-id"];
    const correlationId = typeof correlationHeader === "string" ? correlationHeader : requestId;
    const traceparent = request.headers.traceparent;
    const traceId = typeof traceparent === "string" && /^[0-9a-f]{2}-([0-9a-f]{32})-/u.test(traceparent) ? traceparent.slice(3, 35) : randomBytes(16).toString("hex");
    dependencies.observability?.requestFailed?.({ requestId, correlationId, traceId, errorCode: mapped.code, statusCode: mapped.statusCode });
    void reply.header("X-Request-Id", requestId).header("X-Correlation-Id", correlationId).code(mapped.statusCode).send({ error: { code: mapped.code, message: mapped.message, ...(Object.keys(mapped.details).length === 0 ? {} : { details: mapped.details }), requestId, correlationId, traceId } });
  });

  app.get("/health", { schema: { response: { 200: { type: "object", additionalProperties: false, required: ["data", "meta"], properties: { data: { type: "object", additionalProperties: false, required: ["status"], properties: { status: { type: "string", const: "alive" } } }, meta: { type: "object", additionalProperties: false, required: ["requestId"], properties: { requestId: { type: "string" } } } } } } } }, async (request, reply) => reply.header("X-Request-Id", request.id).send({ data: { status: "alive" }, meta: { requestId: request.id } }));
  if (options.exposeReadiness === true) app.get("/ready", { schema: { response: { 200: { type: "object", additionalProperties: false, required: ["data", "meta"], properties: { data: { type: "object", additionalProperties: false, required: ["status"], properties: { status: { type: "string", const: "ready" } } }, meta: { type: "object", additionalProperties: false, required: ["requestId"], properties: { requestId: { type: "string" } } } } } } } }, async (request, reply) => reply.header("X-Request-Id", request.id).send({ data: { status: "ready" }, meta: { requestId: request.id } }));
  if (options.exposeOpenApi === true) app.get("/openapi/v1.json", async (_request, reply) => reply.type("application/json").send(contract));
  if (options.exposeDocs === true) app.get("/docs", async (_request, reply) => reply.type("text/html; charset=utf-8").send(docs(contract)));

  for (const descriptor of descriptors) {
    app.route({
      method: descriptor.method as "GET" | "POST",
      url: fastifyPath(descriptor.path),
      schema: routeSchema(contract, descriptor),
      handler: async (request, reply) => {
        const targetId = pathTarget(request);
        const target = { resourceType: descriptor.responseSchema.replace(/Dto$/u, ""), ...(targetId === undefined ? {} : { resourceId: targetId }) };
        const identity = await buildRequestIdentity(request, descriptor.operationId, dependencies, target);
        dependencies.observability?.requestStarted?.(identity);
        const port = dependencies.application[descriptor.boundedContext] as unknown as CallablePort;
        const method = port[descriptor.applicationMethod];
        if (typeof method !== "function") throw new TransportInfrastructureError(`Application method ${descriptor.boundedContext}.${descriptor.applicationMethod} is not composed`);
        let result: unknown;
        if (descriptor.applicationKind === "command") {
          const commandBody = body(request);
          const command = { idempotencyKey: commandIdempotencyKey(request), reason: commandBody.meta.reason, ...(targetId === undefined ? {} : { targetId }), payload: commandBody.data };
          const context = { tenantId: identity.tenantId, actor: { reference: identity.principal.actorReference }, correlationId: identity.correlationId, ...(identity.causationId === undefined ? {} : { causationId: identity.causationId }) };
          result = await method.call(port, command as never, context as never);
        } else {
          const query = { ...(targetId === undefined ? {} : { targetId }), filters: request.query as JsonRecord };
          const context = { tenantId: identity.tenantId, actor: { reference: identity.principal.actorReference }, correlationId: identity.correlationId };
          result = await method.call(port, query as never, context as never);
          if (result === null) throw new TransportError("NOT_FOUND", 404, "Resource not found");
        }
        const status = descriptor.applicationKind === "command" && descriptor.operation.responses["201"] !== undefined ? 201 : 200;
        dependencies.observability?.requestCompleted?.({ ...identity, statusCode: status });
        return reply.header("X-Request-Id", identity.requestId).header("X-Correlation-Id", identity.correlationId).code(status).send({ data: result, meta: responseMeta(identity) });
      }
    });
  }
  await app.ready();
  return app;
}
