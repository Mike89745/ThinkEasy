import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import PostDetailScreen from '../(posts)/post';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ postId: 'post-1' }),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('jotai', () => ({
  useAtomValue: jest.fn(() => ({
    isAuthenticated: true,
  })),
}));

jest.mock('../../store/auth', () => ({
  authAtom: {},
}));

const mockRefetch = jest.fn();
const mockUsePostsControllerPost = jest.fn();

jest.mock('../../api/posts/posts', () => ({
  usePostsControllerPost: jest.fn((...args: unknown[]) =>
    (mockUsePostsControllerPost as (...a: unknown[]) => unknown)(...args)
  ),
}));

const mockPost = {
  id: 'post-1',
  title: 'Test Post Title',
  content: 'This is the post content.',
  published: true,
  authorId: 'author-id-123456789',
  createdAt: '2025-01-15T10:00:00.000Z',
  updatedAt: '2025-01-16T12:00:00.000Z',
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('PostDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePostsControllerPost.mockReturnValue({
      data: { data: mockPost, status: 200 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });
    const { useAtomValue } = jest.requireMock('jotai') as unknown as { useAtomValue: jest.Mock };
    useAtomValue.mockReturnValue({ isAuthenticated: true });
  });

  it('shows loading indicator while fetching', () => {
    mockUsePostsControllerPost.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<PostDetailScreen />, { wrapper: createWrapper() });

    expect(screen.getByTestId('post-detail-loading')).toBeTruthy();
  });

  it('shows error state when fetch fails', () => {
    mockUsePostsControllerPost.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Network error'),
      refetch: mockRefetch,
    });

    render(<PostDetailScreen />, { wrapper: createWrapper() });

    expect(screen.getByText('Failed to load post')).toBeTruthy();
    expect(screen.getByText('Network error')).toBeTruthy();
  });

  it('calls refetch when retry button is pressed', () => {
    mockUsePostsControllerPost.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: null,
      refetch: mockRefetch,
    });

    render(<PostDetailScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByText('Retry'));

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('renders post title and content', () => {
    render(<PostDetailScreen />, { wrapper: createWrapper() });

    expect(screen.getByTestId('post-detail-title')).toBeTruthy();
    expect(screen.getByText('Test Post Title')).toBeTruthy();
    expect(screen.getByTestId('post-detail-content')).toBeTruthy();
    expect(screen.getByText('This is the post content.')).toBeTruthy();
  });

  it('shows published badge when post is published', () => {
    render(<PostDetailScreen />, { wrapper: createWrapper() });

    expect(screen.getByTestId('post-detail-status')).toBeTruthy();
    expect(screen.getByText('Published')).toBeTruthy();
  });

  it('shows draft badge when post is not published', () => {
    mockUsePostsControllerPost.mockReturnValue({
      data: { data: { ...mockPost, published: false }, status: 200 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<PostDetailScreen />, { wrapper: createWrapper() });

    expect(screen.getByText('Draft')).toBeTruthy();
  });

  it('shows "View all posts by this author" link when authenticated', () => {
    render(<PostDetailScreen />, { wrapper: createWrapper() });

    expect(screen.getByText('View all posts by this author →')).toBeTruthy();
  });

  it('shows "Login to view author posts" link when not authenticated', () => {
    const { useAtomValue } = jest.requireMock('jotai') as unknown as { useAtomValue: jest.Mock };
    useAtomValue.mockReturnValue({ isAuthenticated: false });

    render(<PostDetailScreen />, { wrapper: createWrapper() });

    expect(screen.getByText('Login to view author posts →')).toBeTruthy();
  });

  it('navigates to userPosts when author link is pressed while authenticated', () => {
    render(<PostDetailScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByTestId('post-detail-author-link'));

    expect(mockPush).toHaveBeenCalledWith('/userPosts?userId=author-id-123456789');
  });

  it('navigates to Login when author link is pressed while not authenticated', () => {
    const { useAtomValue } = jest.requireMock('jotai') as unknown as { useAtomValue: jest.Mock };
    useAtomValue.mockReturnValue({ isAuthenticated: false });

    render(<PostDetailScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByTestId('post-detail-author-link'));

    expect(mockPush).toHaveBeenCalledWith('/Login');
  });
});
