import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const files = [
  "src/styles.css",
  "src/design-system/tokens/agency.css",
  "src/design-system/components/agency-components.css",
  "src/design-system/patterns/agency-home.css",
  "src/design-system/foundation/foundation.css",
];

function assertBalancedBraces(source, file) {
  let depth = 0;
  let minimum = 0;

  for (const character of source) {
    if (character === "{") depth += 1;
    if (character === "}") {
      depth -= 1;
      minimum = Math.min(minimum, depth);
    }
  }

  if (depth !== 0 || minimum < 0) {
    throw new Error(`CSS_STRUCTURE_INVALID:${file}:brace-depth=${depth}:minimum=${minimum}`);
  }
}

for (const file of files) {
  const source = await readFile(resolve(process.cwd(), file), "utf8");
  assertBalancedBraces(source, file);
}

process.stdout.write(`CSS structure check passed for ${files.length} files.\n`);
