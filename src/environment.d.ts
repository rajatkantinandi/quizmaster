// Add additional type definitions when a new env variable is added
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      BACKEND_URL: string;
      CATALOG_BASE_URL: string;
      MIXPANEL_API_KEY: string;
    }
  }
}

// converting it into a module by adding an empty export statement so that ts recognizes it.
export {};
