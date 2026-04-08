import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { ModalWrapper } from '../ModalWrapper';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe('ModalWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    render(
      <ModalWrapper>
        <Text>Child Content</Text>
      </ModalWrapper>
    );

    expect(screen.getByText('Child Content')).toBeTruthy();
  });

  it('calls onClose when backdrop is pressed', () => {
    const onClose = jest.fn();
    render(
      <ModalWrapper onClose={onClose}>
        <Text>Content</Text>
      </ModalWrapper>
    );

    fireEvent.press(screen.getByTestId('modal-backdrop'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('calls router.back() when backdrop is pressed and onClose is not provided', () => {
    render(
      <ModalWrapper>
        <Text>Content</Text>
      </ModalWrapper>
    );

    fireEvent.press(screen.getByTestId('modal-backdrop'));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
