# EPIC-IMP-016 — BBA Publisher Vertical Agency Prototype

Status: `IMPLEMENTATION_PROPOSAL`

## Objective

Demonstrate that a customer can choose BBA Publisher, supply Editorial
Context, follow a coordinated Agent team, govern two checkpoints, and receive
a traceable Editorial Package for Blog, LinkedIn, and Instagram.

The prototype validates Agency Experience → Agency Product → Agency Runtime →
BBA Platform. It does not certify Product Vision 2.0, publish externally, or
define `$Neurons` economics.

## Historical reorientation

EPIC-IMP-016 was reserved by EPIC-IMP-014 for Identity and Access Expansion.
The local implementation backlog now reorients it to the first Agency vertical
because the governed Product Vision handoff made the service-oriented product
boundary explicit. Login, refresh, persistent profiles, tenant switching, and
advanced authorization move to EPIC-IMP-020. This Epic preserves only the
existing ephemeral development identity plus ephemeral BYOK configuration.

## Product contract

- Family: BBA Publisher.
- Agency Product: `bba.publisher.multiplatform-publication@1.0.0`.
- Category: Publication Strategy.
- Outcome: convert Editorial Context into a coherent, reviewed, traceable
  multiplatform Editorial Package.
- Channels: Blog, LinkedIn, and Instagram.
- Runtime: deterministic by default; optional OpenAI or Anthropic BYOK.
- Human checkpoints: Editorial Core and final Editorial Package.

## Boundary

The Agency Runtime exists exclusively to orchestrate Agency Products. It never
replaces or replicates the Platform. Project, Project Workspace, Agency
Product, Editorial Core, and Editorial Package are composition or experience
models, not Platform Aggregates.

The Platform remains authoritative for Mission, Knowledge, Workflow, AI
Workforce, Institutional Assets, Review, Human Governance, and Publication.
Publication stops at preparation/ready state; no Connector executes.

## Customer journey

```text
How can we help?
→ Start Project
→ Supply Editorial Context
→ Confirm "You will receive"
→ Understand context
→ Approve Editorial Core
→ Plan strategy
→ Produce three channel variants
→ Validate consistency
→ Review Editorial Package
→ Copy or export delivery
```

## Prototype limitations

- Project and BYOK configuration are held in server memory.
- Cold start loses the Project projection and provider key.
- URLs are references only; file bytes are not uploaded.
- Channel profiles are illustrative.
- The deterministic path is the mandatory acceptance path; live provider
  smoke is optional and never runs in CI.
- No pricing, billing, financial unit, or external publication is implemented.

## Validation

```bash
pnpm agency:check
pnpm frontend:check
pnpm contracts:check
pnpm --dir core check
git diff --check
```

PASS requires the complete deterministic journey, protected BYOK boundary,
zero Platform regressions, zero secrets in browser/logs, an approved Editorial
Package, a clean worktree, and no push.

