# BBA Publisher — Product Narrative

Status: `IMPLEMENTATION_PROPOSAL`

Authority: local implementation narrative. The governed Product Vision in the
Documentation repository remains authoritative and currently non-normative.

## The promise

The purpose of this prototype is not to prove that an LLM can generate
content. It is to prove that a BBA Agency service can transform Editorial
Context supplied by a customer into complete communication deliverables using
a coordinated team of specialized Agents, explicit human control, factual
fidelity, and traceability.

The customer does not hire a workflow and does not operate Mission, Knowledge,
Review, Publication, or Connector as the primary experience. The customer
starts a Project and receives an Editorial Package.

```text
Editorial Context
    ↓
Project
    ↓
Specialized Agent team
    ↓
Editorial Package
```

## The customer problem

Publishing the same message across several channels is not a copy-and-paste
task. Every channel has a different format, rhythm, audience expectation, and
call to action. Independent prompts often introduce unsupported claims,
contradictions, or changes in positioning.

BBA Publisher creates one approved Editorial Core before adapting content. The
form may change; the governed message, facts, limitations, and intent remain
traceable.

## Editorial Context

Editorial Context is the source material and communication intent supplied by
the customer. It may include a brief, article, research, presentation, PDF,
standard, release, page, study, previous campaign, required facts, prohibited
claims, and references.

The prototype accepts pasted text, URL references, and file metadata. It does
not fetch URLs or upload file bytes. These limitations are visible and do not
change the broader product meaning of Editorial Context.

## Project and Project Workspace

A Project is the customer-facing engagement for one contracted Agency
Product. It is not a Domain Aggregate and is not a synonym for Mission. The
prototype maps each Project to one Mission as a local implementation choice.

The Project Workspace presents one coherent surface:

```text
Project
├── Context
├── Strategy
├── Content
├── Review
└── Delivery
```

## The team at work

The v1 Runtime uses four bounded responsibilities:

- Context Analyst understands the supplied context and creates the Editorial
  Core;
- Editorial Strategist creates the publication plan;
- Platform Adapter creates channel-specific content;
- Semantic Consistency Reviewer checks claims, constraints, and lineage.

The customer sees understandable stages: understanding context, planning
strategy, producing content, validating consistency, and awaiting review.
Four Agents are the v1 composition, not an architectural limit. Future product
versions may declare a different number of Agent responsibilities.

## What the customer receives

After confirming Editorial Context, the experience states explicitly:

```text
You will receive
✓ Editorial strategy
✓ Blog content
✓ LinkedIn content
✓ Instagram content
✓ Mandatory human review
```

The final Editorial Package contains the approved Editorial Core, publication
plan, three adapted pieces, review history, participating Agents, limitations,
and lineage. It is ready for customer use, not externally published.

## Why this is not a chatbot prompt

A chatbot can answer isolated requests. BBA Publisher establishes a contracted
outcome, materializes a versioned Service Composition, coordinates bounded
Agents, validates structured outputs, records Human Governance decisions, and
delivers one traceable package derived from one approved Editorial Core.

## Evolution pattern

The Publisher proves a repeatable Agency pattern without implementing the
other products in this Epic:

```text
BBA Agency
├── Publisher         → Editorial Package
├── Campaign          → Campaign Package
├── Scientific Writer → Scientific Package
├── Governance        → Governance Package
└── Research          → Research Package
```

Each future product requires its own Customer Outcome, composition, review
obligations, and deliverable package. None becomes a Platform Aggregate merely
because it is customer-facing.

