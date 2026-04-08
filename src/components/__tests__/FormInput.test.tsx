import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { useEventCallback } from '@/hooks/useEventCallback';
import { FormInput } from '../ui/FormInput';

type TestFormValues = {
  email: string;
};

function TestFormInput(props: { label?: string; placeholder?: string; testID?: string }) {
  const { control } = useForm<TestFormValues>({ defaultValues: { email: '' } });
  return <FormInput control={control} name="email" {...props} />;
}

function FormWithValidation() {
  const { control, handleSubmit } = useForm<TestFormValues>({ defaultValues: { email: '' } });

  const onSubmit = useEventCallback(() => {
    void handleSubmit(() => {})();
  });

  return (
    <View>
      <FormInput control={control} name="email" rules={{ required: 'Email is required' }} />
      <Pressable onPress={onSubmit} testID="submit-btn">
        <Text>Submit</Text>
      </Pressable>
    </View>
  );
}

describe('FormInput', () => {
  it('renders label when provided', () => {
    render(<TestFormInput label="Email Address" />);

    expect(screen.getByText('Email Address')).toBeTruthy();
  });

  it('does not render label when not provided', () => {
    render(<TestFormInput />);

    expect(screen.queryByText('Email Address')).toBeNull();
  });

  it('shows placeholder text', () => {
    render(<TestFormInput placeholder="Enter your email" />);

    expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
  });

  it('passes testID to the input field', () => {
    render(<TestFormInput testID="email-input" />);

    expect(screen.getByTestId('email-input')).toBeTruthy();
  });

  it('updates value when text is entered', async () => {
    render(<TestFormInput testID="email-input" />);

    fireEvent.changeText(screen.getByTestId('email-input'), 'test@example.com');

    await waitFor(() => {
      expect(screen.getByDisplayValue('test@example.com')).toBeTruthy();
    });
  });

  it('shows validation error message when required field is submitted empty', async () => {
    render(<FormWithValidation />);

    fireEvent.press(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
    });
  });

  it('does not show an error message initially', () => {
    render(<FormWithValidation />);

    expect(screen.queryByText('Email is required')).toBeNull();
  });
});
