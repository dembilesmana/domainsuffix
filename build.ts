// Build ke format ESM (.js)
await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  naming: "index.js",
  format: "esm",
  target: "browser",
});

// Build ke format CommonJS (.cjs)
await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  naming: "index.cjs",
  format: "cjs",
  target: "node",
});

// Generate TypeScript Declaration Files (.d.ts) via tsc
const proc = Bun.spawn(["npx", "tsc", "--emitDeclarationOnly"]);
await proc.exited;

console.log(" Build library berhasil!");
