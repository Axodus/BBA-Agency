import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export type ApplicationKind = "command" | "query";
export interface OpenApiOperation {
  readonly operationId: string;
  readonly parameters?: readonly unknown[];
  readonly requestBody?: unknown;
  readonly responses: Readonly<Record<string, unknown>>;
  readonly [key: `x-bba-${string}`]: unknown;
}
export interface OpenApiContract {
  readonly openapi: string;
  readonly paths: Readonly<Record<string, Readonly<Record<string, OpenApiOperation>>>>;
  readonly components: {
    readonly schemas: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
    readonly parameters: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  };
}

export interface TransportOperation {
  readonly operationId: string;
  readonly method: string;
  readonly path: string;
  readonly boundedContext: keyof import("./types.js").TransportApplicationPorts;
  readonly applicationMethod: string;
  readonly applicationKind: ApplicationKind;
  readonly responseSchema: string;
  readonly operation: OpenApiOperation;
}

export function defaultContractPath(): string {
  return resolve(process.cwd(), "contracts/openapi/v1/openapi.yaml");
}

export async function loadContract(path = defaultContractPath()): Promise<OpenApiContract> {
  const parsed = JSON.parse(await readFile(path, "utf8")) as OpenApiContract;
  if (parsed.openapi !== "3.1.0") throw new Error("The canonical HTTP contract must use OpenAPI 3.1.0");
  return parsed;
}

export function operations(contract: OpenApiContract): readonly TransportOperation[] {
  const result: TransportOperation[] = [];
  for (const [path, pathItem] of Object.entries(contract.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (typeof operation.operationId !== "string") continue;
      result.push({
        operationId: operation.operationId,
        method: method.toUpperCase(),
        path,
        boundedContext: operation["x-bba-bounded-context"] as TransportOperation["boundedContext"],
        applicationMethod: operation["x-bba-application-method"] as string,
        applicationKind: operation["x-bba-application-kind"] as ApplicationKind,
        responseSchema: operation["x-bba-response-schema"] as string,
        operation
      });
    }
  }
  return result;
}

export function fastifyPath(path: string): string {
  return path
    .replace(/:/gu, "__BBA_COLON__")
    .replace(/\{([^}]+)\}__BBA_COLON__/gu, ":$1(^[^:]+)__BBA_COLON__")
    .replace(/\{([^}]+)\}/gu, ":$1")
    .replace(/__BBA_COLON__/gu, "::");
}

export function cloneSchema(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cloneSchema);
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      result[key] = key === "$ref" && typeof item === "string" && item.startsWith("#/components/schemas/")
        ? `${item.slice("#/components/schemas/".length)}#`
        : cloneSchema(item);
    }
    return result;
  }
  return value;
}

export function resolveParameter(contract: OpenApiContract, value: unknown): Readonly<Record<string, unknown>> {
  if (value === null || typeof value !== "object") throw new Error("Invalid OpenAPI parameter");
  const parameter = value as Readonly<Record<string, unknown>>;
  const reference = parameter.$ref;
  if (typeof reference !== "string") return parameter;
  const name = reference.slice("#/components/parameters/".length);
  const resolved = contract.components.parameters[name];
  if (!resolved) throw new Error(`Unknown OpenAPI parameter ${reference}`);
  return resolved;
}
