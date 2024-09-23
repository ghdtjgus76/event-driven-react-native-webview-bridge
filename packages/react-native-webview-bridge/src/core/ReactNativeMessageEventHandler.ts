import { WebViewMessageEvent } from "react-native-webview";
import BaseMessageEventHandler from "webview-bridge-core/core/BaseMessageEventHandler";
import { MessagePayload } from "webview-bridge-core/types/message";

class ReactNativeMessageEventHandler extends BaseMessageEventHandler {
  constructor() {
    super();
  }

  public handleMessageEvent = (event: WebViewMessageEvent) => {
    try {
      const { data } = event.nativeEvent;
      const message: MessagePayload = JSON.parse(data);

      const handler = this.handlers.get(message.type as string);

      if (handler) {
        handler(message);
      }
    } catch (error) {
      console.error("Failed to handle message:", error);
    }
  };
}

export default ReactNativeMessageEventHandler;
