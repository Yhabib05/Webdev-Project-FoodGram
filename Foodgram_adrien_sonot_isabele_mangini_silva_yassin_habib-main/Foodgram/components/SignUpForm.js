/* eslint-disable @typescript-eslint/no-var-requires */

import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, View, Text, Image,TouchableOpacity} from 'react-native';
import {useState} from 'react';
import MonBouton from './MonBouton';
import Icon from 'react-native-vector-icons/FontAwesome';

const validator = require('validator');

// const BACKEND="http://127.0.0.1:3000";
const BACKEND="https://foodgram.osc-fr1.scalingo.io";
export default function SignUpForm({ onSubmit }) {


  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  


  /* Fonction signup pour créer un compte utilisateur dans la base de données */

    function signup(name, email, password){
    console.log("signup");
    fetch(`${BACKEND}/signup`,{
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, email, password})
    })
  .then(response => response.json())
  .then(data => {
    if (data.message=="Utilisateur ajouté") {
      setSignupSuccess(true);
    }
  })
  .catch(error => alert("Utilisateur existant"))
}

function handleSignup() {
  if (email === '' ){
    setErrorMessage('Email is required.');
    return;
  }
  if( password === '') {
    setErrorMessage('Password is required.');
    return;
  } 
  if (name === '') {
    setErrorMessage('Username is required.');
  }
  signup(name, email, password);
  
}


  return (

    <View style={styles.container}>
      
      <Image style={styles.image} source={require("../assets/FoodGram.png")} />
      <StatusBar style="auto" />
      <Text style={styles.error}>{errorMessage}</Text>
      
      {/* <form onSubmit={handleSubmit}> */}
      
      {signupSuccess && (
        <Text style={styles.success}>Utilisateur ajouté</Text>
      )}
      <View style={styles.inputView}>
        <View style={styles.iconContainer}>
        <Icon name="user-o" size={24} color="white" style={styles.icon} />
        <TextInput
          nativeID='nameInput'
          style={styles.TextInput} 
          onChangeText={(name) => setName(name)}
          placeholderTextColor="#003f5c"
          placeholder="Username."
          />
        </View>
      </View>

      <View style={styles.inputView}>
        <View style={styles.iconContainer}>
          <Icon name="at" size={24} color="white" style={styles.icon} />
          <TextInput
            nativeID='emailInput'
            style={styles.TextInput} 
            onChangeText={(email) => setEmail(email)}
            placeholderTextColor="#003f5c"
            placeholder="Email."
            />
        </View>    
      </View>

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


      <View style={styles.inputt}>
      <MonBouton 
        nativeID='connect'
        label='Done!' 
        onPress={handleSignup} // La fonction signup n'est appelée que lorsque le bouton est cliqué
        />
      </View>

      



    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }, 
  success: {
    color: 'green',
    marginBottom: 20,
  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "flex-start",
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
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
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