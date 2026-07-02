const APP_VARIANT = process.env.APP_VARIANT;
const IS_DEV = APP_VARIANT === 'development';
const IS_PREVIEW = APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) return 'com.nagiiiqt.DekuNotes.dev';
  return 'com.nagiiiqt.DekuNotes';
};

const getAppName = () => {
  if (IS_DEV) return 'Deku-Notes (Dev)';
  return 'Deku Notes';
};

export default {
  expo: {
    scheme: 'deku-notes',
    name: getAppName(),
    slug: 'MaoMao-Notes',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/deku_note.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIStatusBarHidden: true,
        ITSAppUsesNonExemptEncryption: false,
      },
      bundleIdentifier: getUniqueIdentifier(),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/deku_note.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: getUniqueIdentifier(),
    },
    web: {
      favicon: './assets/deku_note.png',
    },
    plugins: ['expo-router'],
    extra: {
      router: {},
      eas: {
        projectId: '2bdbdb75-e635-4abd-9c3d-7323b1a4d8e2',
      },
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/2bdbdb75-e635-4abd-9c3d-7323b1a4d8e2',
    },
  },
};