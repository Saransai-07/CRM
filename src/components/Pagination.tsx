// // components/Pagination.tsx

// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// interface Props {
//   currentPage: number;
//   totalPages: number;
//   onNext: () => void;
//   onPrev: () => void;
// }

// export const Pagination: React.FC<Props> = ({
//   currentPage,
//   totalPages,
//   onNext,
//   onPrev,
// }) => {
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         disabled={currentPage === 1}
//         style={[styles.button, currentPage === 1 && styles.disabled]}
//         onPress={onPrev}
//       >
//         <Text style={styles.text}>Prev</Text>
//       </TouchableOpacity>

//       <Text style={styles.pageText}>
//         {currentPage} / {totalPages}
//       </Text>

//       <TouchableOpacity
//         disabled={currentPage === totalPages}
//         style={[
//           styles.button,
//           currentPage === totalPages && styles.disabled,
//         ]}
//         onPress={onNext}
//       >
//         <Text style={styles.text}>Next</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 15,
//   },
//   button: {
//     backgroundColor: "#007bff",
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   disabled: {
//     backgroundColor: "#ccc",
//   },
//   text: {
//     color: "#fff",
//     fontWeight: "600",
//   },
//   pageText: {
//     marginHorizontal: 15,
//     fontSize: 16,
//   },
// });


// components/Pagination.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
  const prevDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;

  return (
    <View style={styles.container}>
      
      {/* Prev */}
      <TouchableOpacity
        disabled={prevDisabled}
        onPress={onPrev}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={
            prevDisabled
              ? ["#444", "#444"]
              : ["#7b2ff7", "#a450ff", "#5f2cff"]
          }
          style={styles.neonBorder}
        >
          <View style={styles.button}>
            <Text style={styles.text}>Prev</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.pageText}>
        {currentPage} / {totalPages}
      </Text>

      {/* Next */}
      <TouchableOpacity
        disabled={nextDisabled}
        onPress={onNext}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={
            nextDisabled
              ? ["#444", "#444"]
              : ["#7b2ff7", "#a450ff", "#5f2cff"]
          }
          style={styles.neonBorder}
        >
          <View style={styles.button}>
            <Text style={styles.text}>Next</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    
  },

  neonBorder: {
    padding: 2,
    borderRadius: 25,
    // shadowColor: "#8b5cf6",
    shadowOpacity: 0.9,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    // elevation: 10,
  },

  button: {
    backgroundColor: "#0a0a0a",
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 25,
  },

  text: {
    color: "#e5e5e5",
    fontWeight: "600",
    fontSize: 15,
  },

  pageText: {
    marginHorizontal: 18,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});