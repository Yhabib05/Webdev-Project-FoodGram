import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, View, Text, Image,TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';
import React, { memo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';


import MonBouton from './MonBouton';
import HomeScreen from "../Screens/HomeScreen";
// const BACKEND="http://127.0.0.1:3000";
const BACKEND="https://foodgram.osc-fr1.scalingo.io";
export default function LoginForm({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  
/* On tente de récupérer le token depuis le stockage interne */

  useEffect(() => {
    async function miseEnPlace(){
      console.log("mise en place called");
      const ancienToken=await AsyncStorage.getItem("@token");
      if (ancienToken){
         console.log('old token found (mise en place)');
        setToken(ancienToken);
        console.log(ancienToken);
        navigation.navigate('Home');
      } 
  }
    miseEnPlace()
  }, []);
  
  


  async function connect(email, password){
    console.log("login called");
    console.log(BACKEND+"/login");
    fetch(`${BACKEND}/login`,{
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    })
    .then(response => response.json())
    .then(async data => {
      if (data.token) {
        console.log("saving token...");
        console.log(data.token);
        /* On sauvegarde le token dans la mémoire du téléphone */
        await AsyncStorage.setItem("@token", data.token);
        setToken(data.token);
        console.log("token saved");
        
        navigation.navigate('Home'); // Navigate to the Home screen after successfully logging in

       // setCurrentScreen('home');
        
      } else {
        alert("Bad authentication");
      }
    })
    .catch(error => alert("Server error"))
}





  function handleConnect() {
    if (email === '' ){
      setErrorMessage('Email is required.');
      return;
    }
    if( password === '') {
      setErrorMessage('Password is required.');
      return;
    } 
    connect(email, password);
  }

  return (
    <View style={styles.container}>
          <Image style={styles.image} source={require("../assets/FoodGram.png")} />
          
          <Text style={styles.error}>{errorMessage}</Text>

          {/* CHAMP EMAIL */}
          <View style={styles.inputView}>
            <View style={styles.iconContainer}>
            <Icon name="user-o" size={24} color="white" style={styles.icon} />
              <TextInput
                nativeID='emailInput'
                style={styles.TextInput} 
                onChangeText={(email) => setEmail(email)}
                placeholderTextColor="#003f5c"
                placeholder="Email."
              />
            </View> 
          </View>
          {/* CHAMP MOT DE PASSE */}
          <View style={styles.inputView}>
          <View style={styles.iconContainer}>
          <Icon name="lock" size={24} color="white" style={styles.icon} />
            <TextInput
              style={styles.TextInput} 
              placeholder="Password."
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
            </View> 
          </View>

          <TouchableOpacity>
            <Text style={styles.forgot_button} onPress={() => {navigation.navigate('ChangeUserPass')}}>
              Un trou de mémoire? Pas de problème
              </Text> 
          </TouchableOpacity>

        {/* BOUTON SIGN IN */}
          <View style={styles.inputt}>
            <MonBouton 
              nativeID='connect'
              label='Sign in' 
              onPress={handleConnect}
            />
          </View>

          {/* BOUTON SIGNUP */}
          <TouchableOpacity>
          <Text style={[styles.forgot_button, { color: 'blue', textDecorationLine: 'underline' }]} onPress={() => {navigation.navigate('SignUpForm')}}>
            Pas encore inscrit? Sign Up
          </Text>
        </TouchableOpacity>

    </View>
)}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }, 
  
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "80%",
    height: 45,
    marginBottom: 20,
    alignItems: "flex-start",
    maxWidth: 400,

  },
  inputt: {
    backgroundColor: "#E55D8A",
    borderRadius: 30,
    width: "50%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 100,
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 40,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
    textDecorationLine: 'underline', // adiciona sublinhado
    color: 'blue', // altera a cor do texto para azul
  },
  loginText:{
    color:"#003f5c",
    textDecorationLine: 'underline',
  },
  image: {
    width: 180,
    height: 180,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 20,
    marginBottom: 3,
  },
})