import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { TbBulb } from "react-icons/tb";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BsCheckCircle } from "react-icons/bs";
import { debounce } from "lodash";

import axiosInstance from "../interceptors/axiosInstance";

function EditAndViewOpportunities() {
    const [data, setData] = useState([]);
    const [totalOpportunities, setTotalOpportunities] = useState(0);
    const [opportunitySearch, setOpportunitySearch] = useState("");
    const [companySearch, setCompanySearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     let timeOut = setTimeout(()=>{
    //         axios.get(`http://159.89.7.6:8022/opportunities/admin?opportunity_name=${opportunitySearch}&company_name=${companySearch}`)
    //         .then((response) => {
    //             const newData = Array.isArray(response.data) ? response.data : response.data.data;
    //             setData(newData);
    //             setTotalOpportunities(response.data.total_records);
    //             setCurrentPage(response.data.current_page);
    //             setTotalPages(response.data.total_pages)
    //         })
    //         .catch((error) => { console.error(error) })
    //     },800)
    //     return ()=> clearTimeout(timeOut);
    // }, [opportunitySearch, companySearch]);
    const fetchOpportunities = useCallback(
        debounce(() => {
            setLoading(true);
            axiosInstance
                .get(
                    `opportunities/admin?opportunity_name=${opportunitySearch}&company_name=${companySearch}`
                )
                .then((response) => {
                    const newData = Array.isArray(response.data)
                        ? response.data
                        : response.data.data;
                    setData(newData);
                    setTotalOpportunities(response.data.total_records);
                    setCurrentPage(response.data.current_page);
                    setTotalPages(response.data.total_pages);
                    setError(null);
                })
                .catch((error) => {
                    setError(error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 800),
        [opportunitySearch, companySearch]
    );

    useEffect(() => {
        fetchOpportunities();
        return () => {
            fetchOpportunities.cancel();
        };
    }, [opportunitySearch, companySearch, fetchOpportunities]);

    function handleClearFilter() {
        setOpportunitySearch("");
        setCompanySearch("");
    }

    function handleNextPage(e) {
        currentPage === totalPages;
        axiosInstance
            .get(
                `/opportunities/admin?opportunity_name=${opportunitySearch}&company_name=${companySearch}`
            )
            .then((response) => {
                const newData = Array.isArray(response.data)
                    ? response.data
                    : response.data.data;
                setData(newData);
                setTotalOpportunities(response.data.total_records);
                setCurrentPage(response.data.current_page);
            })
            .catch((error) => {
                console.error(error);
            });
    }
    function handlePrevPage(e) { }

    return (
        <div className="w-full sm:mt-0 sm:ml-20 z-0">
            <div
                className="flex flex-col border-b-2 border-gray-300 px-12 sm:px-10 py-3"
                style={{ height: "4.1rem" }}
            >
                <h2 className="font-bold">College of Engineering Internship</h2>
                <p className="text-sm text-gray-400">Opportunities</p>
            </div>
            <div className="rounded border mt-4 mx-2 sm:mx-6">
                <p className="py-4 pl-4 bg-blue-950 text-white rounded-t">
                    Opportunities
                </p>
                <div className="flex flex-col sm:flex-row my-4 mx-3 justify-between">
                    <div className="flex flex-col sm:flex-row justify-evenly">
                        <div className="flex flex-row rounded border mx-2 mb-2 sm:mb-1 w-full sm:w-52 h-7">
                            <input
                                type="text"
                                placeholder="Search opportunity name"
                                className="w-full text-xs outline-none px-1"
                                onChange={(e) => setOpportunitySearch(e.target.value)}
                                value={opportunitySearch}
                            />
                            <button className="flex items-center justify-center w-12">
                                <TbBulb className="text-lg" />
                            </button>
                        </div>
                        <div className="flex flex-row rounded border mx-2 mb-2 sm:mb-1 w-full sm:w-52 h-7">
                            <input
                                type="text"
                                placeholder="Search company name"
                                className="w-full text-xs outline-none px-1"
                                onChange={(e) => setCompanySearch(e.target.value)}
                                value={companySearch}
                            />
                            <button className="flex items-center justify-center w-12">
                                <IoIosSearch className="text-lg" />
                            </button>
                        </div>
                        <div className="flex flex-row rounded border mx-2 mb-2 sm:mb-1 w-full sm:w-44 h-7">
                            <select className="w-full text-xs outline-none">
                                <option>ABC</option>
                                <option>XYZ</option>
                                <option>IJK</option>
                                <option>LMN</option>
                            </select>
                        </div>
                        <div className="flex flex-row rounded border mx-2 mb-2 sm:mb-1 w-full sm:w-44 h-7">
                            <select className="w-full text-xs outline-none">
                                <option>ABC</option>
                                <option>XYZ</option>
                                <option>IJK</option>
                                <option>LMN</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-row rounded bg-yellow-500 text-black px-2 text-sm items-center justify-center sm:mx-1 mt-2 sm:mt-0 h-7">
                        <RxCrossCircled />
                        <button
                            className=" text-xs"
                            style={{ minWidth: "100px", padding: "5px 10px" }}
                            onClick={handleClearFilter}
                        >
                            CLEAR FILTERS
                        </button>
                    </div>
                    <div className="flex flex-row rounded bg-blue-950 text-white px-1 text-sm items-center justify-center mx-1 sm:mx-1 mt-2 sm:mt-0 h-7">
                        <IoIosAddCircleOutline className="text-white" />
                        <button
                            className=" text-xs"
                            style={{ minWidth: "100px", padding: "5px 10px" }}
                            onClick={handleClearFilter}
                        >
                            CREATE OPPORTUNITY
                        </button>
                    </div>
                </div>
                {loading && (
                    <p className="text-center mt-4 text-gray-500 font-bold text-xl">
                        Loading...
                    </p>
                )}
                {error && (
                    <p className="text-center mt-4 text-red-500 font-bold text-xl">
                        Error: {error}
                    </p>
                )}
                {data.length === 0 && !loading && (
                    <p className="text-center mt-4 text-gray-500">No records found.</p>
                )}

                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm rtl:text-right">
                        <thead className="text-xs text-gray-700 bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center align-middle">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-3 text-center align-middle">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-center align-middle">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-center align-middle">
                                    Contact Person
                                </th>
                                <th scope="col" className="px-6 py-3 text-center align-middle">
                                    Company Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-center align-middle">
                                    Program Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-center align-middle">
                                    Published
                                </th>
                                <th scope="col" className="px-6 py-3 text-center align-middle">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((opportunity) => (
                                <tr key={opportunity.id}>
                                    <td className="px-6 py-4 text-center align-middle">
                                        {opportunity.id}
                                    </td>
                                    <td className="px-6 py-4 text-center align-middle">
                                        {opportunity.name}
                                    </td>
                                    <td className="px-6 py-4 text-center align-middle">
                                        {opportunity.email}
                                    </td>
                                    <td className="px-6 py-4 text-center align-middle">
                                        {opportunity.contact_person}
                                    </td>
                                    <td className="px-6 py-4 text-center align-middle">
                                        {opportunity.company_name}
                                    </td>
                                    <td className="px-6 py-4 text-center align-middle">
                                        {opportunity.program_name}
                                    </td>
                                    <td className="px-6 py-4 text-center align-middle">
                                        {opportunity.published ? (
                                            <span className="text-green-600 px-4 inline-block">
                                                <BsCheckCircle />
                                            </span>
                                        ) : (
                                            <span className="text-red-600 inline-block">
                                                <RxCrossCircled />
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center align-middle">
                                        <div className="flex flex-col sm:flex-row justify-center items-center">
                                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 mx-1 my-1 sm:my-0 rounded">
                                                Edit
                                            </button>
                                            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mx-1 my-1 sm:my-0 rounded">
                                                View
                                            </button>
                                            <button className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 mx-1 my-1 sm:my-0 rounded">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col sm:flex-row justify-around items-center py-4 bg-gray-100">
                    <div className="flex flex-row justify-between text-xs">
                        <p className="mx-6">Total Opportunities : {totalOpportunities}</p>
                        <p className="mx-6">Page No. {currentPage}</p>
                    </div>
                    <div>
                        <button
                            className="py-2 px-4 hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                            disabled={currentPage === 1}
                            onClick={handlePrevPage}
                        >
                            <MdKeyboardArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            className="py-2 px-4 hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                            disabled={currentPage === totalPages}
                            onClick={handleNextPage}
                        >
                            <MdKeyboardArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditAndViewOpportunities;
