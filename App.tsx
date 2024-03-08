import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NativeBaseProvider, Box } from "native-base";
import { Center } from 'native-base';
import { VStack, Input, Button, Heading, Text} from 'native-base';
import LogInView from './LogIn';
import SelectAOSView from './AOS'
import ClassInfoView from './ClassInfo';
import SignUpView from './SignUp';
import CommentsView from './Comments';
import PreReqView from './PreReq';
import ScrapeView from './Scraping';

const App = () => {

    /* Container for each screen -> to add new screen, add a new <Stack.Screen>, where component = the page and name = name of page  */
    /* For a button to go to a different screen, you can use onPress = {() => {navigation.navigate(name_of_page)}} */
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>  
            <Stack.Navigator>
                <Stack.Screen name = "Log In" component = {LogInView} />
                <Stack.Screen name = "Sign Up" component = {SignUpView} />
                <Stack.Screen name = "PreReq" component = {PreReqView} />
                <Stack.Screen name = "Area Of Study" component = {SelectAOSView} />
                <Stack.Screen name = "Class Information" component = {ClassInfoView} />
                <Stack.Screen name = "Comments" component = {CommentsView} />
                <Stack.Screen name = "Scrape" component = {ScrapeView} />
            </Stack.Navigator>
        </NavigationContainer>  
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInput: {
      padding: 10,
    },
    button: {
      padding: 10,
    },
    text: {
      padding: 10
    }
  });

export default App