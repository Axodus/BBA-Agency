export function localTimestamp(date = new Date()): string { const offset = date.getTimezoneOffset() * 60_000; return new Date(date.getTime() - offset).toISOString().slice(0, 16); }
export function canonicalTimestamp(value: string): string { return new Date(value).toISOString(); }
