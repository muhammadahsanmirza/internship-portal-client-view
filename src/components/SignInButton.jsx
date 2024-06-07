
import React from 'react';
import { useMsal } from '@azure/msal-react';
import Button from '@mui/material/Button'; // Updated import
import { loginRequest } from '../authentication/auth';

function SignInButton() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => {
      console.error(e);
    });
  };

  return <Button variant="contained" onClick={handleLogin}>Sign In</Button>;
}

export default SignInButton;

