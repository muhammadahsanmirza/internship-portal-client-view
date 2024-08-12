import React from "react";

import Header from "./Header";
import TextEditor from "./TextEditor";
function OpportunityForm() {
  const breadcrumbs = [{ title: "Opportunities", href: "#", isDisabled: true }];

  return (
    <div className="w-full sm:mt-0 sm:ml-20 z-0">
      <Header breadcrumbs={breadcrumbs} />

      <div className="rounded border mt-4 sm:mx-6 md:mx-auto md:my-10 md:max-w-5xl">
        <p className="py-4 pl-4 bg-blue-950 text-white rounded-t font-bold text-center">
          Create Opportunity
        </p>
        <div>
          <p className="text-blue-600 mx-6 mt-4">General Information</p>
          <div className="rounded border mt-1 mx-2 sm:mx-6">
            <form className="w-full">
              <div className="flex flex-wrap justify-around mb-6">
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-name"
                  >
                    Opportunity Name
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white"
                    id="grid-opportunity-name"
                    type="text"
                    placeholder="Name"
                  />
                  <p className="text-red-500 text-xs px-4">Name is required.</p>
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-email"
                  >
                    Contact Email
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white"
                    id="grid-opportunity-email"
                    type="email"
                    placeholder="xyz@gmail.com"
                  />
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-external-link"
                  >
                    External Link
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white"
                    id="grid-opportunity-external-link"
                    type="text"
                    placeholder="http://xyz.com"
                  />
                  <p className="text-red-500 text-xs px-4">Link is required.</p>
                </div>
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-company-name"
                  >
                    Company Name
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white"
                    id="grid-company-name"
                    type="text"
                    placeholder="Name"
                  />
                  <p className="text-red-500 text-xs px-4">
                    Field is required.
                  </p>
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-contact-person"
                  >
                    Contact Person
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white"
                    id="grid-contact-person"
                    type="text"
                    placeholder="+12345678"
                  />
                  <p className="text-red-500 text-xs px-4">Name is required.</p>
                </div>

                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-program-select"
                  >
                    Select Program
                  </label>
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-program-select"
                  >
                    <option value="">Select a program</option>
                    <option value="program1">Program 1</option>
                    <option value="program2">Program 2</option>
                    <option value="program3">Program 3</option>
                  </select>
                  <p className="text-red-500 text-xs px-4">
                    Field is Required.
                  </p>
                </div>
              </div>
              <div className="px-8 my-2 mx-4">
                <label
                  className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                  htmlFor="grid-program-select"
                >
                  Description
                </label>
                <TextEditor />
              </div>
            </form>
          </div>
        </div>
        <div>
          <p>Eligibility Criteria</p>
          <div className="rounded border mt-4 mx-2 sm:mx-6">
            Opportunity Name
          </div>
        </div>
        <div>
          <p>Availability</p>
          <div className="rounded border mt-4 mx-2 sm:mx-6">
            Opportunity Name
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpportunityForm;
