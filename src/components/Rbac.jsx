import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axiosInstance from "../interceptors/axiosInstance";
function Rbac() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    console.log('Token-->',token)
    if (!token) {
      localStorage.clear();
    }
    if (token) {
      axiosInstance
        .get("/user/detail")
        .then((res) => {
          console.log("response data-->",res.data.data)
          const userDetail = res.data.data;
          // Navigate based on role and context
          console.log(userDetail.role, userDetail.context);
          if (res.data.data.role === "admin" && res.data.data.context === "site") {
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
  }, [navigate]);
  return <Outlet />;
}

export default Rbac;
