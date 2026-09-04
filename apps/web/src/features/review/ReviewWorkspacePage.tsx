import { zodResolver } from "@hookform/resolvers/zod";
import {
  useReviewArchiveReviewCommand,
  useReviewCancelSessionCommand,
  useReviewCloseSessionCommand,
  useReviewCompleteReviewCommand,
  useReviewCreateReviewCommand,
  useReviewGetReviewQuery,
  useReviewOpenSessionCommand,
  useReviewPlanSessionCommand,
  useReviewRecordFindingCommand,
  useReviewStartReviewCommand,
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
  "reviewCreateReview",
  "reviewStartReview",
  "reviewPlanSession",
  "reviewOpenSession",
  "reviewRecordFinding",
  "reviewCloseSession",
  "reviewCancelSession",
  "reviewCompleteReview",
  "reviewArchiveReview",
] as const;
type Operation = (typeof operations)[number];
const labels: Record<Operation, string> = {
  reviewCreateReview: "Create Review",
  reviewStartReview: "Start Review",
  reviewPlanSession: "Plan Session",
  reviewOpenSession: "Open Session",
  reviewRecordFinding: "Record Finding",
  reviewCloseSession: "Close Session",
  reviewCancelSession: "Cancel Session",
  reviewCompleteReview: "Complete Review",
  reviewArchiveReview: "Archive Review",
};
const schema = z.object({
  reason: reasonSchema,
  reviewId: z.string().min(1),
  requestId: z.string(),
  missionId: z.string(),
  targetKind: z.enum(["asset", "asset_version", "knowledge", "policy"]),
  targetId: z.string(),
  targetVersionId: z.string(),
  reviewType: z.string(),
  criteria: z.string(),
  requestedBy: z.string(),
  sessionId: z.string(),
  reviewers: z.string(),
  findingId: z.string(),
  statement: z.string(),
  category: z.string(),
  severity: z.string(),
  recommendation: z.string(),
  conclusionId: z.string(),
  outcome: z.string(),
  rationale: z.string(),
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
  const create = useReviewCreateReviewCommand();
  const start = useReviewStartReviewCommand();
  const plan = useReviewPlanSessionCommand();
  const open = useReviewOpenSessionCommand();
  const finding = useReviewRecordFindingCommand();
  const close = useReviewCloseSessionCommand();
  const cancel = useReviewCancelSessionCommand();
  const complete = useReviewCompleteReviewCommand();
  const archive = useReviewArchiveReviewCommand();
  const command = {
    reviewCreateReview: create,
    reviewStartReview: start,
    reviewPlanSession: plan,
    reviewOpenSession: open,
    reviewRecordFinding: finding,
    reviewCloseSession: close,
    reviewCancelSession: cancel,
    reviewCompleteReview: complete,
    reviewArchiveReview: archive,
  }[operation];
  const defaults = useMemo(auditDefaults, []);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: "",
      reviewId: "",
      requestId: "",
      missionId: "",
      targetKind: "asset",
      targetId: "",
      targetVersionId: "",
      reviewType: "",
      criteria: "",
      requestedBy: "",
      sessionId: "",
      reviewers: "",
      findingId: "",
      statement: "",
      category: "",
      severity: "",
      recommendation: "",
      conclusionId: "",
      outcome: "",
      rationale: "",
      occurredAt: defaults.occurredAt,
      evidence: defaults.evidence,
      lineage: defaults.lineage,
    },
  });
  if (command.state.status === "COMMITTED")
    return (
      <CommandReceiptView receipt={command.state.receipt} returnTo="/reviews" />
    );
  const submit = async (v: Values) => {
    const common = {
      occurredAt: canonicalTimestamp(v.occurredAt),
      evidence: mapEvidence(v.evidence),
      lineage: mapLineage(v.lineage),
    };
    if (operation === "reviewCreateReview")
      await create.submit(
        {
          reviewId: v.reviewId,
          requestId: v.requestId,
          missionId: v.missionId,
          targetKind: v.targetKind,
          targetId: v.targetId,
          ...(v.targetVersionId ? { targetVersionId: v.targetVersionId } : {}),
          reviewType: v.reviewType,
          criteria: csv(v.criteria),
          requestedBy: v.requestedBy,
          requestedAt: canonicalTimestamp(v.occurredAt),
          ...common,
        },
        v.reason,
      );
    else {
      const payload = {
        reviewId: v.reviewId,
        ...(v.sessionId ? { sessionId: v.sessionId } : {}),
        ...(v.reviewers ? { reviewerReferences: csv(v.reviewers) } : {}),
        ...(v.findingId ? { findingId: v.findingId } : {}),
        ...(v.statement
          ? {
              statement: v.statement,
              category: v.category,
              severity: v.severity,
              recommendation: v.recommendation,
            }
          : {}),
        ...(v.conclusionId
          ? {
              conclusionId: v.conclusionId,
              outcome: v.outcome,
              rationale: v.rationale,
            }
          : {}),
        ...common,
      };
      if (operation === "reviewStartReview")
        await start.submit(payload, v.reason);
      else if (operation === "reviewPlanSession")
        await plan.submit(payload, v.reason);
      else if (operation === "reviewOpenSession")
        await open.submit(payload, v.reason);
      else if (operation === "reviewRecordFinding")
        await finding.submit(payload, v.reason);
      else if (operation === "reviewCloseSession")
        await close.submit(payload, v.reason);
      else if (operation === "reviewCancelSession")
        await cancel.submit(payload, v.reason);
      else if (operation === "reviewCompleteReview")
        await complete.submit(payload, v.reason);
      else await archive.submit(payload, v.reason);
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
        <Field label="Review ID" id="reviewId">
          <Input id="reviewId" {...form.register("reviewId")} />
        </Field>
        {operation === "reviewCreateReview" ? (
          <>
            <Field label="Request ID" id="reviewRequestId">
              <Input id="reviewRequestId" {...form.register("requestId")} />
            </Field>
            <Field label="Mission ID" id="reviewMissionId">
              <Input id="reviewMissionId" {...form.register("missionId")} />
            </Field>
            <Field label="Target kind" id="reviewTargetKind">
              <Select id="reviewTargetKind" {...form.register("targetKind")}>
                <option>asset</option>
                <option>asset_version</option>
                <option>knowledge</option>
                <option>policy</option>
              </Select>
            </Field>
            <Field label="Target ID" id="reviewTargetId">
              <Input id="reviewTargetId" {...form.register("targetId")} />
            </Field>
            <Field label="Review type" id="reviewType">
              <Input id="reviewType" {...form.register("reviewType")} />
            </Field>
            <Field label="Criteria" hint="Comma separated" id="reviewCriteria">
              <Input id="reviewCriteria" {...form.register("criteria")} />
            </Field>
            <Field label="Requested by" id="requestedBy">
              <Input id="requestedBy" {...form.register("requestedBy")} />
            </Field>
          </>
        ) : null}
        {operation === "reviewPlanSession" ||
        operation === "reviewOpenSession" ||
        operation === "reviewRecordFinding" ||
        operation === "reviewCloseSession" ||
        operation === "reviewCancelSession" ? (
          <Field label="Session ID" id="reviewSessionId">
            <Input id="reviewSessionId" {...form.register("sessionId")} />
          </Field>
        ) : null}
        {operation === "reviewPlanSession" ? (
          <Field
            label="Reviewer references"
            hint="Comma separated"
            id="reviewers"
          >
            <Input id="reviewers" {...form.register("reviewers")} />
          </Field>
        ) : null}
        {operation === "reviewRecordFinding" ? (
          <>
            <Field label="Finding ID" id="findingId">
              <Input id="findingId" {...form.register("findingId")} />
            </Field>
            <Field label="Statement" id="findingStatement">
              <Textarea id="findingStatement" {...form.register("statement")} />
            </Field>
            <Field label="Category" id="findingCategory">
              <Input id="findingCategory" {...form.register("category")} />
            </Field>
            <Field label="Severity" id="findingSeverity">
              <Input id="findingSeverity" {...form.register("severity")} />
            </Field>
            <Field label="Recommendation" id="findingRecommendation">
              <Textarea
                id="findingRecommendation"
                {...form.register("recommendation")}
              />
            </Field>
          </>
        ) : null}
        {operation === "reviewCompleteReview" ? (
          <>
            <Field label="Conclusion ID" id="conclusionId">
              <Input id="conclusionId" {...form.register("conclusionId")} />
            </Field>
            <Field label="Outcome" id="reviewOutcome">
              <Input id="reviewOutcome" {...form.register("outcome")} />
            </Field>
            <Field label="Decision rationale" id="reviewRationale">
              <Textarea id="reviewRationale" {...form.register("rationale")} />
            </Field>
          </>
        ) : null}
        <TimestampField label="Occurred at" name="occurredAt" />
        <ReasonField />
        <EvidenceLineageSection />
        {command.state.status === "REJECTED" ||
        command.state.status === "OUTCOME_UNKNOWN" ? (
          <Alert title={command.state.status}>{command.state.message}</Alert>
        ) : null}
        <div className="bba-cluster">
          <OperationSubmitButton label={labels[operation]} onConfirm={() => { void form.handleSubmit((value) => { void submit(value); })(); }} operationId={operation} reason={form.watch("reason")} resource={form.watch("reviewId")} />
          <Button onClick={onClose} type="button" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
export function ReviewWorkspacePage() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const operation = operations.find((v) => v === search.get("action"));
  const [id, setId] = useState("");
  const review = useReviewGetReviewQuery(id);
  if (operation)
    return (
      <div className="bba-page bba-page--narrow">
        <CommandForm
          onClose={() => {
            void navigate("/reviews");
          }}
          operation={operation}
        />
      </div>
    );
  const lookup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setId(String(new FormData(e.currentTarget).get("id") ?? "").trim());
  };
  return (
    <div className="bba-page">
      <header>
        <span className="bba-page__eyebrow">Review</span>
        <h1>Governed review lifecycle</h1>
      </header>
      <div className="bba-grid">
        {operations.map((v) => (
          <Card key={v}>
            <h2>{labels[v]}</h2>
            <Link to={`/reviews?action=${v}`}>Open action</Link>
          </Card>
        ))}
      </div>
      <Card>
        <form onSubmit={lookup}>
          <Field label="Review lookup" id="reviewLookup">
            <Input id="reviewLookup" name="id" />
          </Field>
          <Button type="submit">Get Review</Button>
        </form>
        {review.data ? (
          <p>
            <Badge>{review.data.status}</Badge> {review.data.id}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
