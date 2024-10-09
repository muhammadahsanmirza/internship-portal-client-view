import "./App.css";
import { useState, useEffect, useRef } from "react";

import { useMsal, MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "./authentication/auth";
import { jwtDecode } from "jwt-decode";
import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "./components/ErrorFallback";

import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import PageNotFound from "./components/PageNotFound";
import axiosInstance from "./interceptors/axiosInstance";
// import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// import { selectUserDetails } from "./redux/slices/userSlice.js";
import { setUserDetails } from "./redux/slices/userSlice.js";
const MAX_RETRIES = 3; // Set a maximum retry limit

function App() {
  // const [userRole, setUserRole] = useState(null);
  // const [userContext, setUserContext] = useState(null);
  console.log("APP----->");

  const { instance, accounts } = useMsal();
  const refreshTokenTimeout = useRef(null);
  const retryCount = useRef(0); // Track retry attempts
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
  }, [accounts, instance]);

  const handleTokenSuccess = (token) => {
    localStorage.setItem("idToken", token);
    retryCount.current = 0; // Reset retry count on success
    scheduleTokenRefresh(token);
  };

  const handleTokenFailure = (error) => {
    console.error("Token acquisition error:", error);
    retryCount.current += 1;

    if (retryCount.current < MAX_RETRIES) {
      scheduleTokenRefresh(); // Retry token acquisition
    } else {
      console.error("Max retry attempts reached.");
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
        <AuthenticatedApp />
      </MsalAuthenticationTemplate>
    </ErrorBoundary>
  );
}

function AuthenticatedApp() {
  console.log("Authenticated App----->");

  const [detail, setDetail] = useState(null);
  const [role,setRole] = useState(null);
  const dispatch = useDispatch();

  // const { role, context } = useSelector(se
  // console.log("Store role",role,"Store context-->",context);lectUserDetails);

  useEffect(() => {
    axiosInstance
      .get("/user/detail")
      .then((res) => {
        console.log(res.data.data);
        setDetail(res.data.data);
        setRole(res.data.data.role);
        dispatch(setUserDetails(res.data.data));
      })
      .catch((err) => {
        console.error("Error fetching user details", err);
        setDetail({});
      });
  }, []);
  return (
    <div>
      {/* {role === "admin" ? <AdminDashboard /> 
      : role === "student" ? <StudentDashboard />
      : <PageNotFound />} */}
      <div>{role}</div>
    </div>
  );
}

export default App;
