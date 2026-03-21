
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import { AudioBar } from "../AudioBar";
import { TicketLogInterface } from "@/src/Interface/InterfaceData";


export const TicketLogItem = ({ item }: { item: TicketLogInterface }) => {
  const [visible, setVisible] = useState(false);

  const formattedDate = new Date(item.created_at).toLocaleString();


  return (
    <>
      {/* LIST ITEM */}
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
      >
        {/* Timeline */}
        <View style={styles.timeline}>
          <View style={styles.dot} />
          <View style={styles.line} />
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.heading} numberOfLines={2}>
            {item.heading}
          </Text>

          {/* Quick Info */}
          <View style={styles.quickRow}>
            <Text style={styles.user}>{item.created_by_name}</Text>
            <Text style={styles.time}>{formattedDate}</Text>
          </View>

          <Text style={styles.viewMore}>Tap to view details →</Text>
        </View>
      </TouchableOpacity>




      {/* MODAL */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>

          {/* CLICK OUTSIDE TO CLOSE */}
          <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View style={styles.overlayTop} />
          </TouchableWithoutFeedback>

          {/* MODAL CONTENT */}
          <View style={styles.modalContent}>

            {/* HANDLE BAR */}
            <View style={styles.handle} />

            {/* HEADER */}
            <Text style={styles.modalTitle}>Ticket Update</Text>

            {/* SCROLL AREA */}
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalHeading}>{item.heading}</Text>

              {item.category_name && (
                <Detail label="Category" value={item.category_name} />
              )}

              {item.subcategory_name && (
                <Detail label="Subcategory" value={item.subcategory_name} />
              )}

              {item.priority_name && (
                <Detail label="Priority" value={item.priority_name} />
              )}

              {item.description && (
                <Detail label="Description" value={item.description} />
              )}

              {item.call_back_time && (
                <Detail
                  label="Callback Time"
                  value={new Date(item.call_back_time).toLocaleString()}
                />
              )}

              {item.remarks && (
                <Detail label="Remarks" value={item.remarks} />
              )}

              {item.call_logs?.length > 0 && (
                <View style={styles.callSection}>
                  <Text style={styles.sectionTitle}>Call Logs</Text>

                  {item.call_logs.map((log: any, index: number) => (
                    <View key={index} style={styles.callCard}>
                      <Text style={styles.callName}>
                        {log.student_name} ({log.student_scs})
                      </Text>

                      <Text style={styles.callMeta}>
                        Agent: {log.agent_name}
                      </Text>

                      <Text style={styles.callMeta}>
                        Duration: {log.call_duration_hms}
                      </Text>

                      <Text style={styles.callMeta}>
                        Status: {log.call_status}
                      </Text>

                      <Text style={styles.callMeta}>
                        Started: {new Date(log.call_start_time_).toLocaleString()}
                      </Text>

                      <Text style={styles.callMeta}>
                        Ended: {new Date(log.call_end_time_).toLocaleString()}
                      </Text>

                      {log.aws_call_recording_file && (
                        <AudioBar
                          uri={log.aws_call_recording_file}
                          startTime={log.call_start_time_}
                          endTime={log.call_end_time_}
                        />
                      )}
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.metaBox}>
                <Text style={styles.metaText}>
                  Created by: {item.created_by_name}
                </Text>
                <Text style={styles.metaText}>
                  Updated by: {item.updated_by_name}
                </Text>
                <Text style={styles.metaText}>
                  Created at: {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>
            </ScrollView>

            {/* FOOTER */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </>
  );
};

export const PreviousYearTicketLogItem = ({ item }: any) => {
  const [visible, setVisible] = useState(false);

  const formattedDate = new Date(item.created_at).toLocaleString();


  return (
    <>
      {/* LIST ITEM */}
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
      >
        {/* Timeline */}
        <View style={styles.timeline}>
          <View style={styles.dot} />
          <View style={styles.line} />
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.heading} numberOfLines={2}>
            {item.heading}
          </Text>

          {/* Quick Info */}
          <View style={styles.quickRow}>
            <Text style={styles.user}>{item.created_by_name}</Text>
            <Text style={styles.time}>{formattedDate}</Text>
          </View>

          <Text style={styles.viewMore}>Tap to view details →</Text>
        </View>
      </TouchableOpacity>




      {/* MODAL */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>

          {/* CLICK OUTSIDE TO CLOSE */}
          <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View style={styles.overlayTop} />
          </TouchableWithoutFeedback>

          {/* MODAL CONTENT */}
          <View style={styles.modalContent}>

            {/* HANDLE BAR */}
            <View style={styles.handle} />

            {/* HEADER */}
            <Text style={styles.modalTitle}>Ticket Update</Text>

            {/* SCROLL AREA */}
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalHeading}>{item.heading}</Text>

              {item.category_name && (
                <Detail label="Category" value={item.category_name} />
              )}

              {item.subcategory_name && (
                <Detail label="Subcategory" value={item.subcategory_name} />
              )}

              {item.priority_name && (
                <Detail label="Priority" value={item.priority_name} />
              )}

              {item.description && (
                <Detail label="Description" value={item.description} />
              )}

              {item.call_back_time && (
                <Detail
                  label="Callback Time"
                  value={new Date(item.call_back_time).toLocaleString()}
                />
              )}

              {item.remarks && (
                <Detail label="Remarks" value={item.remarks} />
              )}

              {item.call_logs?.length > 0 && (
                <View style={styles.callSection}>
                  <Text style={styles.sectionTitle}>Call Logs</Text>

                  {item.call_logs.map((log: any, index: number) => (
                    <View key={index} style={styles.callCard}>
                      <Text style={styles.callName}>
                        {log.student_name} ({log.student_scs})
                      </Text>

                      <Text style={styles.callMeta}>
                        Agent: {log.agent_name}
                      </Text>

                      <Text style={styles.callMeta}>
                        Duration: {log.call_duration_hms}
                      </Text>

                      <Text style={styles.callMeta}>
                        Status: {log.call_status}
                      </Text>

                      <Text style={styles.callMeta}>
                        Started: {new Date(log.call_start_time_).toLocaleString()}
                      </Text>

                      <Text style={styles.callMeta}>
                        Ended: {new Date(log.call_end_time_).toLocaleString()}
                      </Text>

                      {log.aws_call_recording_file && (
                        <AudioBar
                          uri={log.aws_call_recording_file}
                          startTime={log.call_start_time_}
                          endTime={log.call_end_time_}
                        />
                      )}
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.metaBox}>
                <Text style={styles.metaText}>
                  Created by: {item.created_by_name}
                </Text>
                <Text style={styles.metaText}>
                  Updated by: {item.updated_by_name}
                </Text>
                <Text style={styles.metaText}>
                  Created at: {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>
            </ScrollView>

            {/* FOOTER */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </>
  );
};

/* 🔹 Reusable Detail Row */
const Detail = ({ label, value }: any) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={{ color: "#888", fontSize: 12 }}>{label}</Text>
    <Text style={{ color: "#fff", fontSize: 14, marginTop: 2 }}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 18,
  },

  timeline: {
    width: 30,
    alignItems: "center",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#32D74B",
    marginTop: 6,
  },

  line: {
    flex: 1,
    width: 2,
    backgroundColor: "#2c2c2e",
    marginTop: 2,
  },

  card: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2c2c2e",
  },

  heading: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  user: {
    color: "#32D74B",
    fontSize: 12,
    fontWeight: "600",
  },

  time: {
    color: "#888",
    fontSize: 12,
  },

  viewMore: {
    marginTop: 8,
    fontSize: 12,
    color: "#0A84FF",
  },

  /* MODAL */



  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },



  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },

  modalHeading: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 14,
  },
  overlayTop: {
    flex: 1,
  },

  modalContent: {
    height: "80%",
    backgroundColor: "#1c1c1e",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },

  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#555",
    alignSelf: "center",
    marginBottom: 10,
  },

  scroll: {
    flex: 1, // 🔥 THIS FIXES SCROLL
  },

  scrollContent: {
    paddingBottom: 20,
  },

  metaBox: {
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#2c2c2e",
  },

  metaText: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 4,
  },

  closeBtn: {
    marginTop: 15,
    backgroundColor: "#32D74B",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  closeText: {
    color: "#000",
    fontWeight: "700",
  },
  // call Sectoin
  callSection: {
    marginTop: 20,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },

  callCard: {
    backgroundColor: "#2c2c2e",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  callName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  callMeta: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 2,
  },

  playBtn: {
    marginTop: 10,
    backgroundColor: "#0A84FF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  playText: {
    color: "#fff",
    fontWeight: "600",
  },
});