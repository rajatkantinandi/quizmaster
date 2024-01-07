// Add additional type definitions when a new env variable is added
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_BACKEND_URL: string;
      REACT_APP_CATALOG_BASE_URL: string;
      REACT_APP_MIXPANEL_API_KEY: string;
    }
  }
}

// converting it into a module by adding an empty export statement so that ts recognizes it.
export {};
