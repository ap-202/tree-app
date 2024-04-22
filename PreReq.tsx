import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NativeBaseProvider } from "native-base";
import {HStack, VStack, Input, Button } from 'native-base';

/* 4th screen - Class Info Screen */
const PreReqView = ({ navigation, route }) => {

    const [search, setSearch] = useState('')

    const submitSearch = () => {
        setSearch("")
        navigation.navigate("Class Information", {classID: "CS1301"})
    }

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