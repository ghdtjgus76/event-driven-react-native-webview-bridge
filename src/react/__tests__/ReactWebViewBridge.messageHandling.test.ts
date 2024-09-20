import WebView from "react-native-webview";
import { PluginMap } from "../../shared/core/Plugin";
import ReactWebViewBridge from "../core/ReactWebViewBridge";
import ReactNativeWebViewBridge from "../../react-native/core/ReactNativeWebviewBridge";

describe("ReactWebViewBridge message handling", () => {
  let bridge: ReactWebViewBridge<PluginMap>;

  beforeEach(() => {
    bridge = ReactWebViewBridge.getInstance();
  });

  afterEach(() => {
    bridge.cleanup();
  });

  it("should call postMessage on window.ReactNativeWebView and resolve successfully", async () => {
    const postMessageMock = jest.fn();
    (window as any).ReactNativeWebView = { postMessage: postMessageMock };
    const message = {
      type: "test_type",
      data: "test_data",
    };

    await expect(bridge.postMessage(message)).resolves.toEqual({
      success: true,
    });
  });

  it("should reject if ReactNativeWebView is not defined", async () => {
    (window as any).ReactNativeWebView = undefined;
    const message = {
      type: "test_type",
      data: "test_data",
    };

    await expect(bridge.postMessage(message)).rejects.toThrow(
      "ReactNativeWebView is not defined or postMessage is not a function"
    );
  });

  it("should reject if postMessage throws and error", async () => {
    const postMessageMock = jest.fn(() => {
      throw new Error("Test error");
    });
    (window as any).ReactNativeWebView = { postMessage: postMessageMock };
    const message = {
      type: "test_type",
      data: "test_data",
    };

    await expect(bridge.postMessage(message)).rejects.toThrow("Test error");
  });
});
