import { createBbaClient, type Client } from "@bba/api-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { createBbaQueryClient } from "../client/query-client.js";
import { AgencyClient } from "../agency/client.js";
import type { AuthAdapter, CorrelationIdProvider, SdkRuntimeState, WorkspaceAdapter } from "./contracts.js";

export interface ReadySdkRuntime {
  readonly client: Client;
  readonly agency: AgencyClient;
  readonly tenantId: string;
}

interface BbaSdkContextValue {
  readonly state: SdkRuntimeState;
  readonly ready: ReadySdkRuntime | null;
}

const BbaSdkContext = createContext<BbaSdkContextValue | null>(null);

export interface BbaSdkProviderProps {
  readonly baseUrl: string;
  readonly auth: AuthAdapter;
  readonly workspace: WorkspaceAdapter;
  readonly correlationIds: CorrelationIdProvider;
  readonly children: ReactNode;
  readonly fetch?: typeof globalThis.fetch;
}

export function BbaSdkProvider({ baseUrl, auth, workspace, correlationIds, children, fetch }: BbaSdkProviderProps) {
  const queryClient = useMemo(createBbaQueryClient, []);
  const [value, setValue] = useState<BbaSdkContextValue>({ state: { status: "LOADING" }, ready: null });
  useEffect(() => {
    let active = true;
    Promise.all([auth.getAccessToken(), auth.getPrincipal(), workspace.getTenantId()]).then(([token, principal, tenantId]) => {
      if (!active) return;
      if (!baseUrl.trim() || token === undefined || principal === undefined || tenantId === undefined) {
        setValue({ state: { status: "CONFIGURATION_MISSING", message: "API base URL, token, principal e tenant são obrigatórios para a sessão de desenvolvimento." }, ready: null }); return;
      }
      const client = createBbaClient({ baseUrl, getAccessToken: () => auth.getAccessToken(), getTenantId: () => tenantId, getCorrelationId: () => correlationIds.createCorrelationId(), ...(fetch === undefined ? {} : { fetch }) });
      const agency = new AgencyClient({ baseUrl, getAccessToken: () => auth.getAccessToken(), getTenantId: () => tenantId, getCorrelationId: () => correlationIds.createCorrelationId(), ...(fetch === undefined ? {} : { fetch }) });
      setValue({ state: { status: "READY", tenantId, principal }, ready: { client, agency, tenantId } });
    }).catch(() => { if (active) setValue({ state: { status: "SESSION_ERROR", message: "O adapter de sessão ou workspace falhou." }, ready: null }); });
    return () => { active = false; };
  }, [auth, baseUrl, correlationIds, fetch, workspace]);
  return <BbaSdkContext.Provider value={value}><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></BbaSdkContext.Provider>;
}

export function useBbaSdkRuntime(): BbaSdkContextValue {
  const value = useContext(BbaSdkContext);
  if (value === null) throw new Error("useBbaSdkRuntime must be used inside BbaSdkProvider");
  return value;
}

export function useBbaSdkState(): SdkRuntimeState { return useBbaSdkRuntime().state; }
