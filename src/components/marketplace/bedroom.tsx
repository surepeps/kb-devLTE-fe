/** @format */
'use client';
import useClickOutside from '@/hooks/clickOutside';
import React, { useRef } from 'react';
import RadioCheck from '../general-components/radioCheck';

interface BedroomComponentProps {
  closeModal: (type: boolean) => void;
  setNumberOfBedrooms: (type: number | undefined) => void;
  noOfBedrooms: number | undefined;
}

const BedroomComponent: React.FC<BedroomComponentProps> = ({
  closeModal,
  setNumberOfBedrooms,
  noOfBedrooms,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(divRef, () => closeModal(false));
  return (
    <div
      ref={divRef}
      className='w-[151px] h-[262px] p-[19px] flex flex-col gap-[25px] bg-white shadow-md absolute mt-[100px]'>
      <h2 className='text-base font-medium text-[#000000]'>Bedroom</h2>
      <div className='flex flex-col gap-[10px]'>
        {Array.from({ length: 5 }).map((__, index: number) => (
          <RadioCheck
            type='radio'
            name='bedroom'
            isChecked={index + 1 === noOfBedrooms}
            key={index}
            onClick={() => setNumberOfBedrooms(index + 1)}
            value={Number(index + 1).toLocaleString()}
          />
        ))}
      </div>
    </div>
  );
};

export default BedroomComponent;
