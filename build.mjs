import { build } from "esbuild";
import npmdts from "npm-dts";
const { Generator } = npmdts;

new Generator({
  entry: "./index.ts",
  output: "./dist/index.d.ts"
}).generate();

// https://janessagarrow.com/blog/typescript-and-esbuild/
const sharedConfig = {
  entryPoints: ["./index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: "es2022"
};

build({
  ...sharedConfig,
  platform: "node",
  outfile: "./dist/index.js",
  format: "cjs",
});

build({
  ...sharedConfig,
  outfile: "./dist/index.esm.js",
  platform: "neutral",
  format: "esm",
});
