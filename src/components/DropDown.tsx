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
  value: number  ;
};

type Props = {
  label?: string;
  value: any;
  options: Option[];
  onChange: (value: number) => void;
};

export default function Dropdown({ label, value, options, onChange }: Props) {
  const [visible, setVisible] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.input}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.valueText}>
          {selected ? selected.label : "Select"}
        </Text>

        <Text style={styles.chevron}></Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.sheet}>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
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

  chevron: {
    color: "#8e8e93",
    fontSize: 18,
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