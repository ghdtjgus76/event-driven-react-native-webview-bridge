import React, {useRef} from 'react';
import {Alert, Dimensions, SafeAreaView, StyleSheet} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import ReactNativeWebViewBridge from 'react-native-webview-bridge';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const App = () => {
  const webViewRef = useRef<WebView | null>(null);
  const webViewBridge = ReactNativeWebViewBridge.getInstance();

  const onWebViewLoad = () => {
    const response = webViewBridge.postMessage(webViewRef, {
      type: 'message1',
      data: '메시지1',
    });
    response.then(res =>
      Alert.alert(`메시지1 전송 상태: ${res.success ? '성공' : '실패'}`),
    );

    webViewBridge.addMessageHandler('message2', message =>
      Alert.alert(`${message.type}: ${message.data}`),
    );
  };

  const onMessage = (event: WebViewMessageEvent) => {
    webViewBridge.onMessage(event);
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        javaScriptEnabled={true}
        style={styles.webview}
        source={{uri: 'http://192.168.200.103:3000/'}}
        onLoad={onWebViewLoad}
        onMessage={onMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  webview: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight - 100,
  },
});

export default App;
