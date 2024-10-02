import { useState, useEffect, useCallback } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { debounce, isArray } from "lodash";
import Header from "./Header";
import axiosInstance from "../interceptors/axiosInstance";
import Loader from "./Loader";

function Students() {
  const [data, setData] = useState([]);
  //   const [totalStudents, setTotalStudents] = useState(0);
  const [opportunitySearch, setOpportunitySearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  //   const [currentPage, setCurrentPage] = useState(1);
  //   const [nextPrevPage, setNextPrevPage] = useState(currentPage);
  //   const [totalPages, setTotalPages] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState(0);
  const [majors, setMajors] = useState([]);
  const [majorId, setMajorId] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplicants = useCallback(
    debounce(() => {
      setLoading(true);
      const payload = {
        student_name: studentSearch || undefined,
        program_id: programId || undefined,
        major_id: majorId || undefined,
        // page_number: nextPrevPage || currentPage || undefined,
      };
      console.log("Payload-->", payload);
      axiosInstance
        .get(`/students`, { params: payload })
        .then((response) => {
          console.log(response);
          // console.log("response.data--->",response.data);
          const newData = response.data;

          // Check if the received data is an array, else set it to an empty array
          if (isArray(newData)) {
            setData(newData);
            // setTotalStudents(response.data.total_records);
            // setCurrentPage(response.data.current_page);
            // setTotalPages(response.data.total_pages);
          } else {
            setData([]);
            // setTotalStudents(0);
            // setCurrentPage(null);
            // setTotalPages(1);
            setError(response.data.message || "No Applicant found");
          }

          setError(null);
        })
        .catch((error) => {
          setData([]); // Clear previous data
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
          //   setNextPrevPage(null);
        });
    }, 800),
    [
      opportunitySearch,
      studentSearch,
      programId,
      majorId,
      //   currentPage,
      //   nextPrevPage,
    ]
  );

  //   const btnArray = useMemo(() => {
  //     const btnArray = [];
  //     for (let i = 1; i < currentPage; i++) {
  //       btnArray.push(i);
  //     }
  //     return btnArray;
  //   }, [currentPage]);

  useEffect(() => {
    fetchApplicants();
    return () => {
      fetchApplicants.cancel();
    };
  }, [
    opportunitySearch,
    studentSearch,
    programId,
    fetchApplicants,
    majorId,
    // currentPage,
    // nextPrevPage,
  ]);

  useEffect(() => {
    axiosInstance
      .get("/program/names")
      .then((res) => {
        console.log("Programs-->", res.data.data);
        setPrograms(res.data.data);
      })
      .catch((error) => {
        setError(error.message);
      });
    axiosInstance
      .get("/majors")
      .then((res) => {
        console.log("Majors-->", res.data.data);
        setMajors(res.data.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  function handleClearFilter() {
    setOpportunitySearch("");
    setStudentSearch("");
    setProgramId(0);
    setMajorId(0);
    // setCurrentPage(null)
  }

  const breadcrumbs = [
    { title: "Opportunities", href: "/admin/opportunities", isDisabled: false },
    { title: "Students", href: "#", isDisabled: true },
  ];

  return (
    <div className="w-full sm:mt-0 lg:ml-20 z-0 ">
      <Header breadcrumbs={breadcrumbs} />

      <div className="rounded border mt-4 mx-2 sm:mx-6">
        <p className="py-4 pl-4 bg-blue-950 text-white rounded-t">Students</p>
        <div className="flex flex-col md:flex-col lg:flex-row md:gap-4 lg:flex-nowrap md:justify-between my-4 mx-3 ">
          <div className="flex flex-col sm:flex-row justify-evenly md:flex-nowrap  md:justify-evenly lg:flex-nowrap gap-2 lg:gap-0 mx-2">
            <div className="flex flex-row rounded border w-full sm:w-52 h-7 md:w-80 md:h-10 lg:w-48 lg:mx-1 lg:h-8 xl:w-52">
              <input
                type="text"
                placeholder="Search student name"
                className="w-full text-xs outline-none px-1"
                onChange={(e) => setStudentSearch(e.target.value)}
                value={studentSearch}
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
                value={majorId}
                disabled={loading || error}
                onChange={(e) => {
                  setMajorId(e.target.value);
                }}
              >
                <option value="">Select Major</option>
                {majors?.map((major) => (
                  <option key={major.id} value={major.id}>
                    {major.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row lg:flex-row justify-evenly md:justify-end sm:justify-around mx-2  sm:mt-0 md:mx-18 gap-0 md:gap-0 lg:gap-0 xl:ml-36 xl:justify-evenly">
            <div className="flex flex-row rounded bg-yellow-500 hover:bg-yellow-600 text-black sm:px-0 md:px-2  text-sm items-center justify-center sm:mx-1 mt-2 sm:mt-0 h-7  md:w-56  md:h-10 md:mx-0 lg:w-32 lg:h-8 lg:mx-2 xl:w-52">
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
                      Student Name
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
                      Major
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center align-middle"
                    >
                      Program Name
                    </th>
                  </tr>
                </thead>
                {data.length !== 0 && (
                <tbody>
                  {data?.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 text-center align-middle">
                        {student.id}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {student.major_name}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {student.program_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
                )}
                <tfoot>
                  {error && (
                <tr>
                  <td colSpan="5" className="text-center">
                    <p className="mt-4 text-red-500 text-center font-bold text-xl">
                      Error: {error}
                    </p>
                  </td>
                </tr>
              )}
              {data.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="text-center">
                    <p className="text-center mt-4 text-gray-500">
                      {error || "No records found."}
                    </p>
                  </td>
                </tr>
              )}
                </tfoot>
              </table>
            </div>
          </div>
      </div>
    </div>
  );
}

export default Students;
