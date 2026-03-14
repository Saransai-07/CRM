import { useAuth } from "@/src/context/AuthContext";
import { UserProfileData } from "@/src/Interface/InterfaceData";
import { getToken } from "@/src/lib/secureStorage";
import { useTheme, useThemedStyles, type Theme } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const UserData = () => {
  const router = useRouter();
  const { authState, logout, BASE_URL } = useAuth();
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  const user = authState.user;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);


  const profileImageUri = userProfile?.photo
      ?`${BASE_URL}/${userProfile.photo}`
    : null;

  const options = React.useMemo(() => ({
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }), [accessToken]);

  
  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken("ACCESS_TOKEN");

      if (!token) {
        await logout();
        router.replace("/(auth)/Login");
        return;
      }
      setAccessToken(token)
      setLoading(false);
    };
    
    loadToken();
  }, []);

  useEffect(()=>{
    if (!accessToken) return;
    fetchUserProfile();
  },[accessToken])

  
   // User Profile 
   const fetchUserProfile = async () =>{
    try{
      const response = await fetch(`${BASE_URL}/user/add_update_userprofile_by_user/`,options);
      const data = await response.json();
 
      if (!response.ok) {
        if (response.status === 403) {
          await logout();
          router.replace("/(auth)/Login");
          return;
        }
        console.error(data?.message);
        throw new Error(data?.message || "Failed to fetch Weekly sales");
      }
      setUserProfile(data.data);
    }catch(error : any){
      Alert.alert("ERROR", error.message || " Weekly sales Data not shown");
    }
  };


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
            {profileImageUri ? (
              <Image
                source={{ uri: profileImageUri }}
                style={styles.avatarCircle}
              />
            ) : (
              <Ionicons
              name="person-circle"
              size={80}
              color={theme.colors.textSecondary}
            />
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Login details</Text>
          {/* {user && typeof user === "object" ? (
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
          )} */}
          
          {userProfile ? (
            <>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>username</Text>
                <Text style={styles.rowValue} numberOfLines={1}>
                  {userProfile.username ?? "-"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>phone number</Text>
                <Text style={styles.rowValue} numberOfLines={1}>
                  {userProfile.phone_number ?? "-"}
                </Text>
              </View>
              <View style={[styles.row, styles.rowLast]}>
                <Text style={styles.rowLabel}>is idealtime</Text>
                <Text style={styles.rowValue} numberOfLines={1}>
                  {String(userProfile.is_idealtime ?? false)}
                </Text>
              </View>
            </>
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
      color: t.colors.primary,
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
    rowLast: {
      borderBottomWidth: 0,
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
