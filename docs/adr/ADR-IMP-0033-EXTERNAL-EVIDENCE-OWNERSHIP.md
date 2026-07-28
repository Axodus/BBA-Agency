# ADR-IMP-0033 — External Evidence Ownership

Status: ACCEPTED
Date: 2026-07-23

## Decision

Connector owns technical external evidence. Success and failure have
discriminated immutable evidence variants. Raw transport payloads, secrets and
institutional content are never persisted. A post-save observation delivery
failure is visible and cannot undo the persisted terminal execution.

Connector evidence does not authorize, approve or publish anything.
