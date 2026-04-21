import "dotenv/config";
import { memory } from "../memory/memory.manager";
import { BriefInterpreterAgent } from "../agents/strategy/brief-interpreter.agent";

async function test(): Promise<void> {
  await memory.init();

  const agent = new BriefInterpreterAgent();
  const output = await agent.run({
    id: "test-001",
    brief: {
      id: "b-001",
      client: "TesteCo",
      goal: "conversion",
      rawText: "Quero vender mais meu curso de marketing digital para MEIs.",
      budget: 2000,
      channels: ["Instagram", "WhatsApp"],
    },
  });

  console.log(JSON.stringify(output, null, 2));
}

test().catch((error) => {
  console.error("[TestAgent] ERRO:", error);
  process.exit(1);
});
