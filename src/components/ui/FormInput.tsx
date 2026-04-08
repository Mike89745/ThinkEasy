import { ComponentProps } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { Text, View } from 'react-native';

import { Input, InputField } from '@/components/ui/input';

type InputFieldProps = ComponentProps<typeof InputField>;
type InputVariant = ComponentProps<typeof Input>['variant'];
type InputSize = ComponentProps<typeof Input>['size'];

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  rules?: RegisterOptions<T, FieldPath<T>>;
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  size?: InputSize;
  inputProps?: Omit<InputFieldProps, 'onChangeText' | 'onBlur' | 'value' | 'placeholder'>;
  className?: string;
  testID?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  rules,
  label,
  placeholder,
  variant = 'outline',
  size = 'xl',
  inputProps,
  className,
  testID,
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className={className}>
          {label && <Text className="mb-1 text-sm text-typography-500">{label}</Text>}
          <Input isInvalid={!!error} variant={variant} size={size}>
            <InputField
              placeholder={placeholder}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              testID={testID}
              {...inputProps}
            />
          </Input>
          {error && <Text className="mt-1 text-sm text-error-600">{error.message}</Text>}
        </View>
      )}
    />
  );
}
