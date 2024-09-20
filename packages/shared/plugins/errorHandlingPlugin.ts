import { WebViewBridgePlugin } from "../core/Plugin";

interface ErrorHandlingPluginOptions {
  error: {
    message: string;
    stack?: string;
    name?: string;
  };
}

export const errorHandlingPlugin = new WebViewBridgePlugin(
  (options: ErrorHandlingPluginOptions) => {
    const { error } = options;
    const { message, stack, name } = error;

    console.error("Error Name:", name);
    console.error("Error Message:", message);

    if (stack) {
      console.error("Stack Trace:", stack);
    }
  }
);
