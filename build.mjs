import { build } from "esbuild";

// https://janessagarrow.com/blog/typescript-and-esbuild/
const sharedConfig = {
  entryPoints: ["./index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: "node16"
};

build({
  ...sharedConfig,
  platform: "node",
  outfile: "dist/index.js",
  format: "cjs"
});

build({
  ...sharedConfig,
  outfile: "dist/index.esm.js",
  platform: "node",
  format: "esm"
});
