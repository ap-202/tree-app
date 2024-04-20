import { StatusBar } from "expo-status-bar";
import courseData from "./assets/result.json";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { Box, Button, Text, NativeBaseProvider } from "native-base";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import Tree from "./Tree";
import { simplifyInput } from "./simplify";
// Delete this after sprint 4 user interviews
let courses = new Map();
courses.set("PHYS 3122", "(PHYS 2212 OR PHYS 2232) AND (MATH 2403 OR MATH 2413 OR MATH 24X3)");
courses.set("PHYS 4206", "PHYS 3211");
courses.set("PHYS 4321", "PHYS 3143");
courses.set("PHYS 2212", "PHYS 2211 OR PHYS 2231");
courses.set("PHYS 2232", "PHYS 2211 OR PHYS 2231");
courses.set("MATH 2403", "MATH 1502 OR MATH 1512 OR (MATH 15X2 AND MATH 1522)");
courses.set("MATH 2413", "MATH 2401 OR MATH 2411 OR MATH 2605");
courses.set("MATH 24X3", "");
courses.set("PHYS 3211", "PHYS 2212 OR PHYS 2232");
courses.set("PHYS 3143", "(PHYS 2212 OR PHYS 2232) AND (MATH 2403 OR MATH 2413 OR MATH 24X3 OR MATH 2552 OR MATH 2562 OR MATH 2X52)");
courses.set("PHYS 2211", "MATH 1502 OR MATH 1512");
courses.set("PHYS 2231", "MATH 1502 OR MATH 1512");
courses.set("MATH 1502", "MATH 1501 OR MATH 1511 OR MATH 15X1");
courses.set("MATH 1512", "MATH 1501 OR MATH 1511");
courses.set("MATH 1501", "MATH 1113");
courses.set("MATH 1511", "MATH 1501");
courses.set("MATH 15X1", "");
courses.set("MATH 1113", "");
courses.set("MATH 15X2", "");
courses.set("MATH 1522", "MATH 15X2");
courses.set("MATH 2401", "MATH 1502 OR MATH 1512 OR (MATH 15X2 AND MATH 1522)");
courses.set("MATH 2411", "MATH 1502 OR MATH 1512");
courses.set("MATH 2605", "MATH 1502 OR MATH 1512 OR (MATH 15X2 AND MATH 1522)");
courses.set("MATH 2552", "MATH 1502 OR MATH 1512 OR MATH 1504 OR MATH 1555 OR ((MATH 1552 OR MATH 15X2 OR MATH 1X52) AND (MATH 1553 OR MATH 1X54 OR MATH 1554 OR MATH 1564 OR MATH 1522 OR MATH 1X53))");
courses.set("MATH 2562", "MATH 1502 OR MATH 1512 OR MATH 1504 OR MATH 1555 OR ((MATH 1552 OR MATH 15X2 OR MATH 1X52) AND (MATH 1553 OR MATH 1X54 OR MATH 1554 OR MATH 1564 OR MATH 1522 OR MATH 1X53))");
courses.set("MATH 2X52", "");
courses.set("MATH 1504", "MATH 1503 OR MATH 1501 OR MATH 1511 OR MATH 15X1");
courses.set("MATH 1555", "MATH 1550 OR MATH 1551 OR MATH 1501 OR MATH 1X51 OR MATH 15X1 OR MATH 1X54");
courses.set("MATH 1552", "MATH 1550 OR MATH 1551 OR MATH 1501 OR MATH 15X1 OR MATH 1X51");
courses.set("MATH 1X52", "");
courses.set("MATH 1550", "(MATH 1113 OR MATH 11X3)");
courses.set("MATH 1551", "(MATH 1113 OR MATH 11X3)");
courses.set("MATH 1X51", "");
courses.set("MATH 1X54", "");
courses.set("MATH 11X3", "");
courses.set("MATH 1553", "(MATH 1113 OR MATH 11X3) OR MATH 15X1 OR MATH 1X51 OR MATH 1551");
courses.set("MATH 1554", "(MATH 1113 OR MATH 11X3) OR MATH 1552 OR MATH 15X2 OR MATH 1X52 OR MATH 1551");
courses.set("MATH 1564", "MATH 1552");
courses.set("MATH 1522", "MATH 15X2");
courses.set("MATH 1X53", "");
courses.set("BMED 3610", "BMED 2310 AND (BMED 2400 OR ISYE 3770 OR CEE 3770) AND BMED 3600");
courses.set("BMED 3520", "BMED 3100 AND (BMED 2210 OR BMED 2110) AND (MATH 2403 OR MATH 2413 OR MATH 24X3 OR MATH 2552 OR MATH 2562 OR MATH 2X52) AND CS 1371");
courses.set("BMED 3600", "BMED 3100");
courses.set("BMED 2310", "(BMED 2210 OR BMED 2110) AND BMED 2250 AND (PHYS 2211 OR PHYS 2231)");
courses.set("BMED 2400", "(MATH 1501 OR MATH 1511 OR MATH 1552) AND CS 1371");
courses.set("ISYE 3770", "MATH 2550 OR MATH 2551 OR (MATH 2X51 AND (MATH 1522 OR MATH 1553 OR MATH 1554 OR MATH 1564 OR MATH 1X53 OR MATH 1X54))");
courses.set("CEE 3770", "MATH 2401 OR MATH 2411 OR MATH 24X1 OR MATH 2551 OR MATH 2561 OR MATH 2X51");
courses.set("BMED 2210", "(MATH 1501 OR MATH 1511 OR MATH 1X52 OR MATH 1552) AND (CHEM 1211K OR CHEM 1310)");
courses.set("BMED 2110", "(CHEM 1211K OR CHEM 1310) AND (MATH 1552 OR MATH 15X2) AND BMED 1000");
courses.set("BMED 2250", "BMED 2210 OR BMED 2110");
courses.set("CHEM 1310", "");
courses.set("BMED 1000", "");
courses.set("CS 1371", "");
courses.set("MATH 24X1", "");
courses.set("MATH 2551", "MATH 1502 OR MATH 1512 OR MATH 1504 OR MATH 1555 OR ((MATH 1552 OR MATH 15X2 OR MATH 1X52) AND (MATH 1553 OR MATH 1X54 OR MATH 1554 OR MATH 1564 OR MATH 1522 OR MATH 1X53))");
courses.set("MATH 2561", "MATH 1502 OR MATH 1512 OR MATH 1504 OR MATH 1555 OR ((MATH 1552 OR MATH 15X2 OR MATH 1X52) AND (MATH 1553 OR MATH 1X54 OR MATH 1554 OR MATH 1564 OR MATH 1522 OR MATH 1X53))");
courses.set("MATH 2X51", "");
courses.set("BMED 3100", "CHEM 1315 OR CHEM 2311");
courses.set("CHEM 1315", "CHEM 1211K OR CHEM 1310");
courses.set("CHEM 1211K", "");
courses.set("CHEM 1212K", "CHEM 1211K OR CHEM 1310");
courses.set("CHEM 2311", "CHEM 1311 OR CHEM 1212K");
courses.set("CHEM 1311", "CHEM 1310");
courses.set("CS 1301", "");
courses.set("CS 1331", "CS 1301 OR CS 1315 OR CS 1321 OR CS 1371");

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
        console.log(courseMap)
        return courseMap;
    };

    useEffect(() => {
        setCourses()
    }, []);
    async function setCourses() {
        courses = await getPreReqs()
        console.log(courses)
    }
    setCourses()

    useEffect(() => {
        fetchPrerequisites();
    }, [courseName, otherCourses]);

    const noPrerequisitesFoundText =
        "No prerequisites found or course does not exist.";

    //comment this function out and uncomment all of the courses.set lines to use the original map

    const fetchPrerequisites = () => {
        let other = otherCourses.split(",");
        // console.log(courses.get(courseName.toUpperCase()));
        // console.log(other);
        console.log(courses.get(courseName.toUpperCase()))
        console.log(courses.get(other[0].toUpperCase()))
        if (
            courses.get(courseName.toUpperCase()) != null &&
            courses.get(other[0].toUpperCase()) != null
        ) {
            console.log("HERE");
            // console.log(courseName);
            // console.log(other);
            let pr = courses.get(courseName.toUpperCase());
            let cns = other;
            cns.unshift(courseName);
            let str = "";
            // console.log(pr);
            for (let i = 0; i < cns.length; i++) {
                //str += "("+courses.get(cns[i].toUpperCase())+") AND "
                if (courses.get(cns[i].toUpperCase()) != null) {
                    if (pr.includes(cns[i].toUpperCase())) {
                        pr = pr.replace(
                            cns[i].toUpperCase(),
                            "(" + courses.get(cns[i].toUpperCase()) + ")"
                        );
                        // console.log(courses.get(cns[i].toUpperCase()));
                    }
                }
            }
            //str = str.substring(0, str.length - 5)
            setPrerequisites(courses.get(courseName.toUpperCase())); // Delete this after sprint 4 user interviews
            console.log(pr);
            // console.log("______________-");
            setPrerequisites(pr);
            // console.log(prerequisites);
            return;
        } else if (courses.get(courseName.toUpperCase()) != null) {
            // Delete this after sprint 4 user interviews
            setPrerequisites(courses.get(courseName.toUpperCase())); // Delete this after sprint 4 user interviews
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
        } else {
            setPrerequisites(noPrerequisitesFoundText);
        }
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

    const onLogStatisticsButtonPressed = async () => {
        setUserMetrics((metrics) => {
            if (metrics.length > 0 && !!!metrics[metrics.length - 1].endTime)
                metrics[metrics.length - 1].endTime = Date.now();
            return metrics;
        });
        console.log("total courses searched: " + userMetrics.length);
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
                metrics.push({ course: courseName, startTime: Date.now(), endTime: 0 });
                return metrics;
            });
        }
    }, [prerequisites]);

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
                <TextInput
                    style={styles.input}
                    onChangeText={setOtherCourses}
                    value={otherCourses}
                    placeholder="other"
                />
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
