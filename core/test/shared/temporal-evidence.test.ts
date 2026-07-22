import assert from "node:assert/strict";
import test from "node:test";
import { AuditMetadata, CausationId, CorrelationId } from "../../src/shared/common/index.js";
import { EvidenceReference } from "../../src/shared/evidence/EvidenceReference.js";
import { EvidenceId } from "../../src/shared/identity/EvidenceId.js";
import { LineageReference } from "../../src/shared/lineage/LineageReference.js";
import { FakeClock, SystemClock } from "../../src/shared/time/index.js";
import { Version } from "../../src/shared/version/Version.js";

test("FakeClock and SystemClock provide canonical ISO timestamps", () => {
  const fake = new FakeClock("2026-01-01T00:00:00.000Z");
  assert.equal(fake.now(), "2026-01-01T00:00:00.000Z");
  assert.equal(fake.advance(1000), "2026-01-01T00:00:01.000Z");
  fake.set("2026-01-02T00:00:00.000Z");
  assert.equal(fake.now(), "2026-01-02T00:00:00.000Z");
  assert.match(new SystemClock().now(), /^\d{4}-\d{2}-\d{2}T/u);
  assert.throws(() => fake.set("not-a-timestamp"), /canonical ISO/u);
});

test("Version is immutable, incrementable and comparable", () => {
  const initial = Version.initial();
  const next = initial.increment();
  assert.equal(initial.value, 0);
  assert.equal(next.value, 1);
  assert.equal(next.isAfter(initial), true);
  assert.equal(initial.isBefore(next), true);
  assert.equal(Version.from(1).equals(next), true);
  assert.throws(() => Version.from(-1), /non-negative/u);
});

test("Correlation, causation, evidence and audit metadata serialize canonically", () => {
  const correlation = CorrelationId.deterministic("execution");
  const causation = CausationId.deterministic("command");
  const metadata = new AuditMetadata({
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:01.000Z",
    correlationId: correlation,
    causationId: causation,
    version: Version.initial()
  });
  const evidence = new EvidenceReference({
    evidenceId: EvidenceId.deterministic("source"),
    source: "local-fixture",
    type: "document",
    capturedAt: "2026-01-01T00:00:00.000Z",
    locator: "fixture://source"
  });
  assert.equal(metadata.correlationId.equals(correlation), true);
  assert.equal(metadata.causationId?.equals(causation), true);
  assert.equal(evidence.evidenceId.toString().startsWith("evidence_"), true);
  assert.equal(evidence.toJSON().locator, "fixture://source");
  assert.throws(() => new AuditMetadata({
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    correlationId: correlation,
    causationId: causation,
    version: Version.initial()
  }), /updatedAt cannot precede/u);
});

test("LineageReference preserves directional relationship and rejects self-links", () => {
  const reference = new LineageReference({
    sourceId: "source_1",
    targetId: "target_1",
    relationship: "derived_from",
    declaredAt: "2026-01-01T00:00:00.000Z",
    reason: "bounded transformation"
  });
  assert.equal(reference.toJSON().relationship, "derived_from");
  assert.equal(reference.equals(new LineageReference({
    sourceId: "source_1",
    targetId: "target_1",
    relationship: "derived_from",
    declaredAt: "2026-01-01T00:00:00.000Z",
    reason: "bounded transformation"
  })), true);
  assert.throws(() => new LineageReference({ sourceId: "same", targetId: "same", relationship: "references", declaredAt: "2026-01-01T00:00:00.000Z" }), /itself/u);
});
