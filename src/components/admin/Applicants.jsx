import { useState, useEffect, useCallback } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { TbBulb } from "react-icons/tb";
import { debounce, isArray } from "lodash";
import axiosInstance from "../../interceptors/axiosInstance";


import {Header, Loader, Pagination} from '../index.js'

function Applicants() {
  const [data, setData] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [opportunitySearch, setOpportunitySearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPrevPage, setNextPrevPage] = useState(currentPage);
  const [totalPages, setTotalPages] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplicants = useCallback(
    debounce(() => {
      setLoading(true);
      const payload = {
        opportunity_name: opportunitySearch || undefined,
        user_name: studentSearch || undefined,
        program_id: programId || undefined,
        page_number: nextPrevPage || currentPage || undefined,
      };
      axiosInstance
        .get(`opportunity/applicants`, { params: payload })
        .then((response) => {
          console.log(response);
          const newData = response.data.data;

          // Check if the received data is an array, else set it to an empty array
          if (isArray(newData)) {
            setData(newData);
            setTotalApplicants(response.data.total_records);
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.total_pages);
          } else {
            setData([]);
            setTotalApplicants(0);
            setCurrentPage(null);
            setTotalPages(1);
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
          setNextPrevPage(null);
        });
    }, 800),
    [opportunitySearch, studentSearch, programId, currentPage, nextPrevPage]
  );

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
    setOpportunitySearch("");
    setStudentSearch("");
    setProgramId(0);
    setCurrentPage(null);
  }

  const breadcrumbs = [
    { title: "Opportunities", href: "/admin/opportunities", isDisabled: false },
    { title: "Applicants", href: "#", isDisabled: true },
  ];

  return (
    <div className="w-full sm:mt-0 lg:ml-20 z-0 ">
      <Header breadcrumbs={breadcrumbs} />

      <div className="rounded border mt-4 mx-2 sm:mx-6">
        <p className="py-4 pl-4 bg-blue-950 text-white rounded-t">Applicants</p>
        <div className="flex flex-col md:flex-col lg:flex-row md:gap-4 lg:flex-nowrap md:justify-between my-4 mx-3 ">
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
          </div>
          <div className="flex flex-col md:flex-row lg:flex-row justify-evenly md:justify-end sm:justify-around mx-2  sm:mt-0 md:mx-18 gap-0 md:gap-0 lg:gap-0 xl:ml-36 xl:justify-evenly">
            <div className="flex flex-row rounded bg-yellow-500 hover:bg-yellow-600 text-black px-2 text-sm items-center justify-center sm:mx-1 mt-2 sm:mt-0 h-7 md:w-56">
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
                    Opportunity
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
                    Applied On
                  </th>
                </tr>
              </thead>

              {data.length !== 0 && (
                <tbody>
                  {data?.map((applicant) => (
                    <tr key={applicant.id}>
                      <td className="px-6 py-4 text-center align-middle">
                        {applicant.id}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {applicant.student_name}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {applicant.email}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {applicant.opportunity}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {applicant.students_program}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {applicant.applied_on}
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
            totalText={"Applicants"}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalApplicants}
            onPageChange={() => {
              setNextPrevPage(currentPage + 1);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Applicants;
