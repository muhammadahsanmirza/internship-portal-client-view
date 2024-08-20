/* eslint-disable react/prop-types */
import { useState } from "react";
import parse from "html-react-parser";
import { CiGlobe } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { SlCalender } from "react-icons/sl";
import { GoClockFill } from "react-icons/go";
import axiosInstance from "../interceptors/axiosInstance";

function ViewOpportunity({ opportunity, isOpen, onClose }) {
  const [applyForStudent,setApplyForStudent] = useState(false);
  if (!opportunity) {
    return null; // Return null if opportunity is not defined
  }

  const studentsList = ()=>{
    setApplyForStudent(true);
    axiosInstance.get('')
    .then(()=>{

    })
    .catch(()=>{
      console.error('Error fetching students list');
    })

  }

  return (
    <div
      className={`fixed inset-0 z-20 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
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
        <div className="text-xs text-gray-400">{opportunity.program_name}</div>
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
        <button className="text-white bg-blue-950 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-5">
          Apply on behalf of student
        </button>
      </div>
      {applyForStudent && (
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
    </div>
  );
}

export default ViewOpportunity;
