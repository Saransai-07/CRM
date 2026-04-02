import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

type Option = {
  label: string;
  value: string;
};

type Props = {
  states: Option[];
  zones: Option[];
  branches: Option[];
  agents: Option[];

  selectedState?: string;
  selectedZone?: string;
  selectedBranch?: string;
  selectedAgent?: string;

  onApply: (filters: any) => void;
};

const Dropdown = ({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value?: string;
  options: Option[];
  onSelect: (val: string) => void;
}) => {
  return (
    <View style={styles.dropdown}>
      <Text style={styles.label}>{label}</Text>

      {options.map((item) => (
        <TouchableOpacity
          key={item.value}
          style={[
            styles.option,
            value === item.value && styles.selected,
          ]}
          onPress={() => onSelect(item.value)}
        >
          <Text>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const FilterModal = ({
  states,
  zones,
  branches,
  agents,
  onApply,
}: Props) => {
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["70%"], []);

  const [selectedState, setSelectedState] = useState<string>();
  const [selectedZone, setSelectedZone] = useState<string>();
  const [selectedBranch, setSelectedBranch] = useState<string>();
  const [selectedAgent, setSelectedAgent] = useState<string>();

  const open = () => sheetRef.current?.expand();
  const close = () => sheetRef.current?.close();

  const handleApply = () => {
    onApply({
      state: selectedState,
      zone: selectedZone,
      branch: selectedBranch,
      agent: selectedAgent,
    });
    close();
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity style={styles.button} onPress={open}>
        <Text style={styles.buttonText}>Open Filters</Text>
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints}>
        <BottomSheetView style={styles.container}>
          <Text style={styles.title}>Filters</Text>

          <Dropdown
            label="State"
            value={selectedState}
            options={states}
            onSelect={(val) => {
              setSelectedState(val);
              setSelectedZone(undefined);
              setSelectedBranch(undefined);
              setSelectedAgent(undefined);
            }}
          />

          <Dropdown
            label="Zone"
            value={selectedZone}
            options={zones}
            onSelect={(val) => {
              setSelectedZone(val);
              setSelectedBranch(undefined);
              setSelectedAgent(undefined);
            }}
          />

          <Dropdown
            label="Branch"
            value={selectedBranch}
            options={branches}
            onSelect={(val) => {
              setSelectedBranch(val);
              setSelectedAgent(undefined);
            }}
          />

          <Dropdown
            label="Agent"
            value={selectedAgent}
            options={agents}
            onSelect={setSelectedAgent}
          />

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.resetBtn} onPress={() => {
              setSelectedState(undefined);
              setSelectedZone(undefined);
              setSelectedBranch(undefined);
              setSelectedAgent(undefined);
            }}>
              <Text>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={{ color: "#fff" }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  dropdown: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "500",
    marginBottom: 6,
  },
  option: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    marginBottom: 6,
  },
  selected: {
    backgroundColor: "#d0e8ff",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  resetBtn: {
    padding: 12,
  },
  applyBtn: {
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  button: {
    padding: 12,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
  },
});