import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.communieats.app',
  appName: 'CommuniEats',
  webDir: 'out',
  server: {
    url: 'https://communieats-app.vercel.app',
    cleartext: false,
    allowNavigation: ['*.vercel.app', '*.supabase.co', '*.unsplash.com'],
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
      launchShowDuration: 2500,
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
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#06C167',
    },
  },
}

export default config
