import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { DailedInterface } from '@/src/Interface/InterfaceData'
import { Link } from 'expo-router'

const DailedComponent = ({ item }: { item: DailedInterface }) => {
  return (
    <Link
      href={{
        pathname : '/Tickets/StudentInstance',
        params :{
          id : item.student_id, scsnumber : item.SCS_Number
        } 
      }} asChild
    >
      <TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.agentName}>  {item.name}</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}> SCSNumber</Text>
            <Text style={styles.value}>{item.SCS_Number}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Branch</Text>
            <Text style={styles.value}>{item.branch_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}> Class </Text>
            <Text style={styles.value}>{item.student_class_name}({item.orientation_name})</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}> Category </Text>
            <Text style={styles.value}>{item.category_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}> Agent </Text>
            <Text style={styles.value}>{item.wizklub_agent_name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

export default DailedComponent

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