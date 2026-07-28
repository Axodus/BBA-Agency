import type { ConnectorExecutionReference } from "../../../shared/references/index.js";
import type { ConnectorRequestMetadata } from "../domain/ConnectorValues.js";

export interface ConnectorExecutionRequestPort { requestExecution(input: { readonly execution: ConnectorExecutionReference; readonly request: ConnectorRequestMetadata }): Promise<void>; }
