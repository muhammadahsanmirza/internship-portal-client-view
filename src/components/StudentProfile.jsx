import React, { useEffect, useState } from 'react';
import Header from './Header';
import Loader from './Loader';
import axiosInstance from '../interceptors/axiosInstance';
import { RiAccountCircleFill } from "react-icons/ri";
import { SiAdobeacrobatreader } from "react-icons/si";
import { MdFileDownload, MdFileUpload } from "react-icons/md";
import { TiWarning } from "react-icons/ti";

import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResumeDialog from './ResumeDialog';

function StudentProfile() {
  const breadcrumbs = [
    { title: 'Opportunities', href: '/student/opportunities', isDisabled: false },
    { title: 'Student Profile', href: '#', isDisabled: true },
  ];

  const [data, setData] = useState({});
  const [userId, setUserId] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [completeProfile, setCompleteProfile] = useState(false);

  const [fileBlob, setFileBlob] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/student/profile');
        const profileData = res.data.data;
        console.log("User Data useEffect-->",profileData);
        setData(profileData);
        if (res.data.profile_complete) {
          setUserId(profileData.user_id);
          setCompleteProfile(true);
          setFileName(res.data.file_name);
          setResumeId(profileData.resume_id);
          if (res.data.file) {
            const byteCharacters = atob(res.data.file);
            const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            setFileBlob(blob);
          }
        } else {
          setUserId(null);
          setCompleteProfile(false);
          setFileName('');
          setResumeId(null);
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
        setLoading(false);
      }
    };

    fetchData();
  }, [isFileUploaded]);

  const downloadFile = () => {
    if (fileBlob) {
      const url = URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleFileUploadSuccess = () => {
    setIsFileUploaded(true);
    toggleDialog();
  };

  return (
    <div className="w-[calc(100%-5rem)] ml-20 z-0">
      <Header breadcrumbs={breadcrumbs} />
      <div className="flex flex-row h-12 bg-blue-950 items-center ">
        <div className="text-gray-400 ml-36">
          <RiAccountCircleFill className='w-10 h-8' />
        </div>
        <p className='text-lg text-white font-bold'>Student Profile</p>
      </div>

      {loading && <Loader />}

      {!loading && notFoundMessage && (
        <div className="flex items-center justify-center mt-4 px-4 py-3 bg-red-500 text-white shadow-md">
          <TiWarning className="text-xl mr-2" />
          <span className="text-sm font-medium">{notFoundMessage}</span>
        </div>
      )}


      {!loading && !notFoundMessage && (
        <div className='card rounded shadow-lg w-5/12 mt-8 h-80 border' style={{ marginLeft: '11.5rem' }}>
          <div className='flex flex-row gap-16 items-center border-b p-3 m-3'>
            <div className='text-sm font-bold'>Name</div>
            <div className='text-gray-500 ml-12'>{data.user_name}</div>
          </div>
          <div className='flex flex-row gap-16 items-center border-b p-3 m-3'>
            <div className='text-sm font-bold'>Email</div>
            <div className='text-gray-500 ml-12'>{data.email}</div>
          </div>
          <div className='flex flex-row gap-11 items-center border-b p-3 m-3'>
            <div className='text-sm font-bold'>Program</div>
            <div className='text-gray-500 ml-12'>{data.program}</div>
          </div>

          <div className='flex flex-row gap-16 items-center border-b p-3 m-3'>
            <div className='text-sm font-bold'>Major</div>
            <div className='text-gray-500 ml-12'>{data.major}</div>
          </div>

          {completeProfile ? (
            <div className='flex flex-row items-center p-3 m-3'>
              <div className='text-sm font-bold'>Resume</div>
              <div className="flex flex-row rounded text-black py-1 text-sm items-center justify-center ml-24 mr-6 p-1 border gap-1">
                <SiAdobeacrobatreader className='w-4 h-4 text-red-800' />
                <button className="mx-1 text-sm text-gray-500" onClick={downloadFile}>
                  click to download
                </button>
                <MdFileDownload className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex flex-row rounded bg-blue-950 text-white px-2 py-1 text-sm items-center justify-center mx-1">
                <button
                  className="select-none rounded text-white transition-all hover:shadow-lg active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mx-3 my-1 text-xs"
                  onClick={toggleDialog}
                  data-ripple-light="true"
                  data-dialog-target="animated-dialog"
                >
                  UPDATE RESUME
                </button>
              </div>
            </div>
          ) : (
            <div className='flex flex-row items-center p-3 m-3'>
              <div className='text-sm font-bold'>Resume</div>
              <div className="flex flex-row rounded text-black py-1 text-lg items-center justify-center ml-24 mx-8 p-1 border gap-10 h-10 px-2">
                <SiAdobeacrobatreader className='w-4 h-4 text-red-800' />
                <button className="mx-1 text-sm text-gray-500" onClick={toggleDialog}>
                  click to upload
                </button>
                <MdFileUpload className="w-4 h-4 text-green-500" />
              </div>
            </div>
          )}

          {isDialogOpen && <ResumeDialog
            isOpen={isDialogOpen}
            onClose={toggleDialog}
            onUpload={handleFileUploadSuccess} // Pass success handler
            resumeId={resumeId}
            userId={userId}
            setIsFileUploaded={setIsFileUploaded}
          />}
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </div>
  );
}

export default StudentProfile;
