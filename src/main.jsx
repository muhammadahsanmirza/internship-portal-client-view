import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider, Navigate } from 'react-router-dom';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authentication/auth.js';

import App from "./App.jsx";
import Section from "./components/Section.jsx";
import StudentProfile from "./components/StudentProfile.jsx";
import PageNotFound from './components/PageNotFound.jsx';

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Root path redirect to /student */}
      <Route path="/" element={<Navigate to="/student/opportunities" />} />

      {/* Define student routes */}
      <Route path='/student/' element={<App />}>
        <Route index element={<Navigate to="opportunities" />} /> {/* Redirect to opportunities by default */}
        <Route path='opportunities' element={<Section />} />
        <Route path='profile' element={<StudentProfile />} />
        <Route path='*' element={<PageNotFound />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <MsalProvider instance={msalInstance}>
    <RouterProvider router={router} />
  </MsalProvider>
);
