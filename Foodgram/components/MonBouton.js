// .components/MonBouton.js
import { StyleSheet, View, Pressable, Text, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';

import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BACKEND = "http://127.0.0.1:3000";
const BACKEND="https://foodgram.osc-fr1.scalingo.io";

export default function MonBouton({ label, onPress }) {
  return (
    <View style={styles.buttonWrapper}>
      <Pressable onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}



export function LikeButton({ likeRecipeId, token, isRecipeLiked, likeCount }) {
  const [liked, setLiked] = useState(false);
  const [localCount, setCount] = useState(false);
  useEffect(() => {
    console.log("(use effect) is recipe liked?");
    console.log(isRecipeLiked ? "yes" : "no");
    setLiked(isRecipeLiked); // Valeur initiale du like
    setCount(likeCount);
  }, []);
  async function likeRecipe() {
    try {
      setLiked(!liked);
      const token = await AsyncStorage.getItem('@token');
      // setLiked((isLiked) => !isLiked);
      if (!liked) { // On like la recette
        console.log("recipe liked")
        setCount(localCount + 1);
        const response = await fetch(`${BACKEND}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({ id: likeRecipeId })
        });
        if (response.status !== 200) {
          alert('Error');
          return;
        }
        const data = await response.json(); // Wait for the JSON data to be parsed
        // Update the like 
      }
      else { // On ne like plus la recette
        console.log("recipe unliked")
        setCount(localCount - 1);
        const response = await fetch(`${BACKEND}/unlike`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({ id: likeRecipeId })
        });
        if (response.status !== 200) {
          alert('Error');
          return;
        }
        const data = await response.json(); // Wait for the JSON data to be parsed
      }
    }
    catch { alert("Network error") };

  }

  return (
    <View style={styles.likeZone}>
      <Pressable onPress={() => likeRecipe()}>
        <MaterialCommunityIcons
          name={liked ? "heart" : "heart-outline"}
          size={32}
          color={liked ? "red" : "black"}
        />
      </Pressable>
      <View style={styles.likeCount}>
        {localCount ?
          <Text style={styles.likeCount}>{localCount}</Text>
          : <Text>0</Text>
        }
      </View>
    </View>
  );
}


export function AutreBouton({ label, onPress }) {
  return (
    <View style={styles.autreButtonWrapper}>
      <Pressable onPress={onPress}>
        <Text style={styles.autreButtonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 10,

    overflow: 'hidden',
  },
  buttonLabel: {
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 'bold',
  },
  autreButtonWrapper: {
    backgroundColor: '#FF99CC',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  autreButtonLabel: {
    backgroundColor: "#FF1493",
    borderRadius: 30,
    width: "50%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  likeZone: {
    flex: 1,
    flexDirection: 'row',
  },
  likeCount: {
    flexWrap: 'wrap',
    // textAlign: 'center',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});