---
schemaVersion: '1.0'
id: scientific-article
name: Scientific Article
category: Scientific Writing
slug: scientific-article
route: /services/scientific-writing
status: PLANNED
eyebrow: Scientific Writing
headline: Organize evidence into a structured and reviewable scientific manuscript.
summary: Scientific Article is a planned product for organizing supplied research context into a structured manuscript package for expert review.
customerProblem: Research teams need to align evidence, argument, structure, references, and limitations without overstating what sources support.
customerOutcome: A reviewable Scientific Package that makes the manuscript, evidence relationships, and uncertainty visible.
primaryAudience:
  - Research teams
  - Scientific organizations
  - Technical authors
contentLanguage: English
applicationLanguage: English
availability:
  label: Planned
  code: PLANNED
  operationalOnStaticSite: false
seo:
  title: Scientific Article | BBA Agency
  description: Learn about BBA Agency's planned Scientific Article product for structured, reviewable manuscript preparation.
  canonicalPath: /services/scientific-writing
navigation:
  previousProduct: advertising-campaign
  nextProduct: governance-proposal
relatedProducts:
  - market-research
keywords:
  - scientific writing
  - evidence mapping
  - manuscript review
agentTeamStatus: CONCEPTUAL
agentTeam:
  - id: research-context-analyst
    name: Research Context Analyst
    responsibility: Interprets the question, objectives, methods, and supplied evidence.
    stage: Research context
  - id: evidence-mapper
    name: Evidence Mapper
    responsibility: Organizes evidence, references, support, and gaps.
    stage: Evidence mapping
  - id: scientific-structure-editor
    name: Scientific Structure Editor
    responsibility: Develops the manuscript structure and argument path.
    stage: Article structure
  - id: scientific-writer
    name: Scientific Writer
    responsibility: Drafts within agreed evidence and style boundaries.
    stage: Drafting
  - id: citation-consistency-reviewer
    name: Citation and Consistency Reviewer
    responsibility: Identifies citation, consistency, uncertainty, and limitation questions.
    stage: Review
workflow:
  - order: 1
    id: research-context
    label: Provide research context
    customerRole: Supplies question, objectives, methodology, results, references, authorship, and limitations.
    agencyRole: Organizes the research context.
    checkpoint: false
    expectedOutput: Research context summary
  - order: 2
    id: evidence-mapping
    label: Map evidence
    customerRole: Clarifies source relevance and gaps.
    agencyRole: Connects supplied evidence to claims and questions.
    checkpoint: false
    expectedOutput: Evidence map
  - order: 3
    id: scope-argument
    label: Confirm scope and argument
    customerRole: Reviews the proposed scope and argument.
    agencyRole: Frames a defensible argument path.
    checkpoint: true
    expectedOutput: Approved scope and argument
  - order: 4
    id: article-structure
    label: Develop article structure
    customerRole: Confirms target audience and style needs.
    agencyRole: Produces the manuscript outline.
    checkpoint: false
    expectedOutput: Manuscript outline
  - order: 5
    id: drafting
    label: Prepare draft
    customerRole: Provides scientific corrections.
    agencyRole: Produces a proposed draft and abstract.
    checkpoint: false
    expectedOutput: Article draft
  - order: 6
    id: citation-review
    label: Review citations and consistency
    customerRole: Reviews evidence and limitation findings.
    agencyRole: Identifies unsupported statements and citation questions.
    checkpoint: false
    expectedOutput: Review findings
  - order: 7
    id: scientific-review
    label: Conduct human scientific review
    customerRole: Authorized authors and experts review the manuscript.
    agencyRole: Records requested changes and decisions.
    checkpoint: true
    expectedOutput: Reviewed manuscript
  - order: 8
    id: scientific-package
    label: Assemble scientific package
    customerRole: Confirms delivery.
    agencyRole: Groups manuscript materials and the review record.
    checkpoint: true
    expectedOutput: Scientific Package
deliverables:
  - id: evidence-map
    name: Evidence map
    description: Structured connection between supplied sources, claims, gaps, and uncertainty.
    format:
      - structured view
    requiresApproval: true
  - id: manuscript-outline
    name: Manuscript outline
    description: Proposed article structure and argument sequence.
    format:
      - structured view
    requiresApproval: true
  - id: article-draft
    name: Article draft
    description: Proposed manuscript draft with abstract and keywords.
    format:
      - structured view
    requiresApproval: true
  - id: scientific-package
    name: Scientific Package
    description: Context, evidence map, outline, draft, citation map, limitations, and review findings.
    format:
      - structured view
      - JSON export
    requiresApproval: true
---

# Scientific Article

## Overview

Scientific Article is a planned product for research teams preparing a structured and reviewable manuscript from supplied evidence. It is an informational concept, not a writing action on this website.

## The problem it addresses

Scientific writing requires evidence, methodology, argument, references, and limitations to remain aligned. A draft that hides uncertainty or extends beyond its sources is not a reliable basis for expert review.

## Who it is for

It is intended for research teams, scientific organizations, and technical authors who need a disciplined manuscript preparation process.

## What the customer provides

The customer provides the research question, objectives, methodology, results or evidence, references, target publication or audience, authorship information, style and language requirements, and known limitations.

## What the Agency does

The conceptual team would map evidence, propose scope and argument, structure the article, prepare a draft, and highlight citation and consistency questions for scientific review.

## How the product works

Research Context leads to Evidence Mapping, Scope and Argument, Article Structure, Drafting, Citation and Consistency Review, Human Scientific Review, and a Scientific Package. The customer supplies materials, confirms interpretation, reviews decisions, and receives structured delivery.

## Agent team

Planned conceptual roles include Research Context Analyst, Evidence Mapper, Scientific Structure Editor, Scientific Writer, and Citation and Consistency Reviewer. Scientific authors and experts retain authority.

## Human review and control

Researchers review the scope and argument before drafting and conduct expert scientific review before delivery. Authorship, factual responsibility, and publication decisions remain human responsibilities.

## What the customer receives

The Scientific Package would include a research context summary, evidence map, proposed argument, manuscript outline, article draft, abstract, keywords, references or citation map, uncertainty and limitation notes, and review findings.

## Example project

**Illustrative example.** A university lab supplies a protocol, results table, references, target-journal guidance, and known limitations for an observational study. Its authors correct the proposed argument at a human checkpoint. The conceptual package groups the revised outline, draft, citation map, limitations, and review findings for author-led revision.

## Quality and traceability

The proposed process keeps supplied sources connected to the evidence map and records uncertainty and review findings so experts can assess the draft.

## What the product does not do

It does not fabricate evidence, replace scientific authorship or expert review, or guarantee journal acceptance. Citation validation depends on supplied or retrieved sources. Ethical, institutional, and publication requirements remain the customer's responsibility. The product is planned.

## Availability

Planned. Scientific Article is not currently available in the prototype.

## Relationship to the BBA platform

This proposed service would present research work as a customer project with expert checkpoints and a Scientific Package, while technical coordination stays behind the product experience.

## Frequently asked questions

### What does the customer need to provide?

The question, objectives, methodology, evidence, references, target, authorship information, style requirements, and known limitations.

### Where does human review occur?

At scope and argument confirmation, scientific expert review, and delivery.

### What does the final package include?

It includes the context summary, evidence map, outline, draft, abstract, keywords, citation map, limitations, and review findings.

### What does the product not do?

It does not invent evidence, replace authorship or expert review, or guarantee journal acceptance.

### Is the product currently available?

No. Scientific Article is planned and not part of the current prototype.
