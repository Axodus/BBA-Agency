import assert from "node:assert/strict";
import { test } from "node:test";
import { createConnectorBindings } from "../../src/application/bindings/ConnectorBindings.js";
test("Connector excludes executeTransport and exposes the nine public commands plus two queries", () => { assert.deepEqual(Object.keys(createConnectorBindings()).sort(), ["activateConnector", "cancelExecution", "completeExecution", "createExecution", "failExecution", "getConnector", "getConnectorExecution", "registerConnector", "retireConnector", "startExecution", "suspendConnector"]); });
