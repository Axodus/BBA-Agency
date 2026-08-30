import { Button, ConfirmationDialog } from "@bba/ui";

const confirmations = new Map<string, "TERMINAL" | "AUTHORITY" | "IRREVERSIBLE" | "EXTERNAL_EFFECT">([
  ["governanceAssignAuthority", "AUTHORITY"], ["governanceApproveDecision", "AUTHORITY"], ["governanceRejectDecision", "AUTHORITY"], ["governanceFinalizeDecision", "AUTHORITY"],
  ["workflowArchiveWorkflow", "IRREVERSIBLE"], ["workflowAdvanceStage", "TERMINAL"], ["workflowRecordTaskState", "TERMINAL"], ["workflowRecordTaskFailure", "TERMINAL"], ["workflowCompleteWorkflow", "TERMINAL"], ["workflowCancelWorkflow", "TERMINAL"], ["workflowFailWorkflowExecution", "TERMINAL"],
  ["reviewCloseSession", "TERMINAL"], ["reviewCancelSession", "TERMINAL"], ["reviewCompleteReview", "TERMINAL"], ["reviewArchiveReview", "IRREVERSIBLE"],
  ["publicationAuthorizePublication", "AUTHORITY"], ["publicationRecordPublicationOutcome", "EXTERNAL_EFFECT"], ["publicationArchivePublication", "IRREVERSIBLE"],
  ["connectorRetireConnector", "IRREVERSIBLE"], ["connectorCompleteExecution", "TERMINAL"], ["connectorFailExecution", "TERMINAL"], ["connectorCancelExecution", "TERMINAL"]
]);
const consequences = { TERMINAL: "This records a terminal lifecycle transition.", AUTHORITY: "This records an exercise of institutional authority.", IRREVERSIBLE: "This operation cannot be casually reversed.", EXTERNAL_EFFECT: "This records evidence of an external effect." } as const;
export function OperationSubmitButton({ operationId, label, resource, reason, disabled = false, onConfirm }: { readonly operationId: string; readonly label: string; readonly resource: string; readonly reason: string; readonly disabled?: boolean; onConfirm(): void }) { const kind = confirmations.get(operationId); if (kind === undefined) return <Button disabled={disabled} type="submit">{label}</Button>; return <ConfirmationDialog confirmLabel={label} description={<><p>{consequences[kind]}</p><p>Resource: {resource || "Not identified"}</p><p>Operational reason: {reason || "Not provided"}</p></>} onConfirm={onConfirm} title={label} trigger={<Button disabled={disabled} type="button">Review {label}</Button>} />; }
