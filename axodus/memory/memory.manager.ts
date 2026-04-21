import { ChromaClient, Collection } from "chromadb";
import { Db, MongoClient } from "mongodb";
import { appEnv } from "../config/env";
import { CampaignRecord } from "../types";
import { scoreTextSimilarity } from "../utils/text";

type StoredCampaign = CampaignRecord & { summary: string };
type AudienceInsight = { segment: string; insight: string };

export class MemoryManager {
  private chroma?: ChromaClient;
  private mongoClient?: MongoClient;
  private mongo?: Db;
  private campaignCollection?: Collection;
  private initialized = false;
  private initPromise?: Promise<void>;
  private inMemoryCampaigns: StoredCampaign[] = [];
  private inMemoryAudience: AudienceInsight[] = [];

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!this.initPromise) {
      this.initPromise = this.bootstrap();
    }

    await this.initPromise;
  }

  private async bootstrap(): Promise<void> {
    await this.connectMongo();
    await this.connectChroma();
    this.initialized = true;

    const backends = [
      this.mongo ? "MongoDB" : "memory-only Mongo fallback",
      this.campaignCollection ? "ChromaDB" : "memory-only vector fallback",
    ];

    console.log(`[Memory] Initialized with ${backends.join(" + ")}`);
  }

  private async connectMongo(): Promise<void> {
    try {
      this.mongoClient = new MongoClient(appEnv.mongoUri, {
        serverSelectionTimeoutMS: 1200,
      });
      await this.mongoClient.connect();
      this.mongo = this.mongoClient.db(appEnv.mongoDbName);
    } catch (error) {
      this.mongoClient = undefined;
      this.mongo = undefined;
      console.warn("[Memory] MongoDB unavailable, using in-memory structured store.");
      if (error instanceof Error) {
        console.warn(`[Memory] MongoDB reason: ${error.message}`);
      }
    }
  }

  private async connectChroma(): Promise<void> {
    try {
      this.chroma = new ChromaClient({ path: appEnv.chromaUrl });
      this.campaignCollection = await this.chroma.getOrCreateCollection({
        name: "campaigns",
        metadata: { description: "Campaign memory with embeddings" },
      });
    } catch (error) {
      this.chroma = undefined;
      this.campaignCollection = undefined;
      console.warn("[Memory] ChromaDB unavailable, using local similarity fallback.");
      if (error instanceof Error) {
        console.warn(`[Memory] ChromaDB reason: ${error.message}`);
      }
    }
  }

  async findSimilarCampaigns(query: string, n = 3): Promise<CampaignRecord[]> {
    await this.init();

    if (this.campaignCollection) {
      try {
        const results = await this.campaignCollection.query({
          queryTexts: [query],
          nResults: n,
        });

        const ids = results.ids[0] ?? [];
        const metadatas = results.metadatas?.[0] ?? [];

        return ids.map((id, index) => ({
          id,
          hook: String(metadatas[index]?.hook ?? ""),
          format: String(metadatas[index]?.format ?? "unknown"),
          ctr: Number(metadatas[index]?.ctr ?? 0),
          conversion: Number(metadatas[index]?.conversion ?? 0),
          budget: Number(metadatas[index]?.budget ?? 0),
        }));
      } catch (error) {
        console.warn("[Memory] Chroma query failed, falling back to local similarity.");
        if (error instanceof Error) {
          console.warn(`[Memory] Chroma query reason: ${error.message}`);
        }
      }
    }

    return this.inMemoryCampaigns
      .map((campaign) => ({
        campaign,
        score: scoreTextSimilarity(query, `${campaign.summary} ${campaign.hook} ${campaign.format}`),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, n)
      .map(({ campaign }) => ({
        id: campaign.id,
        hook: campaign.hook,
        format: campaign.format,
        ctr: campaign.ctr,
        conversion: campaign.conversion,
        budget: campaign.budget,
      }));
  }

  async saveCampaign(record: StoredCampaign): Promise<void> {
    await this.init();

    this.inMemoryCampaigns = this.inMemoryCampaigns.filter((item) => item.id !== record.id);
    this.inMemoryCampaigns.push(record);

    if (this.campaignCollection) {
      try {
        await this.campaignCollection.upsert({
          ids: [record.id],
          documents: [record.summary],
          metadatas: [
            {
              hook: record.hook,
              format: record.format,
              ctr: record.ctr,
              conversion: record.conversion,
              budget: record.budget,
            },
          ],
        });
      } catch (error) {
        console.warn("[Memory] Could not persist campaign into ChromaDB.");
        if (error instanceof Error) {
          console.warn(`[Memory] Chroma upsert reason: ${error.message}`);
        }
      }
    }

    if (this.mongo) {
      try {
        await this.mongo.collection<StoredCampaign>("campaigns").updateOne(
          { id: record.id },
          { $set: record },
          { upsert: true }
        );
      } catch (error) {
        console.warn("[Memory] Could not persist campaign into MongoDB.");
        if (error instanceof Error) {
          console.warn(`[Memory] Mongo upsert reason: ${error.message}`);
        }
      }
    }
  }

  async saveAudienceInsights(segment: string, insights: string[]): Promise<void> {
    await this.init();

    const entries = insights.map((insight) => ({ segment, insight }));
    for (const entry of entries) {
      const exists = this.inMemoryAudience.some(
        (item) => item.segment === entry.segment && item.insight === entry.insight
      );
      if (!exists) {
        this.inMemoryAudience.push(entry);
      }
    }

    if (this.mongo && entries.length > 0) {
      try {
        await this.mongo.collection<AudienceInsight>("audience").insertMany(entries, {
          ordered: false,
        });
      } catch {
        // Duplicate inserts are acceptable in this lightweight MVP path.
      }
    }
  }

  async getWinningHooks(limit = 5): Promise<string[]> {
    await this.init();

    if (this.mongo) {
      try {
        const docs = await this.mongo
          .collection<StoredCampaign>("campaigns")
          .find({ ctr: { $gt: 0.03 } })
          .sort({ ctr: -1 })
          .limit(limit)
          .toArray();

        if (docs.length > 0) {
          return docs.map((doc) => doc.hook);
        }
      } catch (error) {
        console.warn("[Memory] Mongo hook lookup failed, falling back to local cache.");
        if (error instanceof Error) {
          console.warn(`[Memory] Hook lookup reason: ${error.message}`);
        }
      }
    }

    return this.inMemoryCampaigns
      .filter((campaign) => campaign.ctr > 0.03)
      .sort((a, b) => b.ctr - a.ctr)
      .slice(0, limit)
      .map((campaign) => campaign.hook);
  }

  async getAudienceInsights(segment: string): Promise<string[]> {
    await this.init();

    if (this.mongo) {
      try {
        const docs = await this.mongo
          .collection<AudienceInsight>("audience")
          .find({ segment })
          .toArray();

        if (docs.length > 0) {
          return docs.map((doc) => doc.insight);
        }
      } catch (error) {
        console.warn("[Memory] Mongo audience lookup failed, falling back to local cache.");
        if (error instanceof Error) {
          console.warn(`[Memory] Audience lookup reason: ${error.message}`);
        }
      }
    }

    return this.inMemoryAudience
      .filter((entry) => entry.segment === segment)
      .map((entry) => entry.insight);
  }
}

export const memory = new MemoryManager();
