import { useEventCallback } from '@/hooks/useEventCallback';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

type ModalWrapperProps = {
  children: ReactNode;
  onClose?: () => void;
};

export function ModalWrapper({ children, onClose }: ModalWrapperProps) {
  const router = useRouter();

  const handleClose = useEventCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  });

  return (
    <View className="flex-1">
      <Pressable
        onPress={handleClose}
        testID="modal-backdrop"
        className="absolute bottom-0 left-0 right-0 top-0 bg-background-dark opacity-50"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
