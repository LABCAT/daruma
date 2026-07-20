// ── Simple console logger with stage prefixes ──

type Stage = 'INIT' | 'COLLECT' | 'SCORE' | 'RANK' | 'DONE';

function ts(): string {
  return new Date().toISOString().slice(11, 19); // HH:MM:SS
}

function fmt(stage: Stage, msg: string): string {
  return `[${ts()}] [${stage}] ${msg}`;
}

export const log = {
  info: (stage: Stage, msg: string) => console.log(fmt(stage, msg)),
  warn: (stage: Stage, msg: string) => console.warn(fmt(stage, `⚠ ${msg}`)),
  error: (stage: Stage, msg: string) => console.error(fmt(stage, `✗ ${msg}`)),
  success: (stage: Stage, msg: string) => console.log(fmt(stage, `✓ ${msg}`)),
  /** Progress counter, e.g. "3/12 keywords collected" */
  progress: (stage: Stage, current: number, total: number, label: string) =>
    console.log(fmt(stage, `${current}/${total} ${label}`)),
};
