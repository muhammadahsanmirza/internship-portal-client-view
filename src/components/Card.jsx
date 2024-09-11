import React from 'react';

function Card({ company_name, name, program_name, start_date, end_date, detail }) {
    const calculateDaysAgo = (date) => {
        const now = Date.now();
        const start = new Date(date).getTime();
        const difference = now - start;
        return Math.floor(difference / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="flex flex-col w-full sm:w-80 lg:w-96 rounded shadow-md border px-6 py-3 sm:mx-4 lg:mx-2 mt-3">
            <div className="border-b-2 pb-3">
                <div className="flex flex-row my-3">
                    <p className="text-xs font-semibold mr-4">{company_name}</p>
                    <p className="text-xs text-gray-400">{calculateDaysAgo(start_date)} days ago</p>
                </div>
                <p className="text-lg font-bold my-3">{name}</p>
                <p className="text-xs text-gray-400 my-3">{program_name}</p>
            </div>
            <div className="flex flex-row justify-between items-center mt-3">
                <p className="text-xs text-gray-400">{start_date} to {end_date}</p>
                <button className="rounded bg-blue-950 text-white py-2 px-6 text-xs" onClick={detail}>Detail</button>
            </div>
        </div>
    );
}

export default Card;
