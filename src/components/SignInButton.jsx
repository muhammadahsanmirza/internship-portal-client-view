import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import Button from "@mui/material/Button";
import { loginRequest } from "../authentication/auth";

function SignInButton() {
  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    const loginWindow = window.open("", "_blank");
    instance.loginRedirect(loginRequest).then(response => {
      if (loginWindow) {
        loginWindow.close();
      }
      console.log("MSAL Login Response:", response);
    }).catch(e => {
      if (loginWindow) {
        loginWindow.close();
      }
      console.error("MSAL Login Error:", e);
    });
  };

  const handleLogout = () => {
    instance.logout({ account: accounts[0] });
  };

  useEffect(() => {
    if (accounts.length > 0) {
      const account = accounts[0];
      const request = {
        ...loginRequest,
        account: account,
      };
      instance.acquireTokenSilent(request).then(response => {
        console.log("Token refreshed silently:", response);
      }).catch(error => {
        if (error instanceof InteractionRequiredAuthError) {
          instance.acquireTokenPopup(request).then(response => {
            console.log("Token acquired with popup:", response);
          }).catch(e => {
            console.error("Token acquisition error:", e);
          });
        } else {
          console.error("Silent token acquisition error:", error);
        }
      });
    }
  }, [accounts, instance]);

  return (
    <>
      {accounts.length === 0 ? (
        <Button variant="contained" onClick={handleLogin}>
          Sign In
        </Button>
      ) : (
        <Button variant="contained" onClick={handleLogout}>
          Sign Out
        </Button>
      )}
    </>
  );
}

export default SignInButton;
