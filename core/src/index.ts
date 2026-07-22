/**
 * Minimal bootstrap metadata only.
 *
 * Domain behavior intentionally starts in later implementation REQs. This
 * export proves that the isolated ESM workspace can be consumed and does not
 * pretend that the BBA Platform Core is implemented yet.
 */
export const coreBootstrap = Object.freeze({
  name: "bba-platform-core",
  version: "0.1.0",
  status: "bootstrap"
} as const);
