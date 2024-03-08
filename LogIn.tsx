import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NativeBaseProvider, Box } from "native-base";
import { Center } from 'native-base';
import { VStack, Input, Button, Heading, Text, FormControl} from 'native-base'; 
import SignUpView from './SignUp';
 
 /* 1st screen - Log In */
 const LogInView = ({navigation}) => {
        
    const [email, updateEmail] = useState('')
    const [password, updatePassword] = useState('')

    const submitLogInData = () => {
        navigation.navigate("PreReq", {classID: 'CS1301'})
        //navigation.navigate("Scrape")
    }

    return(
        <View style={styles.container}>
            <NativeBaseProvider>
                <Center>
                    <Center width= 'xs' height={'1/2'}>
                        <Heading size="2xl" color="primary.500">Tree</Heading> 
                        <FormControl
                         w="75%" maxW="300px">
                            <VStack space={1}> 
                                <FormControl.Label>Email</FormControl.Label>
                                <Input mx="" placeholder="Email" w="100%" h="10" onChangeText={updateEmail} />
                                <FormControl.Label>Password</FormControl.Label>
                                <Input type = "password" mx="" placeholder="Password" w="100%" h="10" onChangeText={updatePassword} />
                            </VStack>
                            <Box padding={"5"} alignContent={'center'} alignItems={'center'}><Button onPress={submitLogInData} w="40%" color="primary.500">Log In</Button></Box>
                        </FormControl>
                    </Center>
                    <Center width= 'xs' height={'1/2'}>
                        <VStack space={5} alignItems="center">
                            <Text textAlign="center" fontSize={13}>Don't have an account? Click the button below to get started.</Text>
                            <Button onPress = {() => {navigation.navigate("Sign Up")}}>Sign Up</Button>
                            <Button onPress = {() => {navigation.navigate("Scrape")}}>DEV BUTTON</Button>
                        </VStack>
                    </Center>
                </Center>

            </NativeBaseProvider>
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

export default LogInView