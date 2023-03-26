import React, { useState, useRef, useEffect } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
  } from "react-native";
import axios from 'axios';
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from '@expo/vector-icons'; 

const DEVELOPMENT_URL = 'http://10.0.0.91:5000'

export default function Dashboard({navigation, route}) {
    const [allObjs, setAllObjs]  = useState(null);

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

    const clearData = async () => {
        try {
            const jsonValue = JSON.stringify({'photos' : []})
            await AsyncStorage.setItem('storage', jsonValue)
        }catch (e) {
            // saving error
        }
    }

    const PhotoUnit = ({item}) => {
        console.log(item[2]);
        return (<View style={{ flex: 1, backgroundColor: 'white' }}>
            <Image style={{...styles.pictureContainer, backgroundColor: 'red'}}  source={{uri: `data:image/jpeg;base64,${item[1]}`}}></Image>
            <Text>{item[2]}</Text>
        </View>)
    }

    useEffect(() => {
        if(allObjs == null){
            axios.get(DEVELOPMENT_URL + '/images')
            .then((r) => {
                console.log("Response", r['data'].length);
                // console.log("r", r['data'][0][0])
                setAllObjs(r['data'])
            })
            .catch((e) => {
                console.log("error", e)
            })
            .finally(() => {

            })
        }

    }, [])

    if (allObjs == null)
    {
        return <SafeAreaView style={styles.centeredContainer}>
            <Text>Loading...</Text>
        </SafeAreaView>
    }

    return (<SafeAreaView style={styles.centeredContainer}>
        <FlatList
        data={allObjs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <PhotoUnit item={item} />}
        style={{ flex: 1, backgroundColor: 'white' }}
        />
        <View>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <AntDesign name="camera" size={60} color="black" />
        </TouchableOpacity>
        </View>
    </SafeAreaView>)
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