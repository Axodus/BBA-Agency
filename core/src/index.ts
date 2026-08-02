/**
 * Minimal bootstrap metadata only.
 *
 * Context-specific domain behavior intentionally starts in later implementation
 * REQs. This export proves that the isolated ESM workspace can be consumed and
 * does not pretend that the full BBA Platform Core is implemented yet.
 */
export const coreBootstrap = Object.freeze({
  name: "bba-platform-core",
  version: "0.1.0",
  status: "bootstrap"
} as const);

export * from "./shared/index.js";
export * from "./application/index.js";
export * from "./modules/index.js";
export * as Persistence from "./infrastructure/persistence/index.js";
