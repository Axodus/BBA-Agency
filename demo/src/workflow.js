export const WorkflowState = Object.freeze({
  IDLE: 'idle',
  SOURCE_LOADED: 'source_loaded',
  POLICIES_RETRIEVED: 'policies_retrieved',
  MISSION_PLANNED: 'mission_planned',
  ASSET_GENERATED: 'asset_generated',
  REVIEW_COMPLETED: 'review_completed',
  APPROVED: 'approved',
  REJECTED: 'rejected'
});

const ALLOWED_TRANSITIONS = Object.freeze({
  [WorkflowState.IDLE]: [WorkflowState.SOURCE_LOADED],
  [WorkflowState.SOURCE_LOADED]: [WorkflowState.POLICIES_RETRIEVED],
  [WorkflowState.POLICIES_RETRIEVED]: [WorkflowState.MISSION_PLANNED],
  [WorkflowState.MISSION_PLANNED]: [WorkflowState.ASSET_GENERATED],
  [WorkflowState.ASSET_GENERATED]: [WorkflowState.REVIEW_COMPLETED],
  [WorkflowState.REVIEW_COMPLETED]: [WorkflowState.APPROVED, WorkflowState.REJECTED]
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
    approved: 'Approved for release',
    rejected: 'Rejected for revision'
  })[state] ?? state;
}
