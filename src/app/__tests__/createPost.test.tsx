import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import CreatePostScreen from '../(posts)/createPost';

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
    replace: mockReplace,
  }),
  useLocalSearchParams: () => ({}),
}));

const mockMutate = jest.fn();
const mockUsePostsControllerCreate = jest.fn();
jest.mock('../../api/posts/posts', () => ({
  usePostsControllerCreate: jest.fn((...args: unknown[]) =>
    (mockUsePostsControllerCreate as (...a: unknown[]) => unknown)(...args)
  ),
  getPostsControllerGetAllPostsQueryKey: () => ['/posts'],
}));

jest.mock('toastify-react-native', () => ({
  Toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('CreatePostScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePostsControllerCreate.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('renders the form fields', () => {
    render(<CreatePostScreen />, { wrapper: createWrapper() });

    expect(screen.getByText('Create New Post')).toBeTruthy();
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Content')).toBeTruthy();
    expect(screen.getByText('Create Post')).toBeTruthy();
  });

  it('renders title and content placeholders', () => {
    render(<CreatePostScreen />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Enter post title')).toBeTruthy();
    expect(screen.getByPlaceholderText('Write your post content...')).toBeTruthy();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<CreatePostScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByText('Create Post'));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText('Content is required')).toBeTruthy();
    });
  });

  it('calls mutate with form data when valid', async () => {
    render(<CreatePostScreen />, { wrapper: createWrapper() });

    fireEvent.changeText(screen.getByPlaceholderText('Enter post title'), 'My New Post');
    fireEvent.changeText(
      screen.getByPlaceholderText('Write your post content...'),
      'Some content here'
    );

    fireEvent.press(screen.getByText('Create Post'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        data: { title: 'My New Post', content: 'Some content here' },
      });
    });
  });

  it('shows spinner and disabled button while submission is pending', () => {
    mockUsePostsControllerCreate.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    render(<CreatePostScreen />, { wrapper: createWrapper() });

    expect(screen.getByText('Creating...')).toBeTruthy();
    const buttonEl = screen.getByTestId('create-post-submit-button') as unknown as {
      props: { accessibilityState?: { disabled?: boolean } };
    };
    expect(buttonEl.props.accessibilityState?.disabled).toBe(true);
  });
});
