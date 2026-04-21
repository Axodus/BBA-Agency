import "dotenv/config";
import http from "http";
import { appEnv } from "../config/env";

type ToolHandler = (params: Record<string, unknown>) => Promise<unknown>;

const tools: Record<string, ToolHandler> = {
  "figma.getFrame": async ({ fileId, frameId }) => {
    if (!appEnv.figmaAccessToken) {
      return {
        mock: true,
        message: "FIGMA_ACCESS_TOKEN nao configurado. Retornando stub.",
        fileId,
        frameId,
      };
    }

    const response = await fetch(`https://api.figma.com/v1/files/${fileId}/nodes?ids=${frameId}`, {
      headers: { "X-Figma-Token": appEnv.figmaAccessToken },
    });

    return response.json();
  },

  "notion.createPage": async ({ title, content, databaseId }) => {
    if (!appEnv.notionToken) {
      return {
        mock: true,
        id: `mock-notion-${Date.now()}`,
        title,
        content,
        databaseId,
      };
    }

    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${appEnv.notionToken}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          title: {
            title: [{ text: { content: String(title ?? "Axodus briefing") } }],
          },
        },
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{ text: { content: String(content ?? "") } }],
            },
          },
        ],
      }),
    });

    return response.json();
  },

  "meta.createCampaign": async ({ name, objective, budget }) => {
    console.log(`[MCP] Meta Ads: criando campanha ${name} com budget ${budget}`);
    return {
      id: `mock_${Date.now()}`,
      status: "PAUSED",
      name,
      objective,
      budget,
    };
  },

  "analytics.getMetrics": async ({ campaignId }) => ({
    campaignId,
    ctr: 0.038,
    conversion: 0.021,
    spend: 3200,
    impressions: 85000,
  }),
};

const server = http.createServer((req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const parsed = JSON.parse(body || "{}");
      const tool = String(parsed.tool ?? "");
      const params = (parsed.params ?? {}) as Record<string, unknown>;
      const handler = tools[tool];

      if (!handler) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Tool ${tool} not found` }));
        return;
      }

      const result = await handler(params);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown MCP error",
        })
      );
    }
  });
});

server.listen(appEnv.mcpPort, () => {
  console.log(`[MCP Server] Rodando na porta ${appEnv.mcpPort}`);
});
