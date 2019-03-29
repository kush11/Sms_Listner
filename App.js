/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, PermissionsAndroid, TouchableOpacity } from 'react-native';
import SmsListener from 'react-native-android-sms-listener'
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  state = { code: 'Code Will Come Hear once message received' }

  componentDidMount() {
    this.requestReadSmsPermission();
  }

  subscription = SmsListener.addListener(message => {
    let verificationCodeRegex = /code: ([\d]{6})/

    if (verificationCodeRegex.test(message.body)) {
      let verificationCode = message.body.match(verificationCodeRegex)[1]
      this.setState({ code: verificationCode });
    }
  })

  async requestReadSmsPermission() {
    try {
      var granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "Auto Verification OTP",
          message: "need access to read sms, to verify OTP"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("sms read permissions granted", granted);
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, {
            title: "Receive SMS",
            message: "Need access to receive sms, to verify OTP"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("RECEIVE_SMS permissions granted", granted);
        } else {
          console.log("RECEIVE_SMS permissions denied");
        }
      } else {
        console.log("sms read permissions denied");
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>React Native Application To Read Message</Text>        
        <Text style={{ fontSize: 18, color: 'black' }}>{this.state.code}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
