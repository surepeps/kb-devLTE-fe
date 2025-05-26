/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Button from '@/components/general-components/button';
import Loading from '@/components/loading-component/loading';
import { toast } from 'react-hot-toast';
import { useLoading } from '@/hooks/useLoading';
import React, { Fragment, useEffect, useState } from 'react';
import RadioCheck from '@/components/general-components/radioCheck';
import { POST_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import Input from '@/components/general-components/Input';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { featuresData, tenantCriteriaData } from '@/data/landlord';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { usePageContext } from '@/context/page-context';
import AttachFile from '@/components/multipleAttachFile';
import 'react-phone-number-input/style.css';
import { useRouter } from 'next/navigation';
import arrowRightIcon from '@/svgs/arrowR.svg';

import Image from 'next/image';
import comingSoon from '@/assets/cominsoon.png';
import { epilogue } from '@/styles/font';
import MultiSelectionProcess from '@/components/multiSelectionProcess';
import ImageContainer from '@/components/general-components/image-container';
import axios from 'axios';
import data from '@/data/state-lga';
import BreadcrumbNav from '@/components/general-components/BreadcrumbNav';
import Stepper from '@/components/post-property-components/Stepper';

interface Option {
  value: string;
  label: string;
}
const Landlord = () => {
  const isLoading = useLoading();
  const router = useRouter();
  const [isLegalOwner, setIsLegalOwner] = useState<boolean>(false);
  const { setIsSubmittedSuccessfully } = usePageContext();
  const [areInputsDisabled, setAreInputsDisabled] = useState<boolean>(false);

  const [isComingSoon, setIsComingSoon] = useState<boolean>(false);

  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedLGA, setSelectedLGA] = useState<Option | null>(null);

  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [lgaOptions, setLgaOptions] = useState<Option[]>([]);
  const [showBedroom, setShowBedroom] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<{ id: string; image: string }[]>([]);
  const { setViewImage, setImageData } = usePageContext();
  const [currentStep, setCurrentStep] = useState(0);

const steps: { label: string; status: "completed" | "active" | "pending" }[] = [
  { label: "Submit preference details", status: currentStep > 0 ? "completed" : currentStep === 0 ? "active" : "pending" },
  { label: "contact Detail", status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending" },
];

  useEffect(() => {
    const filteredArray: string[] = [];
    if (fileUrl.length !== 0) {
      for (let i = 0; i < fileUrl.length; i++) {
        filteredArray.push(fileUrl[i].image);
      }
    }
    formik.setFieldValue('images', filteredArray);
    console.log(formik.values);
  }, [fileUrl]);

  useEffect(() => {
    // Load Nigerian states correctly
    setStateOptions(
      Object.keys(data).map((state: string) => ({
        value: state,
        label: state,
      }))
    );
  }, []);

  const handleLGAChange = (selected: Option | null) => {
    formik.setFieldValue('selectedLGA', selected?.value);
    // console.log('Selected LGA:', formik.values); // Debugging
    setSelectedLGA?.(selected);
  };

  const handleStateChange = (selected: Option | null) => {
    // console.log('Selected State:', selected);
    formik.setFieldValue('selectedState', selected?.value);
    setSelectedState?.(selected);

    if (selected) {
      const lgas = Object.values(data[selected.label]);
      // console.log('Raw LGA Data:', lgas); // Log raw LGA data

      if (Array.isArray(lgas)) {
        setLgaOptions(
          lgas.map((lga: string) => ({
            value: lga,
            label: lga,
          }))
        );
      } else {
        // console.error('LGAs not returned as an array:', lgas);
        setLgaOptions([]);
      }
      setSelectedLGA?.(null);
    } else {
      // console.log('Hey');
      setLgaOptions([]);
      setSelectedLGA?.(null);
    }
  };

  const formik = useFormik({
    initialValues: {
      propertyType: '',
      propertyCondition: '',
      area: '',
      // usageOptions: [] as string[],
      price: '',
      features: [] as string[],
      tenantCriteria: [] as string[],
      noOfBedroom: '',
      // additionalFeatures: [] as string[],
      selectedState: '',
      // selectedAddress: '',
      // selectedCity: '',
      selectedLGA: '',
      ownerFullName: '',
      ownerPhoneNumber: '',
      ownerEmail: '',
      areYouTheOwner: true,
      rentalPrice: undefined as number | undefined,
      bedroom: undefined as string | undefined,
      images: [],
    },
    validationSchema: Yup.object({
      propertyType: Yup.string().required('Property type is required'),
      propertyCondition: Yup.string().required(
        'Property condition is required'
      ),
      // area: Yup.string().required('Area is required'),
      rentalPrice: Yup.string().required('Rental price is required'),
      features: Yup.array().min(1, 'At least one feature is required'),
      tenantCriteria: Yup.array().min(
        1,
        'At least one tenant criteria is required'
      ),
      noOfBedroom: Yup.string(),
      bedroom: Yup.string().required('Number of bedrooms is required'),
      // additionalFeatures: Yup.array()
      //   .of(Yup.string())
      //   .min(1, 'At least one additional feature is required'),
      selectedState: Yup.string().required('State is required'),
      // selectedCity: Yup.string().required('City is required'),
      selectedLGA: Yup.string().required('LGA is required'),
      ownerFullName: Yup.string().required('Owner full name is required'),
      ownerPhoneNumber: Yup.string()
        .required('Owner phone number is required')
        .test('is-valid-phone', 'Invalid phone number', (value) =>
          value ? isValidPhoneNumber(value) : false
        ),
      ownerEmail: Yup.string()
        .email('Invalid email')
        .required('Owner email is required'),
    }),
    validateOnBlur: true, // Enable validation on blur
    validateOnChange: true, // Enable validation on change
    onSubmit: async (values) => {
      console.log(values);
      setAreInputsDisabled(true);
      try {
        const url = URLS.BASE + URLS.landLordCreateBrief;
        const payload = {
          propertyType: values.propertyType,
          propertyCondition: values.propertyCondition,
          location: {
            state: values.selectedState,
            localGovernment: values.selectedLGA,
            // area: values.area,
          },
          bedroom: values.bedroom,
          rentalPrice: values.rentalPrice,
          noOfBedrooms: Number(values?.bedroom?.split(' ')[0].trimStart()),
          features: values.features.map((feature) => ({
            featureName: feature,
          })),
          tenantCriteria: values.tenantCriteria.map((criterium) => ({
            criteria: criterium,
          })),
          owner: {
            fullName: values.ownerFullName,
            phoneNumber: values.ownerPhoneNumber,
            email: values.ownerEmail,
          },
          areYouTheOwner: values.areYouTheOwner,
        };

        // console.log('Payload:', payload);

        await toast.promise(
          axios.post(url, payload).then((response) => {
            console.log('response from brief', response);
            if ((response as any).data.owner) {
              toast.success('Property submitted successfully');
              // router.push('/success');
              setIsSubmittedSuccessfully(true);
              setAreInputsDisabled(false);
              return 'Property submitted successfully';
            } else {
              const errorMessage =
                (response as any).error || 'Submission failed';
              toast.error(errorMessage);
              setAreInputsDisabled(false);
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
        setAreInputsDisabled(false);
        // toast.error('An error occurred, please try again');
      } finally {
        setAreInputsDisabled(false);
      }
    },
  });

  useEffect(() => {
    console.log(isLegalOwner);
  }, [isLegalOwner]);

  if (isLoading) return <Loading />;
  if (isComingSoon) return <UseIsComingPage />;
  return (
    <Fragment>
      <section
        className={`min-h-[800px] bg-[#EEF1F1] w-full flex justify-center items-center transition-all duration-500`}>
        <div className='container flex flex-col justify-center items-center gap-[10px] my-[20px] px-[20px]'>
          <div className='w-full flex justify-start'>
            <BreadcrumbNav
              point="Cancel"
              onBack={() => router.back()}
              arrowIcon={arrowRightIcon}
              backText="MarketPlace"
            />
          </div>
          <div className='my-7'>
            <Stepper steps={steps} />
          </div>
          <h2 className='text-[#0B0D0C] lg:text-[24px] font-semibold text-center text-[30px]'>
            {currentStep === 1
              ? 'Contact information'
              : 'Enter the property you are looking for'}
          </h2>
          <h2 className='lg:w-[953px] w-full text-base md:text-lg text-[#515B6F] font-normal text-center'>
              Please provide your contact details so we can get back to you.
          </h2>
          <div className='lg:w-[877px] w-full'>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
                if (!formik.isValid) {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth',
                  });
                }
              }}
              className='w-full border-[#8D909680] flex flex-col'>
              {currentStep === 0 && (
              <div className='min-h-[629px] py-[40px] lg:px-[80px]  w-full'>
                <div className='w-full flex flex-col gap-[30px]'>
                  <div className='min-h-[73px] gap-[15px] flex flex-col w-full'>
                    <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                      Property Type
                    </h2>
                    <div className='w-full gap-[20px] lg:gap-[50px] flex flex-row flex-wrap'>
                      <RadioCheck
                        selectedValue={formik.values?.propertyType}
                        handleChange={() => {
                          formik.setFieldValue('propertyType', 'Residential');
                        }}
                        type='radio'
                        value='Residential'
                        name='propertyType'
                      />
                      <RadioCheck
                        selectedValue={formik.values?.propertyType}
                        handleChange={() => {
                          formik.setFieldValue('propertyType', 'Commercial');
                        }}
                        type='radio'
                        name='propertyType'
                        value='Commercial'
                      />
                      <RadioCheck
                        selectedValue={formik.values?.propertyType}
                        handleChange={() => {
                          formik.setFieldValue('propertyType', 'Duplex');
                        }}
                        type='radio'
                        name='propertyType'
                        value='Duplex'
                      />
                    </div>
                  </div>
                  <div className='min-h-[73px] gap-[15px] flex flex-col w-full'>
                    <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                      Property condition
                    </h2>
                    <div className='w-full gap-[20px] lg:gap-[20px] flex flex-row flex-wrap'>
                      <RadioCheck
                        selectedValue={formik.values?.propertyCondition}
                        handleChange={() => {
                          formik.setFieldValue(
                            'propertyCondition',
                            'Brand New'
                          );
                        }}
                        type='radio'
                        name='propertyCondition'
                        value='Brand New'
                      />
                      <RadioCheck
                        selectedValue={formik.values?.propertyCondition}
                        handleChange={() => {
                          formik.setFieldValue(
                            'propertyCondition',
                            'Good Condition'
                          );
                        }}
                        type='radio'
                        name='propertyCondition'
                        value='Good Condition'
                      />
                      <RadioCheck
                        selectedValue={formik.values?.propertyCondition}
                        handleChange={() => {
                          formik.setFieldValue(
                            'propertyCondition',
                            'Fairly Used'
                          );
                        }}
                        type='radio'
                        name='propertyCondition'
                        value='Fairly Used'
                      />
                      <RadioCheck
                        selectedValue={formik.values?.propertyCondition}
                        handleChange={() => {
                          formik.setFieldValue(
                            'propertyCondition',
                            'Needs Renovation'
                          );
                        }}
                        type='radio'
                        name='propertyCondition'
                        value='Needs Renovation'
                      />
                    </div>
                  </div>
                  <div className='min-h-[127px] w-full flex flex-col gap-[15px]'>
                    <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                      Location
                    </h2>
                    <div className='min-h-[80px] flex gap-[15px] lg:grid lg:grid-cols-2 flex-col'>
                      <Input
                        label='State'
                        name='selectedState'
                        forState={true}
                        forLGA={false}
                        type='text'
                        placeholder='Select State'
                        formik={formik}
                        selectedState={selectedState}
                        stateOptions={stateOptions}
                        setSelectedState={handleStateChange}
                        isDisabled={areInputsDisabled}
                      />
                      <Input
                        label='Local Government'
                        name='selectedLGA'
                        type='text'
                        formik={formik}
                        forLGA={true}
                        forState={false}
                        selectedLGA={selectedLGA}
                        lgasOptions={lgaOptions}
                        setSelectedLGA={handleLGAChange}
                        isDisabled={areInputsDisabled}
                      />
                      <Input
                        label='Rental Price'
                        name='rentalPrice'
                        type='number'
                        formik={formik}
                        value={formik.values.rentalPrice}
                        onChange={formik.handleChange}
                        isDisabled={areInputsDisabled}
                      />
                      <div className='flex flex-col gap-[10px]'>
                        <label
                          htmlFor='landSize'
                          className='flex flex-col gap-[4px]'>
                          <span className='text-base leading-[25.6px] font-medium text-[#1E1E1E]'>
                            Number of Bedroom
                          </span>{' '}
                          <input
                            id='landSize'
                            placeholder='select land size'
                            onClick={() => {
                              setShowBedroom(!showBedroom);
                            }}
                            className='w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-white disabled:bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px] disabled:cursor-not-allowed cursor-pointer'
                            readOnly
                            value={
                              formik.values.bedroom ? formik.values.bedroom : ''
                            }
                          />
                        </label>
                        {showBedroom && (
                          <MultiSelectionProcess
                            name='bedroom'
                            formik={formik}
                            options={[{ label: 'Bedroom', value: 'Bedroom' }]}
                            closeModalFunction={setShowBedroom}
                            heading='Bedroom'
                            type='Bedroom'
                          />
                        )}
                      </div>

                      {formik.touched.selectedState &&
                        formik.errors.selectedState && (
                          <span className='text-red-600 text-sm'>
                            {formik.errors.selectedState}
                          </span>
                        )}
                      {formik.touched.selectedLGA &&
                        formik.errors.selectedLGA && (
                          <span className='text-red-600 text-sm'>
                            {formik.errors.selectedLGA}
                          </span>
                        )}
                    </div>
                  </div>
                  <div className='flex flex-col gap-[15px]'>
                    <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                      Features
                    </h2>
                    <div className='grid lg:grid-cols-3 grid-cols-2 gap-[15px] w-full'>
                      {featuresData.map((item: string, idx: number) => (
                        <RadioCheck
                          key={idx}
                          type='checkbox'
                          value={item}
                          name='features'
                          handleChange={() => {
                            const features = formik.values.features.includes(
                              item
                            )
                              ? formik.values.features.filter(
                                  (doc) => doc !== item
                                )
                              : [...formik.values.features, item];
                            formik.setFieldValue('features', features);
                          }}
                          isDisabled={areInputsDisabled}
                        />
                      ))}
                    </div>
                  </div>
                  <div className='min-h-[73px] flex flex-col gap-[15px]'>
                    <h2 className='text-[20px] leading-[32px] font-medium text-[#1E1E1E]'>
                      Tenant Criteria
                    </h2>
                    <div className='grid lg:grid-cols-3 grid-cols-2 gap-[15px] w-full'>
                      {tenantCriteriaData.map((item: string, idx: number) => (
                        <RadioCheck
                          key={idx}
                          type='checkbox'
                          value={item}
                          name='tenantCriteria'
                          handleChange={() => {
                            const tenantCriteria =
                              formik.values.tenantCriteria.includes(item)
                                ? formik.values.tenantCriteria.filter(
                                    (doc) => doc !== item
                                  )
                                : [...formik.values.tenantCriteria, item];
                            formik.setFieldValue(
                              'tenantCriteria',
                              tenantCriteria
                            );
                          }}
                          isDisabled={areInputsDisabled}
                        />
                      ))}
                    </div>
                  </div>
                  <div className='min-h-[73px] flex flex-col gap-[15px] mt-2'>
                      <Input
                        label='Addition information'
                        name='addtionalInfo'
                        type='textArea'
                        className='w-full'
                        multiline={true}
                        rows={3}
                        placeholder='Enter any additional information'
                        // value={formik.values?.numberOfFloors}
                        onChange={formik.handleChange}
                        isDisabled={areInputsDisabled} 
                      />
                  </div>
                  {/**Upload Image | Documents */}
                  {/* <AttachFile
                    setFileUrl={setFileUrl}
                    heading='Upload image(optional)'
                    id='image-upload'
                  /> */}
                  {/**Images selected */}
                  {/* {fileUrl.length !== 0 ? (
                    <div className='flex justify-start items-center gap-[15px] overflow-x-scroll hide-scrollbar md:overflow-x-auto whitespace-nowrap'>
                      {typeof fileUrl === 'object' &&
                        fileUrl.map((image) => (
                          <ImageContainer
                            setViewImage={setViewImage}
                            setImageData={setImageData}
                            removeImage={() => {
                              setFileUrl(
                                fileUrl.filter((img) => img.id !== image.id)
                              );
                            }}
                            image={image.image}
                            alt=''
                            heading=''
                            key={image.id}
                            id={image.id}
                          />
                        ))}
                    </div>
                  ) : null} */}
                </div>
              </div>
              )}
            {currentStep === 1 && (
             <div className='min-h-[348px] py-[10px] lg:px-[80px] border-[#8D909680] border-b-[1px] w-full'>
                <div className='w-full min-h-[348px] flex flex-col gap-[20px]'>
                  <div className='w-full flex flex-col gap-[15px] min-h-[270px]'>
                    <div className='flex lg:flex-row flex-col w-full gap-[15px]'>
                      <Input
                        label='Full name'
                        name='ownerFullName'
                        value={formik.values?.ownerFullName}
                        onChange={formik.handleChange}
                        className='lg:w-1/2 w-full'
                        type='text'
                      />
                      <div className='flex flex-col gap-2'>
                        <label
                          className={`block text-sm font-medium ${
                            !isLegalOwner && 'text-[#847F7F]'
                          } text-black`}>
                          Phone Number:
                        </label>
                        <PhoneInput
                          international
                          defaultCountry='NG'
                          value={formik.values?.ownerPhoneNumber}
                          style={{
                            outline: 'none',
                            cursor: isLegalOwner ? 'text' : 'not-allowed',
                          }}
                          onChange={(value) =>
                            formik.setFieldValue('ownerPhoneNumber', value)
                          }
                          placeholder='Enter phone number'
                          className={`w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px] focus:outline-none focus:ring-0 disabled:bg-[#FAFAFA] disabled:cursor-not-allowed ${
                            !isLegalOwner && 'text-[#847F7F]'
                          }`}
                        />
                        {(formik.touched.ownerPhoneNumber ||
                          formik.errors.ownerPhoneNumber) && (
                          <p className='text-red-500 text-sm mt-1'>
                            {formik.errors.ownerPhoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <Input
                      label='Email'
                      name='ownerEmail'
                      className='w-full'
                      value={formik.values?.ownerEmail}
                      onChange={formik.handleChange}
                      type='email'
                    />
                  </div>
                </div>
              </div> 
              )}
              <div className='w-full flex items-center mt-8 justify-between' >
                  <Button
                      value='Cancel'
                      // isDisabled={!isLegalOwner}
                      type='button'
                      onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                      className={`border-[1px] border-black lg:w-[25%] text-black text-base leading-[25.6px] font-bold min-h-[50px] py-[12px] px-[24px] disabled:cursor-not-allowed`}
                    />
                  <Button
                      value='Next'
                      type={currentStep === steps.length - 1 ? 'submit' : 'button'}
                      onClick={() => {
                            if (currentStep < steps.length - 1) {
                              setCurrentStep((prev) => prev + 1);
                            } else if (currentStep === steps.length - 1) {
                              // setShowCommissionModal(true);
                            }
                      }}
                      className={`bg-[#8DDB90] lg:w-[25%] text-white text-base leading-[25.6px] font-bold min-h-[50px] py-[12px] px-[24px] disabled:cursor-not-allowed`}
                    />
              </div>
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const UseIsComingPage = () => {
  return (
    <div className='w-full flex justify-center items-center'>
      <div className='container min-h-[600px] flex flex-col justify-center items-center gap-[20px] px-4 md:px-8'>
        <div className='lg:w-[654px] flex flex-col justify-center items-center gap-[20px] w-full'>
          <div className='w-full flex justify-center'>
            <Image
              src={comingSoon}
              width={400}
              height={50}
              alt='Coming Soon Icon'
              className='w-full max-w-[400px] h-auto'
            />
          </div>
          <div className='flex flex-col justify-center items-center gap-[10px]'>
            <p
              className={`text-4xl md:text-2xl font-bold text-center text-[#5A5D63] leading-[160%] tracking-[5%] ${epilogue.className}`}>
              We are working hard to bring you an amazing experience. Stay tuned
              for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landlord;
