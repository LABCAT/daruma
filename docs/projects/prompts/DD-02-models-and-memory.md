# DD-02: Models, Context & Two-Tier Memory

**Goal:** `MODELS_CONFIG`, dual context/TPM ceilings, prompt-cache-friendly payloads, context UI, git knowledge inject, D1 memories.

**Depends on:** DD-01 merged (chat + `api_usage` + failover events).

**Read first:** [`AGENT-RULES.md`](AGENT-RULES.md), [`../../DARUMA.md`](../../DARUMA.md) (§ Knowledge / LLM caching), [`../../MODEL_COSTS.md`](../../MODEL_COSTS.md).

## 1. `MODELS_CONFIG`

TypeScript config (e.g. `src/lib/config/models.ts`) — **not** a DB table:

| Field | Purpose |
|-------|---------|
| `id` | Stable slug used in UI + `api_usage` |
| `provider` | `google` \| `deepseek` \| `groq` \| `openrouter` \| … |
| `apiModel` | Provider model string |
| `contextWindow` | Max tokens the model accepts |
| `requestCeilingTokens` | Optional single-request cap (free TPM), e.g. Groq 70B ≈ 12000, GPT-OSS 120B ≈ 8000 |
| `inputPerMTok` / `outputPerMTok` | Cost estimate (0 for free) |
| `defaultEnabled` | Settings default |

**Initial enabled set (intent):**

- Gemini Flash (AI Studio free) — everyday default
- DeepSeek V4 Flash (paid) — cheap escalate
- Groq `llama-3.3-70b-versatile` — free technical
- Groq `openai/gpt-oss-120b` — free heavy reasoning
- OpenRouter `openrouter/free` and/or explicit `:free` slugs — failover capacity

Pin exact `apiModel` strings from live vendor/OpenRouter docs at implement time — do not invent. Sync cost fields from `MODEL_COSTS.md` where listed.

Secrets stay in env vars (`GROQ_API_KEY`, `GOOGLE_AI_API_KEY`, `DEEPSEEK_API_KEY`, `OPENROUTER_API_KEY`, …).

## 2. Context + rate ceilings

- Progress bar: tokens in **next** payload ÷ active `contextWindow`.
- Trim history (drop oldest user/assistant turns; keep system/knowledge prefix) so payload fits `contextWindow` **and** `requestCeilingTokens` when set (~80% of ceiling preferred).
- **TPM ≠ context window.** UI may show a secondary hint when `requestCeilingTokens` binds before `contextWindow`.
- Fork Chat / Summarize & Clear: intentional only — not used for failover or model switch.

## 3. Prompt caching (no app-side KV engine)

- Keep system + knowledge prefix **deterministic** (stable order; no live timestamps, random IDs, or per-request noise in the cached prefix).
- Send full trimmed history each turn for automatic-cache providers (Groq, DeepSeek, etc.). Do not send a fake cache key unless a provider requires explicit cache IDs (Gemini context caching — defer unless already needed).
- Persist `tokens_cached` on `api_usage` when present; show in usage UI when known. Do not invent cache TTL UI.

## 4. Two-tier memory

- **Git knowledge (always-in Phase 1):** inject `AGENTS.md`, `CURRENT.md`, `VISION.md` into the hidden system/knowledge block (bundle or server read — match `02-DASHBOARD.md`). Show “synced at” if bundled.
- **D1 `memories`:** `id`, `content`, `source_conversation_id`, `status`, `created_at`. End-of-turn or background hook extracts durable facts from recent assistant/user text; inject a short memory block into future chats. Never treat D1 memory as git truth.

## 5. Tests

- Trim respects `requestCeilingTokens` before calling provider mock.
- Event/system-hidden rows excluded from tokenized history correctly.
- Memory inject appears in provider payload; user-visible transcript unchanged.
- Deterministic prefix: two builds of the knowledge block with same inputs are byte-identical.

**Rules:** one PR for DD-02 only; fill CI slots; no trivial happy-only tests.
