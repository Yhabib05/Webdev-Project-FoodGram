import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Picker } from '@react-native-picker/picker';
//import AppContext from './AppContext';

const BACKEND = "https://foodgram.osc-fr1.scalingo.io";

// const path = require('path');
// import RNFS from 'react-native-fs';

export default function Post({ navigation, route }) {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const difficultyOptions = ['1', '2', '3', '4', '5'];
  const foodOptions = ['française', 'brasilian', 'marocain','italien','chinois','indien'];



  const [imageUri, setImageUri] = useState(route.params.imageUri);

  async function postRecipe() {
    console.log("Posting recipe...")
    navigation.navigate("Home");
    const token = await AsyncStorage.getItem('@token');
    // On fait deux requêtes : image + infos recette
    // const smallImage = await resizeFile(imageUri); // On gagne en perf/bande passante en diminuant la taille de l'image
    // console.log("small image:");
    // console.log(smallImage);
    // Image envoyée sous format form-data
    const picture = new FormData();
    picture.append('file', {
      uri: imageUri,
      name: "img.jpg",//path.basename(imageUri),
      type: 'image/jpg'
    });

    const postingPicture = await fetch(`${BACKEND}/picture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        token: token,
      },
      body: picture,
    });
    console.log("RECIPE POSTED 1/2")
    if (postingPicture.status !== 200) {
      alert('Error while posting picture');
      return;
    }

    const data = await postingPicture.json(); // Wait for the JSON data to be parsed
    const imageName = data.data; // Nom à ajouter dans la recette: attribut image = BACKEND/pictures/+imageName
    console.log(imageName);

    // Infos de la recette
    const recipeItems = {
      title: title,
      description: description,
      category: category,
      difficulty: difficulty,
      picture: `${BACKEND}/pictures/` + imageName, // Lien vers l'image envoyée précédemment

    }
     // Seconde requête: infos de la recette (titre, description)
    const responseBis = await fetch(`${BACKEND}/recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify(recipeItems),
    });
    if (responseBis.status !== 200) {
      alert('Error');
      return;
    }
    console.log("POSTING COMPLETE 2/2")
    // const dataBis = await response.json(); // Wait for the JSON data to be parsed

    // }
    // catch { alert("Network error") };


  }

  return (
    <ScrollView>
    <View style={styles.container}>

      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
      {/* onPress={() => navigation.goBack()} */}
     
      <View style={styles.containerText}>
       
        
          <TouchableOpacity style={styles.button} 
            onPress={() => navigation.goBack()}>
            <Icon name="repeat" size={24} color="white" />
            <Text style={styles.buttonText}>Change Image</Text>
          </TouchableOpacity> 

        <View style={styles.inputView}>
          <TextInput
            style={[styles.input]}
            placeholder="Add a title..."
            value={title}
            onChangeText={setTitle}
          />
        </View>
        
        <View style={styles.inputView}>
          <TextInput

            style={[styles.input]}
            placeholder="Add a description..."
            value={description}
            onChangeText={setDescription}
          />
        </View>
        
        <View style={styles.inputView}>
        <Picker
          style={styles.picker}
          selectedValue={category}
          mode = 'dropdown'
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Category" value="" />
          {foodOptions.map(option => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
        </View>
        
        <View style={styles.inputView}>
          <Picker
            style={styles.picker}
            selectedValue={difficulty}
            mode = 'dropdown'

            onValueChange={(itemValue) => setDifficulty(itemValue)}>

          <Picker.Item label="Difficulty" value="" />
            {difficultyOptions.map(option => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
        {/* onPress={() => postRecipe()} */}
        <TouchableOpacity style={styles.button} 
            onPress={() => postRecipe()}>
            <Icon name="cloud-upload" size={24} color="white" />
            <Text style={styles.buttonText}>Post recipe!</Text>
        </TouchableOpacity> 
        
      </View>
   
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '80%',
    height: 250,
    borderColor: '#aaa',
    borderWidth: 1,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  inputView: {
    //      backgroundColor: "#FFC0CB",
    alignContent: 'center',
    alignItems: 'center',
    marginHorizontal: 28,
    flexDirection: 'row',

  },
  containerText: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 20,
    marginTop: 20,
  },




  label: {
    marginRight: 16,
    fontWeight: 'bold',
    flex: 0,
  },
  picker: {
    color: 'grey',
    flex: 1,
  },
  input: {
    flex: 1,
    marginRight: 16,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 8,
  },

  button: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F396B5',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation:15,
  },
  buttonText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
