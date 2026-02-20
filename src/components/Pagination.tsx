// components/Pagination.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}

export const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={currentPage === 1}
        style={[styles.button, currentPage === 1 && styles.disabled]}
        onPress={onPrev}
      >
        <Text style={styles.text}>Prev</Text>
      </TouchableOpacity>

      <Text style={styles.pageText}>
        {currentPage} / {totalPages}
      </Text>

      <TouchableOpacity
        disabled={currentPage === totalPages}
        style={[
          styles.button,
          currentPage === totalPages && styles.disabled,
        ]}
        onPress={onNext}
      >
        <Text style={styles.text}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabled: {
    backgroundColor: "#ccc",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
  pageText: {
    marginHorizontal: 15,
    fontSize: 16,
  },
});
