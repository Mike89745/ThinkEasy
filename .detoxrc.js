/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'android.debug': {
      type: 'android.apk',
      build:
        'cd android && gradlew.bat assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      testBinaryPath: 'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk',
    },
    'android.release': {
      type: 'android.apk',
      build:
        'cd android && gradlew.bat assembleRelease assembleAndroidTest -DtestBuildType=release && cd ..',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      testBinaryPath:
        'android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk',
    },
    'ios.debug': {
      type: 'ios.app',
      build:
        'xcodebuild -workspace ios/ThinkEasy.xcworkspace -scheme ThinkEasy -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/ThinkEasy.app',
    },
    'ios.release': {
      type: 'ios.app',
      build:
        'xcodebuild -workspace ios/ThinkEasy.xcworkspace -scheme ThinkEasy -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/ThinkEasy.app',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 16',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Medium_Phone',
      },
    },
  },
  configurations: {
    'android.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.release': {
      device: 'emulator',
      app: 'android.release',
    },
    'ios.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.release': {
      device: 'simulator',
      app: 'ios.release',
    },
  },
};
