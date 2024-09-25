import { WebViewBridgePlugin } from "webview-bridge-core/core/Plugin";

export const logMessagePlugin = new WebViewBridgePlugin((message: string) => {
  console.log(message);
});
