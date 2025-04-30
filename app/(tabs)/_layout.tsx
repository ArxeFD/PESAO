import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Dumbbell as Barbell, Calendar, ChartLine as LineChart, Plus, User } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Redirect } from 'expo-router';

export default function TabLayout() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'web' ? 16 : insets.bottom;

  // If not authenticated, redirect to login
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          height: 60 + bottomInset,
          paddingBottom: bottomInset,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : theme.colors.card,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? 
          <BlurView 
            intensity={80} 
            tint="dark" 
            style={StyleSheet.absoluteFill} 
          /> : null
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Barbell size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-workout"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={styles.newWorkoutButton}>
              <Plus size={24} color="#fff" strokeWidth={3} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <LineChart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  newWorkoutButton: {
    width: 52,
    height: 52,
    backgroundColor: theme.colors.primary,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 6,
  },
});