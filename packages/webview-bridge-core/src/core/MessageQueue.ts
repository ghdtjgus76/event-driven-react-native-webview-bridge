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
  private batchInterval = 100;
  private batchTimeout: NodeJS.Timeout | null = null;

  public enqueue(message: MessagePayload): Promise<{ success: boolean }> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        message,
        resolve,
        reject,
        attempts: 0,
      });
      this.sortQueue();

      if (!this.batchTimeout) {
        this.startBatchProcessing();
      }
    });
  }

  private startBatchProcessing() {
    this.batchTimeout = setTimeout(() => {
      this.processQueue();
      this.batchTimeout = null;
    }, this.batchInterval);
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => a.message.timestamp - b.message.timestamp);
  }

  private async processQueue(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;

    const promises = [];

    while (this.queue.length) {
      const { message, resolve, reject, attempts } = this.queue.shift()!;

      promises.push(
        (async () => {
          try {
            this.handleMessage(message);
            resolve({ success: true });
          } catch (error) {
            console.warn("메시지 처리 중 오류 발생:", error);

            if (this.shouldRetry(attempts, error as Error)) {
              console.log(
                `메시지 재시도: ${message.type}, 시도 횟수: ${attempts + 1}`
              );
              this.queue.push({
                message,
                resolve,
                reject,
                attempts: attempts + 1,
              });
            } else {
              reject({ success: false, error });
            }
          }
        })()
      );
    }

    await Promise.allSettled(promises);

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
