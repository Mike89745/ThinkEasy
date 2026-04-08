import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useInitAuth } from '@/store/auth';

export default function IndexScreen() {
  const router = useRouter();
  const { isLoading } = useInitAuth();

  useEffect(() => {
    if (isLoading) return;
    router.replace('/posts');
  }, [isLoading, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
