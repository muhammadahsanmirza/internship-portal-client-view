// src/components/ProtectedComponent.js
import React from 'react';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { loginRequest } from '../authentication/auth';
import SignInButton from './SignInButton';

const ProtectedContent = () => {
  return (
    <div>
      <h1>Protected Content</h1>
      <SignInButton />
    </div>
  );
};

function ProtectedComponent() {
  return (
    <MsalAuthenticationTemplate interactionType="redirect" authenticationRequest={loginRequest}>
      <ProtectedContent />
    </MsalAuthenticationTemplate>
  );
}

export default ProtectedComponent;
