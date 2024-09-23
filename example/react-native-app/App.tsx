import React, {useRef, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import ReactNativeWebViewBridge from 'react-native-webview-bridge';

const deviceWidth = Dimensions.get('window').width;

const App = () => {
  const [message, setMessage] = useState<string>('');
  const [messageTransmissionSuccess, setMessageTransmissionSuccess] = useState<
    boolean | null
  >(null);

  const webViewRef = useRef<WebView | null>(null);
  const webViewBridge = ReactNativeWebViewBridge.getInstance();

  const onWebViewLoad = () => {
    webViewBridge.addMessageHandler('toRNMessage', message => {
      const newMessage = `웹 -> 앱 ${message.type}: ${message.data}`;
      setMessage(newMessage);
    });
  };

  const onMessage = (event: WebViewMessageEvent) => {
    webViewBridge.onMessage(event);
  };

  const handlePressPostMessageToWebView = async () => {
    const response = await webViewBridge.postMessage(webViewRef, {
      type: 'toWebViewMessage',
      data: '메시지1',
    });

    setMessageTransmissionSuccess(response.success);
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
        <View>
          <Text style={styles.subTitle}>수신한 메시지</Text>
          {message ? (
            <Text style={styles.messageText}>{message}</Text>
          ) : (
            <Text style={styles.messageText}>없음</Text>
          )}
        </View>
        <View style={styles.buttonSectionContainer}>
          <TouchableOpacity
            onPress={handlePressPostMessageToWebView}
            style={styles.button}>
            <Text style={styles.buttonText}>{`앱 -> 웹 메시지 전송`}</Text>
          </TouchableOpacity>
          {messageTransmissionSuccess !== null && (
            <>
              <Text style={styles.subTitle}>전송 상태</Text>
              <Text style={styles.statusText}>
                {messageTransmissionSuccess ? '성공' : '실패'}
              </Text>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webviewContainer: {
    height: '50%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  appContainer: {
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  webview: {
    width: deviceWidth,
    height: '100%',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 5,
    color: '#555',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#000',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
  buttonSectionContainer: {
    minHeight: 120,
  },
});

export default App;
