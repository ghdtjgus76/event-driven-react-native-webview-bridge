import { PluginMap, WebViewBridgePluginManager } from "../shared/Plugin";
import { WebViewBridgeOptions } from "../shared/types";

class ReactNativeWebViewBridge<P extends PluginMap> {
  private static instance: ReactNativeWebViewBridge<PluginMap>;
  private pluginManager: WebViewBridgePluginManager<P>;

  private constructor(options?: WebViewBridgeOptions<P>) {
    this.pluginManager = new WebViewBridgePluginManager(options.plugins);
  }

  public static getInstance<P extends PluginMap>(options: {
    plugins: P;
  }): ReactNativeWebViewBridge<P> {
    if (!this.instance) {
      this.instance = new ReactNativeWebViewBridge(options);
    }

    return this.instance as ReactNativeWebViewBridge<P>;
  }

  public triggerPluginActions<K extends keyof P>(
    pluginName: K,
    ...args: Parameters<P[K]["execute"]>
  ) {
    this.pluginManager.triggerPluginActions(pluginName, ...args);
  }

  public postMessage() {}

  public onMessage() {}
}

export default ReactNativeWebViewBridge;
