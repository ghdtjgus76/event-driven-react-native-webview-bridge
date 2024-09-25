import { RefObject } from "react";
import WebView from "react-native-webview";
import { PluginMap } from "webview-bridge-core/core/Plugin";
import ReactNativeWebViewBridge from "../core/ReactNativeWebViewBridge";

describe("ReactNativeWebViewBridge message handling", () => {
  let bridge: ReactNativeWebViewBridge<PluginMap>;
  let mockWebView: Partial<WebView>;
  let webViewRef: RefObject<WebView>;

  beforeEach(() => {
    mockWebView = {
      postMessage: jest.fn(),
    };
    webViewRef = { current: mockWebView } as RefObject<WebView>;

    bridge = ReactNativeWebViewBridge.getInstance();
  });

  afterEach(() => {
    bridge.cleanup();
    jest.clearAllMocks();
  });

  it("should successfully post a message to the WebView", async () => {
    const message = { type: "test_type", data: "test_data" };

    await bridge.postMessage(webViewRef, message);

    expect(mockWebView.postMessage).toHaveBeenCalled();
  });

  it("should reject if WebViewRef is not defined", async () => {
    webViewRef = { current: null };
    const message = { type: "test_type", data: "test_data" };

    await expect(bridge.postMessage(webViewRef, message)).rejects.toThrow(
      "WebViewRef is not defined"
    );
  });

  it("should trigger the correct onMessage handler when message event occurs", () => {
    const messageType = "test_type";
    const messageData = "test_data";
    const message = { type: messageType, data: messageData };

    const handleMessageEventMock = jest.fn();
    bridge.addMessageHandler(messageType, handleMessageEventMock);

    const mockEvent: any = {
      nativeEvent: {
        data: JSON.stringify(message),
      },
    };

    bridge.onMessage(mockEvent);
    window.dispatchEvent(new MessageEvent("message", mockEvent.nativeEvent));

    expect(handleMessageEventMock).toHaveBeenCalled();
    expect(handleMessageEventMock).toHaveBeenCalledWith(message);
  });

  it("should not trigger onMessage event if type does not match", () => {
    const messageType = "test_type";
    const messageData = "test_data";
    const message = { type: "test_type2", data: messageData };

    const handleMessageEventMock = jest.fn();
    bridge.addMessageHandler(messageType, handleMessageEventMock);

    const mockEvent: any = {
      nativeEvent: {
        data: JSON.stringify(message),
      },
    };

    bridge.onMessage(mockEvent);
    window.dispatchEvent(new MessageEvent("message", mockEvent.nativeEvent));

    expect(handleMessageEventMock).not.toHaveBeenCalled();
  });

  it("should reject if postMessage throws an error", async () => {
    const postMessageMock = jest.fn(() => {
      throw new Error("Test error");
    });
    mockWebView.postMessage = postMessageMock;

    const message = { type: "test_type", data: "test_data" };

    await expect(bridge.postMessage(webViewRef, message)).rejects.toThrow(
      "Test error"
    );
  });
});
