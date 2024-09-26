import { RefObject } from "react";
import { WebView } from "react-native-webview";

export interface WebViewBridgeOptions<P> {
  plugins?: P;
  webViewRef: RefObject<WebView>;
}
