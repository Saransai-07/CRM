import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/theme";

type BackButtonProps = {
  onPress?: () => void;
  size?: number;
};

export const BackButton = ({ onPress, size = 40 }: BackButtonProps) => {
  const router = useRouter();
  const theme = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#5a5858",
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Ionicons
        name="chevron-back"
        size={22}
        color={theme.colors.textPrimary}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,

    // iOS style soft shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    elevation: 4,
  },
});
