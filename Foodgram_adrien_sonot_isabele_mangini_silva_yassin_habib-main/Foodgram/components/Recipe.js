import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, View, Text, FlatList,  SafeAreaView, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LikeButton } from './MonBouton';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BACKEND = "http://127.0.0.1:3000";
const BACKEND="https://foodgram.osc-fr1.scalingo.io";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Recipe({ recipeTitle, recipeAuthor, recipeDate,
  recipeDescription, recipeCategory, recipeDifficulty, recipePicture,
  recipeId, recipeLikes, isLiked }) {

  const difficultyBar = Array.from({ length: 5 }, (_, i) => i < recipeDifficulty);
  const [formattedDate, setRecipeDate] = useState('');
  const [likeRecipeId, setRecipeId] = useState("");
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [isLikedRecipe, setLike] = useState(false);

  useEffect(() => {
    async function recipe() {
      const date = recipeDate.split(" ")[0];
      // console.log(recipeDate);
      setRecipeDate(date);
      setRecipeId(recipeId); // Fournit l'identifiant pour le bouton like
      setLike(isLiked);
    }

    recipe();
  }, []);
  
  return (
<ScrollView style={styles.container1}> 
<View style={styles.container}>

      <View style={styles.header}>
      <View style={styles.titleSection}>
          {recipeTitle ? (
            <Text style={styles.title}>{recipeTitle}</Text>
          ) : (
            <Text style={styles.title}>Not found</Text>
          )}
           {recipeId ? (
            <Text style={styles.id}>#{recipeId}</Text>
          ) : (
            <Text style={styles.id}>Not found</Text>
          )}
          </View>
          <View style={styles.line}></View> 

          <View style={[styles.details, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20}]}>
            {recipeAuthor ? (
              <Text style={styles.detail}>{recipeAuthor}</Text>
            ) : (
              <Text style={styles.detail}>Not found</Text>
            )}

            {formattedDate ? (
              <Text style={styles.detail}>{formattedDate}</Text>
            ) : (
              <Text style={styles.detail}>Not found</Text>
            )}

            {recipeCategory ? (
              <Text style={styles.detail}>{recipeCategory}</Text>
            ) : (
              <Text style={styles.detail}>Not found</Text>
            )}
          </View>
      </View>

      <View style={[styles.recipeBody, {flexDirection: 'column'}]}>
        
        <Image style={styles.image} source={{ uri: recipePicture }} />

          <View style={styles.actions}>
            <Text style={styles.smallText}>Difficulty:</Text>
              {difficultyBar.map((filled, i) => (
                <View
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 50,
                    backgroundColor: filled ? "rgb(255, 135, 135)" : "lightgray",
                    marginRight: 3,
                  }}
                />
              ))}
              
              <View style={styles.likes}>
              <LikeButton likeRecipeId={recipeId} token={token} isRecipeLiked={isLiked} likeCount={recipeLikes}/>
              </View>        
          </View>
      </View>

  {recipeDescription ? (
      <>
        <Text style={styles.redText}>Recette:</Text>
        <Text style={[styles.description ]}>{recipeDescription}</Text>
      </>
    ) : (
      <Text style={styles.description}>Not found</Text>
    )}
</View>
</ScrollView>
  )

}

const styles = StyleSheet.create({
  colorStyle: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop:60,
    paddingBottom: 300,
  },
  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    height: screenHeight * 0.1,
    justifyContent: 'center',

  },
  titleSection: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    flex: 2,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4F5054',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  id: {
    // flex: 1,
    fontSize: 25,
    fontStyle: 'italic',
    marginBottom: 5,
    color: '#4F5054',
    alignItems: 'center',
    paddingHorizontal: 20
  },

  recipeBody: {
    flexDirection: "row",
    marginTop: 20
    
  },
  smallText: {
    fontSize: 20,
    color: 'gray',
    marginRight: 20,
  },
  actions: {
    
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20

  },
  likeCount: {
    flexWrap: 'wrap',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  redText: {
    color: '#DC4CAC',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 20
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    paddingHorizontal: 20,
    backgroundColor: '#FACEEB'
  },
  detail:{
    alignItems: 'center', 
    color: '#4F5054', 
    fontSize: 15, 
    fontWeight: 'bold'
  },
   image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 20,
  }, 
  line: {
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    marginHorizontal: 10,
  },
  likes:{
    marginLeft: 150,

  },
  container1:{
    flexGrow: 1, 
  }
});
