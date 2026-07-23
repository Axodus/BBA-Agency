import type { JsonObject } from "../../shared/common/serialization.js";

export interface ActorReference { readonly reference: string; }
export interface ApplicationCommandContext { readonly tenantId: string; readonly actor: ActorReference; readonly correlationId: string; readonly causationId?: string; }
export interface QueryContext { readonly tenantId: string; readonly actor?: ActorReference; readonly correlationId: string; }
export interface MutableCommandDto { readonly idempotencyKey: string; readonly reason: string; }
export interface OperationCommandDto extends MutableCommandDto { readonly targetId?: string; readonly payload: JsonObject; }
export interface QueryDto { readonly targetId?: string; readonly filters?: JsonObject; }
export interface AggregateDto { readonly aggregateType: string; readonly id: string; readonly tenantId: string; readonly version: number; readonly status?: string; readonly data: JsonObject; }
export interface ApplicationResult<T> { readonly value: T; }
