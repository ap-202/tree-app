import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NativeBaseProvider } from "native-base";
import { Center } from 'native-base';
import {HStack, VStack, Input, Button, Heading, Text, FormControl, Radio} from 'native-base'; 
import { WebView } from 'react-native-webview';
import GraphView from './Graph';

/* 4th screen - Class Info Screen */
const PreReqView = ({ navigation, route }) => {

    const [search, setSearch] = useState('')

    const submitSearch = () => {
        console.log(search)
        setSearch("")
        navigation.navigate("Class Information", {classID: "CS1301"})
    }

    useEffect(() => {
        
    }, []);

    return(
        <NativeBaseProvider>
            <VStack space = "2">
                <HStack  pb = "30" pl = "5" pr = "5" space={1} alignItems="center" justifyContent="center" mt={5}>
                    <Input mx="" placeholder="Enter a class ID (e.g. CS 1301)" w="80%" h="10" value = {search} onChangeText={setSearch}/>
                    <Button flex = {1} onPress = {submitSearch}>Send</Button>
                </HStack>
            </VStack>
        </NativeBaseProvider>
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

export default PreReqView