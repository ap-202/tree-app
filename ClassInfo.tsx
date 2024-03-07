import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NativeBaseProvider } from "native-base";
import { Center } from 'native-base';
import {HStack, VStack, Input, Button, Heading, Text, FormControl, Radio} from 'native-base'; 
import { WebView } from 'react-native-webview';

/* 4th screen - Class Info Screen */
const ClassInfoView = ({ navigation, route }) => {


    const classID = route.params.classID

    const [classDesc, setClassDesc] = useState('')
    const [classGPA, setClassGPA] = useState('')

    const fetchClassInfo = (classID) => {
        const newGPAData="Average GPA: 3.33"
        const newDesc="Introduction to computing principles and programming practices with an emphasis on the design, construction and implementation of problem solutions use of software tools."
        setClassDesc(newDesc)
        setClassGPA(newGPAData)
    }
    const onCommentsClick = () => {
        navigation.navigate("Comments", {classID: 'CS1301'})
    }

    useEffect(() => {
        fetchClassInfo(classID)
    }, []);

    return(
        <NativeBaseProvider>
            <VStack space ="1">
            <Heading p ="5">{classID}</Heading>
            <Text p = "5">Description: {classDesc}</Text>
            <Text p = "5">{classGPA}</Text>
            <HStack  pb = "30" pl = "5" pr = "5" space={1} alignItems="center" justifyContent="center" mt={5}>
                <Button flex = {1}>Save</Button>
                <Button flex = {1}>Share</Button>
                <Button flex = {1} onPress = {onCommentsClick}>Comments</Button>
            </HStack>
            </VStack>

            
        </NativeBaseProvider>
    );
};

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

export default ClassInfoView