import { RefObject } from "react";
import { WebView } from "react-native-webview";
import VersionHandlingPlugin from "../plugins/versionHandlingPlugin";
import ReactNativeWebViewBridge from "../core/ReactNativeWebViewBridge";
import LogMessagePlugin from "../plugins/logMessagePlugin";
import NavigationPlugin, {
  NavigationPluginOptions,
} from "../plugins/navigationPlugin";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

const mockedNavigation: jest.Mocked<NavigationProp<ParamListBase>> = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(),
  canGoBack: jest.fn().mockReturnValue(true),
  getParent: jest.fn(),
  setParams: jest.fn(),
  getId: jest.fn(),
  getState: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
};

describe("WebViewBridgePlugin and PluginManager", () => {
  it("should register and execute plugins correctly", () => {
    const logMessagePlugin = new LogMessagePlugin();
    const plugins = { logMessagePlugin };
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;
    const instance = ReactNativeWebViewBridge.getInstance({
      plugins,
      webViewRef,
    });
    const consoleLogMock = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    instance.triggerPluginActions("logMessagePlugin", { message: "message" });

    expect(consoleLogMock).toHaveBeenCalled();
    expect(consoleLogMock).toHaveBeenCalledWith("message");

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should throw an error if a non-existent plugin is triggered", () => {
    const logMessagePlugin = new LogMessagePlugin();
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
    const logMessagePlugin = new LogMessagePlugin();
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
    const navigationPlugin = new NavigationPlugin();
    const options: NavigationPluginOptions = {
      action: "push",
      params: { screen: "Home" },
      navigation: mockedNavigation,
    };

    navigationPlugin.execute(options);

    expect(mockedNavigation.navigate).toHaveBeenCalledWith("Home", undefined);
  });

  it("should handle pop navigation correctly", () => {
    const navigationPlugin = new NavigationPlugin();
    const options: NavigationPluginOptions = {
      action: "pop",
      navigation: mockedNavigation,
    };

    navigationPlugin.execute(options);

    expect(mockedNavigation.canGoBack).toHaveBeenCalled();
    expect(mockedNavigation.goBack).toHaveBeenCalled();
  });

  it("should handle replace navigation correctly", () => {
    const navigationPlugin = new NavigationPlugin();
    const options: NavigationPluginOptions = {
      action: "replace",
      params: { screen: "Profile" },
      navigation: mockedNavigation,
    };

    navigationPlugin.execute(options);

    expect(mockedNavigation.dispatch).toHaveBeenCalledWith({
      ...options.params,
      type: "REPLACE",
    });
  });

  it("should handle reset navigation correctly", () => {
    const navigationPlugin = new NavigationPlugin();
    const options: NavigationPluginOptions = {
      action: "reset",
      params: {
        index: 0,
        actions: [{ type: "Navigate", payload: { name: "Home" } }],
      },
      navigation: mockedNavigation,
    };

    navigationPlugin.execute(options);

    expect(mockedNavigation.dispatch).toHaveBeenCalledWith({
      ...options.params,
      type: "RESET",
    });
  });

  it("should handle setParams navigation correctly", () => {
    const navigationPlugin = new NavigationPlugin();
    const options: NavigationPluginOptions = {
      action: "setParams",
      params: { key: "key1", params: { user: "user1" } },
      navigation: mockedNavigation,
    };

    navigationPlugin.execute(options);

    expect(mockedNavigation.setParams).toHaveBeenCalledWith(options.params);
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
        logMessage1: ({ message }: { message: string }) =>
          console.log(`${message}1`),
      },
      "1.0.0": {
        logMessage1: ({ message }: { message: string }) =>
          console.log(`${message}2`),
      },
      "2.0.0": {
        logMessage1: ({ message }: { message: string }) =>
          console.log(`${message}3`),
      },
    };

    const versionHandlingPlugin = new VersionHandlingPlugin(versionHandlers);

    versionHandlingPlugin.execute(currentVersion, "logMessage1", {
      message: "message",
    });

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
        logMessage1: ({ message }: { message: string }) =>
          console.log(`${message}2`),
      },
      "2.0.0": {
        logMessage1: ({ message }: { message: string }) =>
          console.log(`${message}3`),
      },
    };

    const targetFunctionName = "logMessage1";

    const versionHandlingPlugin = new VersionHandlingPlugin(versionHandlers);

    versionHandlingPlugin.execute(currentVersion, targetFunctionName, {
      message: "message",
    });

    expect(consoleWarnMock).toHaveBeenCalledWith(
      `No handler found for function "${targetFunctionName}" and version "${currentVersion}"`
    );
    consoleWarnMock.mockRestore();
  });
});
