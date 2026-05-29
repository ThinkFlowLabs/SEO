# ThinkFlowLabs · SEO Audits

Private client audit deliverables hosted on GitHub Pages.

Each subfolder of this repo is one engagement. Pages are blocked from search engines via `<meta name="robots" content="noindex">` + a top-level `robots.txt`.

## Audits

| Client | Folder | URL |
|---|---|---|
| Chefpost | [`/chefpost-audit/`](./chefpost-audit/) | https://thinkflowlabs.github.io/SEO/chefpost-audit/ |

## How to add a new audit

1. Create a new subfolder (e.g. `client-name/`).
2. Drop the `index.html` deliverable inside.
3. Add a `.nojekyll` file in the subfolder (optional, repo root already has one).
4. Add a `<meta name="robots" content="noindex">` tag to the HTML head.
5. Commit + push to `main` — GitHub Pages rebuilds automatically.
6. Update the table above with the new audit URL.
