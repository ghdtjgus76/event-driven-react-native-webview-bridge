import { MessagePayload } from "../shared/types";

export type MessageHandlerFunction = (message: MessagePayload) => void;

abstract class BaseMessageEventHandler {
  protected handlers: Map<string, MessageHandlerFunction> = new Map();

  public addHandler(type: string, handler: MessageHandlerFunction) {
    this.handlers.set(type, handler);
  }

  public removeHandler(type: string) {
    const handler = this.handlers.get(type);

    if (handler) {
      this.handlers.delete(type);
    }
  }

  protected handleMessageEvent = (event: MessageEvent) => {
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

  abstract addMessageEventListener(): void;

  abstract removeMessageEventListener(): void;
}

export default BaseMessageEventHandler;
