import { useAuth } from "@/src/context/AuthContext";
import { useTheme, useThemedStyles, type Theme } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform
} from "react-native";

export default function Login() {
  const { login } = useAuth();

  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const BASE_URL = "https://app.srichaitanyacrm.com";

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Username and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/user/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Login failed");
      }

      await login(data);
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.message || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        {/* Username */}
        <TextInput
          placeholder="Username"
          placeholderTextColor={theme.colors.textTertiary}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />

        {/* Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.accent} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: t.colors.background,
      justifyContent: "center"
    },

    container: {
      padding: 24
    },

    title: {
      ...t.typography.title1,
      color: t.colors.textPrimary,
      textAlign: "center",
      marginBottom: 32
    },

    input: {
      backgroundColor: t.colors.surface,
      borderWidth: 1,
      borderColor: t.colors.border,
      padding: 16,
      borderRadius: t.radius.md,
      marginBottom: 16,
      fontSize: 17,
      color: t.colors.textPrimary
    },

    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: t.colors.surface,
      borderWidth: 1,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      marginBottom: 16
    },

    passwordInput: {
      flex: 1,
      padding: 16,
      fontSize: 17,
      color: t.colors.textPrimary
    },

    eyeButton: {
      paddingHorizontal: 16
    },

    eyeText: {
      color: t.colors.textSecondary,
      fontSize: 14
    },

    button: {
      backgroundColor: t.colors.accentMuted,
      borderWidth: 1,
      borderColor: t.colors.accent,
      padding: 16,
      borderRadius: t.radius.md,
      alignItems: "center",
      marginTop: 8
    },

    buttonText: {
      color: t.colors.accent,
      fontSize: 17,
      fontWeight: "600"
    }
  });