/**
 * An prototype app for the TM352 24J TMA02 senario. 
 * 
 * Please read the TMA question carefully to understand the requirements of the app. The app as provided 
 * implements the basic functionality required for the TMA. You will need to add additional functionality.
 * To demonstrate how to handle images, the app includes code to use the camera to take a photo and submit 
 * it to the service. To complete the TMA you will need to add code to implement the ability to upload photos
 * that have been previously taken.
 * 
 * To install:
 * npm ci
 * cd web
 * npm ci
 *
 * This app can be started from the web directory with:
 * npm run dev
 * 
 * Libraries used:
 * npx expo install expo-camera
 * 
 * Limitations/assumptions:
 * Autumn Thomson: The photo handling will work correctly on React Native web, but will not work on mobile platforms.
 * This is suitable for the EMA, but would need to be fixed for a real app.
 * Autumn Thomson: This only works on SDK49. The camera does not work on SDK50 and higher as configured.
 * 
 * Please add your own!
 *
 * Change log:
 * Version 1.0, 18 January 2024, A Thomson, Intial version
 * Version 1.1, 27 February 2024, A Thomson, Updated following feedback
 * Version 1.2, 25 September 2024, A Thomson, revised for 24J TMA02. Many small changes for the 
 *            TMA, including the senario, and image uri handling. Tweaks made to ensure that
 *            no errors are shown with typescript.
 * 
 * Testing completed:
 * 27/02/2024: Autumn Thomson, Initial testing using the web platform on the VCL.
 *             This code was used as a base and the solution code was added. It was 
 *             confirmed that the EMA requirements were met.
 * 25/09/2024: Autumn Thomson, Retested the code to ensure it works with the TMA requirements.
 */

import React from 'react';
import {StyleSheet, Button, Text, SafeAreaView, TextInput, View, Dimensions} from 'react-native';
import {Camera, CameraType } from 'expo-camera';
import {Photo, getPhotos, addPhoto, registerUser, addComment, addVote} from './libraries/PhotoService';
import PhotoEditor from './components/PhotoEditor';
import ScaledImage from './components/ScaledImage';
// Question 1 -importing ImagePicker Library
import * as ImagePicker from 'expo-image-picker';
import {getAddressLocation} from "./libraries/NominatimService"; // Import ImagePicker


const App = () => {
  const [photos, setPhotos] = React.useState<Array<Photo>>([]);
  const [user, setUser] = React.useState("");
  const [cameraAction, setCameraAction] = React.useState<string>("Start Camera");
  const [photo, setPhoto] = React.useState("");
  const [camera, setCamera] = React.useState<Camera|null>(null);
  const [cameraStarted, setCameraStarted] = React.useState<boolean>(false);
  // Question 2 - Variable declaration for address and setter.
  const [address, setAddress] = React.useState("");
  // Question 3 - Variable declaration for comment and setter.
  const [comment, setComment] = React.useState("");

  // Question 1 - Upload image from users library when button is pressed.
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      // Media type only for images, preventing video uploads.
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri); // Setting the image for use in Submit Report
      console.log('Selected Image:', result.assets[0].uri);
    }
  };

  // Get the photos from the service when the button is pressed
  const updatePhotos = async () => {
    const p = await getPhotos(user);
    console.log(p);
    setPhotos(p);
  }

  // Register a user on the service when the button is pressed
  const register = async () => {
    if (user == "") {
      console.log("No user name entered");
      return;
    }
    const result = await registerUser(user);
    console.log(result);
    alert("User registered");
  }
  
  //Image handling for the camera
  //Start the camera to take a photo
  const startCamera = async function() {
    const {status} = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      setCameraStarted(true);
      setCameraAction("Take Photo");
    } else {
      alert('Access denied');
    }
  }

  //Take a photo
  const takePicture = async function() {
    if (!camera) return;
    // p.uri is a uri of the photo
    const p = await camera.takePictureAsync();
    // Assign photo to the ScaledImage
    setPhoto(p.uri);
    setCameraStarted(false);
    setCameraAction("Start Camera");
  }

  //Change what the camera button does depending on the state
  const cameraButton = function(){
    if (cameraStarted){
      takePicture();
    }
    else {
      startCamera();
    }
  }

  // Submit an report when the button is pressed
  // Question 2 - Amending Function for address validation.
  const submitReport = async () => {
    if (!photo) {
      console.log("No image taken");
      return;
    }
    if (!user) {
      console.log("No user name entered");
      return;
    }
    if (!address) {
      console.log("No address entered");
      alert("Please enter an address.");
      return;
    }

    try {
      // Gather Latitude and Longitude of current address
      const result = await getAddressLocation(address);

      // If there is no result then the address is invalid.
      if (!result || result.length === 0) {
        alert("Address could not be found. Please try again.");
        return;
      }

      // Taking the lat and lon for use in conditional before.
      const {lat, lon} = result[0];

      // Validate coordinates against the area
      if (lat < 53.9 || lat > 54.0 || lon < -1.1 || lon > -1.0) {
        alert("The address is outside the operational area.");
        return;
      }
      // Submit the photo and location
      await addPhoto(user, photo, address);
      alert("Report submitted successfully.");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred while validating the address.");
    }
  };
      
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Yorvik Parking Company: Issue Reporting</Text>
      
      
      <Text style={styles.text}>Please enter your name</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setUser}
        value={user} />
      <Button title="Register name" onPress={register} />
      
      
      <Text style={styles.text}>Please take a photo</Text>
      {cameraStarted ? (
        <Camera
          style={styles.camera}
          type={CameraType.back}
          ref={(r: Camera | null) => {
            setCamera(r);
          }}
        ></Camera>
      ) :  photo && <ScaledImage uri={photo} width={Dimensions.get('window').width}/>}

      {/*Adding a button to allow upload from library*/}
      <Button title="Upload from Library" onPress={pickImage} />

      <Button title={cameraAction} onPress={cameraButton} />

      {/*Text bar to add address*/}
      <Text style={styles.text}>Please enter the address</Text>
      <TextInput
          style={styles.textInput}
          onChangeText={setAddress}
          value={address}
      />


      <Button title="Submit report" onPress={submitReport} />
      <Button title="View reports" onPress={updatePhotos} />

      <Text style={styles.text}>Reports</Text>
      {photos.map((photo: Photo, index: number) => (
          <View key={index}>
            <PhotoEditor photo={photo} user={user} />
            {/*Question 3 - Adding text input with a setComment*/}
            <TextInput
                style={styles.textInput}
                placeholder="Add a comment"
                value={comment}
                onChangeText={setComment}
            />
            {/*Question 3 - Adding button that calls addComment */}
            <Button
                title="Submit Comment"
                onPress={async () => {
                  try {
                    await addComment(user, photo.id, comment);
                    alert("Comment added successfully!");
                    setComment(""); // Clear the input
                    await updatePhotos(); // Refresh to fetch updated comments
                  } catch (error) {
                    console.error("Error adding comment:", error);
                    alert("Failed to add the comment. Please try again.");
                  }
                }}
            />
          </View>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imagecontainer: {
    flex: 1,
    minHeight: 200,
  },
  camera: {
    flex: 1,
    minHeight: 200,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
  textInput: {
    fontSize: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  input: {
    width: 200,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default App;
