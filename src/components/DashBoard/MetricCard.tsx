
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  data: any;
};

export const DashboardCards = ({ data }: Props) => {

  if (!data) {
    return null; // or loader
  }
  return (
    <View style={styles.container}>
      <StatCard
        title="Students"
        percentage={data?.students?.students_per ?? 0}
        total={data?.students?.total_students ?? 0}
        leftLabel="Connected"
        leftValue={data?.students?.connected_students ?? 0}
        rightLabel="Pending"
        rightValue={data?.students?.remaining_students ?? 0}
        />

      <StatCard
        title="Calls"
        percentage ={data?.calls?.calls_per ?? 0}
        total={data?.calls?.total_calls ?? 0}
        leftLabel="Connected"
        leftValue={data?.calls?.connected_calls ?? 0}
        rightLabel="Missed"
        rightValue={data?.calls?.missed_calls ?? 0}
      />

      <StatCard
        title="Tickets"
        percentage={data?.tickets?.tickets_per ?? 0}
        total={data?.tickets?.total_tickets ?? 0}
        leftLabel="Interested"
        leftValue={data?.tickets?.interested_tickets ?? 0}
        rightLabel="Remaining"
        rightValue={data?.tickets?.remaining_tickets ?? 0}
      />

      <StatCard
        title="Sales"
        percentage={data?.sales?.sales_per ?? 0}
        total={data?.sales?.total_sales ?? 0}
        leftLabel="On Call"
        leftValue={data?.sales?.on_call_sales ?? 0}
        rightLabel="Branch"
        rightValue={data?.sales?.branch_sales ?? 0} 
      />
    </View>
  );
};


type CardProps = {
  title: string;
  total: number;
  percentage : number;
  leftLabel: string;
  leftValue: number;
  rightLabel: string;
  rightValue: number;
};

const StatCard = ({
  title,
  total,
  percentage,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: CardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.percentage}>{percentage} %</Text>
      </View>
      <Text style={styles.total}>{total}</Text>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>{leftLabel}</Text>
          <Text style={styles.value}>{leftValue}</Text>
        </View>

        <View>
          <Text style={styles.label1}>{rightLabel}</Text>
          <Text style={styles.value1}>{rightValue}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  header : {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  card: {
    width: "48%",
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  title: {
    color: "#ffffff",
    fontSize: 13,
    marginBottom: 6,
  },
  percentage :{
    color :"#000000",
    fontSize : 13,
    backgroundColor : "#c9b5e4",
    marginBottom : 6,
    padding : 4,
    borderRadius : 10,

  },

  total: {
    color: "#00E676",
    fontSize: 22,
    fontWeight: "bold",
  },

  divider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 12,
    color: "#ac59c5",
  },

  value: {
    fontSize: 14,
    color: "#fff",
    marginTop: 2,
  },

  label1: {
    fontSize: 12,
    color: "#5a5af3",
  },

  value1: {
    fontSize: 14,
    color: "#fff",
    marginTop: 2,
  },
});