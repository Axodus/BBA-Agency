function fallbackTemplate(asset, channel) {
  return {
    title: channel.constraints.supportsTitle ? asset.title : null,
    summary: asset.dek,
    body: `${asset.body[0]} ${asset.body[1]} Disclosure: synthetic data, deterministic output, and no external publishing. ${channel.editorialGuidance.callToAction}`,
    tags: [],
    callToAction: channel.editorialGuidance.callToAction
  };
}

export function createChannelVariant({ channel, asset, missionId, parentAssetId, reference }) {
  const template = reference.channelAdaptations?.[channel.id] ?? fallbackTemplate(asset, channel);
  const body = String(template.body).trim();
  const title = channel.constraints.supportsTitle ? (template.title || asset.title) : null;
  const tags = Array.isArray(template.tags) ? [...template.tags] : [];
  return {
    variantId: `VAR-${missionId}-${channel.id}`,
    missionId,
    parentAssetId,
    channelId: channel.id,
    channelName: channel.name,
    title,
    body,
    summary: template.summary || asset.dek,
    tags,
    callToAction: template.callToAction || channel.editorialGuidance.callToAction,
    targetAudience: channel.targetAudience,
    editorialTone: channel.editorialGuidance.tone,
    disclosure: channel.editorialGuidance.requiresDisclosure ? reference.distributionDisclosure : null,
    characterCount: body.length,
    limitStatus: body.length <= channel.constraints.maxLength ? 'within_limit' : 'over_limit',
    generationMode: 'deterministic_reference',
    status: 'awaiting_review',
    findings: [],
    decision: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function generateChannelVariants({ channels, selectedIds, asset, missionId, parentAssetId, reference }) {
  return selectedIds.map(channelId => {
    const channel = channels.find(candidate => candidate.id === channelId);
    if (!channel) throw new Error(`Cannot generate a variant without Channel Profile ${channelId}.`);
    return createChannelVariant({ channel, asset, missionId, parentAssetId, reference });
  });
}
