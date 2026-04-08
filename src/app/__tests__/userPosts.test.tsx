import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import UserPostsScreen from '../(posts)/userPosts';
import type { PostResponse } from '../../api/model/postResponse';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ userId: 'user-abc-123456789' }),
  useRouter: () => ({ push: mockPush }),
}));

const mockRefetch = jest.fn();
const mockUsePostsControllerUserPosts = jest.fn();

jest.mock('../../api/posts/posts', () => ({
  usePostsControllerUserPosts: jest.fn(
    (...args: unknown[]) => mockUsePostsControllerUserPosts(...args) as unknown
  ),
}));

const mockPosts: PostResponse[] = [
  {
    id: 'post-1',
    title: 'First Post',
    content: 'Content of first post',
    published: true,
    authorId: 'user-abc-123456789',
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z',
  },
  {
    id: 'post-2',
    title: 'Second Post',
    content: 'Content of second post',
    published: false,
    authorId: 'user-abc-123456789',
    createdAt: '2025-01-11T10:00:00.000Z',
    updatedAt: '2025-01-11T10:00:00.000Z',
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('UserPostsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePostsControllerUserPosts.mockReturnValue({
      data: { data: mockPosts, status: 200 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isRefetching: false,
    });
  });

  it('shows loading indicator while fetching', () => {
    mockUsePostsControllerUserPosts.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isRefetching: false,
    });

    render(<UserPostsScreen />, { wrapper: createWrapper() });

    expect(screen.getByTestId('user-posts-loading')).toBeTruthy();
  });

  it('shows error state when fetch fails', () => {
    mockUsePostsControllerUserPosts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Network error'),
      refetch: mockRefetch,
      isRefetching: false,
    });

    render(<UserPostsScreen />, { wrapper: createWrapper() });

    expect(screen.getByText('Failed to load posts')).toBeTruthy();
    expect(screen.getByText('Network error')).toBeTruthy();
  });

  it('calls refetch when retry button is pressed', () => {
    mockUsePostsControllerUserPosts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: null,
      refetch: mockRefetch,
      isRefetching: false,
    });

    render(<UserPostsScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByText('Retry'));

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('renders the list of posts', () => {
    render(<UserPostsScreen />, { wrapper: createWrapper() });

    expect(screen.getByText('First Post')).toBeTruthy();
    expect(screen.getByText('Second Post')).toBeTruthy();
  });

  it('shows empty state when user has no posts', () => {
    mockUsePostsControllerUserPosts.mockReturnValue({
      data: { data: [], status: 200 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isRefetching: false,
    });

    render(<UserPostsScreen />, { wrapper: createWrapper() });

    expect(screen.getByTestId('user-posts-empty')).toBeTruthy();
    expect(screen.getByText('This user has no posts yet')).toBeTruthy();
  });

  it('displays truncated user ID in the header', () => {
    render(<UserPostsScreen />, { wrapper: createWrapper() });

    // userId 'user-abc-123456789'.slice(0, 12) === 'user-abc-123'
    expect(screen.getByText('By: user-abc-123...')).toBeTruthy();
  });

  it('navigates to post detail when a post card is pressed', () => {
    render(<UserPostsScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByText('First Post'));

    expect(mockPush).toHaveBeenCalledWith('/post?postId=post-1');
  });
});
