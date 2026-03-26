import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Dropdown from "@/src/components/DropDown";

const CallBottomSheet = ({
  visible,
  onClose,
  onCall,
  options,
}: any) => {
  const [selected, setSelected] = useState<number | null>(null);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Number</Text>

        <Dropdown
          label="Choose number"
          value={selected}
          options={options}
          onChange={setSelected}
        />

        <View style={styles.row}>
          <Pressable onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              onCall(selected); // null = default call
              onClose();
            }}
          >
            <Text style={styles.call}>Call</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default CallBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: { color: "#fff", fontSize: 18, marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancel: { color: "#aaa" },
  call: { color: "#4CD964", fontWeight: "600" },
});