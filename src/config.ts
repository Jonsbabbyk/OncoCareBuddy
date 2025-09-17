const getApiBaseUrl = () => {
  
  if (import.meta.env.DEV) {
    
    return 'http://localhost:3001';
  }
 
  return import.meta.env.VITE_BACKEND_URL;
};

export const API_BASE_URL = getApiBaseUrl();