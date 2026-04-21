import { randomUUID } from "crypto";
import {
  AgentRole,
  AudienceProfile,
  CampaignContext,
  CreativeConcept,
  ValidationSummary,
} from "../types";

function defaultPainPoint(context: CampaignContext, index = 0): string {
  return context.icp?.painPoints[index] ?? "baixa eficiencia operacional";
}

function buildConcepts(context: CampaignContext): CreativeConcept[] {
  const painA = defaultPainPoint(context, 0);
  const painB = defaultPainPoint(context, 1);
  const client = context.brief.client;

  return [
    {
      id: randomUUID(),
      title: "Choque de produtividade",
      hook: "Sua equipe ainda faz no manual o que a IA resolve hoje?",
      narrative: `${client} entra como o atalho entre um time sobrecarregado e uma rotina previsivel. O conceito mostra o antes e depois de um gestor que troca operacao repetitiva por decisao estrategica em poucos dias.`,
      emotion: "urgencia",
      format: "video_30s",
      viralScore: 8.8,
      viralRationale: "Apelo direto a perda de tempo e ganho imediato de performance.",
      targetPain: painA,
    },
    {
      id: randomUUID(),
      title: "Anti-caos do marketing",
      hook: "Se cada campanha parece improviso, o problema nao e sua equipe.",
      narrative: `Mostra o caos operacional como um sintoma de processo quebrado e posiciona ${client} como o sistema que organiza execucao, analise e escala sem aumentar headcount.`,
      emotion: "alivio",
      format: "carrossel",
      viralScore: 8.1,
      viralRationale: "Boa aderencia para mid-market que sente desorganizacao recorrente.",
      targetPain: painB,
    },
    {
      id: randomUUID(),
      title: "Benchmark do atraso",
      hook: "Enquanto voce aprova uma campanha, o concorrente ja testou 12 variacoes.",
      narrative: "Um conceito mais competitivo, baseado em comparacao de velocidade. A narrativa explora o custo invisivel da demora e cria tensao de mercado para mover o decisor.",
      emotion: "pressao competitiva",
      format: "ugc",
      viralScore: 7.9,
      viralRationale: "Forte para decisores com medo de ficar para tras.",
      targetPain: painA,
    },
    {
      id: randomUUID(),
      title: "Prova em 30 dias",
      hook: "100 trials em 30 dias nao comeca com mais budget.",
      narrative: "A campanha parte de meta, nao de feature. O foco e mostrar um plano objetivo de aquisicao com criacao, teste e feedback continuo, reduzindo a sensacao de aposta cega.",
      emotion: "confianca",
      format: "static",
      viralScore: 7.4,
      viralRationale: "Menos viral, mas forte para captacao de demanda qualificada.",
      targetPain: "pressao por previsibilidade de pipeline",
    },
  ];
}

function buildValidation(context: CampaignContext): ValidationSummary {
  const concepts = [...(context.concepts ?? [])].sort((a, b) => b.viralScore - a.viralScore);
  const rankedConcepts = concepts.map((concept, index) => ({
    conceptId: concept.title,
    rank: index + 1,
    predictedCTR: index === 0 ? "3.8%-5.1%" : index === 1 ? "3.1%-4.0%" : "2.2%-3.4%",
    icpAdherence: Math.max(7, 10 - index),
    viralPotential: Math.round(concept.viralScore),
    benchmarkComparison:
      index === 0
        ? "Acima do benchmark das campanhas SaaS B2B com hooks de ganho de tempo."
        : "Competitivo, mas com menos potencial de interrupcao de scroll que o lider.",
    risks:
      index === 0
        ? ["Pode soar generico sem prova visual de antes/depois."]
        : ["Precisa de oferta clara para nao virar apenas awareness."],
    validationScore: Number((9 - index * 0.6).toFixed(1)),
  }));

  return {
    rankedConcepts,
    recommendation: rankedConcepts[0]?.conceptId
      ? `${rankedConcepts[0].conceptId} combina maior potencial de CTR com alta aderencia ao ICP.`
      : "Sem conceitos para validar.",
    killList: rankedConcepts.slice(2).map((item) => `${item.conceptId}: menor potencial relativo nesta rodada.`),
    confidence: 0.72,
  };
}

export function generateMockAgentPayload(
  role: AgentRole,
  context: CampaignContext
): Record<string, unknown> {
  switch (role) {
    case "BriefInterpreter":
      return {
        realProblem:
          "O cliente precisa transformar interesse em trials sem depender de operacao manual lenta ou narrativa vaga sobre IA.",
        measurableGoal: {
          metric: "trials",
          target: context.brief.goal === "conversion" ? "100" : "crescimento consistente",
          timeframe: context.brief.deadline ?? "30 dias",
        },
        constraints: {
          budget: context.brief.budget ?? null,
          channels: context.brief.channels ?? [],
          tone: "direto, confiante e orientado a performance",
          deadline: context.brief.deadline ?? null,
        },
        hiddenInsights: [
          "A mensagem precisa vender clareza operacional, nao apenas tecnologia.",
          "O ticket mensal exige prova rapida de ROI para reduzir friccao de teste.",
        ],
        confidence: 0.73,
        nextSteps: ["Definir ICP prioritario", "Gerar conceitos com foco em ganho de tempo"],
      };
    case "AudienceProfiler": {
      const audience: AudienceProfile = {
        segment: "Gestores de marketing em empresas B2B de 50-500 funcionarios",
        painPoints: [
          "Campanhas lentas para sair do papel",
          "Falta de previsibilidade de trials",
          "Excesso de retrabalho operacional",
        ],
        language: "Objetivo, orientado a ROI, velocity, CAC, pipeline e execucao.",
        device: "both",
        platforms: context.brief.channels ?? ["LinkedIn", "Meta Ads"],
        timing: "Horario comercial e inicio da noite, quando revisam performance e backlog.",
        buyingTriggers: [
          "Necessidade de bater meta trimestral",
          "Pressao para fazer mais sem contratar",
          "Cansaco com ferramentas que prometem IA sem impacto real",
        ],
        objections: [
          "Receio de implementacao lenta",
          "Desconfianca sobre qualidade da automacao",
          "Duvida se o time realmente vai usar",
        ],
        confidence: 0.69,
      };
      return audience as unknown as Record<string, unknown>;
    }
    case "CreativeDirector":
      return {
        concepts: buildConcepts(context),
        recommendation:
          "Eu escolheria Choque de produtividade porque combina dor latente, tensao imediata e promessa concreta.",
        confidence: 0.74,
      };
    case "DataAnalyst":
      return buildValidation(context) as unknown as Record<string, unknown>;
    case "Copywriter": {
      const concept = context.selectedConcept;
      return {
        headline: concept?.hook ?? "Menos operacao. Mais campanha que converte.",
        subheadline:
          "Automatize execucao, teste e aprendizado sem perder controle da estrategia.",
        bodyText:
          "Sua equipe nao precisa de mais dashboards. Precisa de um sistema que transforme briefing em campanha com velocidade, consistencia e feedback real. Axodus organiza o caos, acelera o ciclo criativo e aproxima sua meta de trials da operacao do dia a dia.\n\nSe voce precisa gerar demanda sem expandir time, este e o tipo de infraestrutura que reduz retrabalho e coloca teste, copy e iteracao no mesmo fluxo.",
        cta: "Comece seu trial",
        videoScript: {
          hook: concept?.hook ?? "Sua equipe ainda faz no manual o que a IA resolve hoje?",
          problem:
            "Enquanto o backlog cresce, aprovacoes lentas e tarefas repetitivas derrubam a velocidade de campanha.",
          solution:
            "Com Axodus, voce interpreta o briefing, cria variacoes e aprende com a performance em um unico fluxo.",
          cta: "Teste agora e veja sua operacao ganhar ritmo em dias.",
        },
        socialCaption:
          "Se o seu marketing depende de apagar incendio toda semana, talvez o problema nao seja talento. Talvez seja sistema. Axodus transforma execucao lenta em maquina de iteracao.",
        adVariants: [
          "Troque retrabalho por campanhas que aprendem rapido.",
          "Mais testes, menos gargalo operacional.",
          "A meta de trials nao espera seu time destravar sozinho.",
        ],
        confidence: 0.71,
      };
    }
    case "AnalyticsAgent": {
      const ctr = context.metrics?.ctr ?? 0;
      const shouldScale = ctr >= 0.03;
      return {
        performanceSummary: shouldScale
          ? "A campanha mostrou tracao inicial positiva e sinais suficientes para ampliar investimento controlado."
          : "A campanha entregou sinais fracos e precisa de revisao criativa antes de escalar.",
        winnerHook: shouldScale ? context.selectedConcept?.hook ?? null : null,
        loserHooks: shouldScale ? [] : context.concepts?.slice(1).map((concept) => concept.hook) ?? [],
        audienceInsights: [
          "Hooks com ganho de tempo performam melhor quando conectados a um resultado de pipeline.",
          "Promessas amplas de IA pedem prova concreta para manter confianca no clique.",
        ],
        nextIterationRecommendations: shouldScale
          ? [
              "Criar 3 novas variacoes com a mesma tese de produtividade.",
              "Testar prova visual de antes e depois no primeiro frame.",
            ]
          : [
              "Reformular hook principal com prova mais concreta.",
              "Ajustar oferta para reduzir friccao inicial do trial.",
            ],
        shouldScale,
        shouldKill: !shouldScale,
        confidence: 0.68,
      };
    }
    default:
      return {
        confidence: 0.5,
      };
  }
}
