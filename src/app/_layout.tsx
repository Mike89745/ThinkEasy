import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import ToastManager from 'toastify-react-native';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/src/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="system">
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(posts)/posts" options={{ headerShown: false }} />
            <Stack.Screen
              name="(posts)/post"
              options={{ title: 'Post Detail', headerShown: true }}
            />
            <Stack.Screen
              name="(posts)/createPost"
              options={{ title: 'Create Post', headerShown: true, presentation: 'modal' }}
            />
            <Stack.Screen
              name="(posts)/userPosts"
              options={{ title: 'User Posts', headerShown: true }}
            />
            <Stack.Screen
              name="Login"
              options={{ headerShown: false, presentation: 'transparentModal', animation: 'fade' }}
            />
            <Stack.Screen
              name="Signup"
              options={{ headerShown: false, presentation: 'transparentModal', animation: 'fade' }}
            />
          </Stack>
          <ToastManager />
        </ThemeProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
