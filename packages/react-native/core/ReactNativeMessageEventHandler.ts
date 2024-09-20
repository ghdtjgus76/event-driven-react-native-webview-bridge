import BaseMessageEventHandler from "../../shared/core/BaseMessageEventHandler";
import { detectEnvironment } from "../../shared/utils/environment";

class ReactNativeMessageEventHandler extends BaseMessageEventHandler {
  private isAndroid: boolean;

  constructor() {
    super();
    this.isAndroid = detectEnvironment().isAndroid;
  }

  public addMessageEventListener() {
    if (this.isAndroid) {
      document.addEventListener("message", this.handleMessageEvent);
    } else {
      window.addEventListener("message", this.handleMessageEvent);
    }
  }

  public removeMessageEventListener() {
    if (this.isAndroid) {
      document.removeEventListener("message", this.handleMessageEvent);
    } else {
      window.removeEventListener("message", this.handleMessageEvent);
    }
  }
}

export default ReactNativeMessageEventHandler;
