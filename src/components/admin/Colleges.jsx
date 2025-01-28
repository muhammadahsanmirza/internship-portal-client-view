import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BsCheckCircle } from "react-icons/bs";
import { debounce, isArray } from "lodash";
import axiosInstance from "../../interceptors/axiosInstance";

import {
  Header,
  CollegeFormDialog,
  DeleteDialog,
  Loader,
  Pagination,
} from "../index.js";

function Colleges() {
  const [data, setData] = useState([]);
  const [totalColleges, setTotalColleges] = useState(0);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPrevPage, setNextPrevPage] = useState(currentPage);
  const [totalPages, setTotalPages] = useState(0);
  const [college, setCollege] = useState(null);
  const [collegeId, setCollegeId] = useState(null);
  const [isCreateCollege, setIsCreateCollege] = useState(false);
  const [isEditCollege, setIsEditCollege] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchColleges = useCallback(
    debounce(() => {
      setLoading(true);
      const payload = {
        college_name: collegeSearch || undefined,
        page_number: nextPrevPage || currentPage || undefined,
      };
      axiosInstance
        .get(`/colleges`, { params: payload })
        .then((res) => {
          console.log(res.data);
          const newData = res.data.data;
          // Check if the received data is an array, else set it to an empty array
          if (isArray(newData)) {
            setData(newData);
            setTotalColleges(res.data.total_records);
            setCurrentPage(res.data.current_page);
            // setNextPrevPage(currentPage);
            setTotalPages(res.data.total_pages);
          } else {
            setData([]); // No opportunities found
            setTotalColleges(0);
            setCurrentPage(1);
            setTotalPages(1);
            setError(res.data.message || "No opportunities found");
          }

          setError(null);
        })
        .catch((error) => {
          setData([]); // Clear previous data
          setError(error.message);
          console.log("error");
        })
        .finally(() => {
          setLoading(false);
          setNextPrevPage(null);
        });
    }, 800),
    [collegeSearch, collegeId, currentPage, nextPrevPage]
  );

  // To Delete and Opportunity

  const deleteCollege = (id) => {
    axiosInstance
      .delete(`/college/${id}`)
      .then((res) => {
        const message = res.data.message || "College deleted successfully.";
        toast.success(message, { transition: Slide });
        fetchColleges(); // Refresh the list after deletion
      })
      .catch((err) => {
        const errorMessage = err.response?.data || "Failed to delete College.";
        console.log(errorMessage);
        toast.error(errorMessage, { transition: Slide });
        console.error(error);
      })
      .finally(() => {
        closeConfirmDialog();
      });
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };
  // To Close Edit College Dialog
  const handleOpenCollegeDialog = () => setIsCreateCollege(true);
  const handleCloseCollegeDialog = () => setIsCreateCollege(false);
  const handleCloseEditCollegeDialog = () => setIsEditCollege(false);

  useEffect(() => {
    fetchColleges();
    return () => {
      fetchColleges.cancel();
    };
  }, [collegeSearch, collegeId, fetchColleges, currentPage, nextPrevPage]);

  function handleClearFilter() {
    setCollegeSearch("");
    setCollegeId(0);
  }

  const breadcrumbs = [
    { title: "Opportunities", href: "/admin/opportunities", isDisabled: false },
    { title: "College", href: "#", isDisabled: true },
  ];

  return (
    <div className="w-full sm:mt-0 lg:ml-20 z-0 overflow-x-hidden">
      <Header breadcrumbs={breadcrumbs} />

      <div className="rounded border mt-4 mx-2 sm:mx-6">
        <p className="py-4 lg:pl-7 bg-blue-950 text-white rounded-t">
          Colleges
        </p>
        <div className="flex flex-col sm:flex-row lg:flex-nowrap md:justify-between my-4 mx-3 ">
          <div className="flex flex-col sm:flex-row justify-evenly md:flex-wrap  md:justify-evenly lg:flex-nowrap lg:gap-0 mx-2">
            <div className="flex flex-row rounded border w-full sm:w-52 h-7 md:w-56 md:h-10 lg:w-96 lg:mx-0 lg:h-8">
              <input
                type="text"
                placeholder="Search college name"
                className="w-full text-xs outline-none px-2"
                onChange={(e) => setCollegeSearch(e.target.value)}
                value={collegeSearch}
                disabled={loading || error}
              />
              <button className="flex items-center justify-center w-12">
                <IoIosSearch className="text-lg" />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row lg:flex-row justify-evenly sm:justify-around mx-2  sm:mt-0 md:mx-18 md:justify-between gap-0 md:gap-2 lg:gap-0 xl:ml-36 xl:justify-evenly">
            <div className="flex flex-row rounded bg-yellow-500 hover:bg-yellow-600 text-black sm:px-0 md:px-2  text-sm items-center justify-center sm:mx-1 mt-2 sm:mt-0 h-7  md:w-48 md:h-10 md:mx-4 lg:w-32 lg:h-8 lg:mx-2  gap-2">
              <RxCrossCircled />
              <button
                className=" text-xs font-semibold "
                onClick={handleClearFilter}
                disabled={loading || error}
              >
                CLEAR FILTERS
              </button>
            </div>

            <div className="flex flex-row rounded bg-blue-950 text-white px-2 text-sm items-center justify-center mt-2 sm:mt-0 h-7 md:w-48 md:h-10 md:mx-4 lg:w-36 lg:h-8 lg:mx-2 gap-2">
              <IoIosAddCircleOutline className="w-5 h-5" />{" "}
              <button
                className="text-xs font-semibold text-nowrap"
                onClick={handleOpenCollegeDialog}
                disabled={loading || error}
              >
                CREATE COLLEGE
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
                    Status
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
                  {data?.map((college) => (
                    <tr key={college.id}>
                      <td className="px-6 py-4 text-center align-middle">
                        {college.id}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {college.college_name}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {college.status ? (
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
                              setIsEditCollege(true);
                              setCollege(college);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 mx-1 my-1 sm:my-0 rounded"
                            onClick={() => {
                              console.log("Button Clicked");
                              setCollegeId(college.id);
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
                    <td colSpan="6" className="text-center">
                      <p className="mt-4 text-red-500 text-center font-bold text-xl">
                        Error: {error}
                      </p>
                    </td>
                  </tr>
                )}
                {data.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="text-center">
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
            totalText={"Colleges"}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalColleges}
            onPageChange={() => {
              setNextPrevPage(currentPage + 1);
            }}
          />
        </div>
      </div>
      {confirmDialogOpen && (
        <DeleteDialog
          title={"College"}
          open={confirmDialogOpen}
          noCallback={closeConfirmDialog}
          yesCallback={() => deleteCollege(collegeId)}
        />
      )}
      {isCreateCollege && (
        <CollegeFormDialog
          headerText={"Create College"}
          open={isCreateCollege}
          close={() => handleCloseCollegeDialog()}
          onCollegeUpdate={fetchColleges}
        />
      )}
      {isEditCollege && (
        <CollegeFormDialog
          headerText={"Update College"}
          open={isEditCollege}
          close={() => handleCloseEditCollegeDialog()}
          onCollegeUpdate={fetchColleges}
          editMode={true}
          {...college}
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

export default Colleges;
