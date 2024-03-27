import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { NativeBaseProvider, Box, VStack, Button, Text, Center } from 'native-base';

interface Course {
  courseNum: string;
  name: string;
}

const CourseSelectionView: React.FC = () => {
  const initialCourses: Course[] = [
    { courseNum: 'cs1301', name: 'CS 1301' },
    { courseNum: 'cs1331', name: 'CS 1331' },
    { courseNum: 'cs1332', name: 'CS 1332' },
    { courseNum: 'cs2050', name: 'CS 2050' },
    { courseNum: 'cs2110', name: 'CS 2110' },
    { courseNum: 'cs2200', name: 'CS 2200' },
    { courseNum: 'cs4261', name: 'CS 4261' },

  ];

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses(prevSelectedCourses =>
      prevSelectedCourses.includes(courseId)
        ? prevSelectedCourses.filter(courseNum => courseNum !== courseId)
        : [...prevSelectedCourses, courseId],
    );
  };

  const renderCourse = ({ item }: { item: Course }) => (
    <Button
      variant="subtle"
      colorScheme="primary"
      onPress={() => toggleCourseSelection(item.courseNum)}
      size="md"
      mb="3"
      _text={{
        color: 'coolGray.800'
      }}
      backgroundColor={selectedCourses.includes(item.courseNum) ? 'primary.100' : 'coolGray.100'}
    >
      {item.name}
    </Button>
  );

  return (
    <NativeBaseProvider>
      <Center flex={1} bgColor="#fff">
        <Box width="75%" maxW="300px">
          <VStack space={5} mt="5">
            <Text fontSize="lg" bold mb="4" textAlign="center">
              Select courses you have already taken!
            </Text>
            <FlatList
              data={courses}
              renderItem={renderCourse}
              keyExtractor={item => item.courseNum}
            />
            <Text fontSize="md" bold mt="5">
              Selected Courses:
            </Text>
            {selectedCourses.map(courseId => {
              const course = courses.find(course => course.courseNum === courseId);
              return (
                <Text key={courseId} fontSize="sm" mt="2">
                  {course?.name}
                </Text>
              );
            })}
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default CourseSelectionView;
