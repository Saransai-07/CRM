import { View, Text, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { SceneMap, TabView } from 'react-native-tab-view';
import SegmentTabs from '@/src/components/SegmentTabs';
import AgentCallSummaryScreen from '../Screens/ReportsScreen/AgentCallSummaryScreen';
import SalesScreen from '../Screens/ReportsScreen/SalesScreen';
import CallLogsScreen from '../Screens/ReportsScreen/CallLogsScreen';

const Reports = () => {

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "agentcallsummary", title: "📞 Call Summary" },
    { key: "sales", title: "💲Sales" },
    { key: "calllogs", title: "☎️ Call Logs" },
  ]);

  const renderScene = SceneMap({
    agentcallsummary: AgentCallSummaryScreen,
    sales: SalesScreen,
    calllogs: CallLogsScreen,
  });


  return (
    <View style={{ flex: 1, backgroundColor: "#1C1C1E", }}>

      <SegmentTabs
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

export default Reports