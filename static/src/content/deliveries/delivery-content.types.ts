export type DeliveryPackageStatus = "PROTOTYPE_BACKED" | "ILLUSTRATIVE_PLANNED";

export interface DeliveryArtifact { id: string; name: string; description: string; purpose: string; artifactType: string; requiresHumanApproval: boolean; includedInPackage: boolean; illustrativeFormats: string[]; }
export interface DeliveryReviewCheckpoint { order: number; id: string; label: string; purpose: string; reviewerRole: string; artifactIds: string[]; possibleOutcomes: string[]; humanCheckpoint: boolean; }
export interface DeliveryApprovalModel { required: boolean; responsibleRole: string; description: string; possibleResponses: string[]; operationalOnStaticSite: false; }
export interface DeliveryRevisionPolicy { description: string; preserves: string[]; mayInvalidate: string[]; }
export interface DeliveryVersionRecord { version: string; status: string; description: string; changedArtifactIds: string[]; decisionReference?: string; illustrative: true; }
export interface DeliveryTraceRecord { id: string; sourceType: string; sourceReference: string; artifactId: string; artifactVersion: string; reviewCheckpointId?: string; decisionReference?: string; rationale: string; }
export interface DeliveryQualityGate { id: string; name: string; description: string; severityWhenFailed: "WARNING" | "BLOCKING"; }
export interface DeliveryMarkdownSection { title: string; body: string; }
export interface DeliveryFaqItem { question: string; answer: string; }
export interface AgencyDeliveryPackageContent {
  schemaVersion: string; id: string; slug: string; route: string; name: string; category: string;
  status: DeliveryPackageStatus; operationalOnStaticSite: false;
  productId: string; productName: string; productRoute: string; projectId: string; projectName: string; projectRoute: string;
  eyebrow: string; headline: string; summary: string; purpose: string; customerOutcome: string;
  availability: { code: DeliveryPackageStatus; label: string; operationalOnStaticSite: false };
  prototype: { available: boolean; url?: string; disclosure: string }; seo: { title: string; description: string; canonicalPath: string };
  navigation: { previousDelivery: string | null; nextDelivery: string | null }; keywords: string[];
  artifacts: DeliveryArtifact[]; reviewProcess: DeliveryReviewCheckpoint[]; approval: DeliveryApprovalModel; revisionPolicy: DeliveryRevisionPolicy;
  versionHistory: DeliveryVersionRecord[]; traceability: DeliveryTraceRecord[]; qualityGates: DeliveryQualityGate[]; limitations: string[];
  sections: Record<string, DeliveryMarkdownSection>; faq: DeliveryFaqItem[]; sourcePath: string;
}
