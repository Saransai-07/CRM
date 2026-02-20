import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useThemedStyles, useTheme, type Theme } from "@/src/theme";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  const BASE_URL = "http://202.65.141.178:8025";

    
  const handleLogin = async (): Promise<void> => {
    if (!username || !password) {
      Alert.alert("Error", "Username and password are required");
      return;
    }

    setLoading(true);
    try {
    //   const response = await loginUser({ username, password });
    //     await login(response); // Global auth update 
    // //   console.log("LOGIN SUCCESS:", response);
    // //   Alert.alert("Success", "Login successful");
      const response = await fetch(`${BASE_URL}/user/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();
      await login(data);

    if (!response.ok) {
      console.error(JSON.stringify(data, null, 2))
      throw new Error(data?.message || "Login failed");
    }

    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.message || "Invalid username or password"
      );
      console.error(JSON.stringify(error?.message, null, 2))
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor={theme.colors.textTertiary}
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={theme.colors.textTertiary}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

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
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.colors.background,
      justifyContent: "center",
      padding: 20,
    },
    title: {
      ...t.typography.title1,
      color: t.colors.textPrimary,
      textAlign: "center",
      marginBottom: 30,
    },
    input: {
      backgroundColor: t.colors.surface,
      borderWidth: 1,
      borderColor: t.colors.border,
      padding: 16,
      borderRadius: t.radius.md,
      marginBottom: 16,
      fontSize: 17,
      color: t.colors.textPrimary,
    },
    button: {
      backgroundColor: t.colors.accentMuted,
      borderWidth: 1,
      borderColor: t.colors.accent,
      padding: 16,
      borderRadius: t.radius.md,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: {
      color: t.colors.accent,
      fontSize: 17,
      fontWeight: "600",
    },
  });
