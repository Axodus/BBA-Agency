const REQUIRED_CHANNEL_FIELDS = ['id', 'name', 'category', 'targetAudience', 'constraints', 'editorialGuidance'];

function requireString(value, field, resource) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${resource}.${field} must be a non-empty string.`);
}

export function validateChannelCatalog(catalog) {
  if (!catalog || typeof catalog !== 'object' || !Array.isArray(catalog.channels) || catalog.channels.length === 0) {
    throw new Error('Channel catalog must contain a non-empty channels list.');
  }
  const ids = new Set();
  catalog.channels.forEach((channel, index) => {
    const resource = `Channel ${index + 1}`;
    REQUIRED_CHANNEL_FIELDS.forEach(field => {
      if (channel?.[field] === undefined || channel?.[field] === null) throw new Error(`${resource} is missing ${field}.`);
    });
    ['id', 'name', 'category', 'targetAudience'].forEach(field => requireString(channel[field], field, resource));
    if (ids.has(channel.id)) throw new Error(`Channel catalog contains duplicate id ${channel.id}.`);
    ids.add(channel.id);
    const constraints = channel.constraints;
    if (!Number.isInteger(constraints.maxLength) || constraints.maxLength <= 0) throw new Error(`${resource}.constraints.maxLength must be a positive integer.`);
    ['supportsMarkdown', 'supportsTitle', 'supportsTags', 'supportsLinks', 'requiresTitle'].forEach(field => {
      if (typeof constraints[field] !== 'boolean') throw new Error(`${resource}.constraints.${field} must be boolean.`);
    });
    if (!Number.isInteger(constraints.maxTagCount) || constraints.maxTagCount < 0) throw new Error(`${resource}.constraints.maxTagCount must be a non-negative integer.`);
    const guidance = channel.editorialGuidance;
    ['tone', 'structure', 'recommendedLength', 'callToAction'].forEach(field => requireString(guidance[field], field, `${resource}.editorialGuidance`));
    if (!Number.isInteger(guidance.recommendedTagCount) || guidance.recommendedTagCount < 0) throw new Error(`${resource}.editorialGuidance.recommendedTagCount must be a non-negative integer.`);
    ['requiresDisclosure', 'requiresLink'].forEach(field => {
      if (typeof guidance[field] !== 'boolean') throw new Error(`${resource}.editorialGuidance.${field} must be boolean.`);
    });
    if (!Array.isArray(guidance.rules) || guidance.rules.some(rule => typeof rule !== 'string')) throw new Error(`${resource}.editorialGuidance.rules must be a list of strings.`);
    if (guidance.recommendedTagCount > constraints.maxTagCount) throw new Error(`${resource} recommends more tags than its configured maximum.`);
  });
  return catalog.channels;
}

export function getEnabledChannels(channels) {
  return channels.filter(channel => channel.enabled !== false);
}

export function getDefaultChannelIds(channels) {
  const preferred = ['x', 'medium', 'dev-community', 'telegram'];
  const enabled = getEnabledChannels(channels);
  const defaults = preferred.filter(id => enabled.some(channel => channel.id === id));
  return defaults.length ? defaults : enabled.slice(0, 1).map(channel => channel.id);
}

export function validateChannelSelection(selectedIds, channels) {
  if (!Array.isArray(selectedIds) || selectedIds.length === 0) throw new Error('Select at least one distribution channel.');
  const enabledIds = new Set(getEnabledChannels(channels).map(channel => channel.id));
  const uniqueIds = [...new Set(selectedIds)];
  const invalid = uniqueIds.find(id => !enabledIds.has(id));
  if (invalid) throw new Error(`Selected channel is unavailable: ${invalid}.`);
  return uniqueIds;
}

export function getChannelProfiles(selectedIds, channels) {
  const selected = validateChannelSelection(selectedIds, channels);
  return selected.map(id => channels.find(channel => channel.id === id));
}
