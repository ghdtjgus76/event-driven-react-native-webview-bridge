type PluginFunctionType = (...args: any[]) => any;
export interface PluginMap {
  [pluginName: string]: WebViewBridgePlugin;
}

export class WebViewBridgePlugin {
  private pluginFunction: PluginFunctionType;

  constructor(pluginFunction: PluginFunctionType) {
    this.pluginFunction = pluginFunction;
  }

  public execute(...args: any[]) {
    this.pluginFunction(...args);
  }
}

export class WebViewBridgePluginManager<P extends PluginMap> {
  private plugins = {} as P;

  constructor(plugins?: P) {
    this.plugins = plugins;
  }

  public triggerPluginActions<K extends keyof P>(
    pluginName: K,
    ...args: Parameters<P[K]["execute"]>
  ) {
    const plugin = this.plugins[pluginName];

    if (plugin) {
      plugin.execute(...args);
      return;
    }

    throw new Error(`Plugin ${String(pluginName)} not found`);
  }
}
