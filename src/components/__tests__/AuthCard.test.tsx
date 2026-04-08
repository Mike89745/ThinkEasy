import { fireEvent, render, screen } from '@testing-library/react-native';
import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Text } from 'react-native';

import { AuthCard, AuthCardProps } from '../AuthCard';

const MockIcon = (() => null) as unknown as LucideIcon;

const defaultProps: AuthCardProps = {
  title: 'Welcome Back',
  subtitle: 'Sign in to continue',
  accentColor: '#2563eb',
  accentSoftColor: 'rgba(147, 197, 253, 0.35)',
  Icon: MockIcon,
  footerText: "Don't have an account?",
  footerActionText: 'Sign Up',
  onFooterPress: jest.fn(),
  children: <Text>Form Content</Text>,
};

describe('AuthCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and subtitle', () => {
    render(<AuthCard {...defaultProps} />);

    expect(screen.getByTestId('auth-title')).toBeTruthy();
    expect(screen.getByText('Welcome Back')).toBeTruthy();
    expect(screen.getByText('Sign in to continue')).toBeTruthy();
  });

  it('renders footer text and action text', () => {
    render(<AuthCard {...defaultProps} />);

    expect(screen.getByText(/Don't have an account\?/)).toBeTruthy();
    expect(screen.getByText('Sign Up')).toBeTruthy();
  });

  it('calls onFooterPress when footer action is pressed', () => {
    const onFooterPress = jest.fn();
    render(<AuthCard {...defaultProps} onFooterPress={onFooterPress} />);

    fireEvent.press(screen.getByTestId('auth-footer-action'));

    expect(onFooterPress).toHaveBeenCalledTimes(1);
  });

  it('renders children', () => {
    render(<AuthCard {...defaultProps} />);

    expect(screen.getByText('Form Content')).toBeTruthy();
  });

  it('renders headerContent when provided', () => {
    render(<AuthCard {...defaultProps} headerContent={<Text>Header Content</Text>} />);

    expect(screen.getByText('Header Content')).toBeTruthy();
  });

  it('does not render headerContent when not provided', () => {
    render(<AuthCard {...defaultProps} />);

    expect(screen.queryByText('Header Content')).toBeNull();
  });

  it('renders correctly as modal', () => {
    render(<AuthCard {...defaultProps} asModal={true} />);

    expect(screen.getByText('Welcome Back')).toBeTruthy();
    expect(screen.getByText('Form Content')).toBeTruthy();
  });

  it('renders correctly as full screen (default)', () => {
    render(<AuthCard {...defaultProps} asModal={false} />);

    expect(screen.getByText('Welcome Back')).toBeTruthy();
    expect(screen.getByText('Form Content')).toBeTruthy();
  });
});
