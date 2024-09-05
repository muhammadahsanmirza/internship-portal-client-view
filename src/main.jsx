import "./index.css";

import ReactDOM from "react-dom/client";

import { RouterProvider, Navigate } from 'react-router-dom';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authentication/auth.js';

import App from "./App.jsx";
// import Section from "./components/Section.jsx";
// import StudentProfile from "./components/StudentProfile.jsx";
import EditAndViewOpportunities from "./components/EditAndViewOpportunities.jsx";
import OpportunityForm from "./components/OpportunityForm.jsx";
import Applicants from "./components/Applicants.jsx";
import Students from "./components/Students.jsx";
import Majors from "./components/Majors.jsx";
import Programs from "./components/Programs.jsx";
import Colleges from "./components/Colleges.jsx";
import PageNotFound from './components/PageNotFound.jsx';

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Root path redirect to /admin/opportunities */}
      <Route path="/" element={<Navigate to="/admin/opportunities" />} />

      {/* Define admin routes */}
      <Route path='/admin/' element={<App />}>
        <Route index element={<Navigate to="opportunities" />} /> {/* Redirect to opportunities by default */}
        <Route path='opportunities' element={<EditAndViewOpportunities />} />
        <Route path='create/opportunities' element={<OpportunityForm />} />
        <Route path='applicants' element={<Applicants />} />
        <Route path='students' element={<Students/>} />
        <Route path='majors' element={<Majors />} />
        <Route path='programs' element={<Programs/>} />
        <Route path='colleges' element={<Colleges/>} />
        <Route path='*' element={<PageNotFound />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <MsalProvider instance={msalInstance}>
    <RouterProvider router={router} />
  </MsalProvider>
);
