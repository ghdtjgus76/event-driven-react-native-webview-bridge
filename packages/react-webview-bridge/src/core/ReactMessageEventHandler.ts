import BaseMessageEventHandler from "webview-bridge-core/core/BaseMessageEventHandler";
import { MessagePayload } from "webview-bridge-core/types/message";
import { detectEnvironment } from "webview-bridge-core/utils/environment";

class ReactMessageEventHandler extends BaseMessageEventHandler {
  private receiver: Document | Window;

  constructor() {
    super();
    const { isAndroid } = detectEnvironment();
    this.receiver = isAndroid ? document : window;
  }

  public handleMessageEvent = (event: MessageEvent) => {
    try {
      const { data } = event;
      const message: MessagePayload = JSON.parse(data);

      const handler = this.handlers.get(message.type as string);

      handler?.(message);
    } catch (error) {
      console.warn("Failed to handle message:", error);
    }
  };

  public addMessageEventListener() {
    this.receiver.addEventListener(
      "message",
      this.handleMessageEvent as EventListener
    );
  }

  public removeMessageEventListener() {
    this.receiver.removeEventListener(
      "message",
      this.handleMessageEvent as EventListener
    );
  }
}

export default ReactMessageEventHandler;
