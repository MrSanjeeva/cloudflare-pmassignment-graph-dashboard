# Project Todo List

This document outlines the step-by-step implementation plan for the **Cloudflare Live Graph Dashboard**, derived from the [PRD](./prd.md), [Design Doc](./design_doc.md), and [Tech Stack](./tech_stack.md).

## Phase 1: Project Setup & Configuration (Tech Stack)
- [x] **Initialize Project**
    - [x] Run `npm create cloudflare@latest` (React + Vite).
    - [x] Configure `wrangler.toml` with `[[d1_databases]]`, `[[vectorize]]`, and `[ai]` bindings.
    - [x] Install dependencies: `reactflow`, `lucide-react`, `clsx`, `tailwind-merge` (for HUD styles).
- [ ] **GitHub & CI/CD Setup**
    - [x] Initialize Git repository (`git init`, `git add .`, `git commit -m "Initial commit"`).
    - [ ] Create GitHub Repository (via `gh repo create` or manual).
    - [ ] Push local code to GitHub.
    - [ ] Connect Cloudflare Pages project to GitHub Repo to enable CI/CD (Automatic Deployment on push).
- [x] **Setup Friction Log**
    - [x] Create `docs/friction_log.md` to track developer experience issues, error messages, and confusing documentation as per assignment requirements.

## Phase 2: Design System "Nexus Dark" (Design Doc)
- [ ] **Theme Configuration**
    - [ ] Configure `tailwind.config.js` with the "Nexus" palette:
        - `void-black` (#020408)
        - `glass-panel` (#0f172a)
        - `core-reactor` (#FF4500)
        - `solar-flare` (#FF6B6B)
        - `cyan-data` (#00F2FF)
        - `neon-violet` (#BC13FE)
    - [ ] Add custom CSS utilities for "Glow" effects (`shadow-glow-red`, `shadow-glow-cyan`) in `index.css`.
- [ ] **Component Library**
    - [ ] Create `GlassPanel` component (generic HUD container).
    - [ ] Create `GlowButton` component.
    - [ ] **Checkpoint**: Commit and Push to GitHub (Triggers Deploy).

## Phase 3: Backend Implementation (Workers + D1 + Vectorize)
- [x] **Database Schema (D1)**
    - [x] Create `schema.sql` defining:
        - `nodes` (id, type, label, x, y, metadata)
        - `edges` (id, source, target)
        - `tickets` (id, node_id, title, status, description, embedding_id)
    - [x] Run `wrangler d1 migrations apply`.
- [ ] **API Development (Hono)**
    - [ ] Implement `GET /api/graph` to fetch the full node/edge dataset.
    - [ ] Implement `POST /api/tickets` to create new tickets.
    - [ ] Implement `POST /api/reset` (for easy mock data reset).
    - [ ] **Checkpoint**: Commit and Push to GitHub (Triggers Deploy).

## Phase 4: Frontend Graph Visualization (React Flow)
- [ ] **Graph Setup**
    - [ ] Initialize `ReactFlow` canvas with "Infinite Space" background (particle/grid effect).
    - [ ] Implement Custom Node Types:
        - `CentralNode` (Pulsing Core Reactor)
        - `ProductNode` (Solar Flare style)
        - `CategoryNode` (Cyan Data style)
        - `TicketNode` (Neon Violet style)
- [ ] **HUD Implementation**
    - [ ] Build Top Bar (Status Deck & Search).
    - [ ] Build Right Sidebar (Ticket Details Slide-over).
    - [ ] **Checkpoint**: Commit and Push to GitHub (Triggers Deploy).

## Phase 5: AI & Intelligence Agents (Workers AI)
- [ ] **Intelligent Ingestion**
    - [ ] In `POST /api/tickets`:
        - [ ] Generate embedding using `@cf/baai/bge-base-en-v1.5`.
        - [ ] Insert into `Vectorize` index.
        - [ ] Query for semantic duplicates (`vectorize.query()`).
- [ ] **AI Enhancement**
    - [ ] Use `@cf/meta/llama-3-8b-instruct` to:
        - [ ] Auto-generate succinct descriptions from titles.
        - [ ] Suggest tags (e.g., "Bug", "Docs", "Feature").
    - [ ] **Checkpoint**: Commit and Push to GitHub (Triggers Deploy).

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
