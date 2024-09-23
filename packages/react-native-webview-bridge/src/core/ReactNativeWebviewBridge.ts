import { RefObject } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import {
  PluginMap,
  WebViewBridgePluginManager,
} from "webview-bridge-core/core/Plugin";
import { MessagePayload } from "webview-bridge-core/types/message";
import { WebViewBridgeOptions } from "webview-bridge-core/types/bridge";
import ReactNativeMessageEventHandler from "./ReactNativeMessageEventHandler";
import { MessageHandlerFunction } from "webview-bridge-core/core/BaseMessageEventHandler";

class ReactNativeWebViewBridge<P extends PluginMap> {
  private static instance: ReactNativeWebViewBridge<PluginMap> | null = null;
  private pluginManager: WebViewBridgePluginManager<P>;
  private requestId: number = 0;
  private messageEventHandler: ReactNativeMessageEventHandler;

  private constructor(options?: WebViewBridgeOptions<P>) {
    this.pluginManager = new WebViewBridgePluginManager(options?.plugins);
    this.messageEventHandler = new ReactNativeMessageEventHandler();
  }

  public cleanup() {
    this.pluginManager.cleanup();
    ReactNativeWebViewBridge.instance = null;
  }

  public static getInstance<P extends PluginMap>(options?: {
    plugins: P;
  }): ReactNativeWebViewBridge<P> {
    if (!this.instance) {
      this.instance = new ReactNativeWebViewBridge(options);
    }

    return this.instance as ReactNativeWebViewBridge<P>;
  }

  public triggerPluginActions<K extends keyof P>(
    pluginName: K,
    ...args: Parameters<P[K]["execute"]>
  ) {
    this.pluginManager.triggerPluginActions(pluginName, ...args);
  }

  public postMessage(
    webViewRef: RefObject<WebView>,
    message: {
      type: MessagePayload["type"];
      data: MessagePayload["data"];
    }
  ): Promise<{ success: boolean }> {
    const requestId = this.generateRequestId();
    const requestMessage = JSON.stringify({ ...message, requestId });

    return new Promise((resolve, reject) => {
      try {
        if (webViewRef.current) {
          webViewRef.current.postMessage(requestMessage);

          resolve({ success: true });
        } else {
          reject(new Error("WebViewRef is not defined"));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public addMessageHandler(
    type: MessagePayload["type"],
    handler: MessageHandlerFunction
  ) {
    this.messageEventHandler.addHandler(type, handler);
  }

  public onMessage(event: WebViewMessageEvent) {
    this.messageEventHandler.handleMessageEvent(event);
  }

  private generateRequestId(): MessagePayload["requestId"] {
    return `request_${this.requestId++}`;
  }

  public getPlugins() {
    return this.pluginManager.getPlugins();
  }
}

export default ReactNativeWebViewBridge;
