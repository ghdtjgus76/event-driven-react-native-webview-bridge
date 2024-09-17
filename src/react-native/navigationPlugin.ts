import { NavigationContainerRef } from "@react-navigation/native";
import { WebViewBridgePlugin } from "../shared/core/Plugin";

type NavigationParams =
  | { action: "push"; params: { screen: string; params?: object } }
  | { action: "pop"; params?: never };

type NavigationPluginOptions = NavigationParams & {
  navigationRef: NavigationContainerRef<any>;
};

export const navigationPlugin = new WebViewBridgePlugin(
  (options: NavigationPluginOptions) => {
    const { action, params, navigationRef } = options;

    if (action === "push") {
      navigationRef.navigate(params.screen, params.params);
      return;
    }

    if (action === "pop" && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }
);
