"use client";

import { useEffect, useState } from "react";
import ReactWebViewBridge from "react-webview-bridge";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [messageTransmissionSuccess, setMessageTransmissionSuccess] = useState<
    boolean | null
  >(null);

  const webViewBridge = ReactWebViewBridge.getInstance();

  useEffect(() => {
    webViewBridge.onMessage("toWebViewMessage", (message) => {
      setMessage(`앱 -> 웹 ${message.type}: ${message.data}`);
    });
  }, []);

  const handleClickPostMessageToRN = async () => {
    const response = await webViewBridge.postMessage({
      type: "toRNMessage",
      data: "메시지2",
    });

    setMessageTransmissionSuccess(response.success);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.header}>웹</h1>
      <section style={styles.messageSection}>
        <h4 style={styles.subHeader}>수신한 메시지</h4>
        {message ? (
          <p style={styles.messageText}>{message}</p>
        ) : (
          <p style={styles.messageText}>없음</p>
        )}
      </section>
      <button onClick={handleClickPostMessageToRN} style={styles.sendButton}>
        {`웹 -> 앱 메시지 전송`}
      </button>
      <section style={styles.statusSection}>
        {messageTransmissionSuccess !== null && (
          <>
            <h4 style={styles.subHeader}>전송 상태</h4>
            <span style={styles.statusText}>
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
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  subHeader: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#555",
    marginBottom: "5px",
  },
  messageSection: {
    width: "100%",
    textAlign: "center" as "center",
    margin: "5px 0",
  },
  messageText: {
    fontSize: "16px",
    color: "#000",
  },
  sendButton: {
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
  statusSection: {
    minHeight: "120px",
    paddingTop: "5px",
    width: "100%",
    textAlign: "center" as "center",
  },
  statusText: {
    fontSize: "16px",
    marginTop: "5px",
  },
};
