import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../interceptors/axiosInstance";
function Rbac() {
    const [userDetail,setUserDetail] = useState({});
    const navigate = useNavigate();
  useEffect(() => {
    axiosInstance.get("/user/detail").then((res) => {
        setUserDetail(res.data.data)
    });
    const token = localStorage.getItem("idToken");
    const decodedToken = jwtDecode(token);
    const expiryTime = decodedToken.exp * 1000;
    const currentTime = new Date().getTime();
    console.log("userDetail",userDetail);
    console.log("Expiry Time==>", expiryTime);
    console.log("Time Stamps==>", currentTime);
    
    console.log("Expiry Time in minutes==>", (expiryTime-currentTime)/60000);
    if(!token){
        localStorage.clear();
        navigate('/notFound');
    }
    if(token){
        if(currentTime>expiryTime){
            localStorage.clear();
        }else{
            if(userDetail.role==="admin" && userDetail.context === "site"){
                // navigate('/admin');
            }
        }

    }
  },[]);
  return <div>
  Role Based Access Control
  </div>;
}

export default Rbac;
