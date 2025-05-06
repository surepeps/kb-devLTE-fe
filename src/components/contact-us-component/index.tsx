/** @format */

'use client';
import React from 'react';
import Input from '../general-components/Input';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { URLS } from '@/utils/URLS';
import { contactUsData } from '@/data';
import Image, { StaticImageData } from 'next/image';
import ContactUnit from '../contact_unit';
import Link from 'next/link';

const ContactUs = () => {
  const [status, setStatus] = React.useState<
    'idle' | 'pending' | 'success' | 'failed'
  >('idle');
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    message: Yup.string()
      .min(10, 'Message must be at least 10 characters')
      .max(500, 'Message must be at most 500 characters')
      .required('Message is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, 'Phone number must be digits only')
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be at most 15 digits')
      .required('Phone number is required'),
    category: Yup.string().required('Category is required'),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
      phoneNumber: '',
      category: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      // setStatus('pending');
      // try {
      //   const response = await axios.post(URLS.BASE);
      //   if (response.status === 200) {
      //     setStatus('success');
      //     formik.resetForm();
      //     setTimeout(() => {
      //       setStatus('idle');
      //     }, 2000);
      //   }
      // } catch (error) {
      //   console.log(error);
      //   setStatus('failed');
      // }
    },
  });
  return (
    <div className='w-full flex items-center justify-center'>
      <div className='container flex flex-col justify-center items-center gap-[60px] py-[40px] px-[20px]'>
        <div className='flex flex-col justify-center items-center'>
          <h2 className='md:text-4xl text-3xl font-display text-center font-semibold text-[#09391C]'>
            Let's{' '}
            <span className='md:text-4xl text-3xl font-display font-semibold text-[#8DDB90]'>
              chat
            </span>
            , reach out to us
          </h2>
          <p className='text-lg md:text-xl font-normal text-[#5A5D63] text-center md:mx-[250px] md:px-[0px] mt-3'>
            Have questions or feedback? We are here to help. Send us a message
            and we will respond within 24 hours.
          </p>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className='w-full flex md:flex-row flex-col gap-[40px] items-center justify-center'>
          <div className='w-full md:w-[561px] flex flex-col gap-[40px]'>
            <div className='w-full grid grid-cols-2 gap-x-[25px] md:gap-x-[45px] gap-y-[20px]'>
              <Input
                name='name'
                label='Name'
                type='text'
                id='name'
                formik={formik}
                placeholder='Enter your name'
                value={formik.values.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <Input
                name='phoneNumber'
                label='Phone Number'
                type='number'
                id='phoneNumber'
                formik={formik}
                placeholder='Enter your phone number'
                value={formik.values.phoneNumber}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <Input
                name='email'
                label='Email'
                type='email'
                id='email'
                formik={formik}
                placeholder='Enter your email'
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <Input
                name='category'
                label='Category'
                type='text'
                id='category'
                formik={formik}
                placeholder='Enter your category'
                value={formik.values.category}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <label
                htmlFor='message'
                className='flex flex-col gap-[5px] w-full col-span-2'>
                <span className='text-base text-[#1E1E1E] font-medium'>
                  Tell us the issue
                </span>
                <textarea
                  name='message'
                  id='message'
                  value={formik.values.message}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  className='h-[93px] w-full border-[1px] border-[#D6DDEB] rounded-[4px] py-[16px] px-[12px] bg-[#FAFAFA] placeholder:text-[#A8ADB7] text-black text-base focus:outline-[1.5px] focus:outline-[#14b8a6] focus:outline-offset-0 resize-none'
                  placeholder='Tell us the issue'></textarea>
                {(formik?.errors?.message || formik?.touched.message) && (
                  <span className='text-red-600 text-xs'>
                    {formik?.errors?.message}
                  </span>
                )}
              </label>
            </div>
            <button
              className='h-[66px] bg-[#8DDB90] flex items-center justify-center font-bold text-xl text-[#FFFFFF]'
              type='submit'>
              List a property
            </button>
          </div>
          <div className='w-full md:w-[589px] bg-[#FFFFFF] rounded-[4px] p-[15px] md:p-[40px] flex items-center justify-center'>
            <div className='w-full h-full flex flex-col gap-[20px] md:gap-[30px]'>
              <h2 className='text-[28px] font-bold leading-[40.4px] text-[#0B0D0C] text-center'>
                Our Contact
              </h2>
              <div className='flex flex-col gap-[20px]'>
                {contactUsData.map(
                  (
                    item: {
                      value: string;
                      icon: StaticImageData;
                      type: string;
                    },
                    idx: number
                  ) => {
                    if (idx < 2) {
                      return <ContactUnit key={idx} {...item} />;
                    }
                    return (
                      <div
                        key={idx}
                        className='h-[90px] w-full flex items-center justify-between bg-[#F6FFF7] px-[15px]'>
                        <div className='flex items-center gap-[20px]'>
                          <div className='flex items-center gap-[20px] bg-white justify-center md:w-[60px] md:h-[60px] w-[46px] h-[46px] rounded-full'>
                            <Image
                              key={idx}
                              src={item.icon}
                              width={1000}
                              height={1000}
                              alt=''
                              className='w-[24px] h-[24px]'
                            />
                          </div>
                          <h3 className='md:text-[18px] font-semibold md:leading-[28px] text-base leading-[25px] text-[#000000]'>
                            {item.value}
                          </h3>
                        </div>
                        {/**button */}
                        <Link
                          href={'https://wa.me/+23470454556775'}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='bg-[#8DDB90] h-[40px] md:h-[50px] w-[120px] md:w-[155px] text-base text-white font-bold flex items-center justify-center'
                          type='button'>
                          Chat with us
                        </Link>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
