import { MongoClient } from "mongodb";
import { assertPrivatePreview, createPrivateApiRuntime } from "./runtime.js";

function required(name: string) { const value = process.env[name]?.trim(); if (!value) throw new Error(`API_CONFIGURATION_MISSING:${name}`); return value; }

async function main() {
  assertPrivatePreview(process.env.BBA_API_PRIVATE_PREVIEW);
  const client = new MongoClient(required("MONGODB_URI"));
  await client.connect();
  const app = await createPrivateApiRuntime(client, client.db(), {
    accessToken: required("BBA_API_DEV_ACCESS_TOKEN"),
    tenantId: required("BBA_API_TENANT_ID"),
    subject: required("BBA_API_SUBJECT"),
    actorReference: required("BBA_API_ACTOR_REFERENCE"),
    allowedOrigins: required("BBA_API_ALLOWED_ORIGINS").split(",").map((origin) => origin.trim()).filter(Boolean)
  });
  const close = async () => { await app.close(); await client.close(); };
  process.once("SIGINT", () => { void close(); });
  process.once("SIGTERM", () => { void close(); });
  await app.listen({ host: "0.0.0.0", port: Number(process.env.PORT ?? "3000") });
}

void main().catch((error: unknown) => { process.stderr.write(`${String(error)}\n`); process.exitCode = 1; });
