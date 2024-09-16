import { WebViewBridgeOptions } from "../shared/types";

class ReactNativeWebViewBridge {
  private static instance;
  private plugins;

  private constructor(options: WebViewBridgeOptions) {
    this.plugins = options.plugins || [];
  }

  public static getInstance(options: WebViewBridgeOptions) {
    if (!this.instance) {
      this.instance = new ReactNativeWebViewBridge(options);
    }

    return this.instance;
  }
}
