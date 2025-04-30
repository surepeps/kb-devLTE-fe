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
        <div className='flex flex-col items-center justify-center gap-[15px]'>
          <h2 className='font-display text-4xl font-semibold text-[#09391C]'>
            Welcome to{' '}
            <span className='text-[#8DDB90] font-display text-4xl font-semibold'>
              Khabiteq Realty
            </span>{' '}
            Marketplace
          </h2>
          <p className='text-xl text-[#5A5D63]'>
            Buy, Sell or Rent - what can we help you with today?
          </p>
          {/**type of market to select */}
          <div className={`flex gap-[15px] w-[527px]`}>
            {['Buy', 'Sell', 'Rent'].map((item: string, idx: number) => (
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
          {/**Paragraph */}
          <p className='text-xl text-[#5A5D63] md:max-w-[657px] text-center mt-2'>
            Browse our verified listings, schedule inspections, and negotiate
            the best deal. Where would you like to begin your search?
          </p>
        </div>
        {/**Search Modal */}
        <div className='w-full mt-2'>
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
      className={`w-full py-[15px] px-[15px] flex items-center justify-center gap-[10px] ${
        selectedType === text
          ? 'bg-[#8DDB90] text-[#FFFFFF]'
          : 'bg-transparent text-[#5A5D63]'
      } border-[1px] border-[#C7CAD0] font-medium text-lg`}>
      {text}
    </button>
  );
};
export default MarketPlace;
