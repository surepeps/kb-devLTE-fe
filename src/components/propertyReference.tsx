/** @format */
'use clients';
import React, { useState } from 'react';
import Button from './button';

interface PropertyReferenceDataProps {
  propertyReferenceData: { heading: string; options: string[] }[];
  setFound: ({ isFound, count }: { isFound: boolean; count: number }) => void;
  found: { isFound: boolean; count: number };
}

const PropertyReference = ({
  propertyReferenceData,
  found,
  setFound,
}: PropertyReferenceDataProps) => {
  return (
    <div className='min-h-[398px] lg:min-h-[344px] py-[24px] px-[20px] lg:py-[30px] w-full lg:w-[1153px] lg:px-[45px] bg-[#FFFFFF]'>
      <div className='w-full min-h-[284px] flex flex-col gap-[37px]'>
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-[30px] lg:gap-[37px]'>
          {propertyReferenceData.map((item, idx: number) => (
            <Select key={idx} {...item} />
          ))}
        </div>
        <div className='w-full justify-end items-end flex'>
          <Button
            value='Search'
            green={true}
            type='button'
            onClick={() => {
              setFound({
                isFound: !found.isFound,
                count: 8,
              });
            }}
            className='bg-[#8DDB90] text-[#FFFFFF] text-base leading-[25.6px] font-bold min-h-[50px] py-[12px] px-[24px] lg:w-[334px] w-full'
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyReference;

interface SelectProps {
  heading: string;
  placeholder?: string;
  options: string[];
}

const Select: React.FC<SelectProps> = ({ heading, options }) => {
  const [valueSelected, setValueSelected] = useState<string>('');
  return (
    <label
      htmlFor='select'
      className='min-h-[80px] lg:w-[334.33px] w-full flex flex-col gap-[4px]'>
      <h2 className='text-base font-medium leading-[25.6px] text-[#1E1E1E]'>
        {heading}
      </h2>
      <select
        onChange={(e) => {
          setValueSelected(e.target.value);
        }}
        value={valueSelected}
        className='min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FFFFFF00] border-[#D6DDEB]'
        name='select'
        id='select'>
        {options.map((option: string, idx: number) => (
          <option value={option} key={idx}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};
