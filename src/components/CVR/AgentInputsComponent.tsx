import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { AgentInputsInterface } from '@/src/Interface/InterfaceData'

const AgentInputsComponent = ({item} : {item : AgentInputsInterface}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.agentName}>{item.username}</Text>
        {/* <Ionicons name="chevron-forward" size={20} color="#8E8E93" /> */}
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
  )
}

export default AgentInputsComponent



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
})