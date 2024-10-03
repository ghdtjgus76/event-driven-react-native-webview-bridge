import { WebViewBridgePlugin } from "event-driven-webview-bridge-core/core/Plugin";
import ReactWebViewBridge from "../core/ReactWebViewBridge";

describe("WebViewBridgePlugin and PluginManager", () => {
  afterEach(() => {
    ReactWebViewBridge.getInstance().cleanup();
    jest.clearAllMocks();
  });

  it("should register and execute plugins correctly", () => {
    const pluginFunction = jest.fn();
    const logMessagePlugin = new WebViewBridgePlugin(pluginFunction);
    const plugins = { logMessagePlugin };
    const instance = ReactWebViewBridge.getInstance({ plugins });

    instance.triggerPluginActions("logMessagePlugin", "message");

    expect(pluginFunction).toHaveBeenCalled();
    expect(pluginFunction).toHaveBeenCalledWith("message");
  });

  it("should throw an error if a non-existent plugin is triggered", () => {
    const pluginFunction = jest.fn();
    const logMessagePlugin = new WebViewBridgePlugin(pluginFunction);
    const plugins = { logMessagePlugin };
    const instance = ReactWebViewBridge.getInstance({ plugins });

    expect(() => {
      instance.triggerPluginActions("nonExistingPlugin" as any);
    }).toThrow(new Error("Plugin nonExistingPlugin not found"));
  });

  it("should return the correct plugins list", () => {
    const logMessagePlugin = new WebViewBridgePlugin((message: string) =>
      console.log(message)
    );
    const plugins = { logMessagePlugin };
    const instance = ReactWebViewBridge.getInstance({
      plugins,
    });

    expect(instance.getPlugins()).toEqual(plugins);
  });
});
