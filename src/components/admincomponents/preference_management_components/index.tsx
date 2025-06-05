/** @format */

'use client';
import { archivo } from '@/styles/font';
import {
  faArrowDown,
  faArrowUp,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type PreferenceManagementProps = {};
const PreferenceManagement: React.FC<PreferenceManagementProps> = ({}) => {
  const [selectedTable, setSelectedTable] = useState<string>('Buyer');
  return (
    <aside className='w-full flex flex-col gap-[35px]'>
      <div className='min-h-[64px] w-full flex justify-between items-center'>
        <div className='flex flex-col gap-[4px]'>
          <h2
            className={`${archivo.className} text-3xl font-semibold text-dark`}>
            Preference Management
          </h2>
          <span
            className={`${archivo.className} text-sm font-normal text-gray-400`}>
            Showing your Account metrics for July 19, 2021 - July 25, 2021
          </span>
        </div>
        <button
          type='button'
          className='h-[50px] w-[163px] bg-[#8DDB90] rounded-[5px] flex justify-center items-center gap-2'>
          <FontAwesomeIcon
            icon={faPlus}
            width={24}
            height={24}
            className='w-[24px] h-[24px]'
            color='white'
          />
          <span
            className={`text-base ${archivo.className} font-bold text-white`}>
            Send invite
          </span>
        </button>
      </div>

      <div className='flex gap-[30px] overflow-x-auto hide-scrollbar whitespace-nowrap'>
        <Rectangle
          heading='Buyer Preference'
          headerStyling={{ color: '#0B423D' }}
          value={3000}
          status={{
            position: 'fallen',
            percentage: 5.7,
          }}
        />
        <Rectangle
          heading='Tenant Preference'
          value={30000}
          status={{
            position: 'fallen',
            percentage: 5.7,
          }}
        />
        <Rectangle
          heading='Developer Contact'
          value={4}
          status={{
            position: 'fallen',
            percentage: 5.7,
          }}
        />
      </div>

      <div className='flex gap-[45px] h-[37px] border-b-[1px] border-[#D6DDEB]'>
        {['Buyer', 'Tenant', 'Developer'].map((item: string) => {
          const isSelected = selectedTable === item;

          return (
            <motion.span
              key={item}
              onClick={() => setSelectedTable(item)}
              className={`relative px-2 cursor-pointer text-base ${
                archivo.className
              } ${
                isSelected
                  ? 'text-[#181336] font-semibold'
                  : 'text-[#515B6F] font-normal'
              }`}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              {item}
              {isSelected && (
                <motion.div
                  layoutId='underline'
                  className='absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#8DDB90]'
                />
              )}
            </motion.span>
          );
        })}
      </div>
    </aside>
  );
};

type RectangleProps = {
  heading: string;
  headerStyling?: React.CSSProperties;
  value: number;
  valueStyling?: React.CSSProperties;
  status?: {
    percentage: number;
    position: 'risen' | 'fallen';
  };
};

const Rectangle = ({
  heading,
  headerStyling,
  value,
  valueStyling,
  status,
}: RectangleProps): React.JSX.Element => {
  return (
    <div className='w-[356px] h-[127px] shrink-0 flex flex-col gap-[35px] justify-center px-[25px] bg-[#FFFFFF] border-[1px] border-[#E4DFDF] rounded-[4px]'>
      <h3
        style={headerStyling}
        className={`text-base font-medium ${archivo.className}`}>
        {heading}
      </h3>
      <div className='flex justify-between items-center'>
        <h2
          style={valueStyling}
          className={`${archivo.className} text-3xl font-semibold`}>
          {Number(value).toLocaleString()}
        </h2>
        {status ? (
          <div className='flex gap-[4px]'>
            <FontAwesomeIcon
              style={
                status.position === 'fallen'
                  ? { color: '#DA1010', transform: 'rotate(30deg)' }
                  : { color: 'green' }
              }
              width={17}
              height={17}
              className='w-[17px] h-[17px]'
              icon={status.position === 'risen' ? faArrowUp : faArrowDown}
            />
            <span className='text-sm text-black font-archivo'>
              {status.percentage}%
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PreferenceManagement;
