## EVENT-DRIVEN-WEBVIEW-BRIDGE-REACT-NATIVE

The `event-driven-webview-bridge-react-native` library enables seamless and structured communication between React Native applications and web content within WebViews. <br />
By utilizing an event-driven architecture, it allows the native layers to send messages, trigger actions, and handle responses with ease.<br />
The library provides a plugin-based design for extending functionality, ensuring that complex interactions are managed efficiently. <br />
Additionally, it includes built-in mechanisms for type safety, message queuing, and error handling, making it a robust solution for integrating React Native and web-based interfaces.

### Key Features

- **Event-Driven Communication**: Centralized event handling for all message exchanges between the native app and WebView.

- **Plugin-Based Architecture**: Easily extend the bridge's functionality using plugins for different purposes such as navigation, state management, and custom logic.

- **Promise-Based Messaging**: All messages sent to the WebView are handled asynchronously, making it straightforward to manage request-response patterns.

- **Type Safety**: Enjoy type inference for all communication-related code, reducing runtime errors and improving developer experience.

- **Queue Management**: A built-in queue mechanism for handling message delivery to the WebView, ensuring reliable communication even when the WebView is not ready.

- **Guaranteed Message Order**: All outgoing messages are processed using a timestamp-based sequential handling mechanism, ensuring that messages are delivered in the correct order even when multiple messages are sent concurrently.

### Installation

Install the package via your preferred package manager:

```bash
# Using npm
npm install event-driven-webview-bridge-react-native

# Using yarn
yarn add event-driven-webview-bridge-react-native

# Using pnpm
pnpm add event-driven-webview-bridge-react-native
```

Ensure that you have react-native-webview installed in your project as well:

```bash
# Using npm
npm install react-native-webview

# Using yarn
yarn add react-native-webview

# Using pnpm
pnpm add react-native-webview
```

### Getting Started

The basic setup involves creating a bridge instance, registering plugins, and managing communication events. <br />Here's a quick overview:

1. Set up the Bridge
   Import the library and initialize the bridge by providing a WebView reference.

   ```typescript
   import React, { useRef } from "react";
   import { WebView } from "react-native-webview";
   import ReactNativeWebViewBridge from "event-driven-webview-bridge-react-native";

   const App = () => {
     const webViewRef = useRef<WebView>(null);

     // Initialize the bridge with plugins and WebView reference
     const bridge = ReactNativeWebViewBridge.getInstance({
       plugins: {
         // Define your custom plugins here
       },
       webViewRef,
     });

     return (
       <WebView
         ref={webViewRef}
         source={{ uri: "https://your-web-content-url" }}
         onMessage={(event) => bridge.onMessage(event)}
       />
     );
   };

   export default App;
   ```

2. **Trigger Plugin Actions**  
   The library's plugin-based architecture allows you to modularize your logic. <br />After defining your plugins during the bridge initialization (`getInstance`), you can easily trigger their actions using the bridge.

   ```typescript
   // Trigger plugin actions with parameters specific to your plugin after specifying the plugin name.
   bridge.triggerPluginActions("yourPluginName", {
     /* your parameters here */
   });
   ```

3. **Post Messages to WebView**
   Use the postMessage method to send data to the WebView and receive a response asynchronously.

   ```typescript
   const response = await bridge.postMessage({
     type: "navigation",
     data: { targetScreen: "HomePage" },
   });
   ```

4. **Handle Incoming Messages**  
   Set up message handlers to properly process and respond to messages sent from the WebView to the native application. This ensures smooth communication and allows your app to react to various events triggered from the web content.

   ```typescript
   import React, { useRef } from "react";
   import { WebView } from "react-native-webview";
   import ReactNativeWebViewBridge from "event-driven-webview-bridge-react-native";

   const App = () => {
     const webViewRef = useRef<WebView>(null);

     const onMessage = (event: WebViewMessageEvent) => {
       bridge.onMessage(event);
     };

     return (
       <WebView
         ref={webViewRef}
         source={{ uri: "https://your-web-content-url" }}
         onMessage={onMessage}
       />
     );
   };

   export default App;
   ```

### Plugin-Based Architecture

One of the core strengths of `event-driven-webview-bridge-react-native` is its plugin-based design. <br />You can define and use plugins to encapsulate specific logic and manage complex interactions.

**Creating a Plugin**

To create a plugin, define a module that adheres to the following interface:

```typescript
import { WebViewBridgePlugin } from "event-driven-webview-bridge-core/core/Plugin";

interface WebViewBridgePlugin {
  execute: (params: any) => void;
  cleanup?: () => void;
}
```

```typescript
const customPlugin = new WebViewBridgePlugin((message: string) => {
  console.log("Custom plugin executed with:", message);
});
```

**Adding Plugins to the Bridge**

Plugins can be registered during the bridge initialization:

```typescript
const bridge = ReactNativeWebViewBridge.getInstance({
  plugins: { customPlugin },
  webViewRef,
});
```

### API Reference

**Class: ReactNativeWebViewBridge<P extends PluginMap>**

This class manages the communication between a React Native app and a WebView by using a plugin system. <br />It allows for sending messages, triggering plugin actions, and handling incoming messages from the WebView.

### Properties

- **pluginManager**:

  - An instance of `WebViewBridgePluginManager` responsible for managing registered plugins.

- **messageEventHandler**:

  - An instance of `ReactNativeMessageEventHandler` that handles incoming message events.

- **messageQueue**:

  - An instance of `ReactNativeMessageQueue` that manages the queuing of messages sent to the WebView.

- **webViewRef**:
  - A reference to the React Native WebView instance.

### Static Methods

**`getInstance<P extends PluginMap>(options: WebBridgeOptions<P>): ReactNativeWebViewBridge<P>`**

- **Description**:

  - Retrieves the singleton instance of `ReactNativeWebViewBridge`. If no instance exists, it creates one with the provided options.

- **Parameters**:

  - `options`: An object containing the following properties:
    - `plugins`: An object mapping plugin names to their instances.
    - `webViewRef`: A reference to the WebView component.

- **Returns**:
  - An instance of `ReactNativeWebViewBridge`.

### Instance Methods

**`cleanup(): void`**

- **Description**:

  - Cleans up the plugin manager and resets the singleton instance.

- **Returns**:
  - None.

**`triggerPluginActions<K extends keyof P>(pluginName: K, ...args: Parameters<P[K]["execute"]>): void`**

- **Description**:

  - Triggers actions defined in the specified plugin with the provided arguments.

- **Parameters**:

  - `pluginName`: The name of the plugin to trigger.
  - `...args`: The arguments to pass to the plugin's execute method.

- **Returns**:
  - None.

**`postMessage(message: { type: MessagePayload["type"]; data: MessagePayload["data"] }): Promise<{ success: boolean }>`**

- **Description**:

  - Sends a message to the WebView, adding a timestamp to the message.

- **Parameters**:

  - `message`: An object containing:
    - `type`: The type of the message.
    - `data`: The payload of the message.

- **Returns**:
  - A Promise that resolves to an object indicating success.

**`addMessageHandler(type: MessagePayload["type"], handler: MessageHandlerFunction): void`**

- **Description**:

  - Adds a message handler for a specific message type.

- **Parameters**:

  - `type`: The type of message to handle.
  - `handler`: A function that handles the message event.

- **Returns**:
  - None.

**`onMessage(event: WebViewMessageEvent): void`**

- **Description**:

  - Handles incoming message events from the WebView.

- **Parameters**:

  - `event`: The WebView message event.

- **Returns**:
  - None.

**`getPlugins(): P`**

- **Description**:

  - Returns the list of registered plugins.

- **Returns**:
  - An object mapping plugin names to their instances.

### Contributing

We welcome contributions! <br />Please see our Contributing Guide for details on how to get involved.

### License

`event-driven-webview-bridge-react-native` is licensed under the MIT License. <br />See the LICENSE file for more information.
