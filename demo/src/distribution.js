function packageStatus(variants) {
  const approved = variants.filter(variant => variant.status === 'approved');
  const rejected = variants.filter(variant => variant.status === 'rejected');
  const pending = variants.filter(variant => variant.status === 'awaiting_review');
  if (pending.length) return approved.length ? 'partially_approved' : 'awaiting_review';
  if (approved.length === variants.length) return 'approved_for_distribution';
  if (!approved.length) return 'rejected';
  return 'partially_approved';
}

export function createDistributionPackage({ missionId, parentAssetId, selectedChannels, channelProfiles, variants }) {
  return {
    distributionPackageId: `PKG-${missionId}`,
    missionId,
    parentAssetId,
    selectedChannels: [...selectedChannels],
    channelProfiles: channelProfiles.map(profile => ({ ...profile })),
    variants: [...variants],
    approvedVariants: variants.filter(variant => variant.status === 'approved'),
    rejectedVariants: variants.filter(variant => variant.status === 'rejected'),
    pendingVariants: variants.filter(variant => variant.status === 'awaiting_review'),
    packageStatus: packageStatus(variants),
    generatedAt: new Date().toISOString(),
    decidedAt: null,
    generationMode: 'deterministic_reference',
    disclaimer: 'Prepared for distribution review only. No external platform was connected or published to.'
  };
}

export function updateDistributionPackage(distributionPackage, variants) {
  const next = createDistributionPackage({
    missionId: distributionPackage.missionId,
    parentAssetId: distributionPackage.parentAssetId,
    selectedChannels: distributionPackage.selectedChannels,
    channelProfiles: distributionPackage.channelProfiles,
    variants
  });
  next.generatedAt = distributionPackage.generatedAt;
  if (!next.pendingVariants.length) next.decidedAt = new Date().toISOString();
  return next;
}

export function isPackageComplete(distributionPackage) {
  return Boolean(distributionPackage && distributionPackage.variants.length && !distributionPackage.pendingVariants.length);
}
