import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NativeBaseProvider, Box } from "native-base";
import { Center } from 'native-base';
import { VStack, Input, Button, Heading, Text, FormControl, Avatar, Radio} from 'native-base'; 
 
/* 3rd screen - Select (Area of Study) Major + Threads */
const SelectAOSView = ({navigation}) => {

    const [major, updateMajor] = useState('')

    return(
        
        <View style={styles.container}>
            <Radio.Group name = "selectMajor" value = {major} onChange={(newMajor) => {updateMajor(newMajor)}}>
                <Radio value="Computer Science">
                    Computer Science
                </Radio>
                <Radio value="Computational Media">
                    Computational Media
                </Radio>
            </Radio.Group>
            <Radio.Group name = "select" value = {major} onChange={(newMajor) => {updateMajor(newMajor)}}>
                <Radio value="Computer Science">
                    Computer Science
                </Radio>
                <Radio value="Computational Media">
                    Computational Media
                </Radio>
            </Radio.Group>
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

export default SelectAOSView