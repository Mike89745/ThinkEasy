import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import Login from '../Login';

const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
  }),
}));

const mockMutate = jest.fn();
const mockLoginMutation: {
  onSuccess?: (res: { data: { accessToken: string; refreshToken: string } }) => Promise<void>;
  onError?: (err: unknown) => void;
} = {};

jest.mock('../../api/auth/auth', () => ({
  useAuthControllerLogin: (config?: { mutation?: typeof mockLoginMutation }) => {
    if (config?.mutation) {
      Object.assign(mockLoginMutation, config.mutation);
    }
    return { mutate: mockMutate, isPending: false };
  },
}));

const mockSetAuthTokens = jest.fn();
jest.mock('../../store/auth', () => ({
  authAtom: {},
  useSetAuthTokens: () => mockSetAuthTokens,
}));

jest.mock('toastify-react-native', () => ({
  Toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const { Toast: mockToast } = jest.requireMock('toastify-react-native') as unknown as {
  Toast: { success: jest.Mock; error: jest.Mock };
};

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title, email and password fields', () => {
    render(<Login />);

    expect(screen.getByTestId('auth-title')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(screen.getByTestId('login-submit-button')).toBeTruthy();
  });

  it('shows required validation errors on empty submit', async () => {
    render(<Login />);

    fireEvent.press(screen.getByTestId('login-submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
      expect(screen.getByText('Password is required')).toBeTruthy();
    });
  });

  it('shows email format validation error for invalid email', async () => {
    render(<Login />);

    fireEvent.changeText(screen.getByPlaceholderText('Enter your email'), 'not-an-email');
    fireEvent.press(screen.getByTestId('login-submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email address')).toBeTruthy();
    });
  });

  it('shows password min-length validation error', async () => {
    render(<Login />);

    fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), '123');
    fireEvent.press(screen.getByTestId('login-submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('calls mutate with correct credentials on valid submit', async () => {
    render(<Login />);

    fireEvent.changeText(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(screen.getByTestId('login-submit-button'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        data: { email: 'test@example.com', password: 'password123' },
      });
    });
  });

  it('stores tokens, shows success toast and navigates back on success', async () => {
    mockSetAuthTokens.mockResolvedValue(undefined);
    render(<Login />);

    await act(async () => {
      await mockLoginMutation.onSuccess?.({
        data: { accessToken: 'access-token', refreshToken: 'refresh-token' },
      });
    });

    expect(mockSetAuthTokens).toHaveBeenCalledWith('access-token', 'refresh-token');
    expect(mockToast.success).toHaveBeenCalledWith('Logged in successfully!');
    expect(mockBack).toHaveBeenCalled();
  });

  it('shows error toast on login failure', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Login />);

    act(() => {
      mockLoginMutation.onError?.(new Error('Unauthorized'));
    });

    expect(mockToast.error).toHaveBeenCalledWith('Invalid email or password');
  });

  it('navigates to Signup screen when footer action is pressed', () => {
    render(<Login />);

    fireEvent.press(screen.getByTestId('auth-footer-action'));

    expect(mockReplace).toHaveBeenCalledWith('/Signup');
  });
});
