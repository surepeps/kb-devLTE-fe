/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */
'use client';
import { Fragment, useEffect, useState } from 'react';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import filterIcon from '@/svgs/filterIcon.svg';
import Select from 'react-select';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import AgentSidebar from './AgentDetailsBar';
import { GET_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Define the interface for agent data
interface Agent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: {
    street: string;
    state: string;
    localGovtArea: string;
  };
  agentType: string;
  accountStatus: string;
  isAccountVerified: boolean;
  createdAt: string;
  updatedAt: string;
  meansOfId: {
    docImg: string[];
    name: string;
  }[];
  regionOfOperation: string[];
  isInActive: boolean;
  isDeleted: boolean;
  accountApproved: boolean;
}

export default function AgentLists() {
  const [active, setActive] = useState('All Agents');
  const [selectedUser, setSelectedUser] = useState<any | null>(null); 
  const [isLoadingDetails, setIsLoadingDetails] = useState({
    isLoading: false,
    message: '',
  });
  const [agents, setAgents] = useState<Agent[]>([]); 

  useEffect(() => {
    const getAgentsData = async () => {
      setIsLoadingDetails({
        isLoading: true,
        message: 'Loading...',
      });
      try {
        const response = await GET_REQUEST(
          URLS.BASE + '/admin/all-agents',
          Cookies.get('token')
        );

        if (response?.success === false) {
          toast.error('Failed to get data');
          return setIsLoadingDetails({
            isLoading: false,
            message: 'Failed to get data',
          });
        }
        const data = response.agents.data;
        setIsLoadingDetails({
          isLoading: false,
          message: 'Data Loaded',
        });
        setAgents(data);
      } catch (error: any) {
        setIsLoadingDetails({
          isLoading: false,
          message: 'Failed to get data',
        });
      } finally {
        setIsLoadingDetails({
          isLoading: false,
          message: '',
        });
      }
    };
    getAgentsData();
  }, []);

  const filteredAgents = agents.filter((agent) => {
    if (active === 'Onboarding Agents') {
      return !agent.accountApproved;
    }
    if (active === 'Active Agents') {
      return agent.accountStatus.toLowerCase() === 'active';
    }
    if (active === 'Inactive Agents') {
      return agent.accountStatus.toLowerCase() === 'inactive';
    }
    return true; // For 'All Agents' or other tabs
  });

  const handleActionClick = (user: any) => {
    setSelectedUser(user);
  };

  const closeSidebar = () => {
    setSelectedUser(null);
  };

  const renderDynamicComponent = () => {
    const tableContent = (
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className='mt-6 p-4 border rounded-md bg-white w-full lg:max-w-[1128px] px-8 mr-2 overflow-hidden md:overflow-x-auto'>
        <h3 className='text-[#2E2C34] text-xl font-semibold py-6'>{active}</h3>
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
                <th className='p-3'>ID</th>
                <th className='p-3'>Legal Name</th>
                <th className='p-3'>Email</th>
                <th className='p-3'>Agent Type</th>
                <th className='p-3'>Address</th>
                <th className='p-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((item, index) => (
                <tr
                  key={index}
                  className='border-b text-sm text-gray-700 hover:bg-gray-50'>
                  <td className='p-3'>
                    <input title='checkbox' type='checkbox' />
                  </td>
                  <td className='p-3'>{item.id}</td>
                  <td className='p-3'>{`${item.firstName} ${item.lastName}`}</td>
                  <td className='p-3'>{item.email}</td>
                  <td
                    className={`p-3 font-semibold ${
                      item.agentType.toLowerCase() === 'individual'
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}>
                    {item.agentType}
                  </td>
                  <td className='p-3'>{`${item.address.street}, ${item.address.localGovtArea}, ${item.address.state}`}</td>
                  <td className='p-3 cursor-pointer text-2xl'>
                    <FontAwesomeIcon
                      onClick={() => handleActionClick(item)}
                      icon={faEllipsis}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );

    return tableContent;
  };

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

  return (
    <Fragment>
      <div>
        <div className='flex text-lg w-full gap-4 md:gap-8 mt-6'>
          {tabs.map((item, index) => (
            <TabButton
              key={index}
              text={item.text}
              onClick={() => setActive(item.text)}
              active={active}
            />
          ))}
        </div>
        <div className='w-full'>{renderDynamicComponent()}</div>
      </div>
      {selectedUser && (
        <AgentSidebar user={selectedUser} onClose={closeSidebar} />
      )}
    </Fragment>
  );
}

const TabButton = ({
  text,
  onClick,
  active,
}: {
  text: string;
  onClick: () => void;
  active: string;
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`relative rounded-sm  ${
        active === text
          ? 'border-b-4 border-[#8DDB90]  text-[#181336] font-semibold'
          : 'text-[#515B6F]'
      }`}>
      {text}
    </button>
  );
};

const tabs = [
  { text: 'Onboarding Agents' },
  { text: 'All Agents' },
  { text: 'Active Agents' },
  { text: 'Inactive Agents' },
  { text: 'Banned Agents' },
];

const statsOptions = [
  { value: '1', label: 'Individual' },
  { value: '2', label: 'Incoporated' },
];
