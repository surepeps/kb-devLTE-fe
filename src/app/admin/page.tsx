/** @format */

'use client';

import { useState } from 'react';
import {
  faMagnifyingGlass,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AttentionOverview from '@/components/admincomponents/attention_overview';
import AnalysisOverview from '@/components/admincomponents/analysis_overview';
import { archivo } from '@/styles/font';
import Select from 'react-select';
import { useFormik } from 'formik';
//import * as Yup from 'yup';

// type OptionType = {
//   value: string;
//   label: string;
// }
export default function AdminHome() {
  const [activeTab, setActiveTab] = useState('attention');

  const formik = useFormik({
    initialValues: {
      selectedStat: { value: 'Today', label: 'Today' },
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <section className='flex flex-col'>
      {/* Search & Help Button */}
      <div className='flex justify-between items-center'>
        <div className='w-3/5 mt-2 h-12 flex relative items-center'>
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
        <button type='button' className='bg-black px-1 rounded-full shadow-md'>
          {''}
          <FontAwesomeIcon
            icon={faQuestion}
            color='#fff'
            size='lg'
            className='bg-[#000] p-2 rounded-full shadow-md'
          />
        </button>
      </div>

      {/* Dashboard Header */}
      <div className='flex justify-between mt-6 mr-6'>
        <div className='flex flex-col'>
          <h2
            className={`text-3xl font-bold text-[#2E2C34] ${archivo.className}`}>
            Dashboard
          </h2>
          <p className={`text-sm text-[#84818A] ${archivo.className}`}>
            Showing your Account metrics from{' '}
            <span>1st Jan 2021 to 31st Jan 2021</span>
          </p>
        </div>
        <div className='flex h-[48px] items-center bg-white px-4 rounded-lg'>
          <div className='text-[#84818A] flex items-center text-sm'>
            Show stats:
            {/* <select title='Show stats' className='text-[#2E2C34] text-sm ml-1'>
              <option value='1'>Today</option>
              <option value='2'>Yesterday</option>
              <option value='3'>Monthly</option>
              <option value='4'>Yearly</option>
            </select> */}
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

      {/* Overview Tabs */}
      <div className='flex gap-4 mt-6'>
        <button
          type='button'
          onClick={() => setActiveTab('attention')}
          className={`min-w-fit ${
            archivo.className
          } lg:max-w-[226px] py-2 px-[7px] rounded-lg ${
            activeTab === 'attention'
              ? 'bg-[#8DDB90] text-white'
              : 'bg-gray-200 text-black'
          }`}>
          <h3 className='text-lg font-bold'>Attention Require Overview</h3>
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('analysis')}
          className={`min-w-fit px-[17px] ${
            archivo.className
          } lg:max-w-[226px] py-2 rounded-lg ${
            activeTab === 'analysis'
              ? 'bg-[#8DDB90] text-white'
              : 'bg-gray-200 text-black'
          }`}>
          <h3 className='text-lg font-bold'>Analysis Overview</h3>
        </button>
      </div>

      {/* Conditional Rendering of Overviews */}
      {activeTab === 'attention' ? <AttentionOverview /> : <AnalysisOverview />}
    </section>
  );
}

const statsOptions = [
  { value: 'Today', label: 'Today' },
  { value: 'Yesterday', label: 'Yesterday' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Yearly', label: 'Yearly' },
];
