import { Camera, CameraType } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

export default function CameraScreen({navigation}) {
  console.log('CameraScreen is being called!');
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  

  if (!permission) {
    console.log('i dont have a permission');
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    console.log('u didnt grant me a permission');
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  
  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back)); 
  }

  async function takePicture() {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      console.log(photo);//we print the url of the image
      setCapturedImage(photo.uri);
    }
  }

  function handlegalerie() {

    navigation.navigate('GaleriePicker')

  }
  function toggleFlash () {
    setFlashMode(prevMode =>
      prevMode === Camera.Constants.FlashMode.torch
        ? Camera.Constants.FlashMode.off
        : Camera.Constants.FlashMode.torch
    );
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef} flashMode={flashMode}>
      <View style={styles.buttonContainer11}>

      <TouchableOpacity onPress={toggleFlash}>
          <Text style={styles.text1}>Flash</Text>
          {flashMode === Camera.Constants.FlashMode.torch && (
            <MaterialIcons name="flash-on" size={20} color="white" />
          )}
        </TouchableOpacity>
        </View>
      {capturedImage ? (
          <View style={styles.previewContainer}>
            <View style={styles.previewImageContainer}>
              <Image style={styles.previewImage} source={{ uri: capturedImage }} />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Post', { imageUri: capturedImage })}>
              <Text style={styles.text}>Posting</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonIcon} onPress={toggleCameraType}>
          <Image style={styles.icon} source={require("../assets/flipCamera.png")} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonIcon} onPress={handlegalerie}>
          <Image style={styles.icon1} source={require("../assets/galeria.png")} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonIcon} onPress={takePicture}>
          <Image style={styles.icon} source={require("../assets/takePicture.png")} />
          </TouchableOpacity>
        </View>

      </Camera>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonIcon:{
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  buttonIcon1:{
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
    tintColor: '#fff', //change the color of all the non transparent elements (expo documentation) 
  },

  icon1: {
    width: 58,
    height: 58,
    marginHorizontal: 5,
    tintColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  buttonContainer1: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },

  previewContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    margin: 64,
  },
  previewImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#FACEEB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer11: {
    position: 'absolute',
    padding: 10,
    backgroundColor: '#000000AA',

    alignItems: 'center'
  },
  text1: {
    fontSize: 18,
    color: 'white',
  },
});
