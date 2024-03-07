import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View,KeyboardAvoidingView, Platform } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NativeBaseProvider, Box } from "native-base";
import { Center } from 'native-base';
import { HStack, ScrollView, VStack, FlatList, Input, Button, Heading, Text, FormControl, Radio} from 'native-base'; 
import CommentCard from './Comment';
 
/* 5th screen - Comments Screen */
const CommentsView = ({navigation, route}) => {

    const classID = route.params.classID
    const [comments, setComments] = useState([])
    const [currComment, setCurrComment] = useState('')

    const listRef = useRef(null)

    const fetchComments = (classID) => {
        //setComments("Some comments")
        const tempData = {
            "CS1301": [
                {
                    "commentID": "0",
                    "userID": "AUser",
                    "timestamp": "2024-03-05T08:00:00Z",
                    "commentText": "This course provided a solid introduction to programming concepts."
                },
                {
                    "commentID": "1",
                    "userID": "BUser",
                    "timestamp": "2024-03-06T09:30:00Z",
                    "commentText": "Highly recommend for beginners!"
                },
                {
                    "commentID": "2",
                    "userID": "CUser",
                    "timestamp": "2024-03-06T09:30:00Z",
                    "commentText": "Great class!"
                },
                {
                    "commentID": "3",
                    "userID": "DUser",
                    "timestamp": "2024-03-06T09:30:00Z",
                    "commentText": "The professor was amazing and I just need to fill text to test the length!"
                },
                {
                    "commentID": "4",
                    "userID": "EUser",
                    "timestamp": "2024-03-06T09:30:00Z",
                    "commentText": "Cool topics"
                }
            ]
        }
        return tempData[classID]
    }

    const submitComment = () => {
        if (currComment.length > 0){
            const newComment = {
                "commentID" : "239013821",
                "userID": "FUser",
                "timestamp": "2024-03-06T09:30:00Z",
                commentText: currComment
            }
            setComments([...comments, newComment])
            setCurrComment("")
        }

    }

    useEffect(() => {
        let data = fetchComments(classID)
        setComments(data)
    }, [classID]);

    useEffect(() => {
        if (comments.length > 0) 
            listRef.current?.scrollToEnd({ animated: true });
    }, [comments])


    return(
        
        <NativeBaseProvider>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 75 : 20}>
            <FlatList ref = {listRef} data = {comments} renderItem={({ item }) => {return <CommentCard item={item} />}}/>
            {/* </Center>    */}
            <HStack  pb = "30" pl = "5" pr = "5" space={1} alignItems="center" justifyContent="center" mt={5}>
                <Input mx="" placeholder="Enter comment" w="80%" h="10" value = {currComment} onChangeText={setCurrComment}/>
                <Button flex = {1} onPress = {submitComment}>Send</Button>
            </HStack>
            </KeyboardAvoidingView>
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

export default CommentsView