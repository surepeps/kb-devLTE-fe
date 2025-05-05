/** @format */
'use client';

import {
  faMagnifyingGlass,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AgentManagements from '@/components/admincomponents/agent_management-tabs';
import { archivo } from '@/styles/font';
import { useLoading } from '@/hooks/useLoading';
import Select from 'react-select';
import Loading from '@/components/loading-component/loading';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';

const boxData: BoxNotificationProps[] = [
  {
    name: 'Active Agents',
    total: 0,
    type: 'active',
  },
  {
    name: 'Total Agents',
    total: 0,
    type: 'initial',
  },
  {
    name: 'Ban Agents',
    total: 0,
    type: 'banned',
  },
  {
    name: 'Flagged Agents',
    total: 0,
    type: 'flagged',
  },
];

export default function AgentManagement() {
  const isLoading = useLoading();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const [details, setDetails] = useState({
    totalAgents: 0,
    activeAgents: 0,
    bannedAgents: 0,
    flaggedAgents: 0,
  });

  const [data, setData] = useState<BoxNotificationProps[]>(boxData);

  const formik = useFormik({
    initialValues: {
      selectedStat: { value: 'Today', label: 'Today' },
    },
    onSubmit: (values) => {
      // console.log(values);
    },
  });

  useEffect(() => {
    setData([
      {
        name: 'Active Agents',
        total: details.activeAgents || 0,
        type: 'active',
      },
      {
        name: 'Total Agents',
        total: details.totalAgents || 0,
        type: 'initial',
      },
      {
        name: 'Ban Agents',
        total: details.bannedAgents || 0,
        type: 'banned',
      },
      {
        name: 'Flagged Agents',
        total: details.flaggedAgents || 0,
        type: 'flagged',
      },
    ]);
  }, [details]);

  if (isLoading) return <Loading />;

  return (
    <section className='flex flex-col w-full md:w-[initial]'>
      {/* Search & Help Button */}
      <div className='flex justify-between items-center'>
        <div className='md:w-3/5 mt-2 h-12 flex relative items-center'>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size='lg'
            width={24}
            height={24}
            className='text-[#A7A9AD] absolute left-3 w-[24px] h-[24px]'
          />
          <input
            type='text'
            placeholder='Search for Agent, Briefs'
            className='w-full h-full pl-12 border border-gray-300 bg-transparent rounded-md'
          />
        </div>
        <button
          type='button'
          className='bg-black w-[30px] h-[30px] flex items-center justify-center rounded-full shadow-md'>
          {''}
          <FontAwesomeIcon
            icon={faQuestion}
            color='#fff'
            size='sm'
            className='bg-[#000] rounded-full shadow-md'
          />
        </button>
      </div>

      {/* Dashboard Header */}
      <div className='flex md:flex-row flex-col justify-between mt-6 md:mr-6 w-full md:w-[initial] gap-2 md:gap-0'>
        <div className='flex flex-col gap-1 md:gap-0'>
          <h2
            className={`text-3xl font-bold text-[#2E2C34] ${archivo.className}`}>
            Agent Management
          </h2>
          <p className={`text-sm text-[#84818A] ${archivo.className}`}>
            Showing your Account metrics from{' '}
            <span>31st Mar, 2025 to {currentDate}</span>
          </p>
        </div>

        <div className='flex h-[48px] w-fit md:w-[initial] items-center bg-white px-4 rounded-lg'>
          <div className='text-[#84818A] flex items-center text-sm'>
            Show stats:
            <Select
              className='text-[#2E2C34] text-sm ml-1'
              styles={{
                control: (styles) => ({
                  ...styles,
                  border: 'none',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                }),
              }}
              options={statsOptions}
              defaultValue={statsOptions}
              value={formik.values.selectedStat}
              onChange={(options) => {
                formik.setFieldValue('selectedStat', options);
              }}
            />
          </div>
        </div>
      </div>
      <div className='flex overflow-x-auto hide-scrollbar gap-[30px] w-full mt-6'>
        {data.map((item: BoxNotificationProps, index: number) => (
          <BoxNotification key={index} {...item} />
        ))}
      </div>
      {/* Conditional Rendering of Overviews */}
      <div className='w-full'>
        <AgentManagements setDetails={setDetails} />
      </div>
    </section>
  );
}

const statsOptions = [
  { value: 'Today', label: 'Today' },
  { value: 'Yesterday', label: 'Yesterday' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Yearly', label: 'Yearly' },
];

type BoxNotificationProps = {
  type: 'initial' | 'banned' | 'flagged' | 'active';
  name: string;
  total: number;
};

const BoxNotification: React.FC<BoxNotificationProps> = ({
  name,
  total,
  type,
}) => {
  const getTypeClass = (type: string) => {
    switch (type) {
      case 'initial':
        return 'text-[#181336]';
      case 'banned':
        return 'text-[#F41515]';
      case 'flagged':
        return 'text-[#181336]';
      case 'active':
        return 'text-[#0B423D]';
      default:
        return 'text-[#2E2C34]';
    }
  };
  return (
    <div className='h-[127px] shrink-0 flex flex-col rounded-[4px] gap-[35px] py-[23px] px-[25px] w-[259.5px] bg-[#FFFFFF] border-[#E4DFDF] border-[1px]'>
      <h3
        className={`${getTypeClass(type)} text-base ${
          archivo.className
        } font-bold`}>
        {name}
      </h3>
      <h2
        className={`text-[#181336] font-semibold text-3xl ${archivo.className}`}>
        {Number(total).toLocaleString()}
      </h2>
    </div>
  );
};
