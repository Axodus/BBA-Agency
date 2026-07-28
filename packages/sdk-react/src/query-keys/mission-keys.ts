export const missionKeys = Object.freeze({
  all: (tenantId: string) => ["missions", tenantId] as const,
  detail: (tenantId: string, missionId: string) => [...missionKeys.all(tenantId), "detail", missionId] as const
});
