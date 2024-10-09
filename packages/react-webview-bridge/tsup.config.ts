import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  target: "es2022",
  entry: ["src/core/ReactWebViewBridge.ts"],
  format: ["cjs", "esm"],
});
