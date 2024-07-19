import React from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { BsFillMortarboardFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { RxCrossCircled } from "react-icons/rx";

import { useMsal } from "@azure/msal-react";
import { useDispatch } from 'react-redux';
import { setView } from '../features/studenDashboard/studentDashboardSlice';

function NavigationDrawer({ isOpen, onClose }) {
    const dispatch = useDispatch();

    const { instance, accounts } = useMsal();
    const handleLogout = () => {
        localStorage.clear();
        instance.logout({ account: accounts[0] });
    };

    const onClickHandler = (e) => {
        dispatch(setView({ currentView: e.target.value })); // Dispatch directly without local state
        onClose(); // Close the drawer if needed
    };

    return (
        <div
            className={`fixed top-0 left-0 sm:left-20 w-full sm:w-52 h-full bg-white z-10 shadow-lg transform transition-transform ease-in-out duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full sm:hidden"
                }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex flex-row p-1 border-b-2">
                    <div className="flex flex-col flex-grow h-14 justify-center">
                        <h2 className="font-bold text-center sm:text-left text-sm sm:text-base">
                            College of Engineering
                        </h2>
                        <h2 className="font-bold text-center sm:text-left text-sm sm:text-base">
                            Internship
                        </h2>
                    </div>
                    <button className="text-2xl sm:hidden mr-2" onClick={onClose}>
                        <RxCrossCircled />
                    </button>
                    <button className="hidden sm:block text-xl" onClick={onClose}>
                        <IoIosArrowDropleftCircle />
                    </button>
                </div>
                <div className="flex-grow">
                    <div className="flex flex-col justify-between mt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center py-2 rounded-3xl justify-center sm:justify-start w-full hover:bg-slate-500">
                            <BsFillMortarboardFill className="mx-4" />
                            <button
                                className="mx-4 text-center sm:text-left"
                                value="Opportunities"
                                onClick={onClickHandler}
                            >
                                Opportunities
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center py-2 rounded-3xl justify-center sm:justify-start w-full hover:bg-slate-500">
                            <CgProfile className="mx-4" />
                            <button
                                className="mx-4 text-center sm:text-left"
                                value="StudentProfile"
                                onClick={onClickHandler}
                            >
                                Profile
                            </button>
                        </div>
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

export default NavigationDrawer;
