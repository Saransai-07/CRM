import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';

import SegmentControl from '@/src/components/SegmentTabs';
import { Theme, useThemedStyles } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AddTicketScreen from '../Screens/TicketsScreen/AddTicketScreen';
import CallLogScreen from '../Screens/TicketsScreen/CallLogScreen';
import StudentDetailsScreen from '../Screens/TicketsScreen/StudentDetailsScreen';
import TicketLogScreen from '../Screens/TicketsScreen/TicketLogScreen';
// import useCall from './CallingFunctions';
import { Option } from '@/src/components/DropDown';
import { useAuth } from '@/src/context/AuthContext';
import { getToken } from '@/src/lib/secureStorage';
import CallBottomSheet from './CallBottomSheet';
import useCall from './hooks/UseCall';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const StudentInstance = () => {
  const { id, scsnumber } = useLocalSearchParams();
  const { logout, BASE_URL } = useAuth();
  const { initiateCall, state } = useCall();

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const styles = useThemedStyles(createStyles);

  const insets = useSafeAreaInsets();
  // const { initiateCall, loading, callEnded } = useCall();
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [studentContactNumbersData, setStudentContactNumberData] = useState<Option[] | []>([]);

  const [callModalVisible, setCallModalVisible] = useState(false);
  const [customNumber, setCustomNumber] = useState<number | string>();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const Tab = createMaterialTopTabNavigator();

  const openLink = async (url: string) => {
    if (!mobileNumber) {
      Alert.alert("No number available");
      return;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken("ACCESS_TOKEN");
      if (!token) {
        await logout();
        router.replace("/(auth)/Login");
        return;
      }
      setAccessToken(token);
    };
    loadToken();
  }, []);

  useEffect(() => {
    fetchmobilenumber();
    fetchStudentContactNumber();
  }, [accessToken, scsnumber, id,])

  const fetchmobilenumber = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(
        `${BASE_URL}/students/get_student_phone_number/?scsnumber=${scsnumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setMobileNumber('')
        Alert.alert("No number available");
        return;
      }
      setMobileNumber(json.mobile_number)
    } catch (error) {
      console.log("Fetch Mobile Number Error:", error);
    }
  };


  const fetchStudentContactNumber = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(
        `${BASE_URL}/students/student_contact_number_dropdown/?student_id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await response.json();
      if (!response.ok) {
        console.log("Mobile number Error:", json);
        setStudentContactNumberData([])
        throw new Error("Students contacts failed");
      }
      setStudentContactNumberData(
        json.map((item: any) => ({
          value: item.id,
          label: item.label,
        }))
      )
    } catch (error) {
      console.log("Fetch Mobile Number Error:", error);
      Alert.alert("Error", "Failed to load Mobile Number");
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#1C1C1E", paddingBottom: 60 + insets.bottom }}>
      <Tab.Navigator
        screenOptions={{
          lazy: true,
          lazyPreloadDistance: 1,
          swipeEnabled: true,

          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#2C2C2E",
            margin: 6,
            borderRadius: 12,
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#00ff6a",
            height: "85%",
            margin: 4,
            borderRadius: 10,
          },
        }}
      >
        <Tab.Screen
          name="studentList"
          component={StudentDetailsScreen}
          options={{ title: "Student" }}
        />

        <Tab.Screen
          name="addTicket"
          component={AddTicketScreen}
          options={{ title: "Ticket" }}
        />

        <Tab.Screen
          name="ticketlog"
          component={TicketLogScreen}
          options={{ title: "Ticket Log" }}
        />

        <Tab.Screen
          name="callLog"
          component={CallLogScreen}
          options={{ title: "Call Log" }}
        />
      </Tab.Navigator>
      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <View style={[styles.glassBar, styles.wrapper]}>

          {/* <BlurView intensity={60} tint="dark" style={styles.glassBar}> */}
          <Pressable onPress={() => setSheetVisible(true)}>
            <Ionicons name="call" size={20} color="#25D366" />
            <Text style={styles.label}>
              {state === "calling" ? "Calling..." :
                state === "ended" ? "Ended" : "Call"}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            onPress={() => openLink(`https://wa.me/${mobileNumber}`)}

          >
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={styles.label}>WhatsApp</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            onPress={() => openLink(`sms:${mobileNumber}`)}
          >
            <Ionicons name="chatbubble" size={20} color="#0A84FF" />
            <Text style={styles.label}>Message</Text>
          </Pressable>

        </View>
      </SafeAreaView >

      <CallBottomSheet
        visible={sheetVisible}
        options={studentContactNumbersData}
        onClose={() => { setSheetVisible(false) }}
        onCall={(selectedId: number | null) => {
          initiateCall(String(scsnumber), selectedId ?? undefined);
        }}
      />
    </View >
  )
}

export default StudentInstance


const createStyles = (t: Theme) =>
  StyleSheet.create({
    safeArea: {
      position: "absolute",
      bottom: -10,
      width: "100%",
      alignItems: "center",

    },

    wrapper: {
      width: "95%",
      paddingBottom: 6,
    },

    glassBar: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",

      borderRadius: 28,
      paddingVertical: 14,

      backgroundColor: "rgba(255,255,255,0.08)",

      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.15)",

      // iOS shadow (floating feel)
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },

      // Android elevation
      elevation: 10,
    },

    actionBtn: {
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },

    label: {
      fontSize: 12,
      color: "#E5E5EA",
      fontWeight: "500",
    },

    pressed: {
      transform: [{ scale: 0.92 }],
      opacity: 0.7,
    },
  });

