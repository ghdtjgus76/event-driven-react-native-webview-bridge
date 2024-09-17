import BaseMessageEventHandler from "../shared/BaseMessageEventHandler";

class ReactNativeMessageEventHandler extends BaseMessageEventHandler {
  public addMessageEventListener() {
    document.addEventListener("message", this.handleMessageEvent);
    window.addEventListener("message", this.handleMessageEvent);
  }

  public removeMessageEventListener() {
    document.removeEventListener("message", this.handleMessageEvent);
    window.removeEventListener("message", this.handleMessageEvent);
  }
}

export default ReactNativeMessageEventHandler;
