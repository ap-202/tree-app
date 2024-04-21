import { StatusBar } from "expo-status-bar";
import courseData from "./assets/result.json";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { Box, Button, Text, NativeBaseProvider } from "native-base";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import Tree from "./Tree";

// Delete this after sprint 4 user interviews
let coursePrerequisitesMap = new Map();
coursePrerequisitesMap.set("PHYS 3122", "(PHYS 2212 OR PHYS 2232) AND (MATH 2403 OR MATH 2413 OR MATH 24X3)");
coursePrerequisitesMap.set("PHYS 4206", "PHYS 3211");
coursePrerequisitesMap.set("PHYS 4321", "PHYS 3143");
coursePrerequisitesMap.set("PHYS 2212", "PHYS 2211 OR PHYS 2231");
coursePrerequisitesMap.set("PHYS 2232", "PHYS 2211 OR PHYS 2231");
coursePrerequisitesMap.set("MATH 2403", "MATH 1502 OR MATH 1512 OR (MATH 15X2 AND MATH 1522)");
coursePrerequisitesMap.set("MATH 2413", "MATH 2401 OR MATH 2411 OR MATH 2605");
coursePrerequisitesMap.set("MATH 24X3", "");
coursePrerequisitesMap.set("PHYS 3211", "PHYS 2212 OR PHYS 2232");
coursePrerequisitesMap.set("PHYS 3143", "(PHYS 2212 OR PHYS 2232) AND (MATH 2403 OR MATH 2413 OR MATH 24X3 OR MATH 2552 OR MATH 2562 OR MATH 2X52)");
coursePrerequisitesMap.set("PHYS 2211", "MATH 1502 OR MATH 1512");
coursePrerequisitesMap.set("PHYS 2231", "MATH 1502 OR MATH 1512");
coursePrerequisitesMap.set("MATH 1502", "MATH 1501 OR MATH 1511 OR MATH 15X1");
coursePrerequisitesMap.set("MATH 1512", "MATH 1501 OR MATH 1511");
coursePrerequisitesMap.set("MATH 1501", "MATH 1113");
coursePrerequisitesMap.set("MATH 1511", "MATH 1501");
coursePrerequisitesMap.set("MATH 15X1", "");
coursePrerequisitesMap.set("MATH 1113", "");
coursePrerequisitesMap.set("MATH 15X2", "");
coursePrerequisitesMap.set("MATH 1522", "MATH 15X2");
coursePrerequisitesMap.set("MATH 2401", "MATH 1502 OR MATH 1512 OR (MATH 15X2 AND MATH 1522)");
coursePrerequisitesMap.set("MATH 2411", "MATH 1502 OR MATH 1512");
coursePrerequisitesMap.set("MATH 2605", "MATH 1502 OR MATH 1512 OR (MATH 15X2 AND MATH 1522)");
coursePrerequisitesMap.set("MATH 2552", "MATH 1502 OR MATH 1512 OR MATH 1504 OR MATH 1555 OR ((MATH 1552 OR MATH 15X2 OR MATH 1X52) AND (MATH 1553 OR MATH 1X54 OR MATH 1554 OR MATH 1564 OR MATH 1522 OR MATH 1X53))");
coursePrerequisitesMap.set("MATH 2562", "MATH 1502 OR MATH 1512 OR MATH 1504 OR MATH 1555 OR ((MATH 1552 OR MATH 15X2 OR MATH 1X52) AND (MATH 1553 OR MATH 1X54 OR MATH 1554 OR MATH 1564 OR MATH 1522 OR MATH 1X53))");
coursePrerequisitesMap.set("MATH 2X52", "");
coursePrerequisitesMap.set("MATH 1504", "MATH 1503 OR MATH 1501 OR MATH 1511 OR MATH 15X1");
coursePrerequisitesMap.set("MATH 1555", "MATH 1550 OR MATH 1551 OR MATH 1501 OR MATH 1X51 OR MATH 15X1 OR MATH 1X54");
coursePrerequisitesMap.set("MATH 1552", "MATH 1550 OR MATH 1551 OR MATH 1501 OR MATH 15X1 OR MATH 1X51");
coursePrerequisitesMap.set("MATH 1X52", "");
coursePrerequisitesMap.set("MATH 1550", "(MATH 1113 OR MATH 11X3)");
coursePrerequisitesMap.set("MATH 1551", "(MATH 1113 OR MATH 11X3)");
coursePrerequisitesMap.set("MATH 1X51", "");
coursePrerequisitesMap.set("MATH 1X54", "");
coursePrerequisitesMap.set("MATH 11X3", "");
coursePrerequisitesMap.set("MATH 1553", "(MATH 1113 OR MATH 11X3) OR MATH 15X1 OR MATH 1X51 OR MATH 1551");
coursePrerequisitesMap.set("MATH 1554", "(MATH 1113 OR MATH 11X3) OR MATH 1552 OR MATH 15X2 OR MATH 1X52 OR MATH 1551");
coursePrerequisitesMap.set("MATH 1564", "MATH 1552");
coursePrerequisitesMap.set("MATH 1522", "MATH 15X2");
coursePrerequisitesMap.set("MATH 1X53", "");
coursePrerequisitesMap.set("BMED 3610", "BMED 2310 AND (BMED 2400 OR ISYE 3770 OR CEE 3770) AND BMED 3600");
coursePrerequisitesMap.set("BMED 3520", "BMED 3100 AND (BMED 2210 OR BMED 2110) AND (MATH 2403 OR MATH 2413 OR MATH 24X3 OR MATH 2552 OR MATH 2562 OR MATH 2X52) AND CS 1371");
coursePrerequisitesMap.set("BMED 3600", "BMED 3100");
coursePrerequisitesMap.set("BMED 2310", "(BMED 2210 OR BMED 2110) AND BMED 2250 AND (PHYS 2211 OR PHYS 2231)");
coursePrerequisitesMap.set("BMED 2400", "(MATH 1501 OR MATH 1511 OR MATH 1552) AND CS 1371");
coursePrerequisitesMap.set("ISYE 3770", "MATH 2550 OR MATH 2551 OR (MATH 2X51 AND (MATH 1522 OR MATH 1553 OR MATH 1554 OR MATH 1564 OR MATH 1X53 OR MATH 1X54))");
coursePrerequisitesMap.set("CEE 3770", "MATH 2401 OR MATH 2411 OR MATH 24X1 OR MATH 2551 OR MATH 2561 OR MATH 2X51");
coursePrerequisitesMap.set("BMED 2210", "(MATH 1501 OR MATH 1511 OR MATH 1X52 OR MATH 1552) AND (CHEM 1211K OR CHEM 1310)");
coursePrerequisitesMap.set("BMED 2110", "(CHEM 1211K OR CHEM 1310) AND (MATH 1552 OR MATH 15X2) AND BMED 1000");
coursePrerequisitesMap.set("BMED 2250", "BMED 2210 OR BMED 2110");
coursePrerequisitesMap.set("CHEM 1310", "");
coursePrerequisitesMap.set("BMED 1000", "");
coursePrerequisitesMap.set("CS 1371", "");
coursePrerequisitesMap.set("MATH 24X1", "");
coursePrerequisitesMap.set("MATH 2551", "MATH 1502 OR MATH 1512 OR MATH 1504 OR MATH 1555 OR ((MATH 1552 OR MATH 15X2 OR MATH 1X52) AND (MATH 1553 OR MATH 1X54 OR MATH 1554 OR MATH 1564 OR MATH 1522 OR MATH 1X53))");
coursePrerequisitesMap.set("MATH 2561", "MATH 1502 OR MATH 1512 OR MATH 1504 OR MATH 1555 OR ((MATH 1552 OR MATH 15X2 OR MATH 1X52) AND (MATH 1553 OR MATH 1X54 OR MATH 1554 OR MATH 1564 OR MATH 1522 OR MATH 1X53))");
coursePrerequisitesMap.set("MATH 2X51", "");
coursePrerequisitesMap.set("BMED 3100", "CHEM 1315 OR CHEM 2311");
coursePrerequisitesMap.set("CHEM 1315", "CHEM 1211K OR CHEM 1310");
coursePrerequisitesMap.set("CHEM 1211K", "");
coursePrerequisitesMap.set("CHEM 1212K", "CHEM 1211K OR CHEM 1310");
coursePrerequisitesMap.set("CHEM 2311", "CHEM 1311 OR CHEM 1212K");
coursePrerequisitesMap.set("CHEM 1311", "CHEM 1310");
coursePrerequisitesMap.set("CS 1301", "");
coursePrerequisitesMap.set("CS 1331", "CS 1301 OR CS 1315 OR CS 1321 OR CS 1371");

export default function ScrapeView() {
    const [courseName, setCourseName] = useState("");
    const [prerequisites, setPrerequisites] = useState("");
    const [otherCourses, setOtherCourses] = useState("");

    const firebaseConfig = {
        apiKey: "AIzaSyB9_gnWKRWeYmND9tRzO7j3xK9Reg8-NpQ",
        authDomain: "tree-app-1f060.firebaseapp.com",
        databaseURL: "https://tree-app-1f060-default-rtdb.firebaseio.com",
        projectId: "tree-app-1f060",
        storageBucket: "tree-app-1f060.appspot.com",
        messagingSenderId: "702893689283",
        appId: "1:702893689283:web:346fb553cb403702c21576",
    };

    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);

    useEffect(() => {
        setCourses()
    }, []);
    async function setCourses() {
        let moreCourses = await getPreReqs();
        Object.keys(moreCourses).map((key) => {
            if (!coursePrerequisitesMap.has(key.toUpperCase())) {
                coursePrerequisitesMap.set(key.toUpperCase(), moreCourses.get(key).toUpperCase());
            }
        })
    }
    setCourses();

    useEffect(() => {
        fetchPrerequisites();
    }, [courseName, otherCourses]);

    const noPrerequisitesFoundText =
        "No prerequisites found or course(s) do not exist.";

    const getPreReqs = async () => {
        const col = await getDocs(collection(firestore, "prereqs"));
        const courses: any = [];
        col.forEach((course: any) => {
            const courseData = course.data();
            courses.push({
                identifier: courseData.identifier,
                prereqs: courseData.prerequisites,
            });
        });
        const courseMap = new Map();
        courses.forEach((course: any) => {
            const identifier = course.identifier;
            if (course.prereqs) {
                const preReqs = course.prereqs.courses;
                const preReqType = course.prereqs.type.toUpperCase();
                let preReqString = "";

                preReqs.forEach((prereq: any) => {
                    if (typeof prereq == "string") {
                        preReqString += prereq + " " + preReqType + " ";
                    } else {
                        let temp = "";
                        let last = "";
                        prereq.courses.forEach((p: any) => {
                            temp += p + " " + prereq.type.toUpperCase() + " ";
                            last = prereq.type.toUpperCase();
                        });
                        temp = temp.substring(0, temp.length - (last.length + 2));
                        preReqString += "(" + temp + ")" + " " + preReqType + " ";
                        //temp = temp.substring(0, temp.length - prereq.type)
                    }
                });
                const finalPreReqString = preReqString.substring(
                    0,
                    preReqString.length - (preReqType.length + 2)
                );
                courseMap.set(identifier, finalPreReqString);
            } else {
                courseMap.set(identifier, "");
            }
        });
        return courseMap;
    };

    const getPrerequisitesForSingleCourse = (singleCourse: string) => {
        let coursePrerequisites = '';
        if (coursePrerequisitesMap.get(singleCourse) != null) { // Delete this after sprint 4 user interviews
            coursePrerequisites = coursePrerequisitesMap.get(singleCourse); // Delete this after sprint 4 user interviews
        } else { // Delete this after sprint 4 user interviews
            const course = courseData.find(c => c.identifier === singleCourse);
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
                coursePrerequisites=`${prereqs}`;
            } else {
                return noPrerequisitesFoundText;
            }
        } // Delete this after sprint 4 user interviews
        return coursePrerequisites;
    }

  const fetchPrerequisites = () => {
    let courseNameList = courseName.toUpperCase().split(',').map((c) => c.trim()).filter((c) => !!c);
    console.log(courseNameList);
    let prerequisitesList = '';
    let currExpandedCourseList = otherCourses.toUpperCase().split(',').map((c) => c.trim()).filter((c) => !!c);
    console.log(currExpandedCourseList);
    for (let i = 0; i < courseNameList.length; i++) {
      let currPrerequisites = getPrerequisitesForSingleCourse(courseNameList[i]);
      console.log(currPrerequisites);
      if (currPrerequisites == noPrerequisitesFoundText) {
        setPrerequisites(currPrerequisites);
        return;
      }
      if (currPrerequisites) {
        prerequisitesList += '(' + currPrerequisites + ')'
        if (i < courseNameList.length - 1) {
          prerequisitesList += ' AND ';
        }
      }
    }
    let found = true;
    while (found) {
        found = false;
        for (let i = 0; i < currExpandedCourseList.length; i++) {
            if (!prerequisitesList.includes(currExpandedCourseList[i])) continue;
            let currPrerequisites = getPrerequisitesForSingleCourse(currExpandedCourseList[i]);
            if (currPrerequisites && currPrerequisites != noPrerequisitesFoundText) {
                found = true;
                prerequisitesList.replace(currExpandedCourseList[i], currPrerequisites);
            }
        }
    }
    setPrerequisites(prerequisitesList);
  };

    const pushAllData = async () => {
        courseData.forEach(async (course) => {
            try {
                const doc = await addDoc(collection(firestore, "prereqs"), course);
            } catch (error) {
                console.log(error);
            }
        });
    };

    const logMetrics = async (data: any) => {
        try {
            console.log("TRYING LOGGED")
            const coll = collection(firestore, "metrics")
            const ref = await addDoc(coll, data)
            console.log("LOGGED")
        } catch(err) {console.log(err)}
    };

    const onFirebaseButtonPressed = () => {
        pushAllData();
    };

    const onLogStatisticsButtonPressed = async () => {
        setUserMetrics((metrics) => {
            if (metrics.length > 0 && !!!metrics[metrics.length - 1].endTime)
                metrics[metrics.length - 1].endTime = Date.now();
            return metrics;
        });
        console.log("total courses searched: " + userMetrics.length);
        let total_courses = userMetrics.length
        let individual_courses: any = {}
        let total_duration = 0
        let totalDuration = 0;
        console.log("courses: ");
        for (let i = 0; i < userMetrics.length; i++) {
            let duration = userMetrics[i].endTime - userMetrics[i].startTime;
            console.log(
                "    course: " +
                userMetrics[i].course.toUpperCase() +
                ", duration: " +
                (duration / 1000).toFixed(1) +
                "s"
            );
            let name_c = userMetrics[i].course.toUpperCase()
            let dur_c = duration / 1000
            individual_courses[name_c] = dur_c
            totalDuration += duration;
        }
        total_duration = (totalDuration / 1000)
        console.log("total duration: " + (totalDuration / 1000).toFixed(1) + "s");
        const date = new Date();
        const log_data = {
            date: date,
            individual_courses: individual_courses,
            total_courses_searched: total_courses,
            total_duration: total_duration
        }
        logMetrics(log_data)
        
    };




    const [userMetrics, setUserMetrics] = useState<
        { course: string; startTime: number; endTime: number }[]
    >([]);

    useEffect(() => {
        if (prerequisites && prerequisites != noPrerequisitesFoundText) {
            setUserMetrics((metrics) => {
                if (metrics.length > 0 && !!!metrics[metrics.length - 1].endTime)
                    metrics[metrics.length - 1].endTime = Date.now();
                metrics.push({ course: courseName, startTime: Date.now(), endTime: 0 });
                return metrics;
            });
        }
    }, [prerequisites]);

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <Text>Enter Course Number(s) (separated by commas):</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setCourseName}
                    value={courseName}
                    placeholder="e.g. MATH 3012"
                />
                {/*<Text>Enter Course(s) To Expand (separated by commas):</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setOtherCourses}
                    value={otherCourses}
                    placeholder="other"
                />*/}
                <Text style={styles.prereq_header}>Prerequisites Info</Text>
                {prerequisites != null ? (
                    <>
                        <Text style={styles.prerequisites}>
                            Prerequisites: {prerequisites}
                        </Text>
                        {prerequisites != noPrerequisitesFoundText ? (
                            <Tree
                                course={courseName}
                                prerequisites={prerequisites}
                                setCourse={setCourseName}
                            />
                        ) : null}
                    </>
                ) : null}
                <Text>search count: {userMetrics.length}</Text>

                <Box pt="5">
                    <Button onPress={onFirebaseButtonPressed}>
                        Push result.json To Firebase
                    </Button>
                    <Button onPress={onLogStatisticsButtonPressed}>Log statistics</Button>
                </Box>
                <StatusBar style="auto" />
            </View>
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: "80%",
    },
    prereq_header: {
        marginTop: 20,
        textAlign: "center",
        color: "#003057",
        fontWeight: "bold",
    },
    prerequisites: {
        marginTop: 20,
        textAlign: "center",
    },
});
