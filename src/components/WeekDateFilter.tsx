import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
// import { ActivityRing } from "./ActivityRing";
import { useThemedStyles, type Theme } from "@/src/theme";
import ActivityRing from "./ActivityRing";

interface DayItem {
  label: string; // Mon, Tue
  date: string;
  progress: number; // 0 → 1
}

interface Props {
  days: DayItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const WeekDateFilter = ({
  days,
  selectedIndex,
  onSelect,
}: Props) => {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      {days.map((day, index) => {
        const isActive = index === selectedIndex;

        return (
          <Pressable
            key={day.date}
            onPress={() => onSelect(index)}
            style={styles.item}
          >
            <ActivityRing
              size={42}
              strokeWidth={5}
              progress={day.progress}
            />

            <Text
              style={[
                styles.label,
                isActive && styles.activeLabel,
              ]}
            >
              {day.label}
            </Text>

            {isActive && <View style={styles.dot} />}
          </Pressable>
        );
      })}
    </View>
  );
};

const createStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: t.spacing.lg,
    },

    item: {
      alignItems: "center",
      gap: 6,
    },

    label: {
      ...t.typography.caption2,
      color: t.colors.textSecondary,
    },

    activeLabel: {
      color: t.colors.primary,
    },

    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: t.colors.primary,
      marginTop: 2,
    },
  });
