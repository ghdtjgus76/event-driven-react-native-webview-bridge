export interface PluginMap {
  [pluginName: string]: WebViewBridgePlugin;
}

export abstract class WebViewBridgePlugin {
  constructor() {}

  public abstract execute(...args: any[]): void;
}

export class WebViewBridgePluginManager<P extends PluginMap> {
  private plugins = {} as P;

  constructor(plugins?: P) {
    if (plugins) {
      this.plugins = plugins;
    }
  }

  public cleanup() {
    this.plugins = {} as P;
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

  public getPlugins() {
    return this.plugins;
  }
}
