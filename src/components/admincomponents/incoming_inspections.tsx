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
import { FaTimes } from 'react-icons/fa';

const data = [
  {
    id: 'KA4556',
    buyerContact: {
      name: 'Samuel Woodfree',
      email: 'samuel.woodfree@example.com',
      phone: '08012345678',
    },
    agentInCharge: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '08087654321',
    },
    propertyToInspect: {
      address: '5000m land in Ifako Ijaye',
      type: 'Residential',
      size: '5000m²',
    },
    inspectionDate: '2023-10-01',
    briefDetails: {
      purpose: 'Inspection for property purchase',
      notes: 'Buyer is interested in immediate purchase.',
    },
  },
  {
    id: 'KA4557',
    buyerContact: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '08023456789',
    },
    agentInCharge: {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '08098765432',
    },
    propertyToInspect: {
      address: '3000m land in Ikeja',
      type: 'Commercial',
      size: '3000m²',
    },
    inspectionDate: '2023-10-05',
    briefDetails: {
      purpose: 'Inspection for property lease',
      notes: 'Lease duration is negotiable.',
    },
  },
  {
    id: 'KA4558',
    buyerContact: {
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '08034567890',
    },
    agentInCharge: {
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      phone: '08065432109',
    },
    propertyToInspect: {
      address: '2000m land in Yaba',
      type: 'Industrial',
      size: '2000m²',
    },
    inspectionDate: '2023-10-10',
    briefDetails: {
      purpose: 'Inspection for property sale',
      notes: 'Property requires minor renovations.',
    },
  },
];

export default function PendingBriefs() {
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Buyer Contact');
  const [selectedInspection, setSelectedInspection] = useState<any>(null);

  const { dashboard, setDashboard } = usePageContext();

  const toggleSidebar = (inspection: any) => {
    setSelectedInspection(inspection);
    setIsSidebarOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className='mt-6 p-4 border rounded-md bg-white w-full lg:max-w-[1128px] px-8 mr-2 overflow-hidden md:overflow-x-auto'>
        <h3 className='text-[#2E2C34] text-xl font-semibold  py-6'>
          Buyers Inspections
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
            <thead className='bg-[#fafafa] text-left text-sm font-medium text-gray-600'>
              <tr className='border-b'>
                <th className='p-3'>
                  <input title='checkbox' type='checkbox' />
                </th>
                <th className='p-3'>Inpection ID</th>
                <th className='p-3'>Buyer contact</th>
                <th className='p-3'>Agent in charge</th>
                <th className='p-3'>Property to inspect</th>
                <th className='p-3'>Inspection Date</th>
                <th className='p-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className='border-b text-sm text-gray-700 hover:bg-gray-50'>
                  <td className='p-3'>
                    <input title='checkbox' type='checkbox' />
                  </td>
                  <td className='p-3'>{item.id}</td>
                  <td className='p-3'>
                    <span
                      className='text-blue-500 cursor-pointer underline'
                      onClick={() => toggleSidebar(item)}>
                      View Details
                    </span>
                  </td>
                  <td className='p-3'>
                    <span
                      className='text-blue-500 cursor-pointer underline'
                      onClick={() => toggleSidebar(item)}>
                      View Details
                    </span>
                  </td>
                  <td className='p-3'>
                    <span
                      className='text-blue-500 cursor-pointer underline'
                      onClick={() => toggleSidebar(item)}>
                      View Details
                    </span>
                  </td>
                  <td className='p-3'>{item.inspectionDate}</td>
                  <td className='p-3 cursor-pointer text-2xl'>
                    <FontAwesomeIcon
                      onClick={() => {
                        setOpenRow(openRow === index ? null : index);
                      }}
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

      {isSidebarOpen && (
        <div className='fixed top-0 right-0 h-full w-[40%] bg-white shadow-lg z-50 px-8'>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className='left-4 text-black hover:bg-gray-300 p-2 rounded-full mt-8'>
            <FaTimes size={25}/>
          </button>
          <div className='items-center p-4 border-b border-[#CFD0D5] mt-4'>
            <h4 className='text-lg font-semibold'>Inspection Details</h4>
          </div>
          <div className='flex border-b border-[#CFD0D5]'>
            {['Buyer Contact', 'Agent in Charge', 'Property', 'Brief'].map(
              (tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-3 text-center text-base ${
                    activeTab === tab ? 'border-b-2 border-[#45D884] font-semibold' : ''
                  }`}
                  onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              )
            )}
          </div>
          <div className=''>
            {activeTab === 'Buyer Contact' && (
              <div className='py-6'>
                <div className='flex justify-between items-center bg-[#F7F7F8] p-3 mb-1'>
                  <p>Name</p>
                  <p><strong>{selectedInspection?.buyerContact.name}</strong></p>
                </div>
                <div className='flex justify-between items-center bg-[#F7F7F8] p-3 mb-1'>
                  <p>Email</p>
                  <p><strong>{selectedInspection?.buyerContact.email}</strong></p>
                </div>
                <div className='flex justify-between items-center bg-[#F7F7F8] p-3 mb-1'>
                  <p>Phone</p>
                  <p><strong>{selectedInspection?.buyerContact.phone}</strong></p>
                </div>
              </div>
            )}
            {activeTab === 'Agent in Charge' && (
              <div className='py-6'>
                <div className='flex justify-between items-center bg-[#F7F7F8] p-3 mb-1'>
                  <p>Name</p>
                  <p><strong>{selectedInspection?.agentInCharge.name}</strong></p>
                </div>
                <div className='flex justify-between items-center bg-[#F7F7F8] p-3 mb-1'>
                  <p>Email</p>
                  <p><strong>{selectedInspection?.agentInCharge.email}</strong></p>
                </div>
                <div className='flex justify-between items-center bg-[#F7F7F8] p-3 mb-1'>
                  <p>Phone</p>
                  <p><strong>{selectedInspection?.agentInCharge.phone}</strong></p>
                </div>
              </div>
            )}
            {activeTab === 'Property' && (
              <div className='py-6'>
                <div className='flex justify-between items-center bg-[#F7F7F8] p-3 mb-1'>
                  <p>Address</p>
                  <p><strong>{selectedInspection?.propertyToInspect.address}</strong></p>
                </div>
                <div className='flex justify-between items-center bg-[#F7F7F8] p-3 mb-1'>
                  <p>Type</p>
                  <p><strong>{selectedInspection?.propertyToInspect.type}</strong></p>
                </div>
                <div className='flex justify-between items-center bg-[#F7F7F8] p-3 mb-1'>
                  <p>Size</p>
                  <p><strong>{selectedInspection?.propertyToInspect.size}</strong></p>
                </div>
              </div>
            )}
            {activeTab === 'Brief' && (
              <div className='py-6'>
                <div className='flex justify-between items-center bg-[#F7F7F8] p-3 mb-1'>
                  <p>Purpose</p>
                  <p><strong>{selectedInspection?.briefDetails.purpose}</strong></p>
                </div>
                <div className='flex justify-between items-center bg-[#F7F7F8] p-3 mb-1'>
                  <p>Notes</p>
                  <p><strong>{selectedInspection?.briefDetails.notes}</strong></p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const statsOptions = [
  { value: '1', label: 'Type' },
  { value: '2', label: 'Pending' },
  { value: '3', label: 'Overdue' },
];
