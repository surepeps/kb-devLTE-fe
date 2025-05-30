/** @format */
'use client';
import React, { FC } from 'react';
import PopUpModal from '../pop-up-modal-reusability';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import Input from '../general-components/Input';
import * as Yup from 'yup';
import { archivo } from '@/styles/font';
import axios from 'axios';
import { URLS } from '@/utils/URLS';

type ConractInformationProps = {
  payload?: any;
  setIsContactInformationModalOpened?: (value: boolean) => void;
  type: 'buyer' | 'seller';
};

const ContactInformation: FC<ConractInformationProps> = ({
  setIsContactInformationModalOpened,
  type,
}) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').notRequired(),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^\d+$/, 'Phone must be digits only')
      .min(10, 'Phone number must be at least 10 digits'),
  });
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      //asynchronous http request
      try {
        const response = await axios.post(URLS.BASE);
        if (response.status === 200) {
          //do something
        } else {
        }
      } catch (err) {
        console.error(err);
      }
      //close the modal
      setIsContactInformationModalOpened?.(false);
    },
  });
  return (
    <PopUpModal>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        viewport={{ once: true }}
        id='contact-information-modal'
        whileInView={{ opacity: 1, y: 0 }}
        className='lg:w-[649px] flex flex-col gap-[26px]'>
        <div className='w-full flex items-start justify-end'>
          <button
            onClick={() => setIsContactInformationModalOpened?.(false)}
            type='button'
            className='w-[51px] h-[51px] flex items-center justify-center rounded-full bg-[#FFFFFF]'>
            <FontAwesomeIcon
              icon={faClose}
              width={24}
              height={24}
              color='#181336'
              className='w-[24px] h-[24px]'
            />
            {''}
          </button>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className='py-[40px] px-[60px] rounded-[4px] bg-white shadow-md flex items-center justify-center'>
          <div className='w-full flex flex-col gap-[42px]'>
            <div className='flex flex-col gap-[4px] items-center justify-center'>
              <h2 className='text-2xl font-bold text-gray-900 text-center'>
                Contact Information
              </h2>
              <p className='text-lg text-[#515B6F] text-center'>
                Please provide your contact details so we can get back to you.
              </p>
            </div>
            <div className='flex flex-col gap-[20px]'>
              <Input
                name='fullName'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type='text'
                value={formik.values.fullName}
                id='fullName'
                label='Full Name'
                placeholder={`Full name of the ${type}`}
              />
              <Input
                name='phoneNumber'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type='number'
                value={formik.values.phoneNumber}
                id='phoneNumber'
                label='Phone Number'
                placeholder={`Active phone number for follow-up`}
              />
              <Input
                name='email'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type='email'
                value={formik.values.email}
                id='email'
                label='Email'
                placeholder={`Optional, for communication`}
              />
            </div>
            <div className='w-full flex flex-col gap-[15px]'>
              <button
                type='submit'
                className={`bg-[#8DDB90] h-[57px] rounded-[5px] text-lg ${archivo.className} font-bold text-white`}>
                Submit
              </button>
              <button
                onClick={() => {
                  formik.resetForm();
                  setIsContactInformationModalOpened?.(false);
                }}
                type='reset'
                className={`bg-transparent border-[1px] border-[#E9EBEB] h-[57px] rounded-[5px] text-lg ${archivo.className} font-bold text-gray-700`}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </PopUpModal>
  );
};

export default ContactInformation;
