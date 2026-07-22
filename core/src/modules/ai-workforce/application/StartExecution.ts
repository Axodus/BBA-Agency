import type { ExecutionRepository } from "../ports/ExecutionRepository.js";
import { Execution } from "../domain/Execution.js";
import type { StartExecutionCommand } from "../domain/WorkforceCommands.js";
import { Version } from "../../../shared/version/Version.js";

export async function startExecution(repository: ExecutionRepository, command: StartExecutionCommand): Promise<Execution> { const execution = Execution.start(command); await repository.save(execution, Version.initial()); return execution; }
