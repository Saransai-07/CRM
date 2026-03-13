
import { AgentWiseCallLogInterface } from "@/src/Interface/InterfaceData";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAudioPlayer } from "expo-audio";



const AgentWiseCallComponent = ({ item }: { item: AgentWiseCallLogInterface }) => {

  const [isPlaying, setIsPlaying] = useState(false);

  const recordingUrl =
  typeof item.aws_call_recording_file === "string"
    ? item.aws_call_recording_file
    : item.aws_call_recording_file?.url ??
      item.aws_call_recording_file?.file ??
      null;

const player = useAudioPlayer(recordingUrl ?? "");

const togglePlayback = async () => {
  if (!recordingUrl) return;

  if (player.playing) {
    player.pause();
    setIsPlaying(false)
  } else {
    player.play();
    setIsPlaying(true)
  }
};

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.agentName} numberOfLines={1}  ellipsizeMode="tail">{item.student_name}</Text>
        {recordingUrl && (
          <TouchableOpacity
            style={styles.recordingBtn}
            onPress={togglePlayback}
          >
            <Ionicons
              name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
              size={20}
              color={isPlaying ? '#44eb2e' : '#fff'}
            />
            <Text style={styles.recordingText}>
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Students SCS</Text>
        <Text style={styles.value}>{item.student_scs}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Call Status</Text>
        <Text style={styles.value}>{item.call_status}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Conversation Duration</Text>
        <Text style={styles.value}>{item.conversation_duration_hms}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Call Start Time</Text>
        <Text style={styles.value}>{item.call_start_time_}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Call End Time</Text>
        <Text style={styles.value}>{item.call_end_time_}</Text>
      </View>
    </View>
  );
};

export default AgentWiseCallComponent;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#000",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#fff",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    flex :1,
  },
  agentName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    flexShrink : 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    color: "#8E8E93",
    fontSize: 14,
  },
  value: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#464646",
    marginVertical: 4,
  },

  recordingBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "#1C1C1E",
  },
  recordingText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

})