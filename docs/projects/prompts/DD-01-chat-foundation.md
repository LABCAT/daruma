# DD-01: Chat Foundation & Database

**Goal:** Build the core ChatGPT-style interface and fundamental telemetry.

## 1. Database (D1)
Create the following tables in the D1 schema:
- `conversations`: id, title, created_at, updated_at
- `messages`: id, conversation_id, role (user/assistant/system), content, created_at
- `api_usage`: id, model_id, tokens_prompt, tokens_completion, estimated_cost, created_at

## 2. Global Telemetry & Billing
- Create a `/usage` (or Settings) view in the dashboard.
- Aggregate data from `api_usage` to show total monthly/daily spend and token counts.
- Split and group the usage metrics explicitly by which models were used.

## 3. UI
- Create a global sidebar for chat history, accessible from anywhere.
- Build the `/chat/[id]` full-page workspace for the actual conversation UI.
- Support standard markdown rendering for messages.

## 4. API
- Implement the `/api/chat` streaming endpoint.
- Use standard OpenAI-compatible API schemas so it can easily wrap providers like Gemini or DeepSeek.

**Rules:**
- Follow existing SvelteKit BEM SCSS patterns.
- Ensure all API routes are protected behind the existing dashboard auth.
