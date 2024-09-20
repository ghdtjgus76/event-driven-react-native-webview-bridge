import ReactWebViewBridge from "react-webview-bridge/ReactWebViewBridge";
import { WebViewBridgePlugin } from "webview-bridge-core/core/Plugin";
import ReactNativeWebViewBridge from "../core/ReactNativeWebviewBridge";

describe("ReactNativeWebViewBridge Singleton", () => {
  afterEach(() => {
    ReactNativeWebViewBridge.getInstance().cleanup();
    jest.clearAllMocks();
  });

  it("should create a singleton instance of ReactNativeWebViewBridge", () => {
    const instance = ReactNativeWebViewBridge.getInstance();

    expect(instance).not.toBeNull();
  });

  it("should return the same instance when called multiple times", () => {
    const instance1 = ReactNativeWebViewBridge.getInstance();
    const instance2 = ReactNativeWebViewBridge.getInstance();

    expect(instance1).toBe(instance2);
  });

  it("should create a new instance after cleanup", () => {
    const instance1 = ReactNativeWebViewBridge.getInstance();
    instance1.cleanup();
    const instance2 = ReactNativeWebViewBridge.getInstance();

    expect(instance1).not.toBe(instance2);
  });

  it("should apply initial options correctly", () => {
    const logMessagePlugin = new WebViewBridgePlugin((message: string) =>
      console.log(message)
    );
    const plugins = { logMessagePlugin };
    const instance = ReactNativeWebViewBridge.getInstance({
      plugins,
    });

    expect(instance.getPlugins()).toEqual(plugins);
  });

  it("should retain plugin configuration after multiple getInstance calls", () => {
    const logMessagePlugin = new WebViewBridgePlugin((message: string) =>
      console.log(message)
    );
    const plugins = { logMessagePlugin };
    ReactWebViewBridge.getInstance({
      plugins,
    });
    const instance2 = ReactWebViewBridge.getInstance();

    expect(instance2.getPlugins()).toEqual(plugins);
  });
});
