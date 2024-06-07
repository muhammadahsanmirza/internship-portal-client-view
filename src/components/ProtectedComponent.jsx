// src/components/ProtectedComponent.js
import React from 'react';
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from '../authentication/auth';

const ProtectedContent = () => {
  const { accounts } = useMsal();
  const user = accounts[0];

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {/* Your protected content */}
    </div>
  );
};

function ProtectedComponent() {
  return (
    <MsalAuthenticationTemplate interactionType="popup" authenticationRequest={loginRequest}>
      <ProtectedContent />
    </MsalAuthenticationTemplate>
  );
}

export default ProtectedComponent;
