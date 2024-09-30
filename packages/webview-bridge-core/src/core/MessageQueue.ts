import { MessagePayload } from "../types/message";

interface QueueItem {
  message: MessagePayload;
  resolve: (
    value: { success: boolean } | PromiseLike<{ success: boolean }>
  ) => void;
  reject: (reason?: any) => void;
  attempts: number;
  priority: number;
}

abstract class MessageQueue {
  private queue: QueueItem[] = [];
  private processing: boolean = false;
  private maxRetries = 3;

  public enqueue(
    message: MessagePayload,
    priority: number = 0
  ): Promise<{ success: boolean }> {
    return new Promise((resolve, reject) => {
      this.queue.push({ message, resolve, reject, attempts: 0, priority });
      this.sortQueue();
      this.processQueue();
    });
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  private processQueue(): Promise<{ success: boolean }> | undefined {
    if (this.processing) {
      return;
    }

    this.processing = true;

    while (this.queue.length) {
      const { message, resolve, reject, attempts, priority } =
        this.queue.shift()!;

      try {
        this.handleMessage(message);
        resolve({ success: true });
      } catch (error) {
        console.warn("Error processing message:", error);

        if (this.shouldRetry(attempts, error as Error)) {
          console.log(
            `Retrying message: ${message.type}, attempt: ${attempts + 1}`
          );
          this.queue.push({
            message,
            resolve,
            reject,
            attempts: attempts + 1,
            priority,
          });
        } else {
          reject({ success: false, error });
        }
      }
    }

    this.processing = false;
  }

  abstract handleMessage(message: MessagePayload): void;

  private shouldRetry(attempts: number, error: Error): boolean {
    if (
      error.message === "WebViewRef is not defined" ||
      error.message ===
        "window.ReactNativeWebView is not defined or postMessage is not a function"
    ) {
      return false;
    }

    return attempts < this.maxRetries;
  }
}

export default MessageQueue;
