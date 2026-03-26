import { AuthProvider } from "@/src/context/AuthContext";
import { ThemeProvider } from "@/src/theme";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { AuthProvider, useAuth } from "../context/AuthContext";
// import RootNavigator from "./(auth)/RootNavigator";

export default function RootLayout() {
  return (
    <GestureHandlerRootView >
      <AuthProvider>
        <ThemeProvider>
          <StatusBar barStyle={"light-content"} />
          <Stack screenOptions={{
            headerStyle: { backgroundColor: '#000000' },
            headerTintColor: '#FFFFFF',
          }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name='(tabs)' options={{ headerShown: false, headerTitle: 'Home' }} />
            <Stack.Screen name="Screens/AttendanceSummaryScreen" options={{ headerShown: false, presentation: 'modal', }} />
            <Stack.Screen name="AgentReports/[id]" options={{ headerTitle: 'Agent Reports' }} />
            <Stack.Screen name="BranchCVR/[id]" options={{ headerTitle: 'Branch Reports' }} />
            <Stack.Screen name="Screens/ReportsScreen/AgentwiseCallSummary/[id]" options={{ headerTitle: 'Agent Call Logs' }} />
            <Stack.Screen name="Tickets/StudentInstance" options={{ headerTitle: 'Ticket' }} />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}
