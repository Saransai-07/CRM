import { View, Text, StyleSheet, Pressable } from "react-native";
import { useThemedStyles, type Theme } from "@/src/theme";
import { useRouter } from "expo-router";
import ActivityRing from "../ActivityRing";
// import { ActivityRing } from "../ActivityRing";

interface AttendanceData {
  total_agents: number;
  no_of_present_agents: number;
  no_of_absent_agents: number;
  date: string;
  is_admin: boolean;
}

export const AttendanceActivityCard = ({
  total_agents,
  no_of_present_agents,
  no_of_absent_agents,
}: AttendanceData) => {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();

  const progress =
    total_agents === 0 ? 0 : no_of_present_agents / total_agents;

  const goToSummary = () => {
    router.push("/Screens/AttendanceSummaryScreen");
  };

  return (
    <Pressable onPress={goToSummary} hitSlop={10} >
    <View style={styles.card}>
      {/* Left section */}
      <View style={styles.info}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Attendance</Text>

            {/* <AntDesign
              name="right"
              size={18}
              color={styles.arrowColor.color}
            /> */}
        </View>

        <View style={styles.divider} />

        <Text style={styles.value}>
          {no_of_present_agents}
          <Text style={styles.goal}> / {total_agents}</Text>
        </Text>

        <View style={styles.stats}>
          <View>
            <Text style={styles.meta}>Presents</Text>
            <Text style={styles.metaValue}>
              {no_of_present_agents}
            </Text>
          </View>

          <View>
            <Text style={styles.meta}>Absent</Text>
            <Text style={[styles.metaValue, styles.absent]}>
              {no_of_absent_agents}
            </Text>
          </View>
        </View>
      </View>

      {/* Ring */}
      <View style={styles.ringWrapper}>
        <ActivityRing progress={progress} />
      </View>
    </View>
    </Pressable>
  );
};


const createStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      // backgroundColor: t.colors.surface,
      backgroundColor : "#0f172a",
      borderRadius: t.radius.xl,
      padding: t.spacing.lg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    info: {
      flex: 1,
      paddingRight: t.spacing.md,
    },

    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between", 
    },

    title: {
      ...t.typography.caption1,
      color: t.colors.textSecondary,
    },

    arrowColor: {
      color: t.colors.textPrimary,
    },

    divider: {
      height: 1,
      backgroundColor: t.colors.border,
      marginVertical: t.spacing.md,
    },

    value: {
      ...t.typography.title2,
      color: t.colors.primary,
      marginTop: 4,
    },

    goal: {
      color: t.colors.textSecondary,
      fontSize: 16,
    },

    stats: {
      flexDirection: "row",
      gap: t.spacing.lg,
      marginTop: t.spacing.md,
    },

    meta: {
      ...t.typography.caption2,
      color: t.colors.textSecondary,
    },

    metaValue: {
      ...t.typography.bodyBold,
      color: t.colors.textPrimary,
    },

    absent: {
      color: t.colors.danger,
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
  });

