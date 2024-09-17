interface Window {
  ReactNativeWebView: {
    postMessage: (message: string) => void;
  };
  MSStream?: any;
}
