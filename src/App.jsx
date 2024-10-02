import './App.css';
import { useEffect, useRef } from 'react';

import { useMsal, MsalAuthenticationTemplate } from '@azure/msal-react'; 
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest } from './authentication/auth';
import { jwtDecode } from "jwt-decode";
import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "./components/ErrorFallback"

import AdminDashboard from './components/AdminDashboard';
// import StudentDashboard from './components/StudentDashboard';
import axiosInstance from './interceptors/axiosInstance';

const MAX_RETRIES = 3; // Set a maximum retry limit

function App() {
  const { instance, accounts } = useMsal();
  const refreshTokenTimeout = useRef(null);
  const retryCount = useRef(0); // Track retry attempts

  useEffect(() => {
    axiosInstance.get('/user/detail')
      .then((res)=>{
        console.log(res.data.data);
      })
  })
  useEffect(() => {
    const fetchToken = async () => {
      if (accounts.length > 0) {
        const account = accounts[0];
        const request = {
          ...loginRequest,
          forceRefresh: true,
          account: account,
        };

        try {
          const response = await instance.acquireTokenSilent(request);
          handleTokenSuccess(response.idToken);
        } catch (error) {
          if (error instanceof InteractionRequiredAuthError) {
            try {
              const response = await instance.acquireTokenPopup(request);
              handleTokenSuccess(response.idToken);
            } catch (popupError) {
              handleTokenFailure(popupError);
            }
          } else {
            handleTokenFailure(error);
          }
        }
      }
    };

    fetchToken();
  }, [accounts, instance]);

  const handleTokenSuccess = (token) => {
    localStorage.setItem('idToken', token);
    retryCount.current = 0; // Reset retry count on success
    scheduleTokenRefresh(token);
  };

  const handleTokenFailure = (error) => {
    console.error('Token acquisition error:', error);
    retryCount.current += 1;

    if (retryCount.current < MAX_RETRIES) {
      scheduleTokenRefresh(); // Retry token acquisition
    } else {
      console.error('Max retry attempts reached.');
      // Optionally, log out the user or redirect to an error page.
    }
  };

  const scheduleTokenRefresh = (token) => {
    const decodedToken = jwtDecode(token);
    const expiryTime = decodedToken.exp * 1000;
    const currentTime = new Date().getTime();
    const timeout = expiryTime - currentTime - 5 * 60 * 1000; // Refresh 5 minutes before expiry

    if (refreshTokenTimeout.current) {
      clearTimeout(refreshTokenTimeout.current);
    }

    refreshTokenTimeout.current = setTimeout(() => {
      instance.acquireTokenSilent({
        ...loginRequest,
        forceRefresh: true,
        account: accounts[0],
      }).then(response => {
        handleTokenSuccess(response.idToken);
      }).catch(error => {
        handleTokenFailure(error);
      });
    }, timeout);
  };

  return (
  // <ErrorBoundary fallback={<div>Something went wrong.</div>} onReset={() => window.location.reload()}>
  <ErrorBoundary fallback={<ErrorFallback />}>
      <MsalAuthenticationTemplate interactionType="redirect" authenticationRequest={loginRequest}>
        <AuthenticatedApp />
      </MsalAuthenticationTemplate>
  </ErrorBoundary>

  );
}

function AuthenticatedApp() {
  return (
    // <StudentDashboard />
    <AdminDashboard />
  );
}

export default App;
