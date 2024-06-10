import React, { useEffect, useState } from 'react';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

import { useMsal } from '@azure/msal-react';
import { loginRequest } from './authentication/auth';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { MsalAuthenticationTemplate } from '@azure/msal-react';

function App() {
  const { instance, accounts } = useMsal();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[0];
      const request = {
        ...loginRequest,
        account: account,
      };
      instance.acquireTokenSilent(request).then(response => {
        console.log('Token refreshed silently:', response);
        setToken(response.accessToken);
        localStorage.setItem('idToken', response.idToken); // Store idToken in local storage
      }).catch(error => {
        if (error instanceof InteractionRequiredAuthError) {
          instance.acquireTokenPopup(request).then(response => {
            console.log('Token acquired with popup:', response);
            setToken(response.accessToken);
            localStorage.setItem('idToken', response.idToken); // Store idToken in local storage
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
      <MsalAuthenticationTemplate interactionType="redirect" authenticationRequest={loginRequest}>
        <AuthenticatedApp token={token} />
      </MsalAuthenticationTemplate>
    </>
  );
}

function AuthenticatedApp({ token }) {
  const idToken = localStorage.getItem('idToken');
  console.log('idToken from local storage:', idToken);

  return (
    <>
      {/* <AdminDashboard /> */}
      <StudentDashboard token={token} idToken={idToken} />
    </>
  );
}

export default App;
