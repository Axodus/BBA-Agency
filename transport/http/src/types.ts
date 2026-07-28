import type {
  AIWorkforceCommandApiPort,
  AIWorkforceQueryApiPort,
  ConnectorCommandApiPort,
  ConnectorQueryApiPort,
  GovernanceCommandApiPort,
  GovernanceQueryApiPort,
  InstitutionalAssetsCommandApiPort,
  InstitutionalAssetsQueryApiPort,
  KnowledgePolicyCommandApiPort,
  KnowledgePolicyQueryApiPort,
  MissionCommandApiPort,
  MissionQueryApiPort,
  PublicationCommandApiPort,
  PublicationQueryApiPort,
  ReviewCommandApiPort,
  ReviewQueryApiPort,
  WorkflowCommandApiPort,
  WorkflowQueryApiPort
} from "@bba/platform-core/application";

export interface TransportPrincipal {
  readonly subject: string;
  readonly actorReference: string;
}

export interface TransportAuthenticationRequest {
  readonly bearerToken: string;
  readonly requestId: string;
}

export interface TransportAuthenticationPort {
  authenticate(request: TransportAuthenticationRequest): Promise<TransportPrincipal>;
}

export interface TransportAuthorizationRequest {
  readonly principal: TransportPrincipal;
  readonly tenantId: string;
  readonly operationId: string;
  readonly target?: { readonly resourceType: string; readonly resourceId?: string };
}

export interface TransportAuthorizationPort {
  authorize(request: TransportAuthorizationRequest): Promise<boolean>;
}

export interface TransportObservabilityHooks {
  requestStarted?(event: TransportObservation): void;
  requestCompleted?(event: TransportObservation & { readonly statusCode: number }): void;
  requestFailed?(event: TransportObservation & { readonly errorCode: string; readonly statusCode: number }): void;
}

export interface TransportObservation {
  readonly requestId: string;
  readonly correlationId: string;
  readonly traceId: string;
  readonly operationId?: string;
  readonly tenantId?: string;
}

export interface TransportApplicationPorts {
  readonly mission: MissionCommandApiPort & MissionQueryApiPort;
  readonly governance: GovernanceCommandApiPort & GovernanceQueryApiPort;
  readonly "ai-workforce": AIWorkforceCommandApiPort & AIWorkforceQueryApiPort;
  readonly "institutional-assets": InstitutionalAssetsCommandApiPort & InstitutionalAssetsQueryApiPort;
  readonly "knowledge-policy": KnowledgePolicyCommandApiPort & KnowledgePolicyQueryApiPort;
  readonly workflow: WorkflowCommandApiPort & WorkflowQueryApiPort;
  readonly review: ReviewCommandApiPort & ReviewQueryApiPort;
  readonly publication: PublicationCommandApiPort & PublicationQueryApiPort;
  readonly connector: ConnectorCommandApiPort & ConnectorQueryApiPort;
}

export interface HttpAdapterDependencies {
  readonly application: TransportApplicationPorts;
  readonly authentication: TransportAuthenticationPort;
  readonly authorization: TransportAuthorizationPort;
  readonly observability?: TransportObservabilityHooks;
}

export interface HttpAdapterOptions {
  readonly contractPath?: string;
  readonly exposeOpenApi?: boolean;
  readonly exposeDocs?: boolean;
  readonly exposeReadiness?: boolean;
}
