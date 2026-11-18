# BBA — Scientific Research & Publishing

Product Definition, Operating Method and RAG Alignment

Version: v0.1 — Initial Canonical Product Specification  
Status: INTERNAL / RAG-READY / EXECUTIVE ALIGNMENT  
Date: 2026-11-18  
Owner: BBA Agency  
Scientific Governance: Chief Research Officer (CRO)  
Executive Authority: Axodus CEO / Presidency

## 1. Purpose

This document consolidates the initial product definition of BBA Scientific Research & Publishing and establishes a shared operating model for directors, agents, research workers and communication functions across Axodus.

The product formalizes the workflow already exercised during the development of the paper Human Authority and Institutional Intelligence in AI-Assisted Governance. That work is treated as the first reference implementation of the method.

The objective is not to reduce scientific work to “writing”. The capability covers the full chain from problem framing and evidence gathering to authorial approval, controlled external review and publication preparation.

This document is intended to be included in the BBA RAG and used as a common source of truth for product design, agent behavior, executive coordination and future workflow implementation.

## 2. Product Positioning

### 2.1 Canonical capability

BBA Scientific Research & Publishing is a BBA capability for turning a bounded question, institutional problem or research objective into a traceable scientific or research-grade artifact.

It combines:

- research framing;
- evidence and literature work;
- conceptual or methodological development;
- scientific drafting;
- adversarial and scientific review;
- authorial review;
- controlled external review;
- publication preparation.

### 2.2 What it is not

It is not:

- a generic copywriting service;
- a marketing content factory;
- a substitute for human authorship or scientific responsibility;
- an automatic publication pipeline;
- a mechanism for converting internal assumptions into scientific facts;
- a guarantee of novelty, empirical validity or publication acceptance.

### 2.3 Relationship to BBA

The capability lives inside BBA.

It should not be modeled as a parallel organization or independent agency.

BBA is the operating environment that coordinates research, synthesis, production, review and downstream communication.

## 3. Product Taxonomy

The following distinctions are canonical.

### Capability

Scientific Research & Publishing

The broad organizational capability.

### Service

Research Paper Development

A consumable service that may be requested by an Axodus nucleus, executive area, research initiative or future external client.

Other future services may include research briefs, literature syntheses, institutional studies, technical notes and scientific communication packages.

### Method

BBA Scientific Research Method

The repeatable operating protocol that governs evidence, roles, stages, review gates, provenance, versioning and authorial control.

### Workflow / Stage Model

Research & Evidence → Conceptual Development → Scientific Drafting → Scientific Review → Authorial Review → Controlled External Review → Publication Preparation

### Domain specialization

Applied Institutional Research is a specialization that operates through the same method.

It is not the entire product.

It addresses institutional and governance problems such as authority, delegation, accountability, organizational architecture, federated governance, traceability and human–AI institutional interaction.

## 4. Why “Scientific Writing” Is Insufficient

The label Scientific Writing should be retained only for the drafting stage.

The complete product includes activities that occur before and after writing.

The reference paper demonstrated that the actual workflow requires:

1. formulation of the research problem;
2. definition of scientific scope;
3. literature and evidence mapping;
4. construction or refinement of concepts;
5. comparison against existing work;
6. explicit control of claims and limitations;
7. scientific drafting;
8. adversarial review;
9. authorial review;
10. version and provenance control;
11. controlled external review;
12. publication targeting and preparation.

Therefore:

```text
SCIENTIFIC_WRITING = STAGE

SCIENTIFIC_RESEARCH_AND_PUBLISHING = CAPABILITY
```

## 5. Canonical Workflow

### Stage 0 — Intake and Research Framing

Purpose: convert an initial idea, institutional problem or business question into a bounded research object.

Core activities:

- identify sponsor and intended use;
- formulate the research question;
- define scope and exclusions;
- distinguish scientific objective from commercial or institutional objective;
- classify expected artifact;
- identify known assumptions and unresolved dependencies.

Primary output: Research Framing Record.

Gate: `RESEARCH_SCOPE_DEFINED`

### Stage 1 — Evidence & Literature

Purpose: establish the evidentiary and scholarly basis of the work.

Core activities:

- literature mapping;
- source qualification;
- evidence collection;
- comparator identification;
- terminology reconciliation;
- provenance registration;
- gap identification.

Rules:

- evidence must be distinguishable from inference;
- absence of evidence must not be rewritten as negative evidence;
- public literature, internal records and hypothetical scenarios must remain separately classified.

Primary output: Evidence & Literature Dossier.

Gate: `EVIDENCE_BASE_SUFFICIENT_FOR_DRAFTING`

### Stage 2 — Conceptual / Analytical Development

Purpose: organize the research object into a defensible conceptual, analytical or methodological structure.

Core activities:

- define constructs;
- define relationships;
- distinguish assumptions, propositions and findings;
- build frameworks, models or taxonomies where justified;
- compare with existing structures;
- define limitations and falsification conditions.

Primary output: Conceptual Architecture / Research Model.

Gate: `CONCEPTUAL_STRUCTURE_ACCEPTED`

### Stage 3 — Scientific Drafting

Purpose: transform the approved research structure into manuscript-quality scientific prose.

Core activities:

- abstract;
- introduction and research question;
- theoretical foundation;
- method;
- analysis;
- discussion;
- limitations;
- conclusion;
- references and disclosures.

Primary output: Scientific Draft Candidate.

Gate: `DRAFT_COMPLETE`

### Stage 4 — Scientific Review

Purpose: challenge the manuscript before authorial approval.

Core activities:

- internal scientific review;
- adversarial review;
- claim-strength verification;
- comparator review;
- citation reconciliation;
- methodological consistency;
- internal contradiction detection;
- boundary and limitation review.

Classification of findings:

- SCIENTIFIC_BLOCKER
- SCIENTIFIC_CORRECTION
- QUALIFICATION_REQUIRED
- EDITORIAL_RECOMMENDATION
- NO_ACTION

Primary output: Reviewed Candidate + Validation Record.

Gate: `SCIENTIFICALLY_READY_FOR_AUTHOR_REVIEW`

### Stage 5 — Authorial Review

Purpose: preserve human intellectual authority and responsibility.

The human author must be able to:

- review material changes;
- reject AI-generated or research-team interpretations;
- require changes in emphasis or framing;
- approve the final intellectual hierarchy;
- accept responsibility for the manuscript.

A full reread is not mandatory after every bounded revision. Focused review is acceptable when provenance and diffs are complete.

Primary output: Author-Approved Candidate.

Gate: `FINAL_AUTHOR_APPROVAL`

### Stage 6 — Controlled External Review

Purpose: obtain criticism from a bounded human audience before public circulation or submission.

Possible reviewers:

- internal Axodus participants;
- trusted project collaborators;
- domain specialists;
- selected external readers.

Controlled review is not equivalent to formal peer review.

Feedback should be classified as:

- SCIENTIFIC_BLOCKER
- SCIENTIFIC_RECOMMENDATION
- EDITORIAL_RECOMMENDATION
- CLARIFICATION
- DISAGREEMENT_NO_ACTION

Primary output: External Review Dossier.

Gate: `EXTERNAL_FEEDBACK_ADJUDICATED`

### Stage 7 — Publication Preparation

Purpose: prepare an approved manuscript for a specific publication route.

Activities may include:

- journal targeting;
- article-type selection;
- formatting;
- author metadata;
- disclosure statements;
- AI-assistance disclosure;
- conflict-of-interest statement;
- cover letter;
- preprint decision;
- submission package.

Publication preparation requires separate authorization.

Primary output: Submission-Ready Package.

Gate: `SUBMISSION_AUTHORIZED`

## 6. Governance and Authority

### CEO / Presidency

Owns:

- strategic authorization;
- product priority;
- institutional use;
- publication-level gates when material to Axodus;
- final escalation on authority, brand, economic or organizational implications.

Does not replace scientific review.

### CRO

Owns scientific governance of work classified as scientific or research-grade.

Responsibilities include:

- research standards;
- methodological quality;
- claim calibration;
- scientific review coordination;
- research provenance;
- reviewer adjudication;
- publication-readiness recommendation.

The CRO does not approve on behalf of the human author.

### BBA

Owns the operating product.

Responsibilities include:

- workflow orchestration;
- agent coordination;
- artifact production;
- research-to-communication translation;
- service packaging;
- operational templates;
- production traceability.

### Human Author

Owns final intellectual responsibility for any authored scientific manuscript.

Human author approval cannot be inferred from:

- a Git commit;
- an agent completion status;
- CRO acceptance;
- document generation;
- PDF compilation.

### CTO

Participates when the scientific work contains material technical architecture, implementation claims, software validation, security claims or technical feasibility assertions.

CTO technical validation is distinct from CRO scientific acceptance.

### CMO / Brand & Communications

Consumes approved research outputs for communication.

May:

- translate scientific findings into public narratives;
- design communication formats;
- adapt complexity to audience.

May not:

- strengthen scientific claims;
- convert hypotheses into results;
- omit material limitations in a way that changes meaning.

## 7. Agent Operating Model

Agents participating in the workflow must operate under explicit roles.

A recommended minimum pattern is:

- Research Coordinator: maintains scope, stage and dependencies.
- Literature Research Agent: searches, qualifies and organizes sources.
- Evidence Agent: assembles internal and external evidence with provenance.
- Conceptual Analysis Agent: structures constructs, comparisons and models.
- Scientific Drafting Agent: produces manuscript prose from accepted structures.
- Adversarial Reviewer: searches for unsupported claims, contradictions and failure cases.
- Citation / Bibliography Agent: reconciles citations, identifiers and references.
- Editorial Agent: improves clarity without changing scientific meaning.
- Publication Preparation Agent: prepares journal-specific materials only after authorization.

No agent receives autonomous authority to:

- declare scientific validity;
- approve authorship;
- authorize publication;
- suppress material negative findings;
- upgrade the certainty of a claim without evidence.

## 8. Evidence and Claim Discipline

Every material claim should be classifiable as one of:

- FACT
- SOURCE-SUPPORTED INTERPRETATION
- INFERENCE
- ASSUMPTION
- HYPOTHESIS
- SCENARIO
- NORMATIVE PREMISE
- RECOMMENDATION
- EMPIRICAL RESULT

The system must preserve differences between:

```text
DESIGNED ≠ IMPLEMENTED

IMPLEMENTED ≠ TESTED

TESTED ≠ VALIDATED

VALIDATED ≠ ACCEPTED

CONCEPTUAL COHERENCE ≠ EMPIRICAL EFFECTIVENESS

CONTROLLED EXTERNAL REVIEW ≠ PEER REVIEW

PDF GENERATED ≠ PUBLICATION AUTHORIZED
```

## 9. Versioning and Provenance

Every major artifact should include:

- artifact identifier;
- source artifact;
- status;
- author;
- responsible reviewer;
- date;
- change record;
- approval state;
- relevant hashes where appropriate.

Material revisions should preserve:

- source version;
- diff;
- reason for change;
- decision authority;
- whether scientific meaning changed.

Git history is evidence of repository state.

It is not, by itself, evidence of scientific or authorial authorization.

## 10. Research-to-Communication Handoff

Scientific Research & Publishing is upstream of BBA communication products.

The canonical flow is:

```text
RESEARCH
→ SCIENTIFIC / RESEARCH-GRADE ARTIFACT
→ APPROVED CLAIM SET
→ BBA COMMUNICATION STRATEGY
→ CONTENT / CAMPAIGN / SALES / EDUCATION
```

The handoff must include:

- what is established;
- what remains uncertain;
- what cannot be claimed;
- approved terminology;
- evidence sources;
- intended audience;
- context-specific limitations.

This allows scientific work to become raw material for institutional, educational, commercial and marketing communication without corrupting the underlying evidence.

## 11. Applied Institutional Research

Applied Institutional Research is the first explicit specialization of the capability.

It focuses on questions such as:

- institutional authority;
- governance architecture;
- delegation;
- accountability;
- contestability;
- federated governance;
- organizational intelligence;
- traceability;
- human–AI institutional interaction;
- governance mechanisms and levels.

Possible artifacts include:

- short papers;
- working papers;
- research briefs;
- institutional models;
- governance studies;
- experimental protocols;
- scenario analyses;
- comparative frameworks.

Not every Applied Institutional Research project must become an academic paper.

The research format should follow the question and the intended evidence standard.

## 12. Reference Implementation

The development of:

Human Authority and Institutional Intelligence in AI-Assisted Governance

is the first reference implementation of the method.

The process demonstrated, in practice:

- iterative research framing;
- literature reconciliation;
- conceptual development;
- scientific drafting;
- CRO review;
- targeted revision;
- explicit claim calibration;
- genealogy and provenance investigation;
- authorial realignment;
- controlled external review preparation;
- publication-boundary governance.

The reference case should be used to extract reusable templates and automation patterns.

It should not be treated as proof that the method is already optimized.

## 13. Product Refinement Agenda

The current specification is an initial product baseline.

The next refinement cycle should extract operational assets from the reference case:

1. standard intake form;
2. research framing template;
3. evidence dossier schema;
4. literature review protocol;
5. claim classification schema;
6. scientific review checklist;
7. adversarial review protocol;
8. authorial review package;
9. controlled external review package;
10. publication preparation checklist;
11. agent role definitions;
12. workflow state machine;
13. RAG metadata conventions;
14. quality and latency metrics.

## 14. RAG Usage Rules

This document should be treated as a product-level source of truth.

Agents retrieving it should infer:

- Scientific Research & Publishing belongs to BBA.
- Scientific Writing is one stage, not the complete product.
- Applied Institutional Research is a specialization within the capability.
- CRO governs scientific standards.
- BBA owns workflow orchestration and downstream translation.
- Human author approval is mandatory for authored scientific manuscripts.
- External review and publication are separate gates.
- Research outputs may feed marketing and commercial communication only through an explicit handoff that preserves claim boundaries.

When this document conflicts with a later explicitly approved product specification, the later approved specification supersedes it.

## 15. Canonical Product Statement

> **BBA Scientific Research & Publishing is a governed research-production capability that transforms bounded questions into traceable research-grade or scientific artifacts through evidence, conceptual development, drafting, review, human authorial control and controlled publication gates. Its outputs can subsequently be translated by BBA into institutional, educational, commercial and communication products without weakening evidence boundaries.**

## 16. Initial Status

```text
PRODUCT = BBA_SCIENTIFIC_RESEARCH_AND_PUBLISHING

PRODUCT_CLASS = BBA_CAPABILITY

SCIENTIFIC_WRITING = INTERNAL_STAGE

APPLIED_INSTITUTIONAL_RESEARCH = DOMAIN_SPECIALIZATION

RESEARCH_PAPER_DEVELOPMENT = INITIAL_SERVICE

BBA_SCIENTIFIC_RESEARCH_METHOD = METHOD_BASELINE

REFERENCE_IMPLEMENTATION = HUMAN_AUTHORITY_AND_INSTITUTIONAL_INTELLIGENCE_PAPER

STATUS = INITIAL_CANONICAL_SPECIFICATION

RAG_INGESTION = RECOMMENDED

EXECUTIVE_AND_AGENT_ALIGNMENT = REQUIRED

NEXT_STEP = OPERATIONAL_WORKFLOW_AND_TEMPLATE_EXTRACTION
```
