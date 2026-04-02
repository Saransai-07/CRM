

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { Audio } from "expo-av";
import { AudioBar } from "../AudioBar";

interface CallLog {
  student: number;
  student_name: string;
  student_scs: string;
  agent_name: string;
  call_start_time_: string;
  call_end_time_: string;
  branch_name: string;
  call_duration_hms: string;
  conversation_duration_hms: string;
  caller_status: string;
  destination_status: string;
  call_status: string;
  aws_call_recording_file: string;
  zone_name: string;
  state_name: string;
}

export const CallLogCard = ({ item }: { item: CallLog }) => {

  const isAnswered = item.call_status === "Answered";

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.userBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.student_name?.charAt(0)}
            </Text>
          </View>

          <View>
            <Text style={styles.name} numberOfLines={1}>{item.student_name}</Text>
            <Text style={styles.scs}>{item.student_scs}</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            isAnswered ? styles.success : styles.failed,
          ]}
        >
          <Text style={styles.statusText}>{item.call_status}</Text>
        </View>
      </View>

      {/* INFO GRID */}
      <View style={styles.infoGrid}>
        <InfoItem
          icon="call-outline"
          label="Duration"
          value={item.call_duration_hms}
        />
        <InfoItem
          icon="chatbubble-outline"
          label="Talk"
          value={item.conversation_duration_hms}
        />
        <InfoItem
          icon="time-outline"
          label="Time"
          value={new Date(item.call_start_time_).toLocaleString()}
        />
        <InfoItem
          icon="location-outline"
          label="Branch"
          value={`${item.branch_name}, ${item.zone_name}`}
        />
      </View>

      {/* AGENT */}
      <View style={styles.agentRow}>
        <Ionicons name="person-outline" size={16} color="#888" />
        <Text style={styles.agentText} numberOfLines={1}>{item.agent_name}</Text>
      </View>

      {item.aws_call_recording_file && (

      <AudioBar
        uri={item.aws_call_recording_file}
        call_duration_hms={item.conversation_duration_hms}
      />
      )}
    </View>
  );
};

const InfoItem = ({ icon, label, value }: any) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={16} color="#999" />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text numberOfLines={1} style={styles.infoValue}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9fb",
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userBlock: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    maxWidth : 170,
  },

  scs: {
    fontSize: 12,
    color: "#999",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  success: {
    backgroundColor: "#d1fae5",
  },

  failed: {
    backgroundColor: "#fee2e2",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
    justifyContent: "space-between",
  },

  infoItem: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },

  agentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  agentText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#666",
  },

  audioPlayer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 14,
    marginTop: 14,
  },

  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  audioTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  audioSub: {
    color: "#aaa",
    fontSize: 11,
  },
});