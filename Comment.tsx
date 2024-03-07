import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NativeBaseProvider, Box } from "native-base";
import { Center } from 'native-base';
import { HStack, Avatar, Divider, VStack, FlatList, Input, Button, Heading, Text, FormControl, Radio} from 'native-base'; 
 
/* Comment card component */
const CommentCard = (props) => {

    return(
        
        <NativeBaseProvider>
            <Box pr = "3" pl="3" pt="3">
            <Box pb="2">
                <HStack space ="2">
                    <Avatar bg="primary.500" source={{uri: "https://notarealworkingbrokenlink.com"}}>
                        {props.item.userID[0]}
                    </Avatar>
                    <VStack space="1">
                        <Text bold>
                            {props.item.userID}
                        </Text>
                        <Box>
                            {props.item.commentText}
                        </Box>
                    </VStack>
                </HStack>

            </Box>
            <Divider mr ="2"/>
            </Box>
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

export default CommentCard