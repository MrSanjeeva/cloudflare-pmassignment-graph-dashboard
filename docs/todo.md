# Project Todo List

This document outlines the step-by-step implementation plan for the **Cloudflare Live Graph Dashboard**, derived from the [PRD](./prd.md), [Design Doc](./design_doc.md), and [Tech Stack](./tech_stack.md).

## Phase 1: Project Setup & Configuration (Tech Stack)
- [x] **Initialize Project**
    - [x] Run `npm create cloudflare@latest` (React + Vite).
    - [x] Configure `wrangler.toml` with `[[d1_databases]]`, `[[vectorize]]`, and `[ai]` bindings.
    - [x] Install dependencies: `reactflow`, `lucide-react`, `clsx`, `tailwind-merge` (for HUD styles).
- [x] **GitHub & Version Control**
    - [x] Initialize Git repository (`git init`, `git add .`, `git commit -m "Initial commit"`).
    - [x] Create GitHub Repository (via `gh repo create` or manual).
    - [x] Push local code to GitHub.
    - [x] **Note**: Using Workers deployment (`wrangler deploy`), not Pages CI/CD.
- [x] **Setup Friction Log**
    - [x] Create `docs/friction_log.md` to track developer experience issues, error messages, and confusing documentation as per assignment requirements.

## Phase 2: Design System "Nexus Dark" (Design Doc)
- [x] **Theme Configuration**
    - [x] Configure Tailwind v4 with the "Nexus" palette using `@theme` directive:
        - `void-black` (#020408)
        - `glass-panel` (#0f172a)
        - `core-reactor` (#FF4500)
        - `solar-flare` (#FF6B6B)
        - `cyan-data` (#00F2FF)
        - `neon-violet` (#BC13FE)
    - [x] Add custom CSS utilities for "Glow" effects (`shadow-glow-red`, `shadow-glow-cyan`) in `styles.css`.
- [x] **Component Library**
    - [x] Create glass panel styling with glassmorphism effect.
    - [x] Create custom node components (CentralNode, ProductNode, CategoryNode, TicketNode).
    - [x] **Checkpoint**: Committed and pushed to GitHub.

## Phase 3: Backend Implementation (Workers + D1 + Vectorize)
- [x] **Database Schema (D1)**
    - [x] Create `schema.sql` defining:
        - `nodes` (id, type, label, x, y, metadata)
        - `edges` (id, source, target)
        - `tickets` (id, node_id, title, status, description, embedding_id)
    - [x] Run `wrangler d1 migrations apply`.
- [x] **API Development (Worker)**
    - [x] Implement `GET /api/graph` to fetch the full node/edge dataset.
    - [x] Implement `POST /api/tickets` to create new tickets with AI processing.
    - [x] Implement `POST /api/nodes` to create new graph nodes.
    - [x] **Checkpoint**: Committed and pushed to GitHub, deployed to production.

## Phase 4: Frontend Graph Visualization (React Flow)
- [x] **Graph Setup**
    - [x] Initialize `ReactFlow` canvas with dark background and dot grid pattern.
    - [x] Implement Custom Node Types:
        - [x] `CentralNode` (Core Reactor with glow)
        - [x] `ProductNode` (Solar Flare style)
        - [x] `CategoryNode` (Cyan Data style)
        - [x] `TicketNode` (Neon Violet style)
- [x] **HUD Implementation**
    - [x] Build Top Bar (Live status indicator & Global Search input).
    - [ ] Build Right Sidebar (Ticket Details Slide-over) - *Future enhancement*.
    - [x] **Checkpoint**: Committed and pushed to GitHub, deployed live.
- [x] **Build System (Vite)**
    - [x] Integrate Vite for TypeScript/JSX transpilation.
    - [x] Configure Tailwind CSS v4 with @tailwindcss/postcss.
    - [x] Set up asset serving from dist/ directory.

## Phase 5: AI & Intelligence Agents (Workers AI)
- [x] **Intelligent Ingestion**
    - [x] In `POST /api/tickets`:
        - [x] Generate embedding using `@cf/baai/bge-base-en-v1.5`.
        - [x] Insert into `Vectorize` index.
        - [x] Query for semantic duplicates (`vectorize.query()`).
- [x] **AI Enhancement**
    - [x] Use `@cf/meta/llama-3-8b-instruct` to:
        - [x] Auto-generate summaries and classifications.
        - [x] Suggest tags (e.g., "Bug", "Docs", "Feature").
    - [x] **Checkpoint**: API implemented and deployed. *Testing with real data pending.*

## Phase 6: Mock Data & Testing
- [ ] **Generate Mock Data**
    - [ ] Write a script (or API endpoint) to populate the graph with a realistic initial state:
        - Central Node: "Cloudflare"
        - Products: "Workers", "Pages", "D1", "R2"
        - Categories: "Docs", "Bugs" under each.
        - 10-20 sample tickets spread across them.
    - [ ] Why? To demonstrate the "Live Graph" feel immediately without manual entry.
- [ ] **Verification**
    - [ ] Verify the "Glow" effects work on hover.
    - [ ] Test the "Duplicate Detection" by entering a semantically similar ticket.
    - [ ] **Checkpoint**: Commit and Push to GitHub (Triggers Deploy).
