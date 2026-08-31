import { MongoClient } from "mongodb";
import { loadApiEnvironment } from "./configuration.js";
import { createPrivateApiRuntime } from "./runtime.js";

async function main() {
  const configuration = loadApiEnvironment();
  const client = new MongoClient(configuration.mongoUri);
  await client.connect();
  const app = await createPrivateApiRuntime(client, client.db(), configuration.runtime);
  const close = async () => { await app.close(); await client.close(); };
  process.once("SIGINT", () => { void close(); });
  process.once("SIGTERM", () => { void close(); });
  await app.listen({ host: "0.0.0.0", port: configuration.port });
}

void main().catch((error: unknown) => { process.stderr.write(`${String(error)}\n`); process.exitCode = 1; });
