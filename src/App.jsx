import { useEffect, useRef } from "react";

import { useMsal, MsalAuthenticationTemplate } from "@azure/msal-react";
import { loginRequest } from "./authentication/auth";
import { InteractionRequiredAuthError } from '@azure/msal-common';
import { jwtDecode } from "jwt-decode";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
import Dashboard from "./components/Dashboard.jsx";

import { useDispatch } from "react-redux";
import {clearUserDetails} from "./redux/slices/userSlice.js";
const MAX_RETRIES = 3;

function App() {
  const dispatch = useDispatch();

  const { instance, accounts } = useMsal();
  const refreshTokenTimeout = useRef(null);
  const retryCount = useRef(0);

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


    return () => {
      if (refreshTokenTimeout.current) {
        clearTimeout(refreshTokenTimeout.current);
      }
    };
  }, [accounts, instance]);

  const handleTokenSuccess = (token) => {
    localStorage.setItem("idToken", token);
    retryCount.current = 0;
    scheduleTokenRefresh(token);
  };

  const handleTokenFailure = (error) => {
    retryCount.current += 1;
    if (retryCount.current < MAX_RETRIES) {
      scheduleTokenRefresh();
    } else {
      console.error("Max retry attempts reached.");
      console.errors(error);
      // dispatch(clearUserDetails());
    }
  };

  const scheduleTokenRefresh = (token) => {
    const decodedToken = jwtDecode(token);
    const expiryTime = decodedToken.exp * 1000;
    const currentTime = new Date().getTime();
    const timeout = expiryTime - currentTime - 5 * 60 * 1000;

    if (refreshTokenTimeout.current) {
      clearTimeout(refreshTokenTimeout.current);
    }

    refreshTokenTimeout.current = setTimeout(() => {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          forceRefresh: true,
          account: accounts[0],
        })
        .then((response) => {
          handleTokenSuccess(response.idToken);
        })
        .catch((error) => {
          handleTokenFailure(error);
        });
    }, timeout);
  };

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <MsalAuthenticationTemplate
        interactionType="redirect"
        authenticationRequest={loginRequest}
      >
        <Dashboard />
      </MsalAuthenticationTemplate>
    </ErrorBoundary>
  );
}

export default App;
