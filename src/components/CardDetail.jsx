import React, { useState } from 'react';
import parse from 'html-react-parser';
import axiosInstance from '../interceptors/axiosInstance';
import ResumeDialog from './ResumeDialog';
import { CiGlobe } from 'react-icons/ci';
import { RxCross2 } from 'react-icons/rx';
import { SlCalender } from 'react-icons/sl';
import { GoClockFill } from 'react-icons/go';
import { TiWarning } from 'react-icons/ti';
import { FaSpinner } from 'react-icons/fa';

function CardDetail({ card, setApplied, onClose }) {
  const [completeProfile, setCompleteProfile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState('');

  const toggleDialog = () => {
    setIsDialogOpen((prev) => !prev);
  };

  const handleFileUploadSuccess = () => {
    setCompleteProfile(true);
    toggleDialog();
  };

  const handleApplyNow = async () => {
    console.log(card.id);
    setApplyLoading(true);
    try {
      const res = await axiosInstance.get('/student/profile');
      console.log(res.data.profile_complete);
      if (res.data.profile_complete) {
        setCompleteProfile(true);
        const requestBody = { opportunity_id: card.id };
        const response = await axiosInstance.post(
          '/opportunity/applicant',
          requestBody
        );
        console.log('Applied successfully', response.data);
        setApplied(true);
        setNotFoundMessage(response.data.message || 'Applied successfully');
      } else {
        setCompleteProfile(false);
        toggleDialog();
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log(err.response.data);
        setNotFoundMessage(err.response.data || 'Profile not found.');
      } else {
        console.error('Error fetching profile:', err);
      }
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 sm:relative flex flex-col mx-4 mt-4 bg-white px-4 shadow-lg sm:mt-0 sm:mx-0 sm:mb-0 sm:w-1/2"
    >
      <div className="flex justify-between items-center pb-2">
        <div className="flex items-center">
          <p className="mr-2 font-bold">{card.company_name}</p>
          <a href={card.external_link} target="_blank" rel="noopener noreferrer">
            <CiGlobe />
          </a>
        </div>
        <button onClick={onClose}>
          <RxCross2 className="text-xl" />
        </button>
      </div>
      <div className="my-4 flex-grow overflow-y-auto">
        <h3 className="text-lg font-bold">{card.name}</h3>
        <div className="text-xs text-gray-400">{card.program_name}</div>
        <p className="font-semibold my-2">Opportunity Description</p>
        <div className="text-sm">{parse(card.description)}</div>
      </div>
      <div
        className="flex justify-between items-center p-4 border-t mt-auto bg-white sm:fixed sm:bottom-0 sm:w-full"
      >
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <SlCalender className="mx-2" />
            <div>
              <p className="text-xs">Start Date</p>
              <p className="text-sm">{card.start_date}</p>
            </div>
          </div>
          <div className="flex items-center">
            <GoClockFill className="mx-2" />
            <div>
              <p className="text-xs">End Date</p>
              <p className="text-sm">{card.end_date}</p>
            </div>
          </div>
        </div>
        <button
          className="bg-blue-950 text-white px-4 py-2 rounded flex items-center justify-center"
          onClick={handleApplyNow}
          disabled={applyLoading || card.applied}
        >
          {applyLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
          {applyLoading ? 'Applying...' : card.applied ? 'Applied' : 'Apply Now'}
        </button>
      </div>
      {isDialogOpen && (
        <ResumeDialog
          isOpen={isDialogOpen}
          onClose={toggleDialog}
          onUpload={handleFileUploadSuccess}
        />
      )}
      {notFoundMessage && (
        <div className="flex items-center justify-center mt-4 px-4 py-3 bg-red-500 text-white rounded-lg shadow-md">
          <TiWarning className="text-xl mr-2" />
          <span className="text-sm font-medium">{notFoundMessage}</span>
        </div>
      )}
    </div>
  );
}

export default CardDetail;
