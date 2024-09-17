import BaseMessageEventHandler from "../shared/BaseMessageEventHandler";

class ReactMessageEventHandler extends BaseMessageEventHandler {
  public addMessageEventListener() {
    window.addEventListener("message", this.handleMessageEvent);
  }

  public removeMessageEventListener() {
    window.removeEventListener("message", this.handleMessageEvent);
  }
}

export default ReactMessageEventHandler;
