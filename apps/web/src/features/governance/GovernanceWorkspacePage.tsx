import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGovernanceApproveDecisionCommand,
  useGovernanceAssignAuthorityCommand,
  useGovernanceCreateAuthorityCommand,
  useGovernanceCreateDecisionCommand,
  useGovernanceFinalizeDecisionCommand,
  useGovernanceGetAuthorityQuery,
  useGovernanceGetDecisionQuery,
  useGovernanceRejectDecisionCommand,
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
} from "@bba/ui";
import { useMemo, useState, type FormEvent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { CommandReceiptView } from "../shared/CommandReceiptView.js";
import { OperationSubmitButton } from "../shared/OperationSubmitButton.js";
import {
  EvidenceLineageSection,
  ReasonField,
  TimestampField,
} from "../shared/forms/institutional-fields.js";
import { canonicalTimestamp } from "../shared/forms/form-utils.js";
import {
  auditDefaults,
  mapEvidence,
  mapLineage,
  reasonSchema,
} from "../missions/operations/common.js";

const operations = [
  "governanceCreateAuthority",
  "governanceAssignAuthority",
  "governanceCreateDecision",
  "governanceApproveDecision",
  "governanceRejectDecision",
  "governanceFinalizeDecision",
] as const;
type GovernanceOperation = (typeof operations)[number];
const baseSchema = z.object({
  reason: reasonSchema,
  primaryId: z.string().trim().min(1),
  expectedVersion: z.number().int().nonnegative(),
  level: z.string(),
  purpose: z.string(),
  actions: z.string(),
  assignmentId: z.string(),
  delegateReference: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  missionId: z.string(),
  decisionType: z.string(),
  authorityId: z.string(),
  approvalId: z.string(),
  outcome: z.string(),
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
type Values = z.infer<typeof baseSchema>;
const labels: Record<GovernanceOperation, string> = {
  governanceCreateAuthority: "Create Authority",
  governanceAssignAuthority: "Assign Authority",
  governanceCreateDecision: "Create Decision",
  governanceApproveDecision: "Approve Decision",
  governanceRejectDecision: "Reject Decision",
  governanceFinalizeDecision: "Finalize Decision",
};

function GovernanceCommandForm({
  operation,
  onClose,
}: {
  readonly operation: GovernanceOperation;
  onClose(): void;
}) {
  const createAuthority = useGovernanceCreateAuthorityCommand();
  const assign = useGovernanceAssignAuthorityCommand();
  const createDecision = useGovernanceCreateDecisionCommand();
  const approve = useGovernanceApproveDecisionCommand();
  const reject = useGovernanceRejectDecisionCommand();
  const finalize = useGovernanceFinalizeDecisionCommand();
  const command = {
    governanceCreateAuthority: createAuthority,
    governanceAssignAuthority: assign,
    governanceCreateDecision: createDecision,
    governanceApproveDecision: approve,
    governanceRejectDecision: reject,
    governanceFinalizeDecision: finalize,
  }[operation];
  const audit = useMemo(auditDefaults, []);
  const form = useForm<Values>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      reason: "",
      primaryId: "",
      expectedVersion: 0,
      level: "OPERATIONAL",
      purpose: "",
      actions: "",
      assignmentId: "",
      delegateReference: "",
      startsAt: audit.occurredAt,
      endsAt: audit.occurredAt,
      missionId: "",
      decisionType: "",
      authorityId: "",
      approvalId: "",
      outcome: "APPROVED",
      occurredAt: audit.occurredAt,
      evidence: audit.evidence,
      lineage: audit.lineage,
    },
  });
  if (command.state.status === "COMMITTED")
    return (
      <CommandReceiptView
        receipt={command.state.receipt}
        returnTo="/governance"
      />
    );
  const submit = async (v: Values) => {
    const auditInput = {
      occurredAt: canonicalTimestamp(v.occurredAt),
      evidence: mapEvidence(v.evidence),
      lineage: mapLineage(v.lineage),
    };
    if (operation === "governanceCreateAuthority")
      await createAuthority.submit(
        {
          authorityId: v.primaryId,
          level: v.level as "OPERATIONAL",
          scope: {
            purpose: v.purpose,
            actions: v.actions
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean),
          },
          ...auditInput,
        },
        v.reason,
      );
    else if (operation === "governanceAssignAuthority")
      await assign.submit(
        {
          authorityId: v.primaryId,
          expectedVersion: v.expectedVersion,
          assignmentId: v.assignmentId,
          delegateReference: v.delegateReference,
          scope: {
            purpose: v.purpose,
            actions: v.actions
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean),
          },
          period: {
            startsAt: canonicalTimestamp(v.startsAt),
            endsAt: canonicalTimestamp(v.endsAt),
          },
          ...auditInput,
        },
        v.reason,
      );
    else if (operation === "governanceCreateDecision")
      await createDecision.submit(
        {
          decisionId: v.primaryId,
          missionId: v.missionId,
          decisionType: v.decisionType,
          authorityId: v.authorityId,
          ...(v.assignmentId ? { assignmentId: v.assignmentId } : {}),
          ...auditInput,
        },
        v.reason,
      );
    else if (operation === "governanceApproveDecision")
      await approve.submit(
        {
          decisionId: v.primaryId,
          expectedVersion: v.expectedVersion,
          approvalId: v.approvalId,
          authorityId: v.authorityId,
          ...(v.assignmentId ? { assignmentId: v.assignmentId } : {}),
          ...(v.outcome ? { outcome: v.outcome } : {}),
          ...auditInput,
        },
        v.reason,
      );
    else if (operation === "governanceRejectDecision")
      await reject.submit(
        {
          decisionId: v.primaryId,
          expectedVersion: v.expectedVersion,
          approvalId: v.approvalId,
          authorityId: v.authorityId,
          ...(v.assignmentId ? { assignmentId: v.assignmentId } : {}),
          ...auditInput,
        },
        v.reason,
      );
    else
      await finalize.submit(
        {
          decisionId: v.primaryId,
          expectedVersion: v.expectedVersion,
          ...auditInput,
        },
        v.reason,
      );
  };
  const authority =
    operation === "governanceCreateAuthority" ||
    operation === "governanceAssignAuthority";
  const decisionCreate = operation === "governanceCreateDecision";
  const approval =
    operation === "governanceApproveDecision" ||
    operation === "governanceRejectDecision";
  const mutation =
    operation !== "governanceCreateAuthority" &&
    operation !== "governanceCreateDecision";
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
        <Field
          label={authority ? "Authority ID" : "Decision ID"}
          id="primaryId"
        >
          <Input id="primaryId" {...form.register("primaryId")} />
        </Field>
        {mutation ? (
          <Field label="Expected version" id="expectedVersion">
            <Input
              id="expectedVersion"
              type="number"
              {...form.register("expectedVersion", { valueAsNumber: true })}
            />
          </Field>
        ) : null}
        {authority ? (
          <>
            <Field label="Authority level" id="level">
              <Select id="level" {...form.register("level")}>
                <option>ADVISORY</option>
                <option>OPERATIONAL</option>
                <option>INSTITUTIONAL</option>
                <option>FINAL</option>
              </Select>
            </Field>
            <Field label="Scope purpose" id="purpose">
              <Input id="purpose" {...form.register("purpose")} />
            </Field>
            <Field label="Allowed actions" hint="Comma separated" id="actions">
              <Input id="actions" {...form.register("actions")} />
            </Field>
          </>
        ) : null}
        {operation === "governanceAssignAuthority" ? (
          <>
            <Field label="Assignment ID" id="assignmentId">
              <Input id="assignmentId" {...form.register("assignmentId")} />
            </Field>
            <Field label="Delegate reference" id="delegateReference">
              <Input
                id="delegateReference"
                {...form.register("delegateReference")}
              />
            </Field>
            <Field label="Starts at" id="startsAt">
              <Input
                id="startsAt"
                type="datetime-local"
                {...form.register("startsAt")}
              />
            </Field>
            <Field label="Ends at" id="endsAt">
              <Input
                id="endsAt"
                type="datetime-local"
                {...form.register("endsAt")}
              />
            </Field>
          </>
        ) : null}
        {decisionCreate ? (
          <>
            <Field label="Mission ID" id="missionId">
              <Input id="missionId" {...form.register("missionId")} />
            </Field>
            <Field label="Decision type" id="decisionType">
              <Input id="decisionType" {...form.register("decisionType")} />
            </Field>
          </>
        ) : null}
        {decisionCreate || approval ? (
          <Field label="Authority ID" id="authorityId">
            <Input id="authorityId" {...form.register("authorityId")} />
          </Field>
        ) : null}
        {approval ? (
          <Field label="Approval ID" id="approvalId">
            <Input id="approvalId" {...form.register("approvalId")} />
          </Field>
        ) : null}
        <TimestampField label="Occurred at" name="occurredAt" />
        <ReasonField />
        <EvidenceLineageSection />
        {command.state.status === "REJECTED" ||
        command.state.status === "OUTCOME_UNKNOWN" ? (
          <Alert
            title={
              command.state.status === "OUTCOME_UNKNOWN"
                ? "Outcome unknown"
                : "Command rejected"
            }
          >
            {command.state.message}
            <Button
              onClick={() => {
                void command.retry();
              }}
              type="button"
              variant="secondary"
            >
              Retry same intent
            </Button>
          </Alert>
        ) : null}
        <div className="bba-cluster">
          <OperationSubmitButton disabled={command.state.status === "SUBMITTING"} label={labels[operation]} onConfirm={() => { void form.handleSubmit((value) => { void submit(value); })(); }} operationId={operation} reason={form.watch("reason")} resource={form.watch("primaryId")} />
          <Button onClick={onClose} type="button" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export function GovernanceWorkspacePage() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const operation = operations.find((value) => value === search.get("action"));
  const [authorityId, setAuthorityId] = useState("");
  const [decisionId, setDecisionId] = useState("");
  const authority = useGovernanceGetAuthorityQuery(authorityId);
  const decision = useGovernanceGetDecisionQuery(decisionId);
  const lookup =
    (kind: "authority" | "decision") => (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const id = String(
        new FormData(event.currentTarget).get("id") ?? "",
      ).trim();
      if (kind === "authority") setAuthorityId(id);
      else setDecisionId(id);
    };
  if (operation !== undefined)
    return (
      <div className="bba-page bba-page--narrow">
        <GovernanceCommandForm
          onClose={() => {
            void navigate("/governance");
          }}
          operation={operation}
        />
      </div>
    );
  return (
    <div className="bba-page">
      <header>
        <span className="bba-page__eyebrow">Human Governance</span>
        <h1>Authority and Decision workspace</h1>
        <p>
          Governed Commands remain distinct from domain rationale and expose
          only public projections.
        </p>
      </header>
      <div className="bba-grid">
        {operations.map((item) => (
          <Card key={item}>
            <h2>{labels[item]}</h2>
            <Link to={`/governance?action=${item}`}>Open action</Link>
          </Card>
        ))}
      </div>
      <div className="bba-grid">
        <Card>
          <form className="bba-form" onSubmit={lookup("authority")}>
            <Field label="Authority lookup" id="authorityLookup">
              <Input id="authorityLookup" name="id" />
            </Field>
            <Button type="submit">Get Authority</Button>
          </form>
          {authority.error ? (
            <Alert title="Query failed">{authority.error.message}</Alert>
          ) : authority.data ? (
            <dl className="bba-definition">
              <div>
                <dt>Status</dt>
                <dd>
                  <Badge>{authority.data.status}</Badge>
                </dd>
              </div>
              <div>
                <dt>Level</dt>
                <dd>{authority.data.level}</dd>
              </div>
              <div>
                <dt>Assignments</dt>
                <dd>{authority.data.assignmentCount}</dd>
              </div>
            </dl>
          ) : null}
        </Card>
        <Card>
          <form className="bba-form" onSubmit={lookup("decision")}>
            <Field label="Decision lookup" id="decisionLookup">
              <Input id="decisionLookup" name="id" />
            </Field>
            <Button type="submit">Get Decision</Button>
          </form>
          {decision.error ? (
            <Alert title="Query failed">{decision.error.message}</Alert>
          ) : decision.data ? (
            <dl className="bba-definition">
              <div>
                <dt>Status</dt>
                <dd>
                  <Badge>{decision.data.status}</Badge>
                </dd>
              </div>
              <div>
                <dt>Mission</dt>
                <dd>{decision.data.missionId}</dd>
              </div>
              <div>
                <dt>Authority</dt>
                <dd>{decision.data.authorityId}</dd>
              </div>
            </dl>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
