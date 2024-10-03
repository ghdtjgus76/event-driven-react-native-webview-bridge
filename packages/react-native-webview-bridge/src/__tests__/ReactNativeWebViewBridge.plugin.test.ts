import { WebViewBridgePlugin } from "event-driven-webview-bridge-core/core/Plugin";
import { navigationPlugin } from "../plugins/navigationPlugin";
import { versionHandlingPlugin } from "../plugins/versionHandlingPlugin";
import { RefObject } from "react";
import { WebView } from "react-native-webview";
import ReactNativeWebViewBridge from "../core/ReactNativeWebViewBridge";

describe("WebViewBridgePlugin and PluginManager", () => {
  it("should register and execute plugins correctly", () => {
    const pluginFunction = jest.fn();
    const logMessagePlugin = new WebViewBridgePlugin(pluginFunction);
    const plugins = { logMessagePlugin };
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;
    const instance = ReactNativeWebViewBridge.getInstance({
      plugins,
      webViewRef,
    });

    instance.triggerPluginActions("logMessagePlugin", "message");

    expect(pluginFunction).toHaveBeenCalled();
    expect(pluginFunction).toHaveBeenCalledWith("message");

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should throw an error if a non-existent plugin is triggered", () => {
    const pluginFunction = jest.fn();
    const logMessagePlugin = new WebViewBridgePlugin(pluginFunction);
    const plugins = { logMessagePlugin };
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;
    const instance = ReactNativeWebViewBridge.getInstance({
      plugins,
      webViewRef,
    });

    expect(() => {
      instance.triggerPluginActions("nonExistingPlugin" as any);
    }).toThrow(new Error("Plugin nonExistingPlugin not found"));

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should return the correct plugins list", () => {
    const logMessagePlugin = new WebViewBridgePlugin((message: string) =>
      console.log(message)
    );
    const plugins = { logMessagePlugin };
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;
    const instance = ReactNativeWebViewBridge.getInstance({
      plugins,
      webViewRef,
    });

    expect(instance.getPlugins()).toEqual(plugins);

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });
});

describe("NavigationPlugin", () => {
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

describe("VersionHandlingPlugin", () => {
  it("should execute the correct handler for the current app version", () => {
    const currentVersion = "2.0.4";
    const consoleLogMock = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    const versionHandlers = {
      "0.0.0": {
        logMessage1: (message: string) => console.log(`${message}1`),
      },
      "1.0.0": {
        logMessage1: (message: string) => console.log(`${message}2`),
      },
      "2.0.0": {
        logMessage1: (message: string) => console.log(`${message}3`),
      },
    };

    versionHandlingPlugin.execute(
      versionHandlers,
      currentVersion,
      "logMessage1",
      "message"
    );

    expect(consoleLogMock).toHaveBeenCalledWith("message3");
    consoleLogMock.mockRestore();
  });

  it("should warn if no handler is found for the current app version", () => {
    const currentVersion = "0.0.1";
    const consoleWarnMock = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    const versionHandlers = {
      "1.0.0": {
        logMessage1: (message: string) => console.log(`${message}2`),
      },
      "2.0.0": {
        logMessage1: (message: string) => console.log(`${message}3`),
      },
    };

    const targetFunctionName = "logMessage1";

    versionHandlingPlugin.execute(
      versionHandlers,
      currentVersion,
      targetFunctionName,
      "message"
    );

    expect(consoleWarnMock).toHaveBeenCalledWith(
      `No handler found for function "${targetFunctionName}" and version "${currentVersion}"`
    );
    consoleWarnMock.mockRestore();
  });
});
