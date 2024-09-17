import { NavigationContainerRef } from "@react-navigation/native";
import { WebViewBridgePlugin } from "../shared/core/Plugin";

type NavigationParams =
  | { action: "push"; params: { screen: string; params?: object } }
  | { action: "pop"; params?: never };

export const navigationPlugin = new WebViewBridgePlugin(
  (args: NavigationParams & { navigationRef: NavigationContainerRef<any> }) => {
    const { action, params, navigationRef } = args;

    if (action === "push") {
      navigationRef.navigate(params.screen, params.params);
      return;
    }

    if (action === "pop" && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }
);
