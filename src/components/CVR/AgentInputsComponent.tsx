import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { AgentInputsInterface } from '@/src/Interface/InterfaceData'

const AgentInputsComponent = ({ item }: { item: AgentInputsInterface }) => {

  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.agentName}>{item.username}</Text>
            <Ionicons name="chevron-down" size={20} color="#8E8E93" />

          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Branches</Text>
            <Text style={styles.value}>{item.no_of_branches}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Unique Student Touch</Text>
            <Text style={styles.value}>{item.unique_lead_touch}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Unique Student Touch Connected</Text>
            <Text style={styles.value}>{item.unique_lead_touch_connected}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Calls</Text>
            <Text style={styles.value}>{item.no_of_calls}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Connected Calls</Text>
            <Text style={styles.value}>{item.no_of_call_connected}</Text>
          </View>
        </View>
      </TouchableOpacity>


      {/* MODAL */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
      >

        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>

            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>

                {/* Header */}

                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Agent Details</Text>

                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView>

                  <DetailRow label="Agent Name" value={item.username} />
                  <DetailRow label="Branches" value={item.no_of_branches} />
                  <DetailRow label="Unique Student Touch" value={item.unique_lead_touch} />
                  <DetailRow label="Unique Student Touch Connected" value={item.unique_lead_touch_connected} />
                  <DetailRow label="Calls" value={item.no_of_calls} />
                  <DetailRow label="Connected Calls" value={item.no_of_call_connected} />
                  <DetailRow label='Less than 30 Seconds' value={item.less_than_30_secs}/>
                  <DetailRow label='Less than 1 Minute' value={item.less_than_1_min}/>
                  <DetailRow label='Less than 1 Min 30 Secs' value={item.less_than_1_min_30_secs}/>
                  <DetailRow label='Greater than 1 Min 30 Secs' value={item.greater_than_1_min_30_secs}/>

                </ScrollView>

              </View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>

      </Modal>
    </>
  )
}

export default AgentInputsComponent



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