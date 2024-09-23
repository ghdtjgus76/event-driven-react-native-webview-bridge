import { MessagePayload } from "../types/message";

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

  abstract handleMessageEvent(event: unknown): void;
}

export default BaseMessageEventHandler;
