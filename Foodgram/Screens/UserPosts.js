import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const BACKEND = "http://127.0.0.1:3000";
const BACKEND="https://foodgram.osc-fr1.scalingo.io";
import Recipe from '../components/Recipe';

export default function UserPosts({ navigation, user }) {

  const [token, setToken] = useState('');
  const [recipesLiked, setLikes] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      async function getOwnRecipes() {
        try {
          const tokenStorage = await AsyncStorage.getItem('@token');
          if (!tokenStorage) alert('no token!');
          setToken(tokenStorage);
          console.log('get recipes called');
          const response = await fetch(`${BACKEND}/ownrecipes`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              token: tokenStorage,
            },
          }); 
          if (response.status !== 200) {
            alert('Error');
            return;
          }
          const data = await response.json(); // Wait for the JSON data to be parsed
          setRecipes(data.data);
          // console.log(data.data);
          // console.log(recipeTitle);
        } catch (error) {
          console.log('Error:', error);
          alert('Server error');
        }
      }
      async function refreshLikes() {
        try {
          const token = await AsyncStorage.getItem('@token');
          // TODO: envoyer requête avec liste des recettes affichées à l'écran
          // La requête répond un tableau: data[] = [{id: 42, liked: true, count: 50},...]
          console.log("refreshlikes called");
          // Requête pour avoir les recettes likées + like count
          const response = await fetch(`${BACKEND}/likes`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              token: token,
            },
          });
          if (response.status !== 200) {
            alert('Error');
            return;
          }
          const postsLiked = await response.json(); // Wait for the JSON data to be parsed
          setLikes(postsLiked.data);
        }
        catch (error) {
          console.log('Error:', error);
          alert('Server error');
        }
      }
      refreshLikes();
      getOwnRecipes();
      return 
    }, [])
  );

  return (
    <ScrollView>
      <View >
        {/* RECIPES */}
        <View >
          {/* <View style={styles.recipeHeader}> */}
          {recipes.map(item => (
            <Recipe key={item.id}
              recipeAuthor={user} // Car le champ contient un point dans son nom
              // recipeDate={item.date}
              recipeDate={item.date.split("T")[0]}
              recipeTitle={item.title}
              recipeDifficulty={item.difficulty}
              recipeDescription={item.description}
              recipeId={item.id}
              recipePicture={item.picture}
              recipeCategory={item.category}
              recipeLikes={item.like_count} // Nombre de likes de la recette
              // On associe les items de recipes et recipesLiked en faisant matcher les id des recettes
              isLiked = {recipesLiked.some(likedItem => likedItem.recipe_id === item.id)}  // Si la recette est initalement likée ou non
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: '#00ff00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    paddingHorizontal: 5,
    flex: 1,
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  textContainer: {
    marginTop: 20,
  },
  // Recipes
  recipeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    // paddingHorizontal: 250,
    flex: 1,
    // marginRight: 5,
    border: '1px solid',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginTop: 20,

  },
  recipeHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    // paddingHorizontal: 5,
    flex: 1,
    marginRight: 1,
    border: '1px solid',
  },
  headerElement: {
    margin: 2,
  }

});


