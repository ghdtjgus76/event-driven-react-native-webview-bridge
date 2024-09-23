import React, {useRef, useState} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import ReactNativeWebViewBridge from 'react-native-webview-bridge';

const deviceWidth = Dimensions.get('window').width;

const App = () => {
  const [message, setMessage] = useState('');
  const [messageTransmissionSuccess, setMessageTransmissionSuccess] =
    useState(false);

  const webViewRef = useRef<WebView | null>(null);
  const webViewBridge = ReactNativeWebViewBridge.getInstance();

  const onWebViewLoad = () => {
    const response = webViewBridge.postMessage(webViewRef, {
      type: 'message1',
      data: '메시지1',
    });
    response.then(res => setMessageTransmissionSuccess(res.success));

    webViewBridge.addMessageHandler('message2', message =>
      setMessage(`웹 -> 앱 ${message.type}: ${message.data}`),
    );
  };

  const onMessage = (event: WebViewMessageEvent) => {
    webViewBridge.onMessage(event);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          javaScriptEnabled={true}
          style={styles.webview}
          source={{uri: 'http://192.168.200.102:3000/'}}
          onLoad={onWebViewLoad}
          onMessage={onMessage}
        />
      </View>
      <View style={styles.separator} />
      <View style={styles.appContainer}>
        <Text style={styles.header}>앱</Text>
        <Text style={styles.text}>{message}</Text>
        <Text style={styles.text}>{`앱 -> 웹 메시지1 전송 상태: ${
          messageTransmissionSuccess ? '성공' : '실패'
        }`}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewContainer: {
    height: '50%',
  },
  appContainer: {
    height: '50%',
  },
  webview: {
    width: deviceWidth,
    height: '100%',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#000',
    marginVertical: 0,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#000',
  },
});

export default App;
