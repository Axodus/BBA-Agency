import { assertCanonicalTimestamp } from "../common/timestamps.js";
import type { Clock } from "./Clock.js";

export class SystemClock implements Clock {
  public now(): string {
    return assertCanonicalTimestamp(new Date().toISOString(), "now");
  }
}
