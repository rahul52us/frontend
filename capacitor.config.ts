import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bussinesssahayata.app',
  appName: 'bussinesssahayata',
  webDir: 'out',
  server: {
    androidScheme: 'http',
    allowNavigation: ['bussinesssahayata-backend.vercel.app', '10.0.2.2'],
    cleartext: true,
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
