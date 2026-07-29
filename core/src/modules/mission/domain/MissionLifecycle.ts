import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { MissionStatus, type MissionStatus as MissionStatusType } from "./MissionStatus.js";

const TRANSITIONS: Readonly<Record<MissionStatusType, readonly MissionStatusType[]>> = Object.freeze({
  [MissionStatus.PROPOSED]: [MissionStatus.AUTHORIZED, MissionStatus.DEFERRED, MissionStatus.REJECTED],
  [MissionStatus.AUTHORIZED]: [MissionStatus.PREPARED, MissionStatus.PAUSED, MissionStatus.STOPPED],
  [MissionStatus.PREPARED]: [MissionStatus.IN_PROGRESS, MissionStatus.PAUSED, MissionStatus.STOPPED],
  [MissionStatus.IN_PROGRESS]: [MissionStatus.UNDER_REVIEW, MissionStatus.PAUSED, MissionStatus.STOPPED],
  [MissionStatus.UNDER_REVIEW]: [MissionStatus.IN_PROGRESS, MissionStatus.OUTCOME_DECISION, MissionStatus.REJECTED, MissionStatus.PAUSED],
  [MissionStatus.OUTCOME_DECISION]: [MissionStatus.CLOSED_WITH_LEARNING, MissionStatus.IN_PROGRESS, MissionStatus.DEFERRED, MissionStatus.STOPPED],
  [MissionStatus.PAUSED]: [MissionStatus.PREPARED, MissionStatus.IN_PROGRESS, MissionStatus.DEFERRED, MissionStatus.STOPPED],
  [MissionStatus.DEFERRED]: [MissionStatus.PROPOSED, MissionStatus.CLOSED_WITH_LEARNING],
  [MissionStatus.REJECTED]: [],
  [MissionStatus.STOPPED]: [],
  [MissionStatus.CLOSED_WITH_LEARNING]: [MissionStatus.PROPOSED]
});

export class MissionLifecycle {
  public static canTransition(from: MissionStatusType, to: MissionStatusType): boolean {
    return TRANSITIONS[from].some((candidate) => candidate === to);
  }

  public static assertTransition(from: MissionStatusType, to: MissionStatusType): void {
    if (!this.canTransition(from, to)) {
      throw new InvariantViolation("Mission lifecycle transition is not allowed", { from, to });
    }
  }

  public static transitionsFrom(status: MissionStatusType): readonly MissionStatusType[] {
    return [...TRANSITIONS[status]];
  }
}
