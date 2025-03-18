/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import { archivo } from '@/styles/font';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

const ChangePassword = () => {
  const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Current Password is required'),
    newPassword: Yup.string().required('New Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <motion.form
      initial={{ y: 80, opacity: 0 }}
      viewport={{ once: true }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      onSubmit={formik.handleSubmit}
      className='w-full lg:h-[211px] bg-[#FFFFFF] p-[26px] border-[#D6DDEB] border-[1px] flex flex-col items-center justify-center gap-[29px]'>
      <div className='w-full min-h-[80px] flex justify-between gap-[28px]'>
        <InputPassword
          formik={formik}
          name='Current Password'
          id='currentPassword'
        />
        <InputPassword formik={formik} name='New Password' id='newPassword' />
      </div>
      <button
        className='lg:w-[317px] h-[50px] transition-all duration-500 gap-[10px] text-base font-bold text-[#FFFFFF] px-[12px] hover:bg-[#4d724e] bg-[#8DDB90] rounded-[5px]'
        title='Save Password'
        type='submit'>
        SAVE PASSWORD
      </button>
    </motion.form>
  );
};

type InputPasswordProps = {
  id: string;
  value?: string;
  name: string;
  formik: any;
};
const InputPassword = ({ id, name, formik }: InputPasswordProps) => {
  return (
    <label htmlFor={id} className='flex flex-col h-[80px] w-full gap-[4px]'>
      <span className='font-base font-normal text-[#1E170A]'>{name}</span>
      <input
        onBlur={formik.handleBlur}
        onChange={(e: { target: { value: string } }) => {
          formik.setFieldValue(id, e.target.value);
        }}
        title={name}
        className={`w-full h-[50px] py-[16px] px-[12px] bg-[#FFFFFF] border-[#D0CEC8] border-[1px] rounded-[5px] placeholder:text-[#696866] font-normal text-base ${archivo.className} text-black outline-none`}
        type='password'
        placeholder='This is a placeholder'
        name={name}
        id={id}
      />
      {(formik.errors[id] || formik.touched[id]) && (
        <span className='text-sm text-red-600'>{formik.errors[id]}</span>
      )}
    </label>
  );
};

export default ChangePassword;
