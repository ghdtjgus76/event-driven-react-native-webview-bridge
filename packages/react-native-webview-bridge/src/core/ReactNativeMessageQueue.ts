import { RefObject } from "react";
import WebView from "react-native-webview";
import MessageQueue from "event-driven-webview-bridge-core/core/MessageQueue";
import { MessagePayload } from "event-driven-webview-bridge-core/types/message";

class ReactNativeMessageQueue extends MessageQueue {
  private webViewRef: RefObject<WebView>;

  constructor(webViewRef: RefObject<WebView>) {
    super();
    this.webViewRef = webViewRef;
  }

  handleMessage(message: MessagePayload): void {
    if (this.webViewRef.current) {
      this.webViewRef.current.postMessage(JSON.stringify(message));
    } else {
      throw new Error("WebViewRef is not defined");
    }
  }
}

export default ReactNativeMessageQueue;
