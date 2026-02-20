import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext";
import { useThemedStyles, useTheme, type Theme } from "@/src/theme";

const UserData = () => {
  const router = useRouter();
  const { authState, logout } = useAuth();
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  const user = authState.user;

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.accent} />
        </TouchableOpacity>
        <Text style={styles.title}>Account</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Ionicons
              name="person-circle"
              size={80}
              color={theme.colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Login details</Text>
          {user && typeof user === "object" ? (
            Object.entries(user).map(([key, value]) => {
              if (value == null || typeof value === "object") return null;
              return (
                <View key={key} style={styles.row}>
                  <Text style={styles.rowLabel}>{key}</Text>
                  <Text style={styles.rowValue} numberOfLines={1}>
                    {String(value)}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No user data available</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const createStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: Platform.OS === "ios" ? 56 : 48,
      marginBottom: 24,
      paddingHorizontal: 8,
      paddingRight: 16,
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      ...t.typography.largeTitle,
      color: t.colors.textPrimary,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingTop: 0,
    },
    avatarRow: {
      alignItems: "center",
      marginBottom: 24,
    },
    avatarCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: t.colors.surfaceElevated,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radius.lg,
      padding: 20,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    cardLabel: {
      ...t.typography.footnote,
      fontWeight: "600",
      color: t.colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: t.colors.border,
    },
    rowLabel: {
      fontSize: 15,
      color: t.colors.textSecondary,
      textTransform: "capitalize",
      marginRight: 12,
    },
    rowValue: {
      fontSize: 15,
      fontWeight: "500",
      color: t.colors.textPrimary,
      flex: 1,
      textAlign: "right",
    },
    emptyText: {
      fontSize: 15,
      color: t.colors.textTertiary,
    },
    logoutButton: {
      marginTop: 24,
      backgroundColor: t.colors.accentMuted,
      borderRadius: t.radius.md,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: "center",
      borderWidth: 1,
      borderColor: t.colors.accent,
    },
    logoutButtonText: {
      fontSize: 17,
      fontWeight: "600",
      color: t.colors.accent,
    },
  });

export default UserData;
