import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, View, Text, Image,TouchableOpacity} from 'react-native';
import {useState} from 'react';
import MonBouton from './MonBouton';
// const BACKEND="http://127.0.0.1:3000";
const BACKEND="https://foodgram.osc-fr1.scalingo.io";

export default function ChangePass({ navigation }) {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [changePasswordSucess, setChangePasswordSucess] = useState(false);


    function handleChangePass() {
        if (email === '' ){
          setErrorMessage('Email is required.');
        }
        if( password === '') {
          setErrorMessage('Password is required.');
        }
        else{
          setErrorMessage('');
          ChangePass(email, password);
        }
      }

      /*Fonction ChangePass pour appeler la fonction backend qui fait le chagement*/

      function ChangePass(email, password){

        fetch(`${BACKEND}/changepass`,{
            method:'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
          })
          .then(response => response.json())
          .then(data => {
            if (data.message=="Mdp modifié") {
              setChangePasswordSucess(true);
            }
          })
          .catch(error => alert("Utilisateur non trouvé"))
      }



    return(

        <View style={styles.container}>

        <Image style={styles.image} source={require("../assets/FoodGram.png")} />
        <Text style={styles.error}>{errorMessage}</Text>
        

        {changePasswordSucess && (
        <Text style={styles.success}>Changed Password</Text>
      )}
      
      <View style={styles.inputView}>
        <TextInput
          nativeID='emailInput'
          style={styles.TextInput} 
          onChangeText={(email) => setEmail(email)}
          placeholderTextColor="#003f5c"
          placeholder="Email."
          />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput} 
          placeholder="New Password."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          />
      </View>

              {/* BOUTON SIGN IN */}
          <View style={styles.inputt}>
            <MonBouton 
              nativeID='connect'
              label='Change Password' 
              onPress={handleChangePass}
            />
          </View>
        
        

        </View>

    );


};

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
      width: "80%",
      height: 45,
      marginBottom: 20,
      alignItems: "center",
    },
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      marginLeft: 20,
    },
    image: {
      width: 180,
      height: 180,
    },
    error: {
      color: 'red',
      marginTop: 10,
    },
    inputt: {
        backgroundColor: "#FF1493",
        borderRadius: 30,
        width: "80%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
        maxWidth: 150,
      },
  });