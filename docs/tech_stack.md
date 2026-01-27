# Technology Stack: Cloudflare Graph Dashboard

## Overview
This project is built entirely on the **Cloudflare Developer Platform**, leveraging its edge network for performance, scalability, and AI capabilities.

## 1. Frontend: Cloudflare Pages
**Role**: Hosting & CI/CD for the React Application.
-   **Framework**: `React` (v18+) with `Vite` for fast HMR and build optimization.
-   **Language**: `TypeScript` for type safety.
-   **Routing**: `React Router` (or single-page view).
-   **Visualization**: `React Flow` (or `@xyflow/react`) for the interactive node graph.
-   **Styling**: `Tailwind CSS` for utility-first styling, configured with the "Nexus Dark" theme.
-   **Icons**: `Lucide React` for clean, modern SVG icons.

## 2. Backend Compute: Cloudflare Workers
**Role**: Serverless API and Business Logic.
-   **Runtime**: Cloudflare Workers (V8 Isolate).
-   **API Framework**: `Hono` (lightweight, ultrafast web framework for Edge).
-   **Responsibility**:
    -   Handle CRUD operations for the Graph (Nodes/Edges).
    -   Manage Ticket ingestion and updates.
    -   Orchestrate AI workflows (Agent logic).

## 3. Database: Cloudflare D1
**Role**: Relational Data Storage.
-   **Type**: Serverless SQLite.
-   **Data Stored**:
    -   `Nodes`: ID, Label, Type, X/Y Coordinates, Metadata.
    -   `Edges`: Source, Target, Type.
    -   `Tickets`: Title, Description, Status, Tags, CreatedAt.
-   **Access**: Query via Workers Binding (`env.DB`).

## 4. Vector Search: Cloudflare Vectorize
**Role**: Semantic Search Engine.
-   **Index Configuration**:
    -   Dimensions: `768` (matches Embedding model).
    -   Metric: `cosine` similarity.
-   **Use Case**:
    -   Store vector embeddings of Ticket titles/descriptions.
    -   Enable "Find Similar Tickets" feature to detect duplicates across platforms.

## 5. Artificial Intelligence: Cloudflare Workers AI
**Role**: Intelligent Agent & Embedding Generator.
-   **Inference Engine**: Cloudflare Workers AI.
-   **Models**:
    -   **Text Generation**: `@cf/meta/llama-3-8b-instruct`. Used for summarizing tickets, suggesting tags, and classifying incoming queries.
    -   **Embeddings**: `@cf/baai/bge-base-en-v1.5`. Used to convert text into vectors for Vectorize.

## 6. Development Tools
-   **CLI**: `Wrangler` for local development (`wrangler dev`), database migrations, and deployment.
-   **Package Manager**: `npm`.

## 7. Free Tier Limits & Quotas
All selected technologies have a generous free tier suitable for this prototype:
-   **Cloudflare Pages**: Unlimited sites, 500 builds/month, unlimited bandwidth.
-   **Cloudflare Workers**: 100,000 requests/day (Free plan).
-   **Cloudflare D1**: 5 GB storage, 5 million reads/day, 100k writes/day.
-   **Cloudflare Vectorize**: 30 million queried vector dimensions/month (~39k queries/month with 768d vectors).
-   **Cloudflare Workers AI**: 10,000 Neurons/day (enough for hundreds of Llama 3 calls).
