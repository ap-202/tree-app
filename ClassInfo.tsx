import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from "native-base";
import { Center } from 'native-base';
import { HStack, VStack, Input, Button, Heading, Text, FormControl, Radio } from 'native-base'; 
import { WebView } from 'react-native-webview';

import { initializeApp } from 'firebase/app';
import { getFirestore, query, collection, where, getDocs } from 'firebase/firestore';

/* 4th screen - Class Info Screen */
const ClassInfoView = ({ route, navigation }) => {

  /* Configuration for Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyB9_gnWKRWeYmND9tRzO7j3xK9Reg8-NpQ",
  authDomain: "tree-app-1f060.firebaseapp.com",
  databaseURL: "https://tree-app-1f060-default-rtdb.firebaseio.com",
  projectId: "tree-app-1f060",
  storageBucket: "tree-app-1f060.appspot.com",
  messagingSenderId: "702893689283",
  appId: "1:702893689283:web:346fb553cb403702c21576"
};  

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

  const classID = route.params.classID.replace(/%20/g, ' '); 
  console.log("Received classID:", classID);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const q = query(collection(firestore, "prereqs"), where("identifier", "==", classID));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setCourseData(querySnapshot.docs[0].data()); // Assuming each identifier is unique
            } else {
                console.log("No document found with identifier:", classID);
            }
        } catch (error) {
            console.error("Firestore query error:", error);
        }
        setLoading(false);
    };

    fetchData();
}, [classID]);

  const onCommentsClick = () => {
    navigation.navigate("Comments", { classID })
  }

  if (loading) return <Text>Loading...</Text>;
  if (!courseData) return <Text>No course data found for identifier {classID}.</Text>;

  const restrictionsText = courseData.restrictions ? (
    `${courseData.restrictions.Campuses?.requirements?.join(', ') ?? 'No Campus Requirements'}, ` +
    `${courseData.restrictions.Levels?.requirements?.join(', ') ?? 'No Level Requirements'}`
    ) : 'No Restrictions Data Available';

    console.log("No document found with identifier:", classID);

  return (
      <View style={{ padding: 20 }}>
        <VStack space="1">
          <Heading p="5">{courseData.fullname}</Heading>
          <Text>
            <Text style={styles.boldText}>Grade Basis: </Text>{courseData.grade_basis}
          </Text>
          <Text>
            <Text style={styles.boldText}>Credit Hours: </Text>{courseData.hours}
          </Text>
          <Text>
            <Text style={styles.boldText}>Restrictions: </Text>{restrictionsText}
          </Text>
          <Text style={styles.boldText}>Instructors:</Text>
            {courseData.sections?.map((section, index) => (
            <Text key={index} style={{ paddingLeft: 10 }}>
              Section {section.section_id}: {section.instructors?.map(instructor => instructor.replace(/\s+/g, ' ').trim()).join(', ') || 'No Instructors Listed'}
            </Text>
            ))}
        </VStack>
        <HStack pb="30" pl="5" pr="5" space={1} alignItems="center" justifyContent="center" mt={8}>
          <Button flex={1}>Save</Button>
          <Button flex={1}>Share</Button>
          <Button flex={1} onPress={onCommentsClick}>Comments</Button>
        </HStack>       
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
  },
  boldText: {
    fontWeight: 'bold'
  }
});

export default ClassInfoView;