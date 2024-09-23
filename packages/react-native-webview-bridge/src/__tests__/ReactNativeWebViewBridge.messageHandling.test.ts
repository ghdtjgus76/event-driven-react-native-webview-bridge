import { RefObject } from "react";
import WebView from "react-native-webview";
import { PluginMap } from "webview-bridge-core/core/Plugin";
import ReactNativeWebViewBridge from "../core/ReactNativeWebViewBridge";
import ReactNativeMessageEventHandler from "../core/ReactNativeMessageEventHandler";

describe("ReactNativeWebViewBridge message handling", () => {
  let bridge: ReactNativeWebViewBridge<PluginMap>;
  let mockWebView: Partial<WebView>;
  let webViewRef: RefObject<WebView>;
  let addMessageEventListenerSpy: jest.SpyInstance;
  let removeMessageEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    mockWebView = {
      postMessage: jest.fn(),
    };
    webViewRef = { current: mockWebView } as RefObject<WebView>;

    addMessageEventListenerSpy = jest.spyOn(
      ReactNativeMessageEventHandler.prototype,
      "addMessageEventListener"
    );
    removeMessageEventListenerSpy = jest.spyOn(
      ReactNativeMessageEventHandler.prototype,
      "removeMessageEventListener"
    );

    bridge = ReactNativeWebViewBridge.getInstance();
  });

  afterEach(() => {
    bridge.cleanup();
    jest.clearAllMocks();
  });

  it("should initialize the message event listener on instantiation", () => {
    expect(addMessageEventListenerSpy).toHaveBeenCalled();
  });

  it("should remove the message event listener on cleanup", () => {
    bridge.cleanup();
    expect(removeMessageEventListenerSpy).toHaveBeenCalled();
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

    const onMessageMock = jest.fn();
    bridge.onMessage(messageType, onMessageMock);

    const mockEvent = new MessageEvent("message", {
      data: JSON.stringify(message),
    });

    window.dispatchEvent(mockEvent);

    expect(onMessageMock).toHaveBeenCalledWith(message);
  });

  it("should not trigger onMessage event if type does not match", () => {
    const onMessageMock = jest.fn();
    bridge.onMessage("test_type", onMessageMock);

    const mockEvent = new MessageEvent("message", {
      data: JSON.stringify({ type: "test_type2", data: null }),
    });

    window.dispatchEvent(mockEvent);

    expect(onMessageMock).not.toHaveBeenCalled();
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
