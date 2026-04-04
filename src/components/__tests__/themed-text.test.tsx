import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { ThemedText } from '@/components/themed-text';

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    text: '#000000',
    background: '#ffffff',
    tint: '#0a7ea4',
  }),
}));

describe('ThemedText', () => {
  it('renders the provided text', () => {
    render(<ThemedText>Hello world</ThemedText>);
    expect(screen.getByText('Hello world')).toBeTruthy();
  });

  it('applies title type styles', () => {
    render(<ThemedText type="title">Title text</ThemedText>);
    expect(screen.getByText('Title text')).toBeTruthy();
  });
});
