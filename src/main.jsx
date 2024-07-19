import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from 'react-redux';
import { store } from "./app/store.js";

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authentication/auth.js';

import App from "./App.jsx";


const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();


ReactDOM.createRoot(document.getElementById("root")).render(
  <MsalProvider instance={msalInstance}>
    <Provider store={store}>
      <App />
    </Provider>
  </MsalProvider>
);
