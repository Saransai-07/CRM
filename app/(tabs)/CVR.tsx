import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import AgentInputs from "../Screens/Inputs&CVR/AgentInputs";
import BranchCVR from "../Screens/Inputs&CVR/BranchCVR";
import CVRReports from "../Screens/Inputs&CVR/CVRReports";

const Tab = createMaterialTopTabNavigator();

export default function AgentsScreen() {
  const routes = [
    {
      name: "cvr",
      title: "CVR",
      component: CVRReports,
    },
    {
      name: "agentInputs",
      title: "Agent Inputs",
      component: AgentInputs,
    },
    {
      name: "branchCvr",
      title: "Branch CVR",
      component: BranchCVR,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#1C1C1E" }}>
      <Tab.Navigator
        screenOptions={{
          lazy: true,
          lazyPreloadDistance: 1,
          swipeEnabled: true,
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.indicator,
          tabBarItemStyle: styles.tabItem,
          tabBarActiveTintColor: "#000",   
          tabBarInactiveTintColor: "#fff", 
          tabBarPressColor: "transparent",
          tabBarPressOpacity: 1,
        }}
      >
        {routes.map((route) => (
          <Tab.Screen
            key={route.name}
            name={route.name}
            component={route.component}
            options={{
              tabBarLabel: ({ color }) => (
                <TabLabel label={route.title} color={color} />
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
};

const TabLabel = ({ label, color }: any) => {
  return (
    <View style={styles.labelContainer}>
      <Text style={[styles.labelText, { color }]}>{label}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#2C2C2E",
    margin: 6,
    borderRadius: 12,
    elevation: 0,
  },

  tabItem: {
    padding: 0,
  },

  indicator: {
    backgroundColor: "#00ff6a",
    height: "85%",
    margin: 4,
    borderRadius: 10,
  },

  labelContainer: {
    alignItems: "center",
  },

  labelText: {
    fontSize: 14,
    fontWeight: "600",
  },
});