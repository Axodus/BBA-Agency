import { Authority } from "../domain/Authority.js";
import type { CreateAuthorityCommand } from "../domain/GovernanceCommands.js";
import type { AuthorityRepository } from "../ports/AuthorityRepository.js";
import { Version } from "../../../shared/version/Version.js";

export class CreateAuthority {
  public constructor(private readonly repository: AuthorityRepository) {}
  public async execute(command: CreateAuthorityCommand): Promise<Authority> { const authority = Authority.create(command); await this.repository.save(authority, Version.initial()); return authority; }
}
