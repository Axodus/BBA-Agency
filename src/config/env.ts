import { z } from "zod";

const EnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().optional(),
  FIGMA_ACCESS_TOKEN: z.string().optional(),
  META_ADS_TOKEN: z.string().optional(),
  NOTION_TOKEN: z.string().optional(),
  MONGODB_URI: z.string().optional(),
  CHROMA_URL: z.string().optional(),
  MCP_PORT: z.coerce.number().optional(),
  USE_MOCK_LLM: z.string().optional().default("true"),
  AXODUS_MOCK_LLM: z.string().optional(),
});

const parsed = EnvSchema.parse(process.env);

export const appEnv = {
  anthropicApiKey: parsed.ANTHROPIC_API_KEY,
  figmaAccessToken: parsed.FIGMA_ACCESS_TOKEN,
  metaAdsToken: parsed.META_ADS_TOKEN,
  notionToken: parsed.NOTION_TOKEN,
  mongoUri: parsed.MONGODB_URI ?? "mongodb://localhost:27017/axodus",
  chromaUrl: parsed.CHROMA_URL ?? "http://localhost:8001",
  mcpPort: parsed.MCP_PORT ?? 3100,
  useMockLlm: (parsed.USE_MOCK_LLM ?? parsed.AXODUS_MOCK_LLM ?? "true") !== "false",
  anthropicModel: "claude-sonnet-4-20250514",
  mongoDbName: "axodus",
};
