import type { JsonObject } from "../../../shared/common/serialization.js";
import { Entity } from "../../../shared/entity/Entity.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { AssignmentId, AuthorityId, TenantId } from "../../../shared/identity/index.js";
import { AssignmentPeriod } from "./AssignmentPeriod.js";
import { AssignmentStatus, type AssignmentStatusType } from "./AssignmentStatus.js";
import { AuthorityScope } from "./AuthorityScope.js";
import { HumanActorReference } from "./HumanActorReference.js";

export interface AssignmentSnapshot {
  readonly assignmentId: string;
  readonly tenantId: string;
  readonly authorityId: string;
  readonly delegateReference: string;
  readonly scope: JsonObject;
  readonly period: { readonly startsAt: string; readonly endsAt: string };
  readonly status: AssignmentStatusType;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export class Assignment extends Entity<AssignmentId> {
  private readonly assignmentTenantId: TenantId;
  private readonly owningAuthorityId: AuthorityId;
  private readonly delegate: HumanActorReference;
  private readonly assignmentScope: AuthorityScope;
  private readonly assignmentPeriod: AssignmentPeriod;
  private assignmentStatus: AssignmentStatusType;
  private readonly assignmentCreatedAt: string;
  private assignmentUpdatedAt: string;

  private constructor(
    id: AssignmentId,
    tenantId: TenantId,
    authorityId: AuthorityId,
    delegateReference: HumanActorReference,
    scope: AuthorityScope,
    period: AssignmentPeriod,
    status: AssignmentStatusType,
    createdAt: string,
    updatedAt: string
  ) {
    super(id);
    this.assignmentTenantId = tenantId;
    this.owningAuthorityId = authorityId;
    this.delegate = delegateReference;
    this.assignmentScope = scope;
    this.assignmentPeriod = period;
    this.assignmentStatus = status;
    this.assignmentCreatedAt = createdAt;
    this.assignmentUpdatedAt = updatedAt;
    Object.defineProperty(this, "assignmentTenantId", { writable: false, configurable: false });
    Object.defineProperty(this, "owningAuthorityId", { writable: false, configurable: false });
    Object.defineProperty(this, "delegate", { writable: false, configurable: false });
    Object.defineProperty(this, "assignmentScope", { writable: false, configurable: false });
    Object.defineProperty(this, "assignmentPeriod", { writable: false, configurable: false });
    Object.defineProperty(this, "assignmentCreatedAt", { writable: false, configurable: false });
  }

  public static create(props: {
    readonly id: AssignmentId; readonly tenantId: TenantId; readonly authorityId: AuthorityId;
    readonly delegateReference: HumanActorReference; readonly scope: AuthorityScope;
    readonly period: AssignmentPeriod; readonly occurredAt: string;
  }): Assignment {
    return new Assignment(props.id, props.tenantId, props.authorityId, props.delegateReference, props.scope,
      props.period, AssignmentStatus.ACTIVE, props.occurredAt, props.occurredAt);
  }

  public static fromSnapshot(snapshot: AssignmentSnapshot): Assignment {
    return new Assignment(
      AssignmentId.from(snapshot.assignmentId), TenantId.from(snapshot.tenantId), AuthorityId.from(snapshot.authorityId),
      HumanActorReference.from(snapshot.delegateReference),
      new AuthorityScope({ purpose: String(snapshot.scope.purpose), actions: snapshot.scope.actions as string[], ...(Array.isArray(snapshot.scope.constraints) ? { constraints: snapshot.scope.constraints as string[] } : {}) }),
      new AssignmentPeriod(snapshot.period), snapshot.status, snapshot.createdAt, snapshot.updatedAt
    );
  }

  public get tenantId(): TenantId { return this.assignmentTenantId; }
  public get authorityId(): AuthorityId { return this.owningAuthorityId; }
  public get delegateReference(): HumanActorReference { return this.delegate; }
  public get scope(): AuthorityScope { return this.assignmentScope; }
  public get period(): AssignmentPeriod { return this.assignmentPeriod; }
  public get status(): AssignmentStatusType { return this.assignmentStatus; }
  public get createdAt(): string { return this.assignmentCreatedAt; }
  public get updatedAt(): string { return this.assignmentUpdatedAt; }
  public get isActive(): boolean { return this.assignmentStatus === AssignmentStatus.ACTIVE; }

  public revoke(occurredAt: string): void {
    if (!this.isActive) throw new InvariantViolation("Only an active Assignment can be revoked");
    this.assignmentStatus = AssignmentStatus.REVOKED;
    this.assignmentUpdatedAt = occurredAt;
  }

  public expire(occurredAt: string): void {
    if (!this.isActive) throw new InvariantViolation("Only an active Assignment can expire");
    this.assignmentStatus = AssignmentStatus.EXPIRED;
    this.assignmentUpdatedAt = occurredAt;
  }

  public toSnapshot(): AssignmentSnapshot {
    return {
      assignmentId: this.id.toString(), tenantId: this.tenantId.toString(), authorityId: this.authorityId.toString(),
      delegateReference: this.delegateReference.toString(), scope: this.scope.toJSON(), period: this.period.toJSON(),
      status: this.status, createdAt: this.createdAt, updatedAt: this.updatedAt
    };
  }
}
