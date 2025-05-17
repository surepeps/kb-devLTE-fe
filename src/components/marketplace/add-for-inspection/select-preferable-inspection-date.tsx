/** @format */

'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { archivo } from '@/styles/font';
import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup';

type DetailsProps = {
  selectedDate: string;
  selectedTime: string;
};

type ContactProps = {
  fullName: string;
  phoneNumber: string;
  email: string;
};

const SelectPreferableInspectionDate = ({
  closeModal,
}: {
  closeModal: (type: boolean) => void;
}) => {
  const [details, setDetails] = useState<DetailsProps>({
    selectedDate: 'Jan 1, 2025',
    selectedTime: '9:00 AM',
  });
  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
  });
  const formik = useFormik({
    initialValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
    },
    validationSchema,
    onSubmit: (values: ContactProps) => console.log(values),
  });
  return (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 pt-[80vh]'>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0, y: 20 }} 
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
        className='lg:w-[658px] w-full flex flex-col gap-[26px] rounded-md overflow-hidden'
        >
        <div className='flex items-center justify-end'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            type='button'
            className='w-[51px] h-[51px] rounded-full bg-white flex items-center justify-center'>
            <FontAwesomeIcon
              icon={faClose}
              width={24}
              height={24}
              onClick={() => closeModal(false)}
              className='w-[24px] h-[24px]'
              color='#181336'
            />
          </motion.button>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className=' bg-white w-full py-[36px] px-[32px] border-[1px] border-[#D9D9D9] flex flex-col gap-[25px]'>
          {/**First div */}
          <div className='flex flex-col gap-[18px]'>
            <h2 className={`font-bold text-black ${archivo.className} text-xl`}>
              Select preferable inspection Date
            </h2>
          </div>
          {/**Second div */}
          <div className='h-[72px] overflow-x-auto w-full flex gap-[21px] hide-scrollbar border-b-[1px] border-[#C7CAD0]'>
            {[
              'Jan 1, 2025',
              'Jan 2, 2025',
              'Jan 3, 2025',
              'Jan 4, 2025',
              'Jan 5, 2025',
              'Jan 6, 2025',
            ].map((date: string, idx: number) => (
              <button
                type='button'
                onClick={() => {
                  setDetails({
                    ...details,
                    selectedDate: date,
                  });
                }}
                className={`h-[42px] ${
                  details.selectedDate === date && 'bg-[#8DDB90] text-white'
                } min-w-fit px-[10px] ${
                  archivo.className
                } text-sm font-medium text-[#5A5D63]`}
                key={idx}>
                {date}
              </button>
            ))}
          </div>
          <h3 className={`text-xl font-medium ${archivo.className} text-black`}>
            Select preferable inspection time
          </h3>
          <h4 className={`text-lg font-medium ${archivo.className} text-black`}>
            January 23, 2025
          </h4>
          {/**third div */}
          <div className='grid grid-cols-3 gap-[14px]'>
            {[
              '9:00 AM',
              '11:00 AM',
              '1:00 PM',
              '3:00 PM',
              '5:00 PM',
              '7:00 PM',
              '9:00 PM',
              '11:00 PM',
              '1:00 AM',
            ].map((time, idx: number) => (
              <button
                onClick={() => {
                  setDetails({
                    ...details,
                    selectedTime: time,
                  });
                }}
                className={`border-[1px] border-[#A8ADB7] h-[57px] ${
                  details.selectedTime === time && 'bg-[#8DDB90]'
                } text-lg font-medium ${archivo.className} text-black`}
                type='button'
                key={idx}>
                {time}
              </button>
            ))}
          </div>
          {/**fourth div */}
          <div className='h-[103px] w-full bg-[#8DDB90]/[20%] flex justify-center flex-col gap-[5px] px-[28px]'>
            <h3
              className={`text-lg font-medium ${archivo.className} text-black font-semibold`}>
              Booking details
            </h3>
            <p
              className={`text-lg font-medium ${archivo.className} text-black`}>
              Date:{' '}
              <time
                className={`text-lg font-medium ${archivo.className} text-black`}>
                {details.selectedDate}
              </time>{' '}
              Time:{' '}
              <time
                className={`text-lg font-medium ${archivo.className} text-black`}>
                {details.selectedTime}
              </time>
            </p>
          </div>
          {/**fifth div */}
          <div className='p-[20px] bg-[#EEF1F1] flex flex-col gap-[25px]'>
            <div className='flex flex-col gap-[4px]'>
              <h3 className='text-[#0B0D0C] text-xl font-bold'>
                Contact information
              </h3>
              <span className='text-base text-[#515B6F]'>
                Provide your contact information to schedule an inspection and
                take the next step toward your dream property
              </span>
            </div>
            <div className='grid grid-cols-2 gap-[15px]'>
              <Input
                id='fullName'
                name='fullName'
                placeholder='Full name of the buyer'
                type='text'
                heading='Full Name'
                formikType={formik}
              />
              <Input
                id='phoneNumber'
                name='phoneNumber'
                placeholder='Active phone number for follow-up'
                type='text'
                heading='Phone Number'
                formikType={formik}
              />
              <Input
                id='email'
                name='email'
                placeholder='Optional, for communication'
                type='email'
                heading='Email'
                formikType={formik}
                className='col-span-2'
              />
            </div>
          </div>
          <div className='lg:w-[569px] w-full flex gap-[15px] h-[57px]'>
            <button
              type='submit'
              className={`w-[277px] h-[57px] bg-[#8DDB90] text-[#FFFFFF] font-bold text-lg ${archivo.className}`}>
              Submit
            </button>
            <button
              type='submit'
              className={`w-[277px] h-[57px] bg-transparent border-[1px] border-[#5A5D63] text-[#414357] font-medium text-lg ${archivo.className}`}>
              Close
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

type InputProps = {
  id: 'fullName' | 'email' | 'phoneNumber';
  placeholder?: string;
  type: 'email' | 'number' | 'text';
  name: string;
  heading: string;
  // value?: string | number;
  // onChange?: (type: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  formikType: FormikProps<ContactProps>;
  className?: string;
};

const Input: React.FC<InputProps> = ({
  id,
  heading,
  type,
  placeholder,
  name,
  isDisabled,
  formikType,
  className,
}) => {
  return (
    <label
      htmlFor={id}
      className={`w-full flex flex-col gap-[4px] ${className}`}>
      <span
        className={`text-base text-[#24272C] ${archivo.className} font-medium`}>
        {heading}
      </span>
      <input
        name={name}
        onChange={formikType.handleChange}
        id={id}
        type={type}
        onBlur={formikType.handleBlur}
        value={formikType.values[id]}
        disabled={isDisabled}
        placeholder={placeholder ?? 'This is a placeholder'}
        className={`px-[12px] h-[50px] bg-[#FFFFFF] border-[1px] border-[#E9EBEB] w-full text-base placeholder:text-[#A7A9AD] text-black ${archivo.className} rounded-[5px] outline-none`}
      />
      {(formikType.errors[id] || formikType.touched[id]) && (
        <span className={`${archivo.className} text-xs text-red-500`}>
          {formikType.errors[id]}
        </span>
      )}
    </label>
  );
};

export default SelectPreferableInspectionDate;
