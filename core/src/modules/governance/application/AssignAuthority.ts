import type { AssignmentReference } from "../../../shared/references/AssignmentReference.js";
import type { AssignAuthorityCommand } from "../domain/GovernanceCommands.js";
import type { AuthorityRepository } from "../ports/AuthorityRepository.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

export class AssignAuthority {
  public constructor(private readonly repository: AuthorityRepository) {}
  public async execute(input: { readonly tenantId: import("../../../shared/identity/TenantId.js").TenantId; readonly authorityId: import("../../../shared/identity/AuthorityId.js").AuthorityId; readonly expectedVersion: import("../../../shared/version/Version.js").Version; readonly command: AssignAuthorityCommand }): Promise<AssignmentReference> {
    const authority = await this.repository.findById(input.tenantId, input.authorityId); if (authority === null) throw new ValidationError("Authority was not found"); const reference = authority.assign(input.command); await this.repository.save(authority, input.expectedVersion); return reference;
  }
}
