import assert from "node:assert/strict";
import { test } from "node:test";
import { createWorkflowBindings } from "../../src/application/bindings/WorkflowBindings.js";
import type { WorkflowDependencies } from "../../src/application/bindings/WorkflowBindings.js";

const dependencies = { mission: {}, governance: {}, graph: {}, assets: {}, knowledge: {}, assignments: {} } as WorkflowDependencies;
test("Workflow declares the twelve command and two query bindings", () => { const bindings = createWorkflowBindings(dependencies); assert.deepEqual(Object.keys(bindings).sort(), ["activateWorkflow", "advanceStage", "archiveWorkflow", "cancelWorkflow", "completeWorkflow", "createWorkflow", "failWorkflowExecution", "getWorkflow", "getWorkflowExecution", "pauseWorkflow", "recordTaskFailure", "recordTaskState", "resumeWorkflow", "startWorkflow"]); });
test("Workflow composition rejects missing collaborators", () => { assert.throws(() => createWorkflowBindings({ ...dependencies, governance: undefined } as unknown as WorkflowDependencies), /collaborators are required/u); });
