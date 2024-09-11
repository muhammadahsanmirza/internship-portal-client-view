// AdminNavigationDrawer.jsx
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { BsFillMortarboardFill } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { BsPeopleFill } from "react-icons/bs";
import { FaListUl } from "react-icons/fa6";
import { GiDiploma } from "react-icons/gi";
import { FaGraduationCap } from "react-icons/fa6";
import { RiCollageFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";

import { useMsal } from "@azure/msal-react";

function AdminNavigationDrawer({ isOpen, onClose }) {
    const { instance, accounts } = useMsal();

    const handleLogout = () => {
        localStorage.clear();
        instance.logout({ account: accounts[0] });
    };

    return (
        <div
            className={`fixed top-0 left-0 lg:left-20 w-full lg:w-80 h-full bg-white z-10 shadow-lg transform transition-transform ease-in-out duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full sm:hidden"
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
                        <NavLink
                            to="opportunities"
                            className="flex flex-row  items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                            onClick={onClose}
                        >
                            <BsFillMortarboardFill className="mx-4 text-xl" />
                            <span className="mx-4 text-center lg:text-left">Opportunities</span>
                        </NavLink>

                        <NavLink
                            to="applicants"
                            className="flex flex-row items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                            onClick={onClose}
                        >
                            <BsPeopleFill className="mx-4 text-xl"/>
                            <span className="mx-4 text-center sm:text-left">Applicants</span>
                        </NavLink>

                        <NavLink
                            to="students"
                            className="flex flex-row items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                            onClick={onClose}
                        >
                            <FaListUl  className="mx-4 text-xl" />
                            <span className="mx-4 text-center sm:text-left">Students</span>
                        </NavLink>

                        <NavLink
                            to="majors"
                            className="flex flex-row items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                            onClick={onClose}
                        >
                            <GiDiploma  className="mx-4 text-xl" />
                            <span className="mx-4 text-center sm:text-left">Majors</span>
                        </NavLink>

                        <NavLink
                            to="programs"
                            className="flex flex-row items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                            onClick={onClose}
                        >
                            <FaGraduationCap className="mx-4 text-xl" />
                            <span className="mx-4 text-center sm:text-left">Programs</span>
                        </NavLink>

                        <NavLink
                            to="colleges"
                            className="flex flex-row items-center py-4 rounded-3xl justify-start hover:cursor-pointer sm:justify-start w-full lg:hover:bg-slate-500"
                            onClick={onClose}
                        >
                            <RiCollageFill className="mx-4 text-xl" />
                            <span className="mx-4 text-center sm:text-left">Colleges</span>
                        </NavLink>
                    </div>
                </div>
                <div className="flex justify-center items-center mt-auto border-t-2">
                    <button className="pb-1 px-4 text-red-600 my-3" onClick={handleLogout}>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminNavigationDrawer;