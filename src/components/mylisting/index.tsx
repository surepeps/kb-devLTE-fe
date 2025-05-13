/** @format */

'use client';
import React, { useState } from 'react';
import { usePageContext } from '@/context/page-context';
import { basic_styling_architecture } from '@/utils/tool';
import RadioCheck from '../general-components/radioCheck';
import JointVentureModalCard from '../marketplace/joint-venture-card';
import Card from '../general-components/card';
import sampleImage from '@/assets/Agentpic.png';

const dummyCardData = [
  {
    header: 'Property Type',
    value: 'N/A',
  },
  {
    header: 'Price',
    value: `₦${Number(2180000).toLocaleString()}`,
  },
  {
    header: 'Bedrooms',
    value: 'N/A',
  },
  {
    header: 'Location',
    value: `N/A`,
  },
  {
    header: 'Documents',
    value: `N/A`,
  },
];

const MyListing = () => {
  const { selectedType, setSelectedType } = usePageContext();
  const [propertyType, setPropertyType] = useState<string>('All');

    // Dummy list of property types for demonstration
  const propertyTypes = ['All', 'Land', 'Residential', 'Commercial', 'JV'];

  // Dummy list of cards (replace with real data later)
  const dummyList = Array.from({ length: 12 });

    // Render the correct card based on propertyType
  const renderCard = (idx: number) => {
    if (propertyType === 'JV') {
      return (
        <JointVentureModalCard
          key={idx}
          onClick={() => {}}
          isDisabled={false}
        />
      );
    }
    // Default card for Buy/Sell/Rent
    return (
      <Card
        style={{ width: '300px' }}
        images={[sampleImage]}
        onClick={() => {}}
        cardData={dummyCardData}
        key={idx}
        isDisabled={false}
      />
    );
  };

  return (
    <section className='flex flex-col justify-center items-center w-full h-auto'>
      <div className='container lg:py-[30px] flex flex-col gap-[20px]'>
        <div className='flex flex-col items-center justify-center gap-[20px] px-[15px] mt-10'>
          <h2 className=' text-[24px] md:text-4xl font-medium text-[#000] text-center'>
            Discover and manage your listings.
          </h2>
          <p className='text-base md:text-xl text-[#5A5D63] text-center'>
           Stay in control of your properties.
          </p>
  
          <div className='w-full pb-[10px] flex justify-between items-center gap-[53px] border-b-[1px] border-[#C7CAD0] '>
            <div className='flex gap-[15px]'>
              <h3 className='font-semibold text-[#1E1E1E]'>Usage Options</h3>
              {['All', 'Land', 'Residential', 'Commercial'].map(
                (item: string, idx: number) => (
                  <RadioCheck
                    key={idx}
                    type='checkbox'
                    name='usageOptions'
                    value={item}
                    handleChange={() => {}}
                  />
                )
              )}
            </div>
              <button
                className='h-[34px] w-[133px] bg-[#8DDB90] text-white shadow-md font-medium text-sm'
                type='button'>
                List property
              </button>
          </div>
        </div>
        {/* Listing Cards */}
          <div className='w-full flex justify-center'>
            <div className='w-[90%] mt-6 grid md:grid-cols-4 gap-[20px] md:gap-[37px] justify-items-center'>
              {dummyList.map((_, idx) => renderCard(idx))}
            </div>
          </div>
      </div>
    </section>
  );
};

const ButtonBoxModal = ({
  text,
  onSelect,
  selectedType,
}: {
  text: string;
  selectedType: string;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <button
      onClick={onSelect}
      type='button'
      className={`min-w-fit h-[51px] px-[15px] flex items-center justify-center gap-[10px] ${
        selectedType === text
          ? 'bg-[#8DDB90] text-[#FFFFFF]'
          : 'bg-transparent text-[#5A5D63]'
      } border-[1px] border-[#C7CAD0] font-medium text-lg`}>
      {text}
    </button>
  );
};
export default MyListing;
