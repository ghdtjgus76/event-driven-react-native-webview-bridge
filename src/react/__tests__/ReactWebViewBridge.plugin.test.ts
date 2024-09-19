import { WebViewBridgePlugin } from "../../shared/core/Plugin";
import { errorHandlingPlugin } from "../../shared/plugins/errorHandlingPlugin";
import ReactWebViewBridge from "../core/ReactWebViewBridge";

describe("WebViewBridgePlugin and PluginManager", () => {
  afterEach(() => {
    ReactWebViewBridge.getInstance().cleanup();
  });

  it("should register and execute plugins correctly", () => {
    const pluginFunction = jest.fn();
    const logMessagePlugin = new WebViewBridgePlugin(pluginFunction);
    const plugins = { logMessagePlugin };
    const instance = ReactWebViewBridge.getInstance({ plugins });

    instance.triggerPluginActions("logMessagePlugin", "message");

    expect(pluginFunction).toHaveBeenCalledTimes(1);
    expect(pluginFunction).toHaveBeenCalledWith("message");
  });

  it("should throw an error if a non-existent plugin is triggered", () => {
    const pluginFunction = jest.fn();
    const logMessagePlugin = new WebViewBridgePlugin(pluginFunction);
    const plugins = { logMessagePlugin };
    const instance = ReactWebViewBridge.getInstance({ plugins });

    expect(() => {
      instance.triggerPluginActions("nonExistingPlugin");
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

  it("should handle errors with the errorHandlingPlugin", () => {
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const plugins = { errorHandlingPlugin };
    const instance = ReactWebViewBridge.getInstance({ plugins });
    const error = {
      message: "Test error",
      stack: "Error stack trace",
      name: "TestError",
    };

    instance.triggerPluginActions("errorHandlingPlugin", { error });

    expect(consoleErrorMock).toHaveBeenCalledWith("Error Name:", "TestError");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Error Message:",
      "Test error"
    );
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Stack Trace:",
      "Error stack trace"
    );

    consoleErrorMock.mockRestore();
  });
});
