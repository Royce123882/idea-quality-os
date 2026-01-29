# Product Requirements Document (PRD)

## Product Name
**Idea Quality Operating System (IQOS)**

## One-liner
A one-stop system that helps builders systematically discover real problems, generate constraint-aware ideas, rigorously stress-test them, and decisively kill weak ideas *before* execution.

---

## 1. Problem Statement

On the production side of modern product building—especially in AI—the primary bottleneck is **idea quality**, not execution capacity.

Key failures observed:
- Builders start from solutions rather than real, repeated problems
- Brainstorming generates novelty, not relevance
- Constraints (attention, workflow, incentives, compliance) are considered too late
- Feedback is polite, subjective, and optimistic
- Teams invest heavily before discovering ideas are not worth users’ attention

As AI reduces the cost of building, **poor ideas scale faster than good ones**. There is no unified system that:
- Surfaces high-signal problems
- Forces constraint-first thinking
- Applies adversarial evaluation early
- Explicitly decides what *not* to build

IQOS exists to solve this.

---

## 2. Target Users

### Primary Users
- Founders (0→1, 1→10)
- Product leaders (PMs, Heads of Product)
- AI builders / technical founders
- Innovation teams inside enterprises

### Secondary Users
- VCs and venture studios (idea vetting)
- Accelerators / incubators
- Corporate strategy & transformation teams

---

## 3. Goals & Non-Goals

### Goals
- Dramatically improve average idea quality
- Kill weak ideas *early and cheaply*
- Shift teams from solution-first to problem-first thinking
- Make constraints explicit and unavoidable
- Create a shared language for evaluating ideas

### Non-Goals
- Not a coding tool
- Not a wireframing or prototyping tool
- Not an execution tracker (Jira replacement)
- Not an idea marketplace

---

## 4. Core Product Philosophy

1. **Constraints > Creativity**
2. **Problems > Ideas**
3. **Rejection is a feature**
4. **Hostile evaluation beats polite feedback**
5. **If it can’t kill ideas, it’s not working**

---

## 5. Core Modules (One Integrated System)

### 5.1 Problem Discovery Engine

**Purpose:** Surface real, repeated, high-cost problems before ideation begins.

**Inputs:**
- Support tickets
- Sales calls / CRM notes
- Slack threads
- User interviews
- GitHub issues
- Customer emails

**Capabilities:**
- Cluster recurring pain patterns
- Detect workaround behaviors
- Score problems on:
  - Frequency
  - Intensity
  - Workaround cost
  - Affected roles

**Outputs:**
- Ranked problem landscape
- Problem briefs (who, when, why it hurts)

---

### 5.2 Constraint Locking System

**Purpose:** Prevent unconstrained ideation.

**Constraints enforced:**
- User attention budget (time, frequency, interruption cost)
- Buyer vs user vs approver
- Existing workflows and tools
- Latency, trust, compliance, security
- Non-negotiables (what cannot change)

**Rules:**
- No idea creation allowed before constraints are locked
- Constraints are versioned and visible across the system

---

### 5.3 Constraint-First Ideation Workspace

**Purpose:** Generate ideas that respect reality.

**Features:**
- Idea prompts derived from locked constraints
- Structured idea templates:
  - Problem addressed
  - Constraint fit explanation
  - Replacement clarity (what disappears)
- Idea-to-problem traceability

**Anti-features:**
- No free-form brainstorming canvas
- No infinite idea lists

---

### 5.4 Analogy & Transfer Engine

**Purpose:** Ground ideas in historical and cross-domain precedent.

**Capabilities:**
- Map ideas to structural analogies
- Surface similar past attempts
- Highlight known failure modes
- Explicitly show where the analogy breaks

**Outcome:**
- Reduced naive reinvention
- Clear articulation of what is *actually new*

---

### 5.5 Idea Stress-Testing Simulator

**Purpose:** Apply structured, adversarial evaluation.

**Evaluation Lenses:**
- User: “Why would I care?”
- Buyer: “Why would I pay?”
- Attention: “What do I drop for this?”
- Workflow: “Where does this live?”
- Timing: “Why now?”

**Mechanics:**
- Forced written responses
- No vague answers allowed
- Confidence scoring based on specificity

---

### 5.6 Attention Economics Calculator

**Purpose:** Quantify whether an idea is worth noticing.

**Metrics:**
- Time cost per interaction
- Frequency of interruption
- Cognitive load
- Emotional friction

**Output:**
- Attention cost score
- Value-to-attention ratio

---

### 5.7 Idea Quality Scoring & Kill Switch

**Purpose:** Make explicit build / kill decisions.

**Scoring Dimensions:**
- Problem severity
- Frequency
- Willingness to pay
- Constraint fit
- Attention efficiency
- Replacement clarity

**Decisions:**
- Proceed
- Revise
- Kill

**Kill Logic:**
- Some failures are terminal
- Dead ideas are archived, not deleted

---

## 6. End-to-End User Flow

1. Ingest raw signals
2. Surface and select problems
3. Lock constraints
4. Generate constrained ideas
5. Map analogies
6. Stress-test ideas
7. Calculate attention economics
8. Score idea quality
9. Decide: build, revise, or kill

---

## 7. UX Principles

- No blank canvases
- No infinite scrolling
- Forced specificity
- Clear rejection signals
- Every step narrows options

---

## 8. Success Metrics

### Product Metrics
- % of ideas killed before build
- Time-to-kill vs baseline
- Idea-to-build conversion rate
- Post-build success rate

### User Metrics
- Perceived confidence in ideas
- Reduction in wasted build cycles
- Clarity of problem articulation

---

## 9. Competitive Advantage / Moat

- Constraint-first philosophy
- Integrated end-to-end flow
- Idea graveyard as institutional memory
- High switching cost via accumulated problem intelligence

---

## 10. Risks & Mitigations

**Risk:** Users resist idea rejection
- *Mitigation:* Normalize killing as success

**Risk:** Over-structuring creativity
- *Mitigation:* Constraints channel creativity, not eliminate it

**Risk:** Tool becomes theoretical
- *Mitigation:* Tie every step to explicit decisions

---

## 11. Technical Architecture & Implementation Details

### 11.1 High-Level Architecture

IQOS is built as a modular, service-oriented system with a clear separation between:
- **Frontend (interaction, enforcement, UX)**
- **Backend (logic, scoring, simulations, data processing)**
- **AI services (analysis, clustering, stress testing)**

**Architecture Style:**
- Frontend-driven orchestration
- API-first backend
- Asynchronous, task-based AI workloads

---

### 11.2 Frontend Stack (Next.js)

**Framework:**
- Next.js (App Router)
- TypeScript (strict mode enabled)

**Responsibilities:**
- Enforced user flows (problem → constraints → ideation → evaluation)
- State machines for gated progression
- Visualization of problem landscapes and scores
- Structured input collection (no free-form canvases)

**Key Libraries:**
- React Server Components (where applicable)
- Zustand or Redux Toolkit (global state)
- Zod (schema validation shared with backend)
- Tailwind CSS (UI consistency)
- TanStack Query (API data fetching & caching)

**UX Enforcement Mechanisms:**
- Route-level guards (cannot access ideation before constraints)
- Form schemas that reject vague input
- Explicit “kill” affordances

---

### 11.3 Backend Stack (FastAPI)

**Framework:**
- FastAPI (Python)
- Pydantic v2 for data models

**Responsibilities:**
- Problem clustering & scoring
- Constraint validation
- Idea evaluation logic
- Stress-test simulations
- Attention economics calculations
- Decision logic (proceed / revise / kill)

**API Design:**
- REST-first (JSON)
- Versioned endpoints (/v1/...)
- Explicit domain separation:
  - /problems
  - /constraints
  - /ideas
  - /evaluations
  - /decisions

---

### 11.4 AI & Analysis Layer

**LLM Usage:**
- Problem clustering and summarization
- Analogy detection
- Adversarial stress-test questioning
- Confidence and specificity scoring

**Patterns:**
- Deterministic prompts where possible
- Human-readable intermediate outputs
- Caching of AI results for reproducibility

**Async Processing:**
- Background tasks (FastAPI BackgroundTasks or Celery)
- Long-running evaluations handled asynchronously

---

### 11.5 Data Storage

**Primary Database:**
- PostgreSQL (managed)

**Data Models:**
- Problems
- Constraints (versioned)
- Ideas
- Evaluations
- Scores
- Decisions
- Idea Graveyard (immutable archive)

**Optional Extensions:**
- Vector database (for problem similarity & analogy search)
- Object storage (raw transcripts, documents)

---

### 11.6 Deployment Architecture

#### Frontend Deployment
- **Platform:** Vercel
- **Build:** Next.js build pipeline
- **Environment Variables:** Managed via Vercel dashboard
- **Domains:** Custom domain per environment (dev / staging / prod)

**Benefits:**
- Global edge delivery
- Automatic CI/CD on Git pushes
- Preview deployments for PRs

---

#### Backend Deployment

**Option A: Vercel Serverless Functions (Lightweight)**
- Suitable for low-latency, short-lived API calls
- Limited for heavy AI workloads

**Option B (Recommended): Containerized FastAPI**
- Dockerized FastAPI service
- Deployed on:
  - AWS (ECS / Fargate)
  - GCP Cloud Run
  - Fly.io or similar

**Reasons:**
- Better control over compute
- Async background processing
- Stable long-running tasks

---

### 11.7 Environment Strategy

- **Development:**
  - Local Next.js + local FastAPI
  - Docker Compose for dependencies

- **Staging:**
  - Vercel Preview (frontend)
  - Staging FastAPI service

- **Production:**
  - Vercel Production (frontend)
  - Scaled FastAPI backend

---

### 11.8 Authentication & Security (MVP)

- Auth provider (e.g. Clerk / Auth0 / NextAuth)
- JWT-based auth between frontend and backend
- Role-based access control (individual vs org)

---

### 11.9 Observability & Quality Control

- API logging and tracing
- Prompt + output versioning
- Decision audit logs
- Explicit reproducibility for evaluations

---

## 12. Future Extensions (Out of Scope)

- Linking consumption-side attention data
- Automated GTM experiments
- Investor-facing idea diligence reports
- Multi-agent evaluation systems

---

## 12. Definition of Done

IQOS is successful when:
- Teams trust it to kill ideas
- Fewer ideas get built
- More built ideas survive contact with users
- Idea quality becomes a measurable, improvable system

---

## 13. System Architecture

### 13.1 High-level Architecture
IQOS is a web application with a **Next.js (TypeScript) frontend** deployed on **Vercel**, backed by a **FastAPI** service providing APIs for ingestion, scoring, evaluation workflows, and retrieval.

**Core components:**
- **Web App (Next.js)**: UI, auth callbacks, client-side orchestration of flows
- **API Service (FastAPI)**: business logic, evaluation pipeline, scoring, ingestion jobs
- **Database (Postgres)**: structured entities (workspaces, problems, constraints, ideas, evaluations, decisions)
- **Vector Store (pgvector in Postgres)**: embeddings for problem/idea similarity, clustering, and retrieval
- **Object Storage (S3-compatible)**: raw ingested artifacts (transcripts, tickets exports, PDFs)
- **Queue/Worker (optional but recommended)**: async ingestion + clustering + batch evaluations

### 13.2 Request Flow
1. User interacts via Next.js UI
2. Next.js calls FastAPI endpoints (REST)
3. FastAPI reads/writes Postgres + pgvector, stores artifacts in object storage
4. Long-running tasks (ingestion/clustering/simulations) run async (queue + worker)

### 13.3 Core Service Boundaries
- **Frontend**: presentation + workflow UX (gated steps), no heavy business logic
- **Backend**: source of truth for scoring rules, constraint enforcement, and decision logic

---

## 14. Recommended Tech Stack

### Frontend
- **Next.js (TypeScript)**
- UI: **shadcn/ui** or Chakra/MUI (choose one for speed)
- Forms: React Hook Form + Zod
- Data fetching: TanStack Query (or Next server actions if preferred)
- Auth: NextAuth.js (or Clerk/Auth0)

### Backend
- **FastAPI (Python 3.11+)**
- API: REST (OpenAPI generated)
- Validation: Pydantic v2
- ORM: SQLAlchemy 2.0 (or SQLModel)
- Migrations: Alembic

### Data + Storage
- **Postgres** (primary OLTP)
- **pgvector** (embeddings + similarity search)
- **S3-compatible storage** (AWS S3, Cloudflare R2, or Supabase Storage) for raw files

### Async (for ingestion + clustering)
- Simple start: FastAPI BackgroundTasks
- Production: **Celery + Redis** or **RQ + Redis**
- Alternative: managed queue like AWS SQS

### LLM / Embeddings Provider (pluggable)
- OpenAI / Anthropic / Azure OpenAI (configurable)
- Embeddings: provider embeddings stored in pgvector

### Observability
- Logging: structlog
- Tracing: OpenTelemetry
- Error monitoring: Sentry
- Metrics: Prometheus (if self-managed) or managed APM

---

## 15. Data Model (Core Entities)

### Workspace
- id, name, plan, created_at

### Source
Represents an ingestion source instance (e.g., Zendesk, Intercom, Slack export)
- id, workspace_id, type, config, last_synced_at

### Artifact
Raw ingested unit (ticket, transcript, email, thread)
- id, workspace_id, source_id, type, uri (S3), text_excerpt, metadata, created_at

### Problem
Clustered pain pattern derived from artifacts
- id, workspace_id, title, description, roles_impacted[], frequency_score, intensity_score, workaround_cost_score, confidence, status

### ConstraintSet
Locked constraints that gate ideation
- id, workspace_id, problem_id, attention_budget_seconds, cadence, workflow_systems[], non_negotiables[], compliance_tags[], created_by, version

### Idea
- id, workspace_id, problem_id, constraint_set_id, title, pitch, replacement_statement, wedge, assumptions[], status

### AnalogyMap
- id, idea_id, analogies[], precedents[], failure_modes[], analogy_breaks[]

### Evaluation
Stress-test results per lens
- id, idea_id, lens, prompts, responses, score, rationale, confidence

### AttentionEconomics
- id, idea_id, time_per_interaction_sec, frequency_per_week, cognitive_load_score, emotional_friction_score, ratio_score

### Decision
- id, idea_id, decision (proceed/revise/kill), reasons[], terminal_flags[], decided_by, created_at

### GraveyardEntry
Archived killed ideas for retrieval and learning
- id, idea_id, kill_reasons[], tags[], learnings

---

## 16. API Design (FastAPI)

### Auth / Workspace
- POST /auth/callback (if handling custom auth)
- GET /workspaces
- POST /workspaces

### Ingestion
- POST /sources (create source)
- POST /sources/{id}/sync (trigger sync)
- GET /artifacts?source_id=

### Problem Discovery
- GET /problems (ranked)
- POST /problems/recompute (recluster + rescore)
- GET /problems/{id}

### Constraints
- POST /problems/{id}/constraints (create + lock)
- GET /constraint-sets/{id}
- POST /constraint-sets/{id}/lock

### Ideation
- POST /ideas
- GET /ideas?problem_id=
- GET /ideas/{id}

### Analogy
- POST /ideas/{id}/analogy/run
- GET /ideas/{id}/analogy

### Stress Test
- POST /ideas/{id}/stress-test/run
- GET /ideas/{id}/evaluations

### Attention Economics
- POST /ideas/{id}/attention-economics/calculate
- GET /ideas/{id}/attention-economics

### Scoring + Decision
- POST /ideas/{id}/score
- POST /ideas/{id}/decide
- GET /graveyard

---

## 17. Deployment Plan (Vercel + FastAPI)

### 17.1 Frontend Deployment (Vercel)
- Next.js (TypeScript) deployed on Vercel
- Connected to GitHub (monorepo or web-only repo)
- Automatic preview deployments on PRs
- Environment variables managed in Vercel dashboard
  - NEXT_PUBLIC_API_BASE_URL
  - Auth secrets

### 17.2 Backend Deployment (FastAPI)

FastAPI is deployed as a **containerized service**, not on Vercel, to support:
- Long-running ingestion jobs
- Background workers
- Higher request timeouts
- Predictable performance

**Recommended platforms (choose one):**
- Render (simplest)
- Fly.io (global, scalable)
- Railway (fast iteration)
- AWS ECS/Fargate (enterprise)

**Runtime:**
- Docker container
- Gunicorn + Uvicorn workers

Example command:
`gunicorn -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000`

### 17.3 Database (Postgres)

- **Postgres** is the primary database for all environments
- Managed Postgres recommended for staging/prod:
  - Neon
  - Supabase
  - Render Postgres
  - AWS RDS

**Responsibilities:**
- OLTP data (workspaces, problems, ideas, evaluations, decisions)
- pgvector extension (future): embeddings + similarity search

---

## 18. Local Development Environment (Docker Compose)

### 18.1 Goals
- One-command local setup
- Environment parity with production
- Easy onboarding for contributors

### 18.2 Services

Local development uses **Docker Compose** to orchestrate:
- Next.js frontend
- FastAPI backend
- Postgres database
- Redis (for async/background jobs)

### 18.3 Directory Structure (Recommended)

- /apps/web        (Next.js)
- /apps/api        (FastAPI)
- docker-compose.yml

---

### 18.4 docker-compose.yml (Dev)

```yaml
version: "3.9"

services:
  db:
    image: postgres:16
    container_name: iqos-postgres
    environment:
      POSTGRES_USER: iqos
      POSTGRES_PASSWORD: iqos
      POSTGRES_DB: iqos
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: iqos-redis
    ports:
      - "6379:6379"

  api:
    build: ./apps/api
    container_name: iqos-api
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    environment:
      DATABASE_URL: postgresql+psycopg://iqos:iqos@db:5432/iqos
      REDIS_URL: redis://redis:6379/0
      CORS_ORIGINS: http://localhost:3000
      ENV: dev
    ports:
      - "8000:8000"
    volumes:
      - ./apps/api:/app
    depends_on:
      - db
      - redis

  web:
    build: ./apps/web
    container_name: iqos-web
    command: npm run dev
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://localhost:8000
    ports:
      - "3000:3000"
    volumes:
      - ./apps/web:/app
    depends_on:
      - api

volumes:
  pgdata:
```

---

### 18.5 Backend Dockerfile (FastAPI)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN pip install --no-cache-dir poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-dev

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

### 18.6 Frontend Dockerfile (Next.js)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]
```

---

### 18.7 Environment Parity

| Environment | Web | API | Database |
|------------|-----|-----|----------|
| Dev | Docker | Docker | Docker Postgres |
| Staging | Vercel Preview | Managed Container | Managed Postgres |
| Prod | Vercel | Managed Container | Managed Postgres |

---

## 19. CI/CD


### Monorepo Recommendation
- /apps/web (Next.js)
- /apps/api (FastAPI)

### Pipelines
- Lint + typecheck (TS)
- Backend unit tests (pytest)
- Schema migrations check (Alembic)
- Build Docker image for API on main
- Deploy API to chosen platform
- Vercel auto-deploys web

---

## 19. Security & Compliance

- AuthN/AuthZ: workspace-scoped RBAC (admin/editor/viewer)
- Data isolation by workspace_id in all queries
- Encrypt secrets (provider keys) using KMS/managed secrets
- PII controls:
  - Redaction pipeline during ingestion (optional)
  - Field-level masking in UI
- Audit logs for decisions and constraint locks

---

## 20. Reliability & Observability

- Background jobs are idempotent (safe re-run)
- Retries for provider calls with backoff
- Tracing across UI → API → DB
- Sentry alerts for exceptions
- Evaluation job queue depth monitored

---

## 21. MVP Scope (Strongly Recommended Cutline)

### MVP Must-Have
- Manual ingestion (upload CSV/text + paste transcripts)
- Problem list + problem brief
- Constraint lock + versioning
- Idea template + traceability to problem + constraint set
- Stress-test lenses (user/buyer/attention/workflow/why now)
- Attention economics calculator
- Score + decision (proceed/revise/kill) + graveyard

### Post-MVP
- Automated connectors (Zendesk, Slack, Gong)
- Analogy engine with precedent library
- Full clustering automation + scheduled sync
- Multi-agent evaluators
- Team analytics: kill rate, cycle time, post-build outcomes

---

## 22. Open Questions

- Which ingestion sources matter first for your ICP (support tickets vs sales calls vs GitHub issues)?
- Will you ship with built-in LLM providers, or require user-supplied keys at launch?
- Do you need SOC2 readiness from day one (affects vendor choices)?

---

## 23. Acceptance Criteria (MVP)

- A user can upload 20–50 artifacts and see a ranked problem landscape
- A user cannot create an idea without locking a constraint set
- An idea can be stress-tested across all lenses with stored outputs
- The system produces a final score and a decision with reasons
- Killed ideas are searchable in the graveyard and linked back to the original problem

---

## 24. Definition of Done (Expanded)

IQOS is successful when:
- Teams trust it to kill ideas
- ≥30–60% of ideas are killed *before* prototyping
- Time-to-kill is reduced by >50% vs baseline
- Teams can point to concrete learnings from the graveyard
- The ideas that do get built show higher downstream adoption (proxy: internal or early pilot success)

