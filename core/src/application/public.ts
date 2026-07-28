/**
 * Public, transport-neutral Application API package facade.
 *
 * This subpath intentionally excludes bindings, runners, repository sessions,
 * transaction factories, domain modules and persistence adapters.
 */
export type * from "./ports/ApplicationApiPorts.js";
export type * from "./dto/ApplicationContext.js";
export { ApplicationError } from "./errors/ApplicationError.js";
export type { ApplicationErrorCode } from "./errors/ApplicationError.js";
