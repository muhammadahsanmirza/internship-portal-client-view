import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import { useMsal, MsalAuthenticationTemplate } from '@azure/msal-react'; // Import MsalAuthenticationTemplate
import { loginRequest } from './authentication/auth';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { jwtDecode } from "jwt-decode";
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

const MAX_RETRIES = 3; // Set a maximum retry limit

function App() {
  const { instance, accounts } = useMsal();
  const [idToken, setIdToken] = useState(null);
  const refreshTokenTimeout = useRef(null);
  const retryCount = useRef(0); // Track retry attempts

  useEffect(() => {
    const fetchToken = async () => {
      if (accounts.length > 0) {
        const account = accounts[0];
        const request = {
          ...loginRequest,
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
    setIdToken(token);
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
        account: accounts[0],
      }).then(response => {
        handleTokenSuccess(response.idToken);
      }).catch(error => {
        handleTokenFailure(error);
      });
    }, timeout);
  };

  return (
    <MantineProvider>
      <MsalAuthenticationTemplate interactionType="redirect" authenticationRequest={loginRequest}>
        <AuthenticatedApp idToken={idToken} />
      </MsalAuthenticationTemplate>
    </MantineProvider>
  );
}

function AuthenticatedApp({ idToken }) {
  return (
    // <StudentDashboard />
    <AdminDashboard />
  );
}

export default App;
