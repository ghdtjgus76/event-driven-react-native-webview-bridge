import ReactWebViewBridge from "../core/ReactWebViewBridge";
import LogMessagePlugin from "../plugins/logMessagePlugin";

describe("WebViewBridgePlugin and PluginManager", () => {
  afterEach(() => {
    ReactWebViewBridge.getInstance().cleanup();
    jest.clearAllMocks();
  });

  it("should register and execute plugins correctly", () => {
    const logMessagePlugin = new LogMessagePlugin();
    const plugins = { logMessagePlugin };
    const instance = ReactWebViewBridge.getInstance({ plugins });
    const consoleLogMock = jest.spyOn(console, "log");

    instance.triggerPluginActions("logMessagePlugin", { message: "message" });

    expect(consoleLogMock).toHaveBeenCalled();
    expect(consoleLogMock).toHaveBeenCalledWith("message");
  });

  it("should throw an error if a non-existent plugin is triggered", () => {
    const logMessagePlugin = new LogMessagePlugin();
    const plugins = { logMessagePlugin };
    const instance = ReactWebViewBridge.getInstance({ plugins });

    expect(() => {
      instance.triggerPluginActions("nonExistingPlugin" as any);
    }).toThrow(new Error("Plugin nonExistingPlugin not found"));
  });

  it("should return the correct plugins list", () => {
    const logMessagePlugin = new LogMessagePlugin();
    const plugins = { logMessagePlugin };
    const instance = ReactWebViewBridge.getInstance({ plugins });

    expect(instance.getPlugins()).toEqual(plugins);
  });
});
