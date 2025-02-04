/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use clients';
import React, { MouseEventHandler, useEffect } from 'react';
import Button from './button';
import { useFormik } from 'formik';

interface RentalReferenceDataProps {
  rentalReferenceData: { heading: string; options: string[] }[];
  isDisabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  // setFound: ({ isFound, count }: { isFound: boolean; count: number }) => void;
  // found: { isFound: boolean; count: number };
}

const RentalReference = ({
  rentalReferenceData,
  isDisabled,
  onClick,
}: RentalReferenceDataProps) => {
  const initialValues = {};
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      console.log(values);
      try {
        const response = await fetch(`rentalreference`, formik.values);
        console.log(response.json());
      } catch (error) {
        console.log(error);
      }
    },
  });
  useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);
  return (
    <form
      onSubmit={formik.handleSubmit}
      className='min-h-[398px] lg:min-h-[344px] py-[24px] px-[20px] lg:py-[30px] w-full lg:w-[1153px] lg:px-[45px] bg-[#FFFFFF]'>
      <div className='w-full min-h-[284px] flex flex-col gap-[37px]'>
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-[30px] lg:gap-[37px]'>
          {rentalReferenceData.map((item, idx: number) => (
            <Select formik={formik} key={idx} {...item} />
          ))}
        </div>
        <div className='w-full justify-end items-end flex'>
          <Button
            value='Search'
            green={true}
            type='submit'
            onClick={isDisabled ? undefined : onClick}
            className='bg-[#8DDB90] text-[#FFFFFF] text-base leading-[25.6px] font-bold min-h-[50px] py-[12px] px-[24px] lg:w-[334px] w-full'
          />
        </div>
      </div>
    </form>
  );
};

export default RentalReference;

interface SelectProps {
  heading: string;
  placeholder?: string;
  options: string[];
  formik: any;
}

const Select: React.FC<SelectProps> = ({ heading, options, formik }) => {
  // const [valueSelected, setValueSelected] = useState<string>('');
  return (
    <label
      htmlFor='select'
      className='min-h-[80px] lg:w-[334.33px] w-full flex flex-col gap-[4px]'>
      <h2 className='text-base font-medium leading-[25.6px] text-[#1E1E1E]'>
        {heading}
      </h2>
      <select
        onChange={formik.handleChange}
        value={formik.values[heading]}
        onBlur={formik.handleBlur}
        className='min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FFFFFF00] border-[#D6DDEB]'
        name={heading}
        id={heading}>
        {options.map((option: string, idx: number) => (
          <option value={option} key={idx}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};
