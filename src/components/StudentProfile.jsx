import React, { useEffect, useState } from 'react';
import Header from './Header';
import Loader from './Loader';
import axiosInstance from '../interceptors/axiosInstance';
import { RiAccountCircleFill } from "react-icons/ri";
import { SiAdobeacrobatreader } from "react-icons/si";
import { MdFileDownload, MdFileUpload } from "react-icons/md";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StudentProfile() {
  const breadcrumbs = [
    { title: 'Opportunities', href: '/student/opportunities', isDisabled: false },
    { title: 'Student Profile', href: '#', isDisabled: true },
  ];

  const [data, setData] = useState({});
  const [userId, setUserId] = useState(false);
  const [resumeId, setResumeId] = useState(false);
  const [completeProfile, setCompleteProfile] = useState(false);

  const [fileBlob, setFileBlob] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notFoundMessage, setNotFoundMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/student/profile');
        const profileData = res.data.data;
        console.log(profileData)
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
          setFileName(null);
          setResumeId(null);
          toggleDialog();
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNotFoundMessage(err.response.data.message || 'Profile not found.');
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

  const handleFileChange = (event) => {
    setErrorMessage(null);
    console.log("Insidehandle File")

    const file = event.target.files[0];
    const maxFileSize = 2 * 1024 * 1024;

    if (file) {
      if (file.type !== 'application/pdf') {
        setErrorMessage('Invalid file format. Please upload a PDF file.');
        setSelectedFile(null);
        return;
      }

      if (file.size > maxFileSize) {
        setErrorMessage('File size is more than the allowed 2MB.');
        setSelectedFile(null);
        return;
      }

      setErrorMessage(null);
      setSelectedFile(file);
    console.log("Inside handle File-->",file)

    }
  };

  const handleFileUpload = async () => {
    setLoading(true);
    setErrorMessage(null);
    console.log("Inside File upload")

    if (selectedFile) {
      const formData = new FormData();
      formData.append('new_file', selectedFile);
      let url = `/student/profile`;
      if(resumeId&& !userId){
        url = `/student/profile?resume_id=${resumeId}`;
        console.log("Resume id url-->",url)
      }
      if(resumeId && userId){
        let url = `/student/profile?resume_id=${resumeId}&user_id=${userId}`;
        console.log("User id url-->",url)

      }


      try {
        const response = await axiosInstance.put(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully:', response.data);
        toast.success('File uploaded successfully');
        setIsFileUploaded(true);

      } catch (error) {
        setIsFileUploaded(true);
        console.error('Error uploading file:', error);
        toast.error('Error uploading file');
      } finally {
        setSelectedFile(null);
        setLoading(false);
        setIsDialogOpen(false);
      }
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

      {loading && <Loader />}

      {!loading && notFoundMessage && (
        <div className="text-center text-red-500 mt-4">
          {notFoundMessage}
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
                  className="select-none rounded  text-white  transition-all hover:shadow-lg active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none mx-3 my-1 text-xs"
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

          {isDialogOpen && (
            <div
              className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
              onClick={toggleDialog}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
              >
                <div className="flex items-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-950">
                  Upload Resume
                </div>
                <div className="relative p-4 font-sans text-base antialiased font-light leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500 bg-white">
                  <div className="flex items-center justify-center w-full ">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-blue-950 rounded-lg cursor-pointer bg-gray-100 hover:bg-blue-50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 bg">
                        <svg
                          className="w-8 h-8 mb-4 text-blue-950"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-blue-950">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF files only
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="mt-2 text-sm text-blue-600">
                      Selected file: {selectedFile.name}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="mt-2 text-sm text-red-500">
                      {errorMessage}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 justify-end p-4 shrink-0 text-blue-gray-500">
                  <button
                    data-ripple-dark="true"
                    onClick={toggleDialog}
                    className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg middle none center hover:bg-red-500 hover:text-white active:bg-red-500/30"
                  >
                    Cancel
                  </button>
                  <button
                    data-ripple-light="true"
                    onClick={handleFileUpload}
                    className="middle none center rounded bg-blue-950 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-blue-700/40 active:opacity-[0.85]"
                    disabled={!selectedFile}
                  >
                    Upload File
                  </button>
                </div>
              </div>
            </div>
          )}
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
