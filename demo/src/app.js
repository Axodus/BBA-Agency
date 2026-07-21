import { retrievePolicies } from './retrieval.js';
import { WorkflowState, createMission, transitionMission, stateLabel } from './workflow.js';
import { createAuditEvent, exportJson } from './audit.js';

const $ = selector => document.querySelector(selector);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const AppState = Object.freeze({
  LOADING: 'loading',
  READY: 'ready',
  RUNNING: 'running',
  AWAITING_DECISION: 'awaiting_decision',
  COMPLETED: 'completed',
  FAILED: 'failed'
});

const AGENTS = [
  ['Mission Orchestrator', 'Plans the governed workflow'],
  ['Policy Retrieval Agent', 'Selects applicable policies'],
  ['Editorial Agent', 'Produces the reference draft'],
  ['Claims Review Agent', 'Checks claims and disclosures'],
  ['Asset Registry Agent', 'Prepares the institutional record'],
  ['Audit Agent', 'Preserves execution evidence']
];

const state = {
  status: AppState.LOADING,
  source: null,
  policies: [],
  selectedPolicies: [],
  reference: null,
  mission: null,
  audit: [],
  running: false,
  decision: null,
  dataReady: false
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function setProgress(value) {
  $('#progressBar').style.width = `${Math.max(0, Math.min(100, value))}%`;
}

function setChip(element, label, kind = 'neutral') {
  element.textContent = label;
  element.className = `chip ${kind}`;
}

function setFeedback(message, kind = '') {
  const feedback = $('#feedback');
  feedback.textContent = message;
  feedback.className = `feedback${kind ? ` ${kind}` : ''}`;
}

function setAppState(nextState) {
  state.status = nextState;
  const labels = {
    [AppState.LOADING]: 'Loading demo data…',
    [AppState.READY]: 'Ready',
    [AppState.RUNNING]: 'Workflow running…',
    [AppState.AWAITING_DECISION]: 'Awaiting human decision',
    [AppState.COMPLETED]: 'Completed',
    [AppState.FAILED]: 'Failed'
  };
  if (!state.mission && nextState !== AppState.FAILED) {
    $('#missionStatus').textContent = labels[nextState] ?? nextState;
  }
}

function addAudit(action, actor, detail) {
  const event = createAuditEvent({
    missionId: state.mission?.id ?? 'not-created',
    action,
    actor,
    detail,
    state: state.mission?.state ?? WorkflowState.IDLE
  });
  state.audit.push(event);
  renderAudit();
}

function updateMission() {
  $('#missionId').textContent = state.mission?.id ?? 'Not started';
  $('#missionStatus').textContent = state.mission
    ? stateLabel(state.mission.state)
    : state.status === AppState.READY
      ? 'Ready'
      : state.status === AppState.LOADING
        ? 'Loading demo data…'
        : state.status === AppState.FAILED
          ? 'Demo error'
          : 'Idle';
}

function renderAgents(activeIndex = -1, completedThrough = -1) {
  $('#agentList').innerHTML = AGENTS.map(([name, description], index) => {
    const className = index <= completedThrough ? 'agent done' : index === activeIndex ? 'agent active' : 'agent';
    return `<div class="${className}"><span class="agent-dot"></span><div><strong>${escapeHtml(name)}</strong><small>${escapeHtml(description)}</small></div></div>`;
  }).join('');
}

function renderSource() {
  const source = state.source;
  $('#sourceContent').className = '';
  $('#sourceContent').innerHTML = `
    <div class="source-card">
      <h4>${escapeHtml(source.title)}</h4>
      <div class="source-meta"><span>${escapeHtml(source.id)}</span><span>${escapeHtml(source.author)}</span></div>
      <p class="source-body">${escapeHtml(source.content)}</p>
    </div>`;
  setChip($('#sourceType'), source.type.replaceAll('_', ' '), 'accent');
}

function renderPolicies() {
  $('#policyList').className = 'stack';
  $('#policyList').innerHTML = state.selectedPolicies.map(policy => `
    <div class="policy-card">
      <span class="policy-id">${escapeHtml(policy.id)}</span>
      <h4>${escapeHtml(policy.title)}</h4>
      <p>${escapeHtml(policy.summary)}</p>
    </div>`).join('');
  setChip($('#policyCount'), `${state.selectedPolicies.length} selected`, 'accent');
}

function renderBrief() {
  const { classification, brief } = state.reference;
  $('#briefContent').className = '';
  $('#briefContent').innerHTML = `
    <div class="stack">
      <div class="brief-block"><span class="label">Objective</span><p>${escapeHtml(brief.objective)}</p></div>
      <div class="brief-block"><span class="label">Audience</span><p>${escapeHtml(classification.audience)}</p></div>
      <div class="brief-block"><span class="label">Tone</span><p>${escapeHtml(brief.tone)}</p></div>
      <div class="brief-block"><span class="label">Required disclosures</span><p>${brief.requiredDisclosures.map(escapeHtml).join(' · ')}</p></div>
    </div>`;
  setChip($('#riskChip'), `${escapeHtml(classification.risk)} risk`, classification.risk === 'medium' ? 'warning' : 'neutral');
}

function renderAsset() {
  const asset = state.reference.asset;
  $('#assetContent').className = 'asset-content';
  $('#assetContent').innerHTML = `
    <h2>${escapeHtml(asset.title)}</h2>
    <p class="asset-dek">${escapeHtml(asset.dek)}</p>
    <div class="asset-body">${asset.body.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>
    <div class="asset-disclosure">Reference implementation only. Synthetic data, deterministic editorial output, and no external publishing.</div>`;
  setChip($('#assetState'), 'Draft · v0.1', 'accent');
}

function renderReview() {
  const review = state.reference.review;
  $('#reviewFindings').className = '';
  $('#reviewFindings').innerHTML = review.findings.map(finding => `
    <div class="finding ${escapeHtml(finding.severity)}">
      <div class="finding-icon">${finding.severity === 'warning' ? '!' : 'i'}</div>
      <div><strong>${escapeHtml(finding.code.replaceAll('_', ' '))}</strong><p>${escapeHtml(finding.message)}</p></div>
    </div>`).join('');
  setChip($('#reviewState'), 'Review complete', 'warning');
}

function renderAudit() {
  const timeline = $('#auditTimeline');
  if (!state.audit.length) {
    timeline.className = 'timeline empty-state';
    timeline.textContent = 'No audit events recorded.';
    return;
  }
  timeline.className = 'timeline';
  timeline.innerHTML = state.audit.map(event => `
    <div class="timeline-item">
      <span class="timeline-time">${new Date(event.timestamp).toLocaleTimeString()}</span>
      <strong>${escapeHtml(event.action)}</strong>
      <p>${escapeHtml(event.actor)} · ${escapeHtml(event.detail)}</p>
    </div>`).join('');
}

function assertString(value, field, resource) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${resource} is missing required field ${field}.`);
}

function assertStringArray(value, field, resource) {
  if (!Array.isArray(value) || value.length === 0 || value.some(item => typeof item !== 'string' || !item.trim())) {
    throw new Error(`${resource}.${field} must be a non-empty list of strings.`);
  }
}

function validateSource(source) {
  if (!source || typeof source !== 'object') throw new Error('Source data must be an object.');
  ['id', 'title', 'content', 'type', 'author'].forEach(field => assertString(source[field], field, 'Source'));
  assertStringArray(source.keywords, 'keywords', 'Source');
}

function validatePolicies(policies) {
  if (!Array.isArray(policies) || policies.length === 0) throw new Error('Policies data must be a non-empty list.');
  policies.forEach((policy, index) => {
    const resource = `Policy ${index + 1}`;
    ['id', 'title', 'summary'].forEach(field => assertString(policy?.[field], field, resource));
    assertStringArray(policy.tags, 'tags', resource);
    assertStringArray(policy.rules, 'rules', resource);
  });
}

function validateReference(reference) {
  if (!reference || typeof reference !== 'object') throw new Error('Reference output data must be an object.');
  if (!reference.classification || !reference.brief || !reference.asset || !reference.review) {
    throw new Error('Reference output must contain classification, brief, asset, and review.');
  }
  ['assetType', 'audience', 'risk'].forEach(field => assertString(reference.classification[field], field, 'Reference classification'));
  assertStringArray(reference.classification.topics, 'topics', 'Reference classification');
  ['objective', 'tone'].forEach(field => assertString(reference.brief[field], field, 'Reference brief'));
  assertStringArray(reference.brief.requiredDisclosures, 'requiredDisclosures', 'Reference brief');
  ['title', 'dek'].forEach(field => assertString(reference.asset[field], field, 'Reference asset'));
  assertStringArray(reference.asset.body, 'body', 'Reference asset');
  assertString(reference.review.status, 'status', 'Reference review');
  if (!Array.isArray(reference.review.findings) || reference.review.findings.length === 0) {
    throw new Error('Reference review.findings must be a non-empty list.');
  }
  reference.review.findings.forEach((finding, index) => {
    ['severity', 'code', 'message'].forEach(field => assertString(finding?.[field], field, `Review finding ${index + 1}`));
  });
}

async function loadJson(path, resource) {
  let response;
  try {
    response = await fetch(path);
  } catch (error) {
    throw new Error(`Failed to fetch ${resource} (${path}): ${error.message}`);
  }
  if (!response.ok) throw new Error(`Failed to fetch ${resource} (${path}): HTTP ${response.status}.`);
  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to parse ${resource} (${path}) as JSON: ${error.message}`);
  }
}

async function loadData() {
  console.info('[BBA Demo] initialization');
  const [source, policies, reference] = await Promise.all([
    loadJson('./data/sample-source.json', 'source document'),
    loadJson('./data/policies.json', 'policies'),
    loadJson('./data/reference-output.json', 'reference output')
  ]);
  validateSource(source);
  validatePolicies(policies);
  validateReference(reference);
  state.source = source;
  state.policies = policies;
  state.reference = reference;
  state.dataReady = true;
}

async function runWorkflow() {
  if (state.status !== AppState.READY || state.running) {
    setFeedback(state.running ? 'A workflow is already running.' : 'Demo data is not ready yet.', 'warning');
    return;
  }
  state.running = true;
  setAppState(AppState.RUNNING);
  $('#runButton').disabled = true;
  $('#resetButton').disabled = true;
  $('#approveButton').disabled = true;
  $('#rejectButton').disabled = true;
  $('#exportButton').disabled = true;
  state.audit = [];
  state.decision = null;
  state.mission = null;
  state.selectedPolicies = [];
  renderAudit();

  try {
    console.info('[BBA Demo] workflow started');
    renderAgents(0, -1);
    setProgress(8);
    setFeedback('Workflow started: loading governed source…');
    await wait(350);

    state.mission = createMission(state.source);
    renderSource();
    updateMission();
    addAudit('MISSION_CREATED', 'Mission Orchestrator', `Mission created from source ${state.source.id}.`);
    addAudit('SOURCE_LOADED', 'Mission Orchestrator', `Source ${state.source.id} loaded and validated.`);
    renderAgents(1, 0);
    setProgress(22);
    setFeedback('Source loaded. Retrieving relevant policies…');
    await wait(550);

    state.selectedPolicies = retrievePolicies(state.source, state.policies);
    if (!state.selectedPolicies.length) throw new Error('Policy retrieval returned no relevant policies.');
    state.mission = transitionMission(state.mission, WorkflowState.POLICIES_RETRIEVED);
    renderPolicies();
    updateMission();
    addAudit('POLICIES_RETRIEVED', 'Policy Retrieval Agent', `${state.selectedPolicies.length} relevant policies selected locally.`);
    console.info('[BBA Demo] policies retrieved');
    renderAgents(2, 1);
    setProgress(40);
    setFeedback('Policies retrieved. Structuring the editorial brief…');
    await wait(600);

    state.mission = transitionMission(state.mission, WorkflowState.MISSION_PLANNED);
    renderBrief();
    updateMission();
    addAudit('EDITORIAL_BRIEF_CREATED', 'Mission Orchestrator', 'Audience, objective, tone, risk, and disclosures were structured.');
    renderAgents(2, 2);
    setProgress(55);
    setFeedback('Mission planned. Producing the governed Institutional Asset…');
    await wait(550);

    state.mission = transitionMission(state.mission, WorkflowState.ASSET_GENERATED);
    renderAsset();
    updateMission();
    addAudit('INSTITUTIONAL_ASSET_GENERATED', 'Editorial Agent', 'Deterministic reference asset generated as version 0.1.');
    console.info('[BBA Demo] asset rendered');
    renderAgents(3, 2);
    setProgress(72);
    setFeedback('Institutional Asset generated. Running claims review…');
    await wait(550);

    state.mission = transitionMission(state.mission, WorkflowState.REVIEW_COMPLETED);
    renderReview();
    updateMission();
    addAudit('CLAIMS_REVIEW_COMPLETED', 'Claims Review Agent', 'Structured findings recorded; one warning requires human acknowledgement.');
    console.info('[BBA Demo] review completed');
    renderAgents(-1, 5);
    setProgress(88);
    setAppState(AppState.AWAITING_DECISION);
    setFeedback('Review complete. Approve or reject the Institutional Asset.', 'warning');
    $('#approveButton').disabled = false;
    $('#rejectButton').disabled = false;
  } catch (error) {
    console.error('[BBA Demo] workflow failed', error);
    setAppState(AppState.FAILED);
    $('#missionStatus').textContent = 'Demo error';
    setFeedback(`Workflow failed: ${error.message}`, 'error');
    $('#approveButton').disabled = true;
    $('#rejectButton').disabled = true;
    $('#exportButton').disabled = true;
  } finally {
    state.running = false;
    $('#resetButton').disabled = false;
  }
}

function decide(decision) {
  if (state.status !== AppState.AWAITING_DECISION || !state.mission || state.mission.state !== WorkflowState.REVIEW_COMPLETED) {
    setFeedback('A completed claims review is required before recording a decision.', 'warning');
    return;
  }
  const note = $('#decisionNote').value.trim();
  state.decision = { decision, note, decidedAt: new Date().toISOString(), actor: 'Authorized Human Steward' };
  state.mission = transitionMission(state.mission, decision === 'approved' ? WorkflowState.APPROVED : WorkflowState.REJECTED);
  setAppState(AppState.COMPLETED);
  updateMission();
  setProgress(100);
  setChip($('#decisionState'), decision === 'approved' ? 'Approved' : 'Rejected', decision === 'approved' ? 'success' : 'danger');
  setChip($('#assetState'), decision === 'approved' ? 'Authorized · v0.1' : 'Revision required · v0.1', decision === 'approved' ? 'success' : 'danger');
  addAudit(decision === 'approved' ? 'HUMAN_APPROVAL_RECORDED' : 'HUMAN_REJECTION_RECORDED', 'Authorized Human Steward', note || (decision === 'approved' ? 'Approved with recorded review warning.' : 'Rejected and returned for revision.'));
  console.info('[BBA Demo] human decision recorded');
  setFeedback(decision === 'approved' ? 'Mission approved. Audit record is ready to export.' : 'Mission rejected for revision. Audit record is ready to export.', decision === 'approved' ? 'success' : 'error');
  $('#approveButton').disabled = true;
  $('#rejectButton').disabled = true;
  $('#exportButton').disabled = false;
}

function reset() {
  state.mission = null;
  state.selectedPolicies = [];
  state.audit = [];
  state.decision = null;
  state.running = false;
  setAppState(state.dataReady ? AppState.READY : AppState.LOADING);
  updateMission();
  $('#sourceContent').className = 'empty-state';
  $('#sourceContent').textContent = 'Run the workflow to load the source document.';
  $('#policyList').className = 'stack empty-state';
  $('#policyList').textContent = 'Relevant policies will appear here.';
  $('#briefContent').className = 'empty-state';
  $('#briefContent').textContent = 'Mission planning has not started.';
  $('#assetContent').className = 'empty-state large';
  $('#assetContent').textContent = 'The governed draft will appear after policy retrieval and mission planning.';
  $('#reviewFindings').className = 'empty-state';
  $('#reviewFindings').textContent = 'No findings yet.';
  $('#decisionNote').value = '';
  const labels = { sourceType: 'Awaiting source', policyCount: '0 selected', riskChip: 'Risk pending', assetState: 'Not generated', reviewState: 'Pending', decisionState: 'Required' };
  Object.entries(labels).forEach(([id, label]) => setChip($(`#${id}`), label, 'neutral'));
  $('#approveButton').disabled = true;
  $('#rejectButton').disabled = true;
  $('#exportButton').disabled = true;
  $('#runButton').disabled = !state.dataReady;
  $('#resetButton').disabled = false;
  setProgress(0);
  setFeedback(state.dataReady ? 'Ready' : 'Loading demo data…', state.dataReady ? 'success' : '');
  renderAgents();
  renderAudit();
}

function exportAudit() {
  if (state.status !== AppState.COMPLETED || !state.mission || !state.decision) {
    setFeedback('Complete an approval or rejection before exporting the audit record.', 'warning');
    return;
  }
  try {
    exportJson(`${state.mission.id.toLowerCase()}-audit-record.json`, {
      metadata: {
        demo: 'BBA Publisher Reference Demo',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        disclaimer: 'Reference implementation. Deterministic editorial output. No external publishing.'
      },
      mission: state.mission,
      source: state.source,
      retrievedPolicies: state.selectedPolicies,
      classification: state.reference.classification,
      brief: state.reference.brief,
      asset: state.reference.asset,
      review: state.reference.review,
      humanDecision: state.decision,
      auditEvents: state.audit
    });
    setFeedback('Audit record exported as valid JSON.', 'success');
  } catch (error) {
    console.error('[BBA Demo] audit export failed', error);
    setFeedback(`Audit export failed: ${error.message}`, 'error');
  }
}

$('#runButton').addEventListener('click', runWorkflow);
$('#resetButton').addEventListener('click', reset);
$('#approveButton').addEventListener('click', () => decide('approved'));
$('#rejectButton').addEventListener('click', () => decide('rejected'));
$('#exportButton').addEventListener('click', exportAudit);

renderAgents();
setAppState(AppState.LOADING);
loadData()
  .then(() => {
    setAppState(AppState.READY);
    $('#runButton').disabled = false;
    setFeedback('Ready', 'success');
  })
  .catch(error => {
    console.error('[BBA Demo] initialization failed', error);
    setAppState(AppState.FAILED);
    $('#missionStatus').textContent = 'Demo error';
    $('#runButton').disabled = true;
    setFeedback(`Demo initialization failed: ${error.message}`, 'error');
  });
