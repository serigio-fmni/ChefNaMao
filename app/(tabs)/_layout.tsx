import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import { Image } from 'expo-image';
import { Colors, Typography, Shadows, Radius } from '../../constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const tabBarStyle = {
    height: Platform.select({
      ios: insets.bottom + 64,
      android: insets.bottom + 64,
      default: 72,
    }),
    paddingTop: 8,
    paddingBottom: Platform.select({
      ios: insets.bottom + 8,
      android: insets.bottom + 8,
      default: 10,
    }),
    paddingHorizontal: 8,
    backgroundColor: Colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.lg,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSubtle,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: Typography.weights.semibold,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Descobrir',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notebook"
        options={{
          title: 'Caderno',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="menu-book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chef Chat',
          tabBarIcon: ({ focused }) => (
            <View style={{
              width: 28, height: 28,
              borderRadius: Radius.sm,
              overflow: 'hidden',
              borderWidth: focused ? 1.5 : 0,
              borderColor: Colors.primary,
            }}>
              <Image
                source={require('../../assets/images/okcheff-logo.png')}
                style={{ width: 28, height: 28 }}
                contentFit="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
