export interface EnvironmentConfig {
  production: boolean;
  apiUrl: string;
}

// Set to true to force production API from localhost
const FORCE_PROD: boolean | null = null; // Change to true to force production API, false to force local API

function detectEnvironment(): EnvironmentConfig {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const useProd = FORCE_PROD !== null ? FORCE_PROD : !isLocal;

  return {
    production: useProd,
    apiUrl: useProd ? 'https://api.ovfilm.com' : 'http://localhost:1624',
  };
}

export const environment: EnvironmentConfig = detectEnvironment();
