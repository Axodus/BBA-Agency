import { missionGetMission } from "@bba/api-client";
import { useQuery } from "@tanstack/react-query";
import { BbaSdkError, normalizeSdkError } from "../errors/BbaSdkError.js";
import { useBbaSdkRuntime } from "../provider/BbaSdkProvider.js";
import { missionKeys } from "../query-keys/mission-keys.js";

export interface MissionView { readonly id: string; readonly tenantId: string; readonly version: number; readonly status: string | null; }
export interface MissionQueryOptions { readonly enabled?: boolean; }
export interface MissionQueryResult { readonly data: MissionView | undefined; readonly error: BbaSdkError | undefined; readonly isPending: boolean; readonly isFetching: boolean; refetch(): void; }

export function useMissionQuery(missionId: string, options: MissionQueryOptions = {}): MissionQueryResult {
  const runtime = useBbaSdkRuntime();
  const tenantId = runtime.ready?.tenantId ?? "unresolved";
  const query = useQuery({
    queryKey: missionKeys.detail(tenantId, missionId),
    enabled: runtime.ready !== null && missionId.trim().length > 0 && (options.enabled ?? true),
    queryFn: async (): Promise<MissionView> => {
      if (runtime.ready === null) throw new BbaSdkError("CONFIGURATION_MISSING", "O SDK ainda não está configurado.", undefined, undefined, undefined);
      const response = await missionGetMission({ client: runtime.ready.client, path: { missionId }, headers: { "X-Tenant-Id": runtime.ready.tenantId } });
      if (response.error !== undefined) throw normalizeSdkError(response.response?.status, response.error);
      const mission = response.data.data;
      return { id: mission.id, tenantId: mission.tenantId, version: mission.version, status: mission.status ?? null };
    }
  });
  return { data: query.data, error: query.error instanceof BbaSdkError ? query.error : query.error === null ? undefined : normalizeSdkError(undefined, query.error), isPending: query.isPending, isFetching: query.isFetching, refetch: () => { void query.refetch(); } };
}
