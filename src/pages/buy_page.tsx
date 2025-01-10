/** @format */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';
import React, { useState } from 'react';
import arrowRightIcon from '@/svgs/arrowR.svg';
import Image from 'next/image';
import Link from 'next/link';
import { usePageContext } from '@/context/page-context';
import { motion } from 'framer-motion';
import arrow from '@/svgs/arrowRight.svg';
import HouseFrame from '@/components/house-frame';
import houseImage from '@/assets/assets.png';
import { useLoading } from '@/hooks/useLoading';
import Loading from '@/components/loading';
import { epilogue } from '@/styles/font';
import { featuresData } from '@/data/buy_data';
import checkIcon from '@/svgs/checkIcon.svg';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface DetailsProps {
  price: number | string;
  propertyType: string;
  bedRoom: number;
  propertyStatus: string;
}

interface FormProps {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  message: string;
}

const Buy = () => {
  const [point, setPoint] = useState<string>('Details');
  const { isContactUsClicked } = usePageContext();
  const [scrollPosition, setScrollPosition] = useState(0);
  const isLoading = useLoading();
  const [details, setDetails] = useState<DetailsProps>({
    price: '1,000,000,000',
    propertyType: 'Residential',
    bedRoom: 5,
    propertyStatus: 'For Sale',
  });

  const handlePreviousSlide = () => {
    const scrollableElement = document.getElementById(
      'scrollableElement'
    ) as HTMLElement;

    if (scrollableElement) {
      const maxScrollPosition =
        scrollableElement.scrollWidth - scrollableElement.clientWidth;
      const increment = 500; // The amount to scroll each time (in pixels)

      // Calculate the next scroll position
      const newScrollPosition = Math.min(
        scrollPosition - increment,
        maxScrollPosition
      );

      // Scroll the element
      scrollableElement.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });

      // Update the state with the new scroll position
      setScrollPosition(newScrollPosition);
    }
  };

  const handleNextSlide = () => {
    const scrollableElement = document.getElementById(
      'scrollableElement'
    ) as HTMLElement;

    if (scrollableElement) {
      const maxScrollPosition =
        scrollableElement.scrollWidth - scrollableElement.clientWidth;
      const increment = 500; // The amount to scroll each time (in pixels)

      // Calculate the next scroll position
      const newScrollPosition = Math.min(
        scrollPosition + increment,
        maxScrollPosition
      );

      // Scroll the element
      scrollableElement.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });

      // Update the state with the new scroll position
      setScrollPosition(newScrollPosition);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string()
      .email()
      .required()
      .matches(/^[^\s@]+@[^\s@]+\.com$/, 'Invalid email address'),
    phoneNumber: Yup.string()
      .required()
      .matches(/0\d{10}$/, 'Invalid phone number'),
    gender: Yup.string().required(),
    message: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phoneNumber: '',
      gender: '',
      message: '',
    },
    validationSchema,
    onSubmit: (values: FormProps) => {
      console.log(values);
    },
  });

  if (isLoading) return <Loading />;

  return (
    <section
      className={`min-h-[1000px] flex justify-center w-full bg-white pb-[50px] ${
        isContactUsClicked &&
        'filter brightness-[30%] transition-all duration-500 overflow-hidden'
      }`}>
      <div className='flex flex-col items-center gap-[20px] w-full'>
        <div className='min-h-[90px] container w-full flex items-center lg:px-[40px]'>
          <div className='flex gap-1 items-center'>
            <Image
              alt=''
              src={arrowRightIcon}
              width={24}
              height={24}
              className='w-[24px] h-[24px]'
            />
            <div className='flex gap-2 items-center align-middle'>
              <Link
                href={'/'}
                className='text-[20px] leading-[32px] text-[#25324B] font-normal'>
                Home
              </Link>
              <h3 className='text-[20px] leading-[32px] text-[#25324B] font-semibold'>
                .&nbsp;{point}
              </h3>
            </div>
          </div>
        </div>

        <div
          id='scrollableElement'
          className='w-full hide-scrollbar gap-[30px] overflow-x-auto flex mt-0 md:mt-10 lg:mt-0'>
          {Array.from({ length: 18 }).map((__, idx: number) => (
            <div
              key={idx}
              className='w-[424px] h-[324px] bg-[#D9D9D9] flex-shrink-0'>
              {/* {idx} */}
            </div>
          ))}
        </div>
        <div className='flex gap-[18px]'>
          {/**Previous */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousSlide}
            className='w-[54px] h-[54px] cursor-pointer flex justify-center items-center border-[#5A5D6380] border-[1px]'>
            <Image
              src={arrow}
              width={25}
              height={25}
              alt=''
              className='w-[25px] h-[25px] transform rotate-180'
            />
          </motion.div>
          {/**Next */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextSlide}
            className='w-[54px] h-[54px] cursor-pointer flex justify-center items-center border-[#5A5D6380] border-[1px]'>
            <Image
              src={arrow}
              width={25}
              height={25}
              alt=''
              className='w-[25px] h-[25px]'
            />
          </motion.div>
        </div>

        {/**Next Section */}
        <div className='container px-[40px] min-h-[1400px] flex md:flex-row flex-col gap-[40px]'>
          <div className='md:w-[70%] w-full h-full flex flex-col gap-[20px]'>
            {/**Details */}
            <div className='min-h-[152px] w-full py-[40px] border-b-[1px] border-[#C7CAD0]'>
              <h2
                className={`text-[24px] leading-[38.4px] font-semibold font-epilogue`}>
                Details
              </h2>

              <div className='w-full min-h-[152px] grid grid-cols-2 grid-rows-2'>
                {/**Price */}
                <div className='min-w-[122px] min-h-[68px] gap-[10px]'>
                  <h4 className='text-[18px] text-[#7C8493] leading-[28.8px] font-normal'>
                    Price
                  </h4>
                  <h3 className='text-[18px] leading-[28.8px] font-bold text-[#25324B] font-epilogue'>
                    {details.price}
                  </h3>
                </div>

                {/**Property Type */}
                <div className='min-w-[122px] min-h-[68px] gap-[10px]'>
                  <h4 className='text-[18px] text-[#7C8493] leading-[28.8px] font-normal'>
                    Property Type
                  </h4>
                  <h3 className='text-[18px] leading-[28.8px] font-bold text-[#25324B] font-epilogue'>
                    {details.propertyType}
                  </h3>
                </div>

                {/**Bed room */}
                <div className='min-w-[122px] min-h-[68px] gap-[10px]'>
                  <h4 className='text-[18px] text-[#7C8493] leading-[28.8px] font-normal'>
                    Bed Room
                  </h4>
                  <h3 className='text-[18px] leading-[28.8px] font-bold text-[#25324B] font-epilogue'>
                    {details.bedRoom}
                  </h3>
                </div>

                {/**Property Status */}
                <div className='min-w-[122px] min-h-[68px] gap-[10px]'>
                  <h4 className='text-[18px] text-[#7C8493] leading-[28.8px] font-normal'>
                    Property Status
                  </h4>
                  <h3 className='text-[18px] leading-[28.8px] font-bold text-[#25324B] font-epilogue'>
                    {details.propertyStatus}
                  </h3>
                </div>
              </div>
            </div>

            {/**Features */}
            <div className='min-h-[152px] w-full py-[40px] border-b-[1px] border-[#C7CAD0]'>
              <h2
                className={`text-[24px] leading-[38.4px] font-semibold font-epilogue`}>
                Features
              </h2>

              <div className='w-full grid grid-cols-2 mt-[10px] gap-[8px]'>
                {featuresData.map((item: string, idx: number) => {
                  return (
                    <div key={idx} className='flex items-center gap-[8px]'>
                      <Image
                        src={checkIcon}
                        width={20}
                        height={20}
                        className='w-[20px] h-[20px]'
                        alt=''
                      />
                      <span className='text-base leading-[25.6px] font-normal text-[#5A5D63]'>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/**Contact Information */}
            <div className='min-h-[152px] w-full py-[40px] border-b-[1px] border-[#C7CAD0]'>
              <h2
                className={`text-[24px] leading-[38.4px] font-semibold font-epilogue`}>
                Contact Information
              </h2>

              <form
                onSubmit={formik.handleSubmit}
                method='post'
                className='w-full min-h-[270px] mt-[10px] flex flex-col gap-[15px]'>
                <section className='grid grid-cols-2 gap-[15px]'>
                  <Input
                    name='
                  Name'
                    placeholder='This is a placeholder'
                    type='text'
                  />
                  <Input
                    name='
                  Phone Number'
                    placeholder='This is a placeholder'
                    type='number'
                  />
                  <Input
                    name='
                  Email'
                    placeholder='This is a placeholder'
                    type='email'
                  />
                  <label
                    className=' w-full min-h-[80px] gap-[4px] flex flex-col'
                    htmlFor={'gender'}>
                    <h2 className='text-base leading-[25.6px] text-[#1E1E1E] font-medium'>
                      I am
                    </h2>
                    <select
                      className='min-h-[50px] w-full border-[1px] bg-[#FAFAFA] border-[#D6DDEB] py-[12px] px-[16px] text-base leading-[25.6px] text-[#1E1E1E] outline-none font-normal placeholder:text-[#A8ADB7]'
                      name='gender'
                      id='gender'>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                      <option value='Prefer not to say'>
                        Prefer not to say
                      </option>
                    </select>
                  </label>
                </section>

                <label
                  className='w-full min-h-[80px] gap-[4px] flex flex-col'
                  htmlFor={'message'}>
                  <h2 className='text-base leading-[25.6px] text-[#1E1E1E] font-medium'>
                    Message
                  </h2>
                  <textarea
                    id='message'
                    placeholder={'Enter your message here'}
                    className='min-h-[93px] w-full border-[1px] bg-[#FAFAFA] border-[#D6DDEB] resize-none py-[12px] px-[16px] text-base leading-[25.6px] text-[#1E1E1E] outline-none font-normal placeholder:text-[#A8ADB7]'></textarea>
                </label>
              </form>
            </div>
          </div>
          <div className='md:w-[30%] hidden h-full md:flex md:flex-col gap-[10px]'>
            {Array.from({ length: 6 }).map((__, idx: number) => {
              return (
                <HouseFrame
                  key={idx}
                  image={houseImage}
                  title='Contemporary Bedroom Home'
                  location='Ikoyi'
                  bedroom={5}
                  bathroom={2}
                  carPark={3}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Input = ({
  name,
  placeholder,
  type,
}: {
  name: string;
  placeholder: string;
  type: string;
}) => {
  return (
    <label
      className='md:1/2 w-full min-h-[80px] gap-[4px] flex flex-col'
      htmlFor={name}>
      <h2 className='text-base leading-[25.6px] text-[#1E1E1E] font-medium'>
        {name}
      </h2>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        className='min-h-[50px] w-full border-[1px] bg-[#FAFAFA] border-[#D6DDEB] py-[12px] px-[16px] text-base leading-[25.6px] text-[#1E1E1E] outline-none font-normal placeholder:text-[#A8ADB7]'
      />
    </label>
  );
};

export default Buy;
