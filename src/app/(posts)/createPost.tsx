import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Toast } from 'toastify-react-native';

import type { CreatePostInput } from '@/api/model/createPostInput';
import { getPostsControllerGetAllPostsQueryKey, usePostsControllerCreate } from '@/api/posts/posts';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import { Input, InputField } from '@/components/ui/input';
import { useEventCallback } from '@/hooks/useEventCallback';
import { Controller, type Control } from 'react-hook-form';

function ContentInput({ control }: { control: Control<CreatePostInput> }) {
  return (
    <Controller
      control={control}
      name="content"
      rules={{ required: 'Content is required' }}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View>
          <Text className="mb-1 text-sm text-typography-500">Content</Text>
          <Input variant="outline" size="xl" className="h-40">
            <InputField
              placeholder="Write your post content..."
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              multiline
              textAlignVertical="top"
              style={{ minHeight: 140 }}
              testID="create-post-content-input"
            />
          </Input>
          {error && <Text className="mt-1 text-sm text-error-600">{error.message}</Text>}
        </View>
      )}
    />
  );
}

export default function CreatePostScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { control, handleSubmit } = useForm<CreatePostInput>({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const { mutate, isPending } = usePostsControllerCreate({
    mutation: {
      onSuccess: () => {
        Toast.success('Post created successfully!');
        void queryClient.invalidateQueries({
          queryKey: getPostsControllerGetAllPostsQueryKey(),
        });
        router.back();
      },
      onError: (err) => {
        console.error('Create post failed', err);
        Toast.error('Failed to create post. Please try again.');
      },
    },
  });

  const onSubmit = useEventCallback(() => {
    void handleSubmit((data) => {
      mutate({ data });
    })();
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-0"
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-2 text-2xl font-bold text-typography-900">Create New Post</Text>

        <FormInput
          control={control}
          name="title"
          label="Title"
          placeholder="Enter post title"
          testID="create-post-title-input"
          rules={{ required: 'Title is required' }}
        />

        <ContentInput control={control} />

        <Button
          size="xl"
          action="primary"
          onPress={onSubmit}
          isDisabled={isPending}
          className="mt-4"
          testID="create-post-submit-button"
        >
          {isPending && <ButtonSpinner className="mr-2" />}
          <ButtonText>{isPending ? 'Creating...' : 'Create Post'}</ButtonText>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
