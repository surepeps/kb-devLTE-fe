/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */
'use client';
import AttachFile from '@/components/attach_file';
import Button from '@/components/button';
import Input from '@/components/Input';
import RadioCheck from '@/components/radioCheck';
// import { usePageContext } from '@/context/page-context';
// import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
// import { useRouter } from 'next/navigation';
import { POST_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import Cookies from 'js-cookie';

const PropertyType = () => {
  const docOfTheProperty: string[] = [
    'Survey Document',
    'Deed of Assignment',
    'Receipt',
    'C of O',
  ];
const owner = {
  ownerFullName: 'Oluwafemi Omolounnu',
  ownerPhoneNumber: '08090250410',
  ownerEmail: 'oluwafemiomolounnu@gmail.ccom',
};
  const formik = useFormik({
    initialValues: {
      propertyType: '',
      usageOptions: [] as string[],
      price: '',
      documents: [] as string[],
      noOfBedroom: '',
      additionalFeatures: [] as string[],
      selectedState: '',
      selectedCity: '',
      selectedLGA: '',
      ownerFullName: owner.ownerFullName,
      ownerPhoneNumber: owner.ownerPhoneNumber,
      ownerEmail: owner.ownerEmail, 
      areYouTheOwner: false,
    },
    validationSchema: Yup.object({
      propertyType: Yup.string().required('Property type is required'),
      usageOptions: Yup.array().min(1, 'At least one usage option is required'),
      price: Yup.string().required('Price is required'),
      documents: Yup.array().min(1, 'At least one document is required'),
      noOfBedroom: Yup.string().required('Number of bedrooms is required'),
      additionalFeatures: Yup.array().of(Yup.string()).min(1, 'At least one additional feature is required'), 
      selectedState: Yup.string().required('State is required'),
      selectedCity: Yup.string().required('City is required'),
      selectedLGA: Yup.string().required('LGA is required'),
      ownerFullName: Yup.string().required('Owner full name is required'),
      ownerPhoneNumber: Yup.string().required('Owner phone number is required'),
      ownerEmail: Yup.string().email('Invalid email').required('Owner email is required'),
    }),
    onSubmit: async (values) => {
      console.log(values);
      try {
        const url = URLS.BASE + URLS.agentCreateBrief;
        const payload = {
          propertyType: values.propertyType,
          usageOptions: values.usageOptions,
          propertyFeatures: {
            noOfBedrooms: values.noOfBedroom,
            additionalFeatures: values.additionalFeatures,
          },
          docOnProperty: values.documents.map((doc) => ({
            docName: doc,
            isProvided: true, // Assuming all selected documents are provided
          })),
          location: {
            state: values.selectedState,
            localGovernment: values.selectedLGA,
            area: values.selectedCity,
          },
          price: values.price,
          owner: {
            fullName: values.ownerFullName,
            phoneNumber: values.ownerPhoneNumber,
            email: values.ownerEmail,
          },
          areYouTheOwner: values.areYouTheOwner,
        };

        console.log('Payload:', payload);

        await toast.promise(
          POST_REQUEST(url, payload).then((response) => {
            console.log('response from brief', response);
            if ((response as any).owner) {
              toast.success('Property submitted successfully');
              // router.push('/success');
              return 'Property submitted successfully';
            } else {
              const errorMessage = (response as any).error || 'Submission failed';
              toast.error(errorMessage);
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
        // toast.error('An error occurred, please try again');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className='lg:w-[805px] bg-white p-[20px] lg:py-[50px] lg:px-[100px] w-full min-h-[797px] gap-[30px] md:px-[30px] mt-[30px] lg:mt-[60px]'>
      <div className='flex flex-col gap-[35px] w-full'>
        {/** Display Formik validation errors for owner's information */}
        <div className='w-full flex flex-col gap-[15px]'>
          {formik.errors.ownerFullName && (
            <span className='text-red-600 text-sm'>{formik.errors.ownerFullName}</span>
          )}
          {formik.errors.ownerPhoneNumber && (
            <span className='text-red-600 text-sm'>{formik.errors.ownerPhoneNumber}</span>
          )}
          {formik.errors.ownerEmail && (
            <span className='text-red-600 text-sm'>{formik.errors.ownerEmail}</span>
          )}
        </div>
        {/**Property Type */}
        <div className='lg:w-[535px] min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Property Type
          </h2>
          {/**options */}
          <div className='min-h-[26px] w-full flex flex-wrap gap-[20px] lg:gap-[50px]'>
            <RadioCheck
              isDisabled={formik.values?.propertyType ? true : false}
              selectedValue={formik.values?.propertyType}
              handleChange={() => {
                formik.setFieldValue('propertyType', 'Residential');
              }}
              type='radio'
              name='propertyType'
              value='Residential'
            />
            <RadioCheck
              isDisabled={formik.values?.propertyType ? true : false}
              selectedValue={formik.values?.propertyType}
              handleChange={() => {
                formik.setFieldValue('propertyType', 'Commercial');
              }}
              type='radio'
              name='propertyType'
              value='Commercial'
            />
            <RadioCheck
              isDisabled={formik.values?.propertyType ? true : false}
              selectedValue={formik.values?.propertyType}
              handleChange={() => {
                formik.setFieldValue('propertyType', 'Land');
              }}
              type='radio'
              name='propertyType'
              value='Land'
            />
          </div>
          {formik.touched.propertyType && formik.errors.propertyType && (
            <span className='text-red-600 text-sm'>{formik.errors.propertyType}</span>
          )}
        </div>
        {/**Usage Options */}
        <div className='min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Usage Options
          </h2>
          <div className='flex flex-wrap gap-[30px]'>
            {['All', 'Lease', 'Joint Venture', 'Outright Sale'].map(
              (item: string, idx: number) => (
                <RadioCheck
                  type='checkbox'
                  value={item}
                  key={idx}
                  name='Usage Options'
                  handleChange={() => {
                      const usageOptions = formik.values.usageOptions.includes(item)
                        ? formik.values.usageOptions.filter((option) => option !== item)
                        : [...formik.values.usageOptions, item];
                      formik.setFieldValue('usageOptions', usageOptions);
                  }}
                />
              )
            )}
          </div>
          {formik.touched.usageOptions && formik.errors.usageOptions && (
            <span className='text-red-600 text-sm'>{formik.errors.usageOptions}</span>
          )}
        </div>
        {/**Location */}
        <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Location
          </h2>
          {/**inputs */}
          <div className='min-h-[26px] w-full flex flex-col flex-wrap lg:grid lg:grid-cols-3 gap-[15px]'>
            <Input
              name='State'
              selectedState={{ value: formik.values?.selectedState, label: formik.values?.selectedState }}
              setSelectedState={(option) => {
                formik.setFieldValue('selectedState', option?.value);
              }}
              forState={true}
              type='text'
            />
            {/* <Input name='Local Government' type='text' /> */}
            <Input
              name='selectedLGA'
              type='text'
              value={formik.values.selectedLGA}
              onChange={formik.handleChange}
            />
            <Input
              name='Area'
              forCity={true}
              selectedState={{ value: formik.values?.selectedState, label: formik.values?.selectedState }} // Ensure city dropdown receives state
              setSelectedCity={(option) => {
                formik.setFieldValue('selectedCity', option?.value);
              }}
              type='text'
            />
          </div>
          {formik.touched.selectedState && formik.errors.selectedState && (
            <span className='text-red-600 text-sm'>{formik.errors.selectedState}</span>
          )}
          {formik.touched.selectedCity && formik.errors.selectedCity && (
            <span className='text-red-600 text-sm'>{formik.errors.selectedCity}</span>
          )}
        </div>
        {/**Price */}
        <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Price
          </h2>
          {/**input */}
          <div className='min-h-[26px] w-full flex gap-[50px]'>
            <Input
              placeholder='Enter property price'
              name='price'
              type='number'
              className='w-full'
              value={formik.values?.price}
              onChange={formik.handleChange}
            />
          </div>
          {formik.touched.price && formik.errors.price && (
            <span className='text-red-600 text-sm'>{formik.errors.price}</span>
          )}
        </div>
        {/**Document on the property */}
        <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Document on the property
          </h2>
          {/**options */}
          <div className='min-h-[26px] w-full flex flex-wrap gap-[30px]'>
            {docOfTheProperty.map((item: string, idx: number) => (
              <RadioCheck
                type='checkbox'
                key={idx}
                value={item}
                name='documents'
                handleChange={() => {
                  const documents = formik.values.documents.includes(item)
                    ? formik.values.documents.filter((doc) => doc !== item)
                    : [...formik.values.documents, item];
                  formik.setFieldValue('documents', documents);
                }}
              />
            ))}
          </div>
          {formik.touched.documents && formik.errors.documents && (
            <span className='text-red-600 text-sm'>{formik.errors.documents}</span>
          )}
        </div>
        {/**Property Features */}
        <div className='w-full min-h-[73px] flex flex-col gap-[15px]'>
          <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
            Property Features
          </h2>
          {/**options */}
          <div className='min-h-[26px] w-full flex gap-[15px]'>
            <Input
              name='noOfBedroom'
              type='number'
              className='lg:w-1/2 w-full'
              // isDisabled={formik.values?.noOfBedroom ? true : false}
              value={formik.values?.noOfBedroom}
              onChange={formik.handleChange}
            />
            <Input
              name='additionalFeatures'
              type='text'
              className='lg:w-1/2 w-full'
              value={formik.values?.additionalFeatures.join(', ')}
              onChange={(e) => {
                const features = e.target.value.split(',').map((feature) => feature.trim());
                formik.setFieldValue('additionalFeatures', features);
              }}
            />
          </div>
          {formik.touched.noOfBedroom && formik.errors.noOfBedroom && (
            <span className='text-red-600 text-sm'>{formik.errors.noOfBedroom}</span>
          )}
          {formik.touched.additionalFeatures && formik.errors.additionalFeatures && (
            <span className='text-red-600 text-sm'>{formik.errors.additionalFeatures}</span>
          )}
        </div>
        {/**Upload Image | Documents */}
        <AttachFile heading='Upload image(optional)' />

        {/**Button */}
        <div className='min-h-[50px] w-full flex justify-end items-center'>
          <Button
            value='Submit Brief'
            type='submit'
            className='min-h-[50px] w-full lg:w-[256px] py-[12px] px-[24px] bg-[#8DDB90] text-[#FAFAFA] text-base leading-[25.6px] font-bold'
          />
        </div>
      </div>
    </form>
  );
};

export default PropertyType;
