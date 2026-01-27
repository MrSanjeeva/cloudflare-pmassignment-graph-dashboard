# Developer Friction Log

This document tracks issues, confusing documentation, and error messages encountered during the development of the Cloudflare Graph Dashboard.

| Date | Step | Issue / Friction Point | Resolution / Workaround |
| :--- | :--- | :--- | :--- |
| 2026-01-27 | Project Setup | `npm create cloudflare` failed "Directory already exists and contains files" | Moved files to temp folder, ran create, moved back. C3 requires empty dir. |
| 2026-01-27 | Project Setup | `npm create cloudflare` failed again (hidden files?). | Scaffolding in `./app` subdirectory then moving contents up. |
| 2026-01-27 | Project Setup | `npx wrangler d1 create` failed (Not logged in). | Terminated command. Asked user to run `npx wrangler login`. |
| 2026-01-27 | Project Setup | `npx wrangler vectorize` failed (EADDRINUSE 8976). | Port conflict likely due to multiple wrangler commands. Retrying sequentially. |
| 2026-01-27 | Project Setup | `npm create cloudflare` failed with "Unrecognized option: experimental-vm-modules" | Removed the flag. It is likely a Node flag, not a C3 flag. |
| 2026-01-27 | Deployment | Cloudflare Pages build failed "Missing script: build" | Template uses Workers format, not static build. Need to configure Pages for Workers deployment or add build script. |
| 2026-01-27 | Project Setup | Initializing project... | |
