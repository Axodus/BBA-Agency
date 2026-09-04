export * from "./generated/index.js";
export type { Client } from "./generated/client/index.js";

import { createClient } from "./generated/client/index.js";
import type { Client } from "./generated/client/index.js";

export interface ClientConfiguration {
  readonly baseUrl: string;
  getAccessToken(): Promise<string | undefined>;
  getTenantId(): string | undefined;
  getCorrelationId?(): string | undefined;
  readonly fetch?: typeof globalThis.fetch;
}

/**
 * Creates an isolated client instance suitable for either standalone BBA or an
 * Axodus gateway. Pass the returned client through each generated SDK call's
 * `client` option; no global mutable configuration is required.
 */
export function createBbaClient(configuration: ClientConfiguration): Client {
  const client = createClient({
    baseUrl: configuration.baseUrl,
    auth: () => configuration.getAccessToken(),
    ...(configuration.fetch === undefined ? {} : { fetch: configuration.fetch })
  });
  client.interceptors.request.use(async (request) => {
    const headers = new Headers(request.headers);
    const tenantId = configuration.getTenantId();
    if (tenantId !== undefined) headers.set("X-Tenant-Id", tenantId);
    const correlationId = configuration.getCorrelationId?.();
    if (correlationId !== undefined && !headers.has("X-Correlation-Id")) headers.set("X-Correlation-Id", correlationId);
    return new Request(request, { headers });
  });
  return client;
}
