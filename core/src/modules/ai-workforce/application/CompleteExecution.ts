import type { ExecutionRepository } from "../ports/ExecutionRepository.js";
import type { CompleteExecutionCommand } from "../domain/WorkforceCommands.js";
import type { Execution } from "../domain/Execution.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { ExecutionId } from "../../../shared/identity/ExecutionId.js";

export async function completeExecution(repository: ExecutionRepository, tenantId: TenantId, executionId: ExecutionId, command: CompleteExecutionCommand): Promise<Execution> { const execution = await repository.findById(tenantId, executionId); if (execution === null) throw new Error("Execution not found"); const expectedVersion = execution.version; execution.complete(command); await repository.save(execution, expectedVersion); return execution; }
