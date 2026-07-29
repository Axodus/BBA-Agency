import type { JsonObject } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { TenantId } from "../../../shared/identity/index.js";
import { AuthorityReference, DecisionReference, InstitutionalActorReference } from "../../../shared/references/index.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export class PolicyAuthorityContext extends ValueObject<JsonObject> {
  public readonly ownerReference: InstitutionalActorReference; public readonly stewardReference: InstitutionalActorReference; public readonly authorityReference: AuthorityReference; public readonly decisionReference: DecisionReference;
  public constructor(props: { readonly ownerReference: InstitutionalActorReference; readonly stewardReference: InstitutionalActorReference; readonly authorityReference: AuthorityReference; readonly decisionReference: DecisionReference }) {
    const tenantId = props.ownerReference.tenantId;
    for (const reference of [props.stewardReference, props.authorityReference, props.decisionReference]) if (!reference.tenantId.equals(tenantId)) throw new InvariantViolation("PolicyAuthorityContext references must share a Tenant");
    super({ ownerReference: props.ownerReference.toJSON(), stewardReference: props.stewardReference.toJSON(), authorityReference: props.authorityReference.toJSON(), decisionReference: props.decisionReference.toJSON() });
    this.ownerReference = props.ownerReference; this.stewardReference = props.stewardReference; this.authorityReference = props.authorityReference; this.decisionReference = props.decisionReference; Object.freeze(this);
  }
  public get tenantId(): TenantId { return this.ownerReference.tenantId; }
  public static fromJSON(value: JsonObject): PolicyAuthorityContext {
    return new PolicyAuthorityContext({
      ownerReference: InstitutionalActorReference.fromJSON(value.ownerReference as { reference: string; tenantId: string }),
      stewardReference: InstitutionalActorReference.fromJSON(value.stewardReference as { reference: string; tenantId: string }),
      authorityReference: AuthorityReference.fromJSON(value.authorityReference as { id: string; tenantId: string }),
      decisionReference: DecisionReference.fromJSON(value.decisionReference as { id: string; tenantId: string })
    });
  }
}
