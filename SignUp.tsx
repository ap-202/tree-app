import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NativeBaseProvider, Box } from "native-base";
import { Center } from 'native-base';
import { VStack, Input, Button, Heading, Text, FormControl} from 'native-base'; 
 
 /* 2nd screen - Sign Up */
 const SignUpView = ({navigation}) => {
    
    const [firstName, updateFirstName] = useState('')
    const [lastName, updateLastName] = useState('')
    const [email, updateEmail] = useState('')
    const [password, updatePassword] = useState('')
    const [confirmPassword, updateConfirmPassword] = useState('')

    const submitSignUpData = () => {
        console.log(email)
        console.log(password)
        navigation.navigate("Class Information")
    }

    console.log("HERE")

    return(
        <View style={styles.container}>
            <NativeBaseProvider>
                <Center>
                    <Center width= 'xs' height={'2xl'}>
                        <Heading size="2xl" color="primary.500">Tree</Heading> 
                        <FormControl
                         w="75%" maxW="300px">
                            <VStack space={1}> 
                                <FormControl.Label>First Name</FormControl.Label>
                                <Input mx="" placeholder="First Name" w="100%" h="10" onChangeText={updateFirstName} />
                                <FormControl.Label>Last Name</FormControl.Label>
                                <Input mx="" placeholder="Last Name" w="100%" h="10" onChangeText={updateLastName} />
                                <FormControl.Label>Email</FormControl.Label>
                                <Input mx="" placeholder="Email" w="100%" h="10" onChangeText={updateEmail} />
                                <FormControl.Label>Password</FormControl.Label>
                                <Input type = "password" mx="" placeholder="Password" w="100%" h="10" onChangeText={updatePassword} />
                                <FormControl.HelperText>Must be atleast 8 characters</FormControl.HelperText>
                                <FormControl.Label>Confirm Password</FormControl.Label>
                                <Input type = "password" mx="" placeholder="Confirm Password" w="100%" h="10" onChangeText={updateConfirmPassword} />
                            </VStack>
                            <Box padding={"5"} alignContent={'center'} alignItems={'center'}><Button onPress={submitSignUpData} w="40%" color="primary.500">Sign Up</Button></Box>
                        </FormControl>
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

export default SignUpView