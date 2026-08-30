import { zodResolver } from "@hookform/resolvers/zod";
import {
  usePublicationArchivePublicationCommand,
  usePublicationAuthorizePublicationCommand,
  usePublicationCreatePublicationCommand,
  usePublicationGetPublicationQuery,
  usePublicationPreparePublicationCommand,
  usePublicationRecordPublicationOutcomeCommand,
} from "@bba/sdk-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Field,
  Input,
  Link,
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
  "publicationCreatePublication",
  "publicationPreparePublication",
  "publicationAuthorizePublication",
  "publicationRecordPublicationOutcome",
  "publicationArchivePublication",
] as const;
type Operation = (typeof operations)[number];
const labels: Record<Operation, string> = {
  publicationCreatePublication: "Create Publication",
  publicationPreparePublication: "Prepare Publication",
  publicationAuthorizePublication: "Authorize Publication",
  publicationRecordPublicationOutcome: "Record Publication Outcome",
  publicationArchivePublication: "Archive Publication",
};
const schema = z.object({
  reason: reasonSchema,
  publicationId: z.string().min(1),
  packageId: z.string(),
  missionId: z.string(),
  assetId: z.string(),
  assetVersionId: z.string(),
  destinationKey: z.string(),
  destinationAudience: z.string(),
  destinationPurpose: z.string(),
  knowledgeIds: z.string(),
  title: z.string(),
  reviewId: z.string(),
  publicationVersionId: z.string(),
  observationBatchKey: z.string(),
  recordId: z.string(),
  connectorId: z.string(),
  result: z.string(),
  externalIdentifier: z.string(),
  failureReason: z.string(),
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
  const create = usePublicationCreatePublicationCommand();
  const prepare = usePublicationPreparePublicationCommand();
  const authorize = usePublicationAuthorizePublicationCommand();
  const outcome = usePublicationRecordPublicationOutcomeCommand();
  const archive = usePublicationArchivePublicationCommand();
  const command = {
    publicationCreatePublication: create,
    publicationPreparePublication: prepare,
    publicationAuthorizePublication: authorize,
    publicationRecordPublicationOutcome: outcome,
    publicationArchivePublication: archive,
  }[operation];
  const defaults = useMemo(auditDefaults, []);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: "",
      publicationId: "",
      packageId: "",
      missionId: "",
      assetId: "",
      assetVersionId: "",
      destinationKey: "",
      destinationAudience: "",
      destinationPurpose: "",
      knowledgeIds: "",
      title: "",
      reviewId: "",
      publicationVersionId: "",
      observationBatchKey: "",
      recordId: "",
      connectorId: "",
      result: "",
      externalIdentifier: "",
      failureReason: "",
      occurredAt: defaults.occurredAt,
      evidence: defaults.evidence,
      lineage: defaults.lineage,
    },
  });
  if (command.state.status === "COMMITTED")
    return (
      <CommandReceiptView
        receipt={command.state.receipt}
        returnTo="/publications"
      />
    );
  const submit = async (v: Values) => {
    const common = {
      occurredAt: canonicalTimestamp(v.occurredAt),
      evidence: mapEvidence(v.evidence),
      lineage: mapLineage(v.lineage),
    };
    if (operation === "publicationCreatePublication")
      await create.submit(
        {
          publicationId: v.publicationId,
          packageId: v.packageId,
          missionId: v.missionId,
          assetId: v.assetId,
          assetVersionId: v.assetVersionId,
          destination: {
            key: v.destinationKey,
            audience: v.destinationAudience,
            purpose: v.destinationPurpose,
          },
          knowledgeIds: csv(v.knowledgeIds),
          title: v.title,
          ...common,
        },
        v.reason,
      );
    else {
      const payload = {
        publicationId: v.publicationId,
        ...(v.reviewId ? { reviewId: v.reviewId } : {}),
        ...(v.publicationVersionId
          ? { publicationVersionId: v.publicationVersionId }
          : {}),
        ...(v.observationBatchKey
          ? { observationBatchKey: v.observationBatchKey }
          : {}),
        ...(v.recordId
          ? {
              observation: {
                recordId: v.recordId,
                connectorId: v.connectorId,
                destinationKey: v.destinationKey,
                result: v.result,
                observedAt: canonicalTimestamp(v.occurredAt),
                ...(v.externalIdentifier
                  ? { externalIdentifier: v.externalIdentifier }
                  : {}),
                ...(v.failureReason ? { failureReason: v.failureReason } : {}),
                evidence: mapEvidence(v.evidence),
              },
            }
          : {}),
        ...common,
      };
      if (operation === "publicationPreparePublication")
        await prepare.submit(payload, v.reason);
      else if (operation === "publicationAuthorizePublication")
        await authorize.submit(payload, v.reason);
      else if (operation === "publicationRecordPublicationOutcome")
        await outcome.submit(payload, v.reason);
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
        <Field label="Publication ID" id="publicationId">
          <Input id="publicationId" {...form.register("publicationId")} />
        </Field>
        {operation === "publicationCreatePublication" ? (
          <>
            <Field label="Package ID" id="packageId">
              <Input id="packageId" {...form.register("packageId")} />
            </Field>
            <Field label="Mission ID" id="publicationMission">
              <Input id="publicationMission" {...form.register("missionId")} />
            </Field>
            <Field label="Asset ID" id="publicationAsset">
              <Input id="publicationAsset" {...form.register("assetId")} />
            </Field>
            <Field label="Asset version ID" id="publicationAssetVersion">
              <Input
                id="publicationAssetVersion"
                {...form.register("assetVersionId")}
              />
            </Field>
            <Field label="Destination key" id="destinationKey">
              <Input id="destinationKey" {...form.register("destinationKey")} />
            </Field>
            <Field label="Destination audience" id="destinationAudience">
              <Input
                id="destinationAudience"
                {...form.register("destinationAudience")}
              />
            </Field>
            <Field label="Destination purpose" id="destinationPurpose">
              <Textarea
                id="destinationPurpose"
                {...form.register("destinationPurpose")}
              />
            </Field>
            <Field
              label="Knowledge IDs"
              hint="Comma separated"
              id="publicationKnowledge"
            >
              <Input
                id="publicationKnowledge"
                {...form.register("knowledgeIds")}
              />
            </Field>
            <Field label="Package title" id="publicationTitle">
              <Input id="publicationTitle" {...form.register("title")} />
            </Field>
          </>
        ) : null}
        {operation === "publicationPreparePublication" ||
        operation === "publicationAuthorizePublication" ? (
          <Field label="Review ID" id="publicationReview">
            <Input id="publicationReview" {...form.register("reviewId")} />
          </Field>
        ) : null}
        {operation === "publicationRecordPublicationOutcome" ? (
          <>
            <Field label="Publication version ID" id="publicationVersionId">
              <Input
                id="publicationVersionId"
                {...form.register("publicationVersionId")}
              />
            </Field>
            <Field label="Observation batch key" id="observationBatchKey">
              <Input
                id="observationBatchKey"
                {...form.register("observationBatchKey")}
              />
            </Field>
            <Field label="Record ID" id="publicationRecordId">
              <Input id="publicationRecordId" {...form.register("recordId")} />
            </Field>
            <Field label="Connector ID" id="publicationConnector">
              <Input
                id="publicationConnector"
                {...form.register("connectorId")}
              />
            </Field>
            <Field label="Destination key" id="outcomeDestination">
              <Input
                id="outcomeDestination"
                {...form.register("destinationKey")}
              />
            </Field>
            <Field label="Observed result" id="publicationResult">
              <Input id="publicationResult" {...form.register("result")} />
            </Field>
            <Field
              label="External identifier (optional)"
              id="externalIdentifier"
            >
              <Input
                id="externalIdentifier"
                {...form.register("externalIdentifier")}
              />
            </Field>
            <Field label="Failure reason (optional)" id="publicationFailure">
              <Textarea
                id="publicationFailure"
                {...form.register("failureReason")}
              />
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
          <OperationSubmitButton label={labels[operation]} onConfirm={() => { void form.handleSubmit((value) => { void submit(value); })(); }} operationId={operation} reason={form.watch("reason")} resource={form.watch("publicationId")} />
          <Button onClick={onClose} type="button" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
export function PublicationWorkspacePage() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const operation = operations.find((v) => v === search.get("action"));
  const [id, setId] = useState("");
  const publication = usePublicationGetPublicationQuery(id);
  if (operation)
    return (
      <div className="bba-page bba-page--narrow">
        <CommandForm
          onClose={() => {
            void navigate("/publications");
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
        <span className="bba-page__eyebrow">Publication</span>
        <h1>Publication preparation and evidence</h1>
        <p>No delivery runtime is invoked from this workspace.</p>
      </header>
      <div className="bba-grid">
        {operations.map((v) => (
          <Card key={v}>
            <h2>{labels[v]}</h2>
            <Link to={`/publications?action=${v}`}>Open action</Link>
          </Card>
        ))}
      </div>
      <Card>
        <form onSubmit={lookup}>
          <Field label="Publication lookup" id="publicationLookup">
            <Input id="publicationLookup" name="id" />
          </Field>
          <Button type="submit">Get Publication</Button>
        </form>
        {publication.data ? (
          <p>
            <Badge>{publication.data.status}</Badge> {publication.data.id}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
