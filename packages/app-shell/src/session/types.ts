export interface SessionSummary {
  readonly subject: string;
  readonly actorReference: string;
  readonly displayName?: string;
}

export type ShellRuntimeState =
  | { readonly status: "LOADING" }
  | { readonly status: "CONFIGURATION_MISSING"; readonly message: string }
  | { readonly status: "SESSION_ERROR"; readonly message: string }
  | { readonly status: "READY"; readonly session: SessionSummary; readonly tenantId: string };
