export const MissionStatus = {
  PROPOSED: "PROPOSED",
  AUTHORIZED: "AUTHORIZED",
  PREPARED: "PREPARED",
  IN_PROGRESS: "IN_PROGRESS",
  UNDER_REVIEW: "UNDER_REVIEW",
  OUTCOME_DECISION: "OUTCOME_DECISION",
  PAUSED: "PAUSED",
  DEFERRED: "DEFERRED",
  REJECTED: "REJECTED",
  STOPPED: "STOPPED",
  CLOSED_WITH_LEARNING: "CLOSED_WITH_LEARNING"
} as const;

export type MissionStatus = typeof MissionStatus[keyof typeof MissionStatus];

export const MISSION_STATUSES: readonly MissionStatus[] = Object.freeze(
  Object.values(MissionStatus)
);

export const TERMINAL_MISSION_STATUSES: readonly MissionStatus[] = Object.freeze([
  MissionStatus.REJECTED,
  MissionStatus.STOPPED,
  MissionStatus.CLOSED_WITH_LEARNING
]);

export function isMissionStatus(value: string): value is MissionStatus {
  return MISSION_STATUSES.some((status) => status === value);
}
