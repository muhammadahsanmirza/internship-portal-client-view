/* eslint-disable react/prop-types */
import { useState } from "react";
import parse from "html-react-parser";
import { CiGlobe } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { SlCalender } from "react-icons/sl";
import { GoClockFill } from "react-icons/go";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../interceptors/axiosInstance";

function ViewOpportunity({ opportunity, isOpen, onClose }) {
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentId, setStudentId] = useState(0);
  // const [opportunityId, setOpportunityId] = useState(0);
  const [applyForStudent, setApplyForStudent] = useState(false);

  if (!opportunity) {
    return null;
  }

  const closeStudentListDialog = () => {
    setApplyForStudent(false);
  };

  const fetchStudentsList = () => {
    console.log("Button Clicked - Fetch Students List");
    setApplyForStudent(true);
    axiosInstance
      .get("/students")
      .then((res) => {
        console.log("Raw Student List:", res.data);

        // Filter students where "profile_complete" is true
        const filteredStudents = res.data.filter(
          (student) => student.profile_complete
        );

        console.log("Filtered Student List:", filteredStudents);

        setStudentList(filteredStudents); // Set the filtered list in the state
      })
      .catch((err) => {
        console.error("Error fetching students list:", err);
      });
  };

  function applyOnBehalfOfStudent(){
    console.log('Applying on behalf of student:', studentId,opportunity.id);
    axiosInstance.post(`/opportunity/applicant/${studentId}`, { opportunity_id:opportunity.id })
     .then((res) => {
        console.log("Application sent successfully:", res.data.message);
        const message = res.data.message || 'Applied';
        setApplyForStudent(false);
        setStudentId(0)
        toast.success(message, { transition: Slide });
      })
      .catch((err) => {
        console.error("Error sending application:", err);
        const message = err.data.message || 'Error Occured';
        toast.error(message, { transition: Slide });
      });
    
  }
  const handleStudentSelection = (e) => {
    setStudentId(e.target.value);
    setSelectedStudent(e.target.value);
  };

  return (
    <div>
      <div
        className={`fixed inset-0 z-20 bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } ${applyForStudent ? "blur-sm" : ""}`}
      >
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-20 px-4">
          <div className="flex items-center">
            <p className="mr-2 font-bold">{opportunity.company_name}</p>
            <a
              href={opportunity.external_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CiGlobe />
            </a>
          </div>
          <button onClick={onClose}>
            <RxCross2 className="text-xl" />
          </button>
        </div>

        <div
          className="px-4 pb-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 112px)" }}
        >
          <h3 className="text-lg font-bold">{opportunity.name}</h3>
          <div className="text-xs text-gray-400">
            {opportunity.program_name}
          </div>
          <p className="font-semibold my-2">Opportunity Description</p>
          <div className="text-sm">{parse(opportunity.description)}</div>
        </div>

        <div className="flex justify-between items-center py-2 border-t sticky bottom-0 bg-white px-4 z-20">
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <SlCalender className="mx-1" />
              <div>
                <p className="text-xs">Start Date</p>
                <p className="text-sm">{opportunity.start_date}</p>
              </div>
            </div>
            <div className="flex items-center">
              <GoClockFill className="mx-1" />
              <div>
                <p className="text-xs">End Date</p>
                <p className="text-sm">{opportunity.end_date}</p>
              </div>
            </div>
          </div>
          <button
            className="text-white bg-blue-950 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-5"
            onClick={fetchStudentsList}
          >
            Apply on behalf of student
          </button>
        </div>
      </div>

      {applyForStudent && (
        <>
          <div className="fixed inset-0 z-30 bg-black opacity-50"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="border shadow relative bg-white sm:w-full md:w-1/4 z-30 rounded">
              <div className="flex justify-around px-6 bg-blue-950 py-2">
                <h3 className="text-xl font-normal text-white">Select Student</h3>
                <button
                  type="button"
                  className="text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  onClick={closeStudentListDialog}
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
              <div className="px-6 py-2 pt-0 text-center">
                <fieldset className="mb-0 border border-gray-300 rounded-lg p-0 mt-4">
                  <legend className="text-sm font-medium text-left">Select Student</legend>
                  <select
                    className="border rounded-lg px-4 text-base w-full outline-none border-none mb-1"
                    value={selectedStudent}
                    onChange={handleStudentSelection}
                  >
                      <option value=''>Select Student</option>
                    {studentList?.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </fieldset>
              </div>
              <div className="flex justify-end p-4">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={()=>applyOnBehalfOfStudent(studentId)}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
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

export default ViewOpportunity;
