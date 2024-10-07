import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axiosInstance from "../interceptors/axiosInstance";
function Rbac() {
  const [userDetail, setUserDetail] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (!token) {
      localStorage.clear();
    }
    if (token) {
      axiosInstance
        .get("/user/detail")
        .then((res) => {
          setUserDetail(res.data.data);
          // Navigate based on role and context
          if (userDetail.role === "admin" && userDetail.context === "site") {
            navigate("/admin/opportunities"); // Redirect to admin
          } else if (userDetail.role === "student") {
            navigate("/student/opportunities"); // Redirect to student
          } else {
            navigate("/notFound"); // For invalid role/context
          }
        })
        .catch((err) => {
          console.error("Error fetching user details", err);
          navigate("/notFound"); // Handle error (could also add an error page)
        });
    }
  }, [userDetail.context, userDetail.role, navigate]);
  return <Outlet />;
}

export default Rbac;
