import type { AgencyProductContent } from "../product-content.types.js";

export const agencyProducts = [
  {
    "schemaVersion": "1.0",
    "id": "advertising-campaign",
    "name": "Advertising Campaign",
    "category": "Advertising",
    "slug": "advertising-campaign",
    "route": "/services/advertising",
    "status": "PLANNED",
    "eyebrow": "Advertising Strategy",
    "headline": "Transform a campaign objective into a coordinated creative and channel strategy.",
    "summary": "Advertising Campaign is a planned product for a coordinated campaign strategy, message system, creative direction, and channel package.",
    "customerProblem": "Campaign planning can fragment audience insight, positioning, creative direction, and channel choices across disconnected work.",
    "customerOutcome": "A clear Campaign Package that gives the customer a reviewable strategy and shared basis for execution decisions.",
    "primaryAudience": [
      "Marketing teams",
      "Brand teams",
      "Communications leaders"
    ],
    "contentLanguage": "English",
    "applicationLanguage": "English",
    "availability": {
      "label": "Planned",
      "code": "PLANNED",
      "operationalOnStaticSite": false
    },
    "seo": {
      "title": "Advertising Campaign | BBA Agency",
      "description": "Learn about BBA Agency's planned Advertising Campaign product for coordinated strategy and creative direction.",
      "canonicalPath": "/services/advertising"
    },
    "navigation": {
      "previousProduct": "bba-publisher",
      "nextProduct": "scientific-article"
    },
    "relatedProducts": [
      "market-research"
    ],
    "keywords": [
      "campaign strategy",
      "creative direction",
      "channel planning"
    ],
    "agentTeamStatus": "CONCEPTUAL",
    "agentTeam": [
      {
        "id": "campaign-strategist",
        "name": "Campaign Strategist",
        "responsibility": "Frames the objective, positioning, and strategic choices.",
        "stage": "Campaign strategy"
      },
      {
        "id": "audience-analyst",
        "name": "Audience Analyst",
        "responsibility": "Interprets audience, offer, and market context.",
        "stage": "Audience analysis"
      },
      {
        "id": "creative-concept-developer",
        "name": "Creative Concept Developer",
        "responsibility": "Develops distinct creative directions connected to the strategy.",
        "stage": "Creative concepts"
      },
      {
        "id": "channel-planner",
        "name": "Channel Planner",
        "responsibility": "Relates message directions to selected channels.",
        "stage": "Channel adaptation"
      },
      {
        "id": "campaign-consistency-reviewer",
        "name": "Campaign Consistency Reviewer",
        "responsibility": "Highlights message conflicts, restrictions, and risks.",
        "stage": "Risk review"
      }
    ],
    "workflow": [
      {
        "order": 1,
        "id": "campaign-context",
        "label": "Provide campaign context",
        "customerRole": "Supplies objective, offer, audience, brand guidance, restrictions, channels, timeframe, and success criteria.",
        "agencyRole": "Organizes the brief and identifies missing context.",
        "checkpoint": false,
        "expectedOutput": "Campaign context summary"
      },
      {
        "order": 2,
        "id": "audience-offer-analysis",
        "label": "Analyze audience and offer",
        "customerRole": "Clarifies market assumptions.",
        "agencyRole": "Interprets audience needs and offer relevance.",
        "checkpoint": false,
        "expectedOutput": "Audience and offer analysis"
      },
      {
        "order": 3,
        "id": "positioning",
        "label": "Define positioning",
        "customerRole": "Reviews the proposed strategic territory.",
        "agencyRole": "Develops value proposition and positioning options.",
        "checkpoint": true,
        "expectedOutput": "Selected positioning"
      },
      {
        "order": 4,
        "id": "campaign-strategy",
        "label": "Shape campaign strategy",
        "customerRole": "Confirms priorities and success criteria.",
        "agencyRole": "Connects positioning, messages, and channel purpose.",
        "checkpoint": false,
        "expectedOutput": "Campaign strategy"
      },
      {
        "order": 5,
        "id": "creative-concepts",
        "label": "Explore creative concepts",
        "customerRole": "Selects or redirects concept directions.",
        "agencyRole": "Produces distinct creative concept directions.",
        "checkpoint": true,
        "expectedOutput": "Selected creative direction"
      },
      {
        "order": 6,
        "id": "channel-adaptation",
        "label": "Plan channel adaptation",
        "customerRole": "Confirms selected channels.",
        "agencyRole": "Maps messages and copy directions to each channel.",
        "checkpoint": false,
        "expectedOutput": "Channel plan"
      },
      {
        "order": 7,
        "id": "risk-review",
        "label": "Review consistency and risk",
        "customerRole": "Reviews flagged restrictions and tradeoffs.",
        "agencyRole": "Identifies consistency and risk findings.",
        "checkpoint": false,
        "expectedOutput": "Review findings"
      },
      {
        "order": 8,
        "id": "human-selection",
        "label": "Confirm campaign package",
        "customerRole": "Makes final selections and delivery decision.",
        "agencyRole": "Records decisions and assembles the package.",
        "checkpoint": true,
        "expectedOutput": "Campaign Package"
      }
    ],
    "deliverables": [
      {
        "id": "campaign-brief",
        "name": "Campaign brief",
        "description": "Shared statement of objective, context, audience, offer, restrictions, and success criteria.",
        "format": [
          "structured view"
        ],
        "requiresApproval": true
      },
      {
        "id": "message-architecture",
        "name": "Message architecture",
        "description": "Value proposition, positioning, and message directions for the selected strategy.",
        "format": [
          "structured view"
        ],
        "requiresApproval": true
      },
      {
        "id": "creative-concepts",
        "name": "Creative concepts",
        "description": "Reviewable creative directions and copy directions tied to the strategy.",
        "format": [
          "structured view"
        ],
        "requiresApproval": true
      },
      {
        "id": "campaign-package",
        "name": "Campaign Package",
        "description": "Campaign brief, audience definition, strategy, channel plan, hypotheses, and review findings.",
        "format": [
          "structured view",
          "JSON export"
        ],
        "requiresApproval": true
      }
    ],
    "routeSegment": "advertising",
    "sourcePath": "static/content/products/advertising-campaign.md",
    "sections": {
      "overview": {
        "title": "Overview",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Advertising Campaign is a planned product that would transform a campaign objective into coordinated strategy, creative direction, message architecture, and channel planning. This page describes the concept only; it performs no campaign work on the static site."
              }
            ]
          }
        ]
      },
      "problem": {
        "title": "The problem it addresses",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Campaigns lose coherence when the brief, audience definition, offer, positioning, creative concepts, and channel decisions are developed in isolation."
              }
            ]
          }
        ]
      },
      "audience": {
        "title": "Who it is for",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "It is intended for marketing, brand, and communications teams preparing a campaign for human-led selection and execution."
              }
            ]
          }
        ]
      },
      "customerInputs": {
        "title": "What the customer provides",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The customer provides the objective, offer or initiative, audience, market context, brand guidance, existing research, restrictions, channels, timeframe, and success criteria."
              }
            ]
          }
        ]
      },
      "agencyWork": {
        "title": "What the Agency does",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The conceptual Agency team would analyze audience and offer, frame positioning, develop creative concepts, plan channel use, and surface consistency and risk questions for customer review."
              }
            ]
          }
        ]
      },
      "productWorkflow": {
        "title": "How the product works",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Campaign Context leads to Audience and Offer Analysis, Positioning, Campaign Strategy, Creative Concepts, Channel Adaptation, Consistency and Risk Review, Human Selection, and a Campaign Package. The customer provides context, confirms key choices, follows coordinated work, reviews decisions, and receives the package."
              }
            ]
          }
        ]
      },
      "agentTeam": {
        "title": "Agent team",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The planned conceptual roles are Campaign Strategist, Audience Analyst, Creative Concept Developer, Channel Planner, and Campaign Consistency Reviewer. They describe coordinated execution roles, not currently operational agents."
              }
            ]
          }
        ]
      },
      "humanReview": {
        "title": "Human review and control",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The customer reviews positioning, selects or redirects creative concepts, and confirms the package. Budgets, execution decisions, and result assessment stay under customer control."
              }
            ]
          }
        ]
      },
      "customerReceives": {
        "title": "What the customer receives",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The proposed Campaign Package includes a campaign brief, audience definition, value proposition, positioning, message architecture, creative concepts, copy directions, channel plan, testing hypotheses, and risk and consistency review."
              }
            ]
          }
        ]
      },
      "exampleProject": {
        "title": "Example project",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "strong",
                "value": "Illustrative example."
              },
              {
                "type": "text",
                "value": " A regional service organization wants to introduce a new member benefit. It supplies brand guidance, an audience hypothesis, restrictions, and a six-week timeframe. A human checkpoint selects one creative direction; the conceptual package then groups strategy, channel plan, copy directions, hypotheses, and flagged risks for the team's own execution."
              }
            ]
          }
        ]
      },
      "qualityTraceability": {
        "title": "Quality and traceability",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The package would preserve the links between the supplied brief, selected positioning, creative choices, restrictions, and review findings so decisions can be revisited."
              }
            ]
          }
        ]
      },
      "limitations": {
        "title": "What the product does not do",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "It does not purchase media, guarantee campaign performance, control customer budgets or results, or replace legal and platform-policy review. It is planned and not currently available in the prototype."
              }
            ]
          }
        ]
      },
      "availability": {
        "title": "Availability",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Planned. No operational CTA or prototype access is offered for this product."
              }
            ]
          }
        ]
      },
      "platformRelationship": {
        "title": "Relationship to the BBA platform",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "This is a proposed customer-facing service. Any future coordinated experience would be presented as a project with human checkpoints and a Campaign Package, not as direct access to internal platform components."
              }
            ]
          }
        ]
      },
      "faq": [
        {
          "question": "What does the customer need to provide?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "A campaign objective, offer, audience, market context, brand guidance, restrictions, channels, timeframe, and success criteria."
                }
              ]
            }
          ]
        },
        {
          "question": "Where does human review occur?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "At positioning, creative selection, and final package confirmation."
                }
              ]
            }
          ]
        },
        {
          "question": "What does the final package include?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "It includes the brief, audience definition, positioning, message architecture, creative concepts, copy directions, channel plan, hypotheses, and review."
                }
              ]
            }
          ]
        },
        {
          "question": "What does the product not do?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "It does not buy media, control budgets, guarantee results, or replace required legal and platform-policy review."
                }
              ]
            }
          ]
        },
        {
          "question": "Is the product currently available?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "No. Advertising Campaign is planned and is not part of the current prototype."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    "schemaVersion": "1.0",
    "id": "bba-publisher",
    "name": "BBA Publisher",
    "category": "Publication Strategy",
    "slug": "bba-publisher",
    "route": "/services/publisher",
    "status": "PROTOTYPE_AVAILABLE",
    "prototypeUrl": "https://dev.bba.country",
    "prototypeDisclosure": "The functional prototype is hosted separately and demonstrates the current BBA Publisher experience.",
    "eyebrow": "Publication Strategy",
    "headline": "Turn trusted context into a coordinated editorial package.",
    "summary": "BBA Publisher turns source materials, objectives, and communication constraints into reviewed content for multiple publishing channels.",
    "customerProblem": "Teams need channel-ready editorial work without losing the evidence, terminology, or intent that makes their message trustworthy.",
    "customerOutcome": "A reviewed Editorial Package that connects a clear central message to suitable channel variants and documented decisions.",
    "primaryAudience": [
      "Communications teams",
      "Marketing teams",
      "Research organizations"
    ],
    "contentLanguage": "English",
    "applicationLanguage": "English",
    "availability": {
      "label": "Prototype available",
      "code": "PROTOTYPE_AVAILABLE",
      "operationalOnStaticSite": false
    },
    "seo": {
      "title": "BBA Publisher | BBA Agency",
      "description": "Learn how BBA Publisher transforms trusted context into a reviewed multichannel editorial package.",
      "canonicalPath": "/services/publisher"
    },
    "navigation": {
      "previousProduct": null,
      "nextProduct": "advertising-campaign"
    },
    "relatedProducts": [
      "market-research"
    ],
    "keywords": [
      "editorial strategy",
      "multichannel publishing",
      "human review"
    ],
    "agentTeamStatus": "PROTOTYPE_IMPLEMENTED",
    "agentTeam": [
      {
        "id": "context-analyst",
        "name": "Context Analyst",
        "responsibility": "Interprets supplied materials, facts, terminology, and constraints.",
        "stage": "Context analysis"
      },
      {
        "id": "editorial-strategist",
        "name": "Editorial Strategist",
        "responsibility": "Defines the editorial core and publication strategy.",
        "stage": "Editorial planning"
      },
      {
        "id": "platform-adapter",
        "name": "Platform Adapter",
        "responsibility": "Adapts approved meaning to the selected channel contexts.",
        "stage": "Channel adaptation"
      },
      {
        "id": "semantic-consistency-reviewer",
        "name": "Semantic Consistency Reviewer",
        "responsibility": "Identifies unsupported claims, omissions, and drift across variants.",
        "stage": "Consistency review"
      },
      {
        "id": "human-governance",
        "name": "Human Governance",
        "responsibility": "Reviews important interpretations and approves or requests changes.",
        "stage": "Decision checkpoints"
      }
    ],
    "workflow": [
      {
        "order": 1,
        "id": "editorial-context",
        "label": "Provide editorial context",
        "customerRole": "Supplies objectives, materials, facts, constraints, and intended channels.",
        "agencyRole": "Organizes the supplied context and identifies gaps.",
        "checkpoint": false,
        "expectedOutput": "Context analysis"
      },
      {
        "order": 2,
        "id": "context-analysis",
        "label": "Analyze context",
        "customerRole": "Clarifies any missing or ambiguous material.",
        "agencyRole": "Interprets audience, evidence, terminology, and prohibited claims.",
        "checkpoint": false,
        "expectedOutput": "Editorial foundation"
      },
      {
        "order": 3,
        "id": "editorial-core",
        "label": "Define the Editorial Core",
        "customerRole": "Reviews the central message and evidence boundaries.",
        "agencyRole": "Produces the shared semantic foundation.",
        "checkpoint": false,
        "expectedOutput": "Proposed Editorial Core"
      },
      {
        "order": 4,
        "id": "human-approval",
        "label": "Approve the Editorial Core",
        "customerRole": "Confirms, corrects, or rejects the proposed foundation.",
        "agencyRole": "Records the decision and requested revisions.",
        "checkpoint": true,
        "expectedOutput": "Approved Editorial Core"
      },
      {
        "order": 5,
        "id": "publication-strategy",
        "label": "Plan publication strategy",
        "customerRole": "Confirms priorities for the selected channels.",
        "agencyRole": "Defines the role and relationship of each channel.",
        "checkpoint": false,
        "expectedOutput": "Publication strategy"
      },
      {
        "order": 6,
        "id": "channel-adaptation",
        "label": "Adapt for channels",
        "customerRole": "Reviews material when a channel needs special direction.",
        "agencyRole": "Creates channel-specific variants from the approved core.",
        "checkpoint": false,
        "expectedOutput": "Blog, LinkedIn, and Instagram content"
      },
      {
        "order": 7,
        "id": "consistency-review",
        "label": "Review consistency",
        "customerRole": "Considers material findings and corrections.",
        "agencyRole": "Checks claim, evidence, terminology, and message consistency.",
        "checkpoint": false,
        "expectedOutput": "Consistency findings"
      },
      {
        "order": 8,
        "id": "package-approval",
        "label": "Approve the package",
        "customerRole": "Makes the final delivery decision.",
        "agencyRole": "Presents the reviewed package and decision history.",
        "checkpoint": true,
        "expectedOutput": "Editorial Package"
      }
    ],
    "deliverables": [
      {
        "id": "editorial-core",
        "name": "Editorial Core",
        "description": "Approved message, claims, evidence, terminology, and constraints shared by all variants.",
        "format": [
          "structured view",
          "JSON export"
        ],
        "requiresApproval": true
      },
      {
        "id": "publication-strategy",
        "name": "Publication strategy",
        "description": "Channel roles, sequence, and adaptation guidance for the package.",
        "format": [
          "structured view"
        ],
        "requiresApproval": false
      },
      {
        "id": "channel-content",
        "name": "Channel content",
        "description": "Blog, LinkedIn, and Instagram variants derived from the approved editorial core.",
        "format": [
          "structured view"
        ],
        "requiresApproval": true
      },
      {
        "id": "traceability-record",
        "name": "Claim and evidence traceability",
        "description": "A view of important claims and the supplied evidence that supports them.",
        "format": [
          "structured view",
          "JSON export"
        ],
        "requiresApproval": false
      },
      {
        "id": "editorial-package",
        "name": "Editorial Package",
        "description": "The final structured collection of approved content, findings, versions, and human decisions.",
        "format": [
          "structured view",
          "JSON export"
        ],
        "requiresApproval": true
      }
    ],
    "routeSegment": "publisher",
    "sourcePath": "static/content/products/bba-publisher.md",
    "sections": {
      "overview": {
        "title": "Overview",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "BBA Publisher is BBA Agency's first functional product experience. It helps a team turn trusted context into a coordinated editorial package while keeping the customer responsible for important approvals. This informational page explains the product; it does not run a project. The separate prototype is at "
              },
              {
                "type": "code",
                "value": "dev.bba.country"
              },
              {
                "type": "text",
                "value": "."
              }
            ]
          }
        ]
      },
      "problem": {
        "title": "The problem it addresses",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "One message often has to travel through several channels, each with a distinct audience, format, and call to action. Independent drafting can make the work inconsistent or introduce claims that are not supported by the supplied materials."
              }
            ]
          }
        ]
      },
      "audience": {
        "title": "Who it is for",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "It is for communications, marketing, and research teams that need a coherent editorial response to a defined objective without treating channel adaptation as copy-and-paste work."
              }
            ]
          }
        ]
      },
      "customerInputs": {
        "title": "What the customer provides",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The customer provides the communication objective, intended audience, source materials, trusted facts, evidence or references, required terminology, prohibited claims, tone, language, call to action, and desired channels."
              }
            ]
          }
        ]
      },
      "agencyWork": {
        "title": "What the Agency does",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The Agency team interprets the context, proposes an Editorial Core, plans the role of each channel, creates channel variants, and highlights consistency or evidence findings for review. It does not replace the customer's authority."
              }
            ]
          }
        ]
      },
      "productWorkflow": {
        "title": "How the product works",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The journey is Editorial Context, Context Analysis, Editorial Core, Human Approval, Publication Strategy, Channel Adaptation, Consistency Review, Package Approval, and Editorial Package. It follows the common path: choose a service, provide context, confirm the outcome, follow coordinated execution, review decisions, and receive a structured package."
              }
            ]
          }
        ]
      },
      "agentTeam": {
        "title": "Agent team",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The prototype coordinates Context Analyst, Editorial Strategist, Platform Adapter, and Semantic Consistency Reviewer roles. Human Governance is the decision-making role; the team supports review rather than making final customer decisions."
              }
            ]
          }
        ]
      },
      "humanReview": {
        "title": "Human review and control",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The customer reviews the proposed Editorial Core before adaptation and reviews the final package after findings are visible. Approval of the core does not automatically approve every channel variant."
              }
            ]
          }
        ]
      },
      "customerReceives": {
        "title": "What the customer receives",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The delivery includes an approved Editorial Core, publication strategy, blog content, LinkedIn content, Instagram content, claim and evidence traceability, consistency findings, version history, human decisions, and an Editorial Package."
              }
            ]
          }
        ]
      },
      "exampleProject": {
        "title": "Example project",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "strong",
                "value": "Illustrative example."
              },
              {
                "type": "text",
                "value": " A research organization needs to explain a new public report to policy and professional audiences. It supplies the report, approved facts, terminology, and a request for blog, LinkedIn, and Instagram content. At the Editorial Core checkpoint, its communications steward corrects one interpretation. The resulting package contains the revised core, channel plan, three variants, findings, and recorded decisions."
              }
            ]
          }
        ]
      },
      "qualityTraceability": {
        "title": "Quality and traceability",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Important claims remain connected to supplied evidence where available. The package makes versions, findings, and human decisions visible so a team can review how the final material was assembled."
              }
            ]
          }
        ]
      },
      "limitations": {
        "title": "What the product does not do",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "BBA Publisher performs no external publication. Customer approval remains required, source quality affects output quality, and unsupported claims must not be introduced. The prototype demonstrates the current product experience; it is not a claim of a fully operational publishing platform."
              }
            ]
          }
        ]
      },
      "availability": {
        "title": "Availability",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Prototype available. The functional BBA Publisher prototype is separately hosted at "
              },
              {
                "type": "code",
                "value": "https://dev.bba.country"
              },
              {
                "type": "text",
                "value": "; this static website remains informational."
              }
            ]
          }
        ]
      },
      "platformRelationship": {
        "title": "Relationship to the BBA platform",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "BBA Publisher is a customer-facing product experience of BBA Agency. The underlying platform supports coordinated work and review behind the experience; customers engage with the service, project context, checkpoints, deliverables, and package rather than internal technical components."
              }
            ]
          }
        ]
      },
      "faq": [
        {
          "question": "What does the customer need to provide?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "An objective, audience, materials, facts, evidence, terminology, constraints, tone, language, call to action, and target channels provide a useful start."
                }
              ]
            }
          ]
        },
        {
          "question": "Where does human review occur?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "Human checkpoints occur at Editorial Core approval and final package approval, with review available when material findings need direction."
                }
              ]
            }
          ]
        },
        {
          "question": "What does the final package include?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "It includes the approved core, strategy, channel content, traceability, findings, version history, decisions, and Editorial Package."
                }
              ]
            }
          ]
        },
        {
          "question": "Which content channels are supported in the prototype?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "The current reference experience demonstrates Blog, LinkedIn, and Instagram content. Channel profiles are illustrative, not guaranteed third-party rules."
                }
              ]
            }
          ]
        },
        {
          "question": "Does BBA Publisher publish externally?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "No. It prepares a reviewed package; no external publishing call is performed."
                }
              ]
            }
          ]
        },
        {
          "question": "Can deliverable language differ from the interface language?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "Yes. The interface and canonical source are English, while the customer can provide a delivery-language requirement as part of the editorial context."
                }
              ]
            }
          ]
        },
        {
          "question": "Is the product currently available?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "The BBA Publisher prototype is available separately at "
                },
                {
                  "type": "code",
                  "value": "dev.bba.country"
                },
                {
                  "type": "text",
                  "value": "."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    "schemaVersion": "1.0",
    "id": "governance-proposal",
    "name": "Governance Proposal",
    "category": "Governance",
    "slug": "governance-proposal",
    "route": "/services/governance",
    "status": "PLANNED",
    "eyebrow": "Governance",
    "headline": "Turn institutional context into a clear, evidence-based proposal.",
    "summary": "Governance Proposal is a planned product for organizing an institutional problem, evidence, alternatives, constraints, and a defensible proposal.",
    "customerProblem": "Institutions need to make complex choices with clear framing, stakeholder context, alternatives, evidence, impacts, and risks.",
    "customerOutcome": "A reviewable Institutional Package that supports authorized human deliberation and decisions.",
    "primaryAudience": [
      "Institutional leaders",
      "Governance teams",
      "Policy stewards"
    ],
    "contentLanguage": "English",
    "applicationLanguage": "English",
    "availability": {
      "label": "Planned",
      "code": "PLANNED",
      "operationalOnStaticSite": false
    },
    "seo": {
      "title": "Governance Proposal | BBA Agency",
      "description": "Learn about BBA Agency's planned Governance Proposal product for evidence-based institutional proposals.",
      "canonicalPath": "/services/governance"
    },
    "navigation": {
      "previousProduct": "scientific-article",
      "nextProduct": "market-research"
    },
    "relatedProducts": [
      "market-research"
    ],
    "keywords": [
      "governance proposal",
      "stakeholder analysis",
      "institutional decision"
    ],
    "agentTeamStatus": "CONCEPTUAL",
    "agentTeam": [
      {
        "id": "institutional-context-analyst",
        "name": "Institutional Context Analyst",
        "responsibility": "Frames the problem, context, constraints, and desired outcome.",
        "stage": "Problem framing"
      },
      {
        "id": "stakeholder-analyst",
        "name": "Stakeholder Analyst",
        "responsibility": "Maps affected parties, interests, and decision considerations.",
        "stage": "Stakeholder analysis"
      },
      {
        "id": "policy-evidence-synthesizer",
        "name": "Policy and Evidence Synthesizer",
        "responsibility": "Organizes governing documents, policies, evidence, and alternatives.",
        "stage": "Evidence analysis"
      },
      {
        "id": "proposal-writer",
        "name": "Proposal Writer",
        "responsibility": "Composes a clear proposal and rationale.",
        "stage": "Proposal composition"
      },
      {
        "id": "risk-impact-reviewer",
        "name": "Risk and Impact Reviewer",
        "responsibility": "Identifies implementation considerations, impacts, and risks.",
        "stage": "Review"
      }
    ],
    "workflow": [
      {
        "order": 1,
        "id": "institutional-context",
        "label": "Provide institutional context",
        "customerRole": "Supplies problem, outcome, stakeholders, policies, evidence, constraints, alternatives, and deadline.",
        "agencyRole": "Organizes the decision context.",
        "checkpoint": false,
        "expectedOutput": "Context summary"
      },
      {
        "order": 2,
        "id": "problem-framing",
        "label": "Frame the problem",
        "customerRole": "Confirms the decision question.",
        "agencyRole": "Produces a clear problem framing.",
        "checkpoint": true,
        "expectedOutput": "Approved problem framing"
      },
      {
        "order": 3,
        "id": "stakeholder-evidence-analysis",
        "label": "Analyze stakeholders and evidence",
        "customerRole": "Clarifies relevant parties and sources.",
        "agencyRole": "Synthesizes stakeholder and evidence context.",
        "checkpoint": false,
        "expectedOutput": "Stakeholder map and evidence synthesis"
      },
      {
        "order": 4,
        "id": "alternative-assessment",
        "label": "Assess alternatives",
        "customerRole": "Reviews considered options.",
        "agencyRole": "Compares alternatives against constraints and outcomes.",
        "checkpoint": false,
        "expectedOutput": "Alternatives matrix"
      },
      {
        "order": 5,
        "id": "proposal-composition",
        "label": "Compose proposal",
        "customerRole": "Reviews the recommended direction.",
        "agencyRole": "Produces proposal, rationale, and implementation considerations.",
        "checkpoint": false,
        "expectedOutput": "Proposed recommendation"
      },
      {
        "order": 6,
        "id": "risk-impact-review",
        "label": "Review risks and impacts",
        "customerRole": "Reviews material tradeoffs.",
        "agencyRole": "Identifies risks, impacts, and verification needs.",
        "checkpoint": false,
        "expectedOutput": "Risk analysis"
      },
      {
        "order": 7,
        "id": "human-decision",
        "label": "Make human decision",
        "customerRole": "Authorized decision-makers approve, reject, or request changes.",
        "agencyRole": "Records the decision and review history.",
        "checkpoint": true,
        "expectedOutput": "Decision record"
      },
      {
        "order": 8,
        "id": "institutional-package",
        "label": "Assemble institutional package",
        "customerRole": "Confirms delivery.",
        "agencyRole": "Groups proposal materials and traceability.",
        "checkpoint": true,
        "expectedOutput": "Institutional Package"
      }
    ],
    "deliverables": [
      {
        "id": "problem-framing",
        "name": "Problem framing",
        "description": "Clear statement of the institutional problem, desired outcome, and constraints.",
        "format": [
          "structured view"
        ],
        "requiresApproval": true
      },
      {
        "id": "alternatives-matrix",
        "name": "Alternatives matrix",
        "description": "Comparison of considered alternatives, assumptions, tradeoffs, and evidence.",
        "format": [
          "structured view"
        ],
        "requiresApproval": false
      },
      {
        "id": "recommended-proposal",
        "name": "Recommended proposal",
        "description": "Proposed direction, rationale, implementation considerations, expected impacts, and risks.",
        "format": [
          "structured view"
        ],
        "requiresApproval": true
      },
      {
        "id": "institutional-package",
        "name": "Institutional Package",
        "description": "Framing, stakeholder map, evidence synthesis, alternatives, proposal, risk analysis, and review history.",
        "format": [
          "structured view",
          "JSON export"
        ],
        "requiresApproval": true
      }
    ],
    "routeSegment": "governance",
    "sourcePath": "static/content/products/governance-proposal.md",
    "sections": {
      "overview": {
        "title": "Overview",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Governance Proposal is a planned service for transforming institutional context into a clear, evidence-based proposal. This informational page does not make institutional decisions."
              }
            ]
          }
        ]
      },
      "problem": {
        "title": "The problem it addresses",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Institutional choices can be difficult to deliberate when the problem, stakeholders, policies, evidence, alternatives, and risks are not assembled in a common view."
              }
            ]
          }
        ]
      },
      "audience": {
        "title": "Who it is for",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "It is intended for institutional leaders, governance teams, and policy stewards preparing material for authorized decision-makers."
              }
            ]
          }
        ]
      },
      "customerInputs": {
        "title": "What the customer provides",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The customer provides the institutional problem, desired outcome, stakeholders, governing documents, policies, evidence, constraints, alternatives, legal or procedural context, and decision deadline."
              }
            ]
          }
        ]
      },
      "agencyWork": {
        "title": "What the Agency does",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The conceptual team would frame the problem, analyze stakeholders and evidence, compare alternatives, compose a proposal, and surface risks and impacts for review."
              }
            ]
          }
        ]
      },
      "productWorkflow": {
        "title": "How the product works",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Institutional Context moves through Problem Framing, Stakeholder and Evidence Analysis, Alternative Assessment, Proposal Composition, Risk and Impact Review, Human Decision, and Institutional Package. The customer provides context, reviews checkpoints, and receives a structured package."
              }
            ]
          }
        ]
      },
      "agentTeam": {
        "title": "Agent team",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The planned roles are Institutional Context Analyst, Stakeholder Analyst, Policy and Evidence Synthesizer, Proposal Writer, and Risk and Impact Reviewer. They are conceptual coordinated roles, not implemented agents."
              }
            ]
          }
        ]
      },
      "humanReview": {
        "title": "Human review and control",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Authorized people confirm problem framing and make the final decision. The service supports deliberation; it does not take institutional authority."
              }
            ]
          }
        ]
      },
      "customerReceives": {
        "title": "What the customer receives",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The Institutional Package would include problem framing, stakeholder map, evidence synthesis, alternatives matrix, recommended proposal, implementation considerations, risk analysis, expected impacts, decision rationale, and review history."
              }
            ]
          }
        ]
      },
      "exampleProject": {
        "title": "Example project",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "strong",
                "value": "Illustrative example."
              },
              {
                "type": "text",
                "value": " A member organization is considering a revised participation policy. It supplies current policy, member feedback, constraints, alternatives, and a decision date. Leaders correct stakeholder assumptions at the framing checkpoint; the conceptual package presents alternatives, impacts, rationale, and the recorded review history."
              }
            ]
          }
        ]
      },
      "qualityTraceability": {
        "title": "Quality and traceability",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The package would retain the connection between supplied documents, alternatives, rationale, risks, and human decisions for later deliberation."
              }
            ]
          }
        ]
      },
      "limitations": {
        "title": "What the product does not do",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "It does not make institutional decisions or provide authoritative legal advice. Final approval belongs to authorized human decision-makers, and applicable policies and laws require expert verification. The product is planned."
              }
            ]
          }
        ]
      },
      "availability": {
        "title": "Availability",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Planned. Governance Proposal is not available in the current prototype."
              }
            ]
          }
        ]
      },
      "platformRelationship": {
        "title": "Relationship to the BBA platform",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "This proposed service would present a governed customer project and Institutional Package while keeping technical coordination behind the product experience."
              }
            ]
          }
        ]
      },
      "faq": [
        {
          "question": "What does the customer need to provide?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "The problem, outcome, stakeholders, governing documents, evidence, constraints, alternatives, procedural context, and deadline."
                }
              ]
            }
          ]
        },
        {
          "question": "Where does human review occur?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "At problem framing, risk review, and the final authorized decision."
                }
              ]
            }
          ]
        },
        {
          "question": "What does the final package include?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "It includes framing, stakeholder and evidence analysis, alternatives, recommendation, impacts, risks, rationale, and review history."
                }
              ]
            }
          ]
        },
        {
          "question": "What does the product not do?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "It does not make decisions or provide authoritative legal advice."
                }
              ]
            }
          ]
        },
        {
          "question": "Is the product currently available?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "No. Governance Proposal is planned and not part of the current prototype."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    "schemaVersion": "1.0",
    "id": "market-research",
    "name": "Market Research",
    "category": "Research",
    "slug": "market-research",
    "route": "/services/research",
    "status": "PLANNED",
    "eyebrow": "Market Research",
    "headline": "Turn a strategic question into evidence, insights, and actionable recommendations.",
    "summary": "Market Research is a planned product for turning a strategic question into a structured body of evidence, analysis, insights, and recommendations.",
    "customerProblem": "Strategic decisions need a transparent connection between the question, available sources, analysis, assumptions, patterns, and recommendations.",
    "customerOutcome": "A Research Package that makes evidence, limitations, insights, and decision-relevant recommendations reviewable.",
    "primaryAudience": [
      "Strategy teams",
      "Product leaders",
      "Market development teams"
    ],
    "contentLanguage": "English",
    "applicationLanguage": "English",
    "availability": {
      "label": "Planned",
      "code": "PLANNED",
      "operationalOnStaticSite": false
    },
    "seo": {
      "title": "Market Research | BBA Agency",
      "description": "Learn about BBA Agency's planned Market Research product for evidence-based market analysis and recommendations.",
      "canonicalPath": "/services/research"
    },
    "navigation": {
      "previousProduct": "governance-proposal",
      "nextProduct": null
    },
    "relatedProducts": [
      "advertising-campaign",
      "governance-proposal"
    ],
    "keywords": [
      "market research",
      "evidence synthesis",
      "strategic insights"
    ],
    "agentTeamStatus": "CONCEPTUAL",
    "agentTeam": [
      {
        "id": "research-planner",
        "name": "Research Planner",
        "responsibility": "Defines scope, method, sources, and questions needed for the decision.",
        "stage": "Research planning"
      },
      {
        "id": "market-analyst",
        "name": "Market Analyst",
        "responsibility": "Interprets market structure, alternatives, segments, and patterns.",
        "stage": "Market analysis"
      },
      {
        "id": "evidence-collector",
        "name": "Evidence Collector",
        "responsibility": "Organizes available sources and their relevance to the research question.",
        "stage": "Evidence collection"
      },
      {
        "id": "insight-synthesizer",
        "name": "Insight Synthesizer",
        "responsibility": "Connects patterns to decision-relevant insights.",
        "stage": "Insight synthesis"
      },
      {
        "id": "recommendation-reviewer",
        "name": "Recommendation Reviewer",
        "responsibility": "Tests recommendations against evidence, assumptions, and limitations.",
        "stage": "Recommendation review"
      }
    ],
    "workflow": [
      {
        "order": 1,
        "id": "research-question",
        "label": "Provide research question",
        "customerRole": "Supplies decision context, market definition, segment, geography, competitors, data, constraints, depth, and intended decision.",
        "agencyRole": "Clarifies the question and decision use.",
        "checkpoint": false,
        "expectedOutput": "Research brief"
      },
      {
        "order": 2,
        "id": "scope-plan",
        "label": "Confirm scope and research plan",
        "customerRole": "Reviews scope, sources, assumptions, and required depth.",
        "agencyRole": "Proposes research plan and evidence approach.",
        "checkpoint": true,
        "expectedOutput": "Approved research plan"
      },
      {
        "order": 3,
        "id": "source-collection",
        "label": "Organize sources and evidence",
        "customerRole": "Provides available data and source context.",
        "agencyRole": "Builds a source inventory and identifies gaps.",
        "checkpoint": false,
        "expectedOutput": "Source inventory"
      },
      {
        "order": 4,
        "id": "market-analysis",
        "label": "Analyze market",
        "customerRole": "Clarifies relevant alternatives and segments.",
        "agencyRole": "Examines market, competitors, audience, and patterns.",
        "checkpoint": false,
        "expectedOutput": "Market analysis"
      },
      {
        "order": 5,
        "id": "insight-synthesis",
        "label": "Synthesize insights",
        "customerRole": "Reviews interpretation and decision relevance.",
        "agencyRole": "Connects evidence to patterns, insights, and uncertainty.",
        "checkpoint": false,
        "expectedOutput": "Insight synthesis"
      },
      {
        "order": 6,
        "id": "recommendation-review",
        "label": "Review recommendations",
        "customerRole": "Evaluates assumptions and practical tradeoffs.",
        "agencyRole": "Tests recommendations against available evidence and limitations.",
        "checkpoint": true,
        "expectedOutput": "Reviewed recommendations"
      },
      {
        "order": 7,
        "id": "human-approval",
        "label": "Confirm delivery",
        "customerRole": "Approves, rejects, or requests changes to the package.",
        "agencyRole": "Records the decision and delivery record.",
        "checkpoint": true,
        "expectedOutput": "Research Package"
      }
    ],
    "deliverables": [
      {
        "id": "research-brief",
        "name": "Research brief",
        "description": "Decision question, market definition, scope, constraints, and intended use of findings.",
        "format": [
          "structured view"
        ],
        "requiresApproval": true
      },
      {
        "id": "source-inventory",
        "name": "Source inventory",
        "description": "Available sources, their relevance, gaps, and limitation notes.",
        "format": [
          "structured view"
        ],
        "requiresApproval": false
      },
      {
        "id": "market-analysis",
        "name": "Market analysis",
        "description": "Market overview, competitor or alternative analysis, audience findings, and patterns.",
        "format": [
          "structured view"
        ],
        "requiresApproval": false
      },
      {
        "id": "research-package",
        "name": "Research Package",
        "description": "Brief, plan, sources, analysis, insights, recommendations, evidence notes, limitations, and review record.",
        "format": [
          "structured view",
          "JSON export"
        ],
        "requiresApproval": true
      }
    ],
    "routeSegment": "research",
    "sourcePath": "static/content/products/market-research.md",
    "sections": {
      "overview": {
        "title": "Overview",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Market Research is a planned product for turning a strategic question into structured evidence, analysis, insights, and recommendations. This static page is informational and does not conduct research."
              }
            ]
          }
        ]
      },
      "problem": {
        "title": "The problem it addresses",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Decision-makers can receive conclusions without a clear view of the question, sources, assumptions, market context, and limitations that produced them."
              }
            ]
          }
        ]
      },
      "audience": {
        "title": "Who it is for",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "It is intended for strategy teams, product leaders, and market development teams preparing evidence for a defined decision."
              }
            ]
          }
        ]
      },
      "customerInputs": {
        "title": "What the customer provides",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The customer provides the research question, business or decision context, market definition, audience or customer segment, geography, known competitors, existing data, constraints, required depth, and intended decision."
              }
            ]
          }
        ]
      },
      "agencyWork": {
        "title": "What the Agency does",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The conceptual team would plan research, organize sources, analyze the market and alternatives, synthesize patterns, and review recommendations against evidence and uncertainty."
              }
            ]
          }
        ]
      },
      "productWorkflow": {
        "title": "How the product works",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Research Question leads to Scope and Research Plan, Source and Evidence Collection, Market Analysis, Pattern and Insight Synthesis, Recommendation Review, Human Approval, and a Research Package. The customer supplies context, confirms the plan, reviews recommendations, and receives the delivery."
              }
            ]
          }
        ]
      },
      "agentTeam": {
        "title": "Agent team",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Planned conceptual roles include Research Planner, Market Analyst, Evidence Collector, Insight Synthesizer, and Recommendation Reviewer. They are coordinated roles, not currently available operational agents."
              }
            ]
          }
        ]
      },
      "humanReview": {
        "title": "Human review and control",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The customer confirms scope and research plan, evaluates recommendation assumptions, and decides whether the package is ready for delivery. Sensitive decisions require human and specialist review."
              }
            ]
          }
        ]
      },
      "customerReceives": {
        "title": "What the customer receives",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The Research Package would include a research brief, research plan, source inventory, market overview, competitor or alternative analysis, audience findings, trends and patterns, insights, recommendations, and evidence and limitation notes."
              }
            ]
          }
        ]
      },
      "exampleProject": {
        "title": "Example project",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "strong",
                "value": "Illustrative example."
              },
              {
                "type": "text",
                "value": " A product team is assessing entry into a new regional segment. It supplies its decision question, target geography, known alternatives, customer interviews, and constraints. At the plan checkpoint it narrows the segment definition. The conceptual package contains the source inventory, market analysis, findings, assumptions, recommendations, and review record."
              }
            ]
          }
        ]
      },
      "qualityTraceability": {
        "title": "Quality and traceability",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The proposed package would connect sources and assumptions to analysis, mark limitations, and make the basis of recommendations available for review."
              }
            ]
          }
        ]
      },
      "limitations": {
        "title": "What the product does not do",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Findings depend on source availability and quality. The product does not guarantee commercial outcomes; estimates must identify assumptions and uncertainty; sensitive decisions require human and specialist review. The product is planned."
              }
            ]
          }
        ]
      },
      "availability": {
        "title": "Availability",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Planned. Market Research is not currently available in the prototype."
              }
            ]
          }
        ]
      },
      "platformRelationship": {
        "title": "Relationship to the BBA platform",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "This proposed service would present a research project, human checkpoints, and Research Package while internal technical coordination stays behind the customer experience."
              }
            ]
          }
        ]
      },
      "faq": [
        {
          "question": "What does the customer need to provide?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "The question, decision context, market and segment definitions, geography, alternatives, existing data, constraints, depth, and intended decision."
                }
              ]
            }
          ]
        },
        {
          "question": "Where does human review occur?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "At research-plan confirmation, recommendation review, and delivery approval."
                }
              ]
            }
          ]
        },
        {
          "question": "What does the final package include?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "It includes the brief, plan, source inventory, market and alternative analysis, audience findings, insights, recommendations, and limitation notes."
                }
              ]
            }
          ]
        },
        {
          "question": "What does the product not do?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "It does not guarantee commercial outcomes or remove the need for human and specialist review of sensitive decisions."
                }
              ]
            }
          ]
        },
        {
          "question": "Is the product currently available?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "No. Market Research is planned and not part of the current prototype."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    "schemaVersion": "1.0",
    "id": "scientific-article",
    "name": "Scientific Article",
    "category": "Scientific Writing",
    "slug": "scientific-article",
    "route": "/services/scientific-writing",
    "status": "PLANNED",
    "eyebrow": "Scientific Writing",
    "headline": "Organize evidence into a structured and reviewable scientific manuscript.",
    "summary": "Scientific Article is a planned product for organizing supplied research context into a structured manuscript package for expert review.",
    "customerProblem": "Research teams need to align evidence, argument, structure, references, and limitations without overstating what sources support.",
    "customerOutcome": "A reviewable Scientific Package that makes the manuscript, evidence relationships, and uncertainty visible.",
    "primaryAudience": [
      "Research teams",
      "Scientific organizations",
      "Technical authors"
    ],
    "contentLanguage": "English",
    "applicationLanguage": "English",
    "availability": {
      "label": "Planned",
      "code": "PLANNED",
      "operationalOnStaticSite": false
    },
    "seo": {
      "title": "Scientific Article | BBA Agency",
      "description": "Learn about BBA Agency's planned Scientific Article product for structured, reviewable manuscript preparation.",
      "canonicalPath": "/services/scientific-writing"
    },
    "navigation": {
      "previousProduct": "advertising-campaign",
      "nextProduct": "governance-proposal"
    },
    "relatedProducts": [
      "market-research"
    ],
    "keywords": [
      "scientific writing",
      "evidence mapping",
      "manuscript review"
    ],
    "agentTeamStatus": "CONCEPTUAL",
    "agentTeam": [
      {
        "id": "research-context-analyst",
        "name": "Research Context Analyst",
        "responsibility": "Interprets the question, objectives, methods, and supplied evidence.",
        "stage": "Research context"
      },
      {
        "id": "evidence-mapper",
        "name": "Evidence Mapper",
        "responsibility": "Organizes evidence, references, support, and gaps.",
        "stage": "Evidence mapping"
      },
      {
        "id": "scientific-structure-editor",
        "name": "Scientific Structure Editor",
        "responsibility": "Develops the manuscript structure and argument path.",
        "stage": "Article structure"
      },
      {
        "id": "scientific-writer",
        "name": "Scientific Writer",
        "responsibility": "Drafts within agreed evidence and style boundaries.",
        "stage": "Drafting"
      },
      {
        "id": "citation-consistency-reviewer",
        "name": "Citation and Consistency Reviewer",
        "responsibility": "Identifies citation, consistency, uncertainty, and limitation questions.",
        "stage": "Review"
      }
    ],
    "workflow": [
      {
        "order": 1,
        "id": "research-context",
        "label": "Provide research context",
        "customerRole": "Supplies question, objectives, methodology, results, references, authorship, and limitations.",
        "agencyRole": "Organizes the research context.",
        "checkpoint": false,
        "expectedOutput": "Research context summary"
      },
      {
        "order": 2,
        "id": "evidence-mapping",
        "label": "Map evidence",
        "customerRole": "Clarifies source relevance and gaps.",
        "agencyRole": "Connects supplied evidence to claims and questions.",
        "checkpoint": false,
        "expectedOutput": "Evidence map"
      },
      {
        "order": 3,
        "id": "scope-argument",
        "label": "Confirm scope and argument",
        "customerRole": "Reviews the proposed scope and argument.",
        "agencyRole": "Frames a defensible argument path.",
        "checkpoint": true,
        "expectedOutput": "Approved scope and argument"
      },
      {
        "order": 4,
        "id": "article-structure",
        "label": "Develop article structure",
        "customerRole": "Confirms target audience and style needs.",
        "agencyRole": "Produces the manuscript outline.",
        "checkpoint": false,
        "expectedOutput": "Manuscript outline"
      },
      {
        "order": 5,
        "id": "drafting",
        "label": "Prepare draft",
        "customerRole": "Provides scientific corrections.",
        "agencyRole": "Produces a proposed draft and abstract.",
        "checkpoint": false,
        "expectedOutput": "Article draft"
      },
      {
        "order": 6,
        "id": "citation-review",
        "label": "Review citations and consistency",
        "customerRole": "Reviews evidence and limitation findings.",
        "agencyRole": "Identifies unsupported statements and citation questions.",
        "checkpoint": false,
        "expectedOutput": "Review findings"
      },
      {
        "order": 7,
        "id": "scientific-review",
        "label": "Conduct human scientific review",
        "customerRole": "Authorized authors and experts review the manuscript.",
        "agencyRole": "Records requested changes and decisions.",
        "checkpoint": true,
        "expectedOutput": "Reviewed manuscript"
      },
      {
        "order": 8,
        "id": "scientific-package",
        "label": "Assemble scientific package",
        "customerRole": "Confirms delivery.",
        "agencyRole": "Groups manuscript materials and the review record.",
        "checkpoint": true,
        "expectedOutput": "Scientific Package"
      }
    ],
    "deliverables": [
      {
        "id": "evidence-map",
        "name": "Evidence map",
        "description": "Structured connection between supplied sources, claims, gaps, and uncertainty.",
        "format": [
          "structured view"
        ],
        "requiresApproval": true
      },
      {
        "id": "manuscript-outline",
        "name": "Manuscript outline",
        "description": "Proposed article structure and argument sequence.",
        "format": [
          "structured view"
        ],
        "requiresApproval": true
      },
      {
        "id": "article-draft",
        "name": "Article draft",
        "description": "Proposed manuscript draft with abstract and keywords.",
        "format": [
          "structured view"
        ],
        "requiresApproval": true
      },
      {
        "id": "scientific-package",
        "name": "Scientific Package",
        "description": "Context, evidence map, outline, draft, citation map, limitations, and review findings.",
        "format": [
          "structured view",
          "JSON export"
        ],
        "requiresApproval": true
      }
    ],
    "routeSegment": "scientific-writing",
    "sourcePath": "static/content/products/scientific-article.md",
    "sections": {
      "overview": {
        "title": "Overview",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Scientific Article is a planned product for research teams preparing a structured and reviewable manuscript from supplied evidence. It is an informational concept, not a writing action on this website."
              }
            ]
          }
        ]
      },
      "problem": {
        "title": "The problem it addresses",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Scientific writing requires evidence, methodology, argument, references, and limitations to remain aligned. A draft that hides uncertainty or extends beyond its sources is not a reliable basis for expert review."
              }
            ]
          }
        ]
      },
      "audience": {
        "title": "Who it is for",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "It is intended for research teams, scientific organizations, and technical authors who need a disciplined manuscript preparation process."
              }
            ]
          }
        ]
      },
      "customerInputs": {
        "title": "What the customer provides",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The customer provides the research question, objectives, methodology, results or evidence, references, target publication or audience, authorship information, style and language requirements, and known limitations."
              }
            ]
          }
        ]
      },
      "agencyWork": {
        "title": "What the Agency does",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The conceptual team would map evidence, propose scope and argument, structure the article, prepare a draft, and highlight citation and consistency questions for scientific review."
              }
            ]
          }
        ]
      },
      "productWorkflow": {
        "title": "How the product works",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Research Context leads to Evidence Mapping, Scope and Argument, Article Structure, Drafting, Citation and Consistency Review, Human Scientific Review, and a Scientific Package. The customer supplies materials, confirms interpretation, reviews decisions, and receives structured delivery."
              }
            ]
          }
        ]
      },
      "agentTeam": {
        "title": "Agent team",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Planned conceptual roles include Research Context Analyst, Evidence Mapper, Scientific Structure Editor, Scientific Writer, and Citation and Consistency Reviewer. Scientific authors and experts retain authority."
              }
            ]
          }
        ]
      },
      "humanReview": {
        "title": "Human review and control",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Researchers review the scope and argument before drafting and conduct expert scientific review before delivery. Authorship, factual responsibility, and publication decisions remain human responsibilities."
              }
            ]
          }
        ]
      },
      "customerReceives": {
        "title": "What the customer receives",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The Scientific Package would include a research context summary, evidence map, proposed argument, manuscript outline, article draft, abstract, keywords, references or citation map, uncertainty and limitation notes, and review findings."
              }
            ]
          }
        ]
      },
      "exampleProject": {
        "title": "Example project",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "strong",
                "value": "Illustrative example."
              },
              {
                "type": "text",
                "value": " A university lab supplies a protocol, results table, references, target-journal guidance, and known limitations for an observational study. Its authors correct the proposed argument at a human checkpoint. The conceptual package groups the revised outline, draft, citation map, limitations, and review findings for author-led revision."
              }
            ]
          }
        ]
      },
      "qualityTraceability": {
        "title": "Quality and traceability",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "The proposed process keeps supplied sources connected to the evidence map and records uncertainty and review findings so experts can assess the draft."
              }
            ]
          }
        ]
      },
      "limitations": {
        "title": "What the product does not do",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "It does not fabricate evidence, replace scientific authorship or expert review, or guarantee journal acceptance. Citation validation depends on supplied or retrieved sources. Ethical, institutional, and publication requirements remain the customer's responsibility. The product is planned."
              }
            ]
          }
        ]
      },
      "availability": {
        "title": "Availability",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "Planned. Scientific Article is not currently available in the prototype."
              }
            ]
          }
        ]
      },
      "platformRelationship": {
        "title": "Relationship to the BBA platform",
        "blocks": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "value": "This proposed service would present research work as a customer project with expert checkpoints and a Scientific Package, while technical coordination stays behind the product experience."
              }
            ]
          }
        ]
      },
      "faq": [
        {
          "question": "What does the customer need to provide?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "The question, objectives, methodology, evidence, references, target, authorship information, style requirements, and known limitations."
                }
              ]
            }
          ]
        },
        {
          "question": "Where does human review occur?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "At scope and argument confirmation, scientific expert review, and delivery."
                }
              ]
            }
          ]
        },
        {
          "question": "What does the final package include?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "It includes the context summary, evidence map, outline, draft, abstract, keywords, citation map, limitations, and review findings."
                }
              ]
            }
          ]
        },
        {
          "question": "What does the product not do?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "It does not invent evidence, replace authorship or expert review, or guarantee journal acceptance."
                }
              ]
            }
          ]
        },
        {
          "question": "Is the product currently available?",
          "answer": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "value": "No. Scientific Article is planned and not part of the current prototype."
                }
              ]
            }
          ]
        }
      ]
    }
  }
] satisfies AgencyProductContent[];
