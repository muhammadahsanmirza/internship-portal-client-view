import React from 'react'
import { RxCrossCircled } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { TbBulb } from "react-icons/tb";
import ReactTable from './ReactTable';

function EditAndViewOpportunities() {
    return (
        <div className='w-[calc(100%-5rem)] ml-20 z-0'>
            <div className="flex flex-col border-b-2 border-gray-300 px-10 py-3" style={{ height: '4.1rem' }}>
                <h2 className="font-bold">College of Engineering Internship</h2>
                <p className='text-sm text-gray-400'>Opportunities</p>
            </div>
            <div className='rounded border mt-4 mx-6'>
                <p className='py-4 pl-4  bg-blue-950 text-white rounded-t'>Opportunities</p>
                <div className='flex flex-row my-4 mx-3 justify-between'>
                    <div className='flex flex-row justify-evenly'>
                        <div className='flex flex-row rounded border mx-2 w-52' >
                            <input
                                type="text"
                                placeholder='Search opportunity name'
                                className='w-full text-xs outline-none'
                            />
                            <button className='flex items-center justify-center w-12'>
                                <TbBulb className='text-lg' />
                            </button>
                        </div>
                        <div className='flex flex-row rounded border mx-2 w-52' >
                            <input
                                type="text"
                                placeholder='Search company name'
                                className='w-full text-xs outline-none'
                            />
                            <button className='flex items-center justify-center w-12'>
                                <IoIosSearch className=' text-lg' />
                            </button>
                        </div>
                        <div className='flex flex-row rounded border mx-2 w-44'>
                            <select className='w-full text-xs outline-none'>
                                <option>ABC</option>
                                <option>XYZ</option>
                                <option>IJK</option>
                                <option>LMN</option>
                            </select>
                        </div>
                        <div className='flex flex-row rounded border mx-2 w-44' >
                            <select className='w-full text-xs outline-none'>
                                <option>ABC</option>
                                <option>XYZ</option>
                                <option>IJK</option>
                                <option>LMN</option>
                            </select>
                        </div>

                    </div>
                    <div className='flex flex-row rounded bg-yellow-500 text-white px-2 py-1 text-sm items-center justify-center mx-1'>
                        <RxCrossCircled />
                        <button className='mx-1 text-xs' style={{ minWidth: '100px', padding: '5px 10px' }}>
                            CLEAR FILTERS
                        </button>
                    </div>
                </div>
                <div>
                <ReactTable />

            </div>
            </div>
            
        </div>
    )
}

export default EditAndViewOpportunities
