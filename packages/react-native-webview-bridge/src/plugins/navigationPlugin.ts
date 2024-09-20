import {
  NavigationAction,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import { WebViewBridgePlugin } from "shared/core/Plugin";

type NavigationParams =
  | { action: "push"; params: { screen: string; params?: object } }
  | { action: "pop"; params?: never }
  | { action: "replace"; params: { screen: string; params?: object } }
  | {
      action: "reset";
      params: {
        index: number;
        actions: Array<NavigationAction>;
        key?: string | null;
      };
    }
  | {
      action: "setParams";
      params: {
        key: string;
        params: object;
      };
    };

type NavigationPluginOptions = NavigationParams & {
  navigation: NavigationProp<ParamListBase>;
};

export const navigationPlugin = new WebViewBridgePlugin(
  (options: NavigationPluginOptions) => {
    const { action, params, navigation } = options;

    if (action === "push") {
      handlePush(navigation, params);
    } else if (action === "pop") {
      handlePop(navigation);
    } else if (action === "replace") {
      handleReplace(navigation, params);
    } else if (action === "reset") {
      handleReset(navigation, params);
    } else {
      handleSetParams(navigation, params);
    }
  }
);

const handlePush = (
  navigation: NavigationProp<any>,
  params: { screen: string; params?: object }
) => {
  navigation.navigate(params.screen, params.params);
};

const handlePop = (navigation: NavigationProp<any>) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  }
};

const handleReplace = (
  navigation: NavigationProp<any>,
  params: { screen: string; params?: object }
) => {
  navigation.dispatch({
    ...params,
    type: "REPLACE",
  });
};

const handleReset = (
  navigation: NavigationProp<any>,
  params: {
    index: number;
    actions: Array<NavigationAction>;
    key?: string | null;
  }
) => {
  navigation.dispatch({
    ...params,
    type: "RESET",
  });
};

const handleSetParams = (
  navigation: NavigationProp<any>,
  params: { key: string; params: object }
) => {
  navigation.setParams(params);
};
