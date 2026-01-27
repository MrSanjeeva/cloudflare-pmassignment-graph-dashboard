# Product Requirements Document (PRD): Cloudflare Live Graph Dashboard

## 1. Introduction
The **Cloudflare Live Graph Dashboard** is an interactive visual tool designed to solve the complexity of managing fragmented feedback. It aggregates data from various sources into a unified, live node graph, enhanced with AI for organization and insight.

## 2. Problem Statement
It is difficult to aggregate issues, queries, features and requests from all the different platforms.
So we are trying to build a live node graph based interactive dashboard.

## 3. Goals & Objectives
-   **Centralized Aggregation**: Bring together disparate inputs (bugs, docs questions, feature requests) into a single visual plane.
-   **Live Interaction**: Provide a real-time, drag-and-drop graph interface (`react-flow`) to organize and explore data.
-   **AI-Powered Organization**: Use Cloudflare Workers AI to automatically classify, tag, and deduplicate incoming items.
-   **Data Persistence**: Store the graph structure and content reliably using Cloudflare D1.

## 4. User Personas
-   **Product Managers**: Need a high-level view of "what is happening" across all feedback channels.
-   **Support Engineers**: Need to group similar queries to identify outages or common confusion points.

## 5. Functional Requirements

### 5.1 The "Live Graph" (Frontend)
-   **Visualization**: A 2D infinite canvas visualizing data as nodes.
-   **Structure**:
    -   **Central Node**: The root context (e.g., "Cloudflare Platform").
    -   **Product Nodes**: Cloudflare offerings (e.g., "Cloudflare Workers", "D1", "Workers AI").
    -   **Category Nodes**: Dynamic groupings (e.g., "Bugs", "Feature Requests").
    -   **Item Nodes**: The actual issues/queries (Origin like "Discord" is a tag).
-   **Interactivity**: Complete pan/zoom control. Drag nodes to reallocate them.

### 5.2 Aggregation & Ingestion (Backend)
-   **Unified API**: A standard endpoint to receive data from any platform.
-   **Live Updates**: Changes should be reflected immediately (optimistic UI or polling).

### 5.3 AI Intelligence (The "Brain")
-   **Semantic Deduplication**: When a new query comes in, checks against existing embedding vectors (via Vectorize) to find duplicates.
-   **Auto-Classification**: AI determines if an item is a "Bug", "Question", or "Feature" and links it to the potential parent node.

## 6. Technical Stack
-   **Frontend**: React + Vite + React Flow + Tailwind CSS.
-   **Edge Compute**: Cloudflare Workers.
-   **Database**: Cloudflare D1 (SQL).
-   **Vector Search**: Cloudflare Vectorize (for aggregation/deduplication).
-   **AI**: Cloudflare Workers AI (`llama-3-8b`, `bge-base-en-v1.5`).

## 7. Success Metrics
-   **Clarity**: Users can instantly see which product area has the most "heat" (activity).
-   **Efficiency**: Reduces time to identify duplicate issues by 50%.
