/** @format */

'use client';
import React, { useRef } from 'react';
import useClickOutside from '@/hooks/clickOutside';
import RadioCheck from '../general-components/radioCheck';

interface BedsAndBathModalProps {
  closeModal: (type: boolean) => void;
  bedAndBath: {
    bath: undefined | number | string;
    bed: undefined | number | string;
  };
  setBedAndBath: (type: {
    bath: undefined | number | string;
    bed: undefined | number | string;
  }) => void;
}

const BedsAndBathModal: React.FC<BedsAndBathModalProps> = ({
  closeModal,
  bedAndBath,
  setBedAndBath,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(divRef, () => closeModal(false));
  return (
    <div
      ref={divRef}
      className='w-[268px] h-[289px] bg-white p-[19px] absolute mt-[100px] border-[1px] border-black flex justify-between gap-[25px]'>
      <div className='flex flex-col gap-[10px]'>
        <h2 className='text-base font-medium text-[#000000]'>bedrooms</h2>
        <div className='flex flex-col gap-[10px]'>
          <RadioCheck
            value='any'
            name='bedroom'
            type='radio'
            isChecked={bedAndBath.bed === 'any'}
            onClick={() => {
              setBedAndBath({
                ...bedAndBath,
                bed: 'any',
              });
            }}
          />
          {Array.from({ length: 5 }).map((__, idx: number) => (
            <RadioCheck
              name='bedroom'
              type='radio'
              value={Number(idx + 1).toLocaleString()}
              key={idx}
              isChecked={bedAndBath.bed === Number(idx + 1).toLocaleString()}
              onClick={() => {
                setBedAndBath({
                  ...bedAndBath,
                  bed: Number(idx + 1).toLocaleString(),
                });
              }}
            />
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-[10px]'>
        <h2 className='text-base font-medium text-[#000000]'>bathrooms</h2>
        <div className='flex flex-col gap-[10px]'>
          <RadioCheck
            value='any'
            name='bathroom'
            type='radio'
            isChecked={bedAndBath.bath === 'any'}
            onClick={() => {
              setBedAndBath({
                ...bedAndBath,
                bath: 'any',
              });
            }}
          />
          {Array.from({ length: 5 }).map((__, idx: number) => (
            <RadioCheck
              name='bathroom'
              type='radio'
              value={Number(idx + 1).toLocaleString()}
              key={idx}
              isChecked={bedAndBath.bath === Number(idx + 1).toLocaleString()}
              onClick={() => {
                setBedAndBath({
                  ...bedAndBath,
                  bath: Number(idx + 1).toLocaleString(),
                });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BedsAndBathModal;
