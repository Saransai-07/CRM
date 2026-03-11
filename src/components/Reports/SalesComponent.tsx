import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SalesReportInterface } from '@/src/Interface/InterfaceData'

const SalesComponent = ({item} : { item : SalesReportInterface}) => {
  return (
    <TouchableOpacity>
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.agentName}>  {item.name}</Text>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}> SCS Number</Text>
          <Text style={styles.value}>{item.SCS_Number}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}> Branch </Text>
          <Text style={styles.value}>{item.branch_name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}> Class </Text>
          <Text style={styles.value}>{item.student_class_name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}> On Call </Text>
          <Text style={styles.value}>{item.on_call}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default SalesComponent

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