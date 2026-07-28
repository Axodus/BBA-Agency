import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";

export class MissionNotFoundError extends InvariantViolation {
  public constructor(missionId: string) {
    super("Mission was not found in the requested Tenant context", { missionId });
  }
}
