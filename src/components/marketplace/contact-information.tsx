/** @format */
'use client';
import React, { FC, useState } from 'react';
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
import toast from 'react-hot-toast';

type ConractInformationProps = {
  payload?: any;
  setIsContactInformationModalOpened?: (value: boolean) => void;
  type: 'buyer' | 'jv' | 'rent';
};

const ContactInformation: FC<ConractInformationProps> = ({
  setIsContactInformationModalOpened,
  type,
  payload,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const validationSchema = Yup.object({
    fullName: Yup.string().required('Name is required'),
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
      console.log('Payload:', payload.values);

      setIsSubmitting(true);
      if (type === 'buyer') {
        try {
          const url = URLS.BASE + URLS.userSubmitPreference;
          const payloadToPass = {
            propertyType: payload.values.usageOptions.join(','),
            features: payload.values.desirerFeatures,
            docOnProperty: payload.values.docsOnProperty.map((opt: string) => ({
              docName: opt,
              isProvided: true,
            })),
            propertyCondition: payload.values.desirerFeatures.toString(),
            location: {
              state: payload.values.location.split(',')[1].trim(),
              localGovernment: payload.values.location.split(',')[0].trim(),
              //area: payload.values.area,
            },
            budgetMin: Number(payload.values.prices.minPrice || 0),
            budgetMax: Number(payload.values.prices.maxPrice || 0),
            owner: {
              fullName: values.fullName,
              phoneNumber: values.phoneNumber,
              email: values.email,
            },
            areYouTheOwner: true,
            landSize: {
              measurementType: payload.values.landSize.type,
              size: Number(payload.values.landSize.size),
            },
            briefType: payload.values.briefType,
            additionalFeatures: {
              noOfBedrooms: Number(payload.values.bedroom || 0),
              noOfBathrooms: Number(payload.values.bathroom || 0),
            },
            tenantCriteria: [],
            // preferenceFeeTransaction: {
            //   accountName: values.fullName,
            //   transactionReciept: payload.values.paymentReceiptUrl,
            // },
          };
          console.log('Payload:', payloadToPass);

          await toast.promise(
            axios.post(url, payloadToPass).then((response) => {
              console.log('response from brief', response);
              if ((response as any).data.owner) {
                setIsSubmitting(false);
                toast.success('Preference submitted successfully');
                //setShowFinalSubmit(true);
                // setIsSubmittedSuccessfully(true);
                //setAreInputsDisabled(false);
                return 'Preference submitted successfully';
              } else {
                const errorMessage =
                  (response as any).error || 'Submission failed';
                toast.error(errorMessage);
                //setAreInputsDisabled(false);
                setIsSubmitting(false);
                throw new Error(errorMessage);
              }
            }),
            {
              loading: 'Submitting...',
              // success: 'Property submitted successfully',
              // error: 'An error occurred, please try again',
            }
          );
        } catch (error) {
          console.error(error);
          toast.error('Failed to submit property');
          //setAreInputsDisabled(false);
          setIsSubmitting(false);
        } finally {
          //setAreInputsDisabled(false);
        }
      } else if (type === 'rent') {
        try {
          const url = URLS.BASE + URLS.userSubmitPreference;
          const payloadToPass = {
            propertyType: payload.values.rentFilterBy.join(','),
            features: payload.values.desirerFeatures,
            docOnProperty: [],
            propertyCondition: payload.values.desiresFeatures.toString(),
            location: {
              state: payload.values.location.state,
              localGovernment: payload.values.location.lga,
              //area: payload.values.area,
            },
            budgetMin: Number(payload.values.price.minPrice || 0),
            budgetMax: Number(payload.values.price.maxPrice || 0),
            owner: {
              fullName: values.fullName,
              phoneNumber: values.phoneNumber,
              email: values.email,
            },
            areYouTheOwner: true,
            // landSize: {
            //   measurementType: payload.values.landSize.type,
            //   size: Number(payload.values.landSize.size),
            // },
            briefType: payload.values.briefType,
            additionalFeatures: {
              noOfBedrooms: Number(payload.values.bedroom || 0),
              noOfBathrooms: Number(payload.values.bathroom || 0),
            },
            tenantCriteria: [],
            // preferenceFeeTransaction: {
            //   accountName: values.fullName,
            //   transactionReciept: payload.values.paymentReceiptUrl,
            // },
          };
          console.log('Payload:', payloadToPass);

          await toast.promise(
            axios.post(url, payloadToPass).then((response) => {
              console.log('response from brief', response);
              if ((response as any).data.owner) {
                setIsSubmitting(false);
                toast.success('Preference submitted successfully');
                //setShowFinalSubmit(true);
                // setIsSubmittedSuccessfully(true);
                //setAreInputsDisabled(false);
                return 'Preference submitted successfully';
              } else {
                const errorMessage =
                  (response as any).error || 'Submission failed';
                toast.error(errorMessage);
                //setAreInputsDisabled(false);
                setIsSubmitting(false);
                throw new Error(errorMessage);
              }
            }),
            {
              loading: 'Submitting...',
              // success: 'Property submitted successfully',
              // error: 'An error occurred, please try again',
            }
          );
        } catch (error) {
          console.error(error);
          toast.error('Failed to submit property');
          setIsSubmitting(false);
          //setAreInputsDisabled(false);
        } finally {
          //setAreInputsDisabled(false);
        }
      }
      //asynchronous http request
      // try {
      //   const response = await axios.post(URLS.BASE);
      //   if (response.status === 200) {
      //     //do something
      //   } else {
      //   }
      // } catch (err) {
      //   console.error(err);
      // }
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
            <span className={`text-[#FF2539] font-semibold text-xl`}>
              Stay updated! Receive email updates on listing that fits your
              preference for{' '}
              <span className='text-black text-xl font-semibold'>N5,000</span>
            </span>
            <div className='w-full flex flex-col gap-[15px]'>
              <button
                type='submit'
                disabled={isSubmitting}
                className={`bg-[#8DDB90] h-[57px] rounded-[5px] text-lg ${archivo.className} font-bold text-white disabled:animate-pulse`}>
                {isSubmitting ? 'Submitting' : 'Submit'}
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
