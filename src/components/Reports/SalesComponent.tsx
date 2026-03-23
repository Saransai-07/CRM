
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SalesReportInterface } from '@/src/Interface/InterfaceData'

const SalesComponent = ({ item }: { item: SalesReportInterface }) => {

  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.agentName}>{item.name}</Text>
            <Ionicons name="chevron-down" size={20} color="#8E8E93" />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>SCS Number</Text>
            <Text style={styles.value}>{item.SCS_Number}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Branch</Text>
            <Text style={styles.value}>{item.branch_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Class</Text>
            <Text style={styles.value}>
              {item.student_class_name} ({item.orientation_name})
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>On Call</Text>
            <Text style={styles.value}>{item.on_call}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >

        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>

            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>

                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Sales Details</Text>

                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView>
                  <DetailRow label="Name" value={item.name} />
                  <DetailRow label="SCS Number" value={item.SCS_Number} />
                  <DetailRow label="State" value={item.state_name} />
                  <DetailRow label="Zone" value={item.zone_name} />
                  <DetailRow label="Branch" value={item.branch_name} />
                  <DetailRow label="Class" value={item.student_class_name} />
                  <DetailRow label="Orientation" value={item.orientation_name} />
                  <DetailRow label='Previous Orientation' value={item.previous_orientation_name}/>
                  <DetailRow label='Is Last Year Paid' value={item.is_last_year_paid ? "YES" : "NO" }/>     
                  <DetailRow label="On Call" value={item.on_call} />
                  <DetailRow label="Sale Date" value={item.saledate} />
                  <DetailRow label='Agent' value={item.final_agent}/>
                </ScrollView>

              </View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>

      </Modal>
    </>
  )
}

export default SalesComponent


const DetailRow = ({ label, value }: { label: string, value: any }) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? "-"}</Text>
    </View>
  )
}


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
  },

  agentName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
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

  /* MODAL */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#111",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
})