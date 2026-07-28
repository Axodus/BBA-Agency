export interface SessionPrincipal {
  readonly subject: string;
  readonly actorReference: string;
  readonly displayName?: string;
}

export interface AuthAdapter {
  getAccessToken(): Promise<string | undefined>;
  getPrincipal(): Promise<SessionPrincipal | undefined>;
}

export interface WorkspaceAdapter {
  getTenantId(): Promise<string | undefined>;
}

export interface CorrelationIdProvider {
  createCorrelationId(): string;
}

export type SdkRuntimeState =
  | { readonly status: "LOADING" }
  | { readonly status: "CONFIGURATION_MISSING"; readonly message: string }
  | { readonly status: "SESSION_ERROR"; readonly message: string }
  | { readonly status: "READY"; readonly tenantId: string; readonly principal: SessionPrincipal };
