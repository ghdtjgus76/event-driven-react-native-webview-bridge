import { WebViewBridgeOptions } from "../shared/types";

class ReactWebViewBridge {
  private static instance;
  private plugins;

  private constructor(options: WebViewBridgeOptions) {
    this.plugins = options.plugins || [];
  }

  public static getInstance(options: WebViewBridgeOptions) {
    if (!this.instance) {
      this.instance = new ReactWebViewBridge(options);
    }

    return this.instance;
  }
}
