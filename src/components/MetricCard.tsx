import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

 interface MetricCardProps {
  heading: string;
  headingValue: string;
  subHeading1: string;
  subHeading1Value: string;
  subHeading2: string;
  subHeading2Value: string;
  logo?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  heading,
  headingValue,
  subHeading1,
  subHeading1Value,
  subHeading2,
  subHeading2Value,
  logo,
}) => {

  const formatedNumber = (value : string | number) => {
    return Math.floor(Number(value));
  }

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>{heading}</Text>
        {logo && <Image source={{ uri: logo }} style={styles.logo} />}
      </View>

      {/* Main Value */}
      <Text style={styles.value}>{formatedNumber(headingValue)}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Sub values */}
      <View style={styles.subRow}>
        <View>
          <Text style={styles.subLabel1}>{subHeading1}</Text>
          <Text style={styles.subValue1}>{formatedNumber(subHeading1Value)}</Text>
        </View>

        <View>
          <Text style={styles.subLabel2}>{subHeading2}</Text>
          <Text style={styles.subValue2}>{formatedNumber(subHeading2Value)}</Text>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#414141",
    borderRadius: 18,
    padding: 16,
    width : '48%',
    // marginBottom: 14,
    // marginTop: 14,
    // margin : 8
    // marginRight : 8,
    marginTop : 12,
    // marginBottom : 8,
},

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heading: {
    color: "#A1A1A1",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  logo: {
    width: 22,
    height: 22,
    tintColor: "#A1A1A1",
  },

  value: {
    color: "#30D158",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#1E1E1E",
    marginVertical: 12,
  },

  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  subLabel1: {
    color: "#ac70e4",
    fontSize: 12,
    marginBottom: 4,
  },

  subValue1: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  subLabel2: {
    color: "#1897ff",
    fontSize: 12,
    marginBottom: 4,
  },

  subValue2: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
