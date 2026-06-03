# BUB_AGENTS.md

Operational guidance for using bub-agents inside the BBA-Agency workspace.

## Purpose

Bub-agents are advisory execution-support agents for planning, architecture review, security review, QA, documentation, and implementation analysis. They do not override the latest user instruction, this workspace `.instructions`, repository reality, security constraints, or Axodus architecture principles.

The Coding Execution Agent remains responsible for final decisions, edits, validation, commit, and report.

## Workspace Context

Workspace: `BBA-Agency`

Repository root: `/mnt/d/Rede/Github/Axodus/BBA-Agency`

Primary responsibility: agency/business operations, client-facing workflows, service delivery metadata, and business process support.

## When To Use Bub-Agents

Use bub-agents for multi-file changes, architecture decisions, business workflow modeling, client/project data, API/service behavior, security-sensitive data handling, test planning, documentation updates, or sprint-level execution.

Do not use bub-agents for typo fixes, simple text changes, trivial imports, isolated formatting, or obvious one-line fixes.

## Roles

- Planner: task decomposition, affected files, execution order, risks, acceptance criteria.
- Architect: module boundaries, business workflow separation, Core/Governance/ACS compatibility.
- Backend: routes, services, validation, persistence, errors.
- Frontend: pages, layouts, client/project UI, responsive behavior.
- Web3: wallet or contract boundaries if present.
- Security: client data, secrets, permissions, unsafe assumptions.
- QA: acceptance criteria, regression, manual validation.
- Documentation: `.instructions`, README, decisions, workflow, readiness notes.

## Delegation Template

```md
# Bub-Agent Task
Role:
Workspace: BBA-Agency
Repository: /mnt/d/Rede/Github/Axodus/BBA-Agency
Task:
Relevant context:
Expected output:
- findings
- risks
- affected files
- recommended steps
- acceptance criteria
Constraints:
- Follow workspace `.instructions`.
- Keep client workflows separate from Core protocol ownership.
- Mark uncertainty clearly.
```

## Workspace-Specific Rules

- Client/project workflows belong to BBA-Agency, not Core.
- Do not expose client-sensitive data, secrets, or private operational details.
- Keep service delivery, billing, reporting, and access concepts separated.
- If Governance, ACS, or Marketplace state is referenced, distinguish source metadata from local business workflow.
- Mock business data must be clearly marked as mock.
- Avoid hardcoded production addresses, credentials, pricing, or commitments.
- Documentation should record workflow decisions that affect clients or operations.

## Conflict Resolution

Resolve conflicts in this order: latest user instruction, workspace `.instructions`, repository architecture, security requirements, smallest safe change, maintainability, bub-agent recommendation.

If unresolved, stop and report the blocker.

## Final Report

State whether bub-agents were used, roles used, key findings, accepted recommendations, rejected recommendations, tests run, and remaining risks.

## Commit Behavior

When a sprint is completed, run practical validation, check `git status`, commit the completed sprint, and report the commit hash.

Recommended commit format: `bba-agency: <short description>`

