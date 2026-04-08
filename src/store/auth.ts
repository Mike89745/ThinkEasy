import { useEventCallback } from '@/hooks/useEventCallback';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom, useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const authAtom = atom<AuthState>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
});

export function useInitAuth() {
  const [auth, setAuth] = useAtom(authAtom);

  const hydrate = useEventCallback(async () => {
    const [accessToken, refreshToken] = await Promise.all([
      AsyncStorage.getItem('accessToken').catch((err) => {
        console.error('Failed to load access token', err);
        return null;
      }),
      AsyncStorage.getItem('refreshToken').catch((err) => {
        console.error('Failed to load refresh token', err);
        return null;
      }),
    ]);
    setAuth({
      accessToken,
      refreshToken,
      isAuthenticated: !!accessToken,
      isLoading: false,
    });
  });

  useEffect(() => {
    void hydrate();
  }, [setAuth, hydrate]);

  return auth;
}

export function useSetAuthTokens() {
  const setAuth = useSetAtom(authAtom);

  return useCallback(
    async (accessToken: string, refreshToken: string) => {
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      setAuth({
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    },
    [setAuth]
  );
}

export function useLogout() {
  const setAuth = useSetAtom(authAtom);

  return useCallback(async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    setAuth({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, [setAuth]);
}
