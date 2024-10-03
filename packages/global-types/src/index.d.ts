declare global {
  interface DocumentEventMap {
    message: MessageEvent;
  }

  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
    MSStream?: any;
  }
}

export {};
