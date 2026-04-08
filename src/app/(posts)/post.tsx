import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { usePostsControllerPost } from '@/api/posts/posts';
import { useEventCallback } from '@/hooks/useEventCallback';
import { authAtom } from '@/store/auth';
import { formatDate } from '@/utils/dateUtils';
export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAtomValue(authAtom);

  const { data, isLoading, isError, error, refetch } = usePostsControllerPost(postId ?? '');

  const navigateToUserPosts = useEventCallback(() => {
    if (!data) return;
    if (!isAuthenticated) {
      router.push('/Login');
      return;
    }
    router.push(`/userPosts?userId=${data.data.authorId}`);
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <ActivityIndicator size="large" testID="post-detail-loading" />
        <Text className="mt-2 text-typography-500">Loading post...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0 px-6">
        <Text className="mb-2 text-lg font-bold text-error-600">Failed to load post</Text>
        <Text className="mb-4 text-center text-sm text-typography-500">
          {error instanceof Error ? error.message : 'Something went wrong'}
        </Text>
        <Pressable onPress={() => void refetch()} className="rounded-lg bg-primary-500 px-6 py-3">
          <Text className="font-semibold text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

  const post = data.data;

  return (
    <ScrollView className="flex-1 bg-background-0" contentContainerStyle={{ padding: 24 }}>
      <Text className="mb-2 text-2xl font-bold text-typography-900" testID="post-detail-title">
        {post.title}
      </Text>

      <View className="mb-4 flex-row items-center gap-3">
        {post.published && (
          <View className="rounded-full bg-success-100 px-3 py-1" testID="post-detail-status">
            <Text className="text-xs font-medium text-success-700">Published</Text>
          </View>
        )}
        {!post.published && (
          <View className="rounded-full bg-warning-100 px-3 py-1" testID="post-detail-status">
            <Text className="text-xs font-medium text-warning-700">Draft</Text>
          </View>
        )}
      </View>

      <Text className="mb-6 text-base leading-6 text-typography-700" testID="post-detail-content">
        {post.content}
      </Text>

      <View className="border-t border-outline-100 pt-4">
        <Text className="mb-1 text-xs text-typography-400">
          Created: {formatDate(post.createdAt)}
        </Text>
        <Text className="mb-3 text-xs text-typography-400">
          Updated: {formatDate(post.updatedAt)}
        </Text>
        <Pressable onPress={navigateToUserPosts} hitSlop={8} testID="post-detail-author-link">
          <Text className="text-sm font-medium text-primary-500">
            {isAuthenticated ? 'View all posts by this author →' : 'Login to view author posts →'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
