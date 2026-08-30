export type ServiceAvailability =
  | "PROTOTYPE_AVAILABLE"
  | "PLANNED"
  | "CONCEPT_PREVIEW";

export interface InformationalAgencyService {
  id: string;
  category: string;
  name: string;
  headline: string;
  customerProblem: string;
  customerOutcome: string;
  customerProvides: string[];
  agencyPerforms: string[];
  humanCheckpoints: string[];
  deliverables: string[];
  availability: ServiceAvailability;
  detailHref?: string;
  prototypeHref?: string;
}

export const services: InformationalAgencyService[] = [
  {
    id: "publisher",
    category: "Publication Strategy",
    name: "BBA Publisher",
    headline: "Turn trusted context into a coordinated editorial package.",
    customerProblem:
      "Publishing the same message across several channels is not a copy-and-paste task. Each channel has a different format, rhythm, audience expectation, and call to action, and independent generation often introduces unsupported claims, contradictions, or drift in positioning.",
    customerOutcome:
      "Turn one editorial context into a coherent multichannel publication package.",
    customerProvides: [
      "Communication objective",
      "Audience",
      "Central message",
      "Tone",
      "Language",
      "References",
      "Required facts",
      "Prohibited claims",
      "Target channels",
    ],
    agencyPerforms: [
      "Context interpretation",
      "Semantic structuring",
      "Editorial planning",
      "Channel adaptation",
      "Factual and semantic consistency review",
    ],
    humanCheckpoints: [
      "Approve the Editorial Core",
      "Approve the final package",
      "Request changes when necessary",
    ],
    deliverables: [
      "Editorial Core",
      "Publication plan",
      "Blog content",
      "LinkedIn content",
      "Instagram caption and carousel script",
      "Consistency report",
      "Final Editorial Package",
    ],
    availability: "PROTOTYPE_AVAILABLE",
    detailHref: "/services/publisher",
    prototypeHref: "https://dev.bba.country",
  },
  {
    id: "advertising",
    category: "Advertising",
    name: "Advertising Campaign",
    headline:
      "Transform a campaign objective into a coordinated creative and channel strategy.",
    customerProblem:
      "Converting a business or communication objective into a coherent campaign strategy with clear messages, concepts, channel selection, and creative directions is complex and easy to fragment across disconnected outputs.",
    customerOutcome:
      "Turn a market brief into a structured campaign strategy with positioning, creative concepts, messaging, and a channel plan.",
    customerProvides: [
      "Objective",
      "Target audience",
      "Offer or product",
      "Market context",
      "Constraints",
      "Brand references",
      "Desired channels",
      "Success criteria",
    ],
    agencyPerforms: [
      "Briefing analysis",
      "Audience interpretation",
      "Positioning",
      "Concept generation",
      "Messaging",
      "Copy development",
      "Channel planning",
      "Campaign consistency review",
    ],
    humanCheckpoints: [
      "Approve strategy",
      "Select or reject creative concepts",
      "Approve the final campaign package",
    ],
    deliverables: [
      "Campaign strategy",
      "Audience definition",
      "Positioning",
      "Creative concepts",
      "Copy variations",
      "Channel plan",
      "Campaign Package",
    ],
    availability: "PLANNED",
    detailHref: "/services/advertising",
  },
  {
    id: "scientific-writing",
    category: "Scientific Writing",
    name: "Scientific Article",
    headline:
      "Organize evidence into a structured and reviewable scientific manuscript.",
    customerProblem:
      "Transforming a research question, evidence, or technical context into a structured, credible, and reviewable publication requires careful organization of evidence, argument, and references without overstating claims.",
    customerOutcome:
      "Turn a question, references, and evidence into a structured, reviewable scientific article.",
    customerProvides: [
      "Research question",
      "Objectives",
      "References",
      "Evidence",
      "Methodology context",
      "Target audience",
      "Publication constraints",
      "Language and style",
    ],
    agencyPerforms: [
      "Evidence organization",
      "Literature synthesis",
      "Argument structuring",
      "Article drafting",
      "Reference checking",
      "Editorial review",
      "Consistency validation",
    ],
    humanCheckpoints: [
      "Approve scope and structure",
      "Review claims and references",
      "Approve final article",
    ],
    deliverables: [
      "Evidence map",
      "Article outline",
      "Article draft",
      "References",
      "Editorial findings",
      "Scientific Package",
    ],
    availability: "PLANNED",
    detailHref: "/services/scientific-writing",
  },
  {
    id: "governance",
    category: "Governance",
    name: "Governance Proposal",
    headline:
      "Turn institutional context into a clear, evidence-based proposal.",
    customerProblem:
      "Transforming institutional context, evidence, alternatives, and constraints into a clear and defensible proposal that stakeholders can deliberate and decide on requires explicit framing, analysis, and risk articulation.",
    customerOutcome:
      "Turn an institutional problem and its evidence into a proposal ready for deliberation.",
    customerProvides: [
      "Institutional problem",
      "Desired outcome",
      "Stakeholders",
      "Policies or references",
      "Constraints",
      "Evidence",
      "Alternatives",
      "Legal or procedural considerations",
    ],
    agencyPerforms: [
      "Context interpretation",
      "Evidence organization",
      "Alternative analysis",
      "Proposal drafting",
      "Semantic and institutional review",
      "Risk and impact synthesis",
    ],
    humanCheckpoints: [
      "Approve the problem framing",
      "Review alternatives",
      "Approve or reject the final proposal",
    ],
    deliverables: [
      "Problem statement",
      "Evidence synthesis",
      "Alternatives",
      "Recommended proposal",
      "Impacts",
      "Risks",
      "Rationale",
      "Institutional Package",
    ],
    availability: "PLANNED",
    detailHref: "/services/governance",
  },
  {
    id: "research",
    category: "Research",
    name: "Market Research",
    headline:
      "Turn a strategic question into evidence, insights, and actionable recommendations.",
    customerProblem:
      "Transforming a strategic question into structured evidence, patterns, insights, and recommendations requires disciplined question decomposition, source handling, and interpretation that remains connected to the original decision context.",
    customerOutcome:
      "Turn a business question into structured evidence, patterns, insights, and recommendations.",
    customerProvides: [
      "Research question",
      "Decision context",
      "Audience or market",
      "Known sources",
      "Constraints",
      "Expected depth",
      "Desired format",
    ],
    agencyPerforms: [
      "Question decomposition",
      "Source planning",
      "Quantitative and qualitative analysis",
      "Pattern identification",
      "Insight generation",
      "Recommendation synthesis",
      "Evidence review",
    ],
    humanCheckpoints: [
      "Approve research scope",
      "Validate interpretation",
      "Approve conclusions and recommendations",
    ],
    deliverables: [
      "Research plan",
      "Evidence set",
      "Analysis",
      "Insights",
      "Recommendations",
      "Research Package",
    ],
    availability: "PLANNED",
    detailHref: "/services/research",
  },
];

export const availabilityLabels: Record<ServiceAvailability, string> = {
  PROTOTYPE_AVAILABLE: "Prototype available",
  PLANNED: "Planned",
  CONCEPT_PREVIEW: "Concept preview",
};
