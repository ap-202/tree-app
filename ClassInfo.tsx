import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NativeBaseProvider, Box } from "native-base";
import { Center } from 'native-base';
import { VStack, Input, Button, Heading, Text, FormControl, Radio} from 'native-base'; 
 
/* 4th screen - Class Info Screen */
const ClassInfoView = ({navigation}, classID) => {


    const [classDesc, setClassDesc] = useState('')
    const [classGPA, setClassGPA] = useState('')

    const fetchClassInfo = (classID) => {
        setClassDesc("SOME NEW DESC")
        setClassGPA("SOME NEW GPA DATA")
    }

    return(
        
        <View style={styles.container}>
            <Heading size = "xl">{classID}</Heading>
            <Text size = "md">{classDesc}</Text>
            <Text size = "md">{classGPA}</Text>
        </View>
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