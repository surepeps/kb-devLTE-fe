/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { usePageContext } from '@/context/page-context';
import useClickOutside from '@/hooks/clickOutside';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from './button';

const ContactUs = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { setRentPage } = usePageContext();

  const validationSchema = Yup.object({
    fullName: Yup.string().required(),
    phoneNumber: Yup.number().required(),
    email: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const closeModal = () => {
    setRentPage({
      isSubmitForInspectionClicked: false,
    });
  };

  useClickOutside(ref, () =>
    setRentPage({ isSubmitForInspectionClicked: false })
  );

  return (
    <section className='fixed z-20 top-0 h-screen w-full justify-center items-center flex px-[20px]'>
      <div
        ref={ref}
        className={`md:w-[550px] min-h-[550px] w-full flex flex-col slide-from-bottom`}>
        <div className='h-[60px] bg-transparent flex justify-end'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={closeModal}
            className='w-[51px] h-[51px] bg-white shadow-md flex justify-center items-center rounded-full'>
            <FontAwesomeIcon
              icon={faClose}
              width={24}
              height={24}
              className='w-[24px] h-[24px]'
            />
          </motion.button>
        </div>
        <div className='bg-white rounded-[4px] md:py-[80px] md:px-[40px] py-[40px] px-[24px] flex items-center justify-center gap-[25px]'>
          <div className='md:w-[511px] w-full min-h-[475px] flex flex-col gap-[42px]'>
            <div className='min-h-[123px] flex flex-col justify-center items-center gap-[4px]'>
              <h2 className='font-bold text-[24px] leading-[40px] md:text-[28px] md:leading-[40px] text-[#0B0D0C]'>
                Contact Information
              </h2>
              <p className='font-normal text-base leading-[25px] md:text-[18px] md:leading-[25px] text-[#515B6F] text-center tracking-[0.15px]'>
                Lorem ipsum dolor sit amet consectetur. Aliquam scelerisque duis
                mollis ullamcorper ac felis. Commodo duis metus facilisi.
              </p>
            </div>
            {/* <div className='h-[310px] flex flex-col gap-[20px]'>
              {contactUsData.map(
                (
                  item: { value: string; icon: StaticImageData; type: string },
                  idx: number
                ) => (
                  <ContactUnit key={idx} {...item} />
                )
              )}
            </div> */}
            <div className='flex flex-col gap-[20px] min-h-[280px]'>
              <Input
                title='Full name'
                type='text'
                placeholder='This is placeholder'
                formik={formik}
              />
              <Input
                title='Phone Number'
                type='number'
                placeholder='This is placeholder'
                formik={formik}
              />
              <Input
                title='Email'
                type='email'
                placeholder='This is placeholder'
                formik={formik}
              />
            </div>

            <div className='w-full min-h-[129px] flex flex-col gap-[15px]'>
              <Button
                value='Submit'
                type='submit'
                green={true}
                className='min-h-[57px] rounded-[5px] py-[14px] px-[27px] w-full text-[18px] leading-[28.8px] font-bold text-[#FFFFFF]'
              />
              <Button
                value='Close'
                onClick={closeModal}
                className='min-h-[57px] rounded-[5px] py-[14px] px-[27px] w-full text-[18px] leading-[28.8px] font-bold bg-transparent text-[#414357] border-[1px] border-[#E9EBEB]'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface InputProps {
  title: string;
  placeholder?: string;
  type: string;
  formik: any;
}

const Input: FC<InputProps> = ({ title, placeholder, type, formik }) => {
  return (
    <label htmlFor={title} className='min-h-[80px] flex flex-col gap-[4px]'>
      <span className='text-base font-archivo leading-[25.6px] font-medium text-[#24272C]'>
        {title}
      </span>
      <input
        value={formik.values[title]}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        className='min-h-[50px] rounded-[5px] w-full border-[1px] py-[12px] px-[16px] outline-none bg-[#FFFFFF] border-[#E9EBEB]'
        placeholder={placeholder}
        type={type}
        id={title}
      />
      {/**Error display */}
      <span></span>
    </label>
  );
};

export default ContactUs;
