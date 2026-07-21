function finding(channelId, severity, code, message, status = severity === 'info' ? 'passed' : 'open') {
  return {
    findingId: `F-${channelId}-${code}`,
    channelId,
    severity,
    code,
    message,
    status
  };
}

function hasMarkdownSyntax(body) {
  return /(^|\n)\s*(#{1,6}\s|[-*]\s|>\s)|[`*_]{1,3}/.test(body);
}

function normalizedText(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function reviewVariant({ variant, channel, reference }) {
  const findings = [];
  const body = variant.body.trim();
  const constraints = channel.constraints;
  const guidance = channel.editorialGuidance;
  const coreTerms = reference.coreClaimTerms ?? ['governed', 'human', 'institutional asset'];
  if (!body) findings.push(finding(channel.id, 'blocking', 'CONTENT_MISSING', 'The channel variant has no publishable body.'));
  else findings.push(finding(channel.id, 'info', 'CONTENT_PRESENT', 'Variant body is present and ready for channel review.'));
  const missingClaim = coreTerms.find(term => !body.toLowerCase().includes(term.toLowerCase()));
  if (missingClaim) findings.push(finding(channel.id, 'blocking', 'CORE_CLAIM_NOT_PRESERVED', `Core claim term “${missingClaim}” is not present in the variant.`));
  else findings.push(finding(channel.id, 'info', 'CORE_CLAIM_PRESERVED', 'Core governed-publishing claims are represented.'));
  if (guidance.requiresDisclosure && (!variant.disclosure || !normalizedText(body).includes(normalizedText(variant.disclosure)))) {
    findings.push(finding(channel.id, 'blocking', 'DISCLOSURE_MISSING', 'This Channel Profile requires the deterministic-demo disclosure.'));
  } else if (guidance.requiresDisclosure) {
    findings.push(finding(channel.id, 'info', 'DISCLOSURE_PRESENT', 'Required disclosure is present.'));
  }
  if (variant.characterCount > constraints.maxLength) findings.push(finding(channel.id, 'blocking', 'CHANNEL_LENGTH_EXCEEDED', `Variant has ${variant.characterCount} characters; the illustrative limit is ${constraints.maxLength}.`));
  else findings.push(finding(channel.id, 'info', 'WITHIN_CHANNEL_LIMIT', `Variant is within the illustrative ${constraints.maxLength}-character limit.`));
  if (constraints.requiresTitle && (!constraints.supportsTitle || !variant.title)) findings.push(finding(channel.id, 'blocking', 'REQUIRED_TITLE_MISSING', 'This Channel Profile requires a title.'));
  if (!constraints.supportsTitle && variant.title) findings.push(finding(channel.id, 'blocking', 'UNSUPPORTED_TITLE', 'This Channel Profile does not support a separate title.'));
  if (constraints.supportsTitle && variant.title) findings.push(finding(channel.id, 'info', 'TITLE_PRESENT', 'Required channel title is present.'));
  if (!variant.callToAction?.trim()) findings.push(finding(channel.id, 'blocking', 'CTA_MISSING', 'A call to action is required for this channel variant.'));
  else findings.push(finding(channel.id, 'info', 'CTA_PRESENT', 'Channel call to action is present.'));
  if (!constraints.supportsTags && variant.tags.length) findings.push(finding(channel.id, 'blocking', 'UNSUPPORTED_TAGS', 'This Channel Profile does not support tags or hashtags.'));
  if (variant.tags.length > constraints.maxTagCount) findings.push(finding(channel.id, 'blocking', 'TOO_MANY_TAGS', `Variant has ${variant.tags.length} tags; the illustrative maximum is ${constraints.maxTagCount}.`));
  else if (constraints.supportsTags) findings.push(finding(channel.id, 'info', 'TAGS_WITHIN_LIMIT', 'Tags follow the configured channel limit.'));
  if (!constraints.supportsMarkdown && hasMarkdownSyntax(body)) findings.push(finding(channel.id, 'blocking', 'UNSUPPORTED_MARKDOWN', 'Markdown syntax is present but this Channel Profile does not support it.'));
  if (guidance.requiresLink && !/(https?:\/\/|www\.)/i.test(body)) findings.push(finding(channel.id, 'blocking', 'REQUIRED_LINK_MISSING', 'This Channel Profile requires a reference link.'));
  const hasBlocking = findings.some(item => item.severity === 'blocking');
  return {
    ...variant,
    findings,
    reviewStatus: hasBlocking ? 'blocked' : 'passed',
    reviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
