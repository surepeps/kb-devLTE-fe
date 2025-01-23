/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Loading from '@/components/loading';
import { useLoading } from '@/hooks/useLoading';
import Image from 'next/image';
import React, { FC } from 'react';
import mailIcon from '@/svgs/envelope.svg';
import phoneIcon from '@/svgs/phone.svg';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@/components/button';
import RadioCheck from '@/components/radioCheck';
import { RegisterWith } from '@/components/registerWith';
import googleIcon from '@/svgs/googleIcon.svg';
import facebookIcon from '@/svgs/facebookIcon.svg';
import Link from 'next/link';
import { usePageContext } from '@/context/page-context';

const Register = () => {
  const isLoading = useLoading();
  const { isContactUsClicked } = usePageContext();

  const validationSchema = Yup.object({
    email: Yup.string().required('enter email'),
    password: Yup.string().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    phone: Yup.number().required(),
  });
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
    // validationSchema,
    onSubmit: (values) => {
      console.log(values);
      //Handle logic here
      window.location.href = '/auth/agent/form';
    },
  });

  if (isLoading) return <Loading />;
  return (
    <section
      className={`flex items-center justify-center bg-[#EEF1F1] w-full ${
        isContactUsClicked && 'filter brightness-[30%]'
      } transition-all duration-500`}>
      <div className='container flex items-center justify-center py-[30px] mt-[60px] px-[25px] lg:px-0'>
        <form
          onSubmit={formik.handleSubmit}
          className='lg:w-[600px] w-full min-h-[700px] flex flex-col items-center gap-[20px]'>
          <h2 className='text-[24px] leading-[38.4px] font-semibold text-[#09391C]'>
            Register with us
          </h2>
          <div className='w-full min-h-[460px] flex flex-col gap-[15px] lg:px-[60px]'>
            <Input
              formik={formik}
              title='Email'
              id='email'
              icon={mailIcon}
              type='email'
            />
            <Input
              formik={formik}
              title='Password'
              id='password'
              icon={''}
              type='password'
            />
            <Input
              formik={formik}
              title='First name'
              id='password'
              icon={''}
              type='text'
            />
            <Input
              formik={formik}
              title='Last name'
              id='password'
              icon={''}
              type='text'
            />
            <Input
              formik={formik}
              title='Phone'
              id='phone'
              icon={phoneIcon}
              type='number'
            />
          </div>
          <div className='flex justify-center items-center w-full lg:px-[60px]'>
            <RadioCheck
              onClick={() => {}}
              type='checkbox'
              name='agree'
              className='w-full'
              value={`By clicking here, I agree to the Khabi-Teq realty <br/> <a href='/policies_page'><span style='color: #0B423D; font-weight: bold'>Policy</span> and <span style='color: #0B423D; font-weight: bold'>Rules</span></a>`}
            />
          </div>
          {/**Button */}
          <Button
            value='Register'
            className='min-h-[65px] w-full py-[12px] px-[24px] bg-[#8DDB90] text-[#FAFAFA] text-base leading-[25.6px] font-bold'
            type='submit'
            onSubmit={formik.handleSubmit}
            green={true}
          />
          {/**Already have an account */}
          <span className='text-base leading-[25.6px] font-normal'>
            Already have an account?{' '}
            <Link className='font-semibold text-[#09391C]' href={'#'}>
              Sign In
            </Link>
          </span>
          {/**Google | Facebook */}
          <div className='flex justify-between lg:flex-row flex-col gap-[15px]'>
            <RegisterWith icon={googleIcon} text='Continue with Google' />
            <RegisterWith icon={facebookIcon} text='Continue with Facebook' />
          </div>
        </form>
      </div>
    </section>
  );
};

interface InputProps {
  title: string;
  placeholder?: string;
  type: string;
  className?: string;
  id?: string;
  icon: StaticImport | string;
  formik: any;
}

const Input: FC<InputProps> = ({
  className,
  id,
  title,
  type,
  placeholder,
  icon,
  formik,
}) => {
  return (
    <label
      htmlFor={id}
      className={`min-h-[80px] ${className} flex flex-col gap-[4px]`}>
      <span className='text-base leading-[25.6px] font-medium text-[#1E1E1E]'>
        {title}
      </span>
      <div className='flex'>
        <input
          name={id}
          type={type}
          value={formik.values[title]}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder={placeholder ?? 'This is placeholder'}
          className='w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px] hide-scrollbar'
        />
        {icon ? (
          <Image
            src={icon}
            alt=''
            width={20}
            height={20}
            className='w-[20px] h-[20px] absolute ml-[330px] lg:ml-[440px] z-20 mt-[15px]'
          />
        ) : null}
      </div>
      {formik.touched[title] ||
        (formik.errors[title] && (
          <span className='text-red-600 text-sm'>{formik.errors[title]}</span>
        ))}
    </label>
  );
};

export default Register;
