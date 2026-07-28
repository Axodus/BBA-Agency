import { randomBytes, randomUUID } from "node:crypto";
import type { FastifyRequest } from "fastify";
import { TransportAuthenticationError, TransportError } from "./errors.js";
import type { HttpAdapterDependencies, TransportObservation, TransportPrincipal } from "./types.js";

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;
const TRACEPARENT = /^[0-9a-f]{2}-([0-9a-f]{32})-[0-9a-f]{16}-[0-9a-f]{2}$/u;

function header(request: FastifyRequest, name: string): string | undefined {
  const value = request.headers[name.toLowerCase()];
  return typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined;
}

function validId(value: string | undefined, field: string, required: boolean): string | undefined {
  if (value === undefined && !required) return undefined;
  if (value === undefined || !ID.test(value) || /[\r\n]/u.test(value)) throw new TransportError("INVALID_REQUEST", 400, `${field} is invalid`, { field });
  return value;
}

export interface RequestIdentity extends TransportObservation {
  readonly principal: TransportPrincipal;
  readonly tenantId: string;
  readonly causationId?: string;
}

export async function buildRequestIdentity(request: FastifyRequest, operationId: string, dependencies: HttpAdapterDependencies, target?: { readonly resourceType: string; readonly resourceId?: string }): Promise<RequestIdentity> {
  const requestId = request.id;
  const authorization = header(request, "authorization");
  if (!authorization?.startsWith("Bearer ") || authorization.length <= 7) throw new TransportAuthenticationError();
  const tenantId = validId(header(request, "x-tenant-id"), "X-Tenant-Id", true) as string;
  const correlationId = validId(header(request, "x-correlation-id"), "X-Correlation-Id", false) ?? randomUUID();
  const causationId = validId(header(request, "x-causation-id"), "X-Causation-Id", false);
  const traceparent = header(request, "traceparent");
  const match = traceparent === undefined ? undefined : TRACEPARENT.exec(traceparent);
  if (traceparent !== undefined && match === null) throw new TransportError("INVALID_REQUEST", 400, "traceparent is invalid", { field: "traceparent" });
  const traceId = match?.[1] ?? randomBytes(16).toString("hex");
  const principal = await dependencies.authentication.authenticate({ bearerToken: authorization.slice(7), requestId });
  const actorAssertion = validId(header(request, "x-actor-id"), "X-Actor-Id", false);
  if (actorAssertion !== undefined && actorAssertion !== principal.actorReference) throw new TransportError("FORBIDDEN", 403, "Actor assertion does not match the authenticated principal");
  const authorized = await dependencies.authorization.authorize({ principal, tenantId, operationId, ...(target === undefined ? {} : { target }) });
  if (!authorized) throw new TransportError("FORBIDDEN", 403, "The principal is not authorized for this tenant and operation");
  return { requestId, correlationId, traceId, operationId, tenantId, principal, ...(causationId === undefined ? {} : { causationId }) };
}

export function commandIdempotencyKey(request: FastifyRequest): string {
  const value = header(request, "idempotency-key");
  if (value === undefined || !/^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/u.test(value) || /[\r\n]/u.test(value)) throw new TransportError("INVALID_REQUEST", 400, "Idempotency-Key is invalid", { field: "Idempotency-Key" });
  return value;
}
