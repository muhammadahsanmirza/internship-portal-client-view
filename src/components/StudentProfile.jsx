// StudentProfile.jsx
import React, { useEffect, useState } from 'react';
import Header from './Header';
import axiosInstance from '../interceptors/axiosInstance';
import { RiAccountCircleFill } from "react-icons/ri";
import { SiAdobeacrobatreader } from "react-icons/si";
import { MdFileDownload } from "react-icons/md";

function StudentProfile() {
  const breadcrumbs = [
    { title: 'Opportunities', href: '/student/opportunities', isDisabled: false },
    { title: 'Student Profile', href: '#', isDisabled: true },
  ];

  const [data, setData] = useState({});
  const [fileBlob, setFileBlob] = useState(null);
  const [fileName, setFileName] = useState('');
  const [completeProfile, setCompleteProfile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axiosInstance.get('/student/profile')
      .then((res) => {
        console.log(res.data.data);
        setData(res.data.data);
        if (res.data.profile_complete) {
          setCompleteProfile(true);
          setFileName(res.data.file_name);

          if (res.data.file) {
            // Handle potential errors in Base64 decoding
            try {
              const byteCharacters = atob(res.data.file);
              const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: 'application/pdf' });
              setFileBlob(blob);
            } catch (error) {
              console.error("Error decoding Base64 file:", error);
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // Here, you would typically send the file to the server
      // using a POST request with FormData.
      console.log('File to upload:', selectedFile);

      // Close the dialog after file is selected
      setIsDialogOpen(false);
    }
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
            <div className="flex flex-row rounded text-black px-2 py-1 text-sm items-center justify-center ml-24 mr-6 p-1 border gap-1">
              <SiAdobeacrobatreader className='w-4 h-4 text-red-800' />
              <button className="mx-1 text-sm text-gray-500" onClick={downloadFile}>
                click to download
              </button>
              <MdFileDownload className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex flex-row rounded bg-blue-950 text-white px-2 py-1 text-sm items-center justify-center mx-1">
              <button
                className="select-none rounded px-6  text-white  transition-all hover:shadow-lg active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mx-3 my-1 text-xs"
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
            <div className='text-gray-500 ml-12'>Resume not uploaded</div>
          </div>
        )}
        {isDialogOpen && (
          <div
            className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={toggleDialog} // Close dialog on backdrop click
          >
            <div
              onClick={(e) => e.stopPropagation()} // Prevent click inside dialog from closing it
              className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
            >
              <div className="flex items-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
                Upload Resume
              </div>
              <div className="relative p-4 font-sans text-base antialiased font-light leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500">
                <button
                  data-ripple-dark="true"
                  onClick={toggleDialog}
                  className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg middle none center hover:bg-red-500/10 active:bg-red-500/30"
                >
                  Cancel
                </button>
                <button
                  data-ripple-light="true"
                  onClick={handleFileUpload}
                  className="middle none center rounded bg-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85]"
                  disabled={!selectedFile}
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;
