"use client";
import {
  faMagnifyingGlass,
  faQuestion,
  faBars,
  faEllipsis
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActivitiesScroll from "@/components/admincomponents/activities_scroll";
import { useState } from "react";

const data = [
  {
    id: "KA4556",
    legalName: "Samuel Woodfree",
    agentType: "individual",
    location: "Ifako Ijaye",
    landSize: "5000m",
    amount: "N 200,000,000,000",
    document: "C of O, Receipt",
  },
  {
    id: "KA4556",
    legalName: "Samuel Woodfree",
    agentType: "incorporated",
    location: "Ifako Ijaye",
    landSize: "5000m",
    amount: "N 200,000,000,000",
    document: "C of O, Receipt",
  },
  {
    id: "KA4556",
    legalName: "Samuel Woodfree",
    agentType: "individual",
    location: "Ifako Ijaye",
    landSize: "5000m",
    amount: "N 200,000,000,000",
    document: "C of O, Receipt",
  },
];

export default function AdminHome() {
  const [active, setActive] = useState("pending");
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
            className="w-full h-full pl-12 border border-gray-300 bg-transparent rounded-md"
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
      <div className="pt-6">
        <div className="flex border-b text-lg gap-8 ">
          <button
            onClick={() => setActive("pending")}
            className={`relative rounded-sm py-3 ${
              active === "pending"
                ? "border-b-4 border-[#8DDB90]  text-[#181336] font-semibold"
                : "text-[#515B6F]"
            }`}
          >
            Pending Briefs
            <span className="absolute top-0  bg-[#FF4F4F] text-white rounded-full px-2 py-0.5 ">
              5
            </span>
          </button>
          <button
            onClick={() => setActive("overdue")}
            className={`relative rounded-sm py-3 ${
              active === "overdue"
                ? "border-b-4 border-[#8DDB90]  text-[#181336] font-semibold"
                : "text-[#515B6F]"
            }`}
          >
            Overdues Briefs
            <span className="absolute top-0  bg-[#e51313] text-white rounded-full px-2 py-0.5">
              25
            </span>
          </button>
        </div>
        <div className="mt-6 p-4 border rounded-md bg-white px-8">
          <h3 className="text-[#2E2C34] text-xl font-semibold  py-6">
            Approve Briefs
          </h3>
          <div className="flex justify-between">
            <select className="w-1/6 border border-gray-300 bg-transparent rounded-md p-3">
              <option value="1">Type</option>
              <option value="2">Pending</option>
              <option value="3">Overdue</option>
            </select>
            <div className="flex gap-3 border px-3 justify-center items-center rounded-md">
              <FontAwesomeIcon
                icon={faBars}
                size="lg"
                className="text-[#2E2C34]"
              />
              <span className="text-[#2E2C34]">Filter</span>
            </div>
          </div>
          <table className="w-full mt-6">
            <thead>
              <tr className="border-b bg-[#fafafa] text-left text-sm font-medium text-gray-600">
                <th className="p-3">
                  <input type="checkbox" />
                </th>
                <th className="p-3">ID</th>
                <th className="p-3">Legal Name</th>
                <th className="p-3">Type of Agent</th>
                <th className="p-3">Location</th>
                <th className="p-3">Land Size</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Document</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b text-sm text-gray-700 hover:bg-gray-50"
                >
                  <td className="p-3">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3">{item.id}</td>
                  <td className="p-3">{item.legalName}</td>
                  <td
                    className={`p-3 font-semibold ${
                      item.agentType === "individual"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {item.agentType}
                  </td>
                  <td className="p-3">{item.location}</td>
                  <td className="p-3">{item.landSize}</td>
                  <td className="p-3 font-bold">{item.amount}</td>
                  <td className="p-3">{item.document}</td>
                  <td className="p-3 cursor-pointer text-2xl">
                    <FontAwesomeIcon icon={faEllipsis} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
