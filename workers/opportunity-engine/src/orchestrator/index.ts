interface Env {
  DB: D1Database;
  RAW_IDEAS_QUEUE: Queue;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response("Orchestrator Worker Stub");
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log("Orchestrator cron trigger fired at", controller.scheduledTime);
  }
};
