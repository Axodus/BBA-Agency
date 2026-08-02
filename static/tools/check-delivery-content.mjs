import { resolve } from "node:path";
import { generatedModuleHasDrift, loadDeliveryContent } from "./delivery-content-lib.mjs";
const root = resolve(import.meta.dirname, ".."); const { errors, deliveries } = await loadDeliveryContent(root);
if (await generatedModuleHasDrift(root, deliveries)) errors.push("generated Delivery Package module has drift; run pnpm --dir static generate:delivery-content");
if (errors.length) { console.error("Delivery content validation failed:\n" + errors.map((error) => `- ${error}`).join("\n")); process.exitCode = 1; } else console.log(`Delivery Package content validation passed: ${deliveries.length} files, schemaVersion 1.0.`);
