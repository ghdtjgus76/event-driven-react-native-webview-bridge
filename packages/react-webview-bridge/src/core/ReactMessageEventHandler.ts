import BaseMessageEventHandler from "webview-bridge-core/core/BaseMessageEventHandler";
import { detectEnvironment } from "webview-bridge-core/utils/environment";

class ReactMessageEventHandler extends BaseMessageEventHandler {
  private isAndroid: boolean;

  constructor() {
    super();
    this.isAndroid = detectEnvironment().isAndroid;
  }

  public addMessageEventListener() {
    if (this.isAndroid) {
      document.addEventListener("message", this.handleMessageEvent);
    } else if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("message", this.handleMessageEvent);
    }
  }

  public removeMessageEventListener() {
    if (this.isAndroid) {
      document.removeEventListener("message", this.handleMessageEvent);
    } else if (typeof window !== "undefined" && window.removeEventListener) {
      window.removeEventListener("message", this.handleMessageEvent);
    }
  }
}

export default ReactMessageEventHandler;
