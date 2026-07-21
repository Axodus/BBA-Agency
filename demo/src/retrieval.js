export function retrievePolicies(source, policies, limit = 4) {
  if (!source || !Array.isArray(source.keywords) || typeof source.title !== 'string' || typeof source.content !== 'string') {
    throw new Error('Policy retrieval requires a source with title, content, and keywords.');
  }
  if (!Array.isArray(policies)) {
    throw new Error('Policy retrieval requires a policies list.');
  }
  const terms = new Set([
    ...source.keywords,
    ...source.title.toLowerCase().split(/\W+/),
    ...source.content.toLowerCase().split(/\W+/)
  ].filter(term => term.length > 3));

  return policies
    .map(policy => {
      if (!policy || typeof policy.id !== 'string' || typeof policy.title !== 'string' || typeof policy.summary !== 'string' || !Array.isArray(policy.tags) || !Array.isArray(policy.rules)) {
        throw new Error('Policy retrieval found a policy with missing id, title, summary, tags, or rules.');
      }
      const searchable = `${policy.title} ${policy.summary} ${policy.tags.join(' ')} ${policy.rules.join(' ')}`.toLowerCase();
      const score = [...terms].reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);
      return { ...policy, score };
    })
    .filter(policy => policy.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}
