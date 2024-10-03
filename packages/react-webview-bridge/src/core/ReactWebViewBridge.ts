import { MessageHandlerFunction } from "event-driven-webview-bridge-core/core/BaseMessageEventHandler";
import {
  PluginMap,
  WebViewBridgePluginManager,
} from "event-driven-webview-bridge-core/core/Plugin";
import { MessagePayload } from "event-driven-webview-bridge-core/types/message";
import { WebViewBridgeOptions } from "event-driven-webview-bridge-core/types/bridge";
import ReactMessageEventHandler from "./ReactMessageEventHandler";
import ReactMessageQueue from "./ReactMessageQueue";

class ReactWebViewBridge<P extends PluginMap> {
  private static instance: ReactWebViewBridge<PluginMap> | null = null;
  private pluginManager: WebViewBridgePluginManager<P>;
  private messageEventHandler: ReactMessageEventHandler;
  private messageQueue: ReactMessageQueue;

  private constructor(options?: Pick<WebViewBridgeOptions<P>, "plugins">) {
    this.pluginManager = new WebViewBridgePluginManager(options?.plugins);
    this.messageEventHandler = new ReactMessageEventHandler();
    this.messageEventHandler.addMessageEventListener();
    this.messageQueue = new ReactMessageQueue();
  }

  public cleanup() {
    this.messageEventHandler.removeMessageEventListener();
    this.pluginManager.cleanup();
    ReactWebViewBridge.instance = null;
  }

  public static getInstance<P extends PluginMap>(options?: {
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

  public isReactNativeWebView() {
    return !!window.ReactNativeWebView;
  }

  public postMessage(message: {
    type: MessagePayload["type"];
    data: MessagePayload["data"];
  }) {
    const timestamp = this.generateTimestamp();
    const requestMessage = { ...message, timestamp };

    return this.messageQueue.enqueue(requestMessage);
  }

  public onMessage(
    type: MessagePayload["type"],
    handler: MessageHandlerFunction
  ) {
    this.messageEventHandler.addHandler(type, handler);
  }

  private generateTimestamp(): MessagePayload["timestamp"] {
    return Date.now();
  }

  public getPlugins() {
    return this.pluginManager.getPlugins();
  }
}

export default ReactWebViewBridge;
