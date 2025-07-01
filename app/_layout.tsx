import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} >
        <Stack.Screen name="(modals)/profileModal" options={{
          presentation: 'modal'
        }} />
        <Stack.Screen name="(modals)/walletModal" options={{
          presentation: 'modal'
        }} />
        <Stack.Screen name="(modals)/TransactionModal" options={{
          presentation: 'modal'
        }} />
      </Stack>
    </AuthProvider>
  );
}
