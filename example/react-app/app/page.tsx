"use client";

import { useEffect, useState } from "react";
import ReactWebViewBridge from "react-webview-bridge";
import { PluginMap } from "webview-bridge-core/core/Plugin";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [messageTransmissionSuccess, setMessageTransmissionSuccess] = useState<
    boolean | null
  >(null);
  const [webViewBridge, setWebViewBridge] =
    useState<ReactWebViewBridge<PluginMap> | null>(null);

  useEffect(() => {
    const bridgeInstance = ReactWebViewBridge.getInstance();
    setWebViewBridge(bridgeInstance);

    bridgeInstance.onMessage("toWebViewMessage", (message) => {
      setMessage(`앱 -> 웹 ${message.type}: ${message.data}`);
    });

    return () => {
      bridgeInstance.cleanup();
    };
  }, []);

  const handleClickPostMessageToRN = async () => {
    if (!webViewBridge) {
      return;
    }

    const response = await webViewBridge.postMessage({
      type: "toRNMessage",
      data: "메시지2",
    });

    setMessageTransmissionSuccess(response.success);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>웹</h1>
      <section style={styles.messageSection}>
        <h4 style={styles.subTitle}>수신한 메시지</h4>
        {message ? (
          <p style={styles.messageText}>{message}</p>
        ) : (
          <p style={styles.messageText}>없음</p>
        )}
      </section>
      <button
        onClick={handleClickPostMessageToRN}
        style={styles.postMessageButton}
      >
        {`웹 -> 앱 메시지 전송`}
      </button>
      <section style={styles.messageTransmissionStatusSection}>
        {messageTransmissionSuccess !== null && (
          <>
            <h4 style={styles.subTitle}>전송 상태</h4>
            <span style={styles.messageTransmissionStatusText}>
              {messageTransmissionSuccess ? "성공" : "실패"}
            </span>
          </>
        )}
      </section>
    </main>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    height: "100vh",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "-10px",
  },
  subTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#555",
    marginBottom: "5px",
  },
  messageSection: {
    width: "100%",
    textAlign: "center" as "center",
  },
  messageText: {
    fontSize: "16px",
    color: "#000",
  },
  postMessageButton: {
    backgroundColor: "#007BFF",
    color: "#FFFFFF",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "5px",
  },
  messageTransmissionStatusSection: {
    minHeight: "120px",
    paddingTop: "5px",
    width: "100%",
    textAlign: "center" as "center",
  },
  messageTransmissionStatusText: {
    fontSize: "16px",
    marginTop: "5px",
  },
};
