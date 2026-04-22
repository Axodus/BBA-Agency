// ─────────────────────────────────────────────────────────────
// AXODUSBBA — Memory Manager (Episódic + Semantic + Fallback)
// FASE 2 + DIRETRIZ 4: Stateful memory para aprendizado entre campanhas + Fallback
// ─────────────────────────────────────────────────────────────

import { ChromaClient, Collection } from "chromadb";
import { Db, MongoClient } from "mongodb";
import { CampaignRecord, ICPProfile, CreativeConcept } from "../types/index";
import { MemoryError } from "../utils/errors";
import { scoreTextSimilarity } from "../utils/text";

/**
 * ── MEMÓRIA EPISÓDICA ─────────────────────────────────────────
 * "O que fizemos para o Cliente X na semana passada?"
 * Recupera por cliente, data, contexto específico
 * Recuperação: por cliente + data + busca semântica
 *
 * ── MEMÓRIA SEMÂNTICA (The Playbook) ──────────────────────────
 * "Quais CTAs converteram mais em SaaS no último trimestre?"
 * Recupera por padrões de performance, independente de cliente
 * Recuperação: por sector + formato + performance (CTR > threshold)
 *
 * ── FALLBACK: In-Memory ─────────────────────────────────────
 * Fallback para ambientes sem MongoDB/ChromaDB
 */
type StoredCampaign = CampaignRecord & { summary: string };
type AudienceInsight = { segment: string; insight: string };

export class MemoryManager {
  private chroma: ChromaClient;
  private mongoClient?: MongoClient;
  private mongo!: Db;

  // Vector DB Collections
  private episodicCollection!: Collection;
  private semanticCollection!: Collection;

  // MongoDB collections
  private readonly EPISODIC_DB = "episodic_campaigns";
  private readonly SEMANTIC_DB = "semantic_playbook";
  private readonly AUDIENCE_DB = "audience";
  private readonly THRESHOLDS = {
    CTR: 0.03, // 3% CTR mínimo para entrar no playbook
    CONVERSION: 0.02, // 2% conversão mínima
  };

  // Fallback in-memory
  private inMemoryCampaigns: StoredCampaign[] = [];
  private inMemoryAudience: AudienceInsight[] = [];
  private initialized = false;
  private initPromise?: Promise<void>;

  constructor() {
    this.chroma = new ChromaClient({ path: process.env.CHROMA_URL });
  }

  async init() {
    if (this.initialized) {
      return;
    }

    if (!this.initPromise) {
      this.initPromise = this.bootstrap();
    }

    await this.initPromise;
  }

  private async bootstrap(): Promise<void> {
    try {
      // MongoDB Connection
      const mongoUrl = process.env.MONGODB_URI ?? "mongodb://localhost:27017/axodus";
      this.mongoClient = new MongoClient(mongoUrl, { serverSelectionTimeoutMS: 1200 });
      await this.mongoClient.connect();
      this.mongo = this.mongoClient.db("axodus");

      // ChromaDB Collections
      this.episodicCollection = await this.chroma.getOrCreateCollection({
        name: "campaigns_episodic",
        metadata: { type: "episodic", description: "Campanhas por cliente e data" },
      });

      this.semanticCollection = await this.chroma.getOrCreateCollection({
        name: "campaigns_semantic",
        metadata: { type: "semantic", description: "Padrões de performance (playbook)" },
      });

      // Create MongoDB indexes
      await this.mongo.collection(this.EPISODIC_DB).createIndex({ client: 1, date: 1 });
      await this.mongo.collection(this.SEMANTIC_DB).createIndex({ sector: 1, ctr: -1 });
      await this.mongo.collection(this.AUDIENCE_DB).createIndex({ segment: 1 });

      console.log("[Memory] ✓ Initialized: episodic + semantic namespaces");
    } catch (err) {
      console.warn("[Memory] MongoDB/ChromaDB unavailable, using in-memory fallback.");
      if (err instanceof Error) {
        console.warn(`[Memory] Reason: ${err.message}`);
      }
    } finally {
      this.initialized = true;
    }
  }

  /**
   * ── EPISÓDICA: Buscar campanhas de um cliente específico ────
   */
  async recallEpisodic(client: string, query: string, n = 3): Promise<CampaignRecord[]> {
    try {
      if (!this.initialized) await this.init();

      const results = await this.episodicCollection.query({
        queryTexts: [query],
        nResults: n,
        where: { client: client }, // Filtro de cliente
      });

      if (!results.documents[0]) return [];

      const docs = await this.mongo
        .collection<CampaignRecord>(this.EPISODIC_DB)
        .find({ client, id: { $in: results.ids[0] } })
        .toArray();

      return docs;
    } catch (err) {
      console.warn("[Memory] Falling back to in-memory episodic recall.");
      return this.inMemoryCampaigns
        .filter(campaign => campaign.sector === client)
        .map(campaign => ({
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
  }

  /**
   * ── EPISÓDICA: Salvar nova campanha ──────────────────────
   */
  async saveEpisodic(record: {
    id: string;
    client: string;
    campaign_name: string;
    hook: string;
    format: string;
    ctr: number;
    conversion: number;
    budget: number;
    timestamp: string;
    summary: string; // texto para embedding
  }): Promise<void> {
    try {
      // ChromaDB (vector embedding)
      await this.episodicCollection.add({
        ids: [record.id],
        documents: [record.summary],
        metadatas: [
          {
            client: record.client,
            hook: record.hook,
            format: record.format,
            date: record.timestamp,
          },
        ],
      });

      // MongoDB (estruturado)
      await this.mongo.collection(this.EPISODIC_DB).insertOne({
        ...record,
        createdAt: new Date(record.timestamp),
      });

      console.log(`[Memory] ✓ Episodic saved: ${record.campaign_name} for ${record.client}`);
    } catch (err) {
      console.warn("[Memory] Falling back to in-memory episodic save.");
      this.inMemoryCampaigns = this.inMemoryCampaigns.filter(item => item.id !== record.id);
      this.inMemoryCampaigns.push({
        ...record,
        summary: record.summary
      });
    }
  }

  /**
   * ── SEMÂNTICA: Buscar padrões de performance (Playbook) ────
   */
  async recallSemantic(
    query: string,
    filters?: { sector?: string; format?: string },
    n = 5
  ): Promise<CampaignRecord[]> {
    try {
      if (!this.initialized) await this.init();

      const where: Record<string, any> = {};
      if (filters?.sector) where.sector = filters.sector;
      if (filters?.format) where.format = filters.format;

      const results = await this.semanticCollection.query({
        queryTexts: [query],
        nResults: n,
        where,
      });

      if (!results.documents[0]) return [];

      const docs = await this.mongo
        .collection<CampaignRecord>(this.SEMANTIC_DB)
        .find({ id: { $in: results.ids[0] } })
        .toArray();

      return docs;
    } catch (err) {
      console.warn("[Memory] Falling back to in-memory semantic recall.");
      return this.inMemoryCampaigns
        .map(campaign => ({
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
  }

  /**
   * ── SEMÂNTICA: Salvar NO PLAYBOOK (só se performance > threshold) ──
   */
  async saveSemantic(record: {
    id: string;
    hook: string;
    format: string;
    sector: string;
    ctr: number;
    conversion: number;
    budget: number;
    timestamp: string;
    summary: string; // para embedding
  }): Promise<boolean> {
    try {
      // Validação de threshold
      const isBelowThreshold = record.ctr < this.THRESHOLDS.CTR;
      if (isBelowThreshold) {
        console.log(
          `[Memory] ⊘ Semantic NOT saved: CTR ${(record.ctr * 100).toFixed(2)}% < threshold ${(this.THRESHOLDS.CTR * 100).toFixed(2)}%`
        );
        return false;
      }

      // ChromaDB (vector embedding)
      await this.semanticCollection.add({
        ids: [record.id],
        documents: [record.summary],
        metadatas: [
          {
            sector: record.sector,
            hook: record.hook,
            format: record.format,
            ctr: record.ctr,
            date: record.timestamp,
          },
        ],
      });

      // MongoDB (estruturado)
      await this.mongo.collection(this.SEMANTIC_DB).insertOne({
        ...record,
        createdAt: new Date(record.timestamp),
      });

      console.log(`[Memory] ✓ Semantic saved: "${record.hook}" (CTR: ${(record.ctr * 100).toFixed(2)}%)`);
      return true;
    } catch (err) {
      console.warn("[Memory] Falling back to in-memory semantic save.");
      this.inMemoryCampaigns = this.inMemoryCampaigns.filter(item => item.id !== record.id);
      this.inMemoryCampaigns.push({
        ...record,
        sector: record.sector, // Usando sector como fallback
        summary: record.summary
      });
      return true;
    }
  }

  /**
   * ── PLAYBOOK: Retorna top performers por sector
   */
  async getPlaybook(sector: string, limit = 5): Promise<
    {
      hook: string;
      ctr: number;
      format: string;
      conversion: number;
    }[]
  > {
    try {
      const docs = await this.mongo
        .collection(this.SEMANTIC_DB)
        .find({ sector })
        .sort({ ctr: -1 })
        .limit(limit)
        .toArray();

      return docs.map((d: any) => ({
        hook: d.hook,
        ctr: d.ctr,
        format: d.format,
        conversion: d.conversion,
      }));
    } catch (err) {
      console.warn("[Memory] Falling back to in-memory playbook.");
      return this.inMemoryCampaigns
        .filter(campaign => campaign.sector === sector)
        .sort((a, b) => b.ctr - a.ctr)
        .slice(0, limit)
        .map(campaign => ({
          hook: campaign.hook,
          ctr: campaign.ctr,
          format: campaign.format,
          conversion: campaign.conversion,
        }));
    }
  }

  /**
   * ── INSIGHTS: Winning hooks globais (top 10 by CTR)
   */
  async getWinningHooks(limit = 10): Promise<string[]> {
    try {
      const docs = await this.mongo
        .collection(this.SEMANTIC_DB)
        .find()
        .sort({ ctr: -1 })
        .limit(limit)
        .toArray();

      return docs.map((d: any) => d.hook);
    } catch (err) {
      console.warn("[Memory] Falling back to in-memory winning hooks.");
      return this.inMemoryCampaigns
        .filter(campaign => campaign.ctr > this.THRESHOLDS.CTR)
        .sort((a, b) => b.ctr - a.ctr)
        .slice(0, limit)
        .map(campaign => campaign.hook);
    }
  }

  /**
   * ── INSIGHTS: Audience insights por segment
   */
  async getAudienceInsights(segment: string): Promise<string[]> {
    try {
      const docs = await this.mongo
        .collection(this.AUDIENCE_DB)
        .find({ segment })
        .toArray();

      return docs.map((d: any) => d.insight ?? `Segment: ${segment}`);
    } catch (err) {
      console.warn("[Memory] Falling back to in-memory audience insights.");
      return this.inMemoryAudience
        .filter(entry => entry.segment === segment)
        .map(entry => entry.insight);
    }
  }

  /**
   * ── FALLBACK: Buscar campanhas similares (usando similaridade local)
   */
  async findSimilarCampaigns(query: string, n = 3): Promise<CampaignRecord[]> {
    try {
      if (!this.initialized) await this.init();

      if (this.episodicCollection) {
        const results = await this.episodicCollection.query({
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
      }
    } catch (err) {
      console.warn("[Memory] Chroma query failed, falling back to local similarity.");
    }

    // Fallback local
    return this.inMemoryCampaigns
      .map(campaign => ({
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

  /**
   * ── FALLBACK: Salvar insights de audiência
   */
  async saveAudienceInsights(segment: string, insights: string[]): Promise<void> {
    try {
      const entries = insights.map(insight => ({ segment, insight }));
      await this.mongo.collection(this.AUDIENCE_DB).insertMany(entries, { ordered: false });
    } catch (err) {
      console.warn("[Memory] Falling back to in-memory audience insights.");
      for (const insight of insights) {
        const exists = this.inMemoryAudience.some(
          item => item.segment === segment && item.insight === insight
        );
        if (!exists) {
          this.inMemoryAudience.push({ segment, insight });
        }
      }
    }
  }

  /**
   * ── STATS: Debug — contar documentos em cada namespace
   */
  async getStats(): Promise<{
    episodic_count: number;
    semantic_count: number;
    top_performing_sector: string | null;
  }> {
    try {
      const episodicCount = await this.mongo.collection(this.EPISODIC_DB).countDocuments();
      const semanticCount = await this.mongo.collection(this.SEMANTIC_DB).countDocuments();

      const topSector = await this.mongo
        .collection(this.SEMANTIC_DB)
        .aggregate([
          { $group: { _id: "$sector", count: { $sum: 1 }, avgCtr: { $avg: "$ctr" } } },
          { $sort: { avgCtr: -1 } },
          { $limit: 1 },
        ])
        .toArray();

      return {
        episodic_count: episodicCount,
        semantic_count: semanticCount,
        top_performing_sector: topSector[0]?._id ?? null,
      };
    } catch (err) {
      console.warn("[Memory] Falling back to in-memory stats.");
      return {
        episodic_count: this.inMemoryCampaigns.length,
        semantic_count: this.inMemoryCampaigns.filter(c => c.ctr >= this.THRESHOLDS.CTR).length,
        top_performing_sector: null,
      };
    }
  }
}

// Singleton export
export const memory = new MemoryManager();
