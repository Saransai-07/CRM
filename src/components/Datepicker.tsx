// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Pressable,
//   Modal,
//   StyleSheet,
//   Platform,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Ionicons } from "@expo/vector-icons";
// import { useTheme } from "@/src/theme";

// type Props = {
//   value: Date;
//   onChange: (date: Date) => void;
// };

// export const IOSDatePicker = ({ value, onChange }: Props) => {
//   const theme = useTheme();
//   const [visible, setVisible] = useState(false);
//   const [tempDate, setTempDate] = useState(value);

//   const handleConfirm = () => {
//     onChange(tempDate);
//     setVisible(false);
//   };

//   return (
//     <>
//       {/* Trigger */}
//       <Pressable
//         style={[
//           styles.input,
//           {
//             backgroundColor: theme.colors.surface,
//             borderColor: theme.colors.border,
//           },
//         ]}
//         onPress={() => setVisible(true)}
//       >
//         <Text
//           style={[
//             theme.typography.body,
//             { color: theme.colors.textPrimary },
//           ]}
//         >
//           {value.toDateString()}
//         </Text>

//         <Ionicons
//           name="chevron-down"
//           size={18}
//           color={theme.colors.textPrimary}
//         />
//       </Pressable>

//       {/* Modal */}
//       <Modal visible={visible} transparent animationType="slide">
//         <View style={styles.overlay}>
//           <View
//             style={[
//               styles.modalContainer,
//               { backgroundColor: theme.colors.background },
//             ]}
//           >
//             {/* Header */}
//             <View style={styles.modalHeader}>
//               <Pressable onPress={() => setVisible(false)}>
//                 <Text
//                   style={[
//                     theme.typography.body,
//                     { color: theme.colors.textPrimary },
//                   ]}
//                 >
//                   Cancel
//                 </Text>
//               </Pressable>

//               <Pressable onPress={handleConfirm}>
//                 <Text
//                   style={[
//                     theme.typography.body,
//                     { color: theme.colors.primary },
//                   ]}
//                 >
//                   Done
//                 </Text>
//               </Pressable>
//             </View>

//             <DateTimePicker
//               value={tempDate}
//               mode="date"
//               textColor="#ffffff"
//               display={Platform.OS === "ios" ? "spinner" : "default"}
//               // display={"spinner"}
//               onChange={(event, date) => {
//                 if (date) setTempDate(date);
//               }}
//               style={{ backgroundColor: theme.colors.background }}
//             />
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     borderRadius: 14,
//     borderWidth: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   overlay: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: "rgba(0,0,0,0.3)",
//   },

//   modalContainer: {
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingBottom: 20,
//   },

//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 16,
//   },
// });


import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme";

type Props = {
  value: Date;
  onChange: (date: Date) => void;
};

export const CrossPlatformDatePicker = ({ value, onChange }: Props) => {
  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  // 🔥 Android handler (no modal)
  const handleAndroidChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (event.type === "dismissed") {
      setVisible(false);
      return;
    }

    if (selectedDate) {
      onChange(selectedDate);
    }

    setVisible(false);
  };

  const handleConfirmIOS = () => {
    onChange(tempDate);
    setVisible(false);
  };

  return (
    <>
      {/* Trigger */}
      <Pressable
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textPrimary },
          ]}
        >
          {value.toDateString()}
        </Text>

        <Ionicons
          name="chevron-down"
          size={18}
          color={theme.colors.textPrimary}
        />
      </Pressable>

      {/* ✅ ANDROID PICKER */}
      {Platform.OS === "android" && visible && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleAndroidChange}
        />
      )}

      {/* ✅ IOS MODAL PICKER */}
      {Platform.OS === "ios" && (
        <Modal visible={visible} transparent animationType="slide">
          <View style={styles.overlay}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: theme.colors.background },
              ]}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <Pressable onPress={() => setVisible(false)}>
                  <Text
                    style={[
                      theme.typography.body,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable onPress={handleConfirmIOS}>
                  <Text
                    style={[
                      theme.typography.body,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Done
                  </Text>
                </Pressable>
              </View>

              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) setTempDate(date);
                }}
                style={{
                  backgroundColor: theme.colors.background,
                }}
                textColor={theme.colors.textPrimary} // iOS only
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
});