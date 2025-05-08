/** @format */
'use client';
import useClickOutside from '@/hooks/clickOutside';
import { FormikProps } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import RadioCheck from '../general-components/radioCheck';

type FormikType = {
  minPrice: number;
  maxPrice: number;
};
interface PriceComponentMenuListProps {
  formik: FormikProps<FormikType>;
  heading: string;
  closeModal: (type: boolean) => void;
  setSlectedRadioValue: (type: string) => void;
}

const PriceRange: React.FC<PriceComponentMenuListProps> = ({
  heading,
  formik,
  closeModal,
  setSlectedRadioValue,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [radioValue, setRadioValue] = useState<string>('');

  useClickOutside(divRef, () => closeModal(false));

  useEffect(() => {
    console.log(formik.values);
    console.log(radioValue);
  }, [formik.values, radioValue]);

  useEffect(() => setSlectedRadioValue(radioValue), [radioValue]);
  return (
    <div
      ref={divRef}
      className='flex flex-col gap-[10px] justify-start items-start border-[#8D9096] border-b-[1px] absolute mt-[100px] bg-white border-[1px] h-[303px] shadow-md'
      style={{ padding: '19px', color: '#555' }}>
      <span className='text-[#000000] text-base font-medium'>{heading}</span>

      <div className='h-[47px] w-full flex gap-[20px] justify-between'>
        {/**Min price */}
        <div className='w-[163px] h-full py-[16px] px-[12px] border-[1px] border-[#D6DDEB] flex items-center justify-between gap-[10px]'>
          <span className='text-base text-[#000000]'>Min</span>
          <label htmlFor='min'>
            <input
              type='number'
              className='w-full text-center h-full outline-none text-sm'
              value={formik.values.minPrice}
              //onBlur={formik.handleBlur}
              onChange={(event: { target: { value: string } }) => {
                formik.setFieldValue('minPrice', event.target.value);
                setSlectedRadioValue('');
              }}
              name=''
              id='min'
              title={`min price`}
            />
          </label>
          <span className='text-base text-[#000000]'>N</span>
        </div>
        {/**Max price */}
        <div className='w-[163px] h-full py-[16px] px-[12px] border-[1px] border-[#D6DDEB] flex items-center justify-between gap-[10px]'>
          <span className='text-base text-[#000000]'>Max</span>
          <label htmlFor={'max'}>
            <input
              type='number'
              className='w-full outline-none text-center h-full text-sm'
              value={formik.values.maxPrice}
              //onBlur={formik.handleBlur}
              onChange={(event: { target: { value: string } }) => {
                formik.setFieldValue('maxPrice', event.target.value);
                setSlectedRadioValue('');
              }}
              name=''
              id='max'
              title={`max price`}
            />
          </label>
          <span className='text-base text-[#000000]'>N</span>
        </div>
      </div>
      {/**Radios */}
      <div className='flex flex-col gap-[10px] mt-4'></div>
      {[
        '500k - 1million',
        '2million - 4million',
        '5million - 6million',
        '10million above',
      ].map((item: string, idx: number) => (
        <RadioCheck
          key={idx}
          type='radio'
          onClick={() => {
            setRadioValue(item);
            formik.setFieldValue('minPrice', '');
            formik.setFieldValue('maxPrice', '');
          }}
          value={item}
          name='prices'
        />
      ))}
    </div>
  );
};

export default PriceRange;
