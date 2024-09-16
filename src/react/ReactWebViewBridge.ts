import { PluginMap, WebViewBridgePluginManager } from "../shared/Plugin";
import { WebViewBridgeOptions } from "../shared/types";

class ReactWebViewBridge<P extends PluginMap> {
  private static instance: ReactWebViewBridge<PluginMap>;
  private pluginManager: WebViewBridgePluginManager<P>;

  private constructor(options?: WebViewBridgeOptions<P>) {
    this.pluginManager = new WebViewBridgePluginManager(options.plugins);
  }

  public static getInstance<P extends PluginMap>(options: {
    plugins: P;
  }): ReactWebViewBridge<P> {
    if (!this.instance) {
      this.instance = new ReactWebViewBridge(options);
    }

    return this.instance as ReactWebViewBridge<P>;
  }

  public triggerPluginActions<K extends keyof P>(
    pluginName: K,
    ...args: Parameters<P[K]["execute"]>
  ) {
    this.pluginManager.triggerPluginActions(pluginName, ...args);
  }
}
