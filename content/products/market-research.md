---
schemaVersion: '1.0'
id: market-research
name: Market Research
category: Research
slug: market-research
route: /services/research
status: PLANNED
eyebrow: Market Research
headline: Turn a strategic question into evidence, insights, and actionable recommendations.
summary: Market Research is a planned product for turning a strategic question into a structured body of evidence, analysis, insights, and recommendations.
customerProblem: Strategic decisions need a transparent connection between the question, available sources, analysis, assumptions, patterns, and recommendations.
customerOutcome: A Research Package that makes evidence, limitations, insights, and decision-relevant recommendations reviewable.
primaryAudience:
  - Strategy teams
  - Product leaders
  - Market development teams
contentLanguage: English
applicationLanguage: English
availability:
  label: Planned
  code: PLANNED
  operationalOnStaticSite: false
seo:
  title: Market Research | BBA Agency
  description: Learn about BBA Agency's planned Market Research product for evidence-based market analysis and recommendations.
  canonicalPath: /services/research
navigation:
  previousProduct: governance-proposal
  nextProduct: null
relatedProducts:
  - advertising-campaign
  - governance-proposal
keywords:
  - market research
  - evidence synthesis
  - strategic insights
agentTeamStatus: CONCEPTUAL
agentTeam:
  - id: research-planner
    name: Research Planner
    responsibility: Defines scope, method, sources, and questions needed for the decision.
    stage: Research planning
  - id: market-analyst
    name: Market Analyst
    responsibility: Interprets market structure, alternatives, segments, and patterns.
    stage: Market analysis
  - id: evidence-collector
    name: Evidence Collector
    responsibility: Organizes available sources and their relevance to the research question.
    stage: Evidence collection
  - id: insight-synthesizer
    name: Insight Synthesizer
    responsibility: Connects patterns to decision-relevant insights.
    stage: Insight synthesis
  - id: recommendation-reviewer
    name: Recommendation Reviewer
    responsibility: Tests recommendations against evidence, assumptions, and limitations.
    stage: Recommendation review
workflow:
  - order: 1
    id: research-question
    label: Provide research question
    customerRole: Supplies decision context, market definition, segment, geography, competitors, data, constraints, depth, and intended decision.
    agencyRole: Clarifies the question and decision use.
    checkpoint: false
    expectedOutput: Research brief
  - order: 2
    id: scope-plan
    label: Confirm scope and research plan
    customerRole: Reviews scope, sources, assumptions, and required depth.
    agencyRole: Proposes research plan and evidence approach.
    checkpoint: true
    expectedOutput: Approved research plan
  - order: 3
    id: source-collection
    label: Organize sources and evidence
    customerRole: Provides available data and source context.
    agencyRole: Builds a source inventory and identifies gaps.
    checkpoint: false
    expectedOutput: Source inventory
  - order: 4
    id: market-analysis
    label: Analyze market
    customerRole: Clarifies relevant alternatives and segments.
    agencyRole: Examines market, competitors, audience, and patterns.
    checkpoint: false
    expectedOutput: Market analysis
  - order: 5
    id: insight-synthesis
    label: Synthesize insights
    customerRole: Reviews interpretation and decision relevance.
    agencyRole: Connects evidence to patterns, insights, and uncertainty.
    checkpoint: false
    expectedOutput: Insight synthesis
  - order: 6
    id: recommendation-review
    label: Review recommendations
    customerRole: Evaluates assumptions and practical tradeoffs.
    agencyRole: Tests recommendations against available evidence and limitations.
    checkpoint: true
    expectedOutput: Reviewed recommendations
  - order: 7
    id: human-approval
    label: Confirm delivery
    customerRole: Approves, rejects, or requests changes to the package.
    agencyRole: Records the decision and delivery record.
    checkpoint: true
    expectedOutput: Research Package
deliverables:
  - id: research-brief
    name: Research brief
    description: Decision question, market definition, scope, constraints, and intended use of findings.
    format:
      - structured view
    requiresApproval: true
  - id: source-inventory
    name: Source inventory
    description: Available sources, their relevance, gaps, and limitation notes.
    format:
      - structured view
    requiresApproval: false
  - id: market-analysis
    name: Market analysis
    description: Market overview, competitor or alternative analysis, audience findings, and patterns.
    format:
      - structured view
    requiresApproval: false
  - id: research-package
    name: Research Package
    description: Brief, plan, sources, analysis, insights, recommendations, evidence notes, limitations, and review record.
    format:
      - structured view
      - JSON export
    requiresApproval: true
---

# Market Research

## Overview

Market Research is a planned product for turning a strategic question into structured evidence, analysis, insights, and recommendations. This static page is informational and does not conduct research.

## The problem it addresses

Decision-makers can receive conclusions without a clear view of the question, sources, assumptions, market context, and limitations that produced them.

## Who it is for

It is intended for strategy teams, product leaders, and market development teams preparing evidence for a defined decision.

## What the customer provides

The customer provides the research question, business or decision context, market definition, audience or customer segment, geography, known competitors, existing data, constraints, required depth, and intended decision.

## What the Agency does

The conceptual team would plan research, organize sources, analyze the market and alternatives, synthesize patterns, and review recommendations against evidence and uncertainty.

## How the product works

Research Question leads to Scope and Research Plan, Source and Evidence Collection, Market Analysis, Pattern and Insight Synthesis, Recommendation Review, Human Approval, and a Research Package. The customer supplies context, confirms the plan, reviews recommendations, and receives the delivery.

## Agent team

Planned conceptual roles include Research Planner, Market Analyst, Evidence Collector, Insight Synthesizer, and Recommendation Reviewer. They are coordinated roles, not currently available operational agents.

## Human review and control

The customer confirms scope and research plan, evaluates recommendation assumptions, and decides whether the package is ready for delivery. Sensitive decisions require human and specialist review.

## What the customer receives

The Research Package would include a research brief, research plan, source inventory, market overview, competitor or alternative analysis, audience findings, trends and patterns, insights, recommendations, and evidence and limitation notes.

## Example project

**Illustrative example.** A product team is assessing entry into a new regional segment. It supplies its decision question, target geography, known alternatives, customer interviews, and constraints. At the plan checkpoint it narrows the segment definition. The conceptual package contains the source inventory, market analysis, findings, assumptions, recommendations, and review record.

## Quality and traceability

The proposed package would connect sources and assumptions to analysis, mark limitations, and make the basis of recommendations available for review.

## What the product does not do

Findings depend on source availability and quality. The product does not guarantee commercial outcomes; estimates must identify assumptions and uncertainty; sensitive decisions require human and specialist review. The product is planned.

## Availability

Planned. Market Research is not currently available in the prototype.

## Relationship to the BBA platform

This proposed service would present a research project, human checkpoints, and Research Package while internal technical coordination stays behind the customer experience.

## Frequently asked questions

### What does the customer need to provide?

The question, decision context, market and segment definitions, geography, alternatives, existing data, constraints, depth, and intended decision.

### Where does human review occur?

At research-plan confirmation, recommendation review, and delivery approval.

### What does the final package include?

It includes the brief, plan, source inventory, market and alternative analysis, audience findings, insights, recommendations, and limitation notes.

### What does the product not do?

It does not guarantee commercial outcomes or remove the need for human and specialist review of sensitive decisions.

### Is the product currently available?

No. Market Research is planned and not part of the current prototype.
