import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.communieats.app',
  appName: 'CommuniEats',
  webDir: 'out',
  server: {
    url: 'https://communieats.vercel.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#FFFFFF',
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#06C167',
      iosSpinnerStyle: 'large',
      spinnerColor: '#FFFFFF',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Default',
      backgroundColor: '#FFFFFF',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    Geolocation: {
      permissions: {
        ios: {
          NSLocationWhenInUseUsageDescription: 'CommuniEats uses your location to show nearby restaurants and help you deliver orders to neighbors.',
        },
      },
    },
  },
}

export default config
