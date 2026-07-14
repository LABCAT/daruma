interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ message: "Dashboard API Stub" }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response("Dashboard Fetch Stub");
  }
};
