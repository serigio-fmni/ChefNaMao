import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { AppProvider } from '../contexts/AppContext';
import { useApp } from '../hooks/useApp';
import { Colors } from '../constants/theme';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthLoading } = useApp();

  if (isAuthLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen
              name="recipe/[id]"
              options={{
                headerShown: false,
                presentation: 'card',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="search"
              options={{
                headerShown: false,
                presentation: 'card',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
        </AuthGate>
      </AppProvider>
    </SafeAreaProvider>
  );
}
