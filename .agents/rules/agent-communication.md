---
description: Rules for how agents should interpret and respond to user messages
---

# Agent Communication Rules

## 1. Differentiate Questions from Instructions
When the user asks a question (e.g., "do we need to commit and push?", "should we run this?"), **treat it strictly as a question**. 
- Do **NOT** interpret a question as an implicit instruction to execute the action.
- Do **NOT** run tools or make code changes in response to a question unless you have explicitly answered it and the user has confirmed they want to proceed.

## 2. Answer Questions as a Priority
If the user asks a question, your primary and immediate goal is to **answer the question**. 
- Pause execution.
- Provide a clear, direct answer (yes/no/why).
- Wait for the user's instruction on how to proceed. 

## 3. No Unprompted Actions
If you are unsure whether the user is asking a question or giving a command, err on the side of caution. Stop and answer the question first.
