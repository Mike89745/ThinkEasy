import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { PostResponse } from '@/api/model/postResponse';
import { useEventCallback } from '@/hooks/useEventCallback';
import { formatDate } from '@/utils/dateUtils';

interface PostCardProps {
  post: PostResponse;
  onPress: (postId: string) => void;
  onAuthorPress?: (authorId: string) => void;
  testIdPrefix?: string;
  testIdKey?: string;
}

export function PostCard({
  post,
  onPress,
  onAuthorPress,
  testIdPrefix = 'post-card',
  testIdKey = post.id,
}: PostCardProps) {
  const handlePress = useEventCallback(() => {
    onPress(post.id);
  });

  const handleAuthorPress = useEventCallback(() => {
    onAuthorPress?.(post.authorId);
  });

  const containerTestId = `${testIdPrefix}-container-${testIdKey}`;
  const authorTestId = `${testIdPrefix}-author-${testIdKey}`;

  return (
    <Pressable
      onPress={handlePress}
      testID={containerTestId}
      className="mb-3 rounded-xl bg-background-50 p-4 active:opacity-80"
    >
      <View className="mb-2 flex-row items-center justify-between">
        <Text
          className="flex-1 text-lg font-bold text-typography-900"
          testID={`post-card-title-${post.id}`}
          numberOfLines={1}
        >
          {post.title}
        </Text>
        {post.published && (
          <View className="ml-2 rounded-full bg-success-100 px-2 py-0.5">
            <Text className="text-xs font-medium text-success-700">Published</Text>
          </View>
        )}
      </View>

      <Text className="mb-3 text-sm text-typography-600" numberOfLines={3}>
        {post.content}
      </Text>

      <View className="flex-row items-center justify-between">
        <Pressable onPress={handleAuthorPress} hitSlop={8} testID={authorTestId}>
          <Text className="text-xs font-medium text-primary-500">
            Author: {post.authorId.slice(0, 8)}...
          </Text>
        </Pressable>
        <Text className="text-xs text-typography-400">{formatDate(post.createdAt)}</Text>
      </View>
    </Pressable>
  );
}
