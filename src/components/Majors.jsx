import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BsCheckCircle } from "react-icons/bs";
import { debounce, isArray } from "lodash";
import Header from "./Header";
import axiosInstance from "../interceptors/axiosInstance";
import MajorFormDialog from "./MajorFormDialog";
import Loader from "./Loader";
function Majors() {
  const [data, setData] = useState([]);
  const [totalMajors, setTotalMajors] = useState(0);
  const [majorSearch, setMajorSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPrevPage, setNextPrevPage] = useState(currentPage);
  const [totalPages, setTotalPages] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState(0);
  const [majorId, setMajorId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);


  const [major, setMajor] = useState(null);
  const [isCreateMajor, setIsCreateMajor] = useState(false);
  const [isEditMajor, setIsEditMajor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpenMajorDialog = () => setIsCreateMajor(true);
  const handleCloseMajorDialog = () => setIsCreateMajor(false);
  const handleCloseEditMajorDialog = () => setIsEditMajor(false);

  const fetchMajors = useCallback(
    debounce(() => {
      setLoading(true);
      const payload = {
        major_name: majorSearch || undefined,
        program_id: programId || undefined,
        page_number: nextPrevPage || currentPage || undefined,
      };
      axiosInstance
        .get(`/majors`, { params: payload })
        .then((res) => {
            console.log("MAJORS===>",res)
          const newData = res.data.data;

          // Check if the received data is an array, else set it to an empty array
          if (isArray(newData)) {
            setData(newData);
            setTotalMajors(res.data.total_records);
            setCurrentPage(res.data.current_page);
            // setNextPrevPage(currentPage);
            setTotalPages(res.data.total_pages);
          } else {
            setData([]); // No opportunities found
            setTotalMajors(0);
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
      majorSearch,
      programId,
      currentPage,
      nextPrevPage,
    ]
  );

  const btnArray = useMemo(() => {
    const btnArray = [];
    for (let i = 1; i < currentPage; i++) {
      btnArray.push(i);
    }
    return btnArray;
  }, [currentPage]);

  // To Delete and Opportunity

  const deleteMajor = (id) => {
    axiosInstance
      .delete(`/major/${id}`)
      .then((res) => {
        const message = res.data.message || "Major deleted successfully.";
        toast.success(message, { transition: Slide });
        setMajorId(null)
        fetchMajors(); // Refresh the list after deletion
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data || "Failed to delete Major.";
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

 
  useEffect(() => {
    fetchMajors();
    return () => {
        fetchMajors.cancel();
    };
  }, [
    majorSearch,
    programId,
    fetchMajors,
    currentPage,
    nextPrevPage,
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
    setMajorSearch("");
    setProgramId(0);
  }

  const breadcrumbs = [
    { title: "Opportunities", href: "/admin/opportunities", isDisabled: false },
    { title: "Majors", href: "#", isDisabled: true },
];

  return (
    <div className="w-full sm:mt-0 sm:ml-20 z-0">
      <Header breadcrumbs={breadcrumbs} />

      <div className="rounded border mt-4 mx-2 sm:mx-6">
        <p className="py-4 pl-4 bg-blue-950 text-white rounded-t">Majors</p>
        <div className="flex flex-col sm:flex-row my-4 mx-3 justify-between">
          <div className="flex flex-col sm:flex-row justify-evenly">
            <div className="flex flex-row rounded border mx-2 mb-2 sm:mb-1 w-full sm:w-52 h-7">
              <input
                type="text"
                placeholder="Search major name"
                className="w-full text-xs outline-none px-1"
                onChange={(e) => setMajorSearch(e.target.value)}
                value={majorSearch}
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
          </div>
          <div className="flex gap-2">
            <div className="flex flex-row rounded bg-yellow-500 hover:bg-yellow-600 text-black px-2 text-sm items-center justify-center sm:mx-1 mt-2 sm:mt-0 h-7">
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
                onClick={handleOpenMajorDialog}
                disabled={loading || error}
              >
                CREATE MAJOR
              </button>
            </div>
          </div>
        </div>
        {loading && (<Loader/>)}
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
                      Program
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center align-middle"
                    >
                      College
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

                <tbody>
                  {data?.map((major) => (
                    <tr key={major.id}>
                      <td className="px-6 py-4 text-center align-middle">
                        {major.id}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {major.name}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {major.program_name}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {major.college_name}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {major.status ? (
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
                              setMajor(major);
                              setIsEditMajor(true);
                              console.log(major);
                            }}
                          >
                            Edit
                          </button>
                          
                          <button
                            className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 mx-1 my-1 sm:my-0 rounded"
                            onClick={() => {
                              setMajorId(major.id);
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
                  Total Majors : {totalMajors}
                </p>
                <p className="mx-6">Page No. {currentPage}</p>
              </div>
              <div>
                <button
                  className="py-2 px-4 hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setNextPrevPage(currentPage - 1);
                  }}
                >
                  Prev
                </button>

                {btnArray.length > 0 &&
                  btnArray.map((btnValue) => (
                    <button
                      key={btnValue}
                      className="py-2 px-4 hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(btnValue)}
                    >
                      <p className="">{btnValue}</p>
                    </button>
                  ))}
                {currentPage > 3 && (
                  <button className="py-2 px-4 hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
                    ...
                  </button>
                )}

                <button
                  className="py-2 px-4 hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setNextPrevPage(currentPage + 1);
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
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
                  Do You want to delete this Major?
                </h3>
                <button
                  className={`text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-6 py-2.5 text-center mr-2 `}
                  onClick={() => deleteMajor(majorId)}
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
      {isCreateMajor && (
        <MajorFormDialog
          headerText={"Create Major"}
          open={isCreateMajor}
          close={() => handleCloseMajorDialog()}
          onMajorUpdate={fetchMajors}
        />
      )}
      {isEditMajor && (
        <MajorFormDialog
          headerText={"Update Major"}
          open={isEditMajor}
          close={() => handleCloseEditMajorDialog()}
          onMajorUpdate={fetchMajors}
          editMode={true}
          {...major}
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

export default Majors;
