import { TenantId } from "../identity/TenantId.js";
import { ValueObject } from "../valueobject/ValueObject.js";
import type { JsonObject } from "../common/serialization.js";
import { ValidationError } from "../errors/ValidationError.js";

export type TenantMetadata = Readonly<Record<string, string>>;

export interface TenantContextProps {
  readonly tenantId: TenantId;
  readonly timezone: string;
  readonly locale: string;
  readonly metadata?: TenantMetadata;
}

export class TenantContext extends ValueObject<JsonObject> {
  private readonly contextTenantId: TenantId;
  private readonly contextTimezone: string;
  private readonly contextLocale: string;
  private readonly contextMetadata: TenantMetadata;

  public constructor(props: TenantContextProps) {
    const timezone = props.timezone.trim();
    const locale = props.locale.trim();
    if (timezone.length === 0) throw new ValidationError("TenantContext timezone is required");
    if (locale.length === 0) throw new ValidationError("TenantContext locale is required");
    const metadata = Object.freeze({ ...(props.metadata ?? {}) });
    for (const [key, value] of Object.entries(metadata)) {
      if (key.trim().length === 0 || value.trim().length === 0) {
        throw new ValidationError("TenantContext metadata keys and values cannot be empty", { key });
      }
    }
    const serialized: JsonObject = {
      tenantId: props.tenantId.toString(),
      timezone,
      locale,
      metadata
    };
    super(serialized);
    this.contextTenantId = props.tenantId;
    this.contextTimezone = timezone;
    this.contextLocale = locale;
    this.contextMetadata = metadata;
    Object.freeze(this);
  }

  public get tenantId(): TenantId { return this.contextTenantId; }
  public get timezone(): string { return this.contextTimezone; }
  public get locale(): string { return this.contextLocale; }
  public get metadata(): TenantMetadata { return this.contextMetadata; }
}
