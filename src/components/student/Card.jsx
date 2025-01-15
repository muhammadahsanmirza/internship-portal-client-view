/* eslint-disable react/prop-types */
import { CiClock2 } from "react-icons/ci";
import { MdOutlinePersonOutline } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
function Card({
  company_name,
  name,
  program_name,
  start_date,
  end_date,
  detail,
}) {
  const calculateDaysAgo = (date) => {
    const now = Date.now();
    const start = new Date(date).getTime();
    const difference = now - start;
    return Math.floor(difference / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex flex-col w-full sm:w-80 lg:w-[35rem] rounded-lg shadow-md border   sm:mx-4 lg:mx-2">
      <div className="px-6 py-3">
        <div className="flex flex-row justify-between items-center w-full ">
          <div className="flex flex-row items-start gap-2 ">
            <p className="text-[22px] font-medium text-wrap  leading-6">
              {name}
            </p>

            <p className="text-xs bg-green-600 font-medium text-nowrap text-white py-[2px] px-2 rounded ">
              New Post
            </p>
          </div>
          <div className="flex flex-row items-center text-[14px] text-[#697281] gap-2 text-nowrap">
            <CiClock2 />
            <p>{calculateDaysAgo(start_date)} days ago</p>
          </div>
        </div>
        <p className="text-base text-[#697281] ">{company_name}</p>

        <div className="flex flex-row  my-3 items-center gap-5">
          <p className="text-xs font-medium py-1 px-2 bg-[#EBF2FD] text-[#3575E2] rounded text-wrap max-w-[230px]">
            {program_name}
          </p>
          <div className=" text-xs font-medium flex flex-row items-center bg-[#F4F1FD] text-[#8B6CE3] rounded px-2 py-1">
            <MdOutlinePersonOutline />
            <p>50 Applicants</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-3 bg-[#F4F7F9] px-6 py-3">
        <div className="flex flex-row items-center gap-2 text-gray-400">
          <CiCalendar className="w-4 h-4" />
          <p className="text-xs font-normal ">
            Deadline: <span className="font-medium">{end_date}</span>
          </p>
        </div>
        <button type="button" className="text-[#214C90] hover:text-white border border-[#214C90] hover:bg-[#214C90]  focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 "
        onClick={detail}>
        Detail</button>
      </div>
    </div>
  );
}

export default Card;
