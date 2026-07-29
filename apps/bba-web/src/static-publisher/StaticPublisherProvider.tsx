import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { demoProjects, projectScenarios } from "./fixtures/projects.js";
import { publisherProjectReducer } from "./state-machine.js";
import type { PublisherDraft, PublisherProjectEvent, PublisherProjectView } from "./models.js";

interface StoreState { projects: readonly PublisherProjectView[]; listError: boolean; }
type StoreAction = { type: "CREATE"; project: PublisherProjectView } | { type: "EVENT"; projectId: string; event: PublisherProjectEvent } | { type: "LIST_ERROR"; value: boolean };
function normalizeProjectEvent(project: PublisherProjectView, event: PublisherProjectEvent): PublisherProjectEvent {
  if (event.type === "PACKAGE_REJECTED" && project.visibleStage === "CORE_APPROVAL") {
    return { type: "EDITORIAL_CORE_REJECTED", rationale: event.rationale };
  }
  return event;
}
function storeReducer(state: StoreState, action: StoreAction): StoreState { if (action.type === "CREATE") return { ...state, projects: [action.project, ...state.projects] }; if (action.type === "LIST_ERROR") return { ...state, listError: action.value }; return { ...state, projects: state.projects.map((project) => project.projectId === action.projectId ? publisherProjectReducer(project, normalizeProjectEvent(project, action.event)) : project) }; }
interface Store { readonly projects: readonly PublisherProjectView[]; readonly listError: boolean; create(draft: PublisherDraft): string; dispatch(projectId: string, event: PublisherProjectEvent): void; retryList(): void; resolve(projectId: string, scenario?: string | null): PublisherProjectView | undefined; }
const Context = createContext<Store | null>(null);
function split(value: string) { return value.split("\n").map((item) => item.trim()).filter(Boolean); }
export function StaticPublisherProvider({ children }: { readonly children: ReactNode }) { const [state, dispatch] = useReducer(storeReducer, { projects: demoProjects, listError: false }); const value = useMemo<Store>(() => ({ projects: state.projects, listError: state.listError, create(draft) { const projectId = `project-${crypto.randomUUID()}`; const template = projectScenarios["new-project"]; const project: PublisherProjectView = { ...template, projectId, title: draft.title, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), executionMode: draft.executionMode, editorialContext: { version: 1, summary: draft.communicationNeed, objective: draft.objective, expectedOutcome: draft.expectedOutcome, audience: draft.audience, centralMessage: draft.centralMessage, tone: draft.tone, language: draft.language, ...(draft.callToAction.trim() ? { callToAction: draft.callToAction.trim() } : {}), textualMaterials: split(draft.textualMaterials), urls: split(draft.urls), files: draft.fileName.trim() ? [{ name: draft.fileName, type: draft.fileType, size: draft.fileSize, description: draft.fileDescription }] : [], requiredFacts: split(draft.requiredFacts), requiredTerms: split(draft.requiredTerms), prohibitedClaims: split(draft.prohibitedClaims), limitations: split(draft.limitations), notes: draft.notes, channels: draft.channels } }; dispatch({ type: "CREATE", project }); return projectId; }, dispatch(projectId, event) { dispatch({ type: "EVENT", projectId, event }); }, retryList() { dispatch({ type: "LIST_ERROR", value: false }); }, resolve(projectId, scenario) { if (scenario && scenario in projectScenarios) return projectScenarios[scenario as keyof typeof projectScenarios]; return state.projects.find((project) => project.projectId === projectId); } }), [state]); return <Context.Provider value={value}>{children}</Context.Provider>; }
export function useStaticPublisher() { const value = useContext(Context); if (!value) throw new Error("useStaticPublisher must be used inside StaticPublisherProvider"); return value; }
export function useCreateStaticProject() { const store = useStaticPublisher(); const navigate = useNavigate(); return (draft: PublisherDraft) => { const id = store.create(draft); navigate(`/projects/${id}/context`); }; }
