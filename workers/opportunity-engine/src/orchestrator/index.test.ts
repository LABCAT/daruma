import { env, createExecutionContext, waitOnExecutionContext, SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "./index";

describe("Orchestrator Worker", () => {
  it("responds with stub message", async () => {
    const request = new Request("http://example.com");
    // Create an empty context to pass to `worker.fetch()`.
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env as any, ctx);
    
    // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
    await waitOnExecutionContext(ctx);
    
    expect(await response.text()).toBe("Orchestrator Worker Stub");
  });
});
