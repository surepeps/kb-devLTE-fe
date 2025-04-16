/** @format */

'use client';
import { useEffect, useState } from 'react';
import { faBars, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { usePageContext } from '@/context/page-context';
import AgentDetailsBar from './AgentDetailsBar';
import EllipsisOptions from './ellipsisOptions';

export default function IncomingBriefs({ awaitingApprovalCount, data }: { awaitingApprovalCount?: (count: number) => void; data: any[] }) {
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [showFullDetails, setShowFullDetails] = useState<boolean>(false);
  const [detailsToCheck, setDetailsToCheck] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const { dashboard, setDashboard } = usePageContext();

  const formik = useFormik({
    initialValues: {
      selectedStat: {
        value: '1',
        label: 'Type',
      },
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    if (awaitingApprovalCount) {
      awaitingApprovalCount(data.length);
    }
  }, [data]);

  return (
    <>
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className='mt-6 p-4 border rounded-md bg-white px-8'>
        <h3 className='text-[#2E2C34] text-xl font-semibold  py-6'>
          Incoming Briefs
        </h3>
        <div className='flex md:flex-row flex-col gap-2 justify-between'>
          <Select
            className='text-[#2E2C34] text-sm ml-1'
            styles={{
              control: (styles) => ({
                ...styles,
                boxShadow: 'none',
                cursor: 'pointer',
                outline: 'none',
                backgroundColor: '#F9FAFB',
                border: '1px solid #D6DDEB',
                minWidth: '160px',
              }),
            }}
            options={statsOptions}
            defaultValue={statsOptions}
            value={formik.values.selectedStat}
            onChange={(options) => {
              formik.setFieldValue('selectedStat', options);
            }}
          />
          <div className='flex gap-3 border px-3 justify-center items-center rounded-md w-fit md:w-[initial] h-[40px] md:h-[initial] cursor-pointer'>
            <FontAwesomeIcon
              icon={faBars}
              size='lg'
              className='text-[#2E2C34]'
            />
            <span className='text-[#2E2C34]'>Filter</span>
          </div>
        </div>
        <div className='w-full overflow-x-auto md:overflow-clip mt-6'>
          <table className='min-w-[900px] md:w-full border-collapse'>
            <thead>
              <tr className='border-b bg-[#fafafa] text-center text-sm font-medium text-gray-600'>
                <th className='p-3'>
                  <input title='checkbox' type='checkbox' />
                </th>
                <th className='p-3'>ID</th>
                <th className='p-3'>Legal Name</th>
                <th className='p-3'>Type of Agent</th>
                <th className='p-3'>Location</th>
                <th className='p-3'>Land Size</th>
                <th className='p-3'>Amount</th>
                <th className='p-3'>Document</th>
                <th className='p-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className='border-b text-sm text-center text-gray-700 hover:bg-gray-50'>
                  <td className='p-3'>
                    <input title='checkbox' type='checkbox' />
                  </td>
                  <td className='p-3'>{item.id}</td> {/* Truncated ID */}
                  <td className='p-3'>{item.legalName}</td>
                  <td
                    className={`p-3 font-semibold ${
                      item.agentType === 'Individual'
                        ? 'text-red-500'
                        : item.agentType === 'Incoporated Agent'
                        ? 'text-green-500'
                        : 'text-blue-500'
                    }`}>
                    {item.agentType}
                  </td>
                  <td className='p-3'>{item.location}</td>
                  <td className='p-3'>{item.landSize}</td>
                  <td className='p-3 font-bold'>{item.amount}</td>
                  <td className='p-3'>{item.document}</td>
                  <td className='p-3 cursor-pointer text-2xl'>
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      onClick={() => setDetailsToCheck(item)}
                    />
                    {openRow === index && (
                      <EllipsisOptions
                        onApproveBrief={() => {
                          setDashboard({
                            ...dashboard,
                            approveBriefsTable: {
                              ...dashboard.approveBriefsTable,
                              isApproveClicked: true,
                              isRejectClicked: false,
                              isDeleteClicked: false,
                            },
                          });
                        }}
                        onDeleteBrief={() => {
                          setDashboard({
                            ...dashboard,
                            approveBriefsTable: {
                              ...dashboard.approveBriefsTable,
                              isApproveClicked: false,
                              isRejectClicked: false,
                              isDeleteClicked: true,
                            },
                          });
                        }}
                        onRejectBrief={() => {
                          setDashboard({
                            ...dashboard,
                            approveBriefsTable: {
                              ...dashboard.approveBriefsTable,
                              isApproveClicked: false,
                              isRejectClicked: true,
                              isDeleteClicked: false,
                            },
                          });
                        }}
                        closeMenu={setOpenRow}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex justify-end items-center mt-10 gap-1'>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-1 rounded-md ${
              currentPage === 1
                ? 'text-gray-300'
                : 'text-black-500 hover:text-[#8DDB90]'
            }`}
            disabled={currentPage === 1}>
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === index + 1
                  ? 'bg-[#8DDB90] text-white'
                  : ' hover:bg-gray-300'
              }`}>
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className={`px-4 py-1 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-300'
                : 'text-black-500 hover:text-[#8DDB90]'
            }`}
            disabled={currentPage === totalPages}>
            <FaChevronRight />
          </button>
        </div>
      </motion.div>
      {detailsToCheck && (
        <AgentDetailsBar
          user={detailsToCheck}
          onClose={() => setDetailsToCheck(null)}
        />
      )}
    </>
  );
}

const statsOptions = [
  { value: '1', label: 'Type' },
  { value: '2', label: 'Pending' },
  { value: '3', label: 'Overdue' },
];
