import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { Toast } from 'toastify-react-native';

import { useAuthControllerLogin } from '@/api/auth/auth';
import type { LoginInput } from '@/api/model/loginInput';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import { AUTH_LOGIN_ACCENT, AUTH_LOGIN_ACCENT_SOFT } from '@/constants/theme';
import { useEventCallback } from '@/hooks/useEventCallback';
import { useSetAuthTokens } from '@/store/auth';
import { AuthCard } from '../components/AuthCard';
import { ModalWrapper } from '../components/ModalWrapper';

export default function Login() {
  const router = useRouter();
  const setAuthTokens = useSetAuthTokens();

  const { control, handleSubmit } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useAuthControllerLogin({
    mutation: {
      onSuccess: async (response) => {
        const { accessToken, refreshToken } = response.data;
        await setAuthTokens(accessToken, refreshToken);
        Toast.success('Logged in successfully!');
        router.back();
      },
      onError: (err) => {
        console.error('Login failed', err);
        Toast.error('Invalid email or password');
      },
    },
  });

  const onFooterPress = useEventCallback(() => {
    router.replace('/Signup');
  });

  const onSubmit = useEventCallback(() => {
    void handleSubmit((data) => {
      mutate({ data });
    })();
  });

  return (
    <ModalWrapper>
      <AuthCard
        title="Login"
        subtitle="Access your account and pick up where you left off."
        Icon={Lock}
        accentColor={AUTH_LOGIN_ACCENT}
        accentSoftColor={AUTH_LOGIN_ACCENT_SOFT}
        footerText="Don't have an account?"
        footerActionText="Sign Up"
        onFooterPress={onFooterPress}
        asModal
      >
        <FormInput
          control={control}
          name="email"
          label="Email"
          placeholder="Enter your email"
          testID="login-email-input"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          }}
          inputProps={{
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoCorrect: false,
          }}
        />

        <FormInput
          control={control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          testID="login-password-input"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          inputProps={{
            secureTextEntry: true,
          }}
        />

        <Button
          size="xl"
          action="primary"
          onPress={onSubmit}
          isDisabled={isPending}
          className="rounded-2xl"
          style={{ backgroundColor: AUTH_LOGIN_ACCENT }}
          testID="login-submit-button"
        >
          {isPending && <ButtonSpinner className="mr-2" />}
          <ButtonText className="text-white">{isPending ? 'Logging in...' : 'Login'}</ButtonText>
        </Button>
      </AuthCard>
    </ModalWrapper>
  );
}
