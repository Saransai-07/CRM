// components/AgentTable.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { Agent } from "../Interface/InterfaceData";

interface Props {
  data: Agent[];
}

export const AgentTable: React.FC<Props> = ({ data }) => {
  const renderItem = ({ item }: { item: Agent }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.username}</Text>
      <Text style={styles.cell}>{item.students_connected}</Text>
      <Text style={styles.cell}>{item.students_sales_count}</Text>
      <Text style={styles.cell}>{item.no_of_branches}</Text>
      <Text style={styles.cell}>{item.cvr}</Text>
    </View>
  );

  return (
    <ScrollView horizontal>
      <View>
        {/* Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.header]}>Username</Text>
          <Text style={[styles.cell, styles.header]}>Connected</Text>
          <Text style={[styles.cell, styles.header]}>Sales</Text>
          <Text style={[styles.cell, styles.header]}>Branches</Text>
          <Text style={[styles.cell, styles.header]}>CVR</Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerRow: {
    backgroundColor: "#181818",
  },
  cell: {
    width: 120,
    padding: 10,
    fontSize: 14,
    color: "#fff"
  },
  header: {
    fontWeight: "bold",
  },
});
