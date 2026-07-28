import { assertCanonicalTimestamp } from "../common/timestamps.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { Clock } from "./Clock.js";

export class FakeClock implements Clock {
  private currentTimestamp: string;

  public constructor(initialTimestamp = "2026-01-01T00:00:00.000Z") {
    this.currentTimestamp = assertCanonicalTimestamp(initialTimestamp, "initialTimestamp");
  }

  public now(): string {
    return this.currentTimestamp;
  }

  public set(timestamp: string): void {
    this.currentTimestamp = assertCanonicalTimestamp(timestamp, "timestamp");
  }

  public advance(milliseconds: number): string {
    if (!Number.isSafeInteger(milliseconds)) {
      throw new ValidationError("FakeClock advance must be a safe integer", { milliseconds: String(milliseconds) });
    }
    this.currentTimestamp = new Date(Date.parse(this.currentTimestamp) + milliseconds).toISOString();
    return this.currentTimestamp;
  }
}
