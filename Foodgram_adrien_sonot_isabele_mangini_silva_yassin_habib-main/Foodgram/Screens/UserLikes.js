import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const BACKEND = "http://127.0.0.1:3000";
const BACKEND="https://foodgram.osc-fr1.scalingo.io";
import Recipe from '../components/Recipe';

export default function UserLikes({ navigation }) {

  const [token, setToken] = useState('');
  // const [recipesLiked, setLikes] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Affiche les likes de l'utilisateur (coeurs en rouge sur l'affichage)
    async function getLikes() {
      try {
        const token = await AsyncStorage.getItem('@token');
        // TODO: envoyer requête avec liste des recettes affichées à l'écran
        // La requête répond un tableau: data[] = [{id: 42, liked: true, count: 50},...]
        console.log("get likes called");
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
        // setLikes(postsLiked.data);
        setRecipes(postsLiked.data);
      }
      catch (error) {
        console.log('Error:', error);
        alert('Server error');
      }
    }
    getLikes();
  }, []);

  return (
    <ScrollView>
      <View >
        {/* RECIPES */}
        <View >
          {recipes.map(item => (
            <Recipe key={item['post.id']}
              recipeAuthor={item['user.name']} // Car le champ contient un point dans son nom
              recipeDate={item['post.date']}
              recipeTitle={item['post.title']}
              recipeDifficulty={item['post.difficulty']}
              recipeDescription={item['post.description']}
              recipeId={item['post.id']}
              recipePicture={item['post.picture']}
              recipeCategory={item['post.category']}
              recipeLikes={item['post.like_count']} // Nombre de likes de la recette
              // On associe les items de recipes et recipesLiked en faisant matcher les id des recettes
              isLiked = {1}  // Toutes les recettes de cette liste sont likées
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


