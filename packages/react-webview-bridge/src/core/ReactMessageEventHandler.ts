import BaseMessageEventHandler from "webview-bridge-core/core/BaseMessageEventHandler";
import { MessagePayload } from "webview-bridge-core/types/message";
import { detectEnvironment } from "webview-bridge-core/utils/environment";

class ReactMessageEventHandler extends BaseMessageEventHandler {
  private isAndroid: boolean;

  constructor() {
    super();
    this.isAndroid = detectEnvironment().isAndroid;
  }

  public handleMessageEvent = (event: MessageEvent) => {
    try {
      const { data } = event;
      const message: MessagePayload = JSON.parse(data);

      const handler = this.handlers.get(message.type as string);

      if (handler) {
        handler(message);
      }
    } catch (error) {
      console.error("Failed to handle message:", error);
    }
  };

  public addMessageEventListener() {
    if (this.isAndroid) {
      document.addEventListener("message", this.handleMessageEvent);
    } else if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("message", this.handleMessageEvent);
    }
  }

  public removeMessageEventListener() {
    if (this.isAndroid) {
      document.removeEventListener("message", this.handleMessageEvent);
    } else if (typeof window !== "undefined" && window.removeEventListener) {
      window.removeEventListener("message", this.handleMessageEvent);
    }
  }
}

export default ReactMessageEventHandler;
