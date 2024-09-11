import { useState, useEffect, useCallback, useMemo } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosSearch, IoIosAddCircleOutline } from "react-icons/io";
import { BsCheckCircle } from "react-icons/bs";
import { debounce, isArray } from "lodash";
import Header from "./Header";
import axiosInstance from "../interceptors/axiosInstance";
import ProgramFormDialog from "./ProgramFormDialog";

function Programs() {
  const [data, setData] = useState([]);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [programSearch, setProgramSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPrevPage, setNextPrevPage] = useState(currentPage);
  const [totalPages, setTotalPages] = useState(0);
  const [colleges, setColleges] = useState([]);
  const [collegeId, setCollegeId] = useState(0);
  const [program, setProgram] = useState(null);
  const [programId, setProgramId] = useState(null);
  const [isCreateProgram, setIsCreateProgram] = useState(false);
  const [isEditProgram, setIsEditProgram] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpenProgramDialog = () => setIsCreateProgram(true);
  const handleCloseProgramDialog = () => setIsCreateProgram(false);
  const handleCloseEditProgramDialog = () => setIsEditProgram(false);

  const fetchPrograms = useCallback(
    debounce(() => {
      setLoading(true);
      const payload = {
        program_name: programSearch || undefined,
        college_id: collegeId || undefined,
        page_number: nextPrevPage || currentPage || undefined,
      };
      axiosInstance
        .get(`/programs`, { params: payload })
        .then((response) => {
          const newData = response.data.data;

          // Check if the received data is an array, else set it to an empty array
          if (isArray(newData)) {
            setData(newData);
            setTotalPrograms(response.data.total_records);
            setCurrentPage(response.data.current_page);
            // setNextPrevPage(currentPage);
            setTotalPages(response.data.total_pages);
          } else {
            setData([]); // No opportunities found
            setTotalPrograms(0);
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
          setNextPrevPage(null);
        });
    }, 800),
    [
        programSearch,
      collegeId,
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

  const deleteProgram = (id) => {
    axiosInstance
      .delete(`/program/${id}`)
      .then((res) => {
        const message = res.data.message || "Program deleted successfully.";
        toast.success(message, { transition: Slide });
        fetchPrograms(); // Refresh the list after deletion
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data || "Failed to delete program.";
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
    fetchPrograms();
    return () => {
        fetchPrograms.cancel();
    };
  }, [
    programSearch,
    collegeId,
    fetchPrograms,
    currentPage,
    nextPrevPage,
  ]);

  useEffect(() => {
    axiosInstance
      .get("/college/names")
      .then((res) => {
        console.log(res)
        setColleges(res.data.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  function handleClearFilter() {
    setProgramSearch("");
    setCollegeId(0);
  }

  const breadcrumbs = [
    { title: "Opportunities", href: "/admin/opportunities", isDisabled: false },
    { title: "Programs", href: "#", isDisabled: true },
];

  return (
    <div className="w-full sm:mt-0 sm:ml-20 z-0">
      <Header breadcrumbs={breadcrumbs} />

      <div className="rounded border mt-4 mx-2 sm:mx-6">
        <p className="py-4 pl-4 bg-blue-950 text-white rounded-t">Programs</p>
        <div className="flex flex-col sm:flex-row my-4 mx-3 justify-between">
          <div className="flex flex-col sm:flex-row justify-evenly">
            <div className="flex flex-row rounded border mx-2 mb-2 sm:mb-1 w-full sm:w-52 h-7">
              <input
                type="text"
                placeholder="Search program name"
                className="w-full text-xs outline-none px-1"
                onChange={(e) => setProgramSearch(e.target.value)}
                value={programSearch}
                disabled={loading || error}
              />
              <button className="flex items-center justify-center w-12">
                <IoIosSearch className="text-lg" />
              </button>
            </div>
            <div className="flex flex-row rounded border mx-2 mb-2 sm:mb-1 w-full sm:w-44 h-7">
              <select
                className="w-full text-sm px-2 outline-none"
                value={collegeId}
                disabled={loading || error}
                onChange={(e) => {
                    setCollegeId(e.target.value);
                }}
              >
                <option value="">Select College</option>
                {colleges?.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name}
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
                onClick={handleOpenProgramDialog}
                disabled={loading || error}
              >
                CREATE PROGRAM
              </button>
            </div>
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
                  {data?.map((program) => (
                    <tr key={program.id}>
                      <td className="px-6 py-4 text-center align-middle">
                        {program.id}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {program.program_name}
                      </td>
                      
                      <td className="px-6 py-4 text-center align-middle">
                        {program.college_name}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {program.status ? (
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
                              setProgram(program);

                            }}
                          >
                            Edit
                          </button>
                          
                          <button
                            className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 mx-1 my-1 sm:my-0 rounded"
                            onClick={() => {
                                setProgramId(program.id);
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
                  Total Programs : {totalPrograms}
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
                  Do You want to delete this Program?
                </h3>
                <button
                  className={`text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-6 py-2.5 text-center mr-2 `}
                  onClick={() => deleteProgram(programId)}
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
      {isCreateProgram && (
        <ProgramFormDialog
          headerText={"Create Program"}
          open={isCreateProgram}
          close={() => handleCloseProgramDialog()}
          onCollegeUpdate={fetchPrograms}
        />
      )}
      {isEditProgram && (
        <ProgramFormDialog
          headerText={"Update Program"}
          open={isEditProgram}
          close={() => handleCloseEditProgramDialog()}
          onCollegeUpdate={fetchPrograms}
          editMode={true}
          {...program}
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

export default Programs;
 