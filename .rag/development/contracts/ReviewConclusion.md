# ReviewConclusion Contract

ReviewConclusion is the immutable, non-binding final assessment record. It is
not a Governance Decision, Approval, publication authorization or action.

It contains outcome, rationale, normalized contributingSessionIds,
consideredFindingIds, completionAuthorization and createdAt. Contributing IDs
refer only to CLOSED sessions. Finding IDs refer only to Findings owned by
those sessions.

CompletionAuthorization stores neutral Decision and Authority references from
Human Governance. It authorizes finalization of the Review record only.
