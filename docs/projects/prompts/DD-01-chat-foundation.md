# DD-01: Chat Foundation & Database

**Goal:** ChatGPT-style Assistant UI, D1 persistence, streaming `/api/chat`, usage telemetry, and free-pool failover with durable event rows.

**Read first:** [`AGENT-RULES.md`](AGENT-RULES.md), [`../02-DASHBOARD.md`](../02-DASHBOARD.md), [`../../DARUMA.md`](../../DARUMA.md) (model strategy + caching), [`../../MODEL_COSTS.md`](../../MODEL_COSTS.md).

**Out of scope:** Memory extraction (DD-02), OE Synthesize (DD-03), GitHub `propose_decision` (DD-04). Stub providers OK if keys missing — fail clearly.

## 1. Database (D1)

Migrate (do not invent parallel stores):

- `conversations`: `id`, `title`, `preferred_model_id` (nullable), `created_at`, `updated_at`
- `messages`: `id`, `conversation_id`, `role` (`user` | `assistant` | `system` | `event`), `content`, `model_id` (nullable; set on assistant turns), `created_at`
- `api_usage`: `id`, `conversation_id`, `message_id` (nullable), `model_id`, `provider`, `tokens_prompt`, `tokens_completion`, `tokens_cached` (nullable), `estimated_cost`, `created_at`

Indexes: messages by `conversation_id` + `created_at`; usage by `created_at` and `model_id`.

## 2. Provider layer (thin)

- `LLMProvider` behind OpenAI-compatible chat completions (stream). Adapters for at least: **Google AI Studio (Gemini Flash)**, **DeepSeek**, **Groq**, **OpenRouter**.
- Keys only in Cloudflare env / `.dev.vars` — never client.
- Settings-backed **enabled models** + **failover order** (defaults from `DARUMA.md` / `MODEL_COSTS.md`). Persist preferences (D1 or KV — pick one; document in PR).

## 3. `/api/chat` (streaming)

- Auth-gated. Body: `conversation_id`, `message`, optional `model_id` override.
- Soft affinity: use conversation `preferred_model_id` unless override; update preferred when user picks from dropdown.
- Build payload from Daruma-owned history (user/assistant only). **Exclude `event` rows** from the provider payload.
- On **429 / provider error**: try next enabled model in failover order; insert durable `role=event` message: `Rate limited on {X} → using {Y}` (or fail reason). Same conversation — **do not** fork. If all fail, event + error to client.
- After success: store assistant message + `api_usage` row (include `tokens_cached` when provider reports it).

## 4. UI

- Global chat history sidebar (any route).
- `/chat/[id]` workspace: transcript, composer, markdown for assistant/user.
- Render `event` rows as distinct non-bubble notices (not toasts).
- Model dropdown (enabled models only). Changing model updates preferred; does not create a new chat.
- `/usage` (or Settings → Usage): daily/monthly tokens + estimated USD, grouped by model/provider; surface failover count if easy.

## 5. Tests (fill harness slots)

- Unauth → 401.
- Message persistence + event row not forwarded to mock provider.
- Failover: first provider 429 → second succeeds; event text present.
- Empty / missing-key provider → controlled error, no crash.

**Rules:** SvelteKit BEM SCSS; existing auth; one PR for DD-01 only.
