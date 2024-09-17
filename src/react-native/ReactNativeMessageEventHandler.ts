import BaseMessageEventHandler from "../shared/core/BaseMessageEventHandler";
import { detectEnvironment } from "../shared/utils/environment";

class ReactNativeMessageEventHandler extends BaseMessageEventHandler {
  private environment = detectEnvironment();

  public addMessageEventListener() {
    if (this.environment.os === "Android") {
      document.addEventListener("message", this.handleMessageEvent);
    } else {
      window.addEventListener("message", this.handleMessageEvent);
    }
  }

  public removeMessageEventListener() {
    if (this.environment.os === "Android") {
      document.removeEventListener("message", this.handleMessageEvent);
    } else {
      window.removeEventListener("message", this.handleMessageEvent);
    }
  }
}

export default ReactNativeMessageEventHandler;
