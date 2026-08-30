import type { AuthAdapter, CorrelationIdProvider, SessionPrincipal, WorkspaceAdapter } from "@bba/sdk-react";

export interface DevSessionConfiguration {
  readonly baseUrl: string;
  readonly accessToken: string;
  readonly tenantId: string;
  readonly subject: string;
  readonly actorReference: string;
}

export function createDevAdapters(configuration: DevSessionConfiguration): { readonly auth: AuthAdapter; readonly workspace: WorkspaceAdapter } {
  const principal: SessionPrincipal = { subject: configuration.subject, actorReference: configuration.actorReference };
  return {
    auth: { getAccessToken: async () => configuration.accessToken, getPrincipal: async () => principal },
    workspace: { getTenantId: async () => configuration.tenantId }
  };
}

export const browserCorrelationIds: CorrelationIdProvider = { createCorrelationId: () => globalThis.crypto.randomUUID() };
