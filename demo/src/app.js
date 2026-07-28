import { retrievePolicies } from './retrieval.js';
import { validateChannelCatalog, getDefaultChannelIds, validateChannelSelection, getChannelProfiles } from './channels.js';
import { generateChannelVariants } from './adaptation.js';
import { reviewVariant } from './review.js';
import { createDistributionPackage, updateDistributionPackage, isPackageComplete } from './distribution.js';
import { WorkflowState, createMission, transitionMission, stateLabel } from './workflow.js';
import { createAuditEvent, exportJson } from './audit.js';

const $ = selector => document.querySelector(selector);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const AppState = Object.freeze({
  LOADING: 'loading',
  READY: 'ready',
  RUNNING: 'running',
  AWAITING_ASSET_DECISION: 'awaiting_asset_decision',
  ASSET_APPROVED: 'asset_approved',
  ASSET_REJECTED: 'asset_rejected',
  CONFIGURING_DISTRIBUTION: 'configuring_distribution',
  GENERATING_VARIANTS: 'generating_variants',
  AWAITING_VARIANT_DECISIONS: 'awaiting_variant_decisions',
  DISTRIBUTION_READY: 'distribution_ready',
  DISTRIBUTION_REJECTED: 'distribution_rejected',
  COMPLETED: 'completed',
  FAILED: 'failed'
});

const AGENTS = [
  ['Mission Orchestrator', 'Plans the governed workflow'],
  ['Policy Retrieval Agent', 'Selects applicable policies'],
  ['Editorial Agent', 'Produces the reference draft'],
  ['Claims Review Agent', 'Checks claims and disclosures'],
  ['Asset Registry Agent', 'Prepares the institutional record'],
  ['Distribution Adapter', 'Derives channel-specific variants'],
  ['Audit Agent', 'Preserves execution evidence']
];

const state = {
  status: AppState.LOADING,
  source: null,
  policies: [],
  selectedPolicies: [],
  reference: null,
  channels: [],
  selectedChannels: [],
  channelProfiles: [],
  mission: null,
  coreAsset: null,
  coreDecision: null,
  variants: [],
  selectedVariantId: null,
  distributionPackage: null,
  audit: [],
  running: false,
  generating: false,
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
    [AppState.AWAITING_ASSET_DECISION]: 'Awaiting core asset decision',
    [AppState.ASSET_APPROVED]: 'Core asset approved · configure distribution',
    [AppState.ASSET_REJECTED]: 'Core asset rejected',
    [AppState.CONFIGURING_DISTRIBUTION]: 'Configuring distribution',
    [AppState.GENERATING_VARIANTS]: 'Generating channel variants…',
    [AppState.AWAITING_VARIANT_DECISIONS]: 'Awaiting variant decisions',
    [AppState.DISTRIBUTION_READY]: 'Distribution package ready',
    [AppState.DISTRIBUTION_REJECTED]: 'Distribution rejected · revision required',
    [AppState.COMPLETED]: 'Completed',
    [AppState.FAILED]: 'Failed'
  };
  if (!state.mission && nextState !== AppState.FAILED) $('#missionStatus').textContent = labels[nextState] ?? nextState;
}

function addAudit(action, actor, detail, options = {}) {
  const event = createAuditEvent({
    missionId: options.missionId ?? state.mission?.id ?? 'not-created',
    action,
    actor,
    detail,
    state: state.mission?.state ?? WorkflowState.IDLE,
    sequence: state.audit.length + 1,
    actorType: options.actorType ?? 'system',
    channelId: options.channelId ?? null,
    entityId: options.entityId ?? null,
    payload: options.payload ?? {}
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
  $('#sourceContent').innerHTML = `<div class="source-card"><h4>${escapeHtml(source.title)}</h4><div class="source-meta"><span>${escapeHtml(source.id)}</span><span>${escapeHtml(source.author)}</span></div><p class="source-body">${escapeHtml(source.content)}</p></div>`;
  setChip($('#sourceType'), source.type.replaceAll('_', ' '), 'accent');
}

function renderPolicies() {
  $('#policyList').className = 'stack';
  $('#policyList').innerHTML = state.selectedPolicies.map(policy => `<div class="policy-card"><span class="policy-id">${escapeHtml(policy.id)}</span><h4>${escapeHtml(policy.title)}</h4><p>${escapeHtml(policy.summary)}</p></div>`).join('');
  setChip($('#policyCount'), `${state.selectedPolicies.length} selected`, 'accent');
}

function renderBrief() {
  const { classification, brief } = state.reference;
  $('#briefContent').className = '';
  $('#briefContent').innerHTML = `<div class="stack"><div class="brief-block"><span class="label">Objective</span><p>${escapeHtml(brief.objective)}</p></div><div class="brief-block"><span class="label">Audience</span><p>${escapeHtml(classification.audience)}</p></div><div class="brief-block"><span class="label">Tone</span><p>${escapeHtml(brief.tone)}</p></div><div class="brief-block"><span class="label">Required disclosures</span><p>${brief.requiredDisclosures.map(escapeHtml).join(' · ')}</p></div></div>`;
  setChip($('#riskChip'), `${classification.risk} risk`, classification.risk === 'medium' ? 'warning' : 'neutral');
}

function renderAsset() {
  const asset = state.coreAsset ?? state.reference.asset;
  $('#assetContent').className = 'asset-content';
  $('#assetContent').innerHTML = `<div class="asset-meta"><span>Asset ID: ${escapeHtml(asset.assetId ?? 'reference-asset')}</span><span>Version 0.1</span></div><h2>${escapeHtml(asset.title)}</h2><p class="asset-dek">${escapeHtml(asset.dek)}</p><div class="asset-body">${asset.body.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div><div class="asset-disclosure">Reference implementation only. Synthetic data, deterministic editorial output, and no external publishing.</div>`;
  setChip($('#assetState'), 'Draft · v0.1', 'accent');
}

function renderReview() {
  const review = state.reference.review;
  $('#reviewFindings').className = '';
  $('#reviewFindings').innerHTML = review.findings.map(finding => `<div class="finding ${escapeHtml(finding.severity)}"><div class="finding-icon">${finding.severity === 'warning' ? '!' : 'i'}</div><div><strong>${escapeHtml(finding.code.replaceAll('_', ' '))}</strong><p>${escapeHtml(finding.message)}</p></div></div>`).join('');
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
  timeline.innerHTML = state.audit.map(event => `<div class="timeline-item"><span class="timeline-time">#${event.sequence} · ${new Date(event.timestamp).toLocaleTimeString()}</span><strong>${escapeHtml(event.eventType ?? event.action)}</strong><p>${escapeHtml(event.actorLabel ?? event.actor)}${event.channelId ? ` · ${escapeHtml(event.channelId)}` : ''} · ${escapeHtml(event.detail)}</p></div>`).join('');
}

function renderChannelCatalog(disabled = true) {
  const selected = new Set(state.selectedChannels);
  $('#channelList').innerHTML = state.channels.map(channel => `<label class="channel-card ${selected.has(channel.id) ? 'selected' : ''}"><input type="checkbox" data-channel-id="${escapeHtml(channel.id)}" ${selected.has(channel.id) ? 'checked' : ''} ${disabled || channel.enabled === false ? 'disabled' : ''}><span class="channel-card-body"><strong>${escapeHtml(channel.name)}</strong><small>${escapeHtml(channel.category)} · ${escapeHtml(channel.targetAudience)}</small><span class="channel-spec">${channel.constraints.maxLength} char limit · ${channel.constraints.supportsTitle ? 'title' : 'no separate title'} · ${channel.constraints.supportsMarkdown ? 'Markdown' : 'plain text'}</span></span></label>`).join('');
  $('#channelSelectionStatus').textContent = `${state.selectedChannels.length} selected`;
  $('#channelSelectionStatus').className = `chip ${state.selectedChannels.length ? 'accent' : 'warning'}`;
  $('#channelNotice').textContent = disabled ? 'Approve the core Institutional Asset to configure distribution.' : 'Select one or more channels. Profiles are illustrative reference configuration, not live platform guarantees.';
  $('#generateVariantsButton').disabled = disabled || state.selectedChannels.length === 0;
}

function renderChannelProfiles() {
  $('#channelProfileList').innerHTML = state.channelProfiles.map(channel => `<div class="profile-card"><strong>${escapeHtml(channel.name)}</strong><span>${escapeHtml(channel.editorialGuidance.tone)}</span><small>${escapeHtml(channel.editorialGuidance.structure)} · ${channel.constraints.maxLength} characters</small></div>`).join('');
}

function renderVariantSelector() {
  const select = $('#variantChannelSelect');
  select.innerHTML = state.variants.map(variant => `<option value="${escapeHtml(variant.variantId)}">${escapeHtml(variant.channelName)} · ${escapeHtml(variant.status)}</option>`).join('');
  select.value = state.selectedVariantId ?? state.variants[0]?.variantId ?? '';
  select.disabled = state.variants.length === 0;
}

function variantStatusKind(variant) {
  if (variant.status === 'approved') return 'success';
  if (variant.status === 'rejected' || variant.reviewStatus === 'blocked') return 'danger';
  return 'warning';
}

function renderVariant() {
  const variant = state.variants.find(item => item.variantId === state.selectedVariantId) ?? state.variants[0];
  if (!variant) {
    $('#variantContent').className = 'empty-state large';
    $('#variantContent').textContent = 'Generate variants after approving the core Institutional Asset.';
    $('#variantFindings').textContent = 'No variant findings yet.';
    updateVariantControls();
    return;
  }
  state.selectedVariantId = variant.variantId;
  const channel = state.channels.find(item => item.id === variant.channelId);
  const blocking = variant.findings.filter(item => item.severity === 'blocking');
  $('#variantContent').className = 'variant-content';
  $('#variantContent').innerHTML = `<div class="variant-meta"><span>${escapeHtml(variant.channelName)}</span><span>${escapeHtml(variant.targetAudience)}</span><span>${variant.characterCount}/${channel.constraints.maxLength} characters · ${escapeHtml(variant.limitStatus)}</span></div>${variant.title ? `<h3>${escapeHtml(variant.title)}</h3>` : ''}<p class="variant-summary">${escapeHtml(variant.summary)}</p><div class="variant-body">${escapeHtml(variant.body).replaceAll('\n', '<br>')}</div><div class="variant-fields"><div><span class="label">Tags</span><p>${variant.tags.length ? variant.tags.map(tag => `#${escapeHtml(tag.replace(/^#/, ''))}`).join(' ') : 'None configured'}</p></div><div><span class="label">Call to action</span><p>${escapeHtml(variant.callToAction)}</p></div><div><span class="label">Disclosure</span><p>${escapeHtml(variant.disclosure ?? 'Not required by profile')}</p></div></div><div class="profile-note"><strong>Channel Profile</strong><p>${escapeHtml(channel.editorialGuidance.structure)} · ${escapeHtml(channel.editorialGuidance.tone)}</p><p>${channel.editorialGuidance.rules.map(escapeHtml).join(' ')}</p></div>`;
  setChip($('#variantState'), `${variant.status.replaceAll('_', ' ')}${blocking.length ? ` · ${blocking.length} blocking` : ''}`, variantStatusKind(variant));
  $('#variantFindings').innerHTML = variant.findings.map(item => `<div class="finding ${escapeHtml(item.severity)}"><div class="finding-icon">${item.severity === 'blocking' ? '!' : item.severity === 'warning' ? '!' : 'i'}</div><div><strong>${escapeHtml(item.code.replaceAll('_', ' '))}</strong><p>${escapeHtml(item.message)}</p><small>${escapeHtml(item.status)}</small></div></div>`).join('');
  updateVariantControls();
}

function renderDistributionPackage() {
  const packageData = state.distributionPackage;
  if (!packageData) {
    $('#packageSummary').className = 'empty-state';
    $('#packageSummary').textContent = 'The Distribution Package will appear after variants are generated.';
    return;
  }
  const statusKind = packageData.packageStatus === 'approved_for_distribution' ? 'success' : packageData.packageStatus === 'rejected' ? 'danger' : 'warning';
  setChip($('#packageState'), packageData.packageStatus.replaceAll('_', ' '), statusKind);
  $('#packageSummary').className = 'package-summary';
  $('#packageSummary').innerHTML = `<div class="package-counts"><strong>${packageData.approvedVariants.length} approved</strong><strong>${packageData.rejectedVariants.length} rejected</strong><strong>${packageData.pendingVariants.length} pending</strong></div><p>Package <code>${escapeHtml(packageData.distributionPackageId)}</code> derives from <code>${escapeHtml(packageData.parentAssetId)}</code>. Maximum state: <strong>approved for distribution</strong>; no external publication occurred.</p>`;
}

function updateVariantControls() {
  const variant = state.variants.find(item => item.variantId === state.selectedVariantId);
  const awaiting = state.status === AppState.AWAITING_VARIANT_DECISIONS;
  const hasBlocking = Boolean(variant?.findings.some(item => item.severity === 'blocking'));
  $('#approveVariantButton').disabled = !awaiting || !variant || variant.status !== 'awaiting_review' || hasBlocking;
  $('#rejectVariantButton').disabled = !awaiting || !variant || variant.status !== 'awaiting_review';
  $('#approveAllButton').disabled = !awaiting || !state.variants.some(item => item.status === 'awaiting_review' && !item.findings.some(findingItem => findingItem.severity === 'blocking'));
}

function showVariants() {
  $('#variantsSection').hidden = false;
  $('#variantsSection').scrollIntoView?.({ behavior: 'smooth', block: 'start' });
}

function hideVariants() {
  $('#variantsSection').hidden = true;
  $('#variantChannelSelect').innerHTML = '';
  $('#variantContent').className = 'empty-state large';
  $('#variantContent').textContent = 'Generate variants after approving the core Institutional Asset.';
  $('#variantFindings').className = 'empty-state';
  $('#variantFindings').textContent = 'No variant findings yet.';
  $('#packageSummary').className = 'empty-state';
  $('#packageSummary').textContent = 'The Distribution Package will appear after variants are generated.';
  setChip($('#variantState'), 'Pending', 'neutral');
  setChip($('#packageState'), 'Not generated', 'neutral');
}

function resetDistributionState() {
  state.selectedChannels = state.channels.length ? getDefaultChannelIds(state.channels) : [];
  state.channelProfiles = [];
  state.variants = [];
  state.selectedVariantId = null;
  state.distributionPackage = null;
  renderChannelCatalog(true);
  hideVariants();
}

function assertString(value, field, resource) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${resource} is missing required field ${field}.`);
}

function assertStringArray(value, field, resource) {
  if (!Array.isArray(value) || value.length === 0 || value.some(item => typeof item !== 'string' || !item.trim())) throw new Error(`${resource}.${field} must be a non-empty list of strings.`);
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
  if (!reference.classification || !reference.brief || !reference.asset || !reference.review) throw new Error('Reference output must contain classification, brief, asset, and review.');
  ['assetType', 'audience', 'risk'].forEach(field => assertString(reference.classification[field], field, 'Reference classification'));
  assertStringArray(reference.classification.topics, 'topics', 'Reference classification');
  ['objective', 'tone'].forEach(field => assertString(reference.brief[field], field, 'Reference brief'));
  assertStringArray(reference.brief.requiredDisclosures, 'requiredDisclosures', 'Reference brief');
  ['title', 'dek'].forEach(field => assertString(reference.asset[field], field, 'Reference asset'));
  assertStringArray(reference.asset.body, 'body', 'Reference asset');
  assertString(reference.distributionDisclosure, 'distributionDisclosure', 'Reference output');
  assertStringArray(reference.coreClaimTerms, 'coreClaimTerms', 'Reference output');
  assertString(reference.review.status, 'status', 'Reference review');
  if (!Array.isArray(reference.review.findings) || reference.review.findings.length === 0) throw new Error('Reference review.findings must be a non-empty list.');
  reference.review.findings.forEach((finding, index) => ['severity', 'code', 'message'].forEach(field => assertString(finding?.[field], field, `Review finding ${index + 1}`)));
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
  const [source, policies, reference, channelCatalog] = await Promise.all([
    loadJson('./data/sample-source.json', 'source document'),
    loadJson('./data/policies.json', 'policies'),
    loadJson('./data/reference-output.json', 'reference output'),
    loadJson('./data/channels.json', 'channel catalog')
  ]);
  validateSource(source);
  validatePolicies(policies);
  validateReference(reference);
  const channels = validateChannelCatalog(channelCatalog);
  if (!reference.channelAdaptations || typeof reference.channelAdaptations !== 'object') throw new Error('Reference output must contain channel adaptation templates or a valid fallback asset strategy.');
  state.source = source;
  state.policies = policies;
  state.reference = reference;
  state.channels = channels;
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
  state.coreDecision = null;
  state.mission = null;
  state.coreAsset = null;
  state.selectedPolicies = [];
  resetDistributionState();
  renderAudit();

  try {
    console.info('[BBA Demo] workflow started');
    renderAgents(0, -1);
    setProgress(8);
    setFeedback('Workflow started: loading governed source…');
    await wait(350);
    state.mission = createMission(state.source);
    state.coreAsset = { ...state.reference.asset, assetId: `AST-${state.mission.id}`, status: 'draft', version: '0.1' };
    renderSource();
    updateMission();
    addAudit('MISSION_CREATED', 'Mission Orchestrator', `Mission created from source ${state.source.id}.`, { entityId: state.mission.id });
    addAudit('SOURCE_LOADED', 'Mission Orchestrator', `Source ${state.source.id} loaded and validated.`, { entityId: state.source.id });
    renderAgents(1, 0);
    setProgress(22);
    setFeedback('Source loaded. Retrieving relevant policies…');
    await wait(550);
    state.selectedPolicies = retrievePolicies(state.source, state.policies);
    if (!state.selectedPolicies.length) throw new Error('Policy retrieval returned no relevant policies.');
    state.mission = transitionMission(state.mission, WorkflowState.POLICIES_RETRIEVED);
    renderPolicies();
    updateMission();
    addAudit('POLICIES_RETRIEVED', 'Policy Retrieval Agent', `${state.selectedPolicies.length} relevant policies selected locally.`, { entityId: state.mission.id, payload: { policyIds: state.selectedPolicies.map(policy => policy.id) } });
    console.info('[BBA Demo] policies retrieved');
    renderAgents(2, 1);
    setProgress(40);
    setFeedback('Policies retrieved. Structuring the editorial brief…');
    await wait(600);
    state.mission = transitionMission(state.mission, WorkflowState.MISSION_PLANNED);
    renderBrief();
    updateMission();
    addAudit('EDITORIAL_BRIEF_CREATED', 'Mission Orchestrator', 'Audience, objective, tone, risk, and disclosures were structured.', { entityId: state.mission.id });
    renderAgents(2, 2);
    setProgress(55);
    setFeedback('Mission planned. Producing the governed Institutional Asset…');
    await wait(550);
    state.mission = transitionMission(state.mission, WorkflowState.ASSET_GENERATED);
    renderAsset();
    updateMission();
    addAudit('INSTITUTIONAL_ASSET_GENERATED', 'Editorial Agent', 'Deterministic reference asset generated as version 0.1.', { entityId: state.coreAsset.assetId });
    console.info('[BBA Demo] asset rendered');
    renderAgents(3, 2);
    setProgress(72);
    setFeedback('Institutional Asset generated. Running claims review…');
    await wait(550);
    state.mission = transitionMission(state.mission, WorkflowState.REVIEW_COMPLETED);
    renderReview();
    updateMission();
    addAudit('CLAIMS_REVIEW_COMPLETED', 'Claims Review Agent', 'Structured findings recorded; one warning requires human acknowledgement.', { entityId: state.coreAsset.assetId });
    console.info('[BBA Demo] review completed');
    renderAgents(-1, 4);
    setProgress(88);
    setAppState(AppState.AWAITING_ASSET_DECISION);
    setFeedback('Core asset review complete. Approve or reject the Institutional Asset.', 'warning');
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

function decideCoreAsset(decision) {
  if (state.status !== AppState.AWAITING_ASSET_DECISION || !state.mission || state.mission.state !== WorkflowState.REVIEW_COMPLETED) {
    setFeedback('A completed core asset review is required before recording a decision.', 'warning');
    return;
  }
  const note = $('#decisionNote').value.trim();
  state.coreDecision = { decision, note, decidedAt: new Date().toISOString(), actor: 'Authorized Human Steward' };
  const nextState = decision === 'approved' ? WorkflowState.APPROVED : WorkflowState.REJECTED;
  state.mission = transitionMission(state.mission, nextState);
  state.coreAsset.status = decision === 'approved' ? 'approved_for_distribution' : 'rejected_for_revision';
  updateMission();
  setChip($('#decisionState'), decision === 'approved' ? 'Core asset approved' : 'Core asset rejected', decision === 'approved' ? 'success' : 'danger');
  setChip($('#assetState'), decision === 'approved' ? 'Approved · v0.1' : 'Revision required · v0.1', decision === 'approved' ? 'success' : 'danger');
  addAudit(decision === 'approved' ? 'HUMAN_APPROVAL_RECORDED' : 'HUMAN_REJECTION_RECORDED', 'Authorized Human Steward', note || (decision === 'approved' ? 'Core Institutional Asset approved for channel adaptation.' : 'Core Institutional Asset rejected and returned for revision.'), { actorType: 'human', entityId: state.coreAsset.assetId, payload: { scope: 'core_asset', decision } });
  console.info('[BBA Demo] human decision recorded');
  $('#approveButton').disabled = true;
  $('#rejectButton').disabled = true;
  if (decision === 'rejected') {
    setAppState(AppState.ASSET_REJECTED);
    setFeedback('Core asset rejected for revision. Reset to start a new Mission.', 'error');
    renderChannelCatalog(true);
    return;
  }
  setAppState(AppState.ASSET_APPROVED);
  setProgress(90);
  state.channelProfiles = getChannelProfiles(state.selectedChannels, state.channels);
  renderChannelCatalog(false);
  renderChannelProfiles();
  setFeedback('Core asset approved. Select channels and generate channel-specific variants.', 'success');
}

function handleChannelChange(event) {
  const input = event.target;
  if (!input?.matches?.('[data-channel-id]') || state.status !== AppState.ASSET_APPROVED) return;
  const selected = [...document.querySelectorAll('#channelList input[data-channel-id]:checked')].map(item => item.dataset.channelId);
  try {
    state.selectedChannels = validateChannelSelection(selected, state.channels);
    state.channelProfiles = getChannelProfiles(state.selectedChannels, state.channels);
    renderChannelCatalog(false);
    addAudit('DISTRIBUTION_CHANNELS_SELECTED', 'Authorized Human Steward', `${state.selectedChannels.length} channel(s) selected for distribution preparation.`, { actorType: 'human', entityId: state.mission.id, payload: { channelIds: state.selectedChannels } });
    setFeedback(`${state.selectedChannels.length} channel(s) selected. Generate variants when ready.`, 'success');
  } catch (error) {
    state.selectedChannels = [];
    renderChannelCatalog(false);
    setFeedback(error.message, 'warning');
  }
}

async function generateVariants() {
  if (state.status !== AppState.ASSET_APPROVED || !state.mission || state.mission.state !== WorkflowState.APPROVED || state.generating) {
    setFeedback('Approve the core Institutional Asset before generating variants.', 'warning');
    return;
  }
  try {
    state.selectedChannels = validateChannelSelection(state.selectedChannels, state.channels);
    state.channelProfiles = getChannelProfiles(state.selectedChannels, state.channels);
    state.generating = true;
    setAppState(AppState.CONFIGURING_DISTRIBUTION);
    $('#generateVariantsButton').disabled = true;
    $('#runButton').disabled = true;
    $('#resetButton').disabled = true;
    renderChannelCatalog(true);
    state.mission = transitionMission(state.mission, WorkflowState.CONFIGURING_DISTRIBUTION);
    updateMission();
    addAudit('DISTRIBUTION_CHANNELS_SELECTED', 'Distribution Planner', `${state.selectedChannels.length} channel(s) selected for this Mission.`, { entityId: state.mission.id, payload: { channelIds: state.selectedChannels } });
    addAudit('DISTRIBUTION_GENERATION_STARTED', 'Distribution Adapter', 'Channel-specific adaptation started from the approved core Institutional Asset.', { entityId: state.coreAsset.assetId, payload: { channelIds: state.selectedChannels } });
    setFeedback('Distribution configured. Generating channel-specific variants…');
    await wait(350);
    setAppState(AppState.GENERATING_VARIANTS);
    state.mission = transitionMission(state.mission, WorkflowState.GENERATING_VARIANTS);
    updateMission();
    const generated = generateChannelVariants({ channels: state.channels, selectedIds: state.selectedChannels, asset: state.coreAsset, missionId: state.mission.id, parentAssetId: state.coreAsset.assetId, reference: state.reference });
    state.variants = generated.map(variant => {
      const channel = state.channels.find(candidate => candidate.id === variant.channelId);
      const reviewed = reviewVariant({ variant, channel, reference: state.reference });
      addAudit('CHANNEL_VARIANT_GENERATED', 'Distribution Adapter', `${channel.name} variant generated deterministically.`, { entityId: reviewed.variantId, channelId: channel.id, payload: { characterCount: reviewed.characterCount, limitStatus: reviewed.limitStatus } });
      addAudit('CHANNEL_VARIANT_REVIEWED', 'Claims Review Agent', `${channel.name} variant review completed with ${reviewed.findings.filter(finding => finding.severity === 'blocking').length} blocking finding(s).`, { entityId: reviewed.variantId, channelId: channel.id, payload: { findingCodes: reviewed.findings.map(finding => finding.code), reviewStatus: reviewed.reviewStatus } });
      return reviewed;
    });
    state.mission = transitionMission(state.mission, WorkflowState.AWAITING_VARIANT_DECISIONS);
    updateMission();
    state.distributionPackage = createDistributionPackage({ missionId: state.mission.id, parentAssetId: state.coreAsset.assetId, selectedChannels: state.selectedChannels, channelProfiles: state.channelProfiles, variants: state.variants });
    state.selectedVariantId = state.variants[0]?.variantId ?? null;
    renderChannelProfiles();
    renderVariantSelector();
    renderVariant();
    renderDistributionPackage();
    showVariants();
    setProgress(96);
    setAppState(AppState.AWAITING_VARIANT_DECISIONS);
    setFeedback('Variants generated and reviewed. Approve or reject each selected channel independently.', 'warning');
  } catch (error) {
    console.error('[BBA Demo] distribution generation failed', error);
    setAppState(AppState.FAILED);
    setFeedback(`Variant generation failed: ${error.message}`, 'error');
    renderChannelCatalog(true);
  } finally {
    state.generating = false;
    $('#resetButton').disabled = false;
  }
}

function finalizeDistribution() {
  if (!state.distributionPackage || !isPackageComplete(state.distributionPackage)) return;
  const approvedCount = state.distributionPackage.approvedVariants.length;
  if (!approvedCount) {
    state.mission = transitionMission(state.mission, WorkflowState.DISTRIBUTION_REJECTED);
    setAppState(AppState.DISTRIBUTION_REJECTED);
    updateMission();
    setFeedback('No channel variant was approved. Revise the selection or Reset the Mission.', 'error');
    addAudit('DISTRIBUTION_PACKAGE_REJECTED', 'Distribution Governance', 'Distribution package has no approved variants and cannot be completed.', { entityId: state.distributionPackage.distributionPackageId, payload: { packageStatus: state.distributionPackage.packageStatus } });
    return;
  }
  const finalState = state.distributionPackage.packageStatus === 'approved_for_distribution' ? WorkflowState.DISTRIBUTION_READY : WorkflowState.VARIANT_PARTIALLY_APPROVED;
  state.mission = transitionMission(state.mission, finalState);
  state.mission = transitionMission(state.mission, WorkflowState.COMPLETED);
  setAppState(AppState.COMPLETED);
  setProgress(100);
  addAudit('DISTRIBUTION_PACKAGE_READY', 'Distribution Governance', `Distribution package is ${state.distributionPackage.packageStatus}.`, { entityId: state.distributionPackage.distributionPackageId, payload: { approvedVariantIds: state.distributionPackage.approvedVariants.map(variant => variant.variantId), rejectedVariantIds: state.distributionPackage.rejectedVariants.map(variant => variant.variantId) } });
  addAudit(state.distributionPackage.packageStatus === 'approved_for_distribution' ? 'DISTRIBUTION_PACKAGE_APPROVED' : 'DISTRIBUTION_PACKAGE_PARTIALLY_APPROVED', 'Distribution Governance', `Package contains ${approvedCount} approved variant(s).`, { entityId: state.distributionPackage.distributionPackageId, payload: { packageStatus: state.distributionPackage.packageStatus } });
  renderDistributionPackage();
  $('#exportButton').disabled = false;
  setFeedback(state.distributionPackage.packageStatus === 'approved_for_distribution' ? 'Distribution package approved for distribution. No external publication occurred.' : 'Distribution package partially approved. Only approved variants are eligible for distribution.', 'success');
  updateMission();
}

function decideVariant(decision) {
  if (state.status !== AppState.AWAITING_VARIANT_DECISIONS) {
    setFeedback('Generate channel variants before recording variant decisions.', 'warning');
    return;
  }
  const variant = state.variants.find(item => item.variantId === state.selectedVariantId);
  if (!variant || variant.status !== 'awaiting_review') {
    setFeedback('This channel variant already has a decision. Select another pending variant.', 'warning');
    return;
  }
  if (decision === 'approved' && variant.findings.some(finding => finding.severity === 'blocking')) {
    setFeedback('This variant has a blocking finding and cannot be approved without an audited override.', 'error');
    return;
  }
  variant.status = decision;
  variant.decision = { decision, note: $('#variantDecisionNote').value.trim(), decidedAt: new Date().toISOString(), actor: 'Authorized Human Steward' };
  variant.updatedAt = new Date().toISOString();
  addAudit(decision === 'approved' ? 'CHANNEL_VARIANT_APPROVED' : 'CHANNEL_VARIANT_REJECTED', 'Authorized Human Steward', `${variant.channelName} variant ${decision}.`, { actorType: 'human', channelId: variant.channelId, entityId: variant.variantId, payload: { decision, note: variant.decision.note } });
  $('#variantDecisionNote').value = '';
  state.distributionPackage = updateDistributionPackage(state.distributionPackage, state.variants);
  renderVariantSelector();
  renderVariant();
  renderDistributionPackage();
  const pending = state.distributionPackage.pendingVariants.length;
  if (pending) setFeedback(`${variant.channelName} variant ${decision}. ${pending} variant(s) remain pending.`, decision === 'approved' ? 'success' : 'warning');
  else finalizeDistribution();
}

function approveAllEligibleVariants() {
  if (state.status !== AppState.AWAITING_VARIANT_DECISIONS) return;
  const eligible = state.variants.filter(variant => variant.status === 'awaiting_review' && !variant.findings.some(finding => finding.severity === 'blocking'));
  if (!eligible.length) {
    setFeedback('There are no eligible pending variants to approve.', 'warning');
    return;
  }
  eligible.forEach(variant => {
    variant.status = 'approved';
    variant.decision = { decision: 'approved', note: 'Approved by the global eligible-variant action.', decidedAt: new Date().toISOString(), actor: 'Authorized Human Steward' };
    variant.updatedAt = new Date().toISOString();
    addAudit('CHANNEL_VARIANT_APPROVED', 'Authorized Human Steward', `${variant.channelName} variant approved by global eligible-variant action.`, { actorType: 'human', channelId: variant.channelId, entityId: variant.variantId, payload: { decision: 'approved', bulkAction: true } });
  });
  state.distributionPackage = updateDistributionPackage(state.distributionPackage, state.variants);
  renderVariantSelector();
  renderVariant();
  renderDistributionPackage();
  if (state.distributionPackage.pendingVariants.length) setFeedback(`${eligible.length} eligible variant(s) approved. Resolve remaining variants individually.`, 'success');
  else finalizeDistribution();
}

function exportAudit() {
  if (state.status !== AppState.COMPLETED || !state.mission || !state.coreDecision || !state.distributionPackage || !isPackageComplete(state.distributionPackage) || !state.distributionPackage.approvedVariants.length) {
    setFeedback('Approve the core asset, process the variants, and approve at least one variant before exporting.', 'warning');
    return;
  }
  try {
    exportJson(`bba-publisher-reference-package-${state.mission.id.toLowerCase()}.json`, {
      metadata: {
        demo: 'BBA Publisher Reference Demo',
        version: '2.0.0',
        exportedAt: new Date().toISOString(),
        generationMode: 'deterministic_reference',
        disclaimer: 'Channel-specific variants prepared for distribution review only. No external platform was connected or published to.'
      },
      mission: state.mission,
      source: state.source,
      retrievedPolicies: state.selectedPolicies,
      classification: state.reference.classification,
      brief: state.reference.brief,
      institutionalAsset: state.coreAsset,
      coreReview: state.reference.review,
      coreHumanDecision: state.coreDecision,
      selectedChannels: state.selectedChannels,
      channelProfiles: state.channelProfiles,
      variants: state.variants,
      variantFindings: state.variants.map(variant => ({ variantId: variant.variantId, channelId: variant.channelId, findings: variant.findings })),
      variantDecisions: state.variants.map(variant => ({ variantId: variant.variantId, channelId: variant.channelId, decision: variant.decision })),
      distributionPackage: state.distributionPackage,
      auditEvents: state.audit
    });
    setFeedback('Distribution package exported as valid JSON.', 'success');
  } catch (error) {
    console.error('[BBA Demo] package export failed', error);
    setFeedback(`Package export failed: ${error.message}`, 'error');
  }
}

function reset() {
  const resetMissionId = state.mission?.id ?? 'not-created';
  const hadDistributionState = Boolean(state.mission && (state.selectedChannels.length || state.variants.length || state.distributionPackage));
  state.mission = null;
  state.selectedPolicies = [];
  state.coreAsset = null;
  state.coreDecision = null;
  state.audit = [];
  state.running = false;
  state.generating = false;
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
  $('#variantDecisionNote').value = '';
  const labels = { sourceType: 'Awaiting source', policyCount: '0 selected', riskChip: 'Risk pending', assetState: 'Not generated', reviewState: 'Pending', decisionState: 'Required' };
  Object.entries(labels).forEach(([id, label]) => setChip($(`#${id}`), label, 'neutral'));
  $('#approveButton').disabled = true;
  $('#rejectButton').disabled = true;
  $('#exportButton').disabled = true;
  $('#runButton').disabled = !state.dataReady;
  $('#resetButton').disabled = false;
  setProgress(0);
  setFeedback(state.dataReady ? 'Ready' : 'Loading demo data…', state.dataReady ? 'success' : '');
  resetDistributionState();
  renderAgents();
  renderAudit();
  if (hadDistributionState) addAudit('DISTRIBUTION_RESET', 'Authorized Human Steward', 'Distribution channels, variants, decisions, and package state were reset locally.', { actorType: 'human', missionId: resetMissionId, payload: { reset: true } });
}

$('#runButton').addEventListener('click', runWorkflow);
$('#resetButton').addEventListener('click', reset);
$('#approveButton').addEventListener('click', () => decideCoreAsset('approved'));
$('#rejectButton').addEventListener('click', () => decideCoreAsset('rejected'));
$('#generateVariantsButton').addEventListener('click', generateVariants);
$('#approveVariantButton').addEventListener('click', () => decideVariant('approved'));
$('#rejectVariantButton').addEventListener('click', () => decideVariant('rejected'));
$('#approveAllButton').addEventListener('click', approveAllEligibleVariants);
$('#exportButton').addEventListener('click', exportAudit);
$('#channelList').addEventListener('change', handleChannelChange);
$('#variantChannelSelect').addEventListener('change', event => {
  state.selectedVariantId = event.target.value;
  renderVariant();
});

renderAgents();
setAppState(AppState.LOADING);
loadData()
  .then(() => {
    state.selectedChannels = getDefaultChannelIds(state.channels);
    setAppState(AppState.READY);
    renderChannelCatalog(true);
    hideVariants();
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
