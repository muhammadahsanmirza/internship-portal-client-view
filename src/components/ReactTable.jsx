import React, { useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { FaCheck, FaTimes } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import data from "../assets/opportunitiesData";

function ReactTable() {
    const columns = useMemo(
        () => [
            {
                Header: "#",
                accessor: "id",
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Contact Person",
                accessor: "contactPerson",
            },
            {
                Header: "Company Name",
                accessor: "companyName",
            },
            {
                Header: "Program Name",
                accessor: "programName",
            },
            {
                Header: "Published",
                accessor: "published",
                Cell: ({ value }) => (value ? <FaCheck /> : <FaTimes />), // Display icons
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: ({ row }) => (
                    <div className="flex">
                        <button onClick={() => handleEdit(row.original)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 mx-1 rounded ">
                            Edit
                        </button>
                        <button onClick={() => handleView(row.original)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                            View
                        </button>
                    </div>
                ),
            },
        ],
        []
    );


    const handleEdit = (row) => {
        // Handle edit action
        console.log('Edit', row);
    };

    const handleView = (row) => {
        // Handle view action
        console.log('View', row);
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        state: { pageIndex, pageSize },
        pageCount
    } =
        useTable({
            data,
            columns,
            initialState: { pageSize: 5 },
        },
            useSortBy,
            usePagination

        );

    return (
        <div className="container mx-0 w-full" >
            <table {...getTableProps()} className="table-auto w-full">
                <thead className="bg-gray-100">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-2 py-2 relative text-xs">
                                    {column.render("Header")}
                                    {
                                        column.isSorted ? (column.isSortedDesc ? <IoIosArrowDown className="absolute right-0 bottom-2" /> : <IoIosArrowUp className="absolute right-0 bottom-2" />) : null
                                    }
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} className="border-b px-4 py-2 text-xs text-center">
                                            {cell.render("Cell")}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            <div className="flex justify-around items-center py-4 bg-gray-100">
                <div className="flex flex-row justify-between  text-xs">
                    <p className="mx-6">Total Opportunities : {data.length}</p>
                    <p className="mx-6">Page No. {pageIndex + 1}</p>
                </div>
                <div>
                    <button
                        disabled={!canPreviousPage}
                        onClick={previousPage}
                        className={`py-2 px-4 hover:bg-slate-200 ${!canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <MdKeyboardArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                        disabled={!canNextPage}
                        onClick={nextPage}
                        className={`py-2 px-4 hover:bg-slate-200 ${!canNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <MdKeyboardArrowRight className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ReactTable;
