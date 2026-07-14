interface Env {
  DB: D1Database;
  COLLECTED_IDEAS_QUEUE: Queue;
}

export default {
  async queue(batch: MessageBatch<any>, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log("Collect worker received batch of size", batch.messages.length);
  }
};
