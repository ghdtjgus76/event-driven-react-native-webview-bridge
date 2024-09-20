export interface MessagePayload {
  type: string;
  data: any;
  requestId: `request_${number}`;
}
