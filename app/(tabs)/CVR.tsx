import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

import SegmentTabs from "@/src/components/SegmentTabs";
import CVRReports from "../Screens/CVRReports";
import AgentInputs from "../Screens/AgentInputs";
import BranchCVR from "../Screens/BranchCVR";

export default function AgentsScreen() {

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "cvr", title: "CVR" },
    { key: "agentInputs", title: "Agent Inputs" },
    { key: "branchCvr", title: "Branch CVR" },
  ]);

  const renderScene = SceneMap({
    cvr: CVRReports,
    agentInputs: AgentInputs,
    branchCvr: BranchCVR,
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
  );
}