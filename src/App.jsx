import './App.css';

import React, { useEffect, useState } from 'react';

import { useMsal } from '@azure/msal-react';
import { loginRequest } from './authentication/auth';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { MsalAuthenticationTemplate } from '@azure/msal-react';

import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';


function App() {
  const { instance, accounts } = useMsal();
  const [idToken, setIdToken] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[0];
      const request = {
        ...loginRequest,
        account: account,
      };
      console.log("inside if statement")
      instance.acquireTokenSilent(request).then(response => {
        console.log('Token refreshed silently:', response);
        const token = response.idToken;
        setIdToken(token);
        localStorage.setItem('idToken', token);
      }).catch(error => {
        if (error instanceof InteractionRequiredAuthError) {
          instance.acquireTokenPopup(request).then(response => {
            console.log('Token acquired with popup:', response);
            const token = response.idToken;
            setIdToken(token);
            localStorage.setItem('idToken', token);
          }).catch(e => {
            console.error('Token acquisition error:', e);
          });
        } else {
          console.error('Silent token acquisition error:', error);
        }
      });
    }
  }, [accounts, instance]);

  return (
    <>
      <MantineProvider>
        <MsalAuthenticationTemplate interactionType="redirect" authenticationRequest={loginRequest}>
          <AuthenticatedApp idToken={idToken} />
        </MsalAuthenticationTemplate>
      </MantineProvider>
    </>
  );
}

function AuthenticatedApp({ idToken }) {
  const token = localStorage.getItem('idToken');
  console.log('idToken from local storage:', token);

  return (
    <>
      <StudentDashboard idToken={idToken} />
    </>
  );
}

export default App;
