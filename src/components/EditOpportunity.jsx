/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import JoditEditor from "jodit-react";
// import 'jodit/build/jodit.min.css';
import { useForm } from "react-hook-form";
import axiosInstance from "../interceptors/axiosInstance";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function EditOpportunity(props) {
  // console.log('ProgramId=>',props.program_id)
  // console.log("Props---->", props);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [programs, setPrograms] = useState([]);
  const [majors, setMajors] = useState([]);
  const editor = useRef(null);
  const {
    register,
    handleSubmit,
    // watch,
    setValue,
    formState: { errors },
    trigger,
    clearErrors,
    reset,
  } = useForm({
    defaultValues: {
      name: props.name || "",
      email: props.email || "",
      external_link: props.external_link || "",
      company_name: props.company_name || "",
      contact_person: props.contact_person || "",
      program: props.program_id || -1,
      description: props.description || "",
      major: props.major_id || -1,
      cgpa: props.cgpa || -1,
      credit_hours: props.credit_hours || -1,
      start_date: props.start_date || "",
      end_date: props.end_date || "",
      published: props.published,
    },
  });
  const [publishedStatus, setPublishedStatus] = useState("");

  // Set the initial value from props when the component mounts
  useEffect(() => {
    setPublishedStatus(props.published ? "published" : "unpublished");
  }, [props.published]);

  const handleStatusChange = (e) => {
    const selectedValue = e.target.value;
    setPublishedStatus(selectedValue);
    setValue("published", selectedValue);
  };
  // const description = watch("description", ""); // Initialize description with an empty string

  const onSubmit = (data) => {
    console.log("Before-->", data.published);
    const formattedData = {
      name: data.name,
      description: data.description,
      email: data.email,
      external_link: data.external_link,
      contact_person: data.contact_person,
      published: data.published === "published",
      program_id: parseInt(data.program),
      cgpa: parseFloat(data.cgpa),
      credit_hours: parseInt(data.credit_hours),
      major_id: parseInt(data.major),
      company_name: data.company_name,
      start_date: data.start_date,
      end_date: data.end_date,
    };
    console.log("After-->", formattedData.published);

    axiosInstance
      .put(`/opportunity/${props.id}`, formattedData)
      .then((res) => {
        console.log("Opportunity Created Successfully--->", res.data);
        clearErrors(); // Clear error messages
        // trigger();
        setValue("description", ""); // Reset description field
        reset();
        const message = res.data.message || "Opportunity Updated successfully.";
        toast.success(message, { transition: Slide });
      })
      .catch((err) => {
        console.log(err.message);
        const errorMessage =
          err.data.message || "Opportunity Updated successfully.";
        toast.error(errorMessage, { transition: Slide });
      })
      .finally(() => {
        setTimeout(() => {
          props.onClose();
          props.onOpportunityUpdate(); // Call any additional update handlers
        }, 500);
      });
  };

  useEffect(() => {
    register("description", { required: "Description is required." }); // Register with validation
  }, [register]);

  useEffect(() => {
    axiosInstance
      .get("/programs")
      .then((res) => {
        // console.log("Programs --->", res.data.data);
        setPrograms(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    axiosInstance
      .get("/majors")
      .then((res) => {
        // console.log(res.data.data);
        setMajors(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);
    // Reset end date if it is before the selected start date
    if (endDate && new Date(selectedStartDate) > new Date(endDate)) {
      setEndDate(null);
    }
  };

  // Handle end date change
  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    setEndDate(selectedEndDate);
    // Reset start date if it is after the selected end date
    if (startDate && new Date(selectedEndDate) < new Date(startDate)) {
      setStartDate(null);
    }
  };
  return (
    <div className=" fixed inset-0 z-20 bg-white w-full mx-0= mt-0 overflow-y-auto">
      <form
        className="border md:mx-auto md:max-w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="fixed top-0  right-0 left-0 flex justify-between items-center bg-blue-950 text-white font-bold px-4">
          <div className="flex justify-between items-center">
            <button onClick={() => props.onClose()} className="close-button">
              <RxCross2 className="text-xl" />
            </button>
            <p className="py-4 pl-4 text-center">Update Opportunity</p>
          </div>
          <button
            type="submit"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-md text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Update
          </button>
        </div>
        <div className=" mt-16">
          <p className="text-blue-600 mx-6 mt-4">General Information</p>
          <div className="rounded border mt-1 mx-2 sm:mx-6">
            <div className="w-full">
              <div className="flex flex-wrap justify-evenly mb-6">
                {/* Opportunity Name Field */}
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-name"
                  >
                    Opportunity Name
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.name ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-opportunity-name"
                    type="text"
                    defaultValue={props.name}
                    placeholder="Name"
                    {...register("name", {
                      required: "Name is required.",
                      pattern: {
                        value: /^(?=.*[A-Za-z])[\S\sA-Za-z0-9]*$/,
                        message: "Only numbers are not allowed.",
                      },
                      onBlur: () => trigger("name"),
                      onFocus: (e) => {
                        clearErrors("name");
                        setValue("name", e.target.value);
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                {/* Email Field  */}
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
                    defaultValue={props.email}
                    placeholder="xyz@gmail.com"
                    {...register("email", {
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address.",
                      },
                      onBlur: () => trigger("email"),
                      onFocus: () => clearErrors("email"),
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                {/* External Link Field  */}
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-external-link"
                  >
                    External Link
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.external_link
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-opportunity-external-link"
                    type="text"
                    placeholder="http://xyz.com"
                    defaultValue={props.external_link}
                    {...register("external_link", {
                      required: "Link is required.",
                      pattern: {
                        value: /^(https?:\/\/)([\w-]+\.)+[\w-]{2,6}(\/.*)?$/i,
                        message:
                          "Enter a valid URL starting with http:// or https://",
                      },
                      onBlur: () => trigger("external_link"),
                      onFocus: () => clearErrors("external_link"),
                    })}
                  />
                  {errors.external_link && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.external_link.message}
                    </p>
                  )}
                </div>

                {/* Company Name Field  */}
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-company-name"
                  >
                    Company Name
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.company_name ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-company-name"
                    type="text"
                    placeholder="Name"
                    defaultValue={props.company_name}
                    {...register("company_name", {
                      required: "Field is required.",
                      pattern: {
                        value: /^(?=.*[A-Za-z])[\S\sA-Za-z0-9]*$/,
                        message: "Only numbers are not allowed.",
                      },
                      onBlur: () => trigger("company_name"),
                      onFocus: () => clearErrors("company_name"),
                    })}
                  />
                  {errors.company_name && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.company_name.message}
                    </p>
                  )}
                </div>
                {/* Contact Person Field  */}
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-contact-person"
                  >
                    Contact Person
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.contact_person
                        ? "border-red-500"
                        : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-contact-person"
                    type="tel"
                    placeholder="+12345678"
                    defaultValue={props.contact_person}
                    {...register("contact_person", {
                      required: "Contact Number is required.",
                      pattern: {
                        value: /^\+?\d+$/,
                        message: "Invalid Characters ",
                      },
                      onBlur: () => trigger("contact_person"),
                      onFocus: () => clearErrors("contact_person"),
                    })}
                  />
                  {errors.contact_person && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.contact_person.message}
                    </p>
                  )}
                </div>
                {/* Select Program Field  */}
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
                      defaultValue={props.program_id}
                      {...register("program", {
                        required: "Field is required.",
                        onBlur: () => trigger("program"),
                        onFocus: () => clearErrors("program"),
                      })}
                    >
                      <option value="">Select a program</option>
                      {programs.map((program) => (
                        <option
                          key={program.id}
                          value={program.id}
                          selected={props.program_id == program.id}
                        >
                          {program.program_name}
                        </option>
                      ))}
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
              {/* Select Editor Field  */}
              <div className="px-8 my-2 mx-4">
                <label
                  className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                  htmlFor="grid-description"
                >
                  Description
                </label>
                <JoditEditor
                  ref={editor}
                  value={props.description || ""} // Use description from watch
                  tabIndex={1} // tabIndex of textarea
                  onBlur={(newContent) => {
                    setValue("description", newContent, {
                      shouldValidate: true,
                    });
                    trigger("description");
                  }} // Validate on blur
                  onChange={(newContent) =>
                    setValue("description", newContent, {
                      shouldValidate: true,
                    })
                  } // Validate on change
                  onFocus={() => clearErrors("description")}
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
                {/* Select Major Field  */}
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
                        onBlur: () => trigger("major"),
                        onFocus: () => clearErrors("major"),
                      })}
                    >
                      <option value="">Select Major</option>
                      {majors.map((major) => (
                        <option
                          key={major.id}
                          value={major.id}
                          selected={props.major_id == major.id}
                        >
                          {major.name}
                        </option>
                      ))}
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
                {/* CGPA Field */}
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
                    type="number"
                    placeholder="CGPA"
                    defaultValue={props.cgpa}
                    min="0"
                    max="5"
                    step="0.01" // This allows two decimal places
                    {...register("cgpa", {
                      required: "CGPA is required.",
                      validate: (value) => {
                        const num = parseFloat(value);
                        if (num < 0 || num > 5) {
                          return "CGPA must be between 0 and 5";
                        }
                        if (num === 5 && value.includes(".")) {
                          return "CGPA of 5 cannot have decimal places";
                        }
                        return true;
                      },
                      onBlur: () => trigger("cgpa"),
                      onFocus: () => clearErrors("cgpa"),
                    })}
                  />
                  {errors.cgpa && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.cgpa.message}
                    </p>
                  )}
                </div>

                {/* Credit Hours Field */}
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-credit-hours"
                  >
                    Credit Hours
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.credit_hours ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-credit-hours"
                    defaultValue={props.credit_hours}
                    min="0"
                    type="number"
                    placeholder="Credit Hours"
                    {...register("credit_hours", {
                      required: "Credit Hours are required.",
                      pattern: {
                        value: /^\d+$/,
                        message: "Credit Hours must be positive Numbers only",
                      },
                      onBlur: () => trigger("credit_hours"),
                      onFocus: () => clearErrors("credit_hours"),
                    })}
                  />
                  {errors.credit_hours && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.credit_hours.message}
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
                {/* Start Date Field */}
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-start-date"
                  >
                    Start Date
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.start_date ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-opportunity-start-date"
                    type="date"
                    max={endDate || ""} // Disable dates before today or end date
                    defaultValue={props.start_date || ""}
                    {...register("start_date", {
                      required: "Start Date is required.",
                      onBlur: () => trigger("start_date"),
                      onFocus: () => clearErrors("start_date"),
                    })}
                    onChange={handleStartDateChange}
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.start_date.message}
                    </p>
                  )}
                </div>

                {/* End Date Field */}
                <div className="w-full md:w-64 px-3 my-2 mx-4 md:mb-0">
                  <label
                    className="block tracking-wide text-gray-700 text-xs font-bold mb-1"
                    htmlFor="grid-opportunity-end-date"
                  >
                    End Date
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                      errors.end_date ? "border-red-500" : "border-gray-200"
                    } rounded py-1 px-2 mb-1 leading-tight focus:outline-none focus:bg-white`}
                    id="grid-opportunity-end-date"
                    type="date"
                    min={startDate || ""} // Disable dates after the selected start date
                    defaultValue={props.end_date || ""}
                    {...register("end_date", {
                      required: "End Date is required.",
                      validate: {
                        notBeforeStartDate: (value) => {
                          return (
                            !startDate ||
                            new Date(value) >= new Date(startDate) ||
                            "End Date cannot be before Start Date."
                          );
                        },
                      },
                      onBlur: () => trigger("end_date"),
                      onFocus: () => clearErrors("end_date"),
                    })}
                    onChange={handleEndDateChange}
                  />
                  {errors.end_date && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.end_date.message}
                    </p>
                  )}
                </div>

                {/* Published Unpublished Field */}
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
                        errors.published ? "border-red-500" : "border-gray-200"
                      } text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white`}
                      id="grid-publish-select"
                      value={publishedStatus}
                      onChange={handleStatusChange}
                    >
                      <option value="published">Published</option>
                      <option value="unpublished">UnPublished</option>
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
                  {errors.published && (
                    <p className="text-red-500 text-xs px-4">
                      {errors.published.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex justify-center items-center my-4 pb-10">
          
        </div> */}
      </form>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default EditOpportunity;
