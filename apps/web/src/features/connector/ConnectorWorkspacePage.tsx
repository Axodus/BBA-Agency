import { zodResolver } from "@hookform/resolvers/zod";
import {
  useConnectorActivateConnectorCommand,
  useConnectorCancelExecutionCommand,
  useConnectorCompleteExecutionCommand,
  useConnectorCreateExecutionCommand,
  useConnectorFailExecutionCommand,
  useConnectorGetConnectorExecutionQuery,
  useConnectorGetConnectorQuery,
  useConnectorRegisterConnectorCommand,
  useConnectorRetireConnectorCommand,
  useConnectorStartExecutionCommand,
  useConnectorSuspendConnectorCommand,
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
  "connectorRegisterConnector",
  "connectorActivateConnector",
  "connectorSuspendConnector",
  "connectorRetireConnector",
  "connectorCreateExecution",
  "connectorStartExecution",
  "connectorCompleteExecution",
  "connectorFailExecution",
  "connectorCancelExecution",
] as const;
type Operation = (typeof operations)[number];
const labels: Record<Operation, string> = {
  connectorRegisterConnector: "Register Connector",
  connectorActivateConnector: "Activate Connector",
  connectorSuspendConnector: "Suspend Connector",
  connectorRetireConnector: "Retire Connector",
  connectorCreateExecution: "Create Execution",
  connectorStartExecution: "Start Execution",
  connectorCompleteExecution: "Complete Execution",
  connectorFailExecution: "Fail Execution",
  connectorCancelExecution: "Cancel Execution",
};
const schema = z.object({
  reason: reasonSchema,
  connectorId: z.string(),
  executionId: z.string(),
  name: z.string(),
  capabilityId: z.string(),
  capabilityType: z.enum([
    "PUBLISH",
    "IMPORT",
    "EXPORT",
    "SEARCH",
    "VALIDATION",
    "WEBHOOK",
  ]),
  operationKeys: z.string(),
  operationKey: z.string(),
  requestKey: z.string(),
  requestIdempotencyKey: z.string(),
  targetReference: z.string(),
  evidenceKind: z.enum(["SUCCESS", "FAILURE"]),
  providerReference: z.string(),
  externalIdentifier: z.string(),
  checksum: z.string(),
  failureCode: z.string(),
  failureReason: z.string(),
  retryable: z.boolean(),
  cancellationReason: z.string(),
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
const csv = (v: string) =>
  v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
function CommandForm({
  operation,
  onClose,
}: {
  readonly operation: Operation;
  onClose(): void;
}) {
  const register = useConnectorRegisterConnectorCommand();
  const activate = useConnectorActivateConnectorCommand();
  const suspend = useConnectorSuspendConnectorCommand();
  const retire = useConnectorRetireConnectorCommand();
  const create = useConnectorCreateExecutionCommand();
  const start = useConnectorStartExecutionCommand();
  const complete = useConnectorCompleteExecutionCommand();
  const fail = useConnectorFailExecutionCommand();
  const cancel = useConnectorCancelExecutionCommand();
  const command = {
    connectorRegisterConnector: register,
    connectorActivateConnector: activate,
    connectorSuspendConnector: suspend,
    connectorRetireConnector: retire,
    connectorCreateExecution: create,
    connectorStartExecution: start,
    connectorCompleteExecution: complete,
    connectorFailExecution: fail,
    connectorCancelExecution: cancel,
  }[operation];
  const defaults = useMemo(auditDefaults, []);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: "",
      connectorId: "",
      executionId: "",
      name: "",
      capabilityId: "",
      capabilityType: "PUBLISH",
      operationKeys: "",
      operationKey: "",
      requestKey: "",
      requestIdempotencyKey: "",
      targetReference: "",
      evidenceKind: "SUCCESS",
      providerReference: "",
      externalIdentifier: "",
      checksum: "",
      failureCode: "",
      failureReason: "",
      retryable: false,
      cancellationReason: "",
      occurredAt: defaults.occurredAt,
      evidence: defaults.evidence,
      lineage: defaults.lineage,
    },
  });
  if (command.state.status === "COMMITTED")
    return (
      <CommandReceiptView
        receipt={command.state.receipt}
        returnTo="/connectors"
      />
    );
  const connectorOperation =
    operation === "connectorRegisterConnector" ||
    operation === "connectorActivateConnector" ||
    operation === "connectorSuspendConnector" ||
    operation === "connectorRetireConnector";
  const submit = async (v: Values) => {
    const common = {
      occurredAt: canonicalTimestamp(v.occurredAt),
      evidence: mapEvidence(v.evidence),
      lineage: mapLineage(v.lineage),
    };
    if (operation === "connectorRegisterConnector")
      await register.submit(
        {
          connectorId: v.connectorId,
          name: v.name,
          capabilityId: v.capabilityId,
          capabilityType: v.capabilityType,
          supportedOperationKeys: csv(v.operationKeys),
          ...common,
        },
        v.reason,
      );
    else if (operation === "connectorActivateConnector")
      await activate.submit(
        { connectorId: v.connectorId, ...common },
        v.reason,
      );
    else if (operation === "connectorSuspendConnector")
      await suspend.submit({ connectorId: v.connectorId, ...common }, v.reason);
    else if (operation === "connectorRetireConnector")
      await retire.submit({ connectorId: v.connectorId, ...common }, v.reason);
    else if (operation === "connectorCreateExecution")
      await create.submit(
        {
          executionId: v.executionId,
          connectorId: v.connectorId,
          capabilityId: v.capabilityId,
          operationKey: v.operationKey,
          requestKey: v.requestKey,
          requestIdempotencyKey: v.requestIdempotencyKey,
          targetReference: v.targetReference,
          requestedAt: canonicalTimestamp(v.occurredAt),
          ...common,
        },
        v.reason,
      );
    else {
      const externalEvidence = {
        kind: v.evidenceKind,
        providerReference: v.providerReference,
        receivedAt: canonicalTimestamp(v.occurredAt),
        ...(v.externalIdentifier
          ? { externalIdentifier: v.externalIdentifier }
          : {}),
        ...(v.checksum ? { checksum: v.checksum } : {}),
        ...(v.failureCode ? { failureCode: v.failureCode } : {}),
        ...(v.failureReason ? { failureReason: v.failureReason } : {}),
        retryable: v.retryable,
      };
      const payload = {
        executionId: v.executionId,
        ...(operation === "connectorCompleteExecution" ||
        operation === "connectorFailExecution"
          ? { externalEvidence }
          : {}),
        ...(operation === "connectorCancelExecution"
          ? { cancellationReason: v.cancellationReason }
          : {}),
        ...common,
      };
      if (operation === "connectorStartExecution")
        await start.submit(payload, v.reason);
      else if (operation === "connectorCompleteExecution")
        await complete.submit(payload, v.reason);
      else if (operation === "connectorFailExecution")
        await fail.submit(payload, v.reason);
      else await cancel.submit(payload, v.reason);
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
        {connectorOperation || operation === "connectorCreateExecution" ? (
          <Field label="Connector ID" id="connectorId">
            <Input id="connectorId" {...form.register("connectorId")} />
          </Field>
        ) : (
          <Field label="Execution ID" id="connectorExecutionId">
            <Input
              id="connectorExecutionId"
              {...form.register("executionId")}
            />
          </Field>
        )}
        {operation === "connectorRegisterConnector" ? (
          <>
            <Field label="Connector name" id="connectorName">
              <Input id="connectorName" {...form.register("name")} />
            </Field>
            <Field label="Capability ID" id="connectorCapabilityId">
              <Input
                id="connectorCapabilityId"
                {...form.register("capabilityId")}
              />
            </Field>
            <Field label="Capability type" id="connectorCapabilityType">
              <Select
                id="connectorCapabilityType"
                {...form.register("capabilityType")}
              >
                <option>PUBLISH</option>
                <option>IMPORT</option>
                <option>EXPORT</option>
                <option>SEARCH</option>
                <option>VALIDATION</option>
                <option>WEBHOOK</option>
              </Select>
            </Field>
            <Field
              label="Supported operation keys"
              hint="Comma separated"
              id="operationKeys"
            >
              <Input id="operationKeys" {...form.register("operationKeys")} />
            </Field>
          </>
        ) : null}
        {operation === "connectorCreateExecution" ? (
          <>
            <Field label="Execution ID" id="createConnectorExecution">
              <Input
                id="createConnectorExecution"
                {...form.register("executionId")}
              />
            </Field>
            <Field label="Capability ID" id="executionCapability">
              <Input
                id="executionCapability"
                {...form.register("capabilityId")}
              />
            </Field>
            <Field label="Operation key" id="executionOperationKey">
              <Input
                id="executionOperationKey"
                {...form.register("operationKey")}
              />
            </Field>
            <Field label="Request key" id="requestKey">
              <Input id="requestKey" {...form.register("requestKey")} />
            </Field>
            <Field label="Request idempotency key" id="requestIdempotency">
              <Input
                id="requestIdempotency"
                {...form.register("requestIdempotencyKey")}
              />
            </Field>
            <Field label="Target reference" id="targetReference">
              <Input
                id="targetReference"
                {...form.register("targetReference")}
              />
            </Field>
          </>
        ) : null}
        {operation === "connectorCompleteExecution" ||
        operation === "connectorFailExecution" ? (
          <>
            <Field label="Evidence result" id="evidenceKind">
              <Select id="evidenceKind" {...form.register("evidenceKind")}>
                <option>SUCCESS</option>
                <option>FAILURE</option>
              </Select>
            </Field>
            <Field label="Provider reference" id="providerReference">
              <Input
                id="providerReference"
                {...form.register("providerReference")}
              />
            </Field>
            <Field label="External identifier" id="externalIdentifier">
              <Input
                id="externalIdentifier"
                {...form.register("externalIdentifier")}
              />
            </Field>
            <Field label="Failure code" id="connectorFailureCode">
              <Input
                id="connectorFailureCode"
                {...form.register("failureCode")}
              />
            </Field>
            <Field label="Failure reason" id="connectorFailureReason">
              <Textarea
                id="connectorFailureReason"
                {...form.register("failureReason")}
              />
            </Field>
          </>
        ) : null}
        {operation === "connectorCancelExecution" ? (
          <Field label="Cancellation reason" id="cancellationReason">
            <Textarea
              id="cancellationReason"
              {...form.register("cancellationReason")}
            />
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
          <OperationSubmitButton label={labels[operation]} onConfirm={() => { void form.handleSubmit((value) => { void submit(value); })(); }} operationId={operation} reason={form.watch("reason")} resource={form.watch("connectorId") || form.watch("executionId")} />
          <Button onClick={onClose} type="button" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
export function ConnectorWorkspacePage() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const operation = operations.find((v) => v === search.get("action"));
  const [connectorId, setConnectorId] = useState("");
  const [executionId, setExecutionId] = useState("");
  const connector = useConnectorGetConnectorQuery(connectorId);
  const execution = useConnectorGetConnectorExecutionQuery(executionId);
  if (operation)
    return (
      <div className="bba-page bba-page--narrow">
        <CommandForm
          onClose={() => {
            void navigate("/connectors");
          }}
          operation={operation}
        />
      </div>
    );
  const lookup =
    (kind: "connector" | "execution") => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const id = String(new FormData(e.currentTarget).get("id") ?? "").trim();
      if (kind === "connector") setConnectorId(id);
      else setExecutionId(id);
    };
  return (
    <div className="bba-page">
      <header>
        <span className="bba-page__eyebrow">Connector</span>
        <h1>Connector configuration and evidence</h1>
        <p>
          No polling, webhook, OAuth, scheduler, retry engine or transport
          runtime is included.
        </p>
      </header>
      <div className="bba-grid">
        {operations.map((v) => (
          <Card key={v}>
            <h2>{labels[v]}</h2>
            <Link to={`/connectors?action=${v}`}>Open action</Link>
          </Card>
        ))}
      </div>
      <div className="bba-grid">
        <Card>
          <form onSubmit={lookup("connector")}>
            <Field label="Connector lookup" id="connectorLookup">
              <Input id="connectorLookup" name="id" />
            </Field>
            <Button type="submit">Get Connector</Button>
          </form>
          {connector.data ? (
            <p>
              <Badge>{connector.data.status}</Badge> {connector.data.id}
            </p>
          ) : null}
        </Card>
        <Card>
          <form onSubmit={lookup("execution")}>
            <Field
              label="Connector Execution lookup"
              id="connectorExecutionLookup"
            >
              <Input id="connectorExecutionLookup" name="id" />
            </Field>
            <Button type="submit">Get Connector Execution</Button>
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
