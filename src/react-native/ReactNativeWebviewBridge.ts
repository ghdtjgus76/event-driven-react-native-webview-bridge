import { RefObject } from "react";
import { WebView } from "react-native-webview";
import { PluginMap, WebViewBridgePluginManager } from "../shared/Plugin";
import { MessagePayload, WebViewBridgeOptions } from "../shared/types";
import ReactNativeMessageEventHandler from "./ReactNativeMessageEventHandler";
import { MessageHandlerFunction } from "../shared/BaseMessageEventHandler";

class ReactNativeWebViewBridge<P extends PluginMap> {
  private static instance: ReactNativeWebViewBridge<PluginMap>;
  private pluginManager: WebViewBridgePluginManager<P>;
  private requestId: number = 0;
  private messageEventHandler: ReactNativeMessageEventHandler;

  private constructor(options?: WebViewBridgeOptions<P>) {
    this.pluginManager = new WebViewBridgePluginManager(options.plugins);
    this.messageEventHandler = new ReactNativeMessageEventHandler();
    this.messageEventHandler.addMessageEventListener();
  }

  public cleanup() {
    this.messageEventHandler.removeMessageEventListener();
  }

  public static getInstance<P extends PluginMap>(options: {
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
    webviewRef: RefObject<WebView>,
    message: {
      type: MessagePayload["type"];
      data: MessagePayload["data"];
    }
  ): Promise<{ success: boolean }> {
    const requestId = this.generateRequestId();
    const requestMessage = JSON.stringify({ ...message, requestId });

    return new Promise((resolve, reject) => {
      try {
        if (webviewRef.current) {
          webviewRef.current.postMessage(requestMessage);

          resolve({ success: true });
        } else {
          reject(new Error("WebviewRef is not defined"));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public onMessage(
    type: MessagePayload["type"],
    handler: MessageHandlerFunction
  ) {
    this.messageEventHandler.addHandler(type, handler);
  }

  private generateRequestId(): MessagePayload["requestId"] {
    return `request_${this.requestId++}`;
  }
}

export default ReactNativeWebViewBridge;
