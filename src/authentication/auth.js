// auth.js
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: import.meta.env.VITE_MSAL_AUTHORITY,
    redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'localStorage', // This will store cache in local storage
    storeAuthStateInCookie: false, // Set to true for IE11/Edge or if issues persist with cookies
  },
};

const loginRequest = {
  scopes: ['openid', 'email', 'profile', 'offline_access', 'User.Read'],
};

export { msalConfig, loginRequest };
