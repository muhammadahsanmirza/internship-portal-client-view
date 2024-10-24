import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosSearch, IoIosAddCircleOutline } from "react-icons/io";
import { BsCheckCircle } from "react-icons/bs";
import { debounce, isArray } from "lodash";
import Header from "./Header";
import axiosInstance from "../interceptors/axiosInstance";
import ProgramFormDialog from "./ProgramFormDialog";
import DeleteDialog from "./DeleteDialog";
import Loader from "./Loader";
import Pagination from "./Pagination";
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
        .then((res) => {
          const newData = res.data.data;

          // Check if the received data is an array, else set it to an empty array
          if (isArray(newData)) {
            setData(newData);
            setTotalPrograms(res.data.total_records);
            setCurrentPage(res.data.current_page);
            // setNextPrevPage(currentPage);
            setTotalPages(res.data.total_pages);
          } else {
            setData([]); // No opportunities found
            setTotalPrograms(0);
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
    [programSearch, collegeId, currentPage, nextPrevPage]
  );

  // To Delete a Program

  const deleteProgram = (id) => {
    axiosInstance
      .delete(`/program/${id}`)
      .then((res) => {
        const message = res.data.message || "Program deleted successfully.";
        toast.success(message, { transition: Slide });
        fetchPrograms(); // Refresh the list after deletion
      })
      .catch((err) => {
        const errorMessage = err.response?.data || "Failed to delete program.";
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
  }, [programSearch, collegeId, fetchPrograms, currentPage, nextPrevPage]);

  useEffect(() => {
    axiosInstance
      .get("/college/names")
      .then((res) => {
        console.log(res);
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
    <div className="w-full sm:mt-0 lg:ml-20 z-0 ">
      <Header breadcrumbs={breadcrumbs} />

      <div className="rounded border mt-4 mx-2 sm:mx-6">
        <p className="py-4 pl-4 bg-blue-950 text-white rounded-t">Programs</p>
        <div className="flex flex-col md:flex-col lg:flex-row md:gap-4 lg:flex-nowrap md:justify-between my-4 mx-3 ">
          <div className="flex flex-col sm:flex-row justify-evenly md:flex-nowrap  md:justify-evenly lg:flex-nowrap gap-2 lg:gap-0 mx-2">
            <div className="flex flex-row rounded border w-full sm:w-52 h-7 md:w-80 md:h-10 lg:w-48 lg:mx-1 lg:h-8 xl:w-52">
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
            <div className="flex flex-row rounded border w-full sm:w-52 h-7 md:w-80 md:h-10 lg:w-48 lg:mx-1 lg:h-8 xl:w-52">
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
          <div className="flex flex-col md:flex-row-reverse lg:flex-row justify-evenly sm:justify-around mx-2  sm:mt-0 md:mx-18 gap-0 md:gap-0 lg:gap-0 xl:ml-36 xl:justify-evenly">
            <div className="flex flex-row rounded bg-yellow-500 hover:bg-yellow-600 text-black sm:px-0 md:px-2  text-sm items-center justify-center sm:mx-1 mt-2 sm:mt-0 h-7  md:w-80 md:h-10 md:mx-0 lg:w-32 lg:h-8 lg:mx-2 xl:w-52">
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
            <div className="flex flex-row rounded bg-blue-950 text-white px-1 text-sm items-center justify-center mt-2 sm:mt-0 h-7  md:w-80 md:h-10 md:mx-0 lg:w-32 lg:h-8 lg:mx-2 xl:w-52">
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
              {data.length !== 0 && (
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
                              setIsEditProgram(true);
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
            totalText={"Programs"}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalPrograms}
            onPageChange={() => {
              setNextPrevPage(currentPage + 1);
            }}
          />
        </div>
      </div>
      {confirmDialogOpen && (
        <DeleteDialog
          title={"Program"}
          open={confirmDialogOpen}
          noCallback={closeConfirmDialog}
          yesCallback={() => deleteProgram(programId)}
        />
      )}
      {isCreateProgram && (
        <ProgramFormDialog
          headerText={"Create Program"}
          open={isCreateProgram}
          close={() => handleCloseProgramDialog()}
          onProgramUpdate={fetchPrograms}
        />
      )}
      {isEditProgram && (
        <ProgramFormDialog
          headerText={"Update Program"}
          open={isEditProgram}
          close={() => handleCloseEditProgramDialog()}
          onProgramUpdate={fetchPrograms}
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
