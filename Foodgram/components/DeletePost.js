import { View, Text , TouchableOpacity, TextInput} from 'react-native';
import { StyleSheet} from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND="https://foodgram.osc-fr1.scalingo.io";


export default function DeletePost({navigation}){

    const [id, setRecipeId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    async function deleteRecipe(id){
        console.log('deleteRecipe', id);
        const token = await AsyncStorage.getItem('@token');
        console.log(token);
        const response = await fetch(`${BACKEND}/deleterecipe`,{
            method:'DELETE',
            headers: {'Content-Type': 'application/json', 'token': token },
            body: JSON.stringify( {id: id} ),
        })
        const result = await response.json();
        if (result.status) {
            navigation.navigate('Home');
        } else {
            alert(result.message);
        }
    }

    

    function handleDelete(){
        console.log('calllled to delete ')
    if (id === '' ){
        setErrorMessage('Recipe id is required.');
        return;
        }

        deleteRecipe(id)
    }

    return(
        <View style={styles.container}>
            <Text style={styles.error}>{errorMessage}</Text>
            <Text style={styles.id}>What's the id (number after #) of the recipe you want to delete?</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    onChangeText={(id) => setRecipeId(id)}
                    value={id}
                    placeholder="Recipe id here"
                    placeholderTextColor="#003f5c"
                />
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Delete Recipe</Text>
            </TouchableOpacity>
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
    id: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'grey'
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
    inputText: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 40,
    },
    deleteButton: {
        backgroundColor: "#E55D8A",
        borderRadius: 20,
        width: "100%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
        maxWidth: 150,
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 15,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
});
