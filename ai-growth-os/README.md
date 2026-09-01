# Applied: meta_description

Merge this PR, let the host redeploy, then wire head tags:

1. Paste `head-snippet.html` into your root `<head>`, **or**
2. Next.js: `import { aigosMetadata } from "../ai-growth-os/metadata"` in `app/layout.tsx`.

Until the layout imports metadata / snippet, only `public/*` file fixes appear automatically.
