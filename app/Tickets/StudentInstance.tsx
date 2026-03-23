import { View, Text, useWindowDimensions, Linking, TouchableOpacity, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SceneMap, TabView } from 'react-native-tab-view';

import StudentDetailsScreen from '../Screens/TicketsScreen/StudentDetailsScreen';
import AddTicketScreen from '../Screens/TicketsScreen/AddTicketScreen';
import TicketLogScreen from '../Screens/TicketsScreen/TicketLogScreen';
import CallLogScreen from '../Screens/TicketsScreen/CallLogScreen';
import SegmentControl from '@/src/components/SegmentTabs';
import { Ionicons } from '@expo/vector-icons';
import { Theme, useThemedStyles } from '@/src/theme';
import { BlurView } from 'expo-blur'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import  useCall  from './CallingFunctions';

const StudentInstance = () => {
  const { id, scsnumber } = useLocalSearchParams();
  
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const styles = useThemedStyles(createStyles);

  const insets = useSafeAreaInsets();
    const { initiateCall, loading, callEnded } = useCall();



  const [routes] = useState([
    { key: "studentList", title: " Student" },
    { key: "addTicket", title: "Ticket" },
    { key: "ticketlog", title: "Ticket Log" },
    { key: "callLog", title: " Call Log" },
  ]);

  const renderScene = SceneMap({
    studentList: StudentDetailsScreen,
    addTicket: AddTicketScreen,
    ticketlog: TicketLogScreen,
    callLog: CallLogScreen,
  });

  const phoneNumber = "9876543210"; // replace with API data

  // const handleCall = () => {
  //   Linking.openURL(`tel:${phoneNumber}`);
  // };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  const handleSMS = () => {
    Linking.openURL(`sms:${phoneNumber}`);
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#1C1C1E", paddingBottom: 60 + insets.bottom }}>
      <SegmentControl
        routes={routes}
        index={index}
        setIndex={setIndex}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled
        renderTabBar={() => null}
      />
      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <View style={[styles.glassBar, styles.wrapper]}>

          {/* <BlurView intensity={60} tint="dark" style={styles.glassBar}> */}

            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.pressed
              ]}
              onPress={()=>initiateCall(String(scsnumber), "123")}
            >
              <Ionicons name="call" size={20} color="#4CD964" />
              <Text style={styles.label}>Call</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.pressed
              ]}
              onPress={handleWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <Text style={styles.label}>WhatsApp</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.pressed
              ]}
              onPress={handleSMS}
            >
              <Ionicons name="chatbubble" size={20} color="#0A84FF" />
              <Text style={styles.label}>Message</Text>
            </Pressable>

          {/* </BlurView> */}

        </View>
      </SafeAreaView>

    </View>
  )
}

export default StudentInstance


const createStyles = (t: Theme) =>
  StyleSheet.create({
    safeArea: {
      position: "absolute",
      bottom: -10,
      width: "100%",
    },
    
    wrapper: {
      // paddingHorizontal: 16,
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