/** @format */

'use client';
import { usePageContext } from '@/context/page-context';
import React, { useState } from 'react';

const SearchModal = () => {
  const [selectedType, setSelectedType] = useState<string>('Land');
  const { selectedType: userSelectedMarketPlace } = usePageContext();

  const renderDynamicComponent = () => {
    switch (userSelectedMarketPlace) {
      case 'Buy a property':
        return <BuyOptionModal />;
      case 'Rent/Lease a property':
        return <p>{userSelectedMarketPlace}</p>;
      case 'Find property for Joint Venture':
        return <p>{userSelectedMarketPlace}</p>;
      default:
        return <></>;
    }
  };
  return (
    <div className='container min-h-[243px] flex flex-col gap-[25px] py-[25px] px-[30px] bg-[#FFFFFF]'>
      {/**
       * Land | Residential | Commercial
       */}
      <div className='w-full h-[37px] flex gap-[53px] border-b-[1px] border-[#C7CAD0]'>
        {['Land', 'Residential', 'Commercial'].map(
          (item: string, idx: number) => (
            <span
              onClick={() => {
                setSelectedType(item);
              }}
              key={idx}
              className={`text-base cursor-pointer transition-all duration-300 ${
                item === selectedType
                  ? 'border-[#8DDB90] outline-[#8DDB90] border-b-[3px] text-[#181336] font-semibold'
                  : 'text-[#515B6F] font-normal'
              } rounded-sm`}>
              {item}
            </span>
          )
        )}
      </div>
      {/**
       * options based on the user selected Market place
       */}
      {userSelectedMarketPlace && renderDynamicComponent()}
    </div>
  );
};

const BuyOptionModal = () => {
  return (
    <div className='flex gap-[15px]'>
      <h3 className='font-semibold text-[#1E1E1E]'>Usage Options</h3>
      {['All', 'Lease', 'Joint Venture(JV)', 'Outright Sale'].map(
        (item: string, idx: number) => (
          <label htmlFor='usageOptions' key={idx} className='flex gap-[17px]'>
            <input
              className='w-[24px] h-[24px]'
              style={{
                accentColor: '#8DDB90',
              }}
              title={item}
              type='checkbox'
              name='checkbox'
              id='usageOptions'
            />
            <span className='text-base text-[#000000]'>{item}</span>
          </label>
        )
      )}
    </div>
  );
};

export default SearchModal;
