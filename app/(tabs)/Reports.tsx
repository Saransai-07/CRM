

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import AgentCallSummaryScreen from "../Screens/ReportsScreen/AgentCallSummaryScreen";
import CallLogsScreen from "../Screens/ReportsScreen/CallLogsScreen";
import SalesScreen from "../Screens/ReportsScreen/SalesScreen";

const Tab = createMaterialTopTabNavigator();

const routes = [
  {
    name: "sales",
    title: "💲 Sales",
    component: SalesScreen,
  },
  {
    name: "callSummary",
    title: "📞Call Summary",
    component: AgentCallSummaryScreen,
  },
  {
    name: "callLogs",
    title: "☎️ Call Logs",
    component: CallLogsScreen,
  },
];

export default function Reports() {
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

  label: {
    textTransform: "none",
  },

  indicator: {
    backgroundColor: "#00ff6a",
    height: "85%",
    margin: 4,
    borderRadius: 12,
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  labelText: {
    fontSize: 14,
    fontWeight: "600",
  },

  badge: {
    marginLeft: 6,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
  },
});