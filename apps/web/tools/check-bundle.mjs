import { gzipSync } from "node:zlib";
import { readFile, readdir } from "node:fs/promises";
import { extname, resolve } from "node:path";

const assets = resolve(process.env.BBA_WEB_DIST ?? "dist", "assets");
const entries = await readdir(assets, { withFileTypes: true });
let javascript = 0; let css = 0; const report = [];
for (const entry of entries) {
  if (!entry.isFile()) continue; const extension = extname(entry.name); if (extension !== ".js" && extension !== ".css") continue;
  const content = await readFile(resolve(assets, entry.name)); const compressed = gzipSync(content).byteLength; report.push(`${entry.name}: ${compressed} bytes gzip`); if (extension === ".js") javascript += compressed; else css += compressed;
  const source = content.toString("utf8"); if (/["']node:|__vite-browser-external|@bba\/platform-core|@bba\/http-transport|PRIVATE KEY|VITE_BBA_DEV_ACCESS_TOKEN|BBA_API_DEV_ACCESS_TOKEN|MONGODB_(?:URI|PASSWORD|USERNAME)|api[_ -]?key|authorization:\s*bearer/iu.test(source)) throw new Error(`Forbidden bundle content in ${entry.name}`);
}
for (const line of report.sort()) process.stdout.write(`${line}\n`);
if (javascript > 300 * 1024) throw new Error(`JavaScript bundle exceeds 300 KiB gzip: ${javascript}`);
if (css > 50 * 1024) throw new Error(`CSS bundle exceeds 50 KiB gzip: ${css}`);
process.stdout.write(`Bundle baseline passed: JS ${javascript} bytes gzip; CSS ${css} bytes gzip.\n`);
