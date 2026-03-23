import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DataItem {
  label: string;
  sales: number;
  target: number;
}

interface DataItem1 {
  label: string;
  actual: number;
  target: number;
}

interface Props {
  data: DataItem[];
}

interface Props1 {
  data: DataItem1[];
}

export const WeeklySalesChart: React.FC<Props> = ({ data }) => {
  const maxTarget = Math.max(...data.map(d => d.target));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Weekly Sales</Text>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#32D74B" }]} />
            <Text style={styles.legendText}>Sales</Text>
        </View>

        <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#1E1E1E" }]} />
            <Text style={styles.legendText}>Target</Text>
        </View>
      </View> 


      <View style={styles.chartRow}>
        {data.map((item, index) => {
          const salesHeight = (item.sales / maxTarget) * 120;
          const targetHeight = (item.target / maxTarget) * 120;

          return (
            <View key={index} style={styles.barWrapper}>
              {/* Target Bar */}
              <View
                style={[
                  styles.targetBar,
                  { height: targetHeight },
                ]}
              />

              {/* Sales Bar */}
              <View
                style={[
                  styles.salesBar,
                  { height: salesHeight },
                ]}
              />

              <Text style={styles.label}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};


export const WeeklyConversionChart: React.FC<Props1> = ({ data }) => {
  const maxTarget = Math.max(...data.map(d => d.target));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Weekly Conversions</Text>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#32D74B" }]} />
            <Text style={styles.legendText}>Conversion</Text>
        </View>

        <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#1E1E1E" }]} />
            <Text style={styles.legendText}>Time</Text>
        </View>
      </View> 


      <View style={styles.chartRow}>
        {data.map((item, index) => {
          const salesHeight = (item.actual / maxTarget) * 120;
          const targetHeight = (item.target / maxTarget) * 120;

          return (
            <View key={index} style={styles.barWrapper}>
              {/* Target Bar */}
              <View
                style={[
                  styles.targetBar,
                  { height: targetHeight },
                ]}
              />

              {/* Sales Bar */}
              <View
                style={[
                  styles.salesBar,
                  { height: salesHeight },
                ]}
              />

              <Text style={styles.label}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};




const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0B0B0B",
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  barWrapper: {
    alignItems: "center",
    width: 32,
  },
  legendRow: {
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 14,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  legendText: {
    color: "#8E8E93",
    fontSize: 12,
  },

  targetBar: {
    position: "absolute",
    bottom: 18,
    width: 8,
    backgroundColor: "#1E1E1E", // muted target
    borderRadius: 4,
  },

  salesBar: {
    position: "absolute",
    bottom: 18,
    width: 8,
    backgroundColor: "#32D74B", // Apple Fitness green
    borderRadius: 4,
  },

  label: {
    marginTop: 140,
    color: "#8E8E93",
    fontSize: 11,
  },
});
