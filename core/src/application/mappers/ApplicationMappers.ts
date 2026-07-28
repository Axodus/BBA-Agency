import type { AggregateDto } from "../dto/ApplicationContext.js";
import type { JsonObject } from "../../shared/common/serialization.js";

export function toAggregateDto(input: { readonly aggregateType: string; readonly id: { toString(): string }; readonly tenantId: { toString(): string }; readonly version: { value: number }; readonly status?: string; readonly data: JsonObject }): AggregateDto {
  return Object.freeze({ aggregateType: input.aggregateType, id: input.id.toString(), tenantId: input.tenantId.toString(), version: input.version.value, ...(input.status === undefined ? {} : { status: input.status }), data: structuredClone(input.data) });
}
