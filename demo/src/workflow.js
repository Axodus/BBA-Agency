export const WorkflowState = Object.freeze({
  IDLE: 'idle',
  SOURCE_LOADED: 'source_loaded',
  POLICIES_RETRIEVED: 'policies_retrieved',
  MISSION_PLANNED: 'mission_planned',
  ASSET_GENERATED: 'asset_generated',
  REVIEW_COMPLETED: 'review_completed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CONFIGURING_DISTRIBUTION: 'configuring_distribution',
  GENERATING_VARIANTS: 'generating_variants',
  AWAITING_VARIANT_DECISIONS: 'awaiting_variant_decisions',
  DISTRIBUTION_READY: 'distribution_ready',
  VARIANT_PARTIALLY_APPROVED: 'variant_partially_approved',
  DISTRIBUTION_REJECTED: 'distribution_rejected',
  COMPLETED: 'completed'
});

const ALLOWED_TRANSITIONS = Object.freeze({
  [WorkflowState.IDLE]: [WorkflowState.SOURCE_LOADED],
  [WorkflowState.SOURCE_LOADED]: [WorkflowState.POLICIES_RETRIEVED],
  [WorkflowState.POLICIES_RETRIEVED]: [WorkflowState.MISSION_PLANNED],
  [WorkflowState.MISSION_PLANNED]: [WorkflowState.ASSET_GENERATED],
  [WorkflowState.ASSET_GENERATED]: [WorkflowState.REVIEW_COMPLETED],
  [WorkflowState.REVIEW_COMPLETED]: [WorkflowState.APPROVED, WorkflowState.REJECTED],
  [WorkflowState.APPROVED]: [WorkflowState.CONFIGURING_DISTRIBUTION],
  [WorkflowState.CONFIGURING_DISTRIBUTION]: [WorkflowState.GENERATING_VARIANTS],
  [WorkflowState.GENERATING_VARIANTS]: [WorkflowState.AWAITING_VARIANT_DECISIONS],
  [WorkflowState.AWAITING_VARIANT_DECISIONS]: [WorkflowState.DISTRIBUTION_READY, WorkflowState.VARIANT_PARTIALLY_APPROVED, WorkflowState.DISTRIBUTION_REJECTED],
  [WorkflowState.DISTRIBUTION_READY]: [WorkflowState.COMPLETED],
  [WorkflowState.VARIANT_PARTIALLY_APPROVED]: [WorkflowState.COMPLETED]
});

export function createMission(source) {
  const suffix = String(Date.now()).slice(-6);
  return {
    id: `MSN-${new Date().getUTCFullYear()}-${suffix}`,
    title: `Publish: ${source.title}`,
    objective: 'Produce a governed Institutional Asset from the supplied source.',
    sourceId: source.id,
    state: WorkflowState.SOURCE_LOADED,
    owner: 'Authorized Human Steward',
    createdAt: new Date().toISOString()
  };
}

export function transitionMission(mission, nextState) {
  if (!mission || !Object.values(WorkflowState).includes(mission.state)) {
    throw new Error('Cannot transition an incomplete Mission.');
  }
  if (!Object.values(WorkflowState).includes(nextState)) {
    throw new Error(`Unknown Mission state: ${nextState}`);
  }
  if (!ALLOWED_TRANSITIONS[mission.state]?.includes(nextState)) {
    throw new Error(`Invalid Mission transition: ${mission.state} → ${nextState}`);
  }
  return { ...mission, state: nextState, updatedAt: new Date().toISOString() };
}

export function stateLabel(state) {
  return ({
    idle: 'Idle',
    source_loaded: 'Source loaded',
    policies_retrieved: 'Policies retrieved',
    mission_planned: 'Mission planned',
    asset_generated: 'Asset generated',
    review_completed: 'Awaiting human decision',
    approved: 'Asset approved · distribution setup',
    rejected: 'Rejected for revision',
    configuring_distribution: 'Configuring distribution',
    generating_variants: 'Generating channel variants',
    awaiting_variant_decisions: 'Awaiting variant decisions',
    distribution_ready: 'Distribution package ready',
    variant_partially_approved: 'Partially approved for distribution',
    distribution_rejected: 'Distribution rejected · revision required',
    completed: 'Completed'
  })[state] ?? state;
}
