import type { LucideIcon } from 'lucide-react-native';
import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { AUTH_CARD_SHADOW } from '@/constants/theme';

export type AuthCardProps = {
  title: string;
  subtitle: string;
  accentColor: string;
  accentSoftColor: string;
  Icon: LucideIcon;
  footerText: string;
  footerActionText: string;
  onFooterPress: () => void;
  headerContent?: ReactNode;
  children: ReactNode;
  asModal?: boolean;
};

export function AuthCard({
  title,
  subtitle,
  accentColor,
  accentSoftColor,
  Icon,
  footerText,
  footerActionText,
  onFooterPress,
  headerContent,
  children,
  asModal = false,
}: AuthCardProps) {
  const card = (
    <View
      className="w-full max-w-md self-center rounded-[32px] border border-outline-100 bg-background-0 px-6 py-7"
      style={styles.cardSurface}
    >
      {headerContent}

      <View className="mb-7 items-center">
        <View
          className="mb-4 h-16 w-16 items-center justify-center rounded-2xl border border-outline-100"
          style={{ backgroundColor: accentSoftColor }}
        >
          <Icon size={30} color={accentColor} strokeWidth={2.2} />
        </View>
        <Text className="text-3xl font-bold text-typography-900" testID="auth-title">
          {title}
        </Text>
        <Text className="mt-2 text-center text-sm leading-5 text-typography-500">{subtitle}</Text>
      </View>

      <View className="gap-4">{children}</View>

      <Pressable onPress={onFooterPress} className="mt-6" testID="auth-footer-action">
        <Text className="text-center text-sm text-typography-500">
          {footerText}{' '}
          <Text style={{ color: accentColor }} className="font-semibold">
            {footerActionText}
          </Text>
        </Text>
      </Pressable>
    </View>
  );

  if (asModal) {
    return card;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-50"
    >
      <View className="flex-1 justify-center overflow-hidden bg-background-50 px-6 py-10">
        {card}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  cardSurface: {
    shadowColor: AUTH_CARD_SHADOW,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 12,
  },
});
