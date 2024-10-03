import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  target: "es2022",
  entry: [
    "src/core/BaseMessageEventHandler.ts",
    "src/core/Plugin.ts",
    "src/core/MessageQueue.ts",
    "src/utils/environment.ts",
    "src/types/bridge.ts",
    "src/types/message.ts",
  ],
  format: ["cjs", "esm"],
});
