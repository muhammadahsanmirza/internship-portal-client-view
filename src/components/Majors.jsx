import { useState, useEffect, useCallback, useMemo } from "react";
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
import DeleteDialog from "./DeleteDialog";

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
          console.log("MAJORS===>", res);
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
    [majorSearch, programId, currentPage, nextPrevPage]
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
        setMajorId(null);
        fetchMajors(); // Refresh the list after deletion
      })
      .catch((err) => {
        const errorMessage = err.response?.data || "Failed to delete Major.";
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
  }, [majorSearch, programId, fetchMajors, currentPage, nextPrevPage]);

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
    <div className="w-full sm:mt-0 lg:ml-20 z-0 ">
      <Header breadcrumbs={breadcrumbs} />

      <div className="rounded border mt-4 mx-2 sm:mx-6">
        <p className="py-4 pl-4 bg-blue-950 text-white rounded-t">Majors</p>
        <div className="flex flex-col md:flex-col lg:flex-row md:gap-4 lg:flex-nowrap md:justify-between my-4 mx-3 ">
          <div className="flex flex-col sm:flex-row justify-evenly md:flex-nowrap  md:justify-evenly lg:flex-nowrap gap-2 lg:gap-0 mx-2">
            <div className="flex flex-row rounded border w-full sm:w-52 h-7 md:w-80 md:h-10 lg:w-48 lg:mx-1 lg:h-8 xl:w-52">
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
                onClick={handleOpenMajorDialog}
                disabled={loading || error}
              >
                CREATE MAJOR
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
              {data.length !== 0 && (
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
              )}
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
            </table>
          </div>
          <div className="flex flex-row justify-around  items-center py-4 bg-gray-100">
            <div className="flex flex-col items-center md:flex-row sm:justify-around  md:justify-between text-xs">
              <p className=" mx-0 md:mx-6">Total Majors : {totalMajors}</p>
              <p className="mx-0 md:mx-6">Page No. {currentPage}</p>
            </div>
            <div>
              <button
                className="py-1 md:py-2 px-0 md:px-4 hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => {
                  setNextPrevPage(currentPage - 1);
                }}
              >
                Prev
              </button>

              {btnArray.length > 0 &&
                btnArray?.map((btnValue) => (
                  <button
                    key={btnValue}
                    className="py-1 md:py-2 px-0 md:px-4 hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    onClick={() => setCurrentPage(btnValue)}
                  >
                    <p className="">{btnValue}</p>
                  </button>
                ))}
              {currentPage > 3 && (
                <button className="py-1 md:py-2 px-0 md:px-4 hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
                  ...
                </button>
              )}

              <button
                className="py-1 md:py-2 px-1 md:px-4 hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
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
      </div>
      {confirmDialogOpen && (
        <DeleteDialog
          title={"Major"}
          noCallback={closeConfirmDialog}
          yesCallback={() => deleteMajor(programId)}
        />
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
