/* eslint-disable react/prop-types */
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { BsFillMortarboardFill, BsPeopleFill } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { FaListUl, FaGraduationCap } from "react-icons/fa6";
import { GiDiploma } from "react-icons/gi";
import { RiCollageFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

import { NavLink } from "react-router-dom";

import { useMsal } from "@azure/msal-react";

import { useSelector } from "react-redux";
import { selectUserDetails } from "../redux/slices/userSlice.js";

function NavigationDrawer({ isOpen, onClose }) {
  const userDetails = useSelector(selectUserDetails);
  console.log("Drawer User Details-->", userDetails);
  const { instance, accounts } = useMsal();

  if (!userDetails.role) {
    return null; // Wait until user details are available
  }
  
  const handleLogout = () => {
    localStorage.clear();
    instance.logout({ account: accounts[0] });
  };

  return (
    <div
      className={`fixed z-50 top-0 left-0 lg:left-20 w-full lg:w-80 h-full bg-white shadow-lg transform transition-transform ease-in-out duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full sm:hidden"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-row p-1 border-b-2">
          <div className="flex flex-col flex-grow h-14 justify-start">
            <h2 className="font-bold m-4 sm:text-left text-sm sm:text-base">
              College of Engineering Internship
            </h2>
          </div>
          <button className="text-2xl lg:hidden mr-2" onClick={onClose}>
            <RxCrossCircled />
          </button>
          <button className="hidden lg:block text-xl" onClick={onClose}>
            <IoIosArrowDropleftCircle />
          </button>
        </div>
        <div className="flex-grow">
          <div className="flex flex-col justify-between mt-1">
            {/* Student Navigation Links */}

            {userDetails.role === "student" && (
              <NavLink
                to="/student/opportunities"
                className="flex flex-row  items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                onClick={onClose}
              >
                <BsFillMortarboardFill className="mx-4 text-xl" />
                <span className="mx-4 text-center lg:text-left">
                  Opportunities
                </span>
              </NavLink>
            )}
            {userDetails.role === "student" && (
              <NavLink
                to="/student/profile"
                className="flex flex-row items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                onClick={onClose}
              >
                <CgProfile className="mx-4 text-xl" />
                <span className="mx-4 text-center sm:text-left">Profile</span>
              </NavLink>
            )}

            {/* Admin Navigation Links */}

            {userDetails.role === "admin" && (
              <NavLink
                to="/admin/opportunities"
                className="flex flex-row  items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                onClick={onClose}
              >
                <BsFillMortarboardFill className="mx-4 text-xl" />
                <span className="mx-4 text-center lg:text-left">
                  Opportunities
                </span>
              </NavLink>
            )}

            {userDetails.role === "admin" && (
              <NavLink
                to="/admin/applicants"
                className="flex flex-row items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                onClick={onClose}
              >
                <BsPeopleFill className="mx-4 text-xl" />
                <span className="mx-4 text-center sm:text-left">
                  Applicants
                </span>
              </NavLink>
            )}

            {userDetails.role === "admin" && (
              <NavLink
                to="/admin/students"
                className="flex flex-row items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                onClick={onClose}
              >
                <FaListUl className="mx-4 text-xl" />
                <span className="mx-4 text-center sm:text-left">Students</span>
              </NavLink>
            )}

            {userDetails.role === "admin" && (
              <NavLink
                to="/admin/majors"
                className="flex flex-row items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                onClick={onClose}
              >
                <GiDiploma className="mx-4 text-xl" />
                <span className="mx-4 text-center sm:text-left">Majors</span>
              </NavLink>
            )}

            {userDetails.role === "admin" && (
              <NavLink
                to="/admin/programs"
                className="flex flex-row items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                onClick={onClose}
              >
                <FaGraduationCap className="mx-4 text-xl" />
                <span className="mx-4 text-center sm:text-left">Programs</span>
              </NavLink>
            )}

            {userDetails.role === "admin" && (
              <NavLink
                to="/admin/colleges"
                className="flex flex-row items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                onClick={onClose}
              >
                <RiCollageFill className="mx-4 text-xl" />
                <span className="mx-4 text-center sm:text-left">Colleges</span>
              </NavLink>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center mt-auto border-t-2">
          <button
            className="pb-1 px-4 text-red-600 my-3"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavigationDrawer;
