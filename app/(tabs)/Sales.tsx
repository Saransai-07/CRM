import { View, Text, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { SceneMap, TabView } from 'react-native-tab-view';
import SegmentTabs from '@/src/components/SegmentTabs';
import StudentsListScreen from '../Screens/StudentDetails/StudentsListScreen';
import FollowUps from '../Screens/StudentDetails/FollowUps';
import DailedScreen from '../Screens/StudentDetails/DailedScreen';


const StudentDetails = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "studentList", title: "🧑‍🎓 Student List" },
    { key: "followup", title: "📲 Follow Ups" },
    { key: "dailed", title: "☑️ Dailed" },
  ]);

  const renderScene = SceneMap({
    studentList: StudentsListScreen,
    followup: FollowUps,
    dailed: DailedScreen,
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

export default StudentDetails