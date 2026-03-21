import { View, Text, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SceneMap, TabView } from 'react-native-tab-view';

import SegmentControl from '@/src/components/SegmentTabs';
import StudentDetailsScreen from '../Screens/TicketsScreen/StudentDetailsScreen';
import AddTicketScreen from '../Screens/TicketsScreen/AddTicketScreen';
import TicketLogScreen from '../Screens/TicketsScreen/TicketLogScreen';
import CallLogScreen from '../Screens/TicketsScreen/CallLogScreen';
const StudentInstance = () => {
  const { id } = useLocalSearchParams();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "studentList", title: " Student" },
    { key: "addTicket", title: "Ticket" },
    { key: "ticketlog", title: "Ticket Log" },
    { key: "callLog", title: " Call Log" },
  ]);

  const renderScene = SceneMap({
    studentList: StudentDetailsScreen,
    addTicket : AddTicketScreen ,
    ticketlog: TicketLogScreen,
    callLog: CallLogScreen,
  });


  return (
    <View style={{ flex: 1, backgroundColor: "#1C1C1E", }}>
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

    </View>
  )
}

export default StudentInstance