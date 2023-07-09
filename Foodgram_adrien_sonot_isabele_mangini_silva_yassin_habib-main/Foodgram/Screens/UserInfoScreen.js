import { View, Text , TouchableOpacity} from 'react-native';
import { StyleSheet} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import UserPosts from './UserPosts';

// const BACKEND="http://127.0.0.1:3000";
const BACKEND="https://foodgram.osc-fr1.scalingo.io";

export default function UserInfoScreen({ route, navigation }) {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(route.params);

  async function disconnect() {
    console.log("disconnect called")
    try {
      await AsyncStorage.removeItem('@token');
      setToken(null);
      console.log('Token removed from memory');
      navigation.navigate('LoginForm');
    } catch (error) {
      console.error(error);
      alert("Server error")
    }
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("@token");
        console.log(storedToken)
        fetch(`${BACKEND}/userinfo`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': storedToken
          }
        })
          .then(response => response.json())
          .then(data => setUser(data.user))
          .catch(error => alert("Server error"))
      } catch (error) {
        console.log(error); 
      }
    };
    fetchUserInfo();
  }, []);

  const handleEditPress = () => {
    navigation.navigate('EditUserInfo', { token })
  }
  const handlePostPress= () => {
    navigation.navigate('UserPosts')
  }

  return (
    <View style={styles.container}>
      {user ? (
      <>
        <View style={styles.bigContainer}>
          <View style={styles.innerContainer}>
              <View style={styles.avatar}>
                <TouchableOpacity>
                  <Ionicons name="person-circle-outline" size={32} color="white" />
                </TouchableOpacity>
  
              </View>
          

            <View style={styles.nameContainer}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{user.name}</Text>
            </View>
              
            <View style={styles.nameContainer}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
              
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.firstbutton} onPress={handleEditPress}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
                
              <TouchableOpacity style={styles.secondbutton} onPress={disconnect}>
                <Text style={styles.buttonText}>Exit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.thirdbutton}   onPress={() => {navigation.navigate('DeletePost')}}>
                <Text style={styles.buttonText}>Delete recipe</Text>
              </TouchableOpacity>

            </View> 
          </View>  
          <View  style={styles.secondPage} >  
            <UserPosts user={user.name}/>
          </View>
        </View>
      </>

      ) : (
        <Text>Loading...</Text>
      )}
    </View>

  );
}
  
const styles = StyleSheet.create({
  bigContainer:{
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF99CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  line: {
    height: '100%',
    width: 1,
    backgroundColor: '#d8d8d8',
    marginHorizontal: 10,
  },
  innerContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5c5c5c',
    marginBottom: 10,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'FF99CC',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#5c5c5c',
    fontWeight: 'bold',
    marginBottom: 5,
    marginRight: 15,
  },
  value: {
    fontSize: 16,
    color: '#5c5c5c',
    marginBottom: 10,
  },
  buttonContainer:{
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
  },
  firstbutton: {
    flex:1,
    backgroundColor: '#FF99CC',
    borderRadius: 10,
    marginTop: 10,
    height: 35,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    elevation: 10
  },
  secondbutton: {
    flex:1,
    backgroundColor: '#FF99CC',
    borderRadius: 10,
    marginTop: 10,
    height: 35,
    justifyContent: 'center',
    width: '80%',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    elevation: 10
  },
  thirdbutton: {
    flex:1.9,
    backgroundColor: '#FF99CC',
    borderRadius: 10,
    marginTop: 10,
    height: 35,
    justifyContent: 'center',
    width: '80%',
    alignItems: 'center',
    marginLeft: 5,
    elevation: 10
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondPage:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',

  }
});
