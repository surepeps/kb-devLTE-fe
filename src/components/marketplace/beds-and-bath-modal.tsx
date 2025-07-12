/** @format */

'use client';
import React, { useRef } from 'react';
import useClickOutside from '@/hooks/clickOutside';
import RadioCheck from '../general-components/radioCheck';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      viewport={{ once: true }}
      ref={divRef}
      className='w-[268px] h-[289px] bg-white p-[19px] absolute mt-[100px] border-[1px] border-black flex justify-between gap-[25px]'>
      <div className='flex flex-col gap-[10px]'>
        <h2 className='text-base font-medium text-[#000000]'>bedrooms</h2>
        <div className='flex flex-col gap-[10px]'>
          <RadioCheck
            handleChange={() => {
              setBedAndBath({
                ...bedAndBath,
                bed: 'any',
              });
            }}
            value='any'
            name='bedroom'
            type='radio'
            isChecked={bedAndBath.bed === 'any'}
            // onClick={() => {
            //   setBedAndBath({
            //     ...bedAndBath,
            //     bed: 'any',
            //   });
            // }}
          />
          {Array.from({ length: 5 }).map((__, idx: number) => (
            <RadioCheck
              name='bedroom'
              type='radio'
              value={Number(idx + 1).toLocaleString()}
              key={idx}
              isChecked={bedAndBath.bed === Number(idx + 1).toLocaleString()}
              // onClick={() => {
              //   setBedAndBath({
              //     ...bedAndBath,
              //     bed: Number(idx + 1).toLocaleString(),
              //   });
              // }}
              handleChange={() => {
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
            handleChange={() => {
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
              handleChange={() => {
                setBedAndBath({
                  ...bedAndBath,
                  bath: Number(idx + 1).toLocaleString(),
                });
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BedsAndBathModal;
