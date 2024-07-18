import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";



import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authentication/auth.js';

import App from "./App.jsx";


const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();


ReactDOM.createRoot(document.getElementById("root")).render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>
);
