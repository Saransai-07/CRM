
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { BranchCVRInterface } from "../Interface/InterfaceData";
import { EvilIcons, Ionicons } from "@expo/vector-icons";

interface ProgressProps {
  label: string;
  percent: string;
  colors: readonly [string, string, ...string[]];
  delay?: number;
}

/* ---------------- Animated Progress Bar ---------------- */

function AnimatedProgressBar({
  label,
  percent,
  colors,
  delay = 0,
}: ProgressProps) {
  const value = parseFloat(percent);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(value, {
      duration: 900,
    });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percent}>{percent}</Text>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.barContainer, animatedStyle]}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bar}
          />
        </Animated.View>
      </View>
    </View>
  );
}

/* ---------------- Branch Card ---------------- */

export default function BranchCard({ item }: { item: BranchCVRInterface }) {

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.branchTitleRow}>
          <Ionicons name="location-sharp" size={20} color="#22c55e" />
          <Text style={styles.branchName} numberOfLines={1} ellipsizeMode="tail" >
            {item.name}
          </Text>
        </View>
        <View style={styles.zoneBadge}>
          <Text style={styles.zoneText}>📍 {item.zone_name}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}>{item.category}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>⏰ IST</Text>
        <Text style={styles.value}>{item.ist}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>🧑‍🎓 strength</Text>
        <Text style={styles.value}>{item.YLP_student_count}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>📞 Unique Students Connected</Text>
        <Text style={styles.value}>{item.unique_lead_connected}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>🎯 Target</Text>
        <Text style={styles.value}>{item.total_target}</Text>
      </View>

      {/* Student Touch */}
      <AnimatedProgressBar
        label="Student Touch"
        percent={item.lead_touch_per}
        colors={["#14b8a6", "#2dd4bf"]}
      />

      <View style={styles.divider} />

      <View style={styles.sectionGroup}>
        <Text style={styles.sectionTitle}>👨‍💼 Agent Sales</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Renewal Sales</Text>
          <Text style={styles.value}>{item.agent_renewal_sales}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>New Sales</Text>
          <Text style={styles.value}>{item.agent_new_sales}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total Sales</Text>
          <Text style={styles.value}>{item.agent_total_sales}</Text>
        </View>

      </View>
      <View style={styles.divider} />

      <View style={styles.sectionGroup}>
        <Text style={styles.sectionTitle}>🏫 Branch Sales</Text>

        <View style={styles.row}>
          <Text style={styles.label}> Renewal Sales</Text>
          <Text style={styles.value}>{item.branch_renewal_sales}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}> New Sales</Text>
          <Text style={styles.value}>{item.branch_new_sales}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}> Total Sales</Text>
          <Text style={styles.value}>{item.branch_total_sales}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Agent CVR */}
      <View style={styles.sectionGroup}>
        <Text style={styles.sectionTitle}>📊 Agent CVR</Text>

        <AnimatedProgressBar
          label="New Sales CVR"
          percent={item.agent_new_sales_cvr_per}
          colors={["#7c3aed", "#a78bfa"]}
        />

        <AnimatedProgressBar
          label="Total Sales CVR"
          percent={item.agent_current_sales_cvr_per}
          colors={["#7c3aed", "#a78bfa"]}
        />
      </View>

      <View style={styles.divider} />

      {/* Branch CVR */}
      <View style={styles.sectionGroup}>
        <Text style={styles.sectionTitle}>📈 Branch CVR</Text>

        <AnimatedProgressBar
          label="New Sales CVR"
          percent={item.branch_new_sales_cvr_per}
          colors={["#7c3aed", "#a78bfa"]}
        />

        <AnimatedProgressBar
          label="Total Sales CVR"
          percent={item.branch_current_sales_cvr_per}
          colors={["#7c3aed", "#a78bfa"]}
        />
      </View>

      {/* Expected + Difference */}
      <AnimatedProgressBar
        label="Expected CVR"
        percent={item.expected_cvr_per}
        colors={["#14b8a6", "#2dd4bf"]}
      />

      <AnimatedProgressBar
        label="Difference in CVR"
        percent={item.difference_in_cvr_per}
        colors={["#7c3aed", "#a78bfa"]}
      />
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#212530",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 22,
    padding: 20,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",

    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 25,
    elevation: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  branchTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,          // allow this row to take remaining space
  },

  branchName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.4,
    flexShrink: 1,    // allows text to shrink instead of pushing layout
  },

  zoneBadge: {
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  zoneText: {
    color: "#22c55e",
    fontSize: 12,
    fontWeight: "600",
  },

  zone: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "500",
  },
  category: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 20,
  },

  sectionGroup: {
    marginBottom: 8,
  },

  sectionTitle: {
    color: "#e5e7eb",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 18,
  },

  progressContainer: {
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    marginVertical: 4
  },

  label: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: "500",
  },
  value: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  percent: {
    color: "#f9fafb",
    fontSize: 13,
    fontWeight: "600",
  },

  track: {
    height: 7,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    overflow: "hidden",
  },

  barContainer: {
    height: "100%",
  },

  bar: {
    flex: 1,
    borderRadius: 10,
  },
});