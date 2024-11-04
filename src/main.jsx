import "./index.css";

import ReactDOM from "react-dom/client";

import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authentication/auth.js";

import App from "./App.jsx";
import {
  Opportunities,
  OpportunityForm,
  Applicants,
  Students,
  Majors,
  Programs,
  Colleges,
  PageNotFound,
  AdminDashboard,
  StudentDashboard,
  StudentProfile,
  RouteGuard,
  Section,
} from "./components/index.js"

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { store } from "./redux/store/store.js";
import { Provider } from "react-redux";

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App />} />
      {/* Admin routes */}
      <Route path="/admin/" element={<RouteGuard role={"admin"} />}>
        <Route element={<AdminDashboard />}>
          <Route index element={<Navigate to="opportunities" />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="create/opportunities" element={<OpportunityForm />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="students" element={<Students />} />
          <Route path="majors" element={<Majors />} />
          <Route path="programs" element={<Programs />} />
          <Route path="colleges" element={<Colleges />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>
      <Route path="/student/" element={<RouteGuard role={"student"} />}>
        <Route element={<StudentDashboard />}>
          <Route index element={<Navigate to="opportunities" />} />
          <Route path="opportunities" element={<Section />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>

      <Route path="/notFound" element={<PageNotFound />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <MantineProvider>
      <MsalProvider instance={msalInstance}>
        <RouterProvider router={router} />
      </MsalProvider>
    </MantineProvider>
  </Provider>
);
