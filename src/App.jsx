
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './authentication/auth';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { jwtDecode } from "jwt-decode";
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {
  const { instance, accounts } = useMsal();
  const [idToken, setIdToken] = useState(null);
  const refreshTokenTimeout = useRef(null);

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
          console.log('Token refreshed silently:', response);
          const token = response.idToken;
          setIdToken(token);
          localStorage.setItem('idToken', token);
          scheduleTokenRefresh(token);
        } catch (error) {
          if (error instanceof InteractionRequiredAuthError) {
            try {
              const response = await instance.acquireTokenPopup(request);
              console.log('Token acquired with popup:', response);
              const token = response.idToken;
              setIdToken(token);
              localStorage.setItem('idToken', token);
              scheduleTokenRefresh(token);
            } catch (popupError) {
              console.error('Token acquisition error with popup:', popupError);
            }
          } else {
            console.error('Silent token acquisition error:', error);
          }
        }
      }
    };

    fetchToken();
  }, [accounts, instance]);

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
        console.log('Token refreshed silently:', response);
        const newToken = response.idToken;
        setIdToken(newToken);
        localStorage.setItem('idToken', newToken);
        scheduleTokenRefresh(newToken);
      }).catch(error => {
        if (error instanceof InteractionRequiredAuthError) {
          instance.acquireTokenPopup({
            ...loginRequest,
            account: accounts[0],
          }).then(response => {
            console.log('Token acquired with popup:', response);
            const newToken = response.idToken;
            setIdToken(newToken);
            localStorage.setItem('idToken', newToken);
            scheduleTokenRefresh(newToken);
          }).catch(popupError => {
            console.error('Token acquisition error with popup:', popupError);
          });
        } else {
          console.error('Silent token acquisition error:', error);
        }
      });
    }, timeout);
  };

  return (
    <MantineProvider>
      <MsalAuthenticationTemplate interactionType="redirect" authenticationRequest={loginRequest}>
        <AuthenticatedApp />
      </MsalAuthenticationTemplate>
    </MantineProvider>
  );
}

function AuthenticatedApp({ idToken }) {
  return (
    // <StudentDashboard />
    <AdminDashboard/>
  );
}

export default App;
