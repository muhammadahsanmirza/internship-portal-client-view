import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "../authentication/auth"; 
import { InteractionRequiredAuthError } from "@azure/msal-browser"; 
const msalInstance = new PublicClientApplication(msalConfig);
const initializeMSAL = async () => {
  await msalInstance.initialize();
};

export const getToken = async () => {
  const account = getAccountInfo();
  try {
    const token = await msalInstance.acquireTokenSilent({
      scopes: loginRequest.scopes,
      account,
      forceRefresh: true 
    });
    return token.idToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      return msalInstance
        .acquireTokenRedirect({
          scopes: loginRequest.scopes,
        })
        .then((resp) => {
          return resp.idToken;
        })
        .catch((err) => {
          console.error("Error during token acquisition:", err);
          return null;
        });
    } else {
      console.error("Token acquisition error:", error);
      return null;
    }
  }
};

const getAccountInfo = () => {
  const accounts = msalInstance.getAllAccounts();
  return accounts[0];
};

initializeMSAL();