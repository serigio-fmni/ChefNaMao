import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../contexts/AppContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="recipe/[id]"
            options={{
              headerShown: false,
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
