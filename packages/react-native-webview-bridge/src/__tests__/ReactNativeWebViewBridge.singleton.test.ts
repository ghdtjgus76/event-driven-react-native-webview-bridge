import ReactWebViewBridge from "event-driven-webview-bridge-react";
import { WebViewBridgePlugin } from "event-driven-webview-bridge-core/core/Plugin";
import { RefObject } from "react";
import WebView from "react-native-webview";
import ReactNativeWebViewBridge from "../core/ReactNativeWebViewBridge";

describe("ReactNativeWebViewBridge Singleton", () => {
  it("should create a singleton instance of ReactNativeWebViewBridge", () => {
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;

    const instance = ReactNativeWebViewBridge.getInstance({ webViewRef });

    expect(instance).not.toBeNull();

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should return the same instance when called multiple times", () => {
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;

    const instance1 = ReactNativeWebViewBridge.getInstance({ webViewRef });
    const instance2 = ReactNativeWebViewBridge.getInstance({ webViewRef });

    expect(instance1).toBe(instance2);

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should create a new instance after cleanup", () => {
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;

    const instance1 = ReactNativeWebViewBridge.getInstance({ webViewRef });
    instance1.cleanup();
    const instance2 = ReactNativeWebViewBridge.getInstance({ webViewRef });

    expect(instance1).not.toBe(instance2);

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should apply initial options correctly", () => {
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;

    const logMessagePlugin = new WebViewBridgePlugin((message: string) =>
      console.log(message)
    );
    const plugins = { logMessagePlugin };
    const instance = ReactNativeWebViewBridge.getInstance({
      plugins,
      webViewRef,
    });

    expect(instance.getPlugins()).toEqual(plugins);

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should retain plugin configuration after multiple getInstance calls", () => {
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;

    const logMessagePlugin = new WebViewBridgePlugin((message: string) =>
      console.log(message)
    );
    const plugins = { logMessagePlugin };
    ReactWebViewBridge.getInstance({
      plugins,
    });
    const instance2 = ReactWebViewBridge.getInstance();

    expect(instance2.getPlugins()).toEqual(plugins);

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });
});
