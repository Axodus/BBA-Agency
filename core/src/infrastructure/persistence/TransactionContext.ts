import { assertCanonicalTimestamp } from "../../shared/common/timestamps.js";
import { ValidationError } from "../../shared/errors/ValidationError.js";
import { TenantId } from "../../shared/identity/TenantId.js";
import { CorrelationId } from "../../shared/common/CorrelationId.js";
import { CausationId } from "../../shared/common/CausationId.js";
import { deepFreeze, type JsonObject } from "../../shared/common/serialization.js";
import type { TransactionContextProps } from "./PersistenceTypes.js";

export class TransactionContext {
  private readonly props: TransactionContextProps;
  public constructor(props: TransactionContextProps) {
    const transactionId = props.transactionId.trim(); const actor = props.actor.trim();
    if (transactionId.length === 0 || actor.length === 0) throw new ValidationError("TransactionContext transactionId and actor are required");
    this.props = deepFreeze({ transactionId, tenantId: TenantId.from(props.tenantId).toString(), actor, correlationId: CorrelationId.from(props.correlationId).toString(), ...(props.causationId === undefined ? {} : { causationId: CausationId.from(props.causationId).toString() }), startedAt: assertCanonicalTimestamp(props.startedAt, "startedAt") });
    Object.freeze(this);
  }
  public get transactionId(): string { return this.props.transactionId; }
  public get tenantId(): string { return this.props.tenantId; }
  public get actor(): string { return this.props.actor; }
  public get correlationId(): string { return this.props.correlationId; }
  public get causationId(): string | undefined { return this.props.causationId; }
  public get startedAt(): string { return this.props.startedAt; }
  public toJSON(): JsonObject { return { ...this.props }; }
}
