import assert from "node:assert/strict";
import { test } from "node:test";
import { createPublicationBindings } from "../../src/application/bindings/PublicationBindings.js";
import type { PublicationDependencies } from "../../src/application/bindings/PublicationBindings.js";
const deps = { mission: {}, references: {}, governance: {}, review: {}, connectorEvidence: {} } as PublicationDependencies;
test("Publication exposes five commands and one query", () => { assert.deepEqual(Object.keys(createPublicationBindings(deps)).sort(), ["archivePublication", "authorizePublication", "createPublication", "getPublication", "preparePublication", "recordPublicationOutcome"]); });
test("Publication requires all collaborators", () => { assert.throws(() => createPublicationBindings({ ...deps, review: undefined } as unknown as PublicationDependencies), /collaborators are required/u); });
