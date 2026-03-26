
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

export type Option = {
  label: string;
  value: number;
};

type Props = {
  label?: string;
  value: number | null;
  options: Option[];
  onChange: (value: number | null) => void;
  allowClear?: boolean; // 👈 new
};

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  allowClear = true,
}: Props) {
  const [visible, setVisible] = useState(false);

  const selected = options.find((o) => o.value === value);

  const data = allowClear
    ? [{ label: "Clear selection", value: null as any }, ...options]
    : options;

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
        <Text style={styles.valueText}>
          {selected ? selected.label : "Select"}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.sheet}>
            <FlatList
              data={data}
              keyExtractor={(item, index) =>
                item.value === null ? "clear" : String(item.value)
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === null && { color: "#FF453A" }, // 👈 red clear
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: "#8e8e93",
    marginBottom: 6,
    marginLeft: 4,
  },

  input: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#4a4a4b",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  valueText: {
    color: "#fff",
    fontSize: 16,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  sheet: {
    backgroundColor: "#1c1c1e",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 10,
  },

  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },

  optionText: {
    color: "#fff",
    fontSize: 16,
  },
});