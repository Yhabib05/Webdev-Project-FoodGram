import * as React from 'react';
import { StyleSheet, View, Modal,Text, Image,TouchableOpacity, BackHandler} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useState} from 'react';



import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // import Ionicons from Expo vector icons



import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import HomeScreen from '../Screens/HomeScreen';
import UserInfoScreen from '../Screens/UserInfoScreen';
import EditUserInfo from './EditUserInfo';
import ChangePass from './ChangePass';
import Post from './Post';
import CameraScreen from './CameraScreen';
import GaleriePicker from './GaleriePicker';
import DeletePost from './DeletePost';
import UserLikes from '../Screens/UserLikes';

import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Use Ionicons for tab icons
        let iconName;
        if (route.name === 'Home') {
          iconName = 'home-outline';
        } else if (route.name === 'UserInfoScreen') {
          iconName = 'person-outline';
        } else if (route.name === 'Camera') {
          iconName = 'camera-outline';
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center' }}
          >
            <Ionicons name={iconName} size={24} color={isFocused ? '#673ab7' : '#222'} />
            <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}



const Tab = createBottomTabNavigator();

  
export function HomeTab() {
  return (
      <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} 
       // options={{ headerShown: false }}
      />
      <Tab.Screen name="UserInfoScreen" component={UserInfoScreen} />
      
      </Tab.Navigator>
  );
}

export function LeftHeader({navigation}){
  return(
    <TouchableOpacity onPress={() => navigation.navigate('UserLikes')}>
    <Ionicons name="heart-outline" size={24} color="#000000" style={{ marginLeft: 16 }} />
  </TouchableOpacity>
  );
}



export default function MyStack({navigation}) {

    const [currentScreen, setCurrentScreen] = useState('home');
    const token =  AsyncStorage.getItem('@token');

    return (


    <Stack.Navigator>


    <Stack.Screen name="LoginForm" component={LoginForm} options={{ headerShown: false }} />
    <Stack.Screen name="SignUpForm" component={SignUpForm} />
    <Stack.Screen name="EditUserInfo" component={EditUserInfo} />
    <Stack.Screen name="ChangeUserPass" component={ChangePass} />
    <Stack.Screen name="Post" component={Post} />
    <Stack.Screen name="GaleriePicker" component={GaleriePicker}/>
    <Stack.Screen name="DeletePost" component={DeletePost}/>
    <Stack.Screen name="UserLikes" component={UserLikes}/>
    <Stack.Screen
     name="Home"
     component={HomeTab}
     options={({ navigation }) => ({ 
      title: 'Aligned Center',
      headerTitleAlign: 'center',
       headerTitle: 'ＦｏｏｄＧｒａｍ',
       headerLeft: () => ( 
        <LeftHeader navigation={navigation} />
       ),
       headerRight: () => null
     })}
     />
    


  </Stack.Navigator>
    );
}
