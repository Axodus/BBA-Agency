export function createAuditEvent({ missionId, action, actor, detail, state }) {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    missionId,
    action,
    actor,
    detail,
    state,
    timestamp: new Date().toISOString()
  };
}

export function exportJson(filename, payload) {
  const json = JSON.stringify(payload, null, 2);
  const anchor = document.createElement('a');
  if (typeof Blob !== 'undefined' && globalThis.URL?.createObjectURL) {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    anchor.href = url;
    anchor.addEventListener('click', () => setTimeout(() => URL.revokeObjectURL(url), 0), { once: true });
  } else {
    anchor.href = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;
  }
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
