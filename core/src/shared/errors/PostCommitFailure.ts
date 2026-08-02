import { DomainError } from "./DomainError.js";

export class PostCommitFailure extends DomainError {
  public constructor(message: string, details: Record<string, string> = {}) { super("post_commit_failure", message, details); }
}
