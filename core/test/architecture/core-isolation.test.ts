import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";

test("Core executable surface is isolated from demo and legacy src", async () => {
  const coreRoot = resolve(import.meta.dirname, "../../../..");
  const boundaryModule = await import(new URL("../../../../tools/check-core-boundaries.mjs", import.meta.url).href) as {
    findBoundaryViolations: (root: string) => Promise<string[]>;
  };
  const violations = await boundaryModule.findBoundaryViolations(coreRoot);
  assert.deepEqual(violations, []);
});
