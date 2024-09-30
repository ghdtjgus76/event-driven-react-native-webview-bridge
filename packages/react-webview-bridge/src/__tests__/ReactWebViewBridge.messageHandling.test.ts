import { PluginMap } from "webview-bridge-core/core/Plugin";
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

  it("should reject if window.ReactNativeWebView is not defined without retrying same postMessage logic", async () => {
    (window as any).ReactNativeWebView = undefined;
    const message = {
      type: "test_type",
      data: "test_data",
    };
    bridge.postMessage = jest.fn(bridge.postMessage.bind(bridge));

    await expect(bridge.postMessage(message)).rejects.toEqual(
      expect.objectContaining({
        success: false,
        error: new Error(
          "window.ReactNativeWebView is not defined or postMessage is not a function"
        ),
      })
    );

    expect(bridge.postMessage).toHaveBeenCalledTimes(1);
  });

  it("should reject if postMessage throws an error", async () => {
    const postMessageMock = jest.fn(() => {
      throw new Error("Test error");
    });
    (window as any).ReactNativeWebView = { postMessage: postMessageMock };
    const message = {
      type: "test_type",
      data: "test_data",
    };

    await expect(bridge.postMessage(message)).rejects.toEqual(
      expect.objectContaining({
        success: false,
        error: new Error("Test error"),
      })
    );
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

  it("should retry postMessage when it fails (retries three times on failure before ultimately failing)", async () => {
    const postMessageMock = jest.fn(() => {
      throw new Error("Test error2");
    });
    (window as any).ReactNativeWebView = { postMessage: postMessageMock };
    const message = {
      type: "test_type",
      data: "test_data",
    };

    await expect(bridge.postMessage(message)).rejects.toEqual(
      expect.objectContaining({
        success: false,
        error: new Error("Test error2"),
      })
    );

    expect(postMessageMock).toHaveBeenCalledTimes(4);
  });

  it("should retry postMessage when it fails (retries three times on failure before succeeding)", async () => {
    let callCount = 0;
    const postMessageMock = jest.fn(() => {
      callCount++;
      if (callCount < 3) {
        throw new Error("Test error");
      }
      return;
    });
    (window as any).ReactNativeWebView = { postMessage: postMessageMock };
    const message = {
      type: "test_type",
      data: "test_data",
    };

    await expect(bridge.postMessage(message)).resolves.toEqual(
      expect.objectContaining({
        success: true,
      })
    );

    expect(postMessageMock).toHaveBeenCalledTimes(3);
  });

  it("should process messages in order of priority (higher priority first)", () => {});

  it("should handle messages with equal priority in the order they were enqueued", () => {});
});
