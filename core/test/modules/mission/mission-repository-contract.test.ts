import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryMissionRepository } from "../../../src/modules/mission/infrastructure/InMemoryMissionRepository.js";
import type { MissionRepository } from "../../../src/modules/mission/ports/MissionRepository.js";
import { TenantId } from "../../../src/shared/identity/TenantId.js";
import { Version } from "../../../src/shared/version/Version.js";
import { createMission, missionId, tenantId, timestamp } from "./mission-fixtures.js";

function missionRepositoryContract(
  name: string,
  factory: () => MissionRepository
): void {
  test(`${name}: save, findById and exists preserve a detached Mission snapshot`, async () => {
    const repository = factory();
    const mission = createMission();
    await repository.save(mission, Version.initial());
    assert.equal(await repository.exists(tenantId, missionId), true);
    const restored = await repository.findById(tenantId, missionId);
    assert.ok(restored);
    assert.notEqual(restored, mission);
    assert.equal(restored.serialize(), mission.serialize());
    assert.equal(restored.domainEvents.length, 0);
  });

  test(`${name}: optimistic Version rejects stale writes`, async () => {
    const repository = factory();
    await repository.save(createMission(), Version.initial());
    const first = await repository.findById(tenantId, missionId);
    const stale = await repository.findById(tenantId, missionId);
    assert.ok(first);
    assert.ok(stale);
    first.rename({ title: "First writer", occurredAt: timestamp(1) });
    await repository.save(first, Version.from(1));
    stale.updateDescription({ description: "Stale writer", occurredAt: timestamp(1) });
    await assert.rejects(repository.save(stale, Version.from(1)), /optimistic Version/u);
    const stored = await repository.findById(tenantId, missionId);
    assert.equal(stored?.metadata.title, "First writer");
  });

  test(`${name}: Tenant-scoped reads reject cross-Tenant access`, async () => {
    const repository = factory();
    await repository.save(createMission(), Version.initial());
    const otherTenant = TenantId.deterministic("other-tenant");
    await assert.rejects(repository.findById(otherTenant, missionId), /Tenant boundary/u);
    await assert.rejects(repository.exists(otherTenant, missionId), /Tenant boundary/u);
  });
}

missionRepositoryContract("InMemoryMissionRepository", () => new InMemoryMissionRepository());
