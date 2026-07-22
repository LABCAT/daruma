# DD-02: Models, Context & Two-Tier Memory

**Goal:** Implement model switching, context window management, and long-term memory.

## 1. Model Configuration
- Define a strict TypeScript object `MODELS_CONFIG` (e.g., in `src/lib/config/models.ts`).
- Explicitly declare each model's max context window limit and cost-per-token here. Do NOT use a database table for this static metadata.
- Keep actual API keys safely in Cloudflare environment variables (`.dev.vars` locally, Wrangler secrets in prod).
- Add a UI dropdown in the `/chat/[id]` workspace allowing the user to seamlessly switch between configured models (e.g., `gemini-2.5-pro`, `deepseek-chat`).

## 2. Context Window Management
- Add a UI progress bar in the chat view showing how "full" the context window is.
- Automatically calculate this progress using the token usage vs the selected model's known limit from `MODELS_CONFIG`.
- Implement a "Fork Chat" or "Summarize & Clear" button to safely reset or branch the context when it gets too heavy.

## 3. Two-Tier Memory System
- **Git Knowledge:** The `/api/chat` backend must automatically read `AGENTS.md` and `CURRENT.md` from the repo and silently inject them as a hidden system prompt.
- **D1 Memory:** Add a `memories` table to D1. Build a background process (or end-of-chat hook) that extracts key facts from finished chats and saves them here. Inject these facts into future chats to simulate long-term memory.
