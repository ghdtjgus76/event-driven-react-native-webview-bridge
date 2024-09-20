import { WebViewBridgePlugin } from "../../shared/core/Plugin";
import { errorHandlingPlugin } from "../../shared/plugins/errorHandlingPlugin";
import ReactNativeWebViewBridge from "../core/ReactNativeWebviewBridge";
import { navigationPlugin } from "../plugins/navigationPlugin";

describe("WebViewBridgePlugin and PluginManager", () => {
  afterEach(() => {
    ReactNativeWebViewBridge.getInstance().cleanup();
    jest.clearAllMocks();
  });

  it("should register and execute plugins correctly", () => {
    const pluginFunction = jest.fn();
    const logMessagePlugin = new WebViewBridgePlugin(pluginFunction);
    const plugins = { logMessagePlugin };
    const instance = ReactNativeWebViewBridge.getInstance({ plugins });

    instance.triggerPluginActions("logMessagePlugin", "message");

    expect(pluginFunction).toHaveBeenCalled();
    expect(pluginFunction).toHaveBeenCalledWith("message");
  });

  it("should throw an error if a non-existent plugin is triggered", () => {
    const pluginFunction = jest.fn();
    const logMessagePlugin = new WebViewBridgePlugin(pluginFunction);
    const plugins = { logMessagePlugin };
    const instance = ReactNativeWebViewBridge.getInstance({ plugins });

    expect(() => {
      instance.triggerPluginActions("nonExistingPlugin" as any);
    }).toThrow(new Error("Plugin nonExistingPlugin not found"));
  });

  it("should return the correct plugins list", () => {
    const logMessagePlugin = new WebViewBridgePlugin((message: string) =>
      console.log(message)
    );
    const plugins = { logMessagePlugin };
    const instance = ReactNativeWebViewBridge.getInstance({
      plugins,
    });

    expect(instance.getPlugins()).toEqual(plugins);
  });
});

describe("ErrorHandlingPlugin", () => {
  it("should handle errors with the errorHandlingPlugin", () => {
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const plugins = { errorHandlingPlugin };
    const instance = ReactNativeWebViewBridge.getInstance({ plugins });
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

describe("NavigationPlugin", () => {
  afterEach(() => {
    ReactNativeWebViewBridge.getInstance().cleanup();
    jest.clearAllMocks();
  });

  it("should handle push navigation correctly", () => {
    const navigateMock = jest.fn();
    const navigation = { navigate: navigateMock };
    const options = {
      action: "push",
      params: { screen: "Home" },
      navigation,
    };

    navigationPlugin.execute(options);

    expect(navigateMock).toHaveBeenCalledWith("Home", undefined);
  });

  it("should handle pop navigation correctly", () => {
    const goBackMock = jest.fn();
    const canGoBackMock = jest.fn(() => true);
    const navigation = { goBack: goBackMock, canGoBack: canGoBackMock };
    const options = {
      action: "pop",
      navigation,
    };

    navigationPlugin.execute(options);

    expect(canGoBackMock).toHaveBeenCalled();
    expect(goBackMock).toHaveBeenCalled();
  });

  it("should handle replace navigation correctly", () => {
    const dispatchMock = jest.fn();
    const navigation = { dispatch: dispatchMock };
    const options = {
      action: "replace",
      params: { screen: "Profile" },
      navigation,
    };

    navigationPlugin.execute(options);

    expect(dispatchMock).toHaveBeenCalledWith({
      ...options.params,
      type: "REPLACE",
    });
  });

  it("should handle reset navigation correctly", () => {
    const dispatchMock = jest.fn();
    const navigation = { dispatch: dispatchMock };
    const options = {
      action: "reset",
      params: {
        index: 0,
        actions: [{ type: "Navigate", routeName: "Home" }],
      },
      navigation,
    };

    navigationPlugin.execute(options);

    expect(dispatchMock).toHaveBeenCalledWith({
      ...options.params,
      type: "RESET",
    });
  });

  it("should handle setParams navigation correctly", () => {
    const setParamsMock = jest.fn();
    const navigation = { setParams: setParamsMock };
    const options = {
      action: "setParams",
      params: { key: "key1", params: { user: "user1" } },
      navigation,
    };

    navigationPlugin.execute(options);

    expect(setParamsMock).toHaveBeenCalledWith(options.params);
  });
});

describe("VersionHandlingPlugin", () => {});
