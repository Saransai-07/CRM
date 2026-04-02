import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useThemedStyles, type Theme } from "@/src/theme";
import { WeekDateFilter } from "@/src/components/WeekDateFilter";
// import { AttendanceActivityCard } from "@/src/components/AttendanceActivityCard";
// import { ActivityRing } from "@/src/components/ActivityRing";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { BackButton } from "@/src/components/BackButton";
// import { IOSDatePicker } from "@/src/components/Datepicker";
import { AttendanceActivityCard } from "@/src/components/DashBoard/AttendanceActivityCard";
import ActivityRing from "@/src/components/ActivityRing";
import { CrossPlatformDatePicker } from "@/src/components/Datepicker";

const MOCK_WEEK = [
  { label: "Mon", date: "2024-04-29", progress: 0.7 },
  { label: "Tue", date: "2024-04-30", progress: 0.9 },
  { label: "Wed", date: "2024-05-01", progress: 0.4 },
  { label: "Thu", date: "2024-05-02", progress: 0.8 },
  { label: "Fri", date: "2024-05-03", progress: 0.6 },
  { label: "Sat", date: "2024-05-04", progress: 0.3 },
  { label: "Sun", date: "2024-05-05", progress: 0.5 },
];



export default function AttendanceSummaryScreen() {
    const styles = useThemedStyles(createStyles);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(3);
    const total_agents = 42 ;
    const no_of_present_agents = 32;
    const progress = total_agents <= 0 ? 0 : no_of_present_agents / total_agents;
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
        <View style={styles.header}>
            <BackButton />
            <Text style={styles.title}>Summary</Text>
        </View>
        <CrossPlatformDatePicker
          value={selectedDate}
          onChange={(date : any) => setSelectedDate(date)}
        />

      {/* Week Filter
      <WeekDateFilter
        days={MOCK_WEEK}
        selectedIndex={selectedDay}
        onSelect={setSelectedDay}
      /> */}

      {/* Activity Card */}
      <AttendanceActivityCard
        total_agents={40}
        no_of_present_agents={32}
        no_of_absent_agents={8}
        date={MOCK_WEEK[selectedDay].date}
        is_admin={true}
      />

      {/* Ring */}
        <View style={styles.ringWrapper}>
            <ActivityRing progress={progress} />
            <Text style={styles.percent}>
            {Math.round(progress * 100)}%
            </Text>
        </View>

        <View style={{margin : 8}}>
            <Text style={styles.subText}>Number of Presents :</Text>
        </View>
        <View style={{margin : 8}}>
            <Text style={styles.subText}>Number of Absents :</Text>
        </View>

    </ScrollView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor : '#2b2727',
      //   backgroundColor: t.colors.background,
    },
    
    content: {
      marginTop : 20,
      padding: t.spacing.lg,
    },

    title: {
      ...t.typography.largeTitle,
        // marginTop: 20,
      color: t.colors.textPrimary,
    },

    date: {
      ...t.typography.caption1,
      color: t.colors.textSecondary,
      marginTop: 2,
    },
     ringWrapper: {
      justifyContent: "center",
      alignItems: "center",
    },

    percent: {
      position: "absolute",
      ...t.typography.callout,
      color: t.colors.textPrimary,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12, // RN 0.71+ only. Otherwise use marginRight
        marginBottom: t.spacing.md,
    },

    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
        backIcon: {
        color: "#fff", // or t.colors.textPrimary if themed
    },
    subText : {
        ...t.typography.title2,
        color : '#ffffff'
    }

  });
