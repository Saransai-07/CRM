import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AgentReport } from "../../Interface/InterfaceData";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const AgentCard = ({ item }: { item: AgentReport }) => {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: "/AgentReports/[id]",
        params: { id: item.id, name : item.username },
      }}
      asChild
    >
      <TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.agentName}>👨‍💼 {item.username}</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>🏫 Branches</Text>
            <Text style={styles.value}>{item.no_of_branches}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>📞 Unique Student Touch</Text>
            <Text style={styles.value}>{item.students_connected}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>🎯 Sales</Text>
            <Text style={styles.value}>{item.students_sales_count}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>📈 CVR</Text>
            <Text style={styles.value}>{item.cvr}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
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
