const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// ───────────────────────── Types ─────────────────────────

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  created_at: string;
}

export interface Artifact {
  id: string;
  workspace_id: string;
  source_id: string | null;
  type: string;
  uri: string;
  text_excerpt: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Problem {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  roles_impacted: string[];
  frequency_score: number;
  intensity_score: number;
  workaround_cost_score: number;
  confidence: number;
  status: string;
}

export interface ConstraintSet {
  id: string;
  workspace_id: string;
  problem_id: string;
  attention_budget_seconds: number;
  cadence: string;
  workflow_systems: string[];
  non_negotiables: string[];
  compliance_tags: string[];
  created_by: string;
  version: number;
  locked: boolean;
}

export interface Idea {
  id: string;
  workspace_id: string;
  problem_id: string;
  constraint_set_id: string;
  title: string;
  pitch: string;
  replacement_statement: string;
  wedge: string;
  assumptions: string[];
  status: "draft" | "active" | "killed" | "proceeded";
}

export interface Evaluation {
  id: string;
  idea_id: string;
  lens: string;
  prompts: string[];
  responses: string[];
  score: number;
  rationale: string;
  confidence: number;
}

export interface AttentionEconomics {
  id: string;
  idea_id: string;
  time_per_interaction_sec: number;
  frequency_per_week: number;
  cognitive_load_score: number;
  emotional_friction_score: number;
  ratio_score: number;
}

export interface Decision {
  id: string;
  idea_id: string;
  decision: "proceed" | "revise" | "kill";
  reasons: string[];
  terminal_flags: string[];
  decided_by: string;
  created_at: string;
}

export interface GraveyardEntry {
  id: string;
  idea_id: string;
  idea?: Idea;
  problem?: Problem;
  kill_reasons: string[];
  tags: string[];
  learnings: string;
}

export interface IdeaScore {
  problem_severity: number;
  frequency: number;
  willingness_to_pay: number;
  constraint_fit: number;
  attention_efficiency: number;
  replacement_clarity: number;
  composite: number;
}

// ───────────────────────── Fetch helper ─────────────────────────

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ───────────────────────── API methods ─────────────────────────

// Workspaces
export const getWorkspaces = () => request<Workspace[]>("/workspaces");
export const createWorkspace = (data: { name: string }) =>
  request<Workspace>("/workspaces", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Artifacts
export const getArtifacts = (params?: { source_id?: string }) => {
  const q = params?.source_id ? `?source_id=${params.source_id}` : "";
  return request<Artifact[]>(`/artifacts${q}`);
};
export const uploadArtifact = (data: {
  workspace_id: string;
  type: string;
  text_excerpt: string;
  metadata?: Record<string, unknown>;
}) =>
  request<Artifact>("/artifacts", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Problems
export const getProblems = (workspaceId?: string) => {
  const q = workspaceId ? `?workspace_id=${workspaceId}` : "";
  return request<Problem[]>(`/problems${q}`);
};
export const getProblem = (id: string) => request<Problem>(`/problems/${id}`);
export const recomputeProblems = () =>
  request<{ status: string }>("/problems/recompute", { method: "POST" });

// Constraints
export const getConstraints = (problemId: string) =>
  request<ConstraintSet>(`/problems/${problemId}/constraints`);
export const createConstraints = (
  problemId: string,
  data: Omit<
    ConstraintSet,
    "id" | "workspace_id" | "problem_id" | "created_by" | "version" | "locked"
  >
) =>
  request<ConstraintSet>(`/problems/${problemId}/constraints`, {
    method: "POST",
    body: JSON.stringify(data),
  });
export const lockConstraints = (constraintSetId: string) =>
  request<ConstraintSet>(`/constraint-sets/${constraintSetId}/lock`, {
    method: "POST",
  });

// Ideas
export const getIdeas = (params?: { problem_id?: string; workspace_id?: string }) => {
  const sp = new URLSearchParams();
  if (params?.problem_id) sp.set("problem_id", params.problem_id);
  if (params?.workspace_id) sp.set("workspace_id", params.workspace_id);
  const q = sp.toString() ? `?${sp}` : "";
  return request<Idea[]>(`/ideas${q}`);
};
export const getIdea = (id: string) => request<Idea>(`/ideas/${id}`);
export const createIdea = (data: {
  workspace_id: string;
  problem_id: string;
  constraint_set_id: string;
  title: string;
  pitch: string;
  replacement_statement: string;
  wedge: string;
  assumptions: string[];
}) =>
  request<Idea>("/ideas", { method: "POST", body: JSON.stringify(data) });

// Evaluations (Stress Test)
export const getEvaluations = (ideaId: string) =>
  request<Evaluation[]>(`/ideas/${ideaId}/evaluations`);
export const runStressTest = (ideaId: string, data: { lens: string; responses: string[] }) =>
  request<Evaluation>(`/ideas/${ideaId}/stress-test/run`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// Attention Economics
export const getAttentionEconomics = (ideaId: string) =>
  request<AttentionEconomics>(`/ideas/${ideaId}/attention-economics`);
export const calculateAttentionEconomics = (
  ideaId: string,
  data: {
    time_per_interaction_sec: number;
    frequency_per_week: number;
    cognitive_load_score: number;
    emotional_friction_score: number;
  }
) =>
  request<AttentionEconomics>(`/ideas/${ideaId}/attention-economics/calculate`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// Score + Decision
export const getIdeaScore = (ideaId: string) =>
  request<IdeaScore>(`/ideas/${ideaId}/score`);
export const scoreIdea = (ideaId: string) =>
  request<IdeaScore>(`/ideas/${ideaId}/score`, { method: "POST" });
export const decideIdea = (
  ideaId: string,
  data: {
    decision: "proceed" | "revise" | "kill";
    reasons: string[];
    terminal_flags?: string[];
    kill_reasons?: string[];
    learnings?: string;
  }
) =>
  request<Decision>(`/ideas/${ideaId}/decide`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// Graveyard
export const getGraveyard = (params?: { search?: string }) => {
  const q = params?.search ? `?search=${encodeURIComponent(params.search)}` : "";
  return request<GraveyardEntry[]>(`/graveyard${q}`);
};
