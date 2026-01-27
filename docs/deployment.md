# Deployment Guide

## Current Deployment

**Live URL**: [https://app.imsanjeeva.workers.dev](https://app.imsanjeeva.workers.dev)

**Deployment Method**: Cloudflare Workers (via `wrangler deploy`)

## How to Deploy

### Manual Deployment

```bash
npm run deploy
```

This runs `wrangler deploy` which:
- Bundles the Worker code
- Uploads static assets from `public/`
- Deploys to `app.YOUR_SUBDOMAIN.workers.dev`
- Automatically connects D1, Vectorize, and AI bindings

### Automatic Deployment (GitHub Actions)

To set up automatic deployment on push to `main`:

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

2. Add `CLOUDFLARE_API_TOKEN` secret to GitHub:
   - Go to GitHub repo Settings > Secrets > Actions
   - Create secret with API token from Cloudflare Dashboard

## Resource Bindings

The Worker has access to:
- **D1 Database** (`env.DB`): `cloudflare-graph-db`
- **Vectorize Index** (`env.VECTORIZE_INDEX`): `cloudflare-graph-vec`
- **Workers AI** (`env.AI`): Llama 3 & BGE embeddings

## Custom Domain

To add a custom domain:
1. Go to Workers & Pages Dashboard
2. Select your Worker
3. Settings > Domains & Routes
4. Add your custom domain
