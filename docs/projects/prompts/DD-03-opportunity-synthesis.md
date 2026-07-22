# DD-03: Opportunity Engine Synthesis

**Goal:** Connect the Opportunity Engine to the Chat workspace to replace the manual "Copy Top 5" workflow.

## 1. UI Update
- On the `pending` opportunities list, replace the "Copy Top 5" workflow with a direct **Synthesize** button on individual opportunity cards.

## 2. Backend Integration
- When the Synthesize button is clicked, create a new conversation in D1.
- Fetch the raw `signals_json` (competitors, reviews, intents) and `score_json` (rankings) from the database for that specific opportunity.
- Construct a detailed "Super Prompt" combining the raw signals and the pain points.

## 3. Prompt Injection & Routing
- Inject this Super Prompt as a hidden system prompt in the new chat.
- Provide a "View Context" UI toggle so the user can see exactly what raw data the AI is using.
- Auto-navigate the user to `/chat/[id]` to watch the LLM stream the brainstorming pitch for the app concept.
