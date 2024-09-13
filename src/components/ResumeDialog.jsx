/* eslint-disable react/prop-types */
import { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../interceptors/axiosInstance';

function ResumeDialog({ isOpen, onClose, onUpload, resumeId, userId }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setErrorMessage(null);
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
    }
  };

  const handleFileUpload = async () => {
    setLoading(true);
    setErrorMessage(null);

    if (selectedFile) {
      const formData = new FormData();
      formData.append('new_file', selectedFile);
      let url = `/student/profile`;
      if (resumeId && !userId) {
        url = `/student/profile?resume_id=${resumeId}`;
      }
      if (resumeId && userId) {
        url = `/student/profile?resume_id=${resumeId}&user_id=${userId}`;
      }

      try {
        const response = await axiosInstance.put(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('File uploaded successfully');
        onUpload();
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Error uploading file');
      } finally {
        setSelectedFile(null);
        setLoading(false);
        onClose();
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative m-4 w-full max-w-lg lg:max-w-xl xl:max-w-2xl min-w-[90%] sm:min-w-[80%] md:min-w-[70%] lg:min-w-[60%] xl:min-w-[50%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
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
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
                onClick={onClose}
                className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg middle none center hover:bg-red-500 hover:text-white active:bg-red-500/30"
              >
                Cancel
              </button>
              <button
                data-ripple-light="true"
                onClick={handleFileUpload}
                className="middle none center rounded bg-blue-950 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-blue-700/40 active:opacity-[0.85]"
                disabled={!selectedFile || loading}
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ResumeDialog;
