declare module 'detox-expo-helpers' {
  export interface ReloadAppParams {
    permissions?: Record<string, unknown>;
    urlBlacklist?: string[];
  }

  export function getAppUrl(): Promise<string>;
  export function getAppHttpUrl(): Promise<string>;
  export function blacklistLiveReloadUrl(userBlacklist?: string[]): Promise<void>;
  export function reloadApp(params?: ReloadAppParams): Promise<void>;
}
