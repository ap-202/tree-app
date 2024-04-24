import { StatusBar } from "expo-status-bar";
import courseData from "./assets/result.json";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { Box, Button, Text, NativeBaseProvider } from "native-base";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import Tree from "./Tree";

// Delete this after sprint 4 user interviews
let courses = new Map();

export default function ScrapeView() {
    const [courseName, setCourseName] = useState("");
    const [prerequisites, setPrerequisites] = useState("");
    const [otherCourses, setOtherCourses] = useState("");
    const [frozenCourseName, setFrozenCourseName] = useState("");
    const [courseStack, setCourseStack] = useState<string[]>([]);

    useEffect(() => {
        if (prerequisites && prerequisites != noPrerequisitesFoundText) {
            setUserMetrics((metrics) => {
                if (metrics.length > 0 && !!!metrics[metrics.length - 1].endTime)
                    metrics[metrics.length - 1].endTime = Date.now();
                metrics.push({ course: courseName.trim().toUpperCase(), startTime: Date.now(), endTime: 0 });
                return metrics;
            });
            setCourseStack((stack) => {
                if (courseName.trim().toUpperCase() != stack[stack.length - 1]) {
                    stack.push(courseName.trim().toUpperCase());
                }
                console.log(stack);
                return stack;
            });
        }
    }, [frozenCourseName]);

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

    useEffect(() => {
        setCourses()
    }, []);
    async function setCourses() {
        courses = await getPreReqs()
    }
    setCourses()

    useEffect(() => {
        fetchPrerequisites();
    }, [courseName, otherCourses]);

    const noPrerequisitesFoundText =
        "Enter course(s) to view prerequisites";

    //comment this function out and uncomment all of the courses.set lines to use the original map

    const fetchPrerequisites = () => {
        console.log("fetchPrerequisites");
        let other = otherCourses.split(",");
        if (
            courses.get(courseName.trim().toUpperCase()) != null &&
            courses.get(other[0].trim().toUpperCase()) != null
        ) {
            let pr = courses.get(courseName.toUpperCase());
            let cns = other;
            cns.unshift(courseName);
            let str = "";
            for (let i = 0; i < cns.length; i++) {
                //str += "("+courses.get(cns[i].toUpperCase())+") AND "
                if (courses.get(cns[i].toUpperCase()) != null) {
                    if (pr.includes(cns[i].toUpperCase())) {
                        pr = pr.replace(
                            cns[i].toUpperCase(),
                            "(" + courses.get(cns[i].toUpperCase()) + ")"
                        );
                    }
                }
            }
            //str = str.substring(0, str.length - 5)
            //setPrerequisites(courses.get(courseName.toUpperCase())); // Delete this after sprint 4 user interviews
            setPrerequisites(pr);
            setFrozenCourseName(courseName.trim().toUpperCase());
            return;
        } else if (courses.get(courseName.toUpperCase()) != null) {
            // Delete this after sprint 4 user interviews
            setPrerequisites(courses.get(courseName.toUpperCase())); // Delete this after sprint 4 user interviews
            setFrozenCourseName(courseName.trim().toUpperCase());
            return; // Delete this after sprint 4 user interviews
        } // Delete this after sprint 4 user interviews
        const course = courseData.find(
            (c) => c.identifier === courseName.toUpperCase()
        );
        if (course && course.prerequisites) {
            const prereqs = course.prerequisites.courses
                .map((pr) => {
                    if (typeof pr === "string") {
                        return pr;
                    } else if (pr.type === "or") {
                        return "(" + pr.courses.join(" OR ") + ")";
                    } else if (pr.type === "and") {
                        return "(" + pr.courses.join(" AND ") + ")";
                    }
                    return "";
                })
                .join(" AND ");
            setPrerequisites(`${prereqs}`);
            setFrozenCourseName(courseName.trim().toUpperCase());
            return;
        }
        // If you're down here, no prerequisites have been found for the course(s).
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

    const onFirebaseButtonPressed = () => {
        pushAllData();
    };

    const onBack = () => {
        console.log(courseStack)
        if (courseStack.length <= 1) {
            setCourseName("");
            setFrozenCourseName("");
            setCourseStack([]);
        }
        else if (courseStack.length >= 2) {
            setCourseStack((stack) => {
                stack.pop();
                return stack;
            });
            setCourseName(courseStack[courseStack.length - 1]);
            setFrozenCourseName(courseStack[courseStack.length - 1]);
        }
    }

    const onLogStatisticsButtonPressed = async () => {
        setUserMetrics((metrics) => {
            if (metrics.length > 0 && !!!metrics[metrics.length - 1].endTime)
                metrics[metrics.length - 1].endTime = Date.now();
            return metrics;
        });
        setUserMetrics(userMetrics.filter((metric) => (metric.endTime - metric.startTime) / 1000 >= 0.1));
        console.log("total courses searched: " + userMetrics);
        let totalDuration = 0;
        console.log("courses: ");
        for (let i = 0; i < userMetrics.length; i++) {
            let duration = userMetrics[i].endTime - userMetrics[i].startTime;
            if (duration >= 0.1) {
                console.log(
                    "    course: " +
                    userMetrics[i].course.toUpperCase() +
                    ", duration: " +
                    (duration / 1000).toFixed(1) +
                    "s"
                );
            }
            totalDuration += duration;
        }
        console.log("total duration: " + (totalDuration / 1000).toFixed(1) + "s");
    };

    const [userMetrics, setUserMetrics] = useState<
        { course: string; startTime: number; endTime: number }[]
    >([]);

    useEffect(() => {
        if (prerequisites && prerequisites != noPrerequisitesFoundText) {
            setUserMetrics((metrics) => {
                if (metrics.length > 0 && !!!metrics[metrics.length - 1].endTime)
                    metrics[metrics.length - 1].endTime = Date.now();
                metrics.push({ course: courseName.trim().toUpperCase(), startTime: Date.now(), endTime: 0 });
                return metrics;
            });
            setCourseStack((stack) => {
                if (courseName.trim().toUpperCase() != stack[stack.length - 1]) {
                    stack.push(courseName.trim().toUpperCase());
                }
                console.log(stack);
                return stack;
            });
        }
    }, [prerequisites]);

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <View style={styles.button_box}>
                    <Button onPress={onBack} style={styles.back_button}>back</Button>
                    <View>
                        <Text>Enter Course Number:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCourseName}
                            value={courseName}
                            placeholder="e.g. MATH 3012"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setOtherCourses}
                            value={otherCourses}
                            placeholder="other"
                        />
                    </View>
                </View>
                {!!frozenCourseName ? (
                    <>
                        <Text style={styles.prerequisites}>
                            Prerequisites: {prerequisites}
                        </Text>
                        <Tree
                                course={frozenCourseName}
                                prerequisites={prerequisites}
                                setCourse={setCourseName}
                        />
                    </>
                ) : (
                    <Text style={styles.prerequisites}>{noPrerequisitesFoundText}</Text>
                )}
                <View style={styles.button_box}>
                    <Button onPress={onFirebaseButtonPressed}>
                        Push result.json To Firebase
                    </Button>
                    <Button onPress={onLogStatisticsButtonPressed}>Log statistics</Button>
                </View>
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
        justifyContent: "space-between",
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 250,
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
    button_box: {
        display: "flex",
        flexDirection: "row",
    },
    back_button: {
        height: 60,
        width: 60,
        alignSelf: "center",
    }
});
