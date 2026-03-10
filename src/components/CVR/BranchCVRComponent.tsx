import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { BranchCVRInterface } from '@/src/Interface/InterfaceData'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'

const BranchCVRComponent = ({ item }: { item: BranchCVRInterface }) => {
  return (
    <Link href={{
      pathname: '/BranchCVR/[id]',
      params: { id: item.branch_id }
    }}
      asChild
    >
      <TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.agentName}>{item.name}- ({item.category})</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>zone_name</Text>
            <Text style={styles.value}>{item.zone_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Strength</Text>
            <Text style={styles.value}>{item.YLP_student_count}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Unique Student connected</Text>
            <Text style={styles.value}>{item.unique_lead_connected}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Target </Text>
            <Text style={styles.value}>{item.total_target}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
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
})

export default BranchCVRComponent