import assert from "node:assert/strict";
import test from "node:test";
import { coreBootstrap } from "../src/index.js";

test("Core bootstrap exports minimal ESM metadata", () => {
  assert.deepEqual(coreBootstrap, {
    name: "bba-platform-core",
    version: "0.1.0",
    status: "bootstrap"
  });
});
