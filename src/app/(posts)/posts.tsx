import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { PostResponse } from '@/api/model/postResponse';
import { usePostsControllerGetAllPosts } from '@/api/posts/posts';
import { PostCard } from '@/components/PostCard';
import { Input, InputField } from '@/components/ui/input';
import { useEventCallback } from '@/hooks/useEventCallback';
import { authAtom, useLogout } from '@/store/auth';

export default function PostsScreen() {
  const router = useRouter();
  const logout = useLogout();
  const { isAuthenticated } = useAtomValue(authAtom);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, error, refetch, isRefetching } =
    usePostsControllerGetAllPosts();

  const filteredPosts = useMemo(() => {
    const posts: PostResponse[] = data?.data ?? [];

    if (!searchQuery.trim()) return [...posts].reverse();
    const query = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query)
    );
  }, [data?.data, searchQuery]);

  const handlePostPress = useEventCallback((postId: string) => {
    router.push(`/post?postId=${postId}`);
  });

  const handleAuthorPress = useEventCallback((authorId: string) => {
    router.push(`/userPosts?userId=${authorId}`);
  });

  const handleCreatePost = useEventCallback(() => {
    router.push('/createPost');
  });

  const handleOpenLogin = useEventCallback(() => {
    router.push('/Login');
  });

  const handleOpenSignup = useEventCallback(() => {
    router.push('/Signup');
  });

  const renderPostCard = useEventCallback(
    ({ item, index }: { item: PostResponse; index: number }) => (
      <PostCard
        post={item}
        onPress={handlePostPress}
        onAuthorPress={handleAuthorPress}
        testIdPrefix="posts-post-card"
        testIdKey={String(index)}
      />
    )
  );

  const getPostKey = useEventCallback((item: PostResponse) => item.id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0">
        <ActivityIndicator size="large" testID="posts-loading" />
        <Text className="mt-2 text-typography-500">Loading posts...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background-0 px-6">
        <Text className="mb-2 text-lg font-bold text-error-600">Something went wrong</Text>
        <Text className="mb-4 text-center text-sm text-typography-500">
          {error instanceof Error ? error.message : 'Failed to load posts'}
        </Text>
        <Pressable onPress={() => void refetch()} className="rounded-lg bg-primary-500 px-6 py-3">
          <Text className="font-semibold text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom', 'top']} style={{ flex: 1 }} className="bg-background-0">
      <View className="px-4 pb-2 pt-3">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-typography-900">Posts</Text>
          <View className="flex-row gap-3">
            {isAuthenticated ? (
              <>
                <Pressable
                  onPress={handleCreatePost}
                  testID="posts-new-button"
                  className="rounded-lg bg-primary-500 px-4 py-2"
                >
                  <Text className="font-semibold text-white dark:text-typography-100">+ New</Text>
                </Pressable>
                <Pressable
                  onPress={() => void logout()}
                  testID="posts-logout-button"
                  className="rounded-lg bg-background-100 px-4 py-2"
                >
                  <Text className="font-medium text-typography-900">Logout</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  onPress={handleOpenLogin}
                  testID="posts-login-button"
                  className="rounded-lg bg-primary-500 px-4 py-2 dark:bg-primary-700"
                >
                  <Text className="font-semibold text-white dark:text-typography-100">Login</Text>
                </Pressable>
                <Pressable
                  onPress={handleOpenSignup}
                  testID="posts-signup-button"
                  className="rounded-lg bg-background-100 px-4 py-2"
                >
                  <Text className="font-medium text-typography-900">Sign Up</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
        <Input variant="rounded" size="lg">
          <InputField
            placeholder="Search by title or content..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            testID="posts-search-input"
          />
        </Input>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={getPostKey}
        renderItem={renderPostCard}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        testID="posts-list"
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
        ListEmptyComponent={
          <View className="items-center py-12" testID="posts-empty">
            <Text className="text-lg text-typography-400">
              {searchQuery ? 'No posts match your search' : 'No posts yet'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
