import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import Signup from '../Signup';

const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
  }),
}));

const mockMutate = jest.fn();
const mockSignupMutation: {
  onSuccess?: (res: { data: { accessToken: string; refreshToken: string } }) => Promise<void>;
  onError?: (err: unknown) => void;
} = {};

jest.mock('../../api/auth/auth', () => ({
  useAuthControllerSignup: (config?: { mutation?: typeof mockSignupMutation }) => {
    if (config?.mutation) {
      Object.assign(mockSignupMutation, config.mutation);
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

const mockToast = jest.requireMock('toastify-react-native') as unknown as {
  Toast: { success: jest.Mock; error: jest.Mock };
};
const { Toast: mockToastInstance } = mockToast;

describe('Signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<Signup />);

    expect(screen.getByTestId('auth-title')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your first name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your last name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(screen.getByTestId('signup-submit-button')).toBeTruthy();
  });

  it('shows required validation errors on empty submit', async () => {
    render(<Signup />);

    fireEvent.press(screen.getByTestId('signup-submit-button'));

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeTruthy();
      expect(screen.getByText('Last name is required')).toBeTruthy();
      expect(screen.getByText('Email is required')).toBeTruthy();
      expect(screen.getByText('Password is required')).toBeTruthy();
    });
  });

  it('shows password min-length validation error', async () => {
    render(<Signup />);

    fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), 'abc');
    fireEvent.press(screen.getByTestId('signup-submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
    });
  });

  it('shows email format validation error for invalid email', async () => {
    render(<Signup />);

    fireEvent.changeText(screen.getByPlaceholderText('Enter your email'), 'bad-email');
    fireEvent.press(screen.getByTestId('signup-submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email address')).toBeTruthy();
    });
  });

  it('calls mutate with all field values on valid submit', async () => {
    render(<Signup />);

    fireEvent.changeText(screen.getByPlaceholderText('Enter your first name'), 'John');
    fireEvent.changeText(screen.getByPlaceholderText('Enter your last name'), 'Doe');
    fireEvent.changeText(screen.getByPlaceholderText('Enter your email'), 'john@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(screen.getByTestId('signup-submit-button'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        data: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      });
    });
  });

  it('stores tokens, shows success toast and navigates back on success', async () => {
    mockSetAuthTokens.mockResolvedValue(undefined);
    render(<Signup />);

    await act(async () => {
      await mockSignupMutation.onSuccess?.({
        data: { accessToken: 'access-tok', refreshToken: 'refresh-tok' },
      });
    });

    expect(mockSetAuthTokens).toHaveBeenCalledWith('access-tok', 'refresh-tok');
    expect(mockToastInstance.success).toHaveBeenCalledWith(
      'Account created successfully! Logging you in...'
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it('shows error toast on signup failure', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Signup />);

    act(() => {
      mockSignupMutation.onError?.(new Error('Conflict'));
    });

    expect(mockToastInstance.error).toHaveBeenCalledWith('Signup failed. Please try again.');
  });

  it('calls router.back() when back button is pressed', () => {
    render(<Signup />);

    fireEvent.press(screen.getByTestId('signup-back-button'));

    expect(mockBack).toHaveBeenCalled();
  });

  it('navigates to Login screen when footer action is pressed', () => {
    render(<Signup />);

    fireEvent.press(screen.getByTestId('auth-footer-action'));

    expect(mockReplace).toHaveBeenCalledWith('/Login');
  });
});
