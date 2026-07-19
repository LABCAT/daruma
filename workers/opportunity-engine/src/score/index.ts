interface Env {
  DB: D1Database;
}

export default {
  async queue(batch: MessageBatch<any>, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log("Score worker received batch of size", batch.messages.length);
  }
};
