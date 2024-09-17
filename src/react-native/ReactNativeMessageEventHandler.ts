import BaseMessageEventHandler from "../shared/core/BaseMessageEventHandler";
import { detectEnvironment } from "../shared/utils/environment";

class ReactNativeMessageEventHandler extends BaseMessageEventHandler {
  private os = detectEnvironment().os;

  public addMessageEventListener() {
    if (this.os === "Android") {
      document.addEventListener("message", this.handleMessageEvent);
    } else {
      window.addEventListener("message", this.handleMessageEvent);
    }
  }

  public removeMessageEventListener() {
    if (this.os === "Android") {
      document.removeEventListener("message", this.handleMessageEvent);
    } else {
      window.removeEventListener("message", this.handleMessageEvent);
    }
  }
}

export default ReactNativeMessageEventHandler;
