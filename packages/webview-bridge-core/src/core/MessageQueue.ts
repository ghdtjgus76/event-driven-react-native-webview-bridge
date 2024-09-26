import { MessagePayload } from "../types/message";

interface QueueItem {
  message: MessagePayload;
  resolve: (
    value: { success: boolean } | PromiseLike<{ success: boolean }>
  ) => void;
  reject: (reason?: any) => void;
  attempts: number;
}

abstract class MessageQueue {
  private queue: QueueItem[] = [];
  private processing: boolean = false;
  private maxRetries = 3;

  public enqueue(message: MessagePayload): Promise<{ success: boolean }> {
    return new Promise((resolve, reject) => {
      this.queue.push({ message, resolve, reject, attempts: 0 });
      this.processQueue();
    });
  }

  private processQueue(): Promise<{ success: boolean }> | undefined {
    if (this.processing) {
      return;
    }

    this.processing = true;

    while (this.queue.length) {
      const { message, resolve, reject, attempts } = this.queue.shift()!;

      try {
        this.handleMessage(message);
        resolve({ success: true });
      } catch (error) {
        console.error("Error processing message:", error);

        if (attempts < this.maxRetries) {
          console.log(
            `Retrying message: ${message.type}, attempt: ${attempts + 1}`
          );
          this.queue.push({ message, resolve, reject, attempts: attempts + 1 });
        } else {
          reject({ success: false, error });
        }
      }
    }

    this.processing = false;
  }

  abstract handleMessage(message: MessagePayload): void;
}

export default MessageQueue;
