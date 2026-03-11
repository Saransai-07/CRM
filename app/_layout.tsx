import { AuthProvider } from "@/src/context/AuthContext";
import { ThemeProvider } from "@/src/theme";
import { Stack } from "expo-router";
// import { AuthProvider, useAuth } from "../context/AuthContext";
// import RootNavigator from "./(auth)/RootNavigator";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#FFFFFF',
        }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name='(tabs)' options={{ headerShown: false, headerTitle : 'Home' }} />
          <Stack.Screen name="Screens/AttendanceSummaryScreen" options={{ headerShown: false, presentation: 'modal', }} />
          <Stack.Screen name="AgentReports/[id]" options={{ headerTitle : 'Agent Reports' }} />
          <Stack.Screen name="BranchCVR/[id]" options={{ headerTitle : 'Branch Reports' }} />
          <Stack.Screen name="Screens/ReportsScreen/AgentwiseCallSummary/[id]" options={{ headerTitle : 'Agent Call Logs' }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  )
}
