import MessageQueue from "event-driven-webview-bridge-core/core/MessageQueue";
import { MessagePayload } from "event-driven-webview-bridge-core/types/message";

class ReactMessageQueue extends MessageQueue {
  handleMessage(message: MessagePayload): void {
    if (
      window.ReactNativeWebView &&
      typeof window.ReactNativeWebView.postMessage === "function"
    ) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } else {
      throw new Error(
        "window.ReactNativeWebView is not defined or postMessage is not a function"
      );
    }
  }
}

export default ReactMessageQueue;
