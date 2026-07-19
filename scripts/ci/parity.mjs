/**
 * Parity gate slot (AG-07 fills real compare).
 * Exit 0 while stubbed so the harness stays green; AG-07 must replace this
 * with a real diff that exits 1 on material drift.
 */
const STUB = process.env.CI_PARITY_STUB !== "0";

if (STUB) {
  console.log("[parity] STUB — not implemented until AG-07. Slot is wired.");
  process.exit(0);
}

console.error("[parity] Real parity not implemented yet.");
process.exit(1);
