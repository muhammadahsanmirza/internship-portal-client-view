import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { TbBulb } from "react-icons/tb";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BsCheckCircle } from "react-icons/bs";
import { debounce, isArray } from "lodash";
import Header from "./Header";
import ViewOpportunity from "./ViewOpportunity";
import axiosInstance from "../interceptors/axiosInstance";

const applicationStatus = [
  { id: 1, status: "Published", value: true },
  { id: 2, status: "Unpublished", value: false },
];

function EditAndViewOpportunities() {
  const [data, setData] = useState([]);
  const [totalOpportunities, setTotalOpportunities] = useState(0);
  const [opportunitySearch, setOpportunitySearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState(0);
  const [statusValue, setStatusValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState({});
  const [opportunityId, setOpportunityId] = useState(null); // Store the ID of the opportunity to delete

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchOpportunities = useCallback(
    debounce(() => {
      setLoading(true);
      const payload = {
        opportunity_name: opportunitySearch || undefined,
        company_name: companySearch || undefined,
        program_id: programId || undefined,
        opportunity_status: statusValue !== "" ? statusValue : undefined,
      };
      axiosInstance
        .get(`opportunities/admin`, { params: payload })
        .then((response) => {
          const newData = response.data.data;

          // Check if the received data is an array, else set it to an empty array
          if (isArray(newData)) {
            console.log(newData);
            setData(newData);
            setTotalOpportunities(response.data.total_records);
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.total_pages);
          } else {
            setData([]); // No opportunities found
            setTotalOpportunities(0);
            setCurrentPage(1);
            setTotalPages(1);
            setError(response.data.message || "No opportunities found");
          }

          setError(null);
        })
        .catch((error) => {
          setData([]); // Clear previous data
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 800),
    [opportunitySearch, companySearch, programId, statusValue]
  );

  const deleteOpportunity = (id) => {
    axiosInstance
      .delete(`/opportunity/${id}`)
      .then((response) => {
        const message =
          response.data.message || "Opportunity deleted successfully.";
        toast.success(message, { transition: Slide });
        fetchOpportunities(); // Refresh the list after deletion
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Failed to delete opportunity.";
        toast.error(errorMessage, { transition: Slide });
        console.error(error);
      })
      .finally(() => {
        closeConfirmDialog();
      });
  };

  const openOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setOpportunityId(null); // Reset the opportunity to delete
  };

  useEffect(() => {
    fetchOpportunities();
    return () => {
      fetchOpportunities.cancel();
    };
  }, [
    opportunitySearch,
    companySearch,
    programId,
    statusValue,
    fetchOpportunities,
  ]);

  useEffect(() => {
    axiosInstance
      .get("/program/names")
      .then((res) => {
        setPrograms(res.data.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  function handleClearFilter() {
    setOpportunitySearch("");
    setCompanySearch("");
    setProgramId(0);
    setStatusValue("");
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
  function handlePrevPage(e) {}

  const breadcrumbs = [{ title: "Opportunities", href: "#", isDisabled: true }];

  return (
    <div className="w-full sm:mt-0 sm:ml-20 z-0">
      <Header breadcrumbs={breadcrumbs} />

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
                disabled={loading || error}
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
                disabled={loading || error}
              />
              <button className="flex items-center justify-center w-12">
                <IoIosSearch className="text-lg" />
              </button>
            </div>
            <div className="flex flex-row rounded border mx-2 mb-2 sm:mb-1 w-full sm:w-44 h-7">
              <select
                className="w-full text-sm px-2 outline-none"
                value={programId}
                disabled={loading || error}
                onChange={(e) => {
                  setProgramId(e.target.value);
                }}
              >
                <option value="">Select Program</option>
                {programs?.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row rounded border mx-2 mb-2 sm:mb-1 w-full sm:w-44 h-7">
              <select
                className="w-full text-sm px-2 outline-none"
                value={statusValue}
                disabled={loading || error}
                onChange={(e) => {
                  const value = e.target.value;
                  setStatusValue(
                    value === "true" ? true : value === "false" ? false : ""
                  ); // Convert to boolean
                }}
              >
                <option value="">Select Status</option>
                {applicationStatus?.map((status) => (
                  <option key={status.id} value={status.value}>
                    {status.status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-row rounded bg-yellow-500 text-black px-2 text-sm items-center justify-center sm:mx-1 mt-2 sm:mt-0 h-7">
            <RxCrossCircled />
            <button
              className=" text-xs"
              style={{ minWidth: "100px", padding: "5px 10px" }}
              onClick={handleClearFilter}
              disabled={loading || error}
            >
              CLEAR FILTERS
            </button>
          </div>
          <div className="flex flex-row rounded bg-blue-950 text-white px-1 text-sm items-center justify-center mx-1 sm:mx-1 mt-2 sm:mt-0 h-7">
            <IoIosAddCircleOutline className="text-white" />
            <button
              className=" text-xs"
              style={{ minWidth: "100px", padding: "5px 10px" }}
              onClick={() => {
                navigate("/admin/create/opportunities");
              }}
              disabled={loading || error}
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
          <p className="mt-4 text-red-500 text-center font-bold text-xl">
            Error: {error}
          </p>
        )}
        {data.length === 0 && !loading && (
          <p className="text-center mt-4 text-gray-500">
            {error || "No records found."}
          </p>
        )}
        {data.length !== 0 && (
          <div>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm rtl:text-right">
                <thead className="text-xs text-gray-700 bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center align-middle"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center align-middle"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center align-middle"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center align-middle"
                    >
                      Contact Person
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center align-middle"
                    >
                      Company Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center align-middle"
                    >
                      Program Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center align-middle"
                    >
                      Published
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center align-middle"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data?.map((opportunity) => (
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
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mx-1 my-1 sm:my-0 rounded"
                            onClick={() => openOpportunity(opportunity)}
                            // onClick={() => console.log(opportunity)}
                          >
                            View
                          </button>
                          <button
                            className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 mx-1 my-1 sm:my-0 rounded"
                            onClick={() => {
                              setOpportunityId(opportunity.id);
                              setConfirmDialogOpen(true);
                            }}
                          >
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
                <p className="mx-6">
                  Total Opportunities : {totalOpportunities}
                </p>
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
        )}
      </div>
      {isDialogOpen && (
        <ViewOpportunity
          opportunity={selectedOpportunity}
          isOpen={isDialogOpen}
          onClose={closeDialog}
        />
      )}
      {confirmDialogOpen && (
        <div>
          <div
            className="fixed inset-0 z-50 flex items-center  justify-center"
            onClick={() => closeConfirmDialog()}
          >
            <div className="border rounded-lg shadow relative bg-white max-w-4xl z-30">
              <div className="flex justify-end p-2">
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  onClick={closeConfirmDialog}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6 pt-0 text-center">
                <svg
                  className="w-20 h-20 text-red-600 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                  Do You want to delete this opportunity?
                </h3>
                <button
                  className={`text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-6 py-2.5 text-center mr-2 `}
                  onClick={() => deleteOpportunity(opportunityId)}
                >
                  Yes
                </button>
                <button
                  onClick={closeConfirmDialog}
                  className={`text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-7 py-2.5 text-center`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default EditAndViewOpportunities;
