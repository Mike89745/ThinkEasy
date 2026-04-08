import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import PostsScreen from '../(posts)/posts';
import type { PostResponse } from '../../api/model/postResponse';

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock('jotai', () => ({
  useAtomValue: jest.fn(() => ({
    accessToken: 'token',
    refreshToken: 'refresh-token',
    isAuthenticated: true,
    isLoading: false,
  })),
}));

const mockLogout = jest.fn();
jest.mock('../../store/auth', () => ({
  authAtom: {},
  useLogout: () => mockLogout,
}));

jest.mock('toastify-react-native', () => ({
  Toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockPosts: PostResponse[] = [
  {
    id: '1',
    title: 'First Post',
    content: 'Content of the first post',
    published: true,
    authorId: 'author-1',
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'A different topic here',
    published: false,
    authorId: 'author-2',
    createdAt: '2025-01-11T10:00:00.000Z',
    updatedAt: '2025-01-11T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'React Native Guide',
    content: 'Building mobile apps with React Native',
    published: true,
    authorId: 'author-1',
    createdAt: '2025-01-12T10:00:00.000Z',
    updatedAt: '2025-01-12T10:00:00.000Z',
  },
];

const mockRefetch = jest.fn();
const mockUsePostsControllerGetAllPosts = jest.fn();

jest.mock('../../api/posts/posts', () => ({
  usePostsControllerGetAllPosts: jest.fn((...args: unknown[]) =>
    (mockUsePostsControllerGetAllPosts as (...a: unknown[]) => unknown)(...args)
  ),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('PostsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePostsControllerGetAllPosts.mockReturnValue({
      data: { data: mockPosts, status: 200 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isRefetching: false,
    });
    const { useAtomValue } = jest.requireMock('jotai') as unknown as { useAtomValue: jest.Mock };
    useAtomValue.mockReturnValue({
      accessToken: 'token',
      refreshToken: 'refresh-token',
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('shows loading indicator while fetching', () => {
    mockUsePostsControllerGetAllPosts.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isRefetching: false,
    });

    render(<PostsScreen />, { wrapper: createWrapper() });

    expect(screen.getByTestId('posts-loading')).toBeTruthy();
  });

  it('shows error state when fetch fails', () => {
    mockUsePostsControllerGetAllPosts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Network error'),
      refetch: mockRefetch,
      isRefetching: false,
    });

    render(<PostsScreen />, { wrapper: createWrapper() });

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('Network error')).toBeTruthy();
  });

  it('calls refetch when retry button is pressed on error', () => {
    mockUsePostsControllerGetAllPosts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: null,
      refetch: mockRefetch,
      isRefetching: false,
    });

    render(<PostsScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByText('Retry'));

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('renders the posts list', () => {
    render(<PostsScreen />, { wrapper: createWrapper() });

    expect(screen.getByText('First Post')).toBeTruthy();
    expect(screen.getByText('Second Post')).toBeTruthy();
    expect(screen.getByText('React Native Guide')).toBeTruthy();
  });

  it('shows empty state when there are no posts', () => {
    mockUsePostsControllerGetAllPosts.mockReturnValue({
      data: { data: [], status: 200 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
      isRefetching: false,
    });

    render(<PostsScreen />, { wrapper: createWrapper() });

    expect(screen.getByTestId('posts-empty')).toBeTruthy();
    expect(screen.getByText('No posts yet')).toBeTruthy();
  });

  it('renders the search input', () => {
    render(<PostsScreen />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText('Search by title or content...')).toBeTruthy();
  });

  it('filters posts by title when searching', () => {
    render(<PostsScreen />, { wrapper: createWrapper() });

    fireEvent.changeText(
      screen.getByPlaceholderText('Search by title or content...'),
      'React Native'
    );

    expect(screen.getByText('React Native Guide')).toBeTruthy();
    expect(screen.queryByText('First Post')).toBeNull();
    expect(screen.queryByText('Second Post')).toBeNull();
  });

  it('filters posts by content when searching', () => {
    render(<PostsScreen />, { wrapper: createWrapper() });

    fireEvent.changeText(
      screen.getByPlaceholderText('Search by title or content...'),
      'different topic'
    );

    expect(screen.getByText('Second Post')).toBeTruthy();
    expect(screen.queryByText('First Post')).toBeNull();
  });

  it('shows empty state when search has no results', () => {
    render(<PostsScreen />, { wrapper: createWrapper() });

    fireEvent.changeText(
      screen.getByPlaceholderText('Search by title or content...'),
      'nonexistent query xyz'
    );

    expect(screen.getByText('No posts match your search')).toBeTruthy();
  });

  it('navigates to post detail on press', () => {
    render(<PostsScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByText('First Post'));

    expect(mockPush).toHaveBeenCalledWith('/post?postId=1');
  });

  it('navigates to user posts when author link is pressed', () => {
    render(<PostsScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByTestId('posts-post-card-author-0'));

    expect(mockPush).toHaveBeenCalledWith('/userPosts?userId=author-1');
  });

  it('navigates to create post screen', () => {
    render(<PostsScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByText('+ New'));

    expect(mockPush).toHaveBeenCalledWith('/createPost');
  });

  it('calls logout when logout button is pressed', () => {
    render(<PostsScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByTestId('posts-logout-button'));

    expect(mockLogout).toHaveBeenCalled();
  });

  it('shows login and signup buttons when not authenticated', () => {
    const { useAtomValue } = jest.requireMock('jotai') as unknown as { useAtomValue: jest.Mock };
    useAtomValue.mockReturnValue({ isAuthenticated: false });

    render(<PostsScreen />, { wrapper: createWrapper() });

    expect(screen.getByTestId('posts-login-button')).toBeTruthy();
    expect(screen.getByTestId('posts-signup-button')).toBeTruthy();
    expect(screen.queryByTestId('posts-new-button')).toBeNull();
    expect(screen.queryByTestId('posts-logout-button')).toBeNull();
  });

  it('navigates to login screen when login button is pressed', () => {
    const { useAtomValue } = jest.requireMock('jotai') as unknown as { useAtomValue: jest.Mock };
    useAtomValue.mockReturnValue({ isAuthenticated: false });

    render(<PostsScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByTestId('posts-login-button'));

    expect(mockPush).toHaveBeenCalledWith('/Login');
  });

  it('navigates to signup screen when signup button is pressed', () => {
    const { useAtomValue } = jest.requireMock('jotai') as unknown as { useAtomValue: jest.Mock };
    useAtomValue.mockReturnValue({ isAuthenticated: false });

    render(<PostsScreen />, { wrapper: createWrapper() });

    fireEvent.press(screen.getByTestId('posts-signup-button'));

    expect(mockPush).toHaveBeenCalledWith('/Signup');
  });
});
