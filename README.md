<p align="center">
</p>
<p align="center">
    <h1 align="center">EVENT-DRIVEN-RN-WEBVIEW-BRIDGE</h1>
</p>
<p align="center">
    <em><code>Eliminating Message Loss and Ensuring Reliable Data Exchange Between React Native and WebView</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/ghdtjgus76/event-driven-rn-webview-bridge?style=flat-square&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
</p>

<br>

##### 🔗 Table of Contents

- [📍 Overview](#📍-overview)
- [👾 Features](#👾-features)
- [📦 Installation](#📦-installation)
- [🤖 Usage](#🤖-usage)
- [🤝 Contributing](#🤝-contributing)
- [🎗 License](#🎗-license)

---

## 📍 Overview

The **event-driven-rn-webview-bridge** library facilitates seamless communication between React Native applications and embedded WebView components. <br />
It addresses critical issues related to message loss and ensures reliable data exchange, making it easier for developers to integrate web content into their mobile apps. <br />This library is designed to enhance interoperability while providing a robust solution for message handling.

---

## 👾 Features

The **event-driven-rn-webview-bridge** library offers a range of features to enhance communication between React Native applications and WebView components:

- **Reliable Message Transmission**: Utilizes a Promise-based approach to provide feedback on message sending results, ensuring reliable data exchange.

- **Sequential and Concurrent Message Handling**: Resolves message ordering issues by sorting based on timestamp for sequential processing, while using Promise.allSettled for concurrent execution to maximize efficiency and speed.

- **Automatic Retry Mechanism**: Implements up to three automatic retries for failed message transmissions due to network issues, ensuring higher reliability in message delivery.

- **Cross-Platform Compatibility**: Designed to work seamlessly on both iOS and Android, providing a consistent API for developers.

- **Plugin Architecture**: Supports a modular plugin system that allows developers to extend functionalities without altering the core messaging logic, promoting maintainability and flexibility.

---

### 📦 Installation

### [event-driven-webview-bridge-react](https://www.npmjs.com/package/event-driven-webview-bridge-react)

To install the **event-driven-webview-bridge-react** library for React applications, run one of the following commands:

#### Using npm

```bash
npm install event-driven-webview-bridge-react
```

#### Using yarn

```bash
yarn add event-driven-webview-bridge-react
```

#### Using pnpm

```bash
pnpm add event-driven-webview-bridge-react
```

### [event-driven-webview-bridge-react-native](https://www.npmjs.com/package/event-driven-webview-bridge-react-native)

To install the **event-driven-webview-bridge-react-native** library for React Native applications, use one of the following commands:

#### Using npm

```bash
npm install event-driven-webview-bridge-react-native
```

#### Using yarn

```bash
yarn add event-driven-webview-bridge-react-native
```

#### Using pnpm

```bash
pnpm add event-driven-webview-bridge-react-native
```

### [event-driven-webview-bridge-core](https://www.npmjs.com/package/event-driven-webview-bridge-core)

To install the event-driven-webview-bridge-core library, which includes support for plugins, types, and utility functions, you can use one of the following commands. <br />
This library can be downloaded if needed.

#### Using npm

```bash
npm install event-driven-webview-bridge-core
```

#### Using yarn

```bash
yarn add event-driven-webview-bridge-core
```

#### Using pnpm

```bash
pnpm add event-driven-webview-bridge-core
```

---

### 🤖 Usage

### For React Web Applications

```typescript
import ReactWebViewBridge from "event-driven-webview-bridge-react";

const webviewBridge = ReactWebViewBridge.getInstance();

// Listen for messages coming from the React Native applications
webviewBridge.onMessage("toWebViewMessage", (message) => {
  setMessage(`App -> Web ${message.type}: ${message.data}`);
});

// Send a message from the WebView to the React Native applications
const response = await webViewBridge.postMessage({
  type: "toRNMessage",
  data: "Message 1",
});
```

### For React Native Applications

```typescript
import ReactNativeWebViewBridge from "event-driven-webview-bridge-react-native";

const webviewBridge = ReactNativeWebViewBridge.getInstance();

// Listen for messages coming from the WebView
webviewBridge.onMessage("toRNMessage", (message) => {
  setMessage(`Web -> App ${message.type}: ${message.data}`);
});

// Send a message from the React Native applications to the WebView
const response = await webViewBridge.postMessage({
  type: "toWebViewMessage",
  data: "Message 2",
});
```

### Plugin Usage (React or React Native)

```typescript
import { WebViewBridgePlugin } from "event-driven-webview-bridge-core/core/Plugin";
import ReactWebViewBridge from "event-driven-webview-bridge-react";

// Create a new plugin instance using the defined plugin function
const logMessagePlugin = new WebViewBridgePlugin(pluginFunction);
const plugins = { logMessagePlugin };
// Get the instance of the React WebView Bridge with the registered plugins
const webViewBridge = ReactWebViewBridge.getInstance({ plugins });

// Trigger the plugin action to log a message
webViewBridge.triggerPluginActions("logMessagePlugin", "message");
```

### Message Sending: Sequential and Concurrent Handling (React or React Native)

```typescript
import ReactWebViewBridge from "event-driven-webview-bridge-react";

const webviewBridge = ReactWebViewBridge.getInstance();

// Send messages sequentially
const response1 = await webviewBridge.postMessage({
  type: "sequentialMessage1",
  data: "First message",
});
const response2 = await webviewBridge.postMessage({
  type: "sequentialMessage2",
  data: "Second message",
});

console.log(response1, response2);
// { success: true } { success: true }

// Send messages concurrently
const promises = [
  webviewBridge.postMessage({
    type: "concurrentMessage1",
    data: "Concurrent message 1",
  }),
  webviewBridge.postMessage({
    type: "concurrentMessage2",
    data: "Concurrent message 2",
  }),
];

const response = await Promise.allSettled(promises);

console.log(response);
//[
//  { status: "fulfilled", value: { success: true } },
//  { status: "fulfilled", value: { success: true } }
//]
```

---

## 🤝 Contributing

Contributions are welcome!

**[Report Issues](https://github.com/ghdtjgus76/event-driven-rn-webview-bridge/issues)**: Submit bugs found or log feature requests for the `event-driven-rn-webview-bridge` project.

---

## 🎗 License

This project is licensed under the MIT License. <br />For more details, please refer to the [LICENSE](LICENSE) file.
