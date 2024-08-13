import React, { useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";

import Header from "./Header";

function OpportunityForm() {
  const breadcrumbs = [
    { title: "Opportunities", href: "/admin/opportunities", isDisabled: false },
    { title: "Opportunity Form", href: "#", isDisabled: true },
  ];
  const editor = useRef(null);
  const {
    register,
    handleSubmit,
    watch, 
    setValue,
    formState: { errors },
  } = useForm();
const description = watch("description", ""); // Initialize description with an empty string

  const onSubmit = (data,e) => {
    e.preventDefault();
    console.log(data);
  };

  useEffect(() => {
    register("description", { required: "Description is required." }); // Register with validation
  }, [register]);
  
  return (
    <div className="w-full sm:mt-0 sm:ml-20 z-0">
      <Header breadcrumbs={breadcrumbs} />
      <form
        className="rounded border mt-4 sm:mx-6 md:mx-auto md:my-10 md:max-w-5xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="py-4 pl-4 bg-blue-950 text-white rounded-t font-bold text-center">
          Create Opportunity
        </p>
        <div className="">
          <p className="text-blue-600 mx-6 mt-4">General Information</p>
          <div className="rounded border mt-1 mx-2 sm:mx-6">
            <div className="w-full">
              <div className="flex flex-wrap justify-around mb-6">
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-name"
                  >
                    Opportunity Name
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.opportunityName
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-opportunity-name"
                    type="text"
                    placeholder="Name"
                    {...register("opportunityName", {
                      required: "Name is required.",
                    })}
                  />
                  {errors.opportunityName && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.opportunityName.message}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-email"
                  >
                    Contact Email
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-opportunity-email"
                    type="email"
                    placeholder="xyz@gmail.com"
                    {...register("email", {
                      required: "Email is required.",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address.",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-external-link"
                  >
                    External Link
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.externalLink ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-opportunity-external-link"
                    type="text"
                    placeholder="http://xyz.com"
                    {...register("externalLink", {
                      required: "Link is required.",
                      
                    })}
                  />
                  {errors.externalLink && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.externalLink.message}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-company-name"
                  >
                    Company Name
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.companyName ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-company-name"
                    type="text"
                    placeholder="Name"
                    {...register("companyName", {
                      required: "Field is required.",
                    })}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-contact-person"
                  >
                    Contact Person
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.contactPerson
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-contact-person"
                    type="text"
                    placeholder="+12345678"
                    {...register("contactPerson", {
                      required: "Name is required.",
                    })}
                  />
                  {errors.contactPerson && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.contactPerson.message}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-program-select"
                  >
                    Select Program
                  </label>
                  <div className="relative">
                    <select
                      className={`block appearance-none w-full bg-gray-200 border ${
                        errors.program ? "border-red-500" : "border-gray-200"
                      } text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white`}
                      id="grid-program-select"
                      {...register("program", {
                        required: "Field is required.",
                      })}
                    >
                      <option value="">Select a program</option>
                      <option value="program1">Program 1</option>
                      <option value="program2">Program 2</option>
                      <option value="program3">Program 3</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12l-4-4h8l-4 4z" />
                      </svg>
                    </div>
                  </div>
                  {errors.program && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.program.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-8 my-2 mx-4">
                <label
                  className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                  htmlFor="grid-description"
                >
                  Description
                </label>
                {/* <JoditEditor
                  ref={editor}
                  value=""
                  tabIndex={1} // tabIndex of textarea
                  onBlur={(newContent) => {}}
                  onChange={(newContent) => {}}
                /> */}
                <JoditEditor
                  ref={editor}
                  value={description || ""} // Use description from watch
                  tabIndex={1} // tabIndex of textarea
                  onBlur={(newContent) =>
                    setValue("description", newContent, {
                      shouldValidate: true,
                    })
                  } // Validate on blur
                  onChange={(newContent) =>
                    setValue("description", newContent, {
                      shouldValidate: true,
                    })
                  } // Validate on change
                />
                {errors.description && (
                  <p className="text-red-500 text-xs px-4">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <p className="text-blue-600 mx-6 mt-4">Eligibility Criteria</p>
          <div className="rounded border mt-1 mx-2 sm:mx-6">
            <div className="w-full">
              <div className="flex flex-wrap justify-around mb-6">
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-major-select"
                  >
                    Major
                  </label>
                  <div className="relative">
                    <select
                      className={`block appearance-none w-full bg-gray-200 border ${
                        errors.major ? "border-red-500" : "border-gray-200"
                      } text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white`}
                      id="grid-major-select"
                      {...register("major", {
                        required: "Field is required.",
                      })}
                    >
                      <option value="">Select Major</option>
                      <option value="major1">Major 1</option>
                      <option value="major2">Major 2</option>
                      <option value="major3">Major 3</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12l-4-4h8l-4 4z" />
                      </svg>
                    </div>
                  </div>
                  {errors.major && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.major.message}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-cgpa"
                  >
                    CGPA
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.cgpa ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-opportunity-cgpa"
                    type="text"
                    placeholder="CGPA"
                    {...register("cgpa", { required: "CGPA is required." })}
                  />
                  {errors.cgpa && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.cgpa.message}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-credit-hours"
                  >
                    Credit Hours
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.creditHours ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-credit-hours"
                    type="text"
                    placeholder="Credit Hours"
                    {...register("creditHours", {
                      required: "Credit Hours are required.",
                    })}
                  />
                  {errors.creditHours && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.creditHours.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form fields for Availability */}

        <div className="">
          <p className="text-blue-600 mx-6 mt-4">Availability</p>
          <div className="rounded border mt-1 mx-2 sm:mx-6">
            <div className="w-full">
              <div className="flex flex-wrap justify-around mb-6">
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-start-date"
                  >
                    Start Date
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.startDate ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-opportunity-start-date"
                    type="date"
                    {...register("startDate", {
                      required: "Start Date is required.",
                    })}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-end-date"
                  >
                    End Date
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.endDate ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-opportunity-end-date"
                    type="date"
                    {...register("endDate", {
                      required: "End Date is required.",
                    })}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-publish-select"
                  >
                    Published
                  </label>
                  <div className="relative">
                    <select
                      className={`block appearance-none w-full bg-gray-200 border ${
                        errors.major ? "border-red-500" : "border-gray-200"
                      } text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white`}
                      id="grid-publish-select"
                      {...register("publish")}
                    >
                      <option value="unpublished">Un Published</option>
                      <option value="published">Published</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12l-4-4h8l-4 4z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center my-4 pb-10">
          <button
            type="submit"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-md text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default OpportunityForm;
