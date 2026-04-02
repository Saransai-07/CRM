import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, LayoutChangeEvent, useWindowDimensions } from "react-native";

type DataItem = {
  label: string;
  sales: number;
  target: number;
};

type Props = {
  data: DataItem[];
};

type DataItem1 = {
  label: string;
  actual: number;
  target: number;
};

type Props1 = {
  data: DataItem1[];
};

export const WeeklySalesChart: React.FC<Props> = ({ data }) => {
  const { width } = useWindowDimensions();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // responsive chart height
  const chartHeight = Math.max(width * 0.35, 140);

  const maxTarget = Math.max(...data.map(d => d.target), 1);

  return (
    <View style={[styles.card, { padding: width * 0.04 }]}>
      <Text style={[styles.title, { fontSize: width * 0.045 }]}>
        Weekly Sales
      </Text>

      <View style={styles.legendRow}>
        <Legend color="#32D74B" label="Sales" />
        <Legend color="#8f8e8e" label="Target" />
      </View>

      <View style={[styles.chartRow, { height: chartHeight }]}>
        {data.map((item, index) => (
          <BarItem
            key={index}
            item={item}
            maxTarget={maxTarget}
            chartHeight={chartHeight}
            isSelected={selectedIndex === index}
            barWidth={width / (data.length * 2.5)} // responsive bars
            onPress={() =>
              setSelectedIndex(index === selectedIndex ? null : index)
            }
          />
        ))}
      </View>
    </View>
  );
};


export const WeeklyConversionChart: React.FC<Props1> = ({ data }) => {
  const { width } = useWindowDimensions();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // responsive chart height
  const chartHeight = Math.max(width * 0.35, 140);

  const maxTarget = Math.max(...data.map(d => d.target), 1);

  return (
    <View style={[styles.card, { padding: width * 0.04 }]}>
      <Text style={[styles.title, { fontSize: width * 0.045 }]}>
        Weekly Conversation of Agent
      </Text>

      <View style={styles.legendRow}>
        <Legend color="#32D74B" label="Conversation " />
        <Legend color="#747373" label="Target" />
      </View>



      <View style={[styles.chartRow, { height: chartHeight }]}>
        {data.map((item, index) => (
          <BarItem1
            key={index}
            item={item}
            maxTarget={maxTarget}
            chartHeight={chartHeight}
            isSelected={selectedIndex === index}
            barWidth={width / (data.length * 2.5)} // responsive bars
            onPress={() =>
              setSelectedIndex(index === selectedIndex ? null : index)
            }
          />
        ))}
      </View>
    </View>
  );
};



const BarItem = ({
  item,
  maxTarget,
  chartHeight,
  isSelected,
  onPress,
}: any) => {
  const salesHeight = Math.max((item.sales / maxTarget) * chartHeight, 4);
  const targetHeight = Math.max((item.target / maxTarget) * chartHeight, 4);

  return (
    <Pressable style={styles.barWrapper} onPress={onPress}>
      {/* Tooltip */}
      {isSelected && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}> 🟢 {item.sales} </Text>
          <Text style={styles.tooltipText}> ⚫ {item.target}</Text>
        </View>
      )}

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
    </Pressable>
  );
};

const BarItem1 = ({
  item,
  maxTarget,
  chartHeight,
  isSelected,
  onPress,
}: any) => {
  const salesHeight = Math.max((item.actual / maxTarget) * chartHeight, 4);
  const targetHeight = Math.max((item.target / maxTarget) * chartHeight, 4);

  return (
    <Pressable style={styles.barWrapper} onPress={onPress}>
      {/* Tooltip */}
      {isSelected && (
        <View style={styles.tooltip1}>
          <Text style={styles.tooltipText}> 🟢 {item.actual} </Text>
          <Text style={styles.tooltipText}> ⚫ {item.target}</Text>
        </View>
      )}

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
    </Pressable>
  );
};

const Legend = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);



const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    marginTop : 12
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color : "#ffff",
    marginBottom: 6,
  },

  legendRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 25,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
    color: "#ffffff",
  },

  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  barWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },

  targetBar: {
    position: "absolute",
    bottom: 20,
    width: 16,
    backgroundColor: "#a7a4a4",
    borderRadius: 6,
    opacity: 0.3,
  },

  salesBar: {
    position: "absolute",
    bottom: 20,
    width: 16,
    backgroundColor: "#32D74B",
    borderRadius: 6,
  },

  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#ffffff",
  },

  tooltip: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "#3f3f3f",
    padding: 4,
    margin: 6,
    width: 50,
    borderRadius: 6,
    zIndex: 10,
  },

  tooltip1: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "#3f3f3f",
    padding: 4,
    margin : 4,
    width: 70,
    borderRadius: 6,
    zIndex: 10,
  },

  tooltipText: {
    color: "#fff",
    fontSize: 10,
  },
});
