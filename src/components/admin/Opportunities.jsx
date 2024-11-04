import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosSearch, IoIosAddCircleOutline } from "react-icons/io";
import { TbBulb } from "react-icons/tb";
import { BsCheckCircle } from "react-icons/bs";
import { debounce, isArray } from "lodash";
import axiosInstance from "../../interceptors/axiosInstance";

import {Header, ViewOpportunity, EditOpportunity, Loader, DeleteDialog, Pagination} from '../index.js'

const applicationStatus = [
  { id: 1, status: "Published", value: true },
  { id: 2, status: "Unpublished", value: false },
];

function Opportunities() {
  const [data, setData] = useState([]);
  const [totalOpportunities, setTotalOpportunities] = useState(0);
  const [opportunitySearch, setOpportunitySearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPrevPage, setNextPrevPage] = useState(currentPage);
  const [totalPages, setTotalPages] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState(0);
  const [statusValue, setStatusValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpportunity, setIsEditOpportunity] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState({});
  const [opportunityId, setOpportunityId] = useState(null);

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
        page_number: nextPrevPage || currentPage || undefined,
      };
      axiosInstance
        .get(`opportunities/admin`, { params: payload })
        .then((res) => {
          const newData = res.data.data;
          console.log("Admin Opportunities Response===>", res);
          // Check if the received data is an array, else set it to an empty array
          if (isArray(newData)) {
            setData(newData);
            setTotalOpportunities(res.data.total_records);
            setCurrentPage(res.data.current_page);
            // setNextPrevPage(currentPage);
            setTotalPages(res.data.total_pages);
          } else {
            setData([]); // No opportunities found
            setTotalOpportunities(0);
            setCurrentPage(1);
            setTotalPages(1);
            setError(res.data.message || "No opportunities found");
          }

          setError(null);
        })
        .catch((error) => {
          setData([]); // Clear previous data
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
          setNextPrevPage(null);
        });
    }, 800),
    [
      opportunitySearch,
      companySearch,
      programId,
      statusValue,
      currentPage,
      nextPrevPage,
    ]
  );

  // To Delete an Opportunity

  const deleteOpportunity = (id) => {
    axiosInstance
      .delete(`/opportunity/${id}`)
      .then((res) => {
        const message = res.data.message || "Opportunity deleted successfully.";
        toast.success(message, { transition: Slide });
        fetchOpportunities(); // Refresh the list after deletion
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || "Failed to delete opportunity.";
        toast.error(errorMessage, { transition: Slide });
        console.error(error);
      })
      .finally(() => {
        closeConfirmDialog();
      });
  };
  // To Open View Opportunity Dialog

  const openOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDialogOpen(true);
  };
  // To Close View Opportunity Dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setOpportunityId(null); // Reset the opportunity to delete
  };
  // To Close Edit Opportunity Dialog
  const closeIsEditOpportunity = () => {
    setIsEditOpportunity(false);
  };

  // Hide Body Scrollbar when Dialog Is Open
  useEffect(() => {
    if (isEditOpportunity || isDialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEditOpportunity, isDialogOpen]);

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
    currentPage,
    nextPrevPage,
  ]);

  useEffect(() => {
    axiosInstance
      .get("/program/names")
      .then((res) => {
        console.log("Proram Names===>", res);
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

  const breadcrumbs = [{ title: "Opportunities", href: "#", isDisabled: true }];

  return (
    <div className="w-full sm:mt-0 lg:ml-20 z-0  ">
      <Header breadcrumbs={breadcrumbs} />

      <div className="rounded border mt-4 mx-2 sm:mx-6">
        <p className="py-4 pl-4 bg-blue-950 text-white rounded-t">
          Opportunities
        </p>
        <div className="flex flex-col md:flex-col lg:flex-row md:gap-4 lg:flex-wrap md:justify-between my-4 mx-0 ">
          <div className="flex flex-col sm:flex-row justify-evenly md:flex-nowrap  md:justify-evenly lg:flex-nowrap gap-2 lg:gap-0 mx-2">
            <div className="flex flex-row rounded border w-full sm:w-52 h-7 md:w-80 md:h-10 lg:w-48 lg:mx-1 lg:h-8 xl:w-52">
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
            <div className="flex flex-row rounded border w-full sm:w-52 h-7 md:w-80 md:h-10 lg:w-48 lg:mx-1 lg:h-8 xl:w-52">
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
            <div className="flex flex-row rounded border w-full sm:w-52 h-7 md:w-80 md:h-10 lg:w-48 lg:mx-1 lg:h-8 xl:w-52">
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
            <div className="flex flex-row rounded border w-full sm:w-52 h-7 md:w-80 md:h-10 lg:w-48 lg:mx-1 lg:h-8 xl:w-52">
              <select
                className="w-full text-sm px-2 outline-none"
                value={statusValue}
                disabled={loading || error}
                onChange={(e) => {
                  const value = e.target.value;
                  setStatusValue(
                    value === "true" ? true : value === "false" ? false : ""
                  );
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

          {/* Buttons */}
          <div className="flex flex-col md:flex-row-reverse lg:flex-row mx-2 md:mx-0  sm:mt-0 md:mx-18  gap-0 md:gap-0 lg:gap-0 lg:ml-0  justify-evenly sm:justify-around md:justify-start xl:justify-around">
            <div className="flex flex-row rounded bg-yellow-500 hover:bg-yellow-600 text-black sm:px-0 md:px-2  text-sm items-center justify-center sm:mx-1 md:mx-2 mt-2 sm:mt-0 h-7  md:w-48 md:h-10 lg:w-32 lg:h-8 lg:mx-2">
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
            <div className="flex flex-row rounded bg-blue-950 text-white px-1 text-sm items-center justify-center mt-2 sm:mt-0 h-7  md:w-48 md:h-10 md:mx-2 lg:w-32 lg:h-8 lg:mx-2 ">
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
        </div>
        {loading && <Loader />}

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
              {data.length !== 0 && (
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
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 mx-1 my-1 sm:my-0 rounded"
                            onClick={() => {
                              setSelectedOpportunity(opportunity);
                              setIsEditOpportunity(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mx-1 my-1 sm:my-0 rounded"
                            onClick={() => openOpportunity(opportunity)}
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
              )}
              <tfoot>
                {error && (
                  <tr>
                    <td colSpan="8" className="text-center">
                      <p className="mt-4 text-red-500 text-center font-bold text-xl">
                        Error: {error}
                      </p>
                    </td>
                  </tr>
                )}
                {data.length === 0 && !loading && (
                  <tr>
                    <td colSpan="8" className="text-center">
                      <p className="text-center mt-4 text-gray-500">
                        {error || "No records found."}
                      </p>
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
          
          <Pagination
            totalText={"Opportunities"}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalOpportunities}
            onPageChange={() => {
              setNextPrevPage(currentPage + 1);
            }}
          />
        </div>
      </div>
      {isDialogOpen && (
        <ViewOpportunity
          opportunity={selectedOpportunity}
          isOpen={isDialogOpen}
          onClose={closeDialog}
        />
      )}
      {confirmDialogOpen && (
        <DeleteDialog
          title={"Opportunity"}
          open={confirmDialogOpen}
          noCallback={closeConfirmDialog}
          yesCallback={() => deleteOpportunity(opportunityId)}
        />
      )}
      {isEditOpportunity && (
        <EditOpportunity
          {...selectedOpportunity}
          onClose={closeIsEditOpportunity}
          onOpportunityUpdate={fetchOpportunities}
        />
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

export default Opportunities;
