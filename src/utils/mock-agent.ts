import { randomUUID } from "crypto";
import {
  AgentRole,
  BrandStrategy,
  CampaignPlan,
  CampaignContext,
  CreativeConcept,
  DeploymentPlan,
  DesignSpec,
  GrowthExperimentPlan,
  MotionSpec,
  TrendInsight,
  UXCreativeSpec,
  ICPProfile,
} from "../types";

interface ValidationSummary {
  ranked_concepts: Array<{
    concept_id: string;
    rank: number;
    validation_score: number;
    rationale: string;
    benchmark_comparison: string;
  }>;
  recommendation: string;
  kill_list: string[];
  confidence: number;
}

interface AudienceProfile {
  segment: string;
  painPoints: string[];
  language: string;
  device: "mobile" | "desktop" | "both";
  platforms: string[];
  timing: string;
  buyingTriggers?: string[];
  objections?: string[];
  confidence?: number;
}

function defaultPainPoint(context: CampaignContext, index = 0): string {
  return context.icp?.painPoints?.[index] ?? context.icp?.pain_points?.[index] ?? "baixa eficiencia operacional";
}

function buildConcepts(context: CampaignContext): CreativeConcept[] {
  const painA = defaultPainPoint(context, 0);
  const painB = defaultPainPoint(context, 1);
  const client = context.brief.client;

  return [
    {
      id: randomUUID(),
      concept_id: randomUUID(),
      title: "Choque de produtividade",
      hook: "Sua equipe ainda faz no manual o que a IA resolve hoje?",
      narrative: `${client} entra como o atalho entre um time sobrecarregado e uma rotina previsivel. O conceito mostra o antes e depois de um gestor que troca operacao repetitiva por decisao estrategica em poucos dias.`,
      emotion: "urgencia",
      format: "video_30s",
      viralScore: 8.8,
      viral_score: 8.8,
      viral_rationale: "Apelo direto a perda de tempo e ganho imediato de performance.",
      target_pain: painA,
      temperature_used: 0.7,
    },
    {
      id: randomUUID(),
      concept_id: randomUUID(),
      title: "Anti-caos do marketing",
      hook: "Se cada campanha parece improviso, o problema nao e sua equipe.",
      narrative: `Mostra o caos operacional como um sintoma de processo quebrado e posiciona ${client} como o sistema que organiza execucao, analise e escala sem aumentar headcount.`,
      emotion: "alivio",
      format: "carrossel",
      viralScore: 8.1,
      viral_score: 8.1,
      viral_rationale: "Boa aderencia para mid-market que sente desorganizacao recorrente.",
      target_pain: painB,
      temperature_used: 0.7,
    },
    {
      id: randomUUID(),
      concept_id: randomUUID(),
      title: "Benchmark do atraso",
      hook: "Enquanto voce aprova uma campanha, o concorrente ja testou 12 variacoes.",
      narrative: "Um conceito mais competitivo, baseado em comparacao de velocidade. A narrativa explora o custo invisivel da demora e cria tensao de mercado para mover o decisor.",
      emotion: "pressao competitiva",
      format: "ugc",
      viralScore: 7.9,
      viral_score: 7.9,
      viral_rationale: "Forte para decisores com medo de ficar para tras.",
      target_pain: painA,
      temperature_used: 0.9,
    },
    {
      id: randomUUID(),
      concept_id: randomUUID(),
      title: "Prova em 30 dias",
      hook: "100 trials em 30 dias nao comeca com mais budget.",
      narrative: "A campanha parte de meta, nao de feature. O foco e mostrar um plano objetivo de aquisicao com criacao, teste e feedback continuo, reduzindo a sensacao de aposta cega.",
      emotion: "confianca",
      format: "static",
      viralScore: 7.4,
      viral_score: 7.4,
      viral_rationale: "Menos viral, mas forte para captacao de demanda qualificada.",
      target_pain: "pressao por previsibilidade de pipeline",
      temperature_used: 0.5,
    },
  ];
}

function buildValidation(context: CampaignContext): ValidationSummary {
  const concepts = [...(context.concepts ?? [])].sort((a, b) => (b.viralScore || 0) - (a.viralScore || 0));
  const ranked_concepts = concepts.map((concept, index) => ({
    concept_id: concept.concept_id ?? concept.id,
    rank: index + 1,
    validation_score: Number((9 - index * 0.6).toFixed(1)),
    rationale:
      index === 0
        ? "Melhor equilibrio entre tensao inicial, clareza de dor e aderencia ao ICP."
        : "Mantem potencial competitivo, mas perde forca relativa em prova e interrupcao de scroll.",
    benchmark_comparison:
      index === 0
        ? "Acima do benchmark das campanhas SaaS B2B com hooks de ganho de tempo."
        : "Abaixo do conceito lider em potencial de interrupcao.",
  }));

  return {
    ranked_concepts,
    recommendation: ranked_concepts[0]?.concept_id
      ? `${ranked_concepts[0].concept_id} combina maior potencial de CTR com alta aderencia ao ICP.`
      : "Sem conceitos para validar.",
    kill_list: ranked_concepts
      .slice(2)
      .map((item) => `${item.concept_id}: menor potencial relativo nesta rodada.`),
    confidence: 0.72,
  };
}

function buildTrends(context: CampaignContext): TrendInsight[] {
  const platforms = context.icp?.platforms?.join(", ") || "LinkedIn, Instagram";
  const segment = context.icp?.segment || "times de marketing B2B";

  return [
    {
      trend_id: randomUUID(),
      name: "Proof-led education content",
      description:
        "Conteudos que combinam aprendizado rapido com prova visual de resultado estao convertendo melhor em audiencias que desconfiam de promessas amplas.",
      relevance_score: 9,
      relevance_rationale:
        `O segmento ${segment} responde melhor quando ve transformacao concreta e aplicavel nas plataformas ${platforms}.`,
      opportunity:
        "Mostrar antes/depois, portfolio de alunos ou ganhos praticos nas primeiras pecas da campanha.",
      risk: "Se a prova parecer fabricada, a campanha perde credibilidade rapidamente.",
      expected_timeline: "Agora e pelos proximos 3 meses",
    },
    {
      trend_id: randomUUID(),
      name: "Community-first trust loops",
      description:
        "Comunidades nichadas e recomendacao entre pares ganharam peso como mecanismo de validacao antes da compra.",
      relevance_score: 8,
      relevance_rationale:
        "A audiencia esta buscando reducao de risco e prefere sinais de confianca vindos de pares, nao apenas da marca.",
      opportunity:
        "Usar depoimentos de comunidade, bastidores e convites para micro-comunidades como ponte para conversao.",
      risk: "Ativacoes superficiais de comunidade soam oportunistas e reduzem engajamento.",
      expected_timeline: "Em alta no trimestre atual",
    },
    {
      trend_id: randomUUID(),
      name: "Short-form expertise packaging",
      description:
        "Conteudos curtos que condensam know-how tecnico em formatos replicaveis estao vencendo disputas de atencao e gerando mais shares.",
      relevance_score: 7,
      relevance_rationale:
        "O problema envolve provar competencia com rapidez, e formatos curtos ajudam a mostrar valor antes do clique.",
      opportunity:
        "Transformar argumentos complexos em series curtas com hooks concretos e CTA de aprofundamento.",
      risk: "Simplificar demais pode reduzir a percepcao de profundidade tecnica.",
      expected_timeline: "Pico imediato com alta saturacao em 2-4 meses",
    },
  ];
}

export function generateMockAgentPayload(
  role: AgentRole,
  context: CampaignContext
): Record<string, unknown> {
  switch (role) {
    case "BriefInterpreter":
      return {
        core_problem:
          "O cliente precisa transformar interesse em trials sem depender de operacao manual lenta ou narrativa vaga sobre IA.",
        target_audience_id: randomUUID(),
        measurable_goal: {
          metric: "trials",
          target: context.brief.goal === "conversion" ? "100" : "crescimento consistente",
          timeframe: context.brief.deadline ?? "30 dias",
        },
        brand_voice_constraints: [
          "direto e orientado a performance",
          "prova concreta acima de discurso aspiracional",
        ],
        hidden_insights: [
          "A mensagem precisa vender clareza operacional, nao apenas tecnologia.",
          "O ticket mensal exige prova rapida de ROI para reduzir friccao de teste.",
        ],
        confidence: 0.73,
      };
    case "AudienceProfiler": {
      const audience: ICPProfile = {
        audience_id: randomUUID(),
        segment: "Gestores de marketing em empresas B2B de 50-500 funcionarios",
        pain_points: [
          "Campanhas lentas para sair do papel",
          "Falta de previsibilidade de trials",
          "Excesso de retrabalho operacional",
        ],
        language: "Objetivo, orientado a ROI, velocity, CAC, pipeline e execucao.",
        language_profile: "Direto, analitico e impaciente com jargao vazio.",
        device: "both",
        platforms: context.brief.channels ?? ["LinkedIn", "Meta Ads"],
        timing: "Horario comercial e inicio da noite, quando revisam performance e backlog.",
        buying_triggers: [
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
    case "TrendAnalyst": {
      const trends = buildTrends(context);
      return {
        trends,
        primary_trend: trends[0]?.name ?? "Proof-led education content",
        killer_combo:
          "Combinar prova concreta de resultado com comunidade de pares para reduzir risco percebido e acelerar decisao.",
        warnings: [
          "Evitar trendjacking vazio sem ligacao direta com resultado real.",
          "Nao depender apenas de formatos curtos sem camada de prova ou aprofundamento.",
        ],
        confidence: 0.76,
      };
    }
    case "BrandStrategist": {
      const strategy: BrandStrategy = {
        brand_positioning_statement:
          "Axodus e o sistema de campanha para times de marketing que precisam transformar estrategia em execucao veloz sem perder controle.",
        value_proposition:
          "A marca promete reduzir o caos operacional e acelerar aprendizado de campanha com um fluxo unico de criacao, validacao e iteracao.",
        differentiators: [
          "Integra estrategia, criacao e feedback em um mesmo loop operacional.",
          "Traduz prova de performance em decisao criativa, nao apenas em relatorio.",
          "Ajuda equipes enxutas a escalar sem aumentar retrabalho manual.",
        ],
        messaging_pillars: [
          "Velocidade com criterio",
          "Clareza operacional em vez de complexidade",
          "Prova concreta de ROI e aprendizado continuo",
        ],
        proof_points: [
          "Hooks e narrativas orientados por memoria de campanhas anteriores.",
          "Validacao de conceitos antes da producao para reduzir desperdicio criativo.",
          "Feedback loop que transforma performance em nova vantagem competitiva.",
        ],
        recommended_cta_angle:
          "Convide o ICP a ver como reduzir gargalos e ganhar previsibilidade ja na proxima campanha.",
        confidence: 0.74,
      };
      return strategy as unknown as Record<string, unknown>;
    }
    case "CampaignPlanner": {
      const plan: CampaignPlan = {
        channel_plan: [
          {
            channel: "LinkedIn",
            objective: "Capturar demanda qualificada",
            budget_allocation_pct: 45,
            primary_message: "Clareza operacional e previsibilidade de pipeline",
          },
          {
            channel: "Meta Ads",
            objective: "Escalar alcance e retargeting",
            budget_allocation_pct: 35,
            primary_message: "Ganhe velocidade sem aumentar retrabalho",
          },
          {
            channel: "Google",
            objective: "Converter demanda ativa",
            budget_allocation_pct: 20,
            primary_message: "Automacao com prova concreta de resultado",
          },
        ],
        timeline: [
          "Semana 1: preparar criativos, tracking e setup de contas",
          "Semana 2: lancar campanhas por canal prioritario",
          "Semana 3: revisar sinais iniciais e ajustar verbas",
        ],
        launch_sequence: [
          "Lancar LinkedIn com angulo de dor principal",
          "Ativar Meta para ampliacao de alcance e retargeting",
          "Abrir Google Search com termos de alta intencao",
        ],
        success_metrics: ["CTR por canal", "Trials iniciados", "Custo por trial qualificado"],
        risks: [
          "Diluir budget em muitos canais cedo demais",
          "Subir mensagem sem prova suficiente para reduzir friccao",
        ],
        confidence: 0.75,
      };
      return plan as unknown as Record<string, unknown>;
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
        body_text:
          "Sua equipe nao precisa de mais dashboards. Precisa de um sistema que transforme briefing em campanha com velocidade, consistencia e feedback real. Axodus organiza o caos, acelera o ciclo criativo e aproxima sua meta de trials da operacao do dia a dia.\n\nSe voce precisa gerar demanda sem expandir time, este e o tipo de infraestrutura que reduz retrabalho e coloca teste, copy e iteracao no mesmo fluxo.",
        cta: "Comece seu trial",
        video_script: {
          hook: concept?.hook ?? "Sua equipe ainda faz no manual o que a IA resolve hoje?",
          body:
            "Enquanto o backlog cresce, aprovacoes lentas e tarefas repetitivas derrubam a velocidade de campanha.",
          objection_handler:
            "Sem mais uma ferramenta para complicar a operacao: o foco e reduzir atrito e provar resultado cedo.",
          cta: "Teste agora e veja sua operacao ganhar ritmo em dias.",
        },
        social_caption:
          "Se o seu marketing depende de apagar incendio toda semana, talvez o problema nao seja talento. Talvez seja sistema. Axodus transforma execucao lenta em maquina de iteracao.",
        ad_variants: [
          "Troque retrabalho por campanhas que aprendem rapido.",
          "Mais testes, menos gargalo operacional.",
          "A meta de trials nao espera seu time destravar sozinho.",
        ],
        confidence: 0.71,
      };
    }
    case "VisualDesigner": {
      const design: DesignSpec = {
        creative_direction:
          "Visual limpo, orientado a comparacao de antes/depois e prova de velocidade operacional.",
        visual_system: {
          palette: ["#0F172A", "#F97316", "#E2E8F0"],
          typography: ["JetBrains Mono", "Inter Tight"],
          imagery_style: "Interface real misturada com highlights de ganho e comparacoes diretas.",
          composition_rules: [
            "Abrir cada peca com contraste forte entre caos e clareza",
            "Dar protagonismo a numeros e provas acima de decoracao",
          ],
        },
        asset_blueprints: [
          {
            asset_type: "carrossel",
            purpose: "Educar e mover o ICP para considerar o trial",
            layout_notes: "Slide 1 com dor, slide 2-4 com prova e slide final com CTA.",
          },
          {
            asset_type: "video_30s",
            purpose: "Interromper scroll com comparacao de velocidade",
            layout_notes: "Primeiros 3s com hook visual, depois interface e prova objetiva.",
          },
        ],
        production_notes: [
          "Usar anotacoes e overlays para destacar economia de tempo.",
          "Evitar visual genérico de IA futurista sem relacao com o produto.",
        ],
        confidence: 0.73,
      };
      return design as unknown as Record<string, unknown>;
    }
    case "MotionDesigner": {
      const motion: MotionSpec = {
        motion_direction:
          "Animacao objetiva com primeiros 2 segundos de alto contraste, reforcando ganho de clareza e velocidade.",
        scene_beats: [
          {
            timestamp: "0-2s",
            visual: "Tela dividida entre caos e dashboard organizado",
            animation: "Push-in rapido com highlights nos gargalos",
            objective: "Parar o scroll e mostrar contraste",
          },
          {
            timestamp: "2-8s",
            visual: "Interface com anotacoes e ganhos de tempo",
            animation: "Callouts em sequencia e transicoes secas",
            objective: "Provar valor com leitura rapida",
          },
          {
            timestamp: "8-15s",
            visual: "CTA e reforco do beneficio principal",
            animation: "Zoom leve com fechamento em marca e CTA",
            objective: "Encaminhar para acao",
          },
        ],
        transitions: [
          "Hard cuts com overlays de numero",
          "Wipes horizontais curtos entre comparacoes",
        ],
        audio_direction: "Base ritmada, moderna e precisa, com acentos nos momentos de prova.",
        delivery_notes: [
          "Evitar motion decorativo sem funcao de leitura.",
          "Manter textos na tela com permanencia suficiente para mobile.",
        ],
        confidence: 0.72,
      };
      return motion as unknown as Record<string, unknown>;
    }
    case "UXCreative": {
      const uxPlan: UXCreativeSpec = {
        journey_goal:
          "Levar o visitante da dor operacional para a percepcao de clareza e decisao de iniciar trial com minima friccao.",
        page_blueprint: [
          {
            section: "Hero",
            objective: "Deixar a promessa clara nos primeiros segundos",
            primary_element: "Headline com prova e CTA principal",
            interaction_note: "CTA visivel above the fold em mobile e desktop",
          },
          {
            section: "Proof",
            objective: "Sustentar a promessa com evidencia",
            primary_element: "Antes/depois, numeros e prova social",
            interaction_note: "Cards curtos e escaneaveis com hierarquia forte",
          },
          {
            section: "Offer",
            objective: "Remover duvida e facilitar a decisao",
            primary_element: "Resumo do trial e CTA final",
            interaction_note: "Formulario curto e reforco de baixo risco",
          },
        ],
        interaction_principles: [
          "Clareza acima de densidade de informacao",
          "Prova e CTA sempre proximos um do outro",
        ],
        conversion_friction: [
          "Excesso de explicacao tecnica antes de mostrar beneficio",
          "Formulario inicial grande demais para trafego frio",
        ],
        experiment_hooks: [
          "Hero com comparacao antes/depois",
          "CTA com angulo de previsibilidade de trials",
        ],
        confidence: 0.73,
      };
      return uxPlan as unknown as Record<string, unknown>;
    }
    case "AdsSpecialist": {
      const deployment: DeploymentPlan = {
        platforms: [
          {
            platform: "Meta Ads",
            campaign_objective: "Leads",
            targeting_summary: "Retargeting e lookalikes de visitantes qualificados",
            budget: Math.round((context.brief.budget ?? 0) * 0.55),
            launch_checklist: [
              "Validar pixel e eventos de trial",
              "Confirmar naming convention e UTMs",
            ],
          },
          {
            platform: "Google Ads",
            campaign_objective: "Search conversions",
            targeting_summary: "Termos de alta intencao ligados a automacao e campanhas",
            budget: Math.round((context.brief.budget ?? 0) * 0.45),
            launch_checklist: [
              "Separar ad groups por intencao",
              "Definir negative keywords basicas",
            ],
          },
        ],
        approval_required: true,
        rollout_strategy:
          "Subir primeiro os conjuntos de maior intencao, validar tracking e so depois expandir volume.",
        monitoring_plan: [
          "Checar CTR, CPC e qualidade do trafego nas primeiras 24h",
          "Revisar custo por trial e distribuicao de verba no dia 3",
        ],
        confidence: 0.74,
      };
      return deployment as unknown as Record<string, unknown>;
    }
    case "GrowthHacker": {
      const growthPlan: GrowthExperimentPlan = {
        experiments: [
          {
            name: "Teste de prova visual no primeiro frame",
            hypothesis: "Mostrar comparacao antes/depois aumenta CTR e reduz bounce",
            metric: "CTR",
            expected_impact: "+10-20% em CTR",
            effort: "low",
          },
          {
            name: "Segmentacao por dor principal",
            hypothesis: "Separar criativos por dor dominante melhora aderencia e conversao",
            metric: "Conversion rate",
            expected_impact: "+8-15% em conversao",
            effort: "medium",
          },
        ],
        prioritization_rationale:
          "Os experimentos priorizam alto impacto com baixo custo de implementacao nas primeiras iteracoes.",
        next_optimization_window: "72 horas apos o lancamento inicial",
        confidence: 0.72,
      };
      return growthPlan as unknown as Record<string, unknown>;
    }
    case "AnalyticsAgent": {
      const ctr = context.metrics?.ctr ?? 0;
      const shouldScale = ctr >= 0.03;
      return {
        performance_summary: shouldScale
          ? "A campanha mostrou tracao inicial positiva e sinais suficientes para ampliar investimento controlado."
          : "A campanha entregou sinais fracos e precisa de revisao criativa antes de escalar.",
        winner_hook: shouldScale ? context.selectedConcept?.hook ?? null : null,
        loser_hooks: shouldScale ? [] : context.concepts?.slice(1).map((concept) => concept.hook) ?? [],
        audience_insights: [
          "Hooks com ganho de tempo performam melhor quando conectados a um resultado de pipeline.",
          "Promessas amplas de IA pedem prova concreta para manter confianca no clique.",
        ],
        next_iteration_recommendations: shouldScale
          ? [
              "Criar 3 novas variacoes com a mesma tese de produtividade.",
              "Testar prova visual de antes e depois no primeiro frame.",
            ]
          : [
              "Reformular hook principal com prova mais concreta.",
              "Ajustar oferta para reduzir friccao inicial do trial.",
            ],
        shouldScale,
        should_scale: shouldScale,
        should_kill: !shouldScale,
        confidence: 0.68,
      };
    }
    default:
      return {
        confidence: 0.5,
      };
  }
}
