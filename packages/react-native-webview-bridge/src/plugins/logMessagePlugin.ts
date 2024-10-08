import { WebViewBridgePlugin } from "event-driven-webview-bridge-core/core/Plugin";

class LogMessagePlugin extends WebViewBridgePlugin {
  public execute({ message }: { message: string }): void {
    console.log(message);
  }
}

export default LogMessagePlugin;
