import type { AgencyProjectContent } from "../project-content.types.js";

export const agencyProjects = [
  {
    "schemaVersion": "1.0",
    "id": "ai-content-governance-proposal",
    "name": "Institutional AI Content Governance Proposal",
    "slug": "ai-content-governance-proposal",
    "route": "/projects/ai-content-governance-proposal",
    "productId": "governance-proposal",
    "productName": "Governance Proposal",
    "productRoute": "/services/governance",
    "category": "Governance",
    "exampleStatus": "ILLUSTRATIVE_PLANNED",
    "packageName": "Institutional Package",
    "eyebrow": "Project example",
    "headline": "See how institutional context becomes a reviewable AI content governance proposal.",
    "summary": "An illustrative planned Project for organizing an institutional AI content governance question into evidence, alternatives, risks, and a proposal.",
    "customerObjective": "Prepare a clear governance proposal for AI-assisted content practices without making the institutional decision or providing legal advice.",
    "customerOutcome": "An Institutional Package with problem framing, stakeholder map, evidence synthesis, alternatives, proposal, risk review, and decision rationale.",
    "audience": [
      "Institutional stewards",
      "Governance decision-makers"
    ],
    "contentLanguage": "English",
    "applicationLanguage": "English",
    "availability": {
      "code": "ILLUSTRATIVE_PLANNED",
      "label": "Illustrative planned example",
      "operationalOnStaticSite": false
    },
    "prototype": {
      "available": false,
      "disclosure": "This Project illustrates the intended experience of a planned BBA Agency Product. It does not represent an operational implementation."
    },
    "seo": {
      "title": "Institutional AI Content Governance Proposal | BBA Agency",
      "description": "Learn how an illustrative Governance Proposal Project structures evidence, alternatives, review, and delivery.",
      "canonicalPath": "/projects/ai-content-governance-proposal"
    },
    "navigation": {
      "previousProject": "ai-publishing-research-article",
      "nextProject": "enterprise-ai-publishing-market-study"
    },
    "relatedProductId": "governance-proposal",
    "keywords": [
      "content governance",
      "institutional proposal",
      "stakeholder analysis",
      "human decision"
    ],
    "context": {
      "summary": "The fictional institution supplies existing content policies, stakeholder concerns, a governance problem, and procedural constraints.",
      "objectives": [
        "Define accountable AI-assisted content review practices for institutional use."
      ],
      "materials": [
        {
          "id": "governance-policy-brief",
          "name": "AI Content Governance Policy Brief",
          "type": "policy-brief",
          "description": "Customer-supplied policies, problem statement, stakeholder context, and decision constraints."
        }
      ],
      "trustedFacts": [
        {
          "id": "fact-001",
          "statement": "Existing policy requires human accountability for institutional communications.",
          "sourceReference": "governance-policy-brief"
        }
      ],
      "constraints": [
        "Do not make institutional decisions.",
        "Do not present authoritative legal advice."
      ],
      "requiredTerms": [
        "human governance",
        "institutional accountability"
      ],
      "prohibitedClaims": [
        "Guaranteed legal compliance",
        "Automated institutional authority"
      ],
      "uncertainties": [
        "Applicable legal and policy interpretation requires specialist verification."
      ]
    },
    "expectedOutcome": {
      "description": "The customer confirms a reviewable proposal scope before the planned team would assemble alternatives and risk considerations.",
      "packageName": "Institutional Package",
      "deliverableIds": [
        "institutional-context-summary",
        "problem-statement",
        "stakeholder-map",
        "evidence-synthesis",
        "alternatives-matrix",
        "governance-proposal",
        "risk-impact-review",
        "decision-rationale",
        "institutional-package"
      ],
      "checkpointIds": [
        "framing-approval",
        "alternative-selection",
        "final-package-approval"
      ],
      "knownLimitations": [
        "Specialist legal and policy verification remains necessary."
      ]
    },
    "workflow": [
      {
        "order": 1,
        "id": "receive-institutional-context",
        "label": "Institutional Context received",
        "objective": "Establish the governance problem, policies, stakeholders, and constraints.",
        "agencyActivity": "Organizes supplied institutional material and identifies gaps.",
        "customerInvolvement": "Provides policy references and intended decision context.",
        "agentRoleIds": [
          "institutional-context-analyst"
        ],
        "artifactIds": [
          "institutional-context-summary"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 2,
        "id": "frame-problem",
        "label": "Problem framed",
        "objective": "State the institutional question without deciding it.",
        "agencyActivity": "Produces a bounded problem statement and assumptions.",
        "customerInvolvement": "Confirms whether the framing reflects the institutional issue.",
        "agentRoleIds": [
          "institutional-context-analyst"
        ],
        "artifactIds": [
          "problem-statement"
        ],
        "humanCheckpoint": true,
        "decisionId": "framing-approval"
      },
      {
        "order": 3,
        "id": "analyze-stakeholders",
        "label": "Stakeholders analyzed",
        "objective": "Identify affected responsibilities and concerns.",
        "agencyActivity": "Organizes stakeholder relationships and relevant interests.",
        "customerInvolvement": "Clarifies roles and authority boundaries.",
        "agentRoleIds": [
          "stakeholder-analyst"
        ],
        "artifactIds": [
          "stakeholder-map"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 4,
        "id": "assess-evidence-alternatives",
        "label": "Evidence and alternatives assessed",
        "objective": "Compare supplied evidence, options, assumptions, and tradeoffs.",
        "agencyActivity": "Produces an evidence synthesis and alternatives matrix.",
        "customerInvolvement": "Adds relevant institutional context where needed.",
        "agentRoleIds": [
          "evidence-synthesizer",
          "alternatives-analyst"
        ],
        "artifactIds": [
          "evidence-synthesis",
          "alternatives-matrix"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 5,
        "id": "compose-proposal",
        "label": "Proposal composed",
        "objective": "Draft a defensible proposal from the assessed materials.",
        "agencyActivity": "Composes a proposed policy direction and implementation considerations.",
        "customerInvolvement": "Reviews the proposal as input to human decision-making.",
        "agentRoleIds": [
          "proposal-writer"
        ],
        "artifactIds": [
          "governance-proposal"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 6,
        "id": "review-risks-impacts",
        "label": "Risks and impacts reviewed",
        "objective": "Make uncertainty, impact, and risk considerations visible.",
        "agencyActivity": "Reviews the proposal against supplied constraints and alternatives.",
        "customerInvolvement": "Considers unresolved impacts and specialist review needs.",
        "agentRoleIds": [
          "risk-impact-reviewer"
        ],
        "artifactIds": [
          "risk-impact-review"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 7,
        "id": "human-decision-checkpoint",
        "label": "Human decision checkpoint",
        "objective": "Preserve authorized institutional judgment over alternatives.",
        "agencyActivity": "Presents alternatives, rationale, and risks without deciding for the institution.",
        "customerInvolvement": "Selects, rejects, or requests changes in the planned platform experience.",
        "agentRoleIds": [
          "alternatives-analyst",
          "proposal-writer"
        ],
        "artifactIds": [
          "alternatives-matrix",
          "decision-rationale"
        ],
        "humanCheckpoint": true,
        "decisionId": "alternative-selection"
      },
      {
        "order": 8,
        "id": "incorporate-governance-revisions",
        "label": "Revisions incorporated",
        "objective": "Update the proposal after human direction while retaining traceability.",
        "agencyActivity": "Revises affected proposal and rationale artifacts.",
        "customerInvolvement": "Provides change direction and confirms scope.",
        "agentRoleIds": [
          "proposal-writer"
        ],
        "artifactIds": [
          "governance-proposal",
          "decision-rationale"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 9,
        "id": "deliver-institutional-package",
        "label": "Institutional Package delivered",
        "objective": "Deliver the reviewed proposal materials and decision context.",
        "agencyActivity": "Assembles the Package with evidence, risks, and decision record.",
        "customerInvolvement": "Makes the final delivery decision in the intended platform experience.",
        "agentRoleIds": [
          "institutional-context-analyst"
        ],
        "artifactIds": [
          "institutional-package"
        ],
        "humanCheckpoint": true,
        "decisionId": "final-package-approval"
      }
    ],
    "agentTeam": {
      "status": "CONCEPTUAL",
      "roles": [
        {
          "id": "institutional-context-analyst",
          "name": "Institutional Context Analyst",
          "responsibility": "Interprets the governance problem, policies, constraints, and authority boundaries.",
          "stageIds": [
            "receive-institutional-context",
            "frame-problem",
            "deliver-institutional-package"
          ],
          "artifactIds": [
            "institutional-context-summary",
            "problem-statement",
            "institutional-package"
          ]
        },
        {
          "id": "stakeholder-analyst",
          "name": "Stakeholder Analyst",
          "responsibility": "Maps affected stakeholders and institutional concerns.",
          "stageIds": [
            "analyze-stakeholders"
          ],
          "artifactIds": [
            "stakeholder-map"
          ]
        },
        {
          "id": "evidence-synthesizer",
          "name": "Evidence Synthesizer",
          "responsibility": "Organizes supplied evidence and policy context.",
          "stageIds": [
            "assess-evidence-alternatives"
          ],
          "artifactIds": [
            "evidence-synthesis"
          ]
        },
        {
          "id": "alternatives-analyst",
          "name": "Alternatives Analyst",
          "responsibility": "Compares options, assumptions, and tradeoffs for human judgment.",
          "stageIds": [
            "assess-evidence-alternatives",
            "human-decision-checkpoint"
          ],
          "artifactIds": [
            "alternatives-matrix",
            "decision-rationale"
          ]
        },
        {
          "id": "proposal-writer",
          "name": "Proposal Writer",
          "responsibility": "Composes and revises a reviewable governance proposal.",
          "stageIds": [
            "compose-proposal",
            "human-decision-checkpoint",
            "incorporate-governance-revisions"
          ],
          "artifactIds": [
            "governance-proposal",
            "decision-rationale"
          ]
        },
        {
          "id": "risk-impact-reviewer",
          "name": "Risk and Impact Reviewer",
          "responsibility": "Makes risk, impact, and uncertainty considerations visible.",
          "stageIds": [
            "review-risks-impacts"
          ],
          "artifactIds": [
            "risk-impact-review"
          ]
        }
      ]
    },
    "humanDecisions": [
      {
        "id": "framing-approval",
        "name": "Problem framing approval",
        "stageId": "frame-problem",
        "purpose": "Confirm that the Project understood the institutional issue and scope.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Approval permits assessment of evidence and alternatives."
      },
      {
        "id": "alternative-selection",
        "name": "Governance alternative selection",
        "stageId": "human-decision-checkpoint",
        "purpose": "Preserve authorized human judgment over the proposed alternatives.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Selected direction informs proposal revisions but is not made by the Agency."
      },
      {
        "id": "final-package-approval",
        "name": "Final Package approval",
        "stageId": "deliver-institutional-package",
        "purpose": "Confirm the Institutional Package is suitable for delivery.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Approval permits delivery and does not constitute an institutional decision or legal advice."
      }
    ],
    "revisionExample": {
      "title": "Add a clearer exception-review path",
      "request": "The fictional customer requests a clearer review path for high-risk AI-assisted content exceptions.",
      "reason": "The first proposal does not sufficiently distinguish routine review from exceptional escalation.",
      "affectedArtifactIds": [
        "governance-proposal",
        "decision-rationale"
      ],
      "repeatedStageIds": [
        "compose-proposal",
        "review-risks-impacts"
      ],
      "preservedArtifactIds": [
        "problem-statement",
        "alternatives-matrix"
      ],
      "resultingVersion": "2",
      "traceabilityNote": "The revised proposal keeps the same policy brief, alternatives record, and authorized selection decision."
    },
    "deliverables": [
      {
        "id": "institutional-context-summary",
        "name": "Institutional Context Summary",
        "description": "Structured summary of the problem, policies, stakeholders, and constraints.",
        "purpose": "Establish accountable scope.",
        "format": [
          "structured view"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "problem-statement",
        "name": "Problem Statement",
        "description": "Bounded statement of the governance issue.",
        "purpose": "Support framing review.",
        "format": [
          "governance statement"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "stakeholder-map",
        "name": "Stakeholder Map",
        "description": "Affected roles, interests, and accountability context.",
        "purpose": "Make institutional context visible.",
        "format": [
          "stakeholder map"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "evidence-synthesis",
        "name": "Evidence Synthesis",
        "description": "Organized supplied policy and evidence context.",
        "purpose": "Support alternatives assessment.",
        "format": [
          "evidence summary"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "alternatives-matrix",
        "name": "Alternatives Matrix",
        "description": "Compared options, assumptions, tradeoffs, and constraints.",
        "purpose": "Support human decision-making.",
        "format": [
          "comparison matrix"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "governance-proposal",
        "name": "Governance Proposal",
        "description": "Reviewable proposed policy direction and implementation considerations.",
        "purpose": "Support institutional deliberation.",
        "format": [
          "proposal draft"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "risk-impact-review",
        "name": "Risk and Impact Review",
        "description": "Risks, impacts, uncertainty, and specialist verification needs.",
        "purpose": "Keep limitations visible.",
        "format": [
          "review record"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "decision-rationale",
        "name": "Decision Rationale",
        "description": "Record of human-selected direction and rationale.",
        "purpose": "Preserve human authority and traceability.",
        "format": [
          "decision record"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "institutional-package",
        "name": "Institutional Package",
        "description": "Reviewed proposal materials, alternatives, risks, and decision context.",
        "purpose": "Deliver a traceable governance result.",
        "format": [
          "structured package"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      }
    ],
    "traceability": [
      {
        "id": "trace-001",
        "sourceReference": "governance-policy-brief",
        "contextItem": "Existing policy requires human accountability for institutional communications.",
        "workflowStageId": "frame-problem",
        "agentRoleId": "institutional-context-analyst",
        "artifactId": "problem-statement",
        "artifactVersion": "1",
        "decisionId": "framing-approval",
        "rationale": "The framing retains the supplied accountability requirement and excludes automated institutional authority."
      }
    ],
    "limitations": [
      "This planned example does not make institutional decisions.",
      "It does not provide authoritative legal advice.",
      "Applicable laws and policies require specialist verification.",
      "It represents a planned product only."
    ],
    "sections": {
      "Overview": {
        "title": "Overview",
        "body": "This illustrative planned example explains how a Governance Proposal Project could organize institutional context into a reviewable proposal. The static website does not make decisions."
      },
      "Customer objective": {
        "title": "Customer objective",
        "body": "The fictional institution wants a proposal for accountable AI-assisted content practices that supports deliberation by authorized humans."
      },
      "Why this Project matters": {
        "title": "Why this Project matters",
        "body": "Institutional decisions need clear framing, stakeholders, evidence, alternatives, risks, and human rationale rather than a concealed automated recommendation."
      },
      "Context and materials": {
        "title": "Context and materials",
        "body": "The customer provides policy notes, stakeholder concerns, the governance problem, evidence, alternatives, and procedural constraints."
      },
      "Expected outcome": {
        "title": "Expected outcome",
        "body": "The expected Institutional Package contains a context summary, problem framing, stakeholder map, evidence synthesis, alternatives, proposal, risk review, and decision rationale."
      },
      "How the Project is executed": {
        "title": "How the Project is executed",
        "body": "The illustrative sequence receives context, frames the problem, analyzes stakeholders, assesses evidence and alternatives, composes a proposal, reviews risks, preserves a human decision checkpoint, incorporates revisions, and delivers the Package."
      },
      "Agent team": {
        "title": "Agent team",
        "body": "The illustrative proposed team includes institutional-context, stakeholder, evidence, alternatives, proposal, and risk roles. It does not exercise authority for an institution."
      },
      "Human checkpoints": {
        "title": "Human checkpoints",
        "body": "Authorized humans validate the framing, select or reject a direction, and review the final Package in the intended platform experience."
      },
      "Illustrative revision": {
        "title": "Illustrative revision",
        "body": "The revision adds a clearer exception-review path while preserving the approved framing and the traceable alternatives record."
      },
      "Deliverables and final Package": {
        "title": "Deliverables and final Package",
        "body": "The Institutional Package collects proposal artifacts, risks, alternatives, and human rationale. It is not legal advice or an active decision workflow."
      },
      "Traceability": {
        "title": "Traceability",
        "body": "The trace record relates a supplied policy brief to the problem statement, contributing role, version, and framing decision."
      },
      "Quality considerations": {
        "title": "Quality considerations",
        "body": "Review highlights authority boundaries, risks, and uncertainty. Specialist verification remains necessary for laws and institutional policy interpretation."
      },
      "Limitations": {
        "title": "Limitations",
        "body": "The planned product does not make institutional decisions or provide authoritative legal advice."
      },
      "Relationship to the functional platform": {
        "title": "Relationship to the functional platform",
        "body": "This Project illustrates the intended experience of a planned BBA Agency Product. It does not represent an operational implementation. Learn about the related [Governance Proposal Product](/services/governance)."
      },
      "Frequently asked questions": {
        "title": "Frequently asked questions",
        "body": "### What does the customer provide?\n\nThe customer provides the problem, policies, stakeholders, evidence, alternatives, and procedural constraints.\n\n### Which human approvals are required?\n\nThe intended experience includes framing approval, alternative selection, and final Package approval.\n\n### What does the final Package contain?\n\nIt contains the framing, stakeholder map, evidence, alternatives, proposal, risk review, and decision rationale.\n\n### What happens when changes are requested?\n\nAffected proposal artifacts are revised and reviewed again while the selected direction and source relationships remain visible.\n\n### Is this Project example operational?\n\nNo. It is an illustrative planned example and this static website does not execute Projects."
      }
    },
    "faq": [
      {
        "question": "What does the customer provide?",
        "answer": "The customer provides the problem, policies, stakeholders, evidence, alternatives, and procedural constraints."
      },
      {
        "question": "Which human approvals are required?",
        "answer": "The intended experience includes framing approval, alternative selection, and final Package approval."
      },
      {
        "question": "What does the final Package contain?",
        "answer": "It contains the framing, stakeholder map, evidence, alternatives, proposal, risk review, and decision rationale."
      },
      {
        "question": "What happens when changes are requested?",
        "answer": "Affected proposal artifacts are revised and reviewed again while the selected direction and source relationships remain visible."
      },
      {
        "question": "Is this Project example operational?",
        "answer": "No. It is an illustrative planned example and this static website does not execute Projects."
      }
    ],
    "sourcePath": "static/content/projects/ai-content-governance-proposal.md"
  },
  {
    "schemaVersion": "1.0",
    "id": "ai-publishing-research-article",
    "name": "AI-Assisted Publishing Research Article",
    "slug": "ai-publishing-research-article",
    "route": "/projects/ai-publishing-research-article",
    "productId": "scientific-article",
    "productName": "Scientific Article",
    "productRoute": "/services/scientific-writing",
    "category": "Scientific Writing",
    "exampleStatus": "ILLUSTRATIVE_PLANNED",
    "packageName": "Scientific Package",
    "eyebrow": "Project example",
    "headline": "See how supplied publishing research becomes a structured and reviewable scientific manuscript Package.",
    "summary": "An illustrative planned Project for preparing an AI-assisted publishing research article from customer-supplied evidence.",
    "customerObjective": "Organize supplied evidence into a careful research article about AI-assisted publishing without replacing authorship or scientific review.",
    "customerOutcome": "A Scientific Package with an evidence map, outline, draft manuscript, abstract, keywords, citation map, findings, and limitation notes.",
    "audience": [
      "Research leaders",
      "Academic and institutional reviewers"
    ],
    "contentLanguage": "English",
    "applicationLanguage": "English",
    "availability": {
      "code": "ILLUSTRATIVE_PLANNED",
      "label": "Illustrative planned example",
      "operationalOnStaticSite": false
    },
    "prototype": {
      "available": false,
      "disclosure": "This Project illustrates the intended experience of a planned BBA Agency Product. It does not represent an operational implementation."
    },
    "seo": {
      "title": "AI-Assisted Publishing Research Article | BBA Agency",
      "description": "Learn how an illustrative Scientific Article Project structures evidence, review, revision, and delivery.",
      "canonicalPath": "/projects/ai-publishing-research-article"
    },
    "navigation": {
      "previousProject": "responsible-ai-awareness-campaign",
      "nextProject": "ai-content-governance-proposal"
    },
    "relatedProductId": "scientific-article",
    "keywords": [
      "scientific writing",
      "evidence mapping",
      "citation review",
      "human review"
    ],
    "context": {
      "summary": "The fictional research team supplies a question, methodology context, references, evidence notes, and target-publication constraints.",
      "objectives": [
        "Prepare a reviewable article about governance and quality in AI-assisted publishing."
      ],
      "materials": [
        {
          "id": "publishing-research-brief",
          "name": "AI-Assisted Publishing Research Brief",
          "type": "research-brief",
          "description": "Customer-supplied research question, references, methodology context, and known limitations."
        }
      ],
      "trustedFacts": [
        {
          "id": "fact-001",
          "statement": "The supplied study material identifies human review as necessary for high-stakes publishing decisions.",
          "sourceReference": "publishing-research-brief"
        }
      ],
      "constraints": [
        "Do not fabricate evidence or citations.",
        "Preserve named author responsibility and expert review."
      ],
      "requiredTerms": [
        "AI-assisted publishing",
        "scientific review"
      ],
      "prohibitedClaims": [
        "Guaranteed journal acceptance",
        "Automated authorship replacement"
      ],
      "uncertainties": [
        "Citation completeness depends on the supplied or approved source set."
      ]
    },
    "expectedOutcome": {
      "description": "The customer confirms scope and argument before a planned team would prepare a reviewable manuscript Package.",
      "packageName": "Scientific Package",
      "deliverableIds": [
        "research-context-summary",
        "evidence-map",
        "article-outline",
        "draft-manuscript",
        "abstract",
        "keywords-list",
        "citation-map",
        "review-findings",
        "scientific-package"
      ],
      "checkpointIds": [
        "scope-approval",
        "scientific-review-approval",
        "final-package-approval"
      ],
      "knownLimitations": [
        "Expert review and author responsibility remain necessary."
      ]
    },
    "workflow": [
      {
        "order": 1,
        "id": "receive-research-context",
        "label": "Research Context received",
        "objective": "Establish the question, supplied evidence, methods context, and publication constraints.",
        "agencyActivity": "Organizes the research brief and identifies evidence gaps.",
        "customerInvolvement": "Provides references, methods context, and intended audience.",
        "agentRoleIds": [
          "research-context-analyst"
        ],
        "artifactIds": [
          "research-context-summary"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 2,
        "id": "map-evidence",
        "label": "Evidence mapped",
        "objective": "Connect supplied sources to questions, claims, and known gaps.",
        "agencyActivity": "Creates a reviewable evidence map without inventing support.",
        "customerInvolvement": "Clarifies disputed or missing source context.",
        "agentRoleIds": [
          "evidence-mapper"
        ],
        "artifactIds": [
          "evidence-map"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 3,
        "id": "confirm-scope-argument",
        "label": "Scope and argument confirmed",
        "objective": "Confirm a bounded argument and article scope.",
        "agencyActivity": "Presents an evidence-aware scope and argument proposal.",
        "customerInvolvement": "Approves, rejects, or requests changes in the planned platform experience.",
        "agentRoleIds": [
          "research-context-analyst",
          "scientific-structure-editor"
        ],
        "artifactIds": [
          "article-outline"
        ],
        "humanCheckpoint": true,
        "decisionId": "scope-approval"
      },
      {
        "order": 4,
        "id": "prepare-article-structure",
        "label": "Article structure prepared",
        "objective": "Organize sections, claims, evidence, and limitations.",
        "agencyActivity": "Develops a manuscript outline suitable for expert review.",
        "customerInvolvement": "Reviews structure guidance when needed.",
        "agentRoleIds": [
          "scientific-structure-editor"
        ],
        "artifactIds": [
          "article-outline"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 5,
        "id": "draft-manuscript",
        "label": "Manuscript drafted",
        "objective": "Prepare a draft within the approved argument and evidence boundary.",
        "agencyActivity": "Produces an attributable working draft, abstract, and keywords.",
        "customerInvolvement": "Maintains authorship authority and supplies corrections.",
        "agentRoleIds": [
          "scientific-writer"
        ],
        "artifactIds": [
          "draft-manuscript",
          "abstract",
          "keywords-list"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 6,
        "id": "review-citations-consistency",
        "label": "Citations and consistency reviewed",
        "objective": "Identify unsupported assertions, citation gaps, and internal inconsistencies.",
        "agencyActivity": "Produces citation and consistency findings for review.",
        "customerInvolvement": "Reviews findings that affect scientific claims.",
        "agentRoleIds": [
          "citation-reviewer",
          "consistency-reviewer"
        ],
        "artifactIds": [
          "citation-map",
          "review-findings"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 7,
        "id": "perform-scientific-review",
        "label": "Human scientific review performed",
        "objective": "Keep scientific authority with qualified human reviewers.",
        "agencyActivity": "Presents the draft, evidence map, and findings for review.",
        "customerInvolvement": "Approves, rejects, or requests revisions in the planned platform experience.",
        "agentRoleIds": [
          "consistency-reviewer"
        ],
        "artifactIds": [
          "review-findings"
        ],
        "humanCheckpoint": true,
        "decisionId": "scientific-review-approval"
      },
      {
        "order": 8,
        "id": "incorporate-revisions",
        "label": "Revisions incorporated",
        "objective": "Incorporate accepted review changes while preserving evidence relationships.",
        "agencyActivity": "Updates affected manuscript artifacts and citation findings.",
        "customerInvolvement": "Confirms substantive revision guidance.",
        "agentRoleIds": [
          "scientific-writer",
          "citation-reviewer"
        ],
        "artifactIds": [
          "draft-manuscript",
          "citation-map"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 9,
        "id": "deliver-scientific-package",
        "label": "Scientific Package delivered",
        "objective": "Deliver the reviewed manuscript materials and limitation notes.",
        "agencyActivity": "Assembles the final Package and review history.",
        "customerInvolvement": "Makes the final delivery decision in the intended platform experience.",
        "agentRoleIds": [
          "research-context-analyst"
        ],
        "artifactIds": [
          "scientific-package"
        ],
        "humanCheckpoint": true,
        "decisionId": "final-package-approval"
      }
    ],
    "agentTeam": {
      "status": "CONCEPTUAL",
      "roles": [
        {
          "id": "research-context-analyst",
          "name": "Research Context Analyst",
          "responsibility": "Interprets the question, methods context, evidence, and constraints.",
          "stageIds": [
            "receive-research-context",
            "confirm-scope-argument",
            "deliver-scientific-package"
          ],
          "artifactIds": [
            "research-context-summary",
            "article-outline",
            "scientific-package"
          ]
        },
        {
          "id": "evidence-mapper",
          "name": "Evidence Mapper",
          "responsibility": "Relates supplied sources to claims and evidence gaps.",
          "stageIds": [
            "map-evidence"
          ],
          "artifactIds": [
            "evidence-map"
          ]
        },
        {
          "id": "scientific-structure-editor",
          "name": "Scientific Structure Editor",
          "responsibility": "Organizes an evidence-aware argument and article structure.",
          "stageIds": [
            "confirm-scope-argument",
            "prepare-article-structure"
          ],
          "artifactIds": [
            "article-outline"
          ]
        },
        {
          "id": "scientific-writer",
          "name": "Scientific Writer",
          "responsibility": "Prepares a draft within approved evidence and authorship boundaries.",
          "stageIds": [
            "draft-manuscript",
            "incorporate-revisions"
          ],
          "artifactIds": [
            "draft-manuscript",
            "abstract",
            "keywords-list",
            "citation-map"
          ]
        },
        {
          "id": "citation-reviewer",
          "name": "Citation Reviewer",
          "responsibility": "Identifies citation support and unresolved reference issues.",
          "stageIds": [
            "review-citations-consistency",
            "incorporate-revisions"
          ],
          "artifactIds": [
            "citation-map",
            "review-findings"
          ]
        },
        {
          "id": "consistency-reviewer",
          "name": "Consistency Reviewer",
          "responsibility": "Reviews scientific consistency, limitation visibility, and findings.",
          "stageIds": [
            "review-citations-consistency",
            "perform-scientific-review"
          ],
          "artifactIds": [
            "review-findings"
          ]
        }
      ]
    },
    "humanDecisions": [
      {
        "id": "scope-approval",
        "name": "Scope and argument approval",
        "stageId": "confirm-scope-argument",
        "purpose": "Confirm that the article scope and argument remain supported by supplied evidence.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Approval permits article drafting within the stated boundary."
      },
      {
        "id": "scientific-review-approval",
        "name": "Human scientific review",
        "stageId": "perform-scientific-review",
        "purpose": "Keep substantive scientific judgment with qualified humans.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Review findings guide revisions; it does not replace authorship responsibility."
      },
      {
        "id": "final-package-approval",
        "name": "Final Package approval",
        "stageId": "deliver-scientific-package",
        "purpose": "Confirm that the complete Scientific Package is ready for delivery.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Approval permits delivery only and does not guarantee publication acceptance."
      }
    ],
    "revisionExample": {
      "title": "Clarify the evidence boundary in the discussion",
      "request": "The fictional customer requests clearer language distinguishing supplied findings from future research questions.",
      "reason": "The initial discussion could overstate what the available sources support.",
      "affectedArtifactIds": [
        "draft-manuscript",
        "citation-map"
      ],
      "repeatedStageIds": [
        "incorporate-revisions",
        "review-citations-consistency"
      ],
      "preservedArtifactIds": [
        "evidence-map",
        "article-outline"
      ],
      "resultingVersion": "2",
      "traceabilityNote": "The revised discussion remains linked to the same evidence map, review finding, and human scientific review."
    },
    "deliverables": [
      {
        "id": "research-context-summary",
        "name": "Research Context Summary",
        "description": "Structured summary of the question, methods context, sources, and constraints.",
        "purpose": "Establish the research starting point.",
        "format": [
          "structured view"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "evidence-map",
        "name": "Evidence Map",
        "description": "Relationship map between supplied sources, claims, and gaps.",
        "purpose": "Prevent unsupported assertions.",
        "format": [
          "evidence map"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "article-outline",
        "name": "Article Outline",
        "description": "Proposed argument and manuscript structure.",
        "purpose": "Support scope review.",
        "format": [
          "structured outline"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "draft-manuscript",
        "name": "Draft Manuscript",
        "description": "Reviewable working manuscript.",
        "purpose": "Support author and expert review.",
        "format": [
          "manuscript draft"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "abstract",
        "name": "Abstract",
        "description": "Concise manuscript summary.",
        "purpose": "State the proposed article contribution carefully.",
        "format": [
          "manuscript section"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "keywords-list",
        "name": "Keywords",
        "description": "Reviewable discovery terms for the article.",
        "purpose": "Support the manuscript package.",
        "format": [
          "keyword list"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "citation-map",
        "name": "Citation Map",
        "description": "Source-to-claim references and unresolved citation notes.",
        "purpose": "Make support relationships visible.",
        "format": [
          "citation record"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "review-findings",
        "name": "Review Findings",
        "description": "Scientific and consistency findings requiring attention.",
        "purpose": "Support qualified human review.",
        "format": [
          "review record"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "scientific-package",
        "name": "Scientific Package",
        "description": "Reviewed manuscript materials, evidence relationships, limitations, and decisions.",
        "purpose": "Deliver a traceable research-writing result.",
        "format": [
          "structured package"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      }
    ],
    "traceability": [
      {
        "id": "trace-001",
        "sourceReference": "publishing-research-brief",
        "contextItem": "The supplied study material identifies human review as necessary for high-stakes publishing decisions.",
        "workflowStageId": "confirm-scope-argument",
        "agentRoleId": "research-context-analyst",
        "artifactId": "article-outline",
        "artifactVersion": "1",
        "decisionId": "scope-approval",
        "rationale": "The outline preserves the supplied human-review boundary instead of claiming automated scientific authority."
      }
    ],
    "limitations": [
      "This planned example does not fabricate evidence.",
      "It does not replace named authorship or expert review.",
      "It does not guarantee journal acceptance.",
      "Citation quality depends on the available source set."
    ],
    "sections": {
      "Overview": {
        "title": "Overview",
        "body": "This is an illustrative planned example of how a Scientific Article Project could organize supplied evidence into a reviewable manuscript Package. The static website does not write or submit an article."
      },
      "Customer objective": {
        "title": "Customer objective",
        "body": "The fictional research team wants to prepare a careful article about AI-assisted publishing while retaining author and expert responsibility."
      },
      "Why this Project matters": {
        "title": "Why this Project matters",
        "body": "Scientific writing needs evidence, argument, references, and limitations to remain connected. A visible evidence map helps reviewers assess what the draft can support."
      },
      "Context and materials": {
        "title": "Context and materials",
        "body": "The customer supplies a research brief, references, methodology context, target audience, publication constraints, and known limitations."
      },
      "Expected outcome": {
        "title": "Expected outcome",
        "body": "The expected Scientific Package contains a context summary, evidence map, outline, manuscript draft, abstract, keywords, citation map, review findings, and limitation notes."
      },
      "How the Project is executed": {
        "title": "How the Project is executed",
        "body": "The illustrative sequence receives research context, maps evidence, confirms scope, structures and drafts the article, reviews citations, performs human scientific review, incorporates revisions, and delivers the Package."
      },
      "Agent team": {
        "title": "Agent team",
        "body": "The illustrative proposed team includes research-context, evidence, structure, writing, citation, and consistency roles. It does not represent operational authorship or live execution."
      },
      "Human checkpoints": {
        "title": "Human checkpoints",
        "body": "Human reviewers validate the scope and argument, perform scientific review, and decide whether the final Package is suitable for delivery."
      },
      "Illustrative revision": {
        "title": "Illustrative revision",
        "body": "The revision clarifies the evidence boundary in the discussion while preserving the evidence map and agreed article structure."
      },
      "Deliverables and final Package": {
        "title": "Deliverables and final Package",
        "body": "The Scientific Package groups manuscript artifacts, source relationships, review findings, and limitations. It is not an active submission or export on this website."
      },
      "Traceability": {
        "title": "Traceability",
        "body": "The trace record relates a supplied research brief to the outline, contributing role, version, and scope decision."
      },
      "Quality considerations": {
        "title": "Quality considerations",
        "body": "Citation and consistency review highlight support gaps and uncertainty. Qualified human reviewers retain responsibility for scientific judgments."
      },
      "Limitations": {
        "title": "Limitations",
        "body": "The planned product does not fabricate evidence, replace authorship or expert review, or guarantee journal acceptance."
      },
      "Relationship to the functional platform": {
        "title": "Relationship to the functional platform",
        "body": "This Project illustrates the intended experience of a planned BBA Agency Product. It does not represent an operational implementation. Learn about the related [Scientific Article Product](/services/scientific-writing)."
      },
      "Frequently asked questions": {
        "title": "Frequently asked questions",
        "body": "### What does the customer provide?\n\nThe customer provides the question, methods context, evidence, references, audience, and publication constraints.\n\n### Which human approvals are required?\n\nThe intended experience includes scope approval, human scientific review, and final Package approval.\n\n### What does the final Package contain?\n\nIt contains the evidence map, outline, draft, abstract, keywords, citation map, findings, limitations, and decision history.\n\n### What happens when changes are requested?\n\nAffected manuscript and citation artifacts are revised and reviewed again while prior evidence relationships remain traceable.\n\n### Is this Project example operational?\n\nNo. It is an illustrative planned example and this static website does not execute Projects."
      }
    },
    "faq": [
      {
        "question": "What does the customer provide?",
        "answer": "The customer provides the question, methods context, evidence, references, audience, and publication constraints."
      },
      {
        "question": "Which human approvals are required?",
        "answer": "The intended experience includes scope approval, human scientific review, and final Package approval."
      },
      {
        "question": "What does the final Package contain?",
        "answer": "It contains the evidence map, outline, draft, abstract, keywords, citation map, findings, limitations, and decision history."
      },
      {
        "question": "What happens when changes are requested?",
        "answer": "Affected manuscript and citation artifacts are revised and reviewed again while prior evidence relationships remain traceable."
      },
      {
        "question": "Is this Project example operational?",
        "answer": "No. It is an illustrative planned example and this static website does not execute Projects."
      }
    ],
    "sourcePath": "static/content/projects/ai-publishing-research-article.md"
  },
  {
    "schemaVersion": "1.0",
    "id": "enterprise-ai-publishing-market-study",
    "name": "Enterprise AI Publishing Market Study",
    "slug": "enterprise-ai-publishing-market-study",
    "route": "/projects/enterprise-ai-publishing-market-study",
    "productId": "market-research",
    "productName": "Market Research",
    "productRoute": "/services/research",
    "category": "Research",
    "exampleStatus": "ILLUSTRATIVE_PLANNED",
    "packageName": "Research Package",
    "eyebrow": "Project example",
    "headline": "See how an enterprise publishing question becomes a structured evidence and insight Package.",
    "summary": "An illustrative planned Project for studying enterprise AI publishing needs, market signals, assumptions, and decision-relevant recommendations.",
    "customerObjective": "Understand the enterprise AI publishing landscape well enough to inform a product-positioning decision without guaranteeing a commercial outcome.",
    "customerOutcome": "A Research Package with research scope, source inventory, market overview, patterns, insights, recommendations, and recorded limitations.",
    "audience": [
      "Product leaders",
      "Enterprise strategy teams"
    ],
    "contentLanguage": "English",
    "applicationLanguage": "English",
    "availability": {
      "code": "ILLUSTRATIVE_PLANNED",
      "label": "Illustrative planned example",
      "operationalOnStaticSite": false
    },
    "prototype": {
      "available": false,
      "disclosure": "This Project illustrates the intended experience of a planned BBA Agency Product. It does not represent an operational implementation."
    },
    "seo": {
      "title": "Enterprise AI Publishing Market Study | BBA Agency",
      "description": "Learn how an illustrative Market Research Project structures sources, analysis, limitations, and delivery.",
      "canonicalPath": "/projects/enterprise-ai-publishing-market-study"
    },
    "navigation": {
      "previousProject": "ai-content-governance-proposal",
      "nextProject": null
    },
    "relatedProductId": "market-research",
    "keywords": [
      "market research",
      "enterprise publishing",
      "source quality",
      "research limitations"
    ],
    "context": {
      "summary": "The fictional customer supplies a market question, decision context, initial sources, research boundaries, and expected depth.",
      "objectives": [
        "Identify enterprise AI publishing patterns, needs, and uncertainties relevant to a positioning decision."
      ],
      "materials": [
        {
          "id": "market-study-brief",
          "name": "Enterprise AI Publishing Market Brief",
          "type": "research-brief",
          "description": "Customer-supplied question, decision context, seed sources, scope boundaries, and expected depth."
        }
      ],
      "trustedFacts": [
        {
          "id": "fact-001",
          "statement": "The customer needs evidence and explicit limitations before making a product-positioning decision.",
          "sourceReference": "market-study-brief"
        }
      ],
      "constraints": [
        "Separate observed evidence from assumptions.",
        "Identify source-quality limitations."
      ],
      "requiredTerms": [
        "enterprise AI publishing",
        "research limitations"
      ],
      "prohibitedClaims": [
        "Guaranteed market demand",
        "Guaranteed commercial outcome"
      ],
      "uncertainties": [
        "Available sources may not represent every enterprise segment or geography."
      ]
    },
    "expectedOutcome": {
      "description": "The customer confirms the research question and scope before a planned team would gather, analyze, and synthesize evidence.",
      "packageName": "Research Package",
      "deliverableIds": [
        "research-brief",
        "research-plan",
        "source-inventory",
        "market-overview",
        "competitor-analysis",
        "trends-patterns",
        "insights",
        "recommendations",
        "assumptions-limitations",
        "research-package"
      ],
      "checkpointIds": [
        "scope-approval",
        "recommendation-review",
        "final-package-approval"
      ],
      "knownLimitations": [
        "Findings depend on available source quality and declared assumptions."
      ]
    },
    "workflow": [
      {
        "order": 1,
        "id": "receive-research-question",
        "label": "Research Question received",
        "objective": "Establish the decision context, question, scope boundary, and expected depth.",
        "agencyActivity": "Records the brief and identifies initial source needs.",
        "customerInvolvement": "Provides the strategic question, seed sources, and decision context.",
        "agentRoleIds": [
          "research-planner"
        ],
        "artifactIds": [
          "research-brief"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 2,
        "id": "define-scope-plan",
        "label": "Scope and research plan defined",
        "objective": "Confirm a feasible research scope and approach.",
        "agencyActivity": "Proposes questions, source categories, assumptions, and research boundaries.",
        "customerInvolvement": "Approves, rejects, or requests changes in the planned platform experience.",
        "agentRoleIds": [
          "research-planner"
        ],
        "artifactIds": [
          "research-plan"
        ],
        "humanCheckpoint": true,
        "decisionId": "scope-approval"
      },
      {
        "order": 3,
        "id": "collect-sources",
        "label": "Sources collected",
        "objective": "Organize supplied and approved sources with quality notes.",
        "agencyActivity": "Builds a source inventory and identifies coverage gaps.",
        "customerInvolvement": "Provides additional sources when relevant.",
        "agentRoleIds": [
          "source-analyst"
        ],
        "artifactIds": [
          "source-inventory"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 4,
        "id": "analyze-market-evidence",
        "label": "Market evidence analyzed",
        "objective": "Assess market context and alternatives from available sources.",
        "agencyActivity": "Produces a market overview and competitor analysis with stated evidence boundaries.",
        "customerInvolvement": "Clarifies the decision context when findings need interpretation.",
        "agentRoleIds": [
          "market-analyst",
          "competitor-analyst"
        ],
        "artifactIds": [
          "market-overview",
          "competitor-analysis"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 5,
        "id": "synthesize-patterns-insights",
        "label": "Patterns and insights synthesized",
        "objective": "Distinguish observed patterns from interpretive insights.",
        "agencyActivity": "Creates a reviewable patterns and insights synthesis.",
        "customerInvolvement": "Reviews whether insights address the decision question.",
        "agentRoleIds": [
          "insight-synthesizer"
        ],
        "artifactIds": [
          "trends-patterns",
          "insights"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 6,
        "id": "review-recommendations",
        "label": "Recommendations reviewed",
        "objective": "Test recommendations against evidence, assumptions, and limitations.",
        "agencyActivity": "Produces decision-relevant recommendations and review notes.",
        "customerInvolvement": "Reviews, rejects, or requests changes in the planned platform experience.",
        "agentRoleIds": [
          "recommendation-reviewer"
        ],
        "artifactIds": [
          "recommendations"
        ],
        "humanCheckpoint": true,
        "decisionId": "recommendation-review"
      },
      {
        "order": 7,
        "id": "record-assumptions-limitations",
        "label": "Assumptions and limitations recorded",
        "objective": "Make source coverage, uncertainty, and assumptions explicit.",
        "agencyActivity": "Records limitations alongside the research conclusions.",
        "customerInvolvement": "Confirms any material scope caveats.",
        "agentRoleIds": [
          "recommendation-reviewer"
        ],
        "artifactIds": [
          "assumptions-limitations"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 8,
        "id": "customer-approval",
        "label": "Customer approval",
        "objective": "Confirm that the complete research result is suitable for delivery.",
        "agencyActivity": "Presents findings, recommendations, assumptions, and traceability.",
        "customerInvolvement": "Approves, rejects, or requests changes in the planned platform experience.",
        "agentRoleIds": [
          "research-planner"
        ],
        "artifactIds": [
          "research-package"
        ],
        "humanCheckpoint": true,
        "decisionId": "final-package-approval"
      },
      {
        "order": 9,
        "id": "deliver-research-package",
        "label": "Research Package delivered",
        "objective": "Deliver the reviewed research materials without guaranteeing an external outcome.",
        "agencyActivity": "Assembles the final Package and decision history.",
        "customerInvolvement": "Receives the illustrative delivery.",
        "agentRoleIds": [
          "research-planner"
        ],
        "artifactIds": [
          "research-package"
        ],
        "humanCheckpoint": false
      }
    ],
    "agentTeam": {
      "status": "CONCEPTUAL",
      "roles": [
        {
          "id": "research-planner",
          "name": "Research Planner",
          "responsibility": "Defines scope, research plan, Package assembly, and stated assumptions.",
          "stageIds": [
            "receive-research-question",
            "define-scope-plan",
            "customer-approval",
            "deliver-research-package"
          ],
          "artifactIds": [
            "research-brief",
            "research-plan",
            "research-package"
          ]
        },
        {
          "id": "source-analyst",
          "name": "Source Analyst",
          "responsibility": "Organizes sources and records coverage or quality gaps.",
          "stageIds": [
            "collect-sources"
          ],
          "artifactIds": [
            "source-inventory"
          ]
        },
        {
          "id": "market-analyst",
          "name": "Market Analyst",
          "responsibility": "Analyzes available market evidence and context.",
          "stageIds": [
            "analyze-market-evidence"
          ],
          "artifactIds": [
            "market-overview"
          ]
        },
        {
          "id": "competitor-analyst",
          "name": "Competitor Analyst",
          "responsibility": "Compares available alternatives and competitor signals.",
          "stageIds": [
            "analyze-market-evidence"
          ],
          "artifactIds": [
            "competitor-analysis"
          ]
        },
        {
          "id": "insight-synthesizer",
          "name": "Insight Synthesizer",
          "responsibility": "Separates observed patterns from decision-relevant insights.",
          "stageIds": [
            "synthesize-patterns-insights"
          ],
          "artifactIds": [
            "trends-patterns",
            "insights"
          ]
        },
        {
          "id": "recommendation-reviewer",
          "name": "Recommendation Reviewer",
          "responsibility": "Tests recommendations against evidence, assumptions, and limitations.",
          "stageIds": [
            "review-recommendations",
            "record-assumptions-limitations"
          ],
          "artifactIds": [
            "recommendations",
            "assumptions-limitations"
          ]
        }
      ]
    },
    "humanDecisions": [
      {
        "id": "scope-approval",
        "name": "Research scope approval",
        "stageId": "define-scope-plan",
        "purpose": "Confirm the question, boundaries, and planned evidence approach.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Approval permits evidence collection within the stated scope."
      },
      {
        "id": "recommendation-review",
        "name": "Recommendation review",
        "stageId": "review-recommendations",
        "purpose": "Confirm that recommendations remain connected to evidence and limitations.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Review guidance shapes recommendation revisions and limitation notes."
      },
      {
        "id": "final-package-approval",
        "name": "Final Package approval",
        "stageId": "customer-approval",
        "purpose": "Confirm that the Research Package is suitable for delivery.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Approval permits delivery only and does not guarantee a commercial outcome."
      }
    ],
    "revisionExample": {
      "title": "Separate a regional estimate from the broader market conclusion",
      "request": "The fictional customer asks to make a regional source limitation more prominent in the recommendation section.",
      "reason": "The available sources are strong for one region but incomplete for the full enterprise market.",
      "affectedArtifactIds": [
        "recommendations",
        "assumptions-limitations"
      ],
      "repeatedStageIds": [
        "review-recommendations",
        "record-assumptions-limitations"
      ],
      "preservedArtifactIds": [
        "source-inventory",
        "market-overview"
      ],
      "resultingVersion": "2",
      "traceabilityNote": "The revised recommendation retains its source inventory and explicitly records the changed assumption boundary."
    },
    "deliverables": [
      {
        "id": "research-brief",
        "name": "Research Brief",
        "description": "Structured record of the question, decision context, and scope boundary.",
        "purpose": "Establish accountable research intent.",
        "format": [
          "structured view"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "research-plan",
        "name": "Research Plan",
        "description": "Proposed questions, source categories, scope, and approach.",
        "purpose": "Support scope approval.",
        "format": [
          "research plan"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "source-inventory",
        "name": "Source Inventory",
        "description": "Available sources with relevance and quality notes.",
        "purpose": "Make coverage visible.",
        "format": [
          "source record"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "market-overview",
        "name": "Market Overview",
        "description": "Evidence-based overview of the studied market context.",
        "purpose": "Ground interpretation in stated sources.",
        "format": [
          "analysis summary"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "competitor-analysis",
        "name": "Competitor Analysis",
        "description": "Reviewable comparison of available alternative signals.",
        "purpose": "Inform the market view.",
        "format": [
          "comparison analysis"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "trends-patterns",
        "name": "Trends and Patterns",
        "description": "Observed patterns separated from assumptions.",
        "purpose": "Support transparent synthesis.",
        "format": [
          "pattern summary"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "insights",
        "name": "Insights",
        "description": "Decision-relevant interpretation of observed patterns.",
        "purpose": "Address the customer question.",
        "format": [
          "insight set"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "recommendations",
        "name": "Recommendations",
        "description": "Evidence-aware recommendations with stated boundaries.",
        "purpose": "Support human decision-making.",
        "format": [
          "recommendation set"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "assumptions-limitations",
        "name": "Assumptions and Limitations",
        "description": "Declared source coverage, uncertainty, and estimation assumptions.",
        "purpose": "Prevent overinterpretation.",
        "format": [
          "limitation record"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "research-package",
        "name": "Research Package",
        "description": "Reviewed research artifacts, recommendations, limitations, and decisions.",
        "purpose": "Deliver a traceable research result.",
        "format": [
          "structured package"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      }
    ],
    "traceability": [
      {
        "id": "trace-001",
        "sourceReference": "market-study-brief",
        "contextItem": "The customer needs evidence and explicit limitations before making a product-positioning decision.",
        "workflowStageId": "define-scope-plan",
        "agentRoleId": "research-planner",
        "artifactId": "research-plan",
        "artifactVersion": "1",
        "decisionId": "scope-approval",
        "rationale": "The research plan requires source-quality notes and declared assumptions before recommendations are reviewed."
      }
    ],
    "limitations": [
      "Findings depend on the quality and coverage of available sources.",
      "Estimates must identify their assumptions.",
      "The example does not guarantee a commercial outcome.",
      "It represents a planned product only."
    ],
    "sections": {
      "Overview": {
        "title": "Overview",
        "body": "This illustrative planned example explains how a Market Research Project could organize an enterprise AI publishing question into evidence, insights, recommendations, and limitations. The static website does not conduct research."
      },
      "Customer objective": {
        "title": "Customer objective",
        "body": "The fictional customer wants a research-based view of enterprise AI publishing needs to inform a product-positioning decision."
      },
      "Why this Project matters": {
        "title": "Why this Project matters",
        "body": "Market conclusions are unreliable when source quality, uncertainty, assumptions, and interpretation are hidden. A traceable Package keeps those boundaries visible."
      },
      "Context and materials": {
        "title": "Context and materials",
        "body": "The customer supplies a strategic question, decision context, initial sources, market boundaries, expected depth, and known uncertainties."
      },
      "Expected outcome": {
        "title": "Expected outcome",
        "body": "The expected Research Package includes the brief, plan, source inventory, market overview, competitor analysis, patterns, insights, recommendations, and limitation record."
      },
      "How the Project is executed": {
        "title": "How the Project is executed",
        "body": "The illustrative sequence receives the question, confirms scope, collects sources, analyzes evidence, synthesizes patterns, reviews recommendations, records limitations, obtains customer approval, and delivers the Package."
      },
      "Agent team": {
        "title": "Agent team",
        "body": "The illustrative proposed team includes research planning, source, market, competitor, insight, and recommendation-review roles. It does not represent live research execution."
      },
      "Human checkpoints": {
        "title": "Human checkpoints",
        "body": "The customer validates research scope, reviews evidence-aware recommendations, and decides whether the final Package is suitable for delivery."
      },
      "Illustrative revision": {
        "title": "Illustrative revision",
        "body": "The revision makes a regional source limitation explicit in the recommendation while preserving the traceable source inventory and market overview."
      },
      "Deliverables and final Package": {
        "title": "Deliverables and final Package",
        "body": "The Research Package collects the research artifacts, recommendations, assumptions, limitations, and decision history. It is not a promise of commercial results."
      },
      "Traceability": {
        "title": "Traceability",
        "body": "The trace record connects the customer brief to the research plan, contributing role, artifact version, and scope decision."
      },
      "Quality considerations": {
        "title": "Quality considerations",
        "body": "Review distinguishes source-backed observations from assumptions and recommendations. Incomplete coverage remains visible rather than being treated as certainty."
      },
      "Limitations": {
        "title": "Limitations",
        "body": "Findings depend on source quality, estimates require stated assumptions, and no commercial outcome is guaranteed."
      },
      "Relationship to the functional platform": {
        "title": "Relationship to the functional platform",
        "body": "This Project illustrates the intended experience of a planned BBA Agency Product. It does not represent an operational implementation. Learn about the related [Market Research Product](/services/research)."
      },
      "Frequently asked questions": {
        "title": "Frequently asked questions",
        "body": "### What does the customer provide?\n\nThe customer provides the question, decision context, seed sources, constraints, expected depth, and known uncertainties.\n\n### Which human approvals are required?\n\nThe intended experience includes scope approval, recommendation review, and final Package approval.\n\n### What does the final Package contain?\n\nIt contains the brief, plan, source inventory, market analysis, insights, recommendations, assumptions, limitations, and decision history.\n\n### What happens when changes are requested?\n\nAffected recommendations and limitation records are revised while the underlying source inventory and prior analysis remain traceable.\n\n### Is this Project example operational?\n\nNo. It is an illustrative planned example and this static website does not execute Projects."
      }
    },
    "faq": [
      {
        "question": "What does the customer provide?",
        "answer": "The customer provides the question, decision context, seed sources, constraints, expected depth, and known uncertainties."
      },
      {
        "question": "Which human approvals are required?",
        "answer": "The intended experience includes scope approval, recommendation review, and final Package approval."
      },
      {
        "question": "What does the final Package contain?",
        "answer": "It contains the brief, plan, source inventory, market analysis, insights, recommendations, assumptions, limitations, and decision history."
      },
      {
        "question": "What happens when changes are requested?",
        "answer": "Affected recommendations and limitation records are revised while the underlying source inventory and prior analysis remain traceable."
      },
      {
        "question": "Is this Project example operational?",
        "answer": "No. It is an illustrative planned example and this static website does not execute Projects."
      }
    ],
    "sourcePath": "static/content/projects/enterprise-ai-publishing-market-study.md"
  },
  {
    "schemaVersion": "1.0",
    "id": "neurons-protocol-launch",
    "name": "Neurons Protocol Launch",
    "slug": "neurons-protocol-launch",
    "route": "/projects/neurons-protocol-launch",
    "productId": "bba-publisher",
    "productName": "BBA Publisher",
    "productRoute": "/services/publisher",
    "category": "Publication Strategy",
    "exampleStatus": "PROTOTYPE_BACKED",
    "packageName": "Editorial Package",
    "eyebrow": "Project example",
    "headline": "See how trusted protocol context becomes a coordinated multichannel editorial package.",
    "summary": "An informational example of a BBA Publisher Project for explaining the Neurons Protocol across owned editorial channels.",
    "customerObjective": "Establish a credible public narrative for the Neurons Protocol that remains useful to institutional partners and the technical community.",
    "customerOutcome": "A reviewed Editorial Package containing one approved editorial foundation, a publication plan, channel adaptations, and consistency findings.",
    "audience": [
      "Institutional partners",
      "Technical community"
    ],
    "contentLanguage": "English",
    "applicationLanguage": "English",
    "availability": {
      "code": "PROTOTYPE_BACKED",
      "label": "Prototype-backed example",
      "operationalOnStaticSite": false
    },
    "prototype": {
      "available": true,
      "url": "https://dev.bba.country",
      "disclosure": "This example reflects the workflow demonstrated by the current functional BBA Publisher prototype."
    },
    "seo": {
      "title": "Neurons Protocol Launch | BBA Agency",
      "description": "Learn how BBA Publisher structures trusted protocol context into a reviewed multichannel editorial package.",
      "canonicalPath": "/projects/neurons-protocol-launch"
    },
    "navigation": {
      "previousProject": null,
      "nextProject": "responsible-ai-awareness-campaign"
    },
    "relatedProductId": "bba-publisher",
    "keywords": [
      "publication strategy",
      "editorial context",
      "multichannel content",
      "human review"
    ],
    "context": {
      "summary": "The fictional customer supplies a protocol overview, approved terminology, desired audiences, and clear boundaries for public communication.",
      "objectives": [
        "Explain the Neurons Protocol without reducing it to an unsupported automation claim."
      ],
      "materials": [
        {
          "id": "protocol-overview",
          "name": "Neurons Protocol Overview",
          "type": "reference-document",
          "description": "Primary explanation of the protocol and its intended role in the Axodus ecosystem."
        }
      ],
      "trustedFacts": [
        {
          "id": "fact-001",
          "statement": "The protocol coordinates specialized execution units for Agency services.",
          "sourceReference": "protocol-overview"
        }
      ],
      "constraints": [
        "Preserve an institutional and technically credible tone.",
        "Separate technical explanation from promotional language."
      ],
      "requiredTerms": [
        "Neurons Protocol",
        "coordinated intelligence"
      ],
      "prohibitedClaims": [
        "Guaranteed financial return",
        "Regulatory approval"
      ],
      "uncertainties": [
        "Final token or pricing semantics remain outside this Project example."
      ]
    },
    "expectedOutcome": {
      "description": "The customer confirms the editorial scope before coordinated work produces the reviewed Package.",
      "packageName": "Editorial Package",
      "deliverableIds": [
        "editorial-context-summary",
        "editorial-core",
        "publication-plan",
        "blog-article",
        "linkedin-post",
        "instagram-package",
        "consistency-report",
        "editorial-package"
      ],
      "checkpointIds": [
        "editorial-core-approval",
        "final-package-approval"
      ],
      "knownLimitations": [
        "No external publication is performed."
      ]
    },
    "workflow": [
      {
        "order": 1,
        "id": "receive-editorial-context",
        "label": "Editorial Context received",
        "objective": "Establish the communication objective, audiences, facts, and constraints.",
        "agencyActivity": "Records the supplied editorial context and identifies material gaps.",
        "customerInvolvement": "Provides source materials and confirms the intended outcome.",
        "agentRoleIds": [
          "context-analyst"
        ],
        "artifactIds": [
          "editorial-context-summary"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 2,
        "id": "analyze-context",
        "label": "Context analyzed",
        "objective": "Interpret evidence, terminology, audience needs, and prohibited claims.",
        "agencyActivity": "Connects supplied facts and boundaries to the proposed editorial foundation.",
        "customerInvolvement": "Clarifies ambiguities when the context needs confirmation.",
        "agentRoleIds": [
          "context-analyst"
        ],
        "artifactIds": [
          "editorial-context-summary"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 3,
        "id": "prepare-editorial-core",
        "label": "Editorial Core prepared",
        "objective": "Form a shared central message, approved claims, tone, and restrictions.",
        "agencyActivity": "Produces the semantic foundation used by every channel adaptation.",
        "customerInvolvement": "Receives the proposed interpretation for review.",
        "agentRoleIds": [
          "context-analyst",
          "editorial-strategist"
        ],
        "artifactIds": [
          "editorial-core"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 4,
        "id": "approve-editorial-core",
        "label": "Editorial Core approved",
        "objective": "Confirm that the central message and evidence boundaries are correct.",
        "agencyActivity": "Presents the interpreted foundation and records the human decision.",
        "customerInvolvement": "Approves, rejects, or requests corrections in the functional platform.",
        "agentRoleIds": [
          "editorial-strategist",
          "human-governance"
        ],
        "artifactIds": [
          "editorial-core"
        ],
        "humanCheckpoint": true,
        "decisionId": "editorial-core-approval"
      },
      {
        "order": 5,
        "id": "develop-publication-strategy",
        "label": "Publication strategy developed",
        "objective": "Define the role of Blog, LinkedIn, and Instagram around the approved core.",
        "agencyActivity": "Composes channel sequencing, audience emphasis, and editorial guidance.",
        "customerInvolvement": "Confirms channel priorities when required.",
        "agentRoleIds": [
          "editorial-strategist"
        ],
        "artifactIds": [
          "publication-plan"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 6,
        "id": "produce-channel-content",
        "label": "Blog, LinkedIn, and Instagram content produced",
        "objective": "Adapt the approved meaning to three illustrative channel contexts.",
        "agencyActivity": "Produces channel variants that retain approved claims and terminology.",
        "customerInvolvement": "Supplies additional channel context only when necessary.",
        "agentRoleIds": [
          "platform-adapter"
        ],
        "artifactIds": [
          "blog-article",
          "linkedin-post",
          "instagram-package"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 7,
        "id": "review-semantic-consistency",
        "label": "Semantic consistency reviewed",
        "objective": "Identify unsupported claims, omissions, and drift across the Package.",
        "agencyActivity": "Compares the channel work against the approved Editorial Core.",
        "customerInvolvement": "Considers findings that require a correction.",
        "agentRoleIds": [
          "semantic-consistency-reviewer"
        ],
        "artifactIds": [
          "consistency-report"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 8,
        "id": "review-final-package",
        "label": "Final Package reviewed",
        "objective": "Confirm that the complete Editorial Package is suitable for delivery.",
        "agencyActivity": "Presents versions, findings, and the assembled Package for human governance.",
        "customerInvolvement": "Approves, rejects, or requests changes in the functional platform.",
        "agentRoleIds": [
          "semantic-consistency-reviewer",
          "human-governance"
        ],
        "artifactIds": [
          "editorial-package"
        ],
        "humanCheckpoint": true,
        "decisionId": "final-package-approval"
      },
      {
        "order": 9,
        "id": "deliver-editorial-package",
        "label": "Editorial Package delivered",
        "objective": "Provide the approved, reviewed Package without external publication.",
        "agencyActivity": "Makes the approved Package and traceability record available for delivery.",
        "customerInvolvement": "Receives the delivery and retains authority over any publication.",
        "agentRoleIds": [
          "human-governance"
        ],
        "artifactIds": [
          "editorial-package"
        ],
        "humanCheckpoint": false
      }
    ],
    "agentTeam": {
      "status": "PROTOTYPE_IMPLEMENTED",
      "roles": [
        {
          "id": "context-analyst",
          "name": "Context Analyst",
          "responsibility": "Interprets objectives, source materials, facts, terminology, and constraints.",
          "stageIds": [
            "receive-editorial-context",
            "analyze-context",
            "prepare-editorial-core"
          ],
          "artifactIds": [
            "editorial-context-summary",
            "editorial-core"
          ]
        },
        {
          "id": "editorial-strategist",
          "name": "Editorial Strategist",
          "responsibility": "Defines the Editorial Core and publication strategy.",
          "stageIds": [
            "prepare-editorial-core",
            "approve-editorial-core",
            "develop-publication-strategy"
          ],
          "artifactIds": [
            "editorial-core",
            "publication-plan"
          ]
        },
        {
          "id": "platform-adapter",
          "name": "Platform Adapter",
          "responsibility": "Adapts approved meaning for each illustrative channel context.",
          "stageIds": [
            "produce-channel-content"
          ],
          "artifactIds": [
            "blog-article",
            "linkedin-post",
            "instagram-package"
          ]
        },
        {
          "id": "semantic-consistency-reviewer",
          "name": "Semantic Consistency Reviewer",
          "responsibility": "Identifies unsupported claims, omissions, and semantic drift across variants.",
          "stageIds": [
            "review-semantic-consistency",
            "review-final-package"
          ],
          "artifactIds": [
            "consistency-report",
            "editorial-package"
          ]
        },
        {
          "id": "human-governance",
          "name": "Human Governance",
          "responsibility": "Exercises authorized human decisions over important interpretations and the final Package.",
          "stageIds": [
            "approve-editorial-core",
            "review-final-package",
            "deliver-editorial-package"
          ],
          "artifactIds": [
            "editorial-core",
            "editorial-package"
          ]
        }
      ]
    },
    "humanDecisions": [
      {
        "id": "editorial-core-approval",
        "name": "Editorial Core approval",
        "stageId": "approve-editorial-core",
        "purpose": "Confirm that the Agency correctly interpreted the protocol context and intended outcome.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Approval permits publication strategy and channel adaptation to continue in the functional platform."
      },
      {
        "id": "final-package-approval",
        "name": "Final Package approval",
        "stageId": "review-final-package",
        "purpose": "Confirm that the complete Editorial Package is suitable for delivery.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Approval permits delivery of the Package but does not publish it externally."
      }
    ],
    "revisionExample": {
      "title": "Refine the institutional tone for LinkedIn",
      "request": "The fictional customer asks for a more institutional LinkedIn tone while preserving the approved central message and claims.",
      "reason": "The first variant is considered too promotional for institutional partners.",
      "affectedArtifactIds": [
        "linkedin-post"
      ],
      "repeatedStageIds": [
        "produce-channel-content",
        "review-semantic-consistency"
      ],
      "preservedArtifactIds": [
        "editorial-core",
        "publication-plan"
      ],
      "resultingVersion": "2",
      "traceabilityNote": "The revised variant remains linked to the same approved facts, Editorial Core, and consistency review."
    },
    "deliverables": [
      {
        "id": "editorial-context-summary",
        "name": "Editorial Context Summary",
        "description": "A structured summary of supplied objectives, materials, facts, and constraints.",
        "purpose": "Establish the accountable starting point for the Project.",
        "format": [
          "structured view"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "editorial-core",
        "name": "Editorial Core",
        "description": "The proposed semantic foundation for all channel adaptations.",
        "purpose": "Preserve central meaning, evidence boundaries, terminology, and tone.",
        "format": [
          "structured view"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "publication-plan",
        "name": "Publication Plan",
        "description": "A channel-specific editorial strategy for Blog, LinkedIn, and Instagram.",
        "purpose": "Coordinate the role of each channel around the approved Core.",
        "format": [
          "structured plan"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "blog-article",
        "name": "Blog Article",
        "description": "Long-form editorial adaptation for an owned publication surface.",
        "purpose": "Explain the protocol in a durable, contextual format.",
        "format": [
          "editorial draft"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "linkedin-post",
        "name": "LinkedIn Post",
        "description": "Institutional channel adaptation derived from the approved Core.",
        "purpose": "Address professional and institutional audiences.",
        "format": [
          "channel draft"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "instagram-package",
        "name": "Instagram Caption and Carousel Script",
        "description": "Visual-channel caption and illustrative carousel script.",
        "purpose": "Translate the approved message without making promotional guarantees.",
        "format": [
          "channel draft"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "consistency-report",
        "name": "Consistency Report",
        "description": "Findings about claims, terminology, omissions, and cross-channel alignment.",
        "purpose": "Make reviewable quality considerations visible.",
        "format": [
          "review record"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "editorial-package",
        "name": "Editorial Package",
        "description": "The final collection of approved editorial artifacts, findings, and decisions.",
        "purpose": "Deliver a traceable multichannel editorial result.",
        "format": [
          "structured package"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      }
    ],
    "traceability": [
      {
        "id": "trace-001",
        "sourceReference": "protocol-overview",
        "contextItem": "The protocol coordinates specialized execution units for Agency services.",
        "workflowStageId": "prepare-editorial-core",
        "agentRoleId": "context-analyst",
        "artifactId": "editorial-core",
        "artifactVersion": "1",
        "decisionId": "editorial-core-approval",
        "rationale": "The factual statement is retained because the supplied protocol overview supports it."
      }
    ],
    "limitations": [
      "No external publication occurs through this example or the Publisher prototype.",
      "The example does not make financial claims about $Neurons.",
      "Human approval remains required for the Editorial Core and final Package.",
      "Output quality depends on the quality and sufficiency of supplied sources."
    ],
    "sections": {
      "Overview": {
        "title": "Overview",
        "body": "This informational example shows how BBA Publisher can structure a protocol communication objective into a reviewed editorial Package. The static website does not execute this Project."
      },
      "Customer objective": {
        "title": "Customer objective",
        "body": "The fictional customer wants a coherent explanation of the Neurons Protocol for institutional partners and the technical community without introducing financial or regulatory claims."
      },
      "Why this Project matters": {
        "title": "Why this Project matters",
        "body": "Protocol communication can lose accuracy when each channel is written independently. A shared Editorial Core keeps the central message, terminology, and evidence boundaries visible."
      },
      "Context and materials": {
        "title": "Context and materials",
        "body": "The customer provides the protocol overview, intended audiences, approved terminology, tone guidance, required channels, and prohibited claims as informational Project context."
      },
      "Expected outcome": {
        "title": "Expected outcome",
        "body": "The expected result is an Editorial Package containing an approved Editorial Core, publication plan, Blog article, LinkedIn Post, Instagram Caption and Carousel Script, and Consistency Report."
      },
      "How the Project is executed": {
        "title": "How the Project is executed",
        "body": "The illustrative sequence receives and analyzes context, prepares and reviews an Editorial Core, develops a publication strategy, produces channel content, reviews consistency, reviews the Package, and delivers it without external publication."
      },
      "Agent team": {
        "title": "Agent team",
        "body": "The prototype team includes a Context Analyst, Editorial Strategist, Platform Adapter, Semantic Consistency Reviewer, and Human Governance. Their listed contributions describe coordinated roles, not chat personas or live activity."
      },
      "Human checkpoints": {
        "title": "Human checkpoints",
        "body": "Human Governance validates the Editorial Core interpretation and later the assembled Editorial Package. The functional platform may record approval, rejection, or requested changes; this static example only explains those decisions."
      },
      "Illustrative revision": {
        "title": "Illustrative revision",
        "body": "The LinkedIn tone revision is illustrative. It repeats channel adaptation and consistency review while retaining the already approved Editorial Core and publication strategy."
      },
      "Deliverables and final Package": {
        "title": "Deliverables and final Package",
        "body": "The Editorial Package assembles the context summary, editorial foundation, strategy, channel work, consistency findings, and final decision record. It is not an active export on this website."
      },
      "Traceability": {
        "title": "Traceability",
        "body": "The trace record connects a supplied protocol source to the Context Analyst contribution, the Editorial Core, its version, and the human checkpoint that reviews it."
      },
      "Quality considerations": {
        "title": "Quality considerations",
        "body": "Consistency review tests alignment with supplied facts, terminology, tone, and prohibited claims. It does not establish truth beyond the supplied source quality."
      },
      "Limitations": {
        "title": "Limitations",
        "body": "No external publication occurs, $Neurons financial claims are excluded, and customer approval remains required. Source quality and completeness affect the result."
      },
      "Relationship to the functional platform": {
        "title": "Relationship to the functional platform",
        "body": "This example reflects the workflow demonstrated by the current functional BBA Publisher prototype. Explore it separately at [dev.bba.country](https://dev.bba.country)."
      },
      "Frequently asked questions": {
        "title": "Frequently asked questions",
        "body": "### What does the customer provide?\n\nThe customer supplies objectives, audiences, source materials, facts, terminology, constraints, and channel requirements.\n\n### Which human approvals are required?\n\nThe Editorial Core and final Editorial Package are reviewed through Human Governance checkpoints.\n\n### What does the final Package contain?\n\nIt contains the context summary, Editorial Core, strategy, channel adaptations, consistency findings, and decision record.\n\n### What happens when changes are requested?\n\nThe affected artifact is revised, relevant review stages repeat, and the traceability relationship remains visible.\n\n### Is this Project example operational?\n\nNo. This informational website does not execute Projects.\n\n### Does external publication occur?\n\nNo. Delivery is limited to an approved-for-delivery Editorial Package; no external Connector is configured.\n\n### Which channels are represented?\n\nThe example represents Blog, LinkedIn, and Instagram adaptations.\n\n### Where can the functional prototype be explored?\n\nThe functional BBA Publisher prototype is available separately at [dev.bba.country](https://dev.bba.country)."
      }
    },
    "faq": [
      {
        "question": "What does the customer provide?",
        "answer": "The customer supplies objectives, audiences, source materials, facts, terminology, constraints, and channel requirements."
      },
      {
        "question": "Which human approvals are required?",
        "answer": "The Editorial Core and final Editorial Package are reviewed through Human Governance checkpoints."
      },
      {
        "question": "What does the final Package contain?",
        "answer": "It contains the context summary, Editorial Core, strategy, channel adaptations, consistency findings, and decision record."
      },
      {
        "question": "What happens when changes are requested?",
        "answer": "The affected artifact is revised, relevant review stages repeat, and the traceability relationship remains visible."
      },
      {
        "question": "Is this Project example operational?",
        "answer": "No. This informational website does not execute Projects."
      },
      {
        "question": "Does external publication occur?",
        "answer": "No. Delivery is limited to an approved-for-delivery Editorial Package; no external Connector is configured."
      },
      {
        "question": "Which channels are represented?",
        "answer": "The example represents Blog, LinkedIn, and Instagram adaptations."
      },
      {
        "question": "Where can the functional prototype be explored?",
        "answer": "The functional BBA Publisher prototype is available separately at [dev.bba.country](https://dev.bba.country)."
      }
    ],
    "sourcePath": "static/content/projects/neurons-protocol-launch.md"
  },
  {
    "schemaVersion": "1.0",
    "id": "responsible-ai-awareness-campaign",
    "name": "Responsible AI Awareness Campaign",
    "slug": "responsible-ai-awareness-campaign",
    "route": "/projects/responsible-ai-awareness-campaign",
    "productId": "advertising-campaign",
    "productName": "Advertising Campaign",
    "productRoute": "/services/advertising",
    "category": "Advertising",
    "exampleStatus": "ILLUSTRATIVE_PLANNED",
    "packageName": "Campaign Package",
    "eyebrow": "Project example",
    "headline": "See how a responsible AI brief becomes a coordinated campaign strategy and creative Package.",
    "summary": "An illustrative planned Project for communicating responsible AI practices to institutional and professional audiences.",
    "customerObjective": "Build a credible awareness campaign that explains responsible AI practices without making performance or compliance guarantees.",
    "customerOutcome": "A reviewed Campaign Package with audience definition, positioning, creative directions, message architecture, channel plan, and risk review.",
    "audience": [
      "Enterprise leaders",
      "Technology decision-makers"
    ],
    "contentLanguage": "English",
    "applicationLanguage": "English",
    "availability": {
      "code": "ILLUSTRATIVE_PLANNED",
      "label": "Illustrative planned example",
      "operationalOnStaticSite": false
    },
    "prototype": {
      "available": false,
      "disclosure": "This Project illustrates the intended experience of a planned BBA Agency Product. It does not represent an operational implementation."
    },
    "seo": {
      "title": "Responsible AI Awareness Campaign | BBA Agency",
      "description": "Learn how an illustrative BBA Agency campaign Project organizes strategy, creative direction, review, and delivery.",
      "canonicalPath": "/projects/responsible-ai-awareness-campaign"
    },
    "navigation": {
      "previousProject": "neurons-protocol-launch",
      "nextProject": "ai-publishing-research-article"
    },
    "relatedProductId": "advertising-campaign",
    "keywords": [
      "responsible AI",
      "campaign strategy",
      "creative direction",
      "human review"
    ],
    "context": {
      "summary": "The fictional customer provides responsible AI policy notes, a service offer, target audiences, and brand constraints.",
      "objectives": [
        "Explain responsible AI practices without claiming certification or guaranteed business outcomes."
      ],
      "materials": [
        {
          "id": "responsible-ai-brief",
          "name": "Responsible AI Brief",
          "type": "briefing-document",
          "description": "Customer-supplied description of practices, audiences, offer boundaries, and approved terminology."
        }
      ],
      "trustedFacts": [
        {
          "id": "fact-001",
          "statement": "The customer maintains documented review practices for AI-assisted content.",
          "sourceReference": "responsible-ai-brief"
        }
      ],
      "constraints": [
        "Do not imply regulatory certification.",
        "Do not guarantee campaign performance."
      ],
      "requiredTerms": [
        "responsible AI",
        "human review"
      ],
      "prohibitedClaims": [
        "Guaranteed compliance",
        "Guaranteed conversion rate"
      ],
      "uncertainties": [
        "Media budgets and third-party channel rules are outside this illustrative Project."
      ]
    },
    "expectedOutcome": {
      "description": "The customer confirms a reviewed awareness-campaign scope before the planned team would coordinate strategy and creative work.",
      "packageName": "Campaign Package",
      "deliverableIds": [
        "campaign-context-summary",
        "audience-definition",
        "positioning",
        "campaign-strategy",
        "creative-concepts",
        "message-architecture",
        "channel-plan",
        "risk-review",
        "campaign-package"
      ],
      "checkpointIds": [
        "strategy-approval",
        "creative-direction-selection",
        "final-package-approval"
      ],
      "knownLimitations": [
        "No media purchasing or autonomous deployment is performed."
      ]
    },
    "workflow": [
      {
        "order": 1,
        "id": "receive-campaign-context",
        "label": "Campaign Context received",
        "objective": "Establish the offer, audience, policy boundaries, and campaign outcome.",
        "agencyActivity": "Organizes the supplied brief and identifies missing context.",
        "customerInvolvement": "Provides the brief, brand references, and intended audiences.",
        "agentRoleIds": [
          "campaign-strategist"
        ],
        "artifactIds": [
          "campaign-context-summary"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 2,
        "id": "analyze-audience-offer",
        "label": "Audience and offer analyzed",
        "objective": "Interpret audience needs and the responsible AI offer without overstating it.",
        "agencyActivity": "Relates the supplied offer and constraints to audience considerations.",
        "customerInvolvement": "Clarifies the offer boundary when needed.",
        "agentRoleIds": [
          "audience-analyst"
        ],
        "artifactIds": [
          "audience-definition"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 3,
        "id": "define-positioning",
        "label": "Positioning defined",
        "objective": "Form a credible message position for the campaign.",
        "agencyActivity": "Drafts a positioning statement grounded in the supplied brief.",
        "customerInvolvement": "Reviews the intended emphasis.",
        "agentRoleIds": [
          "positioning-analyst"
        ],
        "artifactIds": [
          "positioning"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 4,
        "id": "prepare-campaign-strategy",
        "label": "Campaign strategy prepared",
        "objective": "Align objectives, audiences, messages, and channel roles.",
        "agencyActivity": "Composes the campaign strategy for customer review.",
        "customerInvolvement": "Approves, rejects, or requests changes in the planned platform experience.",
        "agentRoleIds": [
          "campaign-strategist",
          "positioning-analyst"
        ],
        "artifactIds": [
          "campaign-strategy",
          "message-architecture"
        ],
        "humanCheckpoint": true,
        "decisionId": "strategy-approval"
      },
      {
        "order": 5,
        "id": "develop-creative-concepts",
        "label": "Creative concepts developed",
        "objective": "Explore campaign directions consistent with approved positioning.",
        "agencyActivity": "Develops illustrative creative concepts and rationale.",
        "customerInvolvement": "Reviews the concepts before a direction is selected.",
        "agentRoleIds": [
          "creative-concept-developer"
        ],
        "artifactIds": [
          "creative-concepts"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 6,
        "id": "compose-channel-plan",
        "label": "Channel plan composed",
        "objective": "Explain illustrative channel roles without buying media or configuring channels.",
        "agencyActivity": "Structures channel guidance and message sequencing.",
        "customerInvolvement": "Confirms selected communication priorities.",
        "agentRoleIds": [
          "channel-planner"
        ],
        "artifactIds": [
          "channel-plan"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 7,
        "id": "review-risk-consistency",
        "label": "Risk and consistency reviewed",
        "objective": "Identify unsupported claims and message drift before selection.",
        "agencyActivity": "Reviews concepts, positioning, and channel guidance against constraints.",
        "customerInvolvement": "Considers material findings.",
        "agentRoleIds": [
          "campaign-consistency-reviewer"
        ],
        "artifactIds": [
          "risk-review"
        ],
        "humanCheckpoint": false
      },
      {
        "order": 8,
        "id": "select-creative-direction",
        "label": "Creative direction selected",
        "objective": "Confirm the customer-preferred direction for the Package.",
        "agencyActivity": "Records the selected direction and requested changes.",
        "customerInvolvement": "Selects, rejects, or requests changes in the planned platform experience.",
        "agentRoleIds": [
          "creative-concept-developer",
          "campaign-strategist"
        ],
        "artifactIds": [
          "creative-concepts",
          "campaign-package"
        ],
        "humanCheckpoint": true,
        "decisionId": "creative-direction-selection"
      },
      {
        "order": 9,
        "id": "deliver-campaign-package",
        "label": "Campaign Package delivered",
        "objective": "Deliver the reviewed planning and creative Package.",
        "agencyActivity": "Assembles artifacts, review findings, and decision history.",
        "customerInvolvement": "Receives the illustrative final Package.",
        "agentRoleIds": [
          "campaign-strategist"
        ],
        "artifactIds": [
          "campaign-package"
        ],
        "humanCheckpoint": true,
        "decisionId": "final-package-approval"
      }
    ],
    "agentTeam": {
      "status": "CONCEPTUAL",
      "roles": [
        {
          "id": "campaign-strategist",
          "name": "Campaign Strategist",
          "responsibility": "Structures objectives, campaign strategy, and final Package.",
          "stageIds": [
            "receive-campaign-context",
            "prepare-campaign-strategy",
            "select-creative-direction",
            "deliver-campaign-package"
          ],
          "artifactIds": [
            "campaign-context-summary",
            "campaign-strategy",
            "campaign-package"
          ]
        },
        {
          "id": "audience-analyst",
          "name": "Audience Analyst",
          "responsibility": "Interprets audience needs and offer relevance.",
          "stageIds": [
            "analyze-audience-offer"
          ],
          "artifactIds": [
            "audience-definition"
          ]
        },
        {
          "id": "positioning-analyst",
          "name": "Positioning Analyst",
          "responsibility": "Develops credible positioning and message boundaries.",
          "stageIds": [
            "define-positioning",
            "prepare-campaign-strategy"
          ],
          "artifactIds": [
            "positioning",
            "message-architecture"
          ]
        },
        {
          "id": "creative-concept-developer",
          "name": "Creative Concept Developer",
          "responsibility": "Develops illustrative campaign directions from approved positioning.",
          "stageIds": [
            "develop-creative-concepts",
            "select-creative-direction"
          ],
          "artifactIds": [
            "creative-concepts",
            "campaign-package"
          ]
        },
        {
          "id": "channel-planner",
          "name": "Channel Planner",
          "responsibility": "Defines channel roles without purchasing media or deploying campaigns.",
          "stageIds": [
            "compose-channel-plan"
          ],
          "artifactIds": [
            "channel-plan"
          ]
        },
        {
          "id": "campaign-consistency-reviewer",
          "name": "Campaign Consistency Reviewer",
          "responsibility": "Reviews messaging and risk boundaries across the proposed Package.",
          "stageIds": [
            "review-risk-consistency"
          ],
          "artifactIds": [
            "risk-review"
          ]
        }
      ]
    },
    "humanDecisions": [
      {
        "id": "strategy-approval",
        "name": "Campaign strategy approval",
        "stageId": "prepare-campaign-strategy",
        "purpose": "Confirm the interpretation of audience, positioning, and campaign objective.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Approval permits conceptual creative development to continue."
      },
      {
        "id": "creative-direction-selection",
        "name": "Creative direction selection",
        "stageId": "select-creative-direction",
        "purpose": "Select the preferred illustrative direction.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "The selected direction is carried into the reviewed Campaign Package."
      },
      {
        "id": "final-package-approval",
        "name": "Final Package approval",
        "stageId": "deliver-campaign-package",
        "purpose": "Confirm suitability of the complete Campaign Package for delivery.",
        "availableResponses": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "effect": "Approval permits delivery only; it does not purchase media or deploy a campaign."
      }
    ],
    "revisionExample": {
      "title": "Reduce promotional emphasis in the lead concept",
      "request": "The fictional customer requests a more educational opening for the selected concept.",
      "reason": "The first direction gives insufficient prominence to human review and policy boundaries.",
      "affectedArtifactIds": [
        "creative-concepts",
        "message-architecture"
      ],
      "repeatedStageIds": [
        "develop-creative-concepts",
        "review-risk-consistency"
      ],
      "preservedArtifactIds": [
        "positioning",
        "campaign-strategy"
      ],
      "resultingVersion": "2",
      "traceabilityNote": "The revised concept remains connected to the same audience definition, positioning, and strategy decision."
    },
    "deliverables": [
      {
        "id": "campaign-context-summary",
        "name": "Campaign Context Summary",
        "description": "Structured summary of the brief, offer, audiences, and constraints.",
        "purpose": "Establish campaign scope.",
        "format": [
          "structured view"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "audience-definition",
        "name": "Audience Definition",
        "description": "Reviewable interpretation of audience needs and context.",
        "purpose": "Ground campaign choices in a stated audience.",
        "format": [
          "audience profile"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "positioning",
        "name": "Positioning",
        "description": "Credible campaign position and message boundary.",
        "purpose": "Prevent unsupported claims.",
        "format": [
          "strategy statement"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "campaign-strategy",
        "name": "Campaign Strategy",
        "description": "Coordinated objective, audience, message, and channel approach.",
        "purpose": "Guide the illustrative campaign Package.",
        "format": [
          "structured plan"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "creative-concepts",
        "name": "Creative Concepts",
        "description": "Reviewable concept directions and their rationale.",
        "purpose": "Support human selection.",
        "format": [
          "concept set"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      },
      {
        "id": "message-architecture",
        "name": "Message Architecture",
        "description": "Key messages and supporting distinctions.",
        "purpose": "Maintain consistency across proposed communications.",
        "format": [
          "message map"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "channel-plan",
        "name": "Channel Plan",
        "description": "Illustrative channel roles and sequence.",
        "purpose": "Explain distribution planning without channel execution.",
        "format": [
          "channel guidance"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "risk-review",
        "name": "Risk Review",
        "description": "Findings about claims, tone, and consistency.",
        "purpose": "Surface communication risks before delivery.",
        "format": [
          "review record"
        ],
        "requiresApproval": false,
        "includedInFinalPackage": true
      },
      {
        "id": "campaign-package",
        "name": "Campaign Package",
        "description": "The reviewed collection of campaign artifacts and decisions.",
        "purpose": "Deliver a traceable campaign planning result.",
        "format": [
          "structured package"
        ],
        "requiresApproval": true,
        "includedInFinalPackage": true
      }
    ],
    "traceability": [
      {
        "id": "trace-001",
        "sourceReference": "responsible-ai-brief",
        "contextItem": "The customer maintains documented review practices for AI-assisted content.",
        "workflowStageId": "prepare-campaign-strategy",
        "agentRoleId": "campaign-strategist",
        "artifactId": "campaign-strategy",
        "artifactVersion": "1",
        "decisionId": "strategy-approval",
        "rationale": "The strategy retains the supplied human-review distinction and excludes compliance guarantees."
      }
    ],
    "limitations": [
      "This planned example does not purchase media.",
      "It does not guarantee campaign performance.",
      "It does not autonomously deploy a campaign.",
      "It represents a planned product only."
    ],
    "sections": {
      "Overview": {
        "title": "Overview",
        "body": "This is an illustrative planned example of how an Advertising Campaign Project could organize responsible AI communication. The static website does not execute campaign work."
      },
      "Customer objective": {
        "title": "Customer objective",
        "body": "The fictional customer wants a credible awareness campaign that helps enterprise audiences understand its responsible AI practices."
      },
      "Why this Project matters": {
        "title": "Why this Project matters",
        "body": "Responsible AI communication needs a clear distinction between documented practices and unsupported promises. Coordinated strategy keeps that distinction visible."
      },
      "Context and materials": {
        "title": "Context and materials",
        "body": "The customer supplies a responsible AI brief, offer context, target audiences, brand references, and prohibited claims."
      },
      "Expected outcome": {
        "title": "Expected outcome",
        "body": "The expected Campaign Package includes audience definition, positioning, strategy, creative concepts, message architecture, channel plan, and risk review."
      },
      "How the Project is executed": {
        "title": "How the Project is executed",
        "body": "The illustrative flow receives context, analyzes audience and offer, defines positioning, reviews strategy, develops concepts, plans channels, reviews risk, selects a direction, and delivers the Package."
      },
      "Agent team": {
        "title": "Agent team",
        "body": "The illustrative proposed team includes campaign, audience, positioning, creative, channel-planning, and consistency roles. It does not describe live autonomous agents."
      },
      "Human checkpoints": {
        "title": "Human checkpoints",
        "body": "The customer validates campaign strategy, selects a creative direction, and reviews the final Package in the intended platform experience."
      },
      "Illustrative revision": {
        "title": "Illustrative revision",
        "body": "The revision example changes promotional emphasis in a concept while preserving the approved positioning and campaign strategy."
      },
      "Deliverables and final Package": {
        "title": "Deliverables and final Package",
        "body": "The Campaign Package collects the planning artifacts, creative directions, risk review, and decision record. It does not buy media or deploy communications."
      },
      "Traceability": {
        "title": "Traceability",
        "body": "The trace record connects a supplied responsible AI brief to campaign strategy, the contributing role, its version, and strategy review."
      },
      "Quality considerations": {
        "title": "Quality considerations",
        "body": "Review checks message consistency, policy boundaries, and unsupported claims. It cannot guarantee market reception or channel performance."
      },
      "Limitations": {
        "title": "Limitations",
        "body": "This planned product does not purchase media, guarantee performance, or autonomously deploy a campaign."
      },
      "Relationship to the functional platform": {
        "title": "Relationship to the functional platform",
        "body": "This Project illustrates the intended experience of a planned BBA Agency Product. It does not represent an operational implementation. Learn about the related [Advertising Campaign Product](/services/advertising)."
      },
      "Frequently asked questions": {
        "title": "Frequently asked questions",
        "body": "### What does the customer provide?\n\nThe customer provides offer context, policy notes, audiences, brand references, constraints, and desired channels.\n\n### Which human approvals are required?\n\nThe intended experience includes strategy review, creative direction selection, and final Package approval.\n\n### What does the final Package contain?\n\nIt contains audience and positioning work, strategy, concepts, message architecture, channel plan, risk review, and decision history.\n\n### What happens when changes are requested?\n\nAffected concepts or messages are revised and reviewed again while the approved strategy remains traceable.\n\n### Is this Project example operational?\n\nNo. It is an illustrative planned example and this static website does not execute Projects."
      }
    },
    "faq": [
      {
        "question": "What does the customer provide?",
        "answer": "The customer provides offer context, policy notes, audiences, brand references, constraints, and desired channels."
      },
      {
        "question": "Which human approvals are required?",
        "answer": "The intended experience includes strategy review, creative direction selection, and final Package approval."
      },
      {
        "question": "What does the final Package contain?",
        "answer": "It contains audience and positioning work, strategy, concepts, message architecture, channel plan, risk review, and decision history."
      },
      {
        "question": "What happens when changes are requested?",
        "answer": "Affected concepts or messages are revised and reviewed again while the approved strategy remains traceable."
      },
      {
        "question": "Is this Project example operational?",
        "answer": "No. It is an illustrative planned example and this static website does not execute Projects."
      }
    ],
    "sourcePath": "static/content/projects/responsible-ai-awareness-campaign.md"
  }
] satisfies AgencyProjectContent[];
