import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";

export type Option = {
  label: string;
  value: number | string ;
};

type Props = {
  label?: string;
  value: number | null | string;
  options: Option[];
  onChange: (value: number | null | string ) => void;
  allowClear?: boolean;
};

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  allowClear = true,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const selected = options.find((o) => o.value === value);

  //  Optimized filtering
  const filteredOptions = useMemo(() => {
    const lower = search.toLowerCase();

    return options.filter((o) =>
      o.label.toLowerCase().includes(lower)
    );
  }, [search, options]);

  const data = useMemo(() => {
    if (allowClear) {
      return [{ label: "Clear selection", value: null as any }, ...filteredOptions];
    }
    return filteredOptions;
  }, [filteredOptions, allowClear]);

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
            
            {/* 🔍 Search Input */}
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#8e8e93"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />

            <FlatList
              data={data}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item, index) =>
                item.value === null ? "clear" : String(item.value)
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>No results found</Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setVisible(false);
                    setSearch(""); // reset after select
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === null && { color: "#FF453A" },
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
    paddingBottom: 20,
    maxHeight: "70%",
  },

  // 🔍 Search styling
  searchInput: {
    height: 44,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#2c2c2e",
    paddingHorizontal: 12,
    color: "#fff",
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

  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#8e8e93",
  },
});