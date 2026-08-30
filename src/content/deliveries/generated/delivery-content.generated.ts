import type { AgencyDeliveryPackageContent } from "../delivery-content.types.js";

export const agencyDeliveryPackages = [
  {
    "schemaVersion": "1.0",
    "id": "campaign-package",
    "name": "Campaign Package",
    "slug": "campaign-package",
    "route": "/deliveries/campaign-package",
    "category": "Advertising Campaign",
    "status": "ILLUSTRATIVE_PLANNED",
    "operationalOnStaticSite": false,
    "productId": "advertising-campaign",
    "productName": "Advertising Campaign",
    "productRoute": "/services/advertising",
    "projectId": "responsible-ai-awareness-campaign",
    "projectName": "Responsible AI Awareness Campaign",
    "projectRoute": "/projects/responsible-ai-awareness-campaign",
    "eyebrow": "Delivery Package",
    "headline": "The strategy, creative direction, audience definition, and review evidence for an advertising campaign.",
    "summary": "An illustrative planned Package explaining how campaign direction can be reviewed as one coherent customer outcome.",
    "purpose": "Connect audience, positioning, messages, channels, and creative concepts to an accountable campaign direction.",
    "customerOutcome": "A reviewable Campaign Package with strategic rationale, creative concepts, risk considerations, and illustrative decision lineage.",
    "availability": {
      "code": "ILLUSTRATIVE_PLANNED",
      "label": "Illustrative planned Package",
      "operationalOnStaticSite": false
    },
    "prototype": {
      "available": false,
      "disclosure": "This Package illustrates a planned BBA Agency Product. It does not represent an operational implementation."
    },
    "seo": {
      "title": "Campaign Package | BBA Agency",
      "description": "Learn how a Campaign Package organizes strategy, creative concepts, review, and traceability.",
      "canonicalPath": "/deliveries/campaign-package"
    },
    "navigation": {
      "previousDelivery": "editorial-package",
      "nextDelivery": "scientific-package"
    },
    "keywords": [
      "campaign strategy",
      "creative concepts",
      "audience definition",
      "human review"
    ],
    "artifacts": [
      {
        "id": "campaign-brief",
        "name": "Campaign Brief",
        "description": "The agreed communication question, context, and constraints.",
        "purpose": "Set a clear planning boundary.",
        "artifactType": "brief",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "structured view"
        ]
      },
      {
        "id": "audience-definition",
        "name": "Audience Definition",
        "description": "Audience segments, needs, and exclusions.",
        "purpose": "Ground messages in intended recipients.",
        "artifactType": "analysis",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "structured view"
        ]
      },
      {
        "id": "positioning",
        "name": "Positioning",
        "description": "The proposed value and distinction for the campaign.",
        "purpose": "Align campaign meaning before creative work.",
        "artifactType": "strategy",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "strategy view"
        ]
      },
      {
        "id": "campaign-strategy",
        "name": "Campaign Strategy",
        "description": "Objectives, message sequence, and communication rationale.",
        "purpose": "Coordinate a bounded campaign response.",
        "artifactType": "strategy",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "strategy view"
        ]
      },
      {
        "id": "creative-concepts",
        "name": "Creative Concepts",
        "description": "Distinct illustrative directions consistent with the approved positioning.",
        "purpose": "Support informed creative selection.",
        "artifactType": "creative-direction",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "concept summary"
        ]
      },
      {
        "id": "message-architecture",
        "name": "Message Architecture",
        "description": "Priority messages, support, and restrictions.",
        "purpose": "Keep campaign expression consistent.",
        "artifactType": "structured-content",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "message map"
        ]
      },
      {
        "id": "channel-plan",
        "name": "Channel Plan",
        "description": "Recommended channel roles and audience relevance.",
        "purpose": "Explain recommendations without performing media buying.",
        "artifactType": "recommendation",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "planning view"
        ]
      },
      {
        "id": "campaign-risk-review",
        "name": "Campaign Risk Review",
        "description": "Consistency, claim, and policy considerations for human review.",
        "purpose": "Surface issues before customer direction.",
        "artifactType": "review-record",
        "requiresHumanApproval": false,
        "includedInPackage": true,
        "illustrativeFormats": [
          "review summary"
        ]
      }
    ],
    "reviewProcess": [
      {
        "order": 1,
        "id": "strategy-review",
        "label": "Confirm strategic direction",
        "purpose": "Review the brief, audience, positioning, and strategy together.",
        "reviewerRole": "Authorized customer reviewer",
        "artifactIds": [
          "campaign-brief",
          "campaign-strategy"
        ],
        "possibleOutcomes": [
          "CONFIRM",
          "REQUEST_CHANGES"
        ],
        "humanCheckpoint": true
      },
      {
        "order": 2,
        "id": "creative-review",
        "label": "Review creative concepts",
        "purpose": "Select or revise directions against the approved message architecture.",
        "reviewerRole": "Authorized customer reviewer",
        "artifactIds": [
          "creative-concepts",
          "message-architecture"
        ],
        "possibleOutcomes": [
          "CONFIRM",
          "REQUEST_CHANGES"
        ],
        "humanCheckpoint": true
      },
      {
        "order": 3,
        "id": "final-campaign-review",
        "label": "Review the final campaign Package",
        "purpose": "Consider recommendations, findings, limitations, and version history.",
        "reviewerRole": "Authorized customer reviewer",
        "artifactIds": [
          "channel-plan",
          "campaign-risk-review"
        ],
        "possibleOutcomes": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "humanCheckpoint": true
      }
    ],
    "approval": {
      "required": true,
      "responsibleRole": "Authorized customer reviewer",
      "description": "The future Package is ready only after an authorized customer considers its materials, findings, limitations, and history.",
      "possibleResponses": [
        "APPROVE",
        "REQUEST_CHANGES",
        "REJECT"
      ],
      "operationalOnStaticSite": false
    },
    "revisionPolicy": {
      "description": "Requested direction changes create a new illustrative version while preserving earlier campaign rationale and decisions.",
      "preserves": [
        "previous versions",
        "human decisions",
        "source references"
      ],
      "mayInvalidate": [
        "affected concepts",
        "risk findings",
        "prior final approval"
      ]
    },
    "versionHistory": [
      {
        "version": "1",
        "status": "REVIEWED",
        "description": "Initial illustrative campaign direction prepared for review.",
        "changedArtifactIds": [
          "creative-concepts"
        ],
        "decisionReference": "creative-review",
        "illustrative": true
      },
      {
        "version": "2",
        "status": "APPROVED",
        "description": "Illustrative revision incorporates the selected direction.",
        "changedArtifactIds": [
          "channel-plan"
        ],
        "decisionReference": "final-campaign-review",
        "illustrative": true
      }
    ],
    "traceability": [
      {
        "id": "trace-001",
        "sourceType": "project-context",
        "sourceReference": "campaign-context-brief",
        "artifactId": "positioning",
        "artifactVersion": "1",
        "reviewCheckpointId": "strategy-review",
        "decisionReference": "strategy-review",
        "rationale": "The positioning is linked to supplied campaign context and the review checkpoint."
      }
    ],
    "qualityGates": [
      {
        "id": "audience-fit",
        "name": "Audience fit",
        "description": "Recommendations must remain connected to the defined audience and context.",
        "severityWhenFailed": "WARNING"
      },
      {
        "id": "human-direction",
        "name": "Human direction",
        "description": "Creative direction needs an authorized customer decision.",
        "severityWhenFailed": "BLOCKING"
      }
    ],
    "limitations": [
      "No media purchasing is included.",
      "No autonomous campaign deployment occurs.",
      "Performance outcomes cannot be guaranteed.",
      "Legal and platform-policy review may remain necessary."
    ],
    "sections": {
      "Overview": {
        "title": "Overview",
        "body": "This illustrative planned Package describes a coherent campaign direction, not\nan operational advertising deployment."
      },
      "Business objective": {
        "title": "Business objective",
        "body": "Give customer teams a reviewable basis for campaign choices before investment\nor execution decisions are made."
      },
      "Contents": {
        "title": "Contents",
        "body": "The Package joins strategy, audience definition, positioning, messages,\ncreative concepts, channel recommendations, and risk review."
      },
      "Artifacts": {
        "title": "Artifacts",
        "body": "Artifacts are structured explanatory materials, not files or media-buying\ninstructions."
      },
      "Review process": {
        "title": "Review process",
        "body": "Human checkpoints sequence strategic direction, creative review, and final\nconsideration of limitations."
      },
      "Approval": {
        "title": "Approval",
        "body": "An authorized customer reviewer makes the future decision; this static page\ndoes not accept or record an approval."
      },
      "Revision policy": {
        "title": "Revision policy",
        "body": "Clarified audience, positioning, or creative direction can affect downstream\nconcepts and findings. Earlier reasoning stays visible and changed scope may\nchange the required resources."
      },
      "Version history": {
        "title": "Version history",
        "body": "The displayed history is illustrative for a planned Product and does not claim\nthat an operational campaign has been executed."
      },
      "Traceability": {
        "title": "Traceability",
        "body": "Context leads to a strategic artifact, its version, review evidence, a human\ndecision, and the assembled Package."
      },
      "Quality gates": {
        "title": "Quality gates",
        "body": "Audience fit is examined and Human Governance remains a blocking condition."
      },
      "Limitations": {
        "title": "Limitations",
        "body": "This Package neither buys media nor deploys a campaign. Performance, legal,\nand platform-policy outcomes remain outside its guarantees."
      },
      "Relationship with Projects": {
        "title": "Relationship with Projects",
        "body": "It is the described outcome of the Responsible AI Awareness Campaign Project."
      },
      "Relationship with Product": {
        "title": "Relationship with Product",
        "body": "It explains the intended Advertising Campaign Product without representing an\nimplemented operational service."
      },
      "Future operational workflow": {
        "title": "Future operational workflow",
        "body": "A future functional platform may coordinate review records and versions; media\nbuying and external execution remain separate customer-controlled activities."
      },
      "Frequently asked questions": {
        "title": "Frequently asked questions",
        "body": "### Does this buy media?\n\nNo. Media purchasing is outside the Package scope.\n\n### Does it launch a campaign?\n\nNo. The site presents only an illustrative planning outcome.\n\n### Can creative direction change?\n\nYes. A future revision would preserve earlier rationale and create a new version.\n\n### Are results guaranteed?\n\nNo commercial or performance outcome is guaranteed.\n\n### Who checks policy requirements?\n\nCustomers retain responsibility for appropriate legal and platform-policy review."
      }
    },
    "faq": [
      {
        "question": "Does this buy media?",
        "answer": "No. Media purchasing is outside the Package scope."
      },
      {
        "question": "Does it launch a campaign?",
        "answer": "No. The site presents only an illustrative planning outcome."
      },
      {
        "question": "Can creative direction change?",
        "answer": "Yes. A future revision would preserve earlier rationale and create a new version."
      },
      {
        "question": "Are results guaranteed?",
        "answer": "No commercial or performance outcome is guaranteed."
      },
      {
        "question": "Who checks policy requirements?",
        "answer": "Customers retain responsibility for appropriate legal and platform-policy review."
      }
    ],
    "sourcePath": "static/content/deliveries/campaign-package.md"
  },
  {
    "schemaVersion": "1.0",
    "id": "editorial-package",
    "name": "Editorial Package",
    "slug": "editorial-package",
    "route": "/deliveries/editorial-package",
    "category": "Publication Strategy",
    "status": "PROTOTYPE_BACKED",
    "operationalOnStaticSite": false,
    "productId": "bba-publisher",
    "productName": "BBA Publisher",
    "productRoute": "/services/publisher",
    "projectId": "neurons-protocol-launch",
    "projectName": "Neurons Protocol Launch",
    "projectRoute": "/projects/neurons-protocol-launch",
    "eyebrow": "Delivery Package",
    "headline": "The approved editorial strategy, content, reviews, and decisions produced by a BBA Publisher Project.",
    "summary": "A structured explanation of the editorial materials a customer can review and use after Human Governance.",
    "purpose": "Preserve one approved editorial foundation across a publication strategy and its channel-specific adaptations.",
    "customerOutcome": "A reviewable Editorial Package with a shared message, channel materials, findings, decisions, and illustrative lineage.",
    "availability": {
      "code": "PROTOTYPE_BACKED",
      "label": "Prototype-backed Package",
      "operationalOnStaticSite": false
    },
    "prototype": {
      "available": true,
      "url": "https://dev.bba.country",
      "disclosure": "The functional BBA Publisher prototype demonstrates the current Project and review experience. The informational site does not generate or publish this Package."
    },
    "seo": {
      "title": "Editorial Package | BBA Agency",
      "description": "Learn what an Editorial Package contains and how it is reviewed, traced, and prepared for delivery.",
      "canonicalPath": "/deliveries/editorial-package"
    },
    "navigation": {
      "previousDelivery": null,
      "nextDelivery": "campaign-package"
    },
    "keywords": [
      "editorial package",
      "publication strategy",
      "human review",
      "traceability"
    ],
    "artifacts": [
      {
        "id": "editorial-context-summary",
        "name": "Editorial Context Summary",
        "description": "A structured interpretation of supplied objectives, materials, facts, and constraints.",
        "purpose": "Establish the context used for editorial decisions.",
        "artifactType": "structured-content",
        "requiresHumanApproval": false,
        "includedInPackage": true,
        "illustrativeFormats": [
          "structured view"
        ]
      },
      {
        "id": "editorial-core",
        "name": "Editorial Core",
        "description": "The central message, claims, evidence, terminology, and restrictions for every adaptation.",
        "purpose": "Keep channel work aligned with approved customer context.",
        "artifactType": "structured-content",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "structured view"
        ]
      },
      {
        "id": "publication-strategy",
        "name": "Publication Strategy",
        "description": "Channel roles, sequencing, and audience emphasis derived from the Editorial Core.",
        "purpose": "Coordinate a coherent multichannel editorial response.",
        "artifactType": "strategy",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "structured view"
        ]
      },
      {
        "id": "blog-article",
        "name": "Blog Article",
        "description": "A long-form channel adaptation derived from the approved Editorial Core.",
        "purpose": "Explain the approved message in a durable editorial format.",
        "artifactType": "channel-variant",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "editorial view"
        ]
      },
      {
        "id": "linkedin-content",
        "name": "LinkedIn Content",
        "description": "A professional-network adaptation with the approved message and audience emphasis.",
        "purpose": "Adapt the core without changing its evidence boundaries.",
        "artifactType": "channel-variant",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "editorial view"
        ]
      },
      {
        "id": "instagram-caption-carousel-script",
        "name": "Instagram Caption and Carousel Script",
        "description": "An illustrative visual-channel adaptation retaining the approved terminology.",
        "purpose": "Translate the core into an accessible channel narrative.",
        "artifactType": "channel-variant",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "editorial view"
        ]
      },
      {
        "id": "semantic-consistency-report",
        "name": "Semantic Consistency Report",
        "description": "Findings about claims, terminology, omissions, and drift across the Package.",
        "purpose": "Make review evidence visible before the final decision.",
        "artifactType": "review-record",
        "requiresHumanApproval": false,
        "includedInPackage": true,
        "illustrativeFormats": [
          "review summary"
        ]
      },
      {
        "id": "editorial-approval-record",
        "name": "Human Approval Record",
        "description": "An illustrative record of the authorized customer decision and its rationale.",
        "purpose": "Preserve Human Governance in Package lineage.",
        "artifactType": "decision-record",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "decision summary"
        ]
      }
    ],
    "reviewProcess": [
      {
        "order": 1,
        "id": "completeness-review",
        "label": "Confirm Package completeness",
        "purpose": "Verify that the expected editorial artifacts are represented.",
        "reviewerRole": "Customer reviewer",
        "artifactIds": [
          "editorial-core",
          "publication-strategy"
        ],
        "possibleOutcomes": [
          "CONFIRM",
          "REQUEST_CLARIFICATION"
        ],
        "humanCheckpoint": true
      },
      {
        "order": 2,
        "id": "semantic-consistency-review",
        "label": "Review semantic consistency",
        "purpose": "Consider supported claims, terminology, and channel alignment.",
        "reviewerRole": "Authorized customer reviewer",
        "artifactIds": [
          "blog-article",
          "linkedin-content",
          "semantic-consistency-report"
        ],
        "possibleOutcomes": [
          "CONFIRM",
          "REQUEST_CHANGES"
        ],
        "humanCheckpoint": true
      },
      {
        "order": 3,
        "id": "final-package-review",
        "label": "Review final Package",
        "purpose": "Consider materials, findings, limitations, and version history together.",
        "reviewerRole": "Authorized customer reviewer",
        "artifactIds": [
          "editorial-approval-record",
          "instagram-caption-carousel-script"
        ],
        "possibleOutcomes": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "humanCheckpoint": true
      }
    ],
    "approval": {
      "required": true,
      "responsibleRole": "Authorized customer reviewer",
      "description": "The Package is ready only after an authorized customer reviewer considers final artifacts, findings, limitations, and version history.",
      "possibleResponses": [
        "APPROVE",
        "REQUEST_CHANGES",
        "REJECT"
      ],
      "operationalOnStaticSite": false
    },
    "revisionPolicy": {
      "description": "Requested changes create a new illustrative Package version while retaining earlier artifacts, rationale, and decisions.",
      "preserves": [
        "previous versions",
        "human decisions",
        "source references",
        "traceability records"
      ],
      "mayInvalidate": [
        "affected artifacts",
        "downstream review findings",
        "prior final approval"
      ]
    },
    "versionHistory": [
      {
        "version": "1",
        "status": "REVIEWED",
        "description": "Initial Package assembled for illustrative human review.",
        "changedArtifactIds": [
          "linkedin-content"
        ],
        "decisionReference": "final-package-review",
        "illustrative": true
      },
      {
        "version": "2",
        "status": "APPROVED",
        "description": "Revised Package incorporates requested institutional tone.",
        "changedArtifactIds": [
          "linkedin-content"
        ],
        "decisionReference": "final-package-review",
        "illustrative": true
      }
    ],
    "traceability": [
      {
        "id": "trace-001",
        "sourceType": "project-context",
        "sourceReference": "protocol-overview",
        "artifactId": "editorial-core",
        "artifactVersion": "1",
        "reviewCheckpointId": "semantic-consistency-review",
        "decisionReference": "editorial-core-approval",
        "rationale": "The retained claim is connected to the supplied protocol documentation."
      }
    ],
    "qualityGates": [
      {
        "id": "factual-support",
        "name": "Factual support",
        "description": "Relevant factual claims must connect to trusted context or approved evidence.",
        "severityWhenFailed": "BLOCKING"
      },
      {
        "id": "human-approval",
        "name": "Human approval",
        "description": "An authorized customer decision is required before the future workflow considers the Package ready.",
        "severityWhenFailed": "BLOCKING"
      }
    ],
    "limitations": [
      "No external publication occurs from this Package explanation.",
      "No automatic social posting occurs.",
      "No CMS integration is configured.",
      "Unsupported claims are excluded from the intended workflow.",
      "Customer approval remains required.",
      "No financial meaning is assigned to $Neurons."
    ],
    "sections": {
      "Overview": {
        "title": "Overview",
        "body": "The Editorial Package explains the reviewed editorial result of the Neurons\nProtocol Launch Project. It is an informational example, not a live customer\nPackage or an operational publishing surface."
      },
      "Business objective": {
        "title": "Business objective",
        "body": "Give a communications team one coherent, evidence-aware editorial response\nthat can be reviewed before any customer-controlled publication decision."
      },
      "Contents": {
        "title": "Contents",
        "body": "It groups context, the Editorial Core, strategy, channel variants, review\nfindings, and the human decision record instead of presenting isolated files."
      },
      "Artifacts": {
        "title": "Artifacts",
        "body": "The structured artifacts above illustrate what the customer reviews together.\nThey are views of governed materials, not downloadable files."
      },
      "Review process": {
        "title": "Review process",
        "body": "The ordered checkpoints describe how a customer reviewer considers completeness,\nsemantic consistency, and the final Package in a future functional workflow."
      },
      "Approval": {
        "title": "Approval",
        "body": "Human Governance remains decisive. The static site shows no approval control\nand does not change any Package state."
      },
      "Revision policy": {
        "title": "Revision policy",
        "body": "Customers may clarify context, claims, tone, or channel emphasis. Affected\nmaterials and reviews may be reconsidered; earlier versions stay traceable and\nrevision effort may change the required resources."
      },
      "Version history": {
        "title": "Version history",
        "body": "The two records in this example are illustrative. They show that a revision\ncreates a new version rather than replacing the record of prior reasoning."
      },
      "Traceability": {
        "title": "Traceability",
        "body": "Project context leads to a produced artifact, its version, a review finding,\na human decision, and the final Package. The example exposes this lineage\nwithout disclosing runtime, provider, or persistence internals."
      },
      "Quality gates": {
        "title": "Quality gates",
        "body": "Factual support and Human Governance are blocking illustrative gates. They\nmake clear that channel adaptation cannot override evidence boundaries."
      },
      "Limitations": {
        "title": "Limitations",
        "body": "Publication remains a customer decision. This static explanation has no CMS,\nsocial network, Connector, or automatic publication capability."
      },
      "Relationship with Projects": {
        "title": "Relationship with Projects",
        "body": "This Package is the customer-facing result described by the Neurons Protocol\nLaunch Project and inherits its supplied context and review boundaries."
      },
      "Relationship with Product": {
        "title": "Relationship with Product",
        "body": "BBA Publisher supplies the product pattern for turning trusted context into a\ncoordinated editorial response. Its separately hosted prototype is the only\nprototype-backed example in this catalog."
      },
      "Future operational workflow": {
        "title": "Future operational workflow",
        "body": "At `dev.bba.country`, a functional workflow may present materials and record\nauthorized decisions. A real external publication would still require a\nsuccessfully configured Connector and customer authority."
      },
      "Frequently asked questions": {
        "title": "Frequently asked questions",
        "body": "### Is this a publishing service?\n\nIt prepares reviewed editorial materials; it does not publish them.\n\n### Does the Package post to social networks?\n\nNo. Channel material remains subject to the customer's own publication choice.\n\n### Can the customer request a revision?\n\nYes, in the future workflow a request may create a new traceable version.\n\n### Are the artifacts separate files?\n\nNo. The static site describes structured materials and does not offer files.\n\n### Who makes the final decision?\n\nAn authorized customer reviewer retains that Human Governance responsibility."
      }
    },
    "faq": [
      {
        "question": "Is this a publishing service?",
        "answer": "It prepares reviewed editorial materials; it does not publish them."
      },
      {
        "question": "Does the Package post to social networks?",
        "answer": "No. Channel material remains subject to the customer's own publication choice."
      },
      {
        "question": "Can the customer request a revision?",
        "answer": "Yes, in the future workflow a request may create a new traceable version."
      },
      {
        "question": "Are the artifacts separate files?",
        "answer": "No. The static site describes structured materials and does not offer files."
      },
      {
        "question": "Who makes the final decision?",
        "answer": "An authorized customer reviewer retains that Human Governance responsibility."
      }
    ],
    "sourcePath": "static/content/deliveries/editorial-package.md"
  },
  {
    "schemaVersion": "1.0",
    "id": "institutional-package",
    "name": "Institutional Package",
    "slug": "institutional-package",
    "route": "/deliveries/institutional-package",
    "category": "Governance",
    "status": "ILLUSTRATIVE_PLANNED",
    "operationalOnStaticSite": false,
    "productId": "governance-proposal",
    "productName": "Governance Proposal",
    "productRoute": "/services/governance",
    "projectId": "ai-content-governance-proposal",
    "projectName": "Institutional AI Content Governance Proposal",
    "projectRoute": "/projects/ai-content-governance-proposal",
    "eyebrow": "Delivery Package",
    "headline": "The evidence, alternatives, risk review, and decision rationale for an institutional governance proposal.",
    "summary": "An illustrative planned Package showing how a governance question can be organized for authorized human decision-makers.",
    "purpose": "Make institutional context, stakeholder considerations, alternatives, and rationale reviewable without making the institutional decision.",
    "customerOutcome": "A reviewable Institutional Package with a governance proposal, evidence synthesis, alternatives, risks, and illustrative decision lineage.",
    "availability": {
      "code": "ILLUSTRATIVE_PLANNED",
      "label": "Illustrative planned Package",
      "operationalOnStaticSite": false
    },
    "prototype": {
      "available": false,
      "disclosure": "This Package illustrates a planned BBA Agency Product. It does not represent an operational implementation."
    },
    "seo": {
      "title": "Institutional Package | BBA Agency",
      "description": "Learn how an Institutional Package organizes governance evidence, alternatives, review, and rationale.",
      "canonicalPath": "/deliveries/institutional-package"
    },
    "navigation": {
      "previousDelivery": "scientific-package",
      "nextDelivery": "research-package"
    },
    "keywords": [
      "governance proposal",
      "stakeholder analysis",
      "decision rationale",
      "human review"
    ],
    "artifacts": [
      {
        "id": "institutional-context-summary",
        "name": "Institutional Context Summary",
        "description": "The stated institutional question, materials, and constraints.",
        "purpose": "Bound the proposal context.",
        "artifactType": "context",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "structured view"
        ]
      },
      {
        "id": "problem-framing",
        "name": "Problem Framing",
        "description": "A clear statement of the decision question and its implications.",
        "purpose": "Make the governance issue understandable.",
        "artifactType": "analysis",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "structured view"
        ]
      },
      {
        "id": "stakeholder-analysis",
        "name": "Stakeholder Analysis",
        "description": "Relevant roles, interests, responsibilities, and impacts.",
        "purpose": "Keep affected perspectives visible.",
        "artifactType": "analysis",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "stakeholder view"
        ]
      },
      {
        "id": "evidence-synthesis",
        "name": "Evidence Synthesis",
        "description": "The supplied policy and context evidence organized for consideration.",
        "purpose": "Link the proposal to accountable context.",
        "artifactType": "synthesis",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "evidence view"
        ]
      },
      {
        "id": "alternatives-matrix",
        "name": "Alternatives Matrix",
        "description": "Plausible alternatives and their stated tradeoffs.",
        "purpose": "Support deliberation without selecting an outcome.",
        "artifactType": "analysis",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "comparison view"
        ]
      },
      {
        "id": "governance-proposal",
        "name": "Governance Proposal",
        "description": "A proposed accountable approach for institutional consideration.",
        "purpose": "Give authorized decision-makers a reviewable option.",
        "artifactType": "proposal",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "proposal view"
        ]
      },
      {
        "id": "risk-impact-review",
        "name": "Risk and Impact Review",
        "description": "Known risks, impacts, uncertainties, and external review needs.",
        "purpose": "Prevent the proposal from hiding material concerns.",
        "artifactType": "review-record",
        "requiresHumanApproval": false,
        "includedInPackage": true,
        "illustrativeFormats": [
          "risk view"
        ]
      },
      {
        "id": "decision-rationale",
        "name": "Decision Rationale",
        "description": "An illustrative record of the considerations behind a human direction.",
        "purpose": "Preserve rationale without assigning institutional authority to the system.",
        "artifactType": "decision-record",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "decision summary"
        ]
      }
    ],
    "reviewProcess": [
      {
        "order": 1,
        "id": "context-review",
        "label": "Review institutional context",
        "purpose": "Confirm the problem framing and stakeholder scope.",
        "reviewerRole": "Institutional steward",
        "artifactIds": [
          "institutional-context-summary",
          "stakeholder-analysis"
        ],
        "possibleOutcomes": [
          "CONFIRM",
          "REQUEST_CLARIFICATION"
        ],
        "humanCheckpoint": true
      },
      {
        "order": 2,
        "id": "alternatives-review",
        "label": "Review evidence and alternatives",
        "purpose": "Consider evidence synthesis and tradeoffs without delegating authority.",
        "reviewerRole": "Authorized decision-maker",
        "artifactIds": [
          "evidence-synthesis",
          "alternatives-matrix"
        ],
        "possibleOutcomes": [
          "CONFIRM",
          "REQUEST_CHANGES"
        ],
        "humanCheckpoint": true
      },
      {
        "order": 3,
        "id": "final-institutional-review",
        "label": "Review the final proposal Package",
        "purpose": "Consider proposal, risks, rationale, limitations, and history.",
        "reviewerRole": "Authorized decision-maker",
        "artifactIds": [
          "governance-proposal",
          "risk-impact-review",
          "decision-rationale"
        ],
        "possibleOutcomes": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "humanCheckpoint": true
      }
    ],
    "approval": {
      "required": true,
      "responsibleRole": "Authorized institutional decision-maker",
      "description": "The future Package is considered only after authorized humans review final artifacts, findings, limitations, and history.",
      "possibleResponses": [
        "APPROVE",
        "REQUEST_CHANGES",
        "REJECT"
      ],
      "operationalOnStaticSite": false
    },
    "revisionPolicy": {
      "description": "A changed policy question or stakeholder concern creates a new illustrative version while preserving prior evidence and rationale.",
      "preserves": [
        "previous versions",
        "human decisions",
        "source references"
      ],
      "mayInvalidate": [
        "alternatives",
        "risk findings",
        "prior final approval"
      ]
    },
    "versionHistory": [
      {
        "version": "1",
        "status": "REVIEWED",
        "description": "Initial illustrative governance proposal prepared for review.",
        "changedArtifactIds": [
          "governance-proposal"
        ],
        "decisionReference": "alternatives-review",
        "illustrative": true
      },
      {
        "version": "2",
        "status": "APPROVED",
        "description": "Illustrative revision records a clarified stakeholder concern.",
        "changedArtifactIds": [
          "stakeholder-analysis"
        ],
        "decisionReference": "final-institutional-review",
        "illustrative": true
      }
    ],
    "traceability": [
      {
        "id": "trace-001",
        "sourceType": "project-context",
        "sourceReference": "governance-policy-brief",
        "artifactId": "evidence-synthesis",
        "artifactVersion": "1",
        "reviewCheckpointId": "alternatives-review",
        "decisionReference": "final-institutional-review",
        "rationale": "The proposal evidence is connected to supplied policy context and authorized review."
      }
    ],
    "qualityGates": [
      {
        "id": "accountable-scope",
        "name": "Accountable scope",
        "description": "The Package must not present a proposal as an institutional decision.",
        "severityWhenFailed": "BLOCKING"
      },
      {
        "id": "external-review",
        "name": "External review needs",
        "description": "Legal and policy questions must remain visible for appropriate specialist review.",
        "severityWhenFailed": "WARNING"
      }
    ],
    "limitations": [
      "No institutional decision-making is performed.",
      "No authoritative legal advice is provided.",
      "External legal and policy review remains necessary.",
      "Final approval belongs to authorized human decision-makers."
    ],
    "sections": {
      "Overview": {
        "title": "Overview",
        "body": "This illustrative planned Package explains a governance proposal as a\ntransparent input to Human Governance, never as an institutional decision."
      },
      "Business objective": {
        "title": "Business objective",
        "body": "Give authorized decision-makers an accountable view of context, stakeholders,\nevidence, alternatives, risks, and rationale."
      },
      "Contents": {
        "title": "Contents",
        "body": "It combines institutional context, framing, stakeholder analysis, evidence,\nalternatives, a proposal, risk review, and decision rationale."
      },
      "Artifacts": {
        "title": "Artifacts",
        "body": "The artifacts are structured deliberation materials rather than legal advice\nor a substitute for institutional authority."
      },
      "Review process": {
        "title": "Review process",
        "body": "Institutional stewards review context, then alternatives, then the final\nproposal and its stated limits."
      },
      "Approval": {
        "title": "Approval",
        "body": "Only authorized human decision-makers can direct the future workflow. This\nstatic explanation cannot record a decision."
      },
      "Revision policy": {
        "title": "Revision policy",
        "body": "New policy context or stakeholder feedback can require new alternatives,\nfindings, and a new version. Prior rationale remains visible and effort may\nchange with scope."
      },
      "Version history": {
        "title": "Version history",
        "body": "The displayed version history is illustrative for this planned Product."
      },
      "Traceability": {
        "title": "Traceability",
        "body": "Project context connects to a synthesized artifact, version, review finding,\nhuman decision, and the assembled Package."
      },
      "Quality gates": {
        "title": "Quality gates",
        "body": "The Package blocks unsupported claims of institutional authority and keeps\nexternal review needs visible."
      },
      "Limitations": {
        "title": "Limitations",
        "body": "It makes no decision, gives no authoritative legal advice, and cannot remove\nthe need for external legal or policy review."
      },
      "Relationship with Projects": {
        "title": "Relationship with Projects",
        "body": "It is the described outcome of the Institutional AI Content Governance Proposal\nProject."
      },
      "Relationship with Product": {
        "title": "Relationship with Product",
        "body": "It explains the intended Governance Proposal Product and its Human Governance\nboundary without claiming an implementation."
      },
      "Future operational workflow": {
        "title": "Future operational workflow",
        "body": "A future platform may preserve review evidence and decision rationale, while\nauthorized institutional humans retain all approval authority."
      },
      "Frequently asked questions": {
        "title": "Frequently asked questions",
        "body": "### Does this make an institutional decision?\n\nNo. Institutional approval remains external and human.\n\n### Is this legal advice?\n\nNo. Appropriate legal and policy review remains necessary.\n\n### Can alternatives change?\n\nYes. Future revisions may create a new version with prior rationale preserved.\n\n### Who reviews stakeholder impacts?\n\nAuthorized institutional stewards and decision-makers retain that role.\n\n### Is the workflow operational today?\n\nNo. This is an illustrative planned Package."
      }
    },
    "faq": [
      {
        "question": "Does this make an institutional decision?",
        "answer": "No. Institutional approval remains external and human."
      },
      {
        "question": "Is this legal advice?",
        "answer": "No. Appropriate legal and policy review remains necessary."
      },
      {
        "question": "Can alternatives change?",
        "answer": "Yes. Future revisions may create a new version with prior rationale preserved."
      },
      {
        "question": "Who reviews stakeholder impacts?",
        "answer": "Authorized institutional stewards and decision-makers retain that role."
      },
      {
        "question": "Is the workflow operational today?",
        "answer": "No. This is an illustrative planned Package."
      }
    ],
    "sourcePath": "static/content/deliveries/institutional-package.md"
  },
  {
    "schemaVersion": "1.0",
    "id": "research-package",
    "name": "Research Package",
    "slug": "research-package",
    "route": "/deliveries/research-package",
    "category": "Market Research",
    "status": "ILLUSTRATIVE_PLANNED",
    "operationalOnStaticSite": false,
    "productId": "market-research",
    "productName": "Market Research",
    "productRoute": "/services/research",
    "projectId": "enterprise-ai-publishing-market-study",
    "projectName": "Enterprise AI Publishing Market Study",
    "projectRoute": "/projects/enterprise-ai-publishing-market-study",
    "eyebrow": "Delivery Package",
    "headline": "The research brief, method, sources, findings, recommendations, and assumptions behind a market study.",
    "summary": "An illustrative planned Package explaining how a market-research outcome makes evidence and uncertainty visible.",
    "purpose": "Connect a research question, method, source inventory, findings, recommendations, and assumptions in one reviewable result.",
    "customerOutcome": "A reviewable Research Package with a brief, methodology, source inventory, market evidence, insights, recommendations, and limitations.",
    "availability": {
      "code": "ILLUSTRATIVE_PLANNED",
      "label": "Illustrative planned Package",
      "operationalOnStaticSite": false
    },
    "prototype": {
      "available": false,
      "disclosure": "This Package illustrates a planned BBA Agency Product. It does not represent an operational implementation."
    },
    "seo": {
      "title": "Research Package | BBA Agency",
      "description": "Learn how a Research Package organizes methodology, sources, findings, recommendations, and uncertainty.",
      "canonicalPath": "/deliveries/research-package"
    },
    "navigation": {
      "previousDelivery": "institutional-package",
      "nextDelivery": null
    },
    "keywords": [
      "market research",
      "source inventory",
      "recommendations",
      "assumptions"
    ],
    "artifacts": [
      {
        "id": "research-brief",
        "name": "Research Brief",
        "description": "The stated question, scope, intended use, and constraints.",
        "purpose": "Define a bounded research objective.",
        "artifactType": "brief",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "structured view"
        ]
      },
      {
        "id": "research-plan",
        "name": "Research Plan",
        "description": "The illustrative methodology, inclusion criteria, and approach.",
        "purpose": "Make the research method reviewable.",
        "artifactType": "methodology",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "methodology view"
        ]
      },
      {
        "id": "source-inventory",
        "name": "Source Inventory",
        "description": "A visible inventory of relevant source categories and limitations.",
        "purpose": "Make evidence availability and quality explicit.",
        "artifactType": "inventory",
        "requiresHumanApproval": false,
        "includedInPackage": true,
        "illustrativeFormats": [
          "source view"
        ]
      },
      {
        "id": "market-overview",
        "name": "Market Overview",
        "description": "An organized description of the market context within the stated scope.",
        "purpose": "Give findings a contextual frame.",
        "artifactType": "analysis",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "analysis view"
        ]
      },
      {
        "id": "competitor-analysis",
        "name": "Competitor Analysis",
        "description": "A comparative view based on available and appropriate sources.",
        "purpose": "Surface relevant market alternatives.",
        "artifactType": "analysis",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "comparison view"
        ]
      },
      {
        "id": "trends-and-patterns",
        "name": "Trends and Patterns",
        "description": "Observed patterns with stated confidence and uncertainty.",
        "purpose": "Distinguish observation from certainty.",
        "artifactType": "synthesis",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "patterns view"
        ]
      },
      {
        "id": "insights",
        "name": "Insights",
        "description": "Interpreted observations connected to the research question.",
        "purpose": "Support human consideration of findings.",
        "artifactType": "synthesis",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "insight view"
        ]
      },
      {
        "id": "recommendations",
        "name": "Recommendations",
        "description": "Bounded next considerations based on available evidence and assumptions.",
        "purpose": "Inform rather than guarantee commercial decisions.",
        "artifactType": "recommendation",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "recommendation view"
        ]
      },
      {
        "id": "assumptions-and-limitations",
        "name": "Assumptions and Limitations",
        "description": "Explicit uncertainty, unavailable information, and scope restrictions.",
        "purpose": "Keep conclusions proportionate to evidence quality.",
        "artifactType": "limitation-record",
        "requiresHumanApproval": false,
        "includedInPackage": true,
        "illustrativeFormats": [
          "limitations view"
        ]
      }
    ],
    "reviewProcess": [
      {
        "order": 1,
        "id": "methodology-review",
        "label": "Review research scope and method",
        "purpose": "Confirm the brief, plan, and appropriate source approach.",
        "reviewerRole": "Customer research reviewer",
        "artifactIds": [
          "research-brief",
          "research-plan"
        ],
        "possibleOutcomes": [
          "CONFIRM",
          "REQUEST_CLARIFICATION"
        ],
        "humanCheckpoint": true
      },
      {
        "order": 2,
        "id": "findings-review",
        "label": "Review findings and uncertainty",
        "purpose": "Consider source inventory, market observations, and assumptions.",
        "reviewerRole": "Customer research reviewer",
        "artifactIds": [
          "source-inventory",
          "market-overview",
          "assumptions-and-limitations"
        ],
        "possibleOutcomes": [
          "CONFIRM",
          "REQUEST_CHANGES"
        ],
        "humanCheckpoint": true
      },
      {
        "order": 3,
        "id": "final-research-review",
        "label": "Review the final research Package",
        "purpose": "Consider insights, recommendations, limitations, and history.",
        "reviewerRole": "Authorized customer reviewer",
        "artifactIds": [
          "insights",
          "recommendations"
        ],
        "possibleOutcomes": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "humanCheckpoint": true
      }
    ],
    "approval": {
      "required": true,
      "responsibleRole": "Authorized customer reviewer",
      "description": "The future Package is ready only after a customer reviews the final findings, assumptions, recommendations, limitations, and history.",
      "possibleResponses": [
        "APPROVE",
        "REQUEST_CHANGES",
        "REJECT"
      ],
      "operationalOnStaticSite": false
    },
    "revisionPolicy": {
      "description": "New source context or changed research scope creates a new illustrative version while retaining prior assumptions and decisions.",
      "preserves": [
        "previous versions",
        "human decisions",
        "source references"
      ],
      "mayInvalidate": [
        "findings",
        "recommendations",
        "prior final approval"
      ]
    },
    "versionHistory": [
      {
        "version": "1",
        "status": "REVIEWED",
        "description": "Initial illustrative research synthesis prepared for review.",
        "changedArtifactIds": [
          "market-overview"
        ],
        "decisionReference": "findings-review",
        "illustrative": true
      },
      {
        "version": "2",
        "status": "APPROVED",
        "description": "Illustrative revision records clarified assumptions.",
        "changedArtifactIds": [
          "assumptions-and-limitations"
        ],
        "decisionReference": "final-research-review",
        "illustrative": true
      }
    ],
    "traceability": [
      {
        "id": "trace-001",
        "sourceType": "project-context",
        "sourceReference": "market-research-brief",
        "artifactId": "source-inventory",
        "artifactVersion": "1",
        "reviewCheckpointId": "methodology-review",
        "decisionReference": "findings-review",
        "rationale": "The source inventory links the research method to available market context."
      }
    ],
    "qualityGates": [
      {
        "id": "source-quality",
        "name": "Source quality",
        "description": "Conclusions must remain proportionate to source availability and quality.",
        "severityWhenFailed": "BLOCKING"
      },
      {
        "id": "uncertainty-visibility",
        "name": "Uncertainty visibility",
        "description": "Assumptions and material limitations must remain visible.",
        "severityWhenFailed": "WARNING"
      }
    ],
    "limitations": [
      "Results depend on source availability and quality.",
      "Assumptions and uncertainty must remain visible.",
      "Commercial outcomes cannot be guaranteed.",
      "Sensitive decisions require specialist and human review."
    ],
    "sections": {
      "Overview": {
        "title": "Overview",
        "body": "This illustrative planned Package describes a market-research result whose\nevidence boundaries and uncertainty remain visible."
      },
      "Business objective": {
        "title": "Business objective",
        "body": "Give teams a reviewable basis for discussing a market question without turning\nlimited evidence into a promise of commercial results."
      },
      "Contents": {
        "title": "Contents",
        "body": "It includes a brief, methodology, source inventory, market and competitor\nanalysis, trends, insights, recommendations, and limitations."
      },
      "Artifacts": {
        "title": "Artifacts",
        "body": "Artifacts present structured evidence and interpretation. They are not hidden\ndata stores or guarantees about a market outcome."
      },
      "Review process": {
        "title": "Review process",
        "body": "Review begins with scope and method, then findings and uncertainty, and ends\nwith a human consideration of recommendations and stated limits."
      },
      "Approval": {
        "title": "Approval",
        "body": "An authorized customer reviewer makes the future decision. This informational\nsite provides no approval action."
      },
      "Revision policy": {
        "title": "Revision policy",
        "body": "Changed scope or sources may invalidate findings and recommendations. A new\nversion preserves prior assumptions and decisions, and may require more resources."
      },
      "Version history": {
        "title": "Version history",
        "body": "The version history is illustrative because this Package represents planned\nbehavior rather than an operating research service."
      },
      "Traceability": {
        "title": "Traceability",
        "body": "Project context leads to a source inventory, its version, human review, and a\nfinal Package with the supporting rationale intact."
      },
      "Quality gates": {
        "title": "Quality gates",
        "body": "Source quality blocks overconfident conclusions, while uncertainty visibility\nkeeps limits available to customer reviewers."
      },
      "Limitations": {
        "title": "Limitations",
        "body": "Results depend on sources. Assumptions remain visible, commercial results are\nnot guaranteed, and sensitive decisions still need specialist human review."
      },
      "Relationship with Projects": {
        "title": "Relationship with Projects",
        "body": "It is the described outcome of the Enterprise AI Publishing Market Study Project."
      },
      "Relationship with Product": {
        "title": "Relationship with Product",
        "body": "It explains the intended Market Research Product without claiming an operational\nimplementation."
      },
      "Future operational workflow": {
        "title": "Future operational workflow",
        "body": "A future platform may coordinate source, review, and revision records. Customers\nand specialists retain authority for commercial or sensitive decisions."
      },
      "Frequently asked questions": {
        "title": "Frequently asked questions",
        "body": "### Are commercial outcomes guaranteed?\n\nNo. Recommendations are bounded by source quality and assumptions.\n\n### Can the research scope change?\n\nYes. A future revision would retain prior context and create a new version.\n\n### Are assumptions visible?\n\nYes. Assumptions and limitations are a required Package artifact.\n\n### Does the Package make sensitive decisions?\n\nNo. Specialist and human review remain necessary.\n\n### Is this an operational research platform?\n\nNo. It is an illustrative planned Package."
      }
    },
    "faq": [
      {
        "question": "Are commercial outcomes guaranteed?",
        "answer": "No. Recommendations are bounded by source quality and assumptions."
      },
      {
        "question": "Can the research scope change?",
        "answer": "Yes. A future revision would retain prior context and create a new version."
      },
      {
        "question": "Are assumptions visible?",
        "answer": "Yes. Assumptions and limitations are a required Package artifact."
      },
      {
        "question": "Does the Package make sensitive decisions?",
        "answer": "No. Specialist and human review remain necessary."
      },
      {
        "question": "Is this an operational research platform?",
        "answer": "No. It is an illustrative planned Package."
      }
    ],
    "sourcePath": "static/content/deliveries/research-package.md"
  },
  {
    "schemaVersion": "1.0",
    "id": "scientific-package",
    "name": "Scientific Package",
    "slug": "scientific-package",
    "route": "/deliveries/scientific-package",
    "category": "Scientific Writing",
    "status": "ILLUSTRATIVE_PLANNED",
    "operationalOnStaticSite": false,
    "productId": "scientific-article",
    "productName": "Scientific Article",
    "productRoute": "/services/scientific-writing",
    "projectId": "ai-publishing-research-article",
    "projectName": "AI-Assisted Publishing Research Article",
    "projectRoute": "/projects/ai-publishing-research-article",
    "eyebrow": "Delivery Package",
    "headline": "The evidence-aware structure, manuscript materials, and review record for a scientific article.",
    "summary": "An illustrative planned Package describing reviewable scientific-writing materials and their limitations.",
    "purpose": "Organize research context, evidence, manuscript work, and human scientific review without replacing scientific responsibility.",
    "customerOutcome": "A reviewable Scientific Package with an outline, draft manuscript, evidence map, citation review, and illustrative revision lineage.",
    "availability": {
      "code": "ILLUSTRATIVE_PLANNED",
      "label": "Illustrative planned Package",
      "operationalOnStaticSite": false
    },
    "prototype": {
      "available": false,
      "disclosure": "This Package illustrates a planned BBA Agency Product. It does not represent an operational implementation."
    },
    "seo": {
      "title": "Scientific Package | BBA Agency",
      "description": "Learn how a Scientific Package organizes evidence, manuscript materials, review, and traceability.",
      "canonicalPath": "/deliveries/scientific-package"
    },
    "navigation": {
      "previousDelivery": "campaign-package",
      "nextDelivery": "institutional-package"
    },
    "keywords": [
      "scientific writing",
      "evidence map",
      "citation review",
      "human review"
    ],
    "artifacts": [
      {
        "id": "research-context-summary",
        "name": "Research Context Summary",
        "description": "The stated research question, materials, and constraints.",
        "purpose": "Establish a bounded article context.",
        "artifactType": "context",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "structured view"
        ]
      },
      {
        "id": "evidence-map",
        "name": "Evidence Map",
        "description": "A visible map of supplied evidence and its relevance.",
        "purpose": "Prevent unsupported reasoning.",
        "artifactType": "analysis",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "evidence view"
        ]
      },
      {
        "id": "article-outline",
        "name": "Article Outline",
        "description": "A proposed structure for the scientific argument.",
        "purpose": "Make scope and sequence reviewable.",
        "artifactType": "outline",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "outline view"
        ]
      },
      {
        "id": "draft-manuscript",
        "name": "Draft Manuscript",
        "description": "A draft derived from supplied context and evidence boundaries.",
        "purpose": "Support human scientific review.",
        "artifactType": "manuscript",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "manuscript view"
        ]
      },
      {
        "id": "abstract",
        "name": "Abstract",
        "description": "A concise statement of the draft scope and contribution.",
        "purpose": "Make the article proposition reviewable.",
        "artifactType": "manuscript-section",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "manuscript view"
        ]
      },
      {
        "id": "keywords",
        "name": "Keywords",
        "description": "Proposed terms for discovery and classification.",
        "purpose": "Support human editorial consideration.",
        "artifactType": "metadata",
        "requiresHumanApproval": false,
        "includedInPackage": true,
        "illustrativeFormats": [
          "structured view"
        ]
      },
      {
        "id": "citation-review",
        "name": "Citation Review",
        "description": "Findings about citation support and context alignment.",
        "purpose": "Surface evidence questions for human review.",
        "artifactType": "review-record",
        "requiresHumanApproval": false,
        "includedInPackage": true,
        "illustrativeFormats": [
          "review summary"
        ]
      },
      {
        "id": "scientific-review-findings",
        "name": "Scientific Review Findings",
        "description": "Illustrative findings requiring scientific judgment.",
        "purpose": "Keep validation responsibility visible.",
        "artifactType": "review-record",
        "requiresHumanApproval": true,
        "includedInPackage": true,
        "illustrativeFormats": [
          "findings view"
        ]
      }
    ],
    "reviewProcess": [
      {
        "order": 1,
        "id": "evidence-review",
        "label": "Review evidence context",
        "purpose": "Confirm the supplied evidence map and research boundary.",
        "reviewerRole": "Scientific reviewer",
        "artifactIds": [
          "research-context-summary",
          "evidence-map"
        ],
        "possibleOutcomes": [
          "CONFIRM",
          "REQUEST_CLARIFICATION"
        ],
        "humanCheckpoint": true
      },
      {
        "order": 2,
        "id": "manuscript-review",
        "label": "Review manuscript structure",
        "purpose": "Consider the outline, draft, and abstract.",
        "reviewerRole": "Scientific reviewer",
        "artifactIds": [
          "article-outline",
          "draft-manuscript",
          "abstract"
        ],
        "possibleOutcomes": [
          "CONFIRM",
          "REQUEST_CHANGES"
        ],
        "humanCheckpoint": true
      },
      {
        "order": 3,
        "id": "final-scientific-review",
        "label": "Review scientific findings",
        "purpose": "Consider citations, findings, limitations, and history.",
        "reviewerRole": "Authorized scientific reviewer",
        "artifactIds": [
          "citation-review",
          "scientific-review-findings"
        ],
        "possibleOutcomes": [
          "APPROVE",
          "REQUEST_CHANGES",
          "REJECT"
        ],
        "humanCheckpoint": true
      }
    ],
    "approval": {
      "required": true,
      "responsibleRole": "Authorized scientific reviewer",
      "description": "A scientific reviewer considers final materials, findings, limitations, and history before a future delivery decision.",
      "possibleResponses": [
        "APPROVE",
        "REQUEST_CHANGES",
        "REJECT"
      ],
      "operationalOnStaticSite": false
    },
    "revisionPolicy": {
      "description": "Changes to evidence, argument, or citations create a new illustrative version while retaining prior review context.",
      "preserves": [
        "previous versions",
        "human decisions",
        "source references"
      ],
      "mayInvalidate": [
        "manuscript sections",
        "citation findings",
        "prior final approval"
      ]
    },
    "versionHistory": [
      {
        "version": "1",
        "status": "REVIEWED",
        "description": "Initial illustrative manuscript materials prepared for scientific review.",
        "changedArtifactIds": [
          "draft-manuscript"
        ],
        "decisionReference": "manuscript-review",
        "illustrative": true
      },
      {
        "version": "2",
        "status": "APPROVED",
        "description": "Illustrative revision records requested citation clarification.",
        "changedArtifactIds": [
          "citation-review"
        ],
        "decisionReference": "final-scientific-review",
        "illustrative": true
      }
    ],
    "traceability": [
      {
        "id": "trace-001",
        "sourceType": "project-context",
        "sourceReference": "research-context-brief",
        "artifactId": "evidence-map",
        "artifactVersion": "1",
        "reviewCheckpointId": "evidence-review",
        "decisionReference": "evidence-review",
        "rationale": "The evidence map connects the proposed article scope to supplied research context."
      }
    ],
    "qualityGates": [
      {
        "id": "evidence-integrity",
        "name": "Evidence integrity",
        "description": "Claims must remain connected to supplied or approved evidence.",
        "severityWhenFailed": "BLOCKING"
      },
      {
        "id": "scientific-review",
        "name": "Scientific review",
        "description": "Scientific validation remains an authorized human responsibility.",
        "severityWhenFailed": "BLOCKING"
      }
    ],
    "limitations": [
      "Evidence fabrication is not permitted.",
      "This Package does not replace authorship responsibility.",
      "Journal acceptance cannot be guaranteed.",
      "Scientific validation remains a human responsibility.",
      "Ethical and institutional requirements remain external."
    ],
    "sections": {
      "Overview": {
        "title": "Overview",
        "body": "This illustrative planned Package describes scientific-writing materials that\nremain subject to responsible human validation."
      },
      "Business objective": {
        "title": "Business objective",
        "body": "Give researchers a structured basis for reviewing scope, evidence, manuscript\nwork, citations, and limitations."
      },
      "Contents": {
        "title": "Contents",
        "body": "It assembles context, an evidence map, outline, draft manuscript, abstract,\nkeywords, citation review, and scientific findings."
      },
      "Artifacts": {
        "title": "Artifacts",
        "body": "Each artifact is a structured explanatory view rather than a claim of finished\npublication or an authorship replacement."
      },
      "Review process": {
        "title": "Review process",
        "body": "Scientific reviewers first consider evidence, then manuscript structure, then\nfindings and limitations."
      },
      "Approval": {
        "title": "Approval",
        "body": "An authorized scientific reviewer retains responsibility. The static site does\nnot perform a review or make a scientific determination."
      },
      "Revision policy": {
        "title": "Revision policy",
        "body": "Changed evidence, argument, or citations may invalidate draft sections and\nfindings. Earlier versions and decisions remain traceable; scope changes may\nalso change resources."
      },
      "Version history": {
        "title": "Version history",
        "body": "The history is illustrative because this is a planned Package, not proof of a\ncompleted scientific workflow."
      },
      "Traceability": {
        "title": "Traceability",
        "body": "The model connects Project context to an artifact version, a review checkpoint,\na human decision, and the final Package."
      },
      "Quality gates": {
        "title": "Quality gates",
        "body": "Evidence integrity and human scientific review are blocking illustrative gates."
      },
      "Limitations": {
        "title": "Limitations",
        "body": "No evidence is fabricated, no authorship is replaced, and no journal acceptance\nis promised. Ethical and institutional duties remain external."
      },
      "Relationship with Projects": {
        "title": "Relationship with Projects",
        "body": "This is the described outcome of the AI-Assisted Publishing Research Article\nProject."
      },
      "Relationship with Product": {
        "title": "Relationship with Product",
        "body": "It explains the intended Scientific Article Product without claiming an\noperational implementation."
      },
      "Future operational workflow": {
        "title": "Future operational workflow",
        "body": "A future platform may preserve structured review and revision records, while\nscientific validation and submission decisions stay under human authority."
      },
      "Frequently asked questions": {
        "title": "Frequently asked questions",
        "body": "### Does it guarantee publication?\n\nNo journal acceptance or publication outcome is guaranteed.\n\n### Does it validate scientific claims?\n\nNo. Scientific validation remains a human responsibility.\n\n### Can evidence be invented?\n\nNo. The Package requires visible evidence boundaries.\n\n### Can revisions be requested?\n\nYes. A future workflow may preserve a new illustrative version and prior lineage.\n\n### Does it replace authors?\n\nNo. Authorship and ethical obligations remain external human responsibilities."
      }
    },
    "faq": [
      {
        "question": "Does it guarantee publication?",
        "answer": "No journal acceptance or publication outcome is guaranteed."
      },
      {
        "question": "Does it validate scientific claims?",
        "answer": "No. Scientific validation remains a human responsibility."
      },
      {
        "question": "Can evidence be invented?",
        "answer": "No. The Package requires visible evidence boundaries."
      },
      {
        "question": "Can revisions be requested?",
        "answer": "Yes. A future workflow may preserve a new illustrative version and prior lineage."
      },
      {
        "question": "Does it replace authors?",
        "answer": "No. Authorship and ethical obligations remain external human responsibilities."
      }
    ],
    "sourcePath": "static/content/deliveries/scientific-package.md"
  }
] satisfies AgencyDeliveryPackageContent[];
