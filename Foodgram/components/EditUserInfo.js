import { View, Text , TouchableOpacity, TextInput} from 'react-native';
import { StyleSheet} from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginForm from './LoginForm';

// const BACKEND="http://127.0.0.1:3000";
const BACKEND="https://foodgram.osc-fr1.scalingo.io";

export default function EditUserInfo({navigation}){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEditPress = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("@token");

            fetch(`${BACKEND}/edituserinfo`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': storedToken
              },
              body: JSON.stringify({
                  name: name,
                  email: email,
              })
            })
              .then(response => response.json(),
              navigation.navigate('LoginForm')
              )
            .catch(error => alert("Server error"))
          } catch (error) {
            console.log(error); 
          }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Edit User Information</Text>
            <View style={styles.line}></View>
            <Text style={styles.label}>Name:</Text>
            <TextInput 
                style={styles.input} 
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.label}>Email:</Text>
            <TextInput 
                style={styles.input} 
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.button} onPress={  handleEditPress   }>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5c5c5c',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5c5c5c',
        marginTop: 20,
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '100%'
    },
    button: {
        backgroundColor: '#FF99CC',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
      },
      line: {
        width: '100%',
        height: 1,
        backgroundColor: '#d8d8d8',
        marginVertical: 10,
      }
});
