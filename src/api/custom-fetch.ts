import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://frontend-test-be.stage.thinkeasy.cz';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

type RefreshTokenPayload = { access_token: string } | { data?: { access_token?: string } };

async function parseJsonBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return undefined;
  }

  return response.json();
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!response.ok) {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    return null;
  }

  const payload = (await parseJsonBody(response)) as RefreshTokenPayload | undefined;
  const accessToken =
    payload && 'access_token' in payload ? payload.access_token : payload?.data?.access_token;

  if (!accessToken) {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    return null;
  }

  await AsyncStorage.setItem('accessToken', accessToken);
  return accessToken;
}

async function getRefreshedToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = refreshAccessToken().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });
  return refreshPromise;
}

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
  const accessToken = await AsyncStorage.getItem('accessToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const newToken = await getRefreshedToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
      });
    } else {
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await parseJsonBody(response);

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
};
