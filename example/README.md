## EVENT-DRIVEN-RN-WEBVIEW-BRIDGE EXAMPLE PROJECT

This repository includes an example project demonstrating the capabilities of the **event-driven-rn-webview-bridge** library, designed to facilitate reliable communication between React Native applications and React-based WebViews. <br />
The example showcases how to implement a seamless integration between a native mobile app and a web-based interface, highlighting the ease of data exchange and event handling.

### What's Inside?

The example project consists of the following key components:

- **React Native App**: This is the main application that hosts the WebView and manages the native functionalities. <br />
  It demonstrates how to initialize the WebView and set up communication channels.

- **React WebView**: A simple React application that runs inside the WebView.<br />
  It interacts with the React Native app by sending and receiving messages.

- **Event Handling Logic**: A structured way to handle events and messages exchanged between the two environments, ensuring robust communication.

### Running the Example

To run the example project, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ghdtjgus76/event-driven-rn-webview-bridge.git
   ```

2. **Install Dependencies**:

   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install

   # Using pnpm
   pnpm install
   ```

3. **Navigate to the Example Directory**:

   ```bash
   cd example
   ```

4. **Run the Application**:

   For Android, use the following command:

   ```bash
   # Using npm
   npm run android

   # Using yarn
   yarn android

   # Using pnpm
   pnpm android
   ```

   For iOS, use:

   ```bash
   # Using npm
   npm run ios

   # Using yarn
   yarn ios

   # Using pnpm
   pnpm ios
   ```

The application should now be running, demonstrating the communication capabilities between the React Native app and the WebView.
