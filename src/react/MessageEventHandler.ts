import { MessagePayload } from "../shared/types";

export type MessageHandlerFunction = (message: MessagePayload) => void;

class MessageEventHandler {
  private handlers: Map<string, MessageHandlerFunction> = new Map();

  public addHandler(type: string, handler: MessageHandlerFunction) {
    this.handlers.set(type, handler);
  }

  public removeHandler(type: string) {
    const handler = this.handlers.get(type);

    if (handler) {
      this.handlers.delete(type);
    }
  }

  private handleMessageEvent = (event: MessageEvent) => {
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
    window.addEventListener("message", this.handleMessageEvent);
  }

  public removeMessageEventListener() {
    window.removeEventListener("message", this.handleMessageEvent);
  }
}

export default MessageEventHandler;
