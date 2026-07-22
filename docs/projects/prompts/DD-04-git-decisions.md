# DD-04: GitHub Decisions & Actions

**Goal:** Give Daruma the ability to write decisions to the repository via the chat UI.

## 1. API Integration
- Connect the dashboard to the GitHub API. Store the PAT securely in Cloudflare environment variables.

## 2. AI Tooling
- Give the LLM access to a `propose_decision` tool or structured JSON output schema.
- The AI should use this tool when it synthesizes a final app idea or agrees on a strategic change.

## 3. UI Execution
- When the AI triggers `propose_decision`, render a native "Approve & Commit" button block in the chat UI.
- Clicking the button executes a GitHub API call to commit the markdown file directly to `docs/ideas/` or update `docs/CURRENT.md`.
- Provide visual feedback (success/fail) within the chat interface.
