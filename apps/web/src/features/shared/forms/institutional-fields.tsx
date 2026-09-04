import { Button, Card, Field, Input, Textarea } from "@bba/ui";
import { useFieldArray, useFormContext } from "react-hook-form";

export interface EvidenceFormValue { readonly evidenceId: string; readonly source: string; readonly type: string; readonly capturedAt: string; }
export interface LineageFormValue { readonly sourceId: string; readonly targetId: string; readonly relationship: string; readonly declaredAt: string; }
export interface InstitutionalCommandFormValues { reason: string; occurredAt?: string; evidence?: EvidenceFormValue[]; lineage?: LineageFormValue[]; }

export function ReasonField() { const { register, formState } = useFormContext<InstitutionalCommandFormValues>(); const error = formState.errors.reason?.message; return <Field label="Operational reason" id="reason" {...(error === undefined ? {} : { error })}><Textarea id="reason" {...register("reason")} /></Field>; }

export function TimestampField({ name, label }: { readonly name: "occurredAt"; readonly label: string }) { const { register, formState } = useFormContext<InstitutionalCommandFormValues>(); const error = formState.errors.occurredAt?.message; return <Field label={label} id={name} {...(error === undefined ? {} : { error })}><Input id={name} type="datetime-local" {...register(name)} /></Field>; }

export function EvidenceFields() {
  const { control, register } = useFormContext<InstitutionalCommandFormValues>(); const fields = useFieldArray({ control, name: "evidence" });
  return <Card><h3>Evidence</h3>{fields.fields.map((field, index) => <fieldset className="bba-array-field" key={field.id}><legend>Evidence {index + 1}</legend><Input aria-label={`Evidence ${index + 1} ID`} {...register(`evidence.${index}.evidenceId`)} placeholder="Evidence ID" /><Input aria-label={`Evidence ${index + 1} source`} {...register(`evidence.${index}.source`)} placeholder="Source" /><Input aria-label={`Evidence ${index + 1} type`} {...register(`evidence.${index}.type`)} placeholder="Type" /><Input aria-label={`Evidence ${index + 1} captured at`} type="datetime-local" {...register(`evidence.${index}.capturedAt`)} /><Button onClick={() => fields.remove(index)} type="button" variant="ghost">Remover Evidence</Button></fieldset>)}<Button onClick={() => fields.append({ evidenceId: "", source: "", type: "", capturedAt: "" })} type="button" variant="secondary">Adicionar Evidence</Button></Card>;
}

export function LineageFields() {
  const { control, register } = useFormContext<InstitutionalCommandFormValues>(); const fields = useFieldArray({ control, name: "lineage" });
  return <Card><h3>Lineage</h3>{fields.fields.map((field, index) => <fieldset className="bba-array-field" key={field.id}><legend>Lineage {index + 1}</legend><Input aria-label={`Lineage ${index + 1} source`} {...register(`lineage.${index}.sourceId`)} placeholder="Source ID" /><Input aria-label={`Lineage ${index + 1} target`} {...register(`lineage.${index}.targetId`)} placeholder="Target ID" /><Input aria-label={`Lineage ${index + 1} relationship`} {...register(`lineage.${index}.relationship`)} placeholder="Relationship" /><Input aria-label={`Lineage ${index + 1} declared at`} type="datetime-local" {...register(`lineage.${index}.declaredAt`)} /><Button onClick={() => fields.remove(index)} type="button" variant="ghost">Remover Lineage</Button></fieldset>)}<Button onClick={() => fields.append({ sourceId: "", targetId: "", relationship: "", declaredAt: "" })} type="button" variant="secondary">Adicionar Lineage</Button></Card>;
}

export function AuditSection({ timestampLabel = "Occurred at" }: { readonly timestampLabel?: string }) { return <details className="bba-audit"><summary>Audit fields</summary><div className="bba-form"><TimestampField label={timestampLabel} name="occurredAt" /><EvidenceFields /><LineageFields /></div></details>; }
export function EvidenceLineageSection() { return <details className="bba-audit"><summary>Evidence and Lineage</summary><div className="bba-form"><EvidenceFields /><LineageFields /></div></details>; }
