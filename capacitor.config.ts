import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.predinex.app',
  appName: 'Predinex',
  webDir: 'public',
  server: {
    url: 'https://www.predinex.com',
    cleartext: true
  }
};

export default config;
