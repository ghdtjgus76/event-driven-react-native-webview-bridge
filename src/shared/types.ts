export interface WebViewBridgeOptions<P> {
  plugins?: P;
}

export interface MessagePayload {
  type: string;
  data: any;
  requestId: `request_${number}`;
}
