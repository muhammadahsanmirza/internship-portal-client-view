/* eslint-disable react/prop-types */

import { useMemo } from "react";

const Pagination = ({
  totalText,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const btnArray = useMemo(() => {
    const btnArray = [];
    for (let i = 1; i < currentPage; i++) {
      btnArray.push(i);
    }
    return btnArray;
  }, [currentPage]);

  return (
    <div className="flex flex-row justify-around items-center py-4 bg-gray-100">
      <div className="flex flex-col items-center md:flex-row sm:justify-around md:justify-between text-xs">
        <p className="mx-0 md:mx-6">
          Total {totalText} : {totalItems}
        </p>
        <p className="mx-0 md:mx-6">Page No. {currentPage}</p>
      </div>
      <div>
        <button
          className="py-1 md:py-2 px-1 md:px-4 text-center hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={currentPage === 1 || currentPage === null}
          //   onClick={() => onPageChange(currentPage - 1)}
          onClick={onPageChange}
        >
          Prev
        </button>

        {btnArray.length > 0 &&
          btnArray.map((btnValue) => (
            <button
              key={btnValue}
              className="py-1 md:py-2 px-0 md:px-4 hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              onClick={() => onPageChange(btnValue)}
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
          disabled={currentPage === totalPages || currentPage === null}
          onClick={onPageChange}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

// * Previous Code
{/*
import {useMemo} from react
const btnArray = useMemo(() => {
     const btnArray = [];
     for (let i = 1; i < currentPage; i++) {
       btnArray.push(i);
     }
     return btnArray;
   }, [currentPage]);
    
    <div className="flex flex-row justify-around  items-center py-4 bg-gray-100">
  <div className="flex flex-col items-center md:flex-row sm:justify-around  md:justify-between text-xs">
    <p className=" mx-0 md:mx-6">Total Programs : {totalPrograms}</p>
    <p className="mx-0 md:mx-6">Page No. {currentPage}</p>
  </div>
  <div>
    <button
      className="py-1 md:py-2 px-1 md:px-4 text-center hover:bg-slate-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
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
</div>; */}
