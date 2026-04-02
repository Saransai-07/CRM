import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Dropdown from "../DropDown";
import { useAuth } from "@/src/context/AuthContext";

const TodaySalesScreen = () => {
  const { BASE_URL, authState } = useAuth();

  const today = new Date().toISOString().split("T")[0];

  const [onCall, setOnCall] = useState<number | null | string>(null);
  const [todayTotalSales, setTodayTotalSales] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const options = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  const firstSecond = todayTotalSales?.sales_counts?.first_and_second_class_sales_count ?? 0;
  const thirdToNinth = todayTotalSales?.sales_counts?.third_to_ninth_class_sales_count ?? 0;

  const fetchTodaySalesData = async () => {
    try {
      setLoading(true);

      const onCallParam =
        onCall === null ? "" : `&on_call=${onCall}`;

      const res = await fetch(
        `${BASE_URL}/wizklub/wizklub_agent_sales/?page=1${onCallParam}&from_date=${today}&to_date=${today}`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch");
      }

      setTodayTotalSales(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial + filter-based fetch
  useEffect(() => {
    fetchTodaySalesData();
  }, [onCall]);

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.header}>
        <Text style={styles.title}>Today Sales</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>

      {/* Row */}
      <View style={styles.rowContainer}>
        {/* KPI */}
        <View style={styles.kpiBox}>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <Text style={styles.kpiValue}>
                {todayTotalSales?.total_count ?? 0}
              </Text>
              <Text style={styles.kpiLabel}>Sales</Text>

            </>
          )}
        </View>

        {/* Dropdown */}
        <View style={styles.dropdownBox}>
          <Dropdown
            label="onCall"
            value={onCall}
            options={options}
            onChange={setOnCall}
          />
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownValue}>
                {firstSecond}
              </Text>
              <Text style={styles.breakdownLabel}>
                1st-2nd
              </Text>
            </View>

            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownValue}>
                {thirdToNinth}
              </Text>
              <Text style={styles.breakdownLabel}>
                3rd-9th
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TodaySalesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  date: {
    fontSize: 13,
    color: "#9CA3AF",
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 8,
  },

  dropdownBox: {
    flex: 2,
    // backgroundColor: "#111827",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },

  kpiBox: {
    flex: 1,
    backgroundColor: "#1a253d",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  kpiValue: {
    color: "#22C55E",
    fontSize: 22,
    fontWeight: "700",
  },

  kpiLabel: {
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 2,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 12,
  },

  breakdownCard: {
    flex: 1,
    backgroundColor: "#1f2b44",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  breakdownValue: {
    color: "#38BDF8", // slightly different color for contrast
    fontSize: 18,
    fontWeight: "700",
  },

  breakdownLabel: {
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 4,
  },
});