import { resolve } from "node:path";
import { loadProductContent, writeGeneratedModule } from "./product-content-lib.mjs";

const root = resolve(import.meta.dirname, "..");
const { errors, products } = await loadProductContent(root);

if (errors.length > 0) {
  console.error(
    "Product content validation failed:\n" +
      errors.map((error) => `- ${error}`).join("\n"),
  );
  process.exitCode = 1;
} else {
  await writeGeneratedModule(root, products);
  console.log(
    `Product content validation passed: ${products.length} files, schemaVersion 1.0.`,
  );
}
