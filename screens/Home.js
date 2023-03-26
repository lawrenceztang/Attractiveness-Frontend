import React, { useState, useRef, useEffect } from "react";
import { Camera, CameraType } from 'expo-camera';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons'; 

const DEVELOPMENT_URL = 'http://10.0.0.91:5000'

export default function Home({navigation, route}) {
    let cameraRef = useRef()
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [picture, setPicture] = useState(null);
    const [score, setScore] = useState(null);

    const onCameraReady = () => {
        console.log("true");
        setIsCameraReady(true);
    };

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('storage')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            // error reading value
        }
    }

    const storeData = async (value) => {
        console.log("Store Data Body");
        try {
          let k = await getData()
          if (k == null){
            const jsonValue = JSON.stringify({'photos' : [value]})
            await AsyncStorage.setItem('storage', jsonValue)
          }
          else{
            console.log("Found stored photos");
            k['photos'].push(value)
            const jsonValue = JSON.stringify(k)
            await AsyncStorage.setItem('storage', jsonValue)
          }
        } catch (e) {
          // saving error
        }
    }

    const takePicture = () => {
        cameraRef.current.takePictureAsync({base64: true})
        .then((final)=> {
            // console.log(final['base64'])
            setPicture(final['base64'])
            axios.post(DEVELOPMENT_URL + '/images', {'data' : final['base64']})
            .then((r) => {
                console.log(r['data']);
                storeData(final['base64'])
                .then(() => {
                    setScore(r['data']);
                })
                .catch(() => {

                })
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                console.log('Request completed'); // Add this line to check if the request is completing or failing
            });
        })
    };

    useEffect(()=> {
        if (hasPermission == null){
            Camera.requestCameraPermissionsAsync()
            .then((resp) => {
                setHasPermission(resp['granted'])
            })
            .catch(
            )
        }
        
    },[])

    if(picture){
        if(score) {
            return(
                <SafeAreaView style={styles.container}>
                    <Image style={{...styles.pictureContainer, backgroundColor: 'red'}} source={{uri: `data:image/jpeg;base64,${picture}`}}></Image>
                    <View style={styles.optionBar}>
                        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                            <Text>Next</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                )
        }   
        console.log('Picture uri', picture);
        return(
        <SafeAreaView style={styles.container}>
            <Image style={{...styles.pictureContainer, backgroundColor: 'red'}} source={{uri: picture}}></Image>
            <View style={styles.optionBar}>
                <Text> Currently Evaluating Image... </Text>
            </View>
        </SafeAreaView>
        )
    }
    
    return(
       <SafeAreaView style={styles.container}>
            <Camera style={styles.container} ref={cameraRef} type={type} onCameraReady={onCameraReady}></Camera>
            <View style={styles.optionBar}>
                <TouchableOpacity style={styles.smallerButtonContainer}>
                    <FontAwesome5 name="clipboard-list" size={60} color="black" onPress={() => navigation.navigate('Dashboard')}/>
                </TouchableOpacity>
                <View style={styles.cameraButtonContainer}>
                    <TouchableOpacity style={styles.roundButton1} onPress={takePicture}></TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.smallerButtonContainer} onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}>
                    <Ionicons name="camera-reverse-outline" size={60} color="black" />
                </TouchableOpacity>
            </View>
       </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 5,
        flexDirection: 'column',
      },
    optionBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraButtonContainer : {
        flex: 4,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallerButtonContainer : {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roundButton1: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: 'orange',
    },
    centeredContainer: {
        flex: 5,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pictureContainer : {
        width: '100%',
        height: undefined,
        aspectRatio: .75,
    }
})