/** @format */

'use client';
import React, { useRef } from 'react';
import useClickOutside from '@/hooks/clickOutside';
import { motion } from 'framer-motion';
import { featuresData } from '@/data/landlord';
import RadioCheck from '../general-components/radioCheck';

interface DesiresFeaturesModalProps {
  closeModal: (type: boolean) => void;
  values: string[];
  setValues: (type: string[]) => void;
}

const DesiresFeaturesModal: React.FC<DesiresFeaturesModalProps> = ({
  closeModal,
  values,
  setValues,
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
      className='absolute mt-[100px] w-[278px] min-h-[300px] border-[1px] border-black bg-white flex flex-col gap-[25px] p-[19px] shadow-md'>
      <h2 className='text-base font-medium text-[#000000]'>More Filter</h2>
      <div className='flex flex-col gap-[10px]'>
        {featuresData.map((item: string, idx: number) => (
          <RadioCheck
            type='checkbox'
            key={idx}
            name={'more_filter'}
            isChecked={values.some((text: string) => text === item)}
            handleChange={() => {
              const uniqueValues = new Set(values as Array<string>); //making it mutable set
              if (uniqueValues.has(item)) {
                uniqueValues.delete(item);
                setValues([...uniqueValues]);
              } else {
                uniqueValues.add(item);
                setValues([...uniqueValues, item]);
              }
            }}
            value={item}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default DesiresFeaturesModal;
