import { useAuth } from "@/src/context/AuthContext";
import { useTheme, useThemedStyles, type Theme } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Animated
} from "react-native";
import * as Haptics from "expo-haptics";

export default function Login() {
  const { login } = useAuth();

  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const BASE_URL = "https://app.srichaitanyacrm.com";
  // const BASE_URL = "http://202.65.141.178:8025";


  const shakeAnim = useRef(new Animated.Value(0)).current;

  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);  

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleLogin = async () => {
    setUsernameError(null);
    setPasswordError(null);

    if (!username || !password) {
      if (!username) setUsernameError("Username is required");
      if (!password) setPasswordError("Password is required");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/user/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
      let data: any = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      if (!response.ok) {
        if (data?.username) {
          setUsernameError(data.username[0]);
          usernameRef.current?.focus();
          triggerShake();
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error
          );
        }
        if (data?.password) {
          setPasswordError(data.password[0]);
          passwordRef.current?.focus();
          triggerShake();
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error
          );
        }
        if (!data?.username && !data?.password) {
          Alert.alert("Login Failed", "Invalid username or password");
        }
        return;
      }
      await login(data);
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>CRM Login</Text>

        {/* Username */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <TextInput
            ref={usernameRef}
            placeholder="Username"
            placeholderTextColor={theme.colors.textTertiary}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError(null);
            }}
            style={[
              styles.input,
              usernameError && { borderColor: theme.colors.danger }
            ]}
            autoCapitalize="none"
          />
        </Animated.View>

        {usernameError && (
          <Text style={styles.errorText}>{usernameError}</Text>
        )}

        {/* Password */}
        <Animated.View
          style={[
            { transform: [{ translateX: shakeAnim }] }
          ]}
        >
          <View
            style={[
              styles.passwordContainer,
              passwordError && { borderColor: theme.colors.danger }
            ]}
          >
            <TextInput
              ref={passwordRef}
              placeholder="Password"
              placeholderTextColor={theme.colors.textTertiary}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError(null);
              }}
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
        </Animated.View>

        {passwordError && (
          <Text style={styles.errorText}>{passwordError}</Text>
        )}
        {/* Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
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
    errorText: {
      color: "#ff4d4f",
      fontSize: 13,
      marginTop: -10,
      marginBottom: 10
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