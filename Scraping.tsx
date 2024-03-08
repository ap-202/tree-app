import { StatusBar } from 'expo-status-bar';
import courseData from './assets/result.json';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Box, HStack, ScrollView, VStack, FlatList, Input, Button, Heading, Text, FormControl, Radio, NativeBaseProvider} from 'native-base';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export default function ScrapeView() {
  const [courseName, setCourseName] = useState('');
  const [prerequisites, setPrerequisites] = useState('');

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

  useEffect(() => {
    fetchPrerequisites();
  }, [courseName]);

  const fetchPrerequisites = () => {
    const course = courseData.find(c => c.identifier === courseName.toUpperCase());
    if (course && course.prerequisites) {
      const prereqs = course.prerequisites.courses.map(pr => {
        if (typeof pr === 'string') {
          return pr;
        } else if (pr.type === 'or') {
          return '(' + pr.courses.join(' OR ') + ')';
        } else if (pr.type === 'and') {
          return '(' + pr.courses.join(' AND ') + ')';
        }
        return '';
      }).join(' AND ');
      setPrerequisites(`${prereqs}`);
    } else {
      setPrerequisites('No prerequisites found or course does not exist.');
    }
  };

  const pushAllData = async () => {
    courseData.forEach(async (course) => {
        try {
            const doc = await addDoc(collection(firestore, "prereqs"), course);
        }catch(error){console.log(error)}
    });
  };

  const onButtonPressed = () => {
    pushAllData()        
  }

  return (
    <NativeBaseProvider>
        <View style={styles.container}>
        <Text>Enter Course Number:</Text>
        <TextInput
            style={styles.input}
            onChangeText={setCourseName}
            value={courseName}
            placeholder="e.g. MATH 3012"
        />
        <Text style={styles.prereq_header}>Prerequisites Info</Text>
        {prerequisites ? (
            <Text style={styles.prerequisites}>Prerequisites: {prerequisites}</Text>
        ) : null}
        <Box pt= "5"><Button onPress = {onButtonPressed}>Push result.json To Firebase</Button></Box>
        <StatusBar style="auto" />
        </View>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  prereq_header: {
    marginTop: 20,
    textAlign: 'center',
    color: '#003057',
    fontWeight: 'bold',
  },
  prerequisites: {
    marginTop: 20,
    textAlign: 'center',
  },
});
