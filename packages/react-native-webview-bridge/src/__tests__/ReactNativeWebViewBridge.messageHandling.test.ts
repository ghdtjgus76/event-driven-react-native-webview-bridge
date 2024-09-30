import { RefObject } from "react";
import WebView from "react-native-webview";
import { PluginMap } from "webview-bridge-core/core/Plugin";
import ReactNativeWebViewBridge from "../core/ReactNativeWebViewBridge";

describe("ReactNativeWebViewBridge message handling", () => {
  it("should successfully post a message to the WebView", async () => {
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;
    const bridge = ReactNativeWebViewBridge.getInstance({ webViewRef });

    const message = { type: "test_type", data: "test_data" };

    await bridge.postMessage(message);

    expect(mockWebView.postMessage).toHaveBeenCalled();

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should reject if WebViewRef is not defined without retrying same postMessage logic", async () => {
    const webViewRef = { current: null };
    const bridge = ReactNativeWebViewBridge.getInstance({ webViewRef });
    const message = { type: "test_type", data: "test_data" };
    bridge.postMessage = jest.fn(bridge.postMessage.bind(bridge));

    await expect(bridge.postMessage(message)).rejects.toEqual(
      expect.objectContaining({
        success: false,
        error: new Error("WebViewRef is not defined"),
      })
    );

    expect(bridge.postMessage).toHaveBeenCalledTimes(1);

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should trigger the correct onMessage handler when message event occurs", () => {
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;
    const bridge = ReactNativeWebViewBridge.getInstance({ webViewRef });

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

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should not trigger onMessage event if type does not match", () => {
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;
    const bridge = ReactNativeWebViewBridge.getInstance({ webViewRef });

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

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should reject if postMessage throws an error", async () => {
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;
    const bridge = ReactNativeWebViewBridge.getInstance({ webViewRef });

    const postMessageMock = jest.fn(() => {
      throw new Error("Test error");
    });
    mockWebView.postMessage = postMessageMock;

    const message = { type: "test_type", data: "test_data" };

    await expect(bridge.postMessage(message)).rejects.toEqual(
      expect.objectContaining({
        success: false,
        error: new Error("Test error"),
      })
    );

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });

  it("should retry postMessage when it fails ", async () => {
    const mockWebView: Partial<WebView> = {
      postMessage: jest.fn(),
    };
    const webViewRef = { current: mockWebView } as RefObject<WebView>;
    const bridge = ReactNativeWebViewBridge.getInstance({ webViewRef });
    bridge.postMessage = jest.fn(bridge.postMessage.bind(bridge));
    const message = { type: "test_type", data: "test_data" };

    const postMessageMock = jest.fn(() => {
      throw new Error("Test error");
    });
    mockWebView.postMessage = postMessageMock;

    await expect(bridge.postMessage(message)).rejects.toEqual(
      expect.objectContaining({
        success: false,
        error: new Error("Test error"),
      })
    );

    expect(await bridge.postMessage(message)).toHaveBeenCalledTimes(4);

    ReactNativeWebViewBridge.getInstance({ webViewRef }).cleanup();
    jest.clearAllMocks();
  });
});
