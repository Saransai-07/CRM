import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import {FontAwesome, Fontisto, Ionicons, } from '@expo/vector-icons'


const Tabslayout = () => {

  return (
    <Tabs screenOptions={{
        tabBarStyle: { backgroundColor: '#000000', borderTopColor: 'rgba(255,255,255,0.1)' },
        tabBarActiveTintColor: '#44eb2e',
        tabBarInactiveTintColor: 'rgba(235,235,245,0.6)',
        headerStyle: { backgroundColor: '#000000' },
        headerTintColor: '#FFFFFF',
    }}>
        <Tabs.Screen
            name='DashBoard' 
            options={{
                headerShown : false,
                title:'Dashboard',
                tabBarIcon : ({ color }) => 
                    <Ionicons name="home" color={color} size={24} />
            }}
        />
        <Tabs.Screen
            name='CVR' 
            options={{
                title:'Inputs & CVR ',
                tabBarIcon : ({ color }) => 
                    <Ionicons name="documents" color={color} size={24} />
            }}
        />
        <Tabs.Screen
            name='Sales' 
            options={{
                title:'Sales',
                tabBarIcon : ({ color }) => 
                    <Fontisto name="shopping-sale" color={color} size={24} />
            }}
        />
        <Tabs.Screen
            name='settings' 
            options={{
                title:'Settings',
                tabBarIcon : ({ color }) => 
                    <Ionicons name="settings" color={color} size={24} />
            }}
        />
        <Tabs.Screen 
            name='UserData'
            options={{
                title : "Profile",
                headerShown : false,
                tabBarIcon : ({color}) =>
                    <FontAwesome name="user" color={color} size={24} />
            }}
        />

    </Tabs>
)
}

export default Tabslayout
