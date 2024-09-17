import { MessageHandlerFunction } from "../shared/core/BaseMessageEventHandler";
import { PluginMap, WebViewBridgePluginManager } from "../shared/core/Plugin";
import { WebViewBridgeOptions, MessagePayload } from "../shared/types/types";
import ReactMessageEventHandler from "./ReactMessageEventHandler";

class ReactWebViewBridge<P extends PluginMap> {
  private static instance: ReactWebViewBridge<PluginMap>;
  private pluginManager: WebViewBridgePluginManager<P>;
  private requestId: number = 0;
  private messageEventHandler: ReactMessageEventHandler;

  private constructor(options?: WebViewBridgeOptions<P>) {
    this.pluginManager = new WebViewBridgePluginManager(options.plugins);
    this.messageEventHandler = new ReactMessageEventHandler();
    this.messageEventHandler.addMessageEventListener();
  }

  public cleanup() {
    this.messageEventHandler.removeMessageEventListener();
  }

  public static getInstance<P extends PluginMap>(options: {
    plugins: P;
  }): ReactWebViewBridge<P> {
    if (!this.instance) {
      this.instance = new ReactWebViewBridge(options);
    }

    return this.instance as ReactWebViewBridge<P>;
  }

  public triggerPluginActions<K extends keyof P>(
    pluginName: K,
    ...args: Parameters<P[K]["execute"]>
  ) {
    this.pluginManager.triggerPluginActions(pluginName, ...args);
  }

  public postMessage(message: {
    type: MessagePayload["type"];
    data: MessagePayload["data"];
  }): Promise<{ success: boolean }> {
    const requestId = this.generateRequestId();
    const requestMessage = JSON.stringify({ ...message, requestId });

    return new Promise((resolve, reject) => {
      try {
        if (
          window.ReactNativeWebView &&
          typeof window.ReactNativeWebView.postMessage === "function"
        ) {
          window.ReactNativeWebView.postMessage(requestMessage);

          resolve({ success: true });
        } else {
          reject(
            new Error(
              "ReactNativeWebView is not defined or postMessage is not a function"
            )
          );
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

export default ReactWebViewBridge;
