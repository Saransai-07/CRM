import { AttendanceActivityCard } from "@/src/components/AttendanceActivityCard";
import { MetricCard, } from "@/src/components/MetricCard";
import { TodayTopPerformers, TopPerformers } from "@/src/components/TopPerformers";
import {  WeeklyConversionChart, WeeklySalesChart } from "@/src/components/WeeklySalesChart";
import { useAuth } from "@/src/context/AuthContext";
import { AttendanceResponse, DataItem, MetricCardProps, TopPerformer  } from "@/src/Interface/InterfaceData";
import { getToken, saveToken } from "@/src/lib/secureStorage";
import { useTheme, useThemedStyles, type Theme } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DashBoard = () => {
  const router = useRouter();
  const { logout, authState, BASE_URL } = useAuth();
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  const displayName =  "Account";

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<AttendanceResponse | null> (null);
  const [cardsData, setCardsData] = useState<MetricCardProps[]> ([]);
  const [weeklyData, setWeeklysales] = useState<DataItem[]> ([]);
  const [WeeklyConversions, setWeeklyConverstions] = useState<DataItem[]> ([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [todayTopPerformers, setTodayTopPerformers] = useState<TopPerformer[]>([]);

  
  
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
  
  
  const loadDashboard = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchagentAttendance(),
        fetchCardsData(),
        fetchWeeklySales(),
        fetchWeeklyConverstions(),
        fetchOverallTopPerformers(),
        fetchTodayTopPerformers(),
        
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
      loadDashboard();
  }, [accessToken]);

  const onRefresh = async () =>{
    if(!accessToken) return;
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }
  
  //  Attendance Report 
  const fetchagentAttendance = async () =>{
   try{
     const response = await fetch(`${BASE_URL}/new_dashboards/attendance_dashboard/`,options);
     const data = await response.json();

     if (!response.ok) {
       if (response.status === 403) {
         await logout();
         router.replace("/(auth)/Login");
        return;
      }
       console.error(data);
       throw new Error(data?.message || "Failed to fetch attendance");
     }
     setAttendance(data);
   }catch(error : any){
     Alert.alert("ERROR", error.message || "Attendance Data not shown");
   }
  };

  //  Cards Data 
  const fetchCardsData = async () =>{
    try{
      const response = await fetch(`${BASE_URL}/new_dashboards/dashboard_cards/`,options);
      const data = await response.json();
 
      if (!response.ok) {
        if (response.status === 403) {
          await logout();
          router.replace("/(auth)/Login");
          return;
        }
        console.error(data?.message);
        throw new Error(data?.message || "Failed to fetch Cards Data");
      }
      setCardsData(data);
    }catch(error : any){
      Alert.alert("ERROR", error.message || "Cards Data not shown");
    }
   };

  //  Weekly Sales 
  const fetchWeeklySales = async () =>{
    try{
      const response = await fetch(`${BASE_URL}/new_dashboards/wizklub_sales_graph_dashboard/`,options);
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
      setWeeklysales(data);
    }catch(error : any){
      Alert.alert("ERROR", error.message || " Weekly sales Data not shown");
    }
  };

  //  Weekly Converstions 
  const fetchWeeklyConverstions = async () =>{
    try{
      const response = await fetch(`${BASE_URL}/new_dashboards/wizklub_conversation_time_graph_dashboard/`,options);
      const data = await response.json();
 
      if (!response.ok) {
        if (response.status === 403) {
          await logout();
          router.replace("/(auth)/Login");
          return;
        }
        console.error(data?.message);
        throw new Error(data?.message || "Failed to fetch Weekly Converstions");
      }
      setWeeklyConverstions(data);
    }catch(error : any){
      Alert.alert("ERROR", error.message || " Weekly Converstions Data not shown");
    }
  };

  //  Top Performers 
  const fetchOverallTopPerformers = async () =>{
    try{
      const response = await fetch(`${BASE_URL}/new_dashboards/wizklub_overall_top_three_performers/`,options);
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
      setTopPerformers(data);
    }catch(error : any){
      Alert.alert("ERROR", error.message || " Weekly sales Data not shown");
    }
  };

   // Today Top Performers 
  const fetchTodayTopPerformers = async () =>{
    try{
      const response = await fetch(`${BASE_URL}/new_dashboards/wizklub_today_top_three_performers/`,options);
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
      setTodayTopPerformers(data);
    }catch(error : any){
      Alert.alert("ERROR", error.message || " Weekly sales Data not shown");
    }
  };
  
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity
          style={styles.profileIconButton}
          onPress={() => router.push("/(tabs)/UserData")}
          activeOpacity={0.8}
          accessibilityLabel="Account / login details"
        >
          <View style={styles.profileIconCircle}>
            <Ionicons
              name="person-circle"
              size={36}
              color={theme.colors.textSecondary}
            />
          </View>
          {displayName !== "Account" && (
            <Text style={styles.profileLabel} numberOfLines={1}>
              {displayName}
            </Text>
          )}
        </TouchableOpacity>
      </View>
{/*=========================== DashBoard ================================================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} 
          />
        }
      >
        <View>
          {attendance && (
            <AttendanceActivityCard
              total_agents={attendance.total_agents}
              no_of_present_agents={attendance.no_of_present_agents}
              no_of_absent_agents={attendance.no_of_absent_agents}
              date={attendance.date}
              is_admin={attendance.is_admin}
            />
          )}
         
      </View>      
        <View style={styles.card1}> 
          {cardsData.length > 0 && (
            cardsData.map((item: any) => (
              <MetricCard
                key={item.id}
                heading={item.heading}
                headingValue={item.heading_value || 0}
                subHeading1={item.sub_heading_1}
                subHeading1Value={item.sub_heading_1_value || 0}
                subHeading2={item.sub_heading_2}
                subHeading2Value={item.sub_heading_2_value || 0}
                logo={item.logo}
              />
            )))}
          </View>
        <View>
          <WeeklySalesChart data={weeklyData} />
        </View>
        
        <View>
          <WeeklyConversionChart data={WeeklyConversions} />
        </View>
        
        <View>
          <TodayTopPerformers
            data={todayTopPerformers}
          />
        </View>
        
        <View>
          {/* <TopPerformers
            data={topPerformers}
            onShowMore={() => router.push('/(tabs)/settings')}
          /> */}
          <TopPerformers
            data={topPerformers}
            onShowMore={() => router.push('/(tabs)/settings')}
          />
        </View>

      </ScrollView>
    </View>
  );
};

const createStyles = (t: Theme) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      backgroundColor: t.colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      backgroundColor: t.colors.background,
      padding: 20,
    },
    card1 : {
      flexDirection: "row",
      flexWrap : 'wrap',
      // alignItems: "center",
      justifyContent: "space-between",
      // margin : 
      // marginTop : 8
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: Platform.OS === "ios" ? 56 : 48,
      marginBottom: 24,
      paddingRight: 4,
    },
    title: {
      ...t.typography.largeTitle,
      color: t.colors.textPrimary,
    },
    profileIconButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    profileIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: t.colors.surfaceElevated,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    profileLabel: {
      maxWidth: 120,
      fontSize: 13,
      fontWeight: "600",
      color: t.colors.textSecondary,
    },
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radius.lg,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: t.colors.border,
    },
    cardLabel: {
      ...t.typography.footnote,
      fontWeight: "600",
      color: t.colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    tokenText: {
      fontSize: 15,
      color: t.colors.textPrimary,
      fontWeight: "500",
    },
    logoutButton: {
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

export default DashBoard;
