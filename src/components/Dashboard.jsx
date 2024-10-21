import { useEffect } from "react";

import axiosInstance from "../interceptors/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import {
  setUserDetails,
  selectUserDetails,
} from "../redux/slices/userSlice.js";

import Sidebar from "./Sidebar.jsx";
import Section from "./Section";
import Opportunities from "./Opportunities";
function Dashboard() {
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetails);

  const getUserDetails = () => {
    axiosInstance
      .get("/user/detail")
      .then((res) => {
        dispatch(setUserDetails(res.data.data));
        console.log("App Component User Details-->", res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching user details", err);
      });
  };

  useEffect(() => {
    getUserDetails();
    console.log(userDetails);
  }, []);

  return (
    <>
      <Sidebar />
      <div className="flex w-screen">
        {userDetails.role === "admin" && <Opportunities />}
      </div>
      {userDetails.role === "student" && <Section />}
    </>
  );
}

export default Dashboard;
