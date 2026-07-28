# ADR-IMP-0026 - Review Session Model

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

A Review may require multiple focused human assessment sessions. Session
planning, active work, Findings and cancellation must remain auditable without
allowing concurrent active sessions or cancelled work to influence the final
conclusion.

## Normative sources

- `REQ-BBA-CORE-EPIC-IMP-008`
- `BBAPLT-GDE-037 - Quality Gates and Review Obligations`
- `BBAPLT-GDE-049 - Governance Rules`
- `ADR-IMP-0025 - Review Canonical Model`

## Decision

`ReviewSession` is owned exclusively by one Review and follows
`PLANNED -> ACTIVE -> CLOSED`, with `CANCELLED` available from `PLANNED` or
`ACTIVE`. A Review may have only one `ACTIVE` session.

Findings are immutable and remain permanently attached to their origin
session. Only Findings from `CLOSED` sessions are eligible for consolidation.
Findings from `CANCELLED` sessions remain in the snapshot and audit history but
are excluded from `ReviewConclusion`.

`ReviewConclusion` records normalized immutable IDs for contributing sessions
and considered Findings instead of copying their content.

## Consequences

The final conclusion has an explicit, deterministic provenance set. Cancelled
work remains inspectable without silently influencing an outcome.

## Validation

Tests cover session lifecycle, single-active-session enforcement, Finding
ownership, cancellation retention and conclusion contribution rules.

## Supersession

- Supersedes: -
- Superseded by: -
