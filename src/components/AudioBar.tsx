import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayerContext } from "@/src/context/AudioPlayerContext";

type Props = {
  uri: string;
  call_duration_hms: string;
};

export const AudioBar = ({ uri, call_duration_hms }: Props) => {
  const { toggle, currentUri, isPlaying, position } = useAudioPlayerContext();

  const isActive = currentUri === uri;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => toggle(uri)} style={styles.button}>
        <Ionicons
          name={isActive && isPlaying ? "pause" : "play"}
          size={20}
          color="#fff"
        />
      </TouchableOpacity>

      <View style={styles.timeContainer}>
        <Text style={styles.currentTime}>
          {isActive ? formatTime(position) : "00:00"}
        </Text>

        <Text style={styles.totalTime}>
          / {call_duration_hms.slice(3)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 8,
    borderRadius: 10,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    marginLeft: 12,
    alignItems: "center",
  },
  currentTime: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  totalTime: {
    color: "#aaa",
    fontSize: 13,
    marginLeft: 4,
  },
});