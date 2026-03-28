export interface EnvironmentConfig {
  production: boolean;
  apiUrl: string;
}

function detectEnvironment(): EnvironmentConfig {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';

  return {
    production: !isDevelopment,
    apiUrl: isDevelopment ? 'http://localhost:1624' : 'https://ovfilm.com/api',
  };
}

export const environment: EnvironmentConfig = detectEnvironment();
