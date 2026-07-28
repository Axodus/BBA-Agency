import assert from "node:assert/strict";
import { test } from "node:test";
import { createReviewBindings } from "../../src/application/bindings/ReviewBindings.js";
import type { ReviewDependencies } from "../../src/application/bindings/ReviewBindings.js";
const deps = { mission: {}, references: {}, governance: {}, workflow: {}, publication: {} } as ReviewDependencies;
test("Review exposes nine commands and one query", () => { assert.deepEqual(Object.keys(createReviewBindings(deps)).sort(), ["archiveReview", "cancelSession", "closeSession", "completeReview", "createReview", "getReview", "openSession", "planSession", "recordFinding", "startReview"]); });
test("Review requires all cross-context collaborators", () => { assert.throws(() => createReviewBindings({ ...deps, publication: undefined } as unknown as ReviewDependencies), /collaborators are required/u); });
