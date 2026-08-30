import { zodResolver } from "@hookform/resolvers/zod";
import {
  useWorkflowActivateWorkflowCommand,
  useWorkflowAdvanceStageCommand,
  useWorkflowArchiveWorkflowCommand,
  useWorkflowCancelWorkflowCommand,
  useWorkflowCompleteWorkflowCommand,
  useWorkflowCreateWorkflowCommand,
  useWorkflowFailWorkflowExecutionCommand,
  useWorkflowGetWorkflowExecutionQuery,
  useWorkflowGetWorkflowQuery,
  useWorkflowPauseWorkflowCommand,
  useWorkflowRecordTaskFailureCommand,
  useWorkflowRecordTaskStateCommand,
  useWorkflowResumeWorkflowCommand,
  useWorkflowStartWorkflowCommand,
} from "@bba/sdk-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Field,
  Input,
  Link,
  Select,
  Textarea,
} from "@bba/ui";
import { useMemo, useState, type FormEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import {
  auditDefaults,
  mapEvidence,
  mapLineage,
  reasonSchema,
} from "../missions/operations/common.js";
import { CommandReceiptView } from "../shared/CommandReceiptView.js";
import { OperationSubmitButton } from "../shared/OperationSubmitButton.js";
import {
  EvidenceLineageSection,
  ReasonField,
  TimestampField,
} from "../shared/forms/institutional-fields.js";
import { canonicalTimestamp } from "../shared/forms/form-utils.js";
const operations = [
  "workflowCreateWorkflow",
  "workflowActivateWorkflow",
  "workflowArchiveWorkflow",
  "workflowStartWorkflow",
  "workflowAdvanceStage",
  "workflowPauseWorkflow",
  "workflowResumeWorkflow",
  "workflowRecordTaskState",
  "workflowRecordTaskFailure",
  "workflowCompleteWorkflow",
  "workflowCancelWorkflow",
  "workflowFailWorkflowExecution",
] as const;
type Operation = (typeof operations)[number];
const labels: Record<Operation, string> = {
  workflowCreateWorkflow: "Create Workflow",
  workflowActivateWorkflow: "Activate Workflow",
  workflowArchiveWorkflow: "Archive Workflow",
  workflowStartWorkflow: "Start Workflow",
  workflowAdvanceStage: "Advance Stage",
  workflowPauseWorkflow: "Pause Workflow",
  workflowResumeWorkflow: "Resume Workflow",
  workflowRecordTaskState: "Record Task State",
  workflowRecordTaskFailure: "Record Task Failure",
  workflowCompleteWorkflow: "Complete Workflow",
  workflowCancelWorkflow: "Cancel Workflow",
  workflowFailWorkflowExecution: "Fail Workflow Execution",
};
const schema = z.object({
  reason: reasonSchema,
  workflowId: z.string(),
  executionId: z.string(),
  missionId: z.string(),
  name: z.string(),
  summary: z.string(),
  stageId: z.string(),
  stageName: z.string(),
  taskId: z.string(),
  taskName: z.string(),
  taskKind: z.enum([
    "COORDINATION",
    "GOVERNANCE_CHECKPOINT",
    "WORK_ASSIGNMENT",
    "ASSET_CHECK",
    "KNOWLEDGE_CHECK",
  ]),
  nextStageId: z.string(),
  disposition: z.string(),
  observedState: z.string(),
  failure: z.string(),
  workAssignmentId: z.string(),
  occurredAt: z.string().min(1),
  evidence: z
    .array(
      z.object({
        evidenceId: z.string().min(1),
        source: z.string().min(1),
        type: z.string().min(1),
        capturedAt: z.string().min(1),
      }),
    )
    .min(1),
  lineage: z
    .array(
      z.object({
        sourceId: z.string().min(1),
        targetId: z.string().min(1),
        relationship: z.string().min(1),
        declaredAt: z.string().min(1),
      }),
    )
    .min(1),
});
type Values = z.infer<typeof schema>;
function CommandForm({
  operation,
  onClose,
}: {
  readonly operation: Operation;
  onClose(): void;
}) {
  const create = useWorkflowCreateWorkflowCommand();
  const activate = useWorkflowActivateWorkflowCommand();
  const archive = useWorkflowArchiveWorkflowCommand();
  const start = useWorkflowStartWorkflowCommand();
  const advance = useWorkflowAdvanceStageCommand();
  const pause = useWorkflowPauseWorkflowCommand();
  const resume = useWorkflowResumeWorkflowCommand();
  const taskState = useWorkflowRecordTaskStateCommand();
  const taskFailure = useWorkflowRecordTaskFailureCommand();
  const complete = useWorkflowCompleteWorkflowCommand();
  const cancel = useWorkflowCancelWorkflowCommand();
  const fail = useWorkflowFailWorkflowExecutionCommand();
  const command = {
    workflowCreateWorkflow: create,
    workflowActivateWorkflow: activate,
    workflowArchiveWorkflow: archive,
    workflowStartWorkflow: start,
    workflowAdvanceStage: advance,
    workflowPauseWorkflow: pause,
    workflowResumeWorkflow: resume,
    workflowRecordTaskState: taskState,
    workflowRecordTaskFailure: taskFailure,
    workflowCompleteWorkflow: complete,
    workflowCancelWorkflow: cancel,
    workflowFailWorkflowExecution: fail,
  }[operation];
  const defaults = useMemo(auditDefaults, []);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: "",
      workflowId: "",
      executionId: "",
      missionId: "",
      name: "",
      summary: "",
      stageId: "",
      stageName: "",
      taskId: "",
      taskName: "",
      taskKind: "COORDINATION",
      nextStageId: "",
      disposition: "",
      observedState: "",
      failure: "",
      workAssignmentId: "",
      occurredAt: defaults.occurredAt,
      evidence: defaults.evidence,
      lineage: defaults.lineage,
    },
  });
  if (command.state.status === "COMMITTED")
    return (
      <CommandReceiptView
        receipt={command.state.receipt}
        returnTo="/workflows"
      />
    );
  const workflowOperation =
    operation === "workflowCreateWorkflow" ||
    operation === "workflowActivateWorkflow" ||
    operation === "workflowArchiveWorkflow" ||
    operation === "workflowStartWorkflow";
  const submit = async (v: Values) => {
    const common = {
      occurredAt: canonicalTimestamp(v.occurredAt),
      evidence: mapEvidence(v.evidence),
      lineage: mapLineage(v.lineage),
    };
    if (operation === "workflowCreateWorkflow")
      await create.submit(
        {
          workflowId: v.workflowId,
          missionId: v.missionId,
          name: v.name,
          summary: v.summary,
          stage: { id: v.stageId, name: v.stageName },
          task: { id: v.taskId, name: v.taskName, kind: v.taskKind },
          ...common,
        },
        v.reason,
      );
    else if (operation === "workflowActivateWorkflow")
      await activate.submit({ workflowId: v.workflowId, ...common }, v.reason);
    else if (operation === "workflowArchiveWorkflow")
      await archive.submit({ workflowId: v.workflowId, ...common }, v.reason);
    else if (operation === "workflowStartWorkflow")
      await start.submit(
        {
          workflowId: v.workflowId,
          executionId: v.executionId,
          missionId: v.missionId,
          initialStageId: v.stageId,
          ...common,
        },
        v.reason,
      );
    else {
      const payload = {
        executionId: v.executionId,
        ...(v.nextStageId ? { nextStageId: v.nextStageId } : {}),
        ...(v.disposition ? { disposition: v.disposition } : {}),
        ...(v.taskId ? { taskId: v.taskId } : {}),
        ...(v.observedState ? { observedState: v.observedState } : {}),
        ...(v.failure ? { failure: v.failure } : {}),
        ...(v.workAssignmentId ? { workAssignmentId: v.workAssignmentId } : {}),
        ...common,
      };
      if (operation === "workflowAdvanceStage")
        await advance.submit(payload, v.reason);
      else if (operation === "workflowPauseWorkflow")
        await pause.submit(payload, v.reason);
      else if (operation === "workflowResumeWorkflow")
        await resume.submit(payload, v.reason);
      else if (operation === "workflowRecordTaskState")
        await taskState.submit(payload, v.reason);
      else if (operation === "workflowRecordTaskFailure")
        await taskFailure.submit(payload, v.reason);
      else if (operation === "workflowCompleteWorkflow")
        await complete.submit(payload, v.reason);
      else if (operation === "workflowCancelWorkflow")
        await cancel.submit(payload, v.reason);
      else await fail.submit(payload, v.reason);
    }
  };
  return (
    <FormProvider {...form}>
      <form
        className="bba-form"
        onChange={command.edited}
        onSubmit={form.handleSubmit((v) => {
          void submit(v);
        })}
      >
        <h2>{labels[operation]}</h2>
        {workflowOperation ? (
          <Field label="Workflow ID" id="workflowId">
            <Input id="workflowId" {...form.register("workflowId")} />
          </Field>
        ) : (
          <Field label="Execution ID" id="workflowExecutionId">
            <Input id="workflowExecutionId" {...form.register("executionId")} />
          </Field>
        )}
        {operation === "workflowCreateWorkflow" ? (
          <>
            <Field label="Mission ID" id="workflowMission">
              <Input id="workflowMission" {...form.register("missionId")} />
            </Field>
            <Field label="Name" id="workflowName">
              <Input id="workflowName" {...form.register("name")} />
            </Field>
            <Field label="Summary" id="workflowSummary">
              <Textarea id="workflowSummary" {...form.register("summary")} />
            </Field>
            <Field label="Stage ID" id="stageId">
              <Input id="stageId" {...form.register("stageId")} />
            </Field>
            <Field label="Stage name" id="stageName">
              <Input id="stageName" {...form.register("stageName")} />
            </Field>
            <Field label="Task ID" id="taskId">
              <Input id="taskId" {...form.register("taskId")} />
            </Field>
            <Field label="Task name" id="taskName">
              <Input id="taskName" {...form.register("taskName")} />
            </Field>
            <Field label="Task kind" id="taskKind">
              <Select id="taskKind" {...form.register("taskKind")}>
                <option>COORDINATION</option>
                <option>GOVERNANCE_CHECKPOINT</option>
                <option>WORK_ASSIGNMENT</option>
                <option>ASSET_CHECK</option>
                <option>KNOWLEDGE_CHECK</option>
              </Select>
            </Field>
          </>
        ) : null}
        {operation === "workflowStartWorkflow" ? (
          <>
            <Field label="Execution ID" id="startExecutionId">
              <Input id="startExecutionId" {...form.register("executionId")} />
            </Field>
            <Field label="Mission ID" id="startMissionId">
              <Input id="startMissionId" {...form.register("missionId")} />
            </Field>
            <Field label="Initial Stage ID" id="initialStageId">
              <Input id="initialStageId" {...form.register("stageId")} />
            </Field>
          </>
        ) : null}
        {operation === "workflowAdvanceStage" ? (
          <>
            <Field label="Next Stage ID" id="nextStageId">
              <Input id="nextStageId" {...form.register("nextStageId")} />
            </Field>
            <Field label="Disposition" id="disposition">
              <Input id="disposition" {...form.register("disposition")} />
            </Field>
          </>
        ) : null}
        {operation === "workflowRecordTaskState" ||
        operation === "workflowRecordTaskFailure" ? (
          <>
            <Field label="Task ID" id="recordTaskId">
              <Input id="recordTaskId" {...form.register("taskId")} />
            </Field>
            {operation === "workflowRecordTaskState" ? (
              <Field label="Observed state" id="observedState">
                <Input id="observedState" {...form.register("observedState")} />
              </Field>
            ) : (
              <Field label="Failure" id="taskFailure">
                <Textarea id="taskFailure" {...form.register("failure")} />
              </Field>
            )}
            <Field
              label="Work Assignment ID (optional)"
              id="workflowAssignment"
            >
              <Input
                id="workflowAssignment"
                {...form.register("workAssignmentId")}
              />
            </Field>
          </>
        ) : null}
        {operation === "workflowFailWorkflowExecution" ? (
          <Field label="Failure" id="executionFailure">
            <Textarea id="executionFailure" {...form.register("failure")} />
          </Field>
        ) : null}
        <TimestampField label="Occurred at" name="occurredAt" />
        <ReasonField />
        <EvidenceLineageSection />
        {command.state.status === "REJECTED" ||
        command.state.status === "OUTCOME_UNKNOWN" ? (
          <Alert title={command.state.status}>{command.state.message}</Alert>
        ) : null}
        <div className="bba-cluster">
          <OperationSubmitButton label={labels[operation]} onConfirm={() => { void form.handleSubmit((value) => { void submit(value); })(); }} operationId={operation} reason={form.watch("reason")} resource={form.watch("workflowId") || form.watch("executionId")} />
          <Button onClick={onClose} type="button" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
export function WorkflowWorkspacePage() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const operation = operations.find((v) => v === search.get("action"));
  const [workflowId, setWorkflowId] = useState("");
  const [executionId, setExecutionId] = useState("");
  const workflow = useWorkflowGetWorkflowQuery(workflowId);
  const execution = useWorkflowGetWorkflowExecutionQuery(executionId);
  if (operation)
    return (
      <div className="bba-page bba-page--narrow">
        <CommandForm
          onClose={() => {
            void navigate("/workflows");
          }}
          operation={operation}
        />
      </div>
    );
  const lookup =
    (kind: "workflow" | "execution") => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const id = String(new FormData(e.currentTarget).get("id") ?? "").trim();
      if (kind === "workflow") setWorkflowId(id);
      else setExecutionId(id);
    };
  return (
    <div className="bba-page">
      <header>
        <span className="bba-page__eyebrow">Workflow</span>
        <h1>Governed workflow definitions and executions</h1>
      </header>
      <div className="bba-grid">
        {operations.map((v) => (
          <Card key={v}>
            <h2>{labels[v]}</h2>
            <Link to={`/workflows?action=${v}`}>Open action</Link>
          </Card>
        ))}
      </div>
      <div className="bba-grid">
        <Card>
          <form onSubmit={lookup("workflow")}>
            <Field label="Workflow lookup" id="workflowLookup">
              <Input id="workflowLookup" name="id" />
            </Field>
            <Button type="submit">Get Workflow</Button>
          </form>
          {workflow.data ? (
            <p>
              <Badge>{workflow.data.status}</Badge> {workflow.data.id}
            </p>
          ) : null}
        </Card>
        <Card>
          <form onSubmit={lookup("execution")}>
            <Field label="Execution lookup" id="workflowExecutionLookup">
              <Input id="workflowExecutionLookup" name="id" />
            </Field>
            <Button type="submit">Get Workflow Execution</Button>
          </form>
          {execution.data ? (
            <p>
              <Badge>{execution.data.status}</Badge> {execution.data.id}
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
