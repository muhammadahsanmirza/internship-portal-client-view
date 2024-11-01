/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axiosInstance from "../interceptors/axiosInstance";
import { getToken } from "../utils/TokenManager";
function RouteGuard({ role }) {
//   const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
console.log("Route Gaurd Component");
  useEffect( () => {
    const token =  getToken();
    if (!token) {
      navigate("/notFound");
      return;
    }

    axiosInstance.get("/user/detail")
      .then((res) => {
        const userDetail = res.data.data;

        console.log("RouteGuard",userDetail.role,"Role prop-->",role);
        if (userDetail.role !== role) {
          navigate("/notFound"); // Unauthorized access to role-based routes
        }
      })
      .catch((err) => {
        console.error("Error fetching user details", err);
        navigate("/notFound");
      })
    //   .finally(() => setLoading(false));
  }, [role, navigate]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

  return <Outlet />;
}

export default RouteGuard;
