import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
}

export default function PillTabs({ tabs, selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = selected === tab;

        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onSelect(tab)}
            style={[styles.pill, active && styles.activePill]}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent : 'space-between',
    marginVertical: 10,
  },

  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1c1c1e",
    marginRight: 8,
  },

  activePill: {
    backgroundColor: "#44eb2e", // apple fitness green
  },

  text: {
    color: "#ccc",
    fontWeight: "600",
  },

  activeText: {
    color: "#000",
  },
});