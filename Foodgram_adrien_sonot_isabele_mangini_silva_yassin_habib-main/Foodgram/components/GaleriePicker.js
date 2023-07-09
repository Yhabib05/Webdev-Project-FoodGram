import React, { useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';


const BACKEND = "https://foodgram.osc-fr1.scalingo.io";
const foodOptions = ['française', 'brasilian', 'marocain', 'italien', 'chinois', 'indien'];
const difficultyOptions = ['1', '2', '3', '4', '5'];


export default function GaleriePicker({ navigation }) {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [picture, setPicture] = useState(null);
  const [FileName, setFileName] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [difficulty, setDifficulty] = useState('');


  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {

      setPicture(result.assets[0].uri);

      const pathParts = result.uri.split('/');
      const name = pathParts[pathParts.length - 1];
      setFileName(name);
    }
  };

  const handleSubmit = async () => {

    const token = await AsyncStorage.getItem('@token');
    const formData = new FormData();

    formData.append('file', {
      uri: picture,
      name: "img.jpg",
      type: 'image/jpg'
    });

    try {
      const postingPicture = await fetch(`${BACKEND}/picture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          token: token,
        },
        body: formData,
      });
      if (postingPicture.status !== 200) {
        alert('Error while posting picture');
        return;
      }
      const data = await postingPicture.json(); // Wait for the JSON data to be parsed
      const imageName = data.data; // Nom à ajouter dans la recette: attribut image = BACKEND/pictures/+imageName
      console.log(imageName);
      console.log("RECIPE POSTED 1/2")
      const recipeItems = {
        title: title,
        description: description,
        category: category,
        difficulty: difficulty,
        picture: `${BACKEND}/pictures/` + imageName, // Lien vers l'image envoyée précédemment

      }
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
      // const dataBis = await responseBis.json(); // Wait for the JSON data to be parsed
    } catch (error) {
      console.error(error);
      console.log('Error:', error.message);

    }
  };



  return (


    <View style={styles.container}>
       
      {successMessage && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}


      <View style={styles.imageContainer}>
        {picture ? (
          <Image source={{ uri: picture }} style={styles.picture} />
        ) : (
          <Icon name="image" size={40} color="#aaa" />
        )}
      </View>


      <View style={styles.textContainer}>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />

      </View>


      <View style={styles.pickerContainer}>

        <Picker
          style={styles.picker}
          selectedValue={category}
          mode='dropdown'
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Category" value="" />
          {foodOptions.map(option => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>

        <Picker 
          style={styles.picker}
          selectedValue={difficulty}
          mode='dropdown'
          onValueChange={(itemValue) => setDifficulty(itemValue)}
        >
          <Picker.Item label="Difficulty" value="" />
          {difficultyOptions.map(option => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>

    
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Icon name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Choose Picture</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
          onPress={() => {
            handleSubmit();
            setSuccessMessage('Image uploaded successfully!');
          }}>
          <Icon name="cloud-upload" size={24} color="white" />
          <Text style={styles.buttonText}>Post Recipe!</Text>
        </TouchableOpacity>
      </View>
      

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
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
  textContainer: {
    flex: 0.3,
    height: 40,
    width: '80%',
    alignItems: 'center',
    marginBottom: 60,

  },
  picture: {
    width: '100%',
    height: '100%',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 10,

  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F396B5',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 15,
  },
  buttonText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
    fontSize: 12,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 120,
    width: '100%',
    borderRadius: 5,
    marginTop:15,
    marginBottom: 30,
   // borderWidth: 1,
    overflow: 'hidden',

  },
  picker: {
    height: '30%',
    width: '50%',
    color: 'grey',

  },

});