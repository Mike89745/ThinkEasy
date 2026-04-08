import { useRouter } from 'expo-router';
import { ChevronLeft, UserPlus } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { Toast } from 'toastify-react-native';

import { useAuthControllerSignup } from '@/api/auth/auth';
import type { SignupInput } from '@/api/model/signupInput';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { FormInput } from '@/components/ui/FormInput';
import { AUTH_SIGNUP_ACCENT, AUTH_SIGNUP_ACCENT_SOFT } from '@/constants/theme';
import { useEventCallback } from '@/hooks/useEventCallback';
import { useSetAuthTokens } from '@/store/auth';
import { AuthCard } from '../components/AuthCard';
import { ModalWrapper } from '../components/ModalWrapper';

export default function Signup() {
  const router = useRouter();
  const setAuthTokens = useSetAuthTokens();

  const { control, handleSubmit } = useForm<SignupInput>({
    defaultValues: {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
    },
  });

  const { mutate, isPending } = useAuthControllerSignup({
    mutation: {
      onSuccess: async (response) => {
        const { accessToken, refreshToken } = response.data;
        await setAuthTokens(accessToken, refreshToken);
        Toast.success('Account created successfully! Logging you in...');
        router.back();
      },
      onError: (err) => {
        console.error('Signup failed', err);
        Toast.error('Signup failed. Please try again.');
      },
    },
  });

  const handleBackToLogin = useEventCallback(() => {
    router.back();
  });

  const onFooterPress = useEventCallback(() => {
    router.replace('/Login');
  });

  const onSubmit = useEventCallback(() => {
    void handleSubmit((data) => {
      mutate({ data });
    })();
  });

  return (
    <ModalWrapper>
      <AuthCard
        title="Sign Up"
        subtitle="Create your account and start publishing in a cleaner workspace."
        Icon={UserPlus}
        accentColor={AUTH_SIGNUP_ACCENT}
        accentSoftColor={AUTH_SIGNUP_ACCENT_SOFT}
        headerContent={
          <View>
            <Pressable
              onPress={handleBackToLogin}
              testID="signup-back-button"
              className="mb-5 flex-row items-center gap-2 self-start rounded-full border border-outline-100 bg-background-50 px-3 py-2"
            >
              <ChevronLeft size={18} color={AUTH_SIGNUP_ACCENT} strokeWidth={2.2} />
            </Pressable>
          </View>
        }
        footerText="Already have an account?"
        footerActionText="Login"
        onFooterPress={onFooterPress}
        asModal
      >
        <FormInput
          control={control}
          name="firstname"
          label="First Name"
          placeholder="Enter your first name"
          testID="signup-firstname-input"
          rules={{ required: 'First name is required' }}
        />
        <FormInput
          control={control}
          name="lastname"
          label="Last Name"
          placeholder="Enter your last name"
          testID="signup-lastname-input"
          rules={{ required: 'Last name is required' }}
        />
        <FormInput
          control={control}
          name="email"
          label="Email"
          placeholder="Enter your email"
          testID="signup-email-input"
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
          testID="signup-password-input"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
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
          testID="signup-submit-button"
        >
          {isPending && <ButtonSpinner className="mr-2" />}
          <ButtonText>{isPending ? 'Creating account...' : 'Sign Up'}</ButtonText>
        </Button>
      </AuthCard>
    </ModalWrapper>
  );
}
