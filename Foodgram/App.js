// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import {useState, useEffect} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import MyStack from './components/MyStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BACKEND="http://127.0.0.1:3000";
const BACKEND="https://foodgram.osc-fr1.scalingo.io";

export default function App() {


  return (
  <View style={styles.container}>
    <NavigationContainer>
    <MyStack/>
    </NavigationContainer>
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});