import { WebViewBridgePlugin } from "../core/Plugin";

export const logMessagePlugin = new WebViewBridgePlugin((message: string) => {
  console.log(message);
});
