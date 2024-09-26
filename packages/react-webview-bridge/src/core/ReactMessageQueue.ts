import MessageQueue from "webview-bridge-core/core/MessageQueue";
import { MessagePayload } from "webview-bridge-core/types/message";

class ReactMessageQueue extends MessageQueue {
  handleMessage(message: MessagePayload): void {
    if (
      window.ReactNativeWebView &&
      typeof window.ReactNativeWebView.postMessage === "function"
    ) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } else {
      throw new Error(
        "ReactNativeWebView is not defined or postMessage is not a function"
      );
    }
  }
}

export default ReactMessageQueue;
