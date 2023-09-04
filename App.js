import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import PaginatedHorizontalList from './PaginatedTest'
import { useState } from 'react';
import Dashboard from './screens/Dashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  const [cachedImages, setCachedImages] = useState([])

//  return (
//      <NavigationContainer>
//        <Stack.Navigator>
//          <Stack.Screen
//          name="Home"
//          component={Home}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  e}
//          options={{headerShown: false, unmountOnBlur: true}} />
//          <Stack.Screen
//          name="Dashboard"
//          component={Dashboard}
//          options={{headerShown: false}} />
//        </Stack.Navigator>
//    </NavigationContainer>
//  );
    function Welcome(props) {
        return <Text>Hello</Text>;
    }



    return (
      <View style={styles.container}>
        {PaginatedHorizontalList([Welcome], [Welcome])}
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
