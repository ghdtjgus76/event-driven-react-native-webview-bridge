interface Window {
  ReactNativeWebView: {
    postMessage: (message: string) => void;
  };
  MSStream?: any;
}

interface DocumentEventMap {
  message: MessageEvent;
}
