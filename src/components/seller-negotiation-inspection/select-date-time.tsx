/** @format */

'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { archivo } from '@/styles/font';
import { format } from 'date-fns';
import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup';

type DetailsProps = {
  selectedDate: string;
  selectedTime: string;
};

type SelectPreferableInspectionDateProps = {
  closeModal: (type: boolean) => void;
  details: DetailsProps;
  setDetails: (type: DetailsProps) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
};

const SelectPreferableInspectionDate = ({
  closeModal,
  details,
  setDetails,
  isSubmitting,
  onSubmit,
}: SelectPreferableInspectionDateProps) => {

  const getAvailableDates = () => {
  const dates: string[] = [];
  let date = new Date();
  date.setDate(date.getDate() + 1);
  while (dates.length < 6) {
    if (date.getDay() !== 0) {
      dates.push(format(date, 'MMM d, yyyy'));
    }
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

const availableDates = getAvailableDates();

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 px-[10px]'>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
        className='lg:w-[658px] w-full flex flex-col gap-[26px] rounded-md overflow-hidden'>
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
          onSubmit={(event: React.FormEvent) => {
            event.preventDefault();
            closeModal(false);
          }}
          className=' bg-white overflow-y-auto w-full py-[36px] px-[32px] border-[1px] border-[#D9D9D9] flex flex-col gap-[25px] hide-scrollbar'>
          {/**First div */}
          <div className='flex flex-col gap-[5px] md:gap-[18px]'>
            <h2 className={`font-bold text-black ${archivo.className} text-xl`}>
              Select preferable inspection Date
            </h2>
          </div>
          {/**Second div */}
          <div className=' overflow-x-auto w-full flex gap-[21px] hide-scrollbar border-b-[1px] border-[#C7CAD0]'>
            {availableDates.map((date: string, idx: number) => (
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
            {details.selectedDate}
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
          <div className='h-[103px] py-[28px] w-full bg-[#8DDB90]/[20%] flex justify-center flex-col gap-[5px] px-[28px]'>
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
          <div className='lg:w-[569px] w-full flex gap-[15px] h-[57px]'>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#8DDB90] text-white h-[50px] text-lg font-bold"
            type="button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
            <button
              onClick={() => closeModal(false)}
              type='button'
              className={`w-[277px] h-[57px] bg-transparent border-[1px] border-[#5A5D63] text-[#414357] font-medium text-lg ${archivo.className}`}>
              Close
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
export default SelectPreferableInspectionDate;
