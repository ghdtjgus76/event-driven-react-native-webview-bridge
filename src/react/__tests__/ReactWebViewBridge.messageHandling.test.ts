import WebView from "react-native-webview";
import ReactNativeWebViewBridge from "../../react-native/core/ReactNativeWebviewBridge";
import { PluginMap } from "../../shared/core/Plugin";
import ReactWebViewBridge from "../core/ReactWebViewBridge";
import ReactMessageEventHandler from "../core/ReactMessageEventHandler";

describe("ReactWebViewBridge message handling", () => {
  let bridge: ReactWebViewBridge<PluginMap>;
  let addMessageEventListenerSpy: jest.SpyInstance;
  let removeMessageEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    addMessageEventListenerSpy = jest.spyOn(
      ReactMessageEventHandler.prototype,
      "addMessageEventListener"
    );
    removeMessageEventListenerSpy = jest.spyOn(
      ReactMessageEventHandler.prototype,
      "removeMessageEventListener"
    );

    bridge = ReactWebViewBridge.getInstance();
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

  it("should handle postMessage correctly", async () => {
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

  it("should trigger the correct onMessage handler when message event occurs", async () => {
    const messageType = "test_type";
    const onMessageMock = jest.fn();
    bridge.onMessage(messageType, onMessageMock);

    const mockEvent = new MessageEvent("message", {
      data: JSON.stringify({ type: messageType, data: "test_data" }),
    });
    window.dispatchEvent(mockEvent);

    expect(onMessageMock).toHaveBeenCalledWith({
      type: messageType,
      data: "test_data",
    });
  });

  it("should not trigger onMessage event if type does not match", async () => {
    const onMessageMock = jest.fn();
    bridge.onMessage("test_type", onMessageMock);

    const mockEvent = new MessageEvent("message", {
      data: JSON.stringify({ type: "test_type2", data: null }),
    });
    window.dispatchEvent(mockEvent);

    expect(onMessageMock).not.toHaveBeenCalled();
  });
});
