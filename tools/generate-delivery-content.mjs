import { resolve } from "node:path";
import { loadDeliveryContent, writeGeneratedModule } from "./delivery-content-lib.mjs";
const root = resolve(import.meta.dirname, ".."); const { errors, deliveries } = await loadDeliveryContent(root);
if (errors.length) { console.error("Delivery content generation failed:\n" + errors.map((error) => `- ${error}`).join("\n")); process.exitCode = 1; } else { await writeGeneratedModule(root, deliveries); console.log(`Generated typed Delivery Package content module for ${deliveries.length} files.`); }
