import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import ActivityRing from '../ActivityRing';
import { CrossPlatformDatePicker } from '../Datepicker';
import { useAuth } from '@/src/context/AuthContext';
import { PerformanceInterface } from '@/src/Interface/InterfaceData';

const Performance = () => {
  const { BASE_URL, authState } = useAuth();

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [performance, setPerformance] = useState<PerformanceInterface>();
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const progress = performance && performance.target > 0 ? performance.achieved / performance.target : 0;

  // Performance
  const fetchPerformance = async (date: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/new_dashboards/performance_dashboard/?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch performance");
      }

      setPerformance(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Performance fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance(formatDate(selectedDate))
  }, [selectedDate])

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.header}>
        <Text style={styles.title}>Performance</Text>
        <Text style={styles.date}>{formatDate(selectedDate)}</Text>
      </View>

      {/* Row */}
      <View style={styles.rowContainer}>
        <View style={styles.kpiBox}>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <Text style={styles.kpiValue}>
                <ActivityRing progress={progress} size={100} />
                <Text style={styles.kpiLabel}>{`Achieved / Target `}</Text>
                <Text style={styles.kpiValue}>{performance?.achieved} / {performance?.target}</Text>
              </Text>


            </>
          )}
        </View>

        {/* Dropdown */}
        <View style={styles.dropdownBox}>
          <CrossPlatformDatePicker
            value={selectedDate}
            onChange={(date: any) => setSelectedDate(date)}
          />
          {performance?.is_admin && (
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownValue}>
                  {performance?.renewals}
                </Text>
                <Text style={styles.breakdownLabel}>
                  Renewals
                </Text>
              </View>

              <View style={styles.breakdownCard}>
                <Text style={styles.breakdownValue}>
                  {performance?.new_sales}
                </Text>
                <Text style={styles.breakdownLabel}>
                  New Sales
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Performance;

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
    // backgroundColor: "#1a253d",
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