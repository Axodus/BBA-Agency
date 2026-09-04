import { zodResolver } from "@hookform/resolvers/zod";
import { useMissionCreateMissionCommand } from "@bba/sdk-react";
import { Button, Card, Field, Input, Textarea } from "@bba/ui";
import { FormProvider, useForm } from "react-hook-form";
import { CommandFeedback } from "../../../shared/CommandFeedback.js";
import { CommandReceiptView } from "../../../shared/CommandReceiptView.js";
import { EvidenceLineageSection, ReasonField } from "../../../shared/forms/institutional-fields.js";
import { localTimestamp } from "../../../shared/forms/form-utils.js";
import { auditDefaults } from "../common.js";
import { mapCreateMission } from "./mapper.js";
import { createMissionSchema, type CreateMissionFormValues } from "./schema.js";

export function CreateMissionForm() {
  const command = useMissionCreateMissionCommand(); const now = localTimestamp(); const audit = auditDefaults(); const form = useForm<CreateMissionFormValues>({ resolver: zodResolver(createMissionSchema), defaultValues: { reason: "", missionId: "", title: "", summary: "", description: "", createdAt: now, updatedAt: now, purpose: "", objective: "", stewardReference: "", context: "", expectedOutcome: "", audience: "", evidence: audit.evidence, lineage: audit.lineage } });
  if (command.state.status === "COMMITTED") return <CommandReceiptView receipt={command.state.receipt} returnTo={`/missions/${command.state.receipt.resourceReferences[0]?.id ?? ""}`} />;
  return <FormProvider {...form}><form className="bba-form" onChange={command.edited} onSubmit={form.handleSubmit((values) => command.submit(mapCreateMission(values), values.reason))}><Card><h2>Mission identity</h2><Field label="Mission ID" id="missionId"><Input id="missionId" {...form.register("missionId")} /></Field><Field label="Title" id="title"><Input id="title" {...form.register("title")} /></Field><Field label="Summary" id="summary"><Textarea id="summary" {...form.register("summary")} /></Field><Field label="Description" id="description"><Textarea id="description" {...form.register("description")} /></Field><Field label="Created at" id="createdAt"><Input id="createdAt" type="datetime-local" {...form.register("createdAt")} /></Field><Field label="Updated at" id="updatedAt"><Input id="updatedAt" type="datetime-local" {...form.register("updatedAt")} /></Field></Card><Card><h2>Mission intent</h2><Field label="Purpose" id="purpose"><Input id="purpose" {...form.register("purpose")} /></Field><Field label="Objective" id="objective"><Textarea id="objective" {...form.register("objective")} /></Field><Field label="Steward reference" id="stewardReference"><Input id="stewardReference" {...form.register("stewardReference")} /></Field><Field label="Context" id="context"><Textarea id="context" {...form.register("context")} /></Field><Field label="Expected outcome" id="expectedOutcome"><Textarea id="expectedOutcome" {...form.register("expectedOutcome")} /></Field><Field label="Audience (optional)" id="audience"><Input id="audience" {...form.register("audience")} /></Field></Card><ReasonField /><EvidenceLineageSection /><CommandFeedback state={command.state} onRetry={() => { void command.retry(); }} /><Button disabled={command.state.status === "SUBMITTING"} type="submit">{command.state.status === "SUBMITTING" ? "Criando Mission" : "Criar Mission"}</Button></form></FormProvider>;
}
