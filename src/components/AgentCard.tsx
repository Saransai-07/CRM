import { StyleSheet, Text, View } from "react-native";
import { AgentReport } from "../Interface/InterfaceData";

const AgentCard = ({ item }: { item: AgentReport }) => {
    return (
      <View style={styles.card}>
        {/* Top Row */}
        <View style={styles.cardTop}>
          <Text style={styles.agentName}>{item.username}</Text>
        </View>

        <View style={styles.divider} />

  
        {/* Stats */}
  
        <View style={styles.row}>
          <Text style={styles.label}>Branches</Text>
          <Text style={styles.value}>{item.no_of_branches}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.label}>Unique Student Touch</Text>
          <Text style={styles.value}>{item.students_connected}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.label}>Sales</Text>
          <Text style={styles.value}>{item.students_sales_count}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.label}>CVR</Text>
          <Text style={styles.value}>{item.cvr}</Text>
        </View>
      </View>
    );
  };
  export default AgentCard;

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
