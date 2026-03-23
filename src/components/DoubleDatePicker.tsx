import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (start: string | null, end: string | null) => void;
}

const DateRangeModal = ({ visible, onClose, onApply }: Props) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("");

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const applyQuickFilter = (type: string) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (type) {
      case "today":
        start = today;
        end = today;
        break;

      case "last7":
        start.setDate(today.getDate() - 6);
        end = today;
        break;

      case "thisWeek":
        const day = today.getDay();
        start.setDate(today.getDate() - day);
        end = today;
        break;

      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = today;
        break;

      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;

      case "custom":
        setActiveFilter("custom");
        return;
    }

    setActiveFilter(type);
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

  const onDayPress = (day: any) => {
    setActiveFilter("custom");

    const selected = day.dateString;

    if (!startDate) {
      setStartDate(selected);
      setEndDate(null);
      return;
    }

    if (startDate && !endDate) {
      if (selected < startDate) {
        setStartDate(selected);
      } else {
        setEndDate(selected);
      }
      return;
    }

    setStartDate(selected);
    setEndDate(null);
  };

  const getMarkedDates = () => {
    let marked: any = {};

    if (startDate) {
      marked[startDate] = {
        startingDay: true,
        color: "#6C63FF",
        textColor: "white",
      };
    }

    if (endDate) {
      marked[endDate] = {
        endingDay: true,
        color: "#6C63FF",
        textColor: "white",
      };
    }

    if (startDate && endDate) {
      let start = new Date(startDate);
      let end = new Date(endDate);

      for (
        let d = new Date(start);
        d <= end;
        d.setDate(d.getDate() + 1)
      ) {
        const date = d.toISOString().split("T")[0];

        if (date !== startDate && date !== endDate) {
          marked[date] = {
            color: "#8B87FF",
            textColor: "white",
          };
        }
      }
    }

    return marked;
  };

  const applyRange = () => {
    onApply(startDate, endDate);
    onClose();
  };

  const clearRange = () => {
    setStartDate(null);
    setEndDate(null);
    setActiveFilter("");
    onApply(null, null);
  };

  const FilterButton = ({ label, value }: any) => (
    <TouchableOpacity
      style={[
        styles.filterBtn,
        activeFilter === value && styles.activeFilter,
      ]}
      onPress={() => applyQuickFilter(value)}
    >
      <Text
        style={[
          styles.filterText,
          activeFilter === value && { color: "white" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>Select date range</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.closeText}>
                    <Ionicons name="close-circle" color="#ffffff" size={24} />
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.filterRow}>
                <FilterButton label="Today" value="today" />
                <FilterButton label="Last 7 days" value="last7" />
                <FilterButton label="Last month" value="lastMonth" />
              </View>

              <View style={styles.filterRow}>
                <FilterButton label="This month" value="thisMonth" />
                <FilterButton label="This week" value="thisWeek" />
                <FilterButton label="Custom range" value="custom" />
              </View>

              <View style={styles.calendarWrapper}>
                <Calendar
                  markingType={"period"}
                  markedDates={getMarkedDates()}
                  onDayPress={onDayPress}
                  theme={{
                    calendarBackground: "#111827",
                    monthTextColor: "white",
                    dayTextColor: "white",
                    todayTextColor: "#6C63FF",
                    arrowColor: "white",
                  }}
                />
              </View>

              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={clearRange}
                >
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={applyRange}
                >
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DateRangeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#111827",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f2937",
  },

  closeText: {
    color: "#9ca3af",
    fontSize: 16,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
  },

  activeFilter: {
    backgroundColor: "#6C63FF",
  },

  filterText: {
    color: "#aaa",
    fontSize: 13,
  },

  calendarWrapper: {
    marginTop: 6,
    borderRadius: 16,
    overflow: "hidden",
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  clearBtn: {
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },

  applyBtn: {
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },

  clearText: {
    color: "#aaa",
  },

  applyText: {
    color: "white",
    fontWeight: "600",
  },
});