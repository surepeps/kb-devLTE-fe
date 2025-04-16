/** @format */

'use client';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import filterIcon from '@/svgs/filterIcon.svg';
import Select from 'react-select';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { useState } from 'react';
import EllipsisOptions from './ellipsisOptions';
import { usePageContext } from '@/context/page-context';

export default function PreferenceAttention({ totalBriefData }: { totalBriefData: any[] }) {
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

  const [openRow, setOpenRow] = useState<number | null>(null);
  const { dashboard, setDashboard } = usePageContext();
  const data = totalBriefData;

  return (
    <motion.div
      initial={{ y: 90, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className='mt-6 p-4 border rounded-md bg-white w-full lg:max-w-[1128px] px-8 mr-2 overflow-hidden md:overflow-x-auto'>
      <h3 className='text-[#FF3D00] text-xl font-semibold  py-6'>
        Preference require attention
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

        <div className='flex md:w-[initial] w-fit gap-3 cursor-pointer border px-3 justify-center items-center rounded-md h-[40px] md:h-[initial]'>
          <Image
            src={filterIcon}
            alt='filter icon'
            width={24}
            height={24}
            className='w-[24px] h-[24px]'
          />
          <span className='text-[#2E2C34]'>Filter</span>
        </div>
      </div>
      <div className='w-full overflow-x-auto md:overflow-clip mt-6'>
        <table className='min-w-[900px] md:w-full border-collapse'>
          <thead className='bg-[#fafafa] text-center text-sm font-medium text-gray-600'>
            <tr className='border-b'>
              <th className='p-3'>
                <input title='checkbox' type='checkbox' />
              </th>
              <th className='p-3'>Date</th>
              <th className='p-3'>Property Type</th>
              <th className='p-3'>Location</th>
              <th className='p-3'>Property Price</th>
              <th className='p-3'>Document</th>
              <th className='p-3'>Full details</th>
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
                <td className='p-3'>{item.createdAt}</td>
                <td className='p-3'>{item.propertyType}</td>
                <td className='p-3'>{item.location}</td>
                <td className='p-3 font-bold'>{item.amount}</td>
                <td className='p-3'>{item.document}</td>
                {/* <td
                  className={`p-3 font-semibold ${
                    item.agentType === 'individual'
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}>
                  {item.agentType}
                </td> */}
                {/* <td className='p-3'>{item.landSize}</td> */}
                <td className='p-3 cursor-pointer text-2xl'>
                  <FontAwesomeIcon
                    // onClick={() => {
                    //   setOpenRow(openRow === index ? null : index);
                    // }}
                    icon={faEllipsis}
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
    </motion.div>
  );
}

const statsOptions = [
  { value: '1', label: 'Type' },
  { value: '2', label: 'Pending' },
  { value: '3', label: 'Overdue' },
];
