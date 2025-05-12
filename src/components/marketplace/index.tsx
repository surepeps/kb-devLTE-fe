/** @format */

'use client';
import { usePageContext } from '@/context/page-context';
import { basic_styling_architecture } from '@/utils/tool';
import React from 'react';
import SearchModal from './search-modal';

const MarketPlace = () => {
  const { selectedType, setSelectedType } = usePageContext();
  return (
    <section className={`flex flex-col justify-center items-center w-full`}>
      <div className={`container lg:py-[30px] flex flex-col gap-[20px]`}>
        {/**
         * Heading and the type of market place user wants to select
         */}
        <div className='flex flex-col items-center justify-center gap-[20px] px-[15px]'>
          <h2 className='font-display text-[28px] md:text-4xl font-semibold text-[#09391C] text-center'>
            Welcome to{' '}
            <span className='text-[#8DDB90] text-[28px] font-display md:text-4xl font-semibold'>
              Khabiteq Realty
            </span>{' '}
            Marketplace
          </h2>
          <p className='text-base md:text-xl text-[#5A5D63] text-center'>
            Whether you're buying, selling, renting, or investing (JV), how can
            we assist you?.
          </p>
          {/**type of market to select */}
          <div className={`md:flex gap-[15px] hidden`}>
            {[
              'Buy a property',
              'Find property for Joint Venture',
              'Rent/Lease a property',
            ].map((item: string, idx: number) => (
              <ButtonBoxModal
                selectedType={selectedType}
                onSelect={() => {
                  setSelectedType(item);
                }}
                isSelected
                key={idx}
                text={item}
              />
            ))}
          </div>
          <div className='flex gap-[5px] md:gap-[14px] md:flex-row flex-col md:min-w-[517px] min-h-[34px] items-center'>
            {/**Paragraph */}
            <p className='text-lg text-[#5A5D63] md:max-w-[657px] text-center mt-2'>
              Didn't find a match for your search?
            </p>
            {/**button ~ Share your preference*/}
            <button
              className='h-[34px] bg-transparent border-[1px] border-[#09391C] w-[221px] text-sm text-[#09391C]'
              type='button'>
              Share your preference
            </button>
          </div>
        </div>
        {/**Search Modal */}
        <div className='w-full mt-2 px-[20px]'>
          <SearchModal />
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
export default MarketPlace;
