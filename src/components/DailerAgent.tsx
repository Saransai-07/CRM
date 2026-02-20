// import React from "react";
// import {
//   Alert,
//   Pressable,
//   Text,
//   StyleSheet,
//   Linking,
//   Platform,
// } from "react-native";

// type DialAgentButtonProps = {
//   phoneNumber: string;
//   agentName?: string;
//   label?: string;
// };

// const DialAgentButton: React.FC<DialAgentButtonProps> = ({
//   phoneNumber,
//   agentName,
//   label = "Call Agent",
// }) => {
//   const openDialer = async () => {
//     const url = `tel:${phoneNumber}`;

//     try {
//       const supported = await Linking.canOpenURL(url);

//       if (!supported) {
//         Alert.alert("Error", "Phone dialer not available on this device.");
//         return;
//       }

//       Alert.alert(
//         "Confirm Call",
//         `Call ${agentName ?? phoneNumber}?`,
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Call", onPress: () => Linking.openURL(url) },
//         ],
//         { cancelable: true }
//       );
//     } catch (error) {
//       Alert.alert("Error", "Something went wrong.");
//       console.error(error);
//     }
//   };

//   return (
//     <Pressable style={styles.button} onPress={openDialer}>
//       <Text style={styles.text}>{label}</Text>
//     </Pressable>
//   );
// };

// export default DialAgentButton;

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: "#1E88E5",
//     paddingVertical: 12,
//     paddingHorizontal: 18,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   text: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });


import React from "react";
import { Alert, Platform, Pressable, Text, StyleSheet } from "react-native";
import * as Linking from "expo-linking";

type DirectCallButtonProps = {
  phoneNumber: string;
  label?: string;
};

const DirectCallButton: React.FC<DirectCallButtonProps> = ({
  phoneNumber,
  label = "Call",
}) => {
  const handleCall = async () => {
    const url =
      Platform.OS === "android"
        ? `tel:${phoneNumber}`
        : `telprompt:${phoneNumber}`;

    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert("Error", "Calling not supported on this device");
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Failed to initiate call");
    }
  };

  return (
    <Pressable style={styles.button} onPress={handleCall}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
};

export default DirectCallButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
