import type { ApiRuntimeConfiguration } from "./runtime.js";

export interface ApiEnvironment {
  readonly mongoUri: string;
  readonly port: number;
  readonly runtime: ApiRuntimeConfiguration;
}

export function assertPrivatePreview(value: string | undefined) {
  if (value !== "true") throw new Error("API_PUBLIC_ACTIVATION_BLOCKED");
}

function required(name: string, environment: NodeJS.ProcessEnv) {
  const value = environment[name]?.trim();
  if (!value) throw new Error(`API_CONFIGURATION_MISSING:${name}`);
  return value;
}

function port(environment: NodeJS.ProcessEnv) {
  const value = environment.PORT?.trim() ?? "3000";
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65_535) throw new Error("API_CONFIGURATION_INVALID:PORT");
  return parsed;
}

export function loadApiEnvironment(environment: NodeJS.ProcessEnv = process.env): ApiEnvironment {
  assertPrivatePreview(environment.BBA_API_PRIVATE_PREVIEW);
  return {
    mongoUri: required("MONGODB_URI", environment),
    port: port(environment),
    runtime: {
      accessToken: required("BBA_API_DEV_ACCESS_TOKEN", environment),
      tenantId: required("BBA_API_TENANT_ID", environment),
      subject: required("BBA_API_SUBJECT", environment),
      actorReference: required("BBA_API_ACTOR_REFERENCE", environment),
      allowedOrigins: required("BBA_API_ALLOWED_ORIGINS", environment).split(",").map((origin) => origin.trim()).filter(Boolean)
    }
  };
}
