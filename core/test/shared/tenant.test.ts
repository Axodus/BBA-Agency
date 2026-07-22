import assert from "node:assert/strict";
import test from "node:test";
import { CurrentTenantPort, TenantContext, TenantContextProvider, assertCrossTenantForbidden, assertSameTenant, sameTenant } from "../../src/shared/tenant/index.js";
import { TenantId } from "../../src/shared/identity/TenantId.js";

class InMemoryTenantContext implements TenantContextProvider, CurrentTenantPort {
  private context: TenantContext;
  public constructor(context: TenantContext) { this.context = context; }
  public getCurrent(): TenantContext { return this.context; }
  public currentTenant(): TenantContext { return this.context; }
  public switchTo(context: TenantContext): void { this.context = context; }
}

test("TenantContext is immutable and carries neutral context metadata", () => {
  const context = new TenantContext({
    tenantId: TenantId.deterministic("tenant-a"),
    timezone: "UTC",
    locale: "pt-BR",
    metadata: { environment: "test" }
  });
  assert.equal(context.tenantId.toString().startsWith("tenant_"), true);
  assert.equal(context.timezone, "UTC");
  assert.deepEqual(context.toJSON().metadata, { environment: "test" });
  assert.equal(Object.isFrozen(context), true);
  assert.equal(Object.isFrozen(context.metadata), true);
});

test("Tenant boundary rules allow same Tenant and reject cross-Tenant use", () => {
  const first = TenantId.deterministic("tenant-a");
  const firstContext = new TenantContext({ tenantId: first, timezone: "UTC", locale: "en-US" });
  const second = TenantId.deterministic("tenant-b");
  const secondContext = new TenantContext({ tenantId: second, timezone: "UTC", locale: "en-US" });

  assert.equal(sameTenant(first, firstContext), true);
  assert.equal(sameTenant(firstContext, secondContext), false);
  assert.doesNotThrow(() => assertSameTenant(first, firstContext));
  assert.throws(() => assertCrossTenantForbidden(firstContext, second), /Tenant boundary/u);
});

test("Tenant context ports remain infrastructure-free contracts", () => {
  const context = new TenantContext({ tenantId: TenantId.deterministic("tenant-a"), timezone: "UTC", locale: "en-US" });
  const provider = new InMemoryTenantContext(context);
  assert.equal(provider.getCurrent(), context);
  assert.equal(provider.currentTenant(), context);
  const next = new TenantContext({ tenantId: TenantId.deterministic("tenant-b"), timezone: "UTC", locale: "en-US" });
  provider.switchTo(next);
  assert.equal(provider.getCurrent(), next);
});
