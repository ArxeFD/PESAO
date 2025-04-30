import { Stack } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const { user } = useAuth();

  // If user is authenticated, redirect to main app
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}