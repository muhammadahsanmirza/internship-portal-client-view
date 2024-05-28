import React from 'react';
import parse from 'html-react-parser';

import { CiGlobe } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { SlCalender } from "react-icons/sl";
import { GoClockFill } from "react-icons/go";

function CardDetail({ card, onClose }) {
  return (
    <div className="flex flex-col mx-4 mt-4 bg-white px-4 shadow-lg h-screen mb-16" style={{ width: '50rem' }}>
      <div className="flex justify-between items-center pb-2">
        <div className="flex items-center">
          <p className="mr-2 font-bold">{card.company_name}</p>
          <a href={card.external_link} target='_blank'><CiGlobe /></a>
        </div>
        <button onClick={onClose}>
          <RxCross2 className="text-xl" />
        </button>
      </div>
      <div className="my-4 flex-grow overflow-y-auto">
        <h3 className="text-lg font-bold">{card.name}</h3>
        <div className='text-xs text-gray-400'>{card.program_name}</div>
        <p className=' font-semibold my-2'>Opportunity Description</p>

        {/* <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: card.description }}></p> */}
        {/* parse(<p className="text-sm" dangerouslySetInnerHTML={{ __html: card.description }}></p>); */}
        <p className="text-sm"> {parse(card.description)}</p>
        

      </div>

      <div className="flex justify-between items-center p-4 border-t mt-auto fixed bottom-0 bg-white ">
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <SlCalender className="mx-2" />
            <div>
              <p className="text-xs">Start Date</p>
              <p className="text-sm">{card.start_date}</p>
            </div>
          </div>
          <div className="flex items-center ">
            <GoClockFill className="mx-2" />
            <div>
              <p className="text-xs">End Date</p>
              <p className="text-sm">{card.end_date}</p>
            </div>
          </div>
        </div>
        <button className="bg-blue-950 text-white px-4 py-2 rounded ml-96">Apply Now</button>
      </div>
    </div>
  );
}

export default CardDetail;
