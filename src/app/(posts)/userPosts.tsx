import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { PostResponse } from '@/api/model/postResponse';
import { usePostsControllerUserPosts } from '@/api/posts/posts';
import { PostCard } from '@/components/PostCard';

export default function UserPostsScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch, isRefetching } = usePostsControllerUserPosts(
    userId ?? ''
  );

  const posts: PostResponse[] = data?.data ?? [];

  const handlePostPress = (postId: string) => {
    router.push(`/post?postId=${postId}`);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <ActivityIndicator size="large" testID="user-posts-loading" />
        <Text className="mt-2 text-typography-500">Loading user posts...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0 px-6">
        <Text className="mb-2 text-lg font-bold text-error-600">Failed to load posts</Text>
        <Text className="mb-4 text-center text-sm text-typography-500">
          {error instanceof Error ? error.message : 'Something went wrong'}
        </Text>
        <Pressable onPress={() => void refetch()} className="rounded-lg bg-primary-500 px-6 py-3">
          <Text className="font-semibold text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background-0">
      <View className="px-4 pb-2 pt-3">
        <Text className="text-2xl font-bold text-typography-900">User Posts</Text>
        <Text className="text-sm text-typography-400" testID="user-posts-user-id">
          By: {userId?.slice(0, 12)}...
        </Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PostCard
            post={item}
            onPress={() => handlePostPress(item.id)}
            testIdPrefix="user-posts-post-card"
            testIdKey={String(index)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        testID="user-posts-list"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
        ListEmptyComponent={
          <View className="items-center py-12" testID="user-posts-empty">
            <Text className="text-lg text-typography-400">This user has no posts yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
