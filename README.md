# ThinkEasy

A React Native mobile app built with Expo and Expo Router.

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Studio / Android SDK (for Android)
- Xcode (for iOS, macOS only)

## Installation

```bash
npm install
```

## Available Commands

### Development

| Command           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `npm start`       | Start the Expo development server (with cache cleared) |
| `npm run android` | Run on Android device/emulator                         |
| `npm run ios`     | Run on iOS simulator (macOS only)                      |
| `npm run web`     | Run in the browser                                     |

### Testing

| Command    | Description              |
| ---------- | ------------------------ |
| `npm test` | Run unit tests with Jest |

### Code Quality

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `npm run lint:check` | Check for lint errors                |
| `npm run lint:fix`   | Auto-fix lint errors                 |
| `npm run format`     | Format all files with Prettier       |
| `npm run fix`        | Run `lint:fix` and `format` together |

### API

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run generate-api` | Generate API client code using Orval |

---

## E2E Tests (Detox)

End-to-end tests use [Detox](https://wix.github.io/Detox/) with Jest as the test runner.

### Test Files

| File                      | Description                     |
| ------------------------- | ------------------------------- |
| `e2e/auth.test.ts`        | Signup, login, and logout flows |
| `e2e/posts.test.ts`       | Posts listing                   |
| `e2e/post-detail.test.ts` | Single post detail view         |
| `e2e/create-post.test.ts` | Creating a new post             |
| `e2e/user-posts.test.ts`  | Viewing a user''s posts         |

### Android

**Debug build (recommended for development):**

```bash
# 1. Build the app
npm run e2e:android:debug:build

# 2. Start the Metro bundler in a separate terminal
npm start

# 3. Run the tests
npm run e2e:android:debug:test
```

**Release build:**

```bash
# 1. Build the app
npm run e2e:android:release:build

# 2. Run the tests (no Metro bundler needed)
npm run e2e:android:release:test
```

### iOS (macOS only)

**Debug build:**

```bash
# 1. Build the app
npm run e2e:ios:debug:build

# 2. Start the Metro bundler in a separate terminal
npm start

# 3. Run the tests
npm run e2e:ios:debug:test
```

**Release build:**

```bash
# 1. Build the app
npm run e2e:ios:release:build

# 2. Run the tests (no Metro bundler needed)
npm run e2e:ios:release:test
```

### E2E Test Configuration

- The debug configuration connects to the Metro bundler at `http://10.0.2.2:8081` (Android emulator localhost alias).
- Tests have a timeout of **120 seconds** per test.
- A pre-existing test account is used for login tests (`e2e/helpers/account.ts`). Update credentials there if needed.
- Tests run with `maxWorkers: 1` (sequential execution) to avoid device conflicts.
