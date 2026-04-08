import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { useColorScheme as useNativeColorScheme, View, ViewProps } from 'react-native';
import { config } from './config';

export type ModeType = 'light' | 'dark' | 'system';

export function GluestackUIProvider({
  mode = 'light',
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const { setColorScheme } = useColorScheme();
  const systemColorScheme = useNativeColorScheme();
  const resolvedColorScheme: 'light' | 'dark' =
    mode === 'system' ? (systemColorScheme === 'dark' ? 'dark' : 'light') : mode;

  useEffect(() => {
    if (mode === 'light' || mode === 'dark') {
      setColorScheme(mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <View
      style={[config[resolvedColorScheme], { flex: 1, height: '100%', width: '100%' }, props.style]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
