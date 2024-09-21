import React from 'react';
import {Dimensions, SafeAreaView, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={styles.webview}
        source={{uri: 'http://192.168.200.100:3000/'}}
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
    height: deviceHeight,
  },
});

export default App;
