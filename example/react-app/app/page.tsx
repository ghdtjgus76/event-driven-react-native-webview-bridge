"use client";

import { useEffect, useState } from "react";
import ReactWebViewBridge from "react-webview-bridge";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messageTransmissionSuccess, setMessageTransmissionSuccess] =
    useState(false);

  const webViewBridge = ReactWebViewBridge.getInstance();

  useEffect(() => {
    webViewBridge.onMessage("message1", (message) => {
      setMessage(`앱 -> 웹 ${message.type}: ${message.data}`);
    });

    const response = webViewBridge.postMessage({
      type: "message2",
      data: "메시지2",
    });
    response.then((res) => setMessageTransmissionSuccess(res.success));
  }, []);

  return (
    <main>
      <h1>웹</h1>
      <p>{message}</p>
      <p>{`웹 -> 앱 메시지2 전송 상태: ${
        messageTransmissionSuccess ? "성공" : "실패"
      }`}</p>
    </main>
  );
}
