/* eslint-disable react/prop-types */
import { CiClock2, CiCalendar } from "react-icons/ci";
import { MdOutlinePersonOutline } from "react-icons/md";
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
    <div className="flex flex-col w-full md:w-[22.6rem] lg:w-[36rem] 2xl:w-[35rem]  rounded-lg hover:shadow-md transition-shadow duration-300 ease-in-out border  my-2 sm:mx-[7px] ">
      <div className="px-5 py-4 sm:py-5">
        <div className="flex flex-row justify-between items-center w-full ">
          <div className="flex flex-row items-start gap-2 ">
            <p className="text-[22px] font-medium text-wrap max-w-52 leading-6">
              {name.length > 8 ? `${name.slice(0, 8)}...` : name}
            </p>

            {new Date(start_date).toDateString() ===
              new Date().toDateString() && (
              <p className="text-xs bg-green-600 mt-1 font-medium text-nowrap self-start text-white py-[2px] px-2 mx-3 rounded">
                New Post
              </p>
            )}
          </div>
          <div className="flex flex-row mt-1 items-center self-start text-[14px] text-[#697281] gap-1 text-nowrap">
            <CiClock2 className=" stroke-[1px]" />
            {new Date(start_date).toDateString() ===
            new Date().toDateString() ? (
              <p className="">Posted Today</p>
            ) : (
              <p className="">Posted {calculateDaysAgo(start_date)} days ago</p>
            )}
          </div>
        </div>
        <p className="text-base text-[#697281] pt-1 pb-2">{company_name}</p>

        <div className="flex flex-col lg:flex-row  my-0 items-start lg:items-center gap-2 lg:gap-4 ">
          <p className="text-xs font-medium py-1 px-2 bg-[#EBF2FD] text-[#3575E2] rounded text-wrap max-w-[230px]">
            {program_name}
          </p>
          <div className=" text-xs font-medium flex flex-row items-center bg-[#F4F1FD] text-[#8B6CE3] rounded px-2 py-1 gap-1">
            <MdOutlinePersonOutline className="w-4 h-4" />
            <p>50 Applicants</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center bg-[#F4F7F9] px-5 py-4">
        <div className="flex flex-row items-center gap-2 text-[#697281]">
          <CiCalendar className="w-5 h-5 " />
          <p className="text-[14px] font-normal ">
            Deadline: <span className="font-medium">{end_date}</span>
          </p>
        </div>
        <button
          type="button"
          className="text-[#214C90] hover:text-white border border-[#214C90] hover:bg-[#214C90]  focus:ring-4 focus:outline-none  font-medium rounded-[4px] text-sm px-4 py-2 text-center me-2 mr-0 "
          onClick={detail}
        >
          Detail
        </button>
      </div>
    </div>
  );
}

export default Card;
