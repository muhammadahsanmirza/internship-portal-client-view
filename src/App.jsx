import { useState, useEffect, useRef } from "react";
import { useMsal, MsalAuthenticationTemplate } from "@azure/msal-react";
import { loginRequest } from "./authentication/auth";
import { jwtDecode } from "jwt-decode";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
// import AdminDashboard from "./components/AdminDashboard";
// import StudentDashboard from "./components/StudentDashboard";
// import PageNotFound from "./components/PageNotFound";
import Section from "./components/Section";
import Opportunities from "./components/Opportunities"; // Default component
import axiosInstance from "./interceptors/axiosInstance";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./redux/slices/userSlice.js";
import Sidebar from "./components/Sidebar.jsx";
const MAX_RETRIES = 3;

function App() {
  const [role, setRole] = useState(null); // Holds the user's role (admin or student)
  const dispatch = useDispatch();

  const getUserDetails = () => {
    axiosInstance
      .get("/user/detail")
      .then((res) => {
        setRole(res.data.data.role);
        dispatch(setUserDetails(res.data.data));
        console.log("App Component User Details-->", res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching user details", err);
      });
  };

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
    getUserDetails();
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
        <Sidebar />
        <div>{role === "admin" ? <Opportunities /> : <Section />}</div>
      </MsalAuthenticationTemplate>
    </ErrorBoundary>
  );
}

export default App;
