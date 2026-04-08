import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import type { PostResponse } from '../../api/model/postResponse';
import { PostCard } from '../PostCard';

const mockPost: PostResponse = {
  id: 'post-1',
  title: 'Test Post Title',
  content: 'This is the content of the test post that should be displayed.',
  published: true,
  authorId: 'author-1234567890',
  createdAt: '2025-01-15T10:00:00.000Z',
  updatedAt: '2025-01-15T12:00:00.000Z',
};

describe('PostCard', () => {
  it('renders post title and content', () => {
    render(<PostCard post={mockPost} onPress={jest.fn()} onAuthorPress={jest.fn()} />);

    expect(screen.getByText('Test Post Title')).toBeTruthy();
    expect(
      screen.getByText('This is the content of the test post that should be displayed.')
    ).toBeTruthy();
  });

  it('shows published badge when post is published', () => {
    render(<PostCard post={mockPost} onPress={jest.fn()} onAuthorPress={jest.fn()} />);

    expect(screen.getByText('Published')).toBeTruthy();
  });

  it('does not show published badge when post is not published', () => {
    const draftPost = { ...mockPost, published: false };
    render(<PostCard post={draftPost} onPress={jest.fn()} onAuthorPress={jest.fn()} />);

    expect(screen.queryByText('Published')).toBeNull();
  });

  it('calls onPress when card is tapped', () => {
    const onPress = jest.fn();
    render(<PostCard post={mockPost} onPress={onPress} onAuthorPress={jest.fn()} />);

    fireEvent.press(screen.getByText('Test Post Title'));
    expect(onPress).toHaveBeenCalledWith('post-1');
  });

  it('calls onAuthorPress when author text is tapped', () => {
    const onAuthorPress = jest.fn();
    render(<PostCard post={mockPost} onPress={jest.fn()} onAuthorPress={onAuthorPress} />);

    fireEvent.press(screen.getByText(/Author:/));
    expect(onAuthorPress).toHaveBeenCalledWith('author-1234567890');
  });

  it('displays truncated author ID', () => {
    render(<PostCard post={mockPost} onPress={jest.fn()} onAuthorPress={jest.fn()} />);

    expect(screen.getByText('Author: author-1...')).toBeTruthy();
  });

  it('displays formatted date', () => {
    render(<PostCard post={mockPost} onPress={jest.fn()} onAuthorPress={jest.fn()} />);

    expect(screen.getByText(/Jan 15, 2025/)).toBeTruthy();
  });

  it('does not crash when onAuthorPress is not provided', () => {
    render(<PostCard post={mockPost} onPress={jest.fn()} />);

    fireEvent.press(screen.getByText(/Author:/));
  });

  it('uses custom testIdPrefix for testIDs', () => {
    render(<PostCard post={mockPost} onPress={jest.fn()} testIdPrefix="custom-prefix" />);

    expect(screen.getByTestId('custom-prefix-container-post-1')).toBeTruthy();
    expect(screen.getByTestId('custom-prefix-author-post-1')).toBeTruthy();
  });

  it('uses custom testIdKey for testIDs', () => {
    render(
      <PostCard
        post={mockPost}
        onPress={jest.fn()}
        testIdPrefix="post-card"
        testIdKey="custom-key"
      />
    );

    expect(screen.getByTestId('post-card-container-custom-key')).toBeTruthy();
    expect(screen.getByTestId('post-card-author-custom-key')).toBeTruthy();
  });
});
