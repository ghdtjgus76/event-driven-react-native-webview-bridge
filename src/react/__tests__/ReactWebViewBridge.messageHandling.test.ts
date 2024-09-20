import WebView from "react-native-webview";
import ReactNativeWebViewBridge from "../../react-native/core/ReactNativeWebviewBridge";
import { PluginMap } from "../../shared/core/Plugin";
import ReactWebViewBridge from "../core/ReactWebViewBridge";

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

  it("should trigger onMessage event when ReactNativeWebViewBridge postMessage event triggers", async () => {
    const messageType = "test_type";
    const messageData = "test_data";
    const message = { type: messageType, data: messageData };

    const onMessageMock = jest.fn();
    bridge.onMessage(messageType, onMessageMock);

    const handleMessageEventMock = jest.fn((event: MessageEvent) => {
      const message = JSON.parse(event.data);

      onMessageMock(message);
    });

    (onMessageMock as any).handleMessageEvent = handleMessageEventMock;

    const postMessageMock = jest.fn(() => {
      const mockEvent = new MessageEvent("message", {
        data: JSON.stringify({ type: messageType, data: messageData }),
      });

      window.dispatchEvent(mockEvent);
    });

    const nativeBridge = ReactNativeWebViewBridge.getInstance();
    const mockWebView: Partial<WebView> = { postMessage: postMessageMock };
    const webViewRef = { current: mockWebView } as React.RefObject<WebView>;

    await nativeBridge.postMessage(webViewRef, message);

    expect(onMessageMock).toHaveBeenCalled();
    expect(onMessageMock).toHaveBeenCalledWith({
      type: messageType,
      data: messageData,
    });
  });

  it("should not trigger onMessage event if type does not match", async () => {
    const messageType = "test_type";
    const messageData = "test_data";
    const message = { type: messageType, data: messageData };

    const onMessageMock = jest.fn();
    bridge.onMessage(messageType, onMessageMock);

    const handleMessageEventMock = jest.fn((event: MessageEvent) => {
      const message = JSON.parse(event.data);

      onMessageMock(message);
    });

    (onMessageMock as any).handleMessageEvent = handleMessageEventMock;

    const postMessageMock = jest.fn(() => {
      const mockEvent = new MessageEvent("message", {
        data: JSON.stringify({ type: "test_type2", data: null }),
      });

      window.dispatchEvent(mockEvent);
    });

    const nativeBridge = ReactNativeWebViewBridge.getInstance();
    const mockWebView: Partial<WebView> = { postMessage: postMessageMock };
    const webViewRef = { current: mockWebView } as React.RefObject<WebView>;

    await nativeBridge.postMessage(webViewRef, message);

    expect(onMessageMock).not.toHaveBeenCalled();
  });
});
