import {
  faMagnifyingGlass,
  faQuestion,
  faBars,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActivitiesScroll from "@/components/admincomponents/activities_scroll";
export default function AdminHome() {

  return (
    <section>
      <div className="flex justify-between items-center">
        <div className="w-3/5 mt-2 h-12 flex relative items-center">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="lg"
            className="text-[#A7A9AD] absolute left-3"
          />
          <input
            type="text"
            placeholder="Search for Agent, Briefs"
            className="w-full h-full pl-12 border border-gray-300 rounded-md"
          />
        </div>
        <button className=" bg-black px-1  rounded-full shadow-md">
          <FontAwesomeIcon
            icon={faQuestion}
            color="#fff"
            size="lg"
            className="  bg-[#000] p-2 rounded-full shadow-md"
          />
        </button>
      </div>
      <div className="flex justify-between mt-6 mr-6">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-[#2E2C34]">Dashboard</h2>
          <p className="text-sm text-[#84818A]">
            Showing your Account metrics from
            <span className=""> 1st Jan 2021 to 31st Jan 2021</span>
          </p>
        </div>
        <div className="flex items-center bg-white px-4 rounded-lg">
          <p className="text-[#84818A]">
            Show stats:
            <select className="text-[#2E2C34] text-sm ml-1">
              <option value="1">Today</option>
              <option value="2">Yesterday</option>
              <option value="3">Monthly</option>
              <option value="4">Yearly</option>
            </select>
          </p>
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button className=" bg-[#8DDB90]  w-1/4 py-2 rounded-lg">
          <h3 className="text-[#fff] text-lg font-bold">
            Attention Require Overview
          </h3>
        </button>
        <button className=" bg-[#8DDB90] w-1/5 rounded-lg py-2">
          <h3 className="text-[#fff] text-lg font-bold">Analysis Overview</h3>
        </button>
      </div>
      <div className="bg-white flex flex-col border h-auto rounded-md mt-6 mr-3">
        <div className=" border-b flex justify-between items-center px-6 py-2">
          <h3 className="text-[#2E2C34] text-xl font-medium ">
            Admins Activities
          </h3>
          <div className="flex gap-4">
            <div className="flex gap-2 border p-2 rounded-md">
              <FontAwesomeIcon
                icon={faBars}
                size="lg"
                className="text-[#2E2C34]"
              />
              <span className="text-[#2E2C34]">Filter</span>
            </div>
            <div className="flex gap-2 border p-2 rounded-md">
              <p className="text-[#0B423D]">View admin activities</p>
            </div>
          </div>
        </div>
          <ActivitiesScroll />
        {/* <div className="flex justify-between items-center  px-6 py-2">
          <button className="border rounded-full py:6 px-2 hover:bg-[#8DDB90] hover:text-white">
            <FontAwesomeIcon
              icon={faChevronLeft}
            />
          </button>
          <button className="border rounded-full py:6 px-2 hover:bg-[#8DDB90] hover:text-white">
            <FontAwesomeIcon
              icon={faChevronRight}
            />
          </button>
        </div> */}
      </div>
    </section>
  );
}
