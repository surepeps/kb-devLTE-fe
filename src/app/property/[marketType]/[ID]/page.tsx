/** @format */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import React, { Fragment, MouseEventHandler, useEffect, useState } from 'react';
import arrowRightIcon from '@/svgs/arrowR.svg';
import Image from 'next/image';
import Link from 'next/link';
import { usePageContext } from '@/context/page-context';
import { motion } from 'framer-motion';
import arrow from '@/svgs/arrowRight.svg';
import HouseFrame from '@/components/general-components/house-frame';
import noImage from '@/assets/ChatGPT Image Apr 11, 2025, 12_48_47 PM.png';
import { useLoading } from '@/hooks/useLoading';
import Loading from '@/components/loading-component/loading';
import { epilogue } from '@/styles/font';
import { featuresData } from '@/data/buy_data';
import checkIcon from '@/svgs/checkIcon.svg';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/general-components/button';
import PhoneInput, {
  Country,
  isValidPhoneNumber,
} from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Select, { SingleValue } from 'react-select';
import { useParams, usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { URLS } from '@/utils/URLS';
import customStyles from '@/styles/inputStyle';
import RadioCheck from '@/components/general-components/radioCheck';
import toast from 'react-hot-toast';
import { shuffleArray } from '@/utils/shuffleArray';
import { requestFormReset } from 'react-dom';
import sampleImage from '@/assets/Rectangle.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import copy from '@/utils/copyItem';
import Card from '@/components/general-components/card';
import { IsMobile } from '@/hooks/isMobile';

interface DetailsProps {
  propertyId: string;
  price: number;
  propertyType: string;
  bedRoom: number;
  propertyStatus: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  tenantCriteria: { _id: string; criteria: string }[];
  pictures: string[];
  createdAt: string;
  owner: string;
  updatedAt: string;
  isAvailable: boolean;
}

interface FormProps {
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  message: string;
}

type HouseFrameProps = {
  propertyType: string;
  pictures: string[];
  features: { featureName: string; id: string }[];
  location: {
    state: string;
    area: string;
    localGovernment: string;
  };
  noOfBedrooms: number;
  _id: string;
};

const ProductDetailsPage = () => {
  const [point, setPoint] = useState<string>('Details');
  const { isContactUsClicked, isModalOpened, setImageData, setViewImage } =
    usePageContext();
  const [scrollPosition, setScrollPosition] = useState(0);
  const isLoading = useLoading();
  const [details, setDetails] = useState<DetailsProps>({
    price: 0,
    propertyType: '',
    bedRoom: 0,
    propertyStatus: '',
    location: {
      state: '',
      localGovernment: '',
      area: '',
    },
    tenantCriteria: [],
    pictures: [],
    propertyId: '',
    createdAt: '',
    owner: '',
    updatedAt: '',
    isAvailable: false,
  });
  const [featureData, setFeatureData] = useState<
    { _id: string; featureName: string }[]
  >([]);
  const path = usePathname();
  const { ID: id, marketType } = useParams();
  const router = useRouter();
  const [isDataLoading, setDataLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [agreedToTermsOfUse, setAgreedToTermsUse] = useState<boolean>(false);
  const is_mobile = IsMobile();

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
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email()
      .required()
      .matches(/^[^\s@]+@[^\s@]+\.com$/, 'Invalid email address'),
    phoneNumber: Yup.string()
      .required()
      .required('Contact number is required')
      .test('isValidPhoneNumber', 'Invalid phone number', (value) =>
        isValidPhoneNumber(value || '')
      ),
    gender: Yup.string().required('Gender is required'),
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
    onSubmit: async (values: FormProps, { resetForm }) => {
      const payload = {
        propertyId: details.propertyId,
        requestFrom: {
          email: values.email,
          phoneNumber: values.phoneNumber,
          fullName: values.name,
        },
        propertyType: 'PropertyRent',
      };
      if (agreedToTermsOfUse) {
        try {
          const response = await toast.promise(
            () =>
              axios.post(URLS.BASE + '/property/request-inspection', payload),
            {
              loading: 'Submitting request...',
              success: 'Successfully submitted for inspection',
              // error: 'Failed to submit request',
            }
          );

          // Display the API response message in a toast
          if (response?.data?.message) {
            toast.success(response.data.message);
          }
        } catch (error: any) {
          // Handle error and display the error message from the API
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            console.error(error);
          }

          formik.setValues({
            name: '',
            email: '',
            phoneNumber: '',
            gender: '',
            message: '',
          });
        }
        return;
      }
      toast.error('You need to agree to the terms of use.');
      return;
    },
  });

  useEffect(() => {
    console.log(id);
    const getProductDetails = async () => {
      try {
        const res = await axios.get(URLS.BASE + `/properties/rents/rent/${id}`);
        console.log(res);
        if (res.status === 200) {
          if (typeof res.data === 'object') {
            setDetails({
              price: res.data.rentalPrice,
              propertyType: res.data.propertyType,
              bedRoom: res.data.noOfBedrooms,
              propertyStatus: res.data.propertyCondition,
              location: res.data.location,
              tenantCriteria: res.data.tenantCriteria,
              pictures: res.data.pictures,
              propertyId: res.data._id,
              createdAt: res.data.createdAt,
              owner: res.data.owner,
              updatedAt: res.data.updatedAt,
              isAvailable: res.data.isAvailable,
            });
            setFeatureData(res.data.features);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProductDetails();
  }, [id]);

  useEffect(() => {
    const getAllRentProperties = async () => {
      setDataLoading(true);
      try {
        const resposne = await axios.get(URLS.BASE + '/properties/rents/all');
        // console.log(resposne);
        if (resposne.status === 200) {
          const shuffledData = shuffleArray(resposne.data.data);
          //  console.log(shuffledData);
          setData(shuffledData.slice(0, 3));
          setDataLoading(false);
        }
      } catch (error) {
        console.log(error);
        setDataLoading(false);
      } finally {
        setDataLoading(false);
      }
    };

    getAllRentProperties();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <Fragment>
      {path.match(/[0-9]/) ? (
        <section
          className={`flex justify-center w-full bg-[#EEF1F1] pb-[50px] ${
            (isContactUsClicked || isModalOpened) &&
            'filter brightness-[30%] transition-all duration-500 overflow-hidden'
          }`}>
          <div className='flex flex-col items-center gap-[20px] w-full'>
            <div className='min-h-[90px] container w-full flex flex-col items-start lg:px-[40px]'>
              <div className='flex gap-1 items-center px-[10px] lg:px-[0px]'>
                <Image
                  alt=''
                  src={arrowRightIcon}
                  width={24}
                  height={24}
                  className='w-[24px] h-[24px]'
                  onClick={() => {
                    router.back();
                  }}
                />
                <div className='flex gap-2 items-center justify-center align-middle'>
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
              <h2
                className={`${epilogue.className} text-2xl font-semibold mt-6 text-black`}>
                Newly Built 5 bedroom Duplex with BQ in a highly secured area in
                the heart of GRA
              </h2>
            </div>

            <div className='w-full flex justify-center items-center'>
              <div className='flex justify-between items-start container px-[20px]'>
                <div className='w-[70%] flex flex-col'>
                  <div className='lg:w-[837px] flex flex-col gap-[20px]'>
                    <ImageSwiper
                      images={
                        details.pictures['length'] !== 0
                          ? details.pictures
                          : [sampleImage.src]
                      }
                    />
                    {details.pictures['length'] !== 0 ? (
                      <div className='flex gap-[20px]'>
                        {details.pictures.map((src: string, idx: number) => (
                          <img
                            src={src}
                            key={idx}
                            width={200}
                            height={200}
                            className='w-[120px] h-[92px] object-cover bg-gray-200'
                            alt={'image'}
                          />
                        ))}
                      </div>
                    ) : null}
                    <div className='md:w-[70%] w-full h-full flex flex-col gap-[20px]'>
                      {/**Details */}
                      <div className='min-h-[152px] w-full py-[40px] border-b-[1px] border-[#C7CAD0]'>
                        {/* <h2
                          className={`md:text-[24px] md:leading-[38.4px] text-[20px] leading-[32px] font-semibold font-epilogue`}>
                          Details
                        </h2> */}

                        <div className='w-full min-h-[152px] grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-4'>
                          {/**Price */}
                          {/* <div className='min-w-[122px] min-h-[68px] gap-[10px]'>
                            <h4 className='text-[18px] text-[#7C8493] leading-[28.8px] font-normal'>
                              Price
                            </h4>
                            <h3 className='text-[18px] leading-[28.8px] font-bold text-[#25324B] font-epilogue'>
                              {Number(details.price).toLocaleString()}
                            </h3>
                          </div> */}
                          <BoxContainer
                            heading='Price'
                            subHeading={Number(details.price).toLocaleString()}
                          />

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

                      {/**Property Features */}
                      {featureData['length'] !== 0 ? (
                        <SimilarComponent
                          heading='Property Features'
                          data={featureData.map((item) => item?.featureName)}
                        />
                      ) : null}

                      {details.tenantCriteria['length'] !== 0 ? (
                        <SimilarComponent
                          heading='Tenant Criteria'
                          data={details.tenantCriteria.map(
                            (item) => item?.criteria
                          )}
                        />
                      ) : null}

                      {/**Contact Information */}
                      <div className='min-h-[152px] w-full py-[40px]'>
                        <h2
                          className={`text-[24px] leading-[38.4px] font-semibold font-epilogue`}>
                          Contact Information
                        </h2>

                        <form
                          onSubmit={formik.handleSubmit}
                          method='post'
                          className='w-full min-h-[270px] mt-[10px] flex flex-col gap-[15px]'>
                          <section className='md:grid md:grid-cols-2 gap-[15px] flex flex-col'>
                            <Input
                              label='name'
                              name='
                  Name'
                              placeholder='This is a placeholder'
                              type='text'
                              formik={formik}
                            />
                            <Input
                              label='phoneNumber'
                              name='
                  Phone Number'
                              placeholder='This is a placeholder'
                              type='number'
                              formik={formik}
                            />
                            <Input
                              label='email'
                              name='
                  Email'
                              placeholder='This is a placeholder'
                              type='email'
                              formik={formik}
                            />
                            <label
                              className=' w-full min-h-[80px] gap-[4px] flex flex-col'
                              htmlFor={'gender'}>
                              <h2 className='text-base leading-[25.6px] text-[#1E1E1E] font-medium'>
                                I am
                              </h2>
                              <Select
                                name='gender'
                                styles={customStyles}
                                options={[
                                  { value: 'Male', label: 'Male' },
                                  { value: 'Female', label: 'Female' },
                                  {
                                    value: 'Prefer not to say',
                                    label: 'Prefer not to say',
                                  },
                                ]}
                                value={
                                  formik.values.gender
                                    ? {
                                        value: formik.values.gender,
                                        label: formik.values.gender,
                                      }
                                    : null
                                }
                                onChange={(
                                  option: SingleValue<{
                                    value: string;
                                    label: string;
                                  }>
                                ) => {
                                  formik.setFieldValue(
                                    'gender',
                                    option?.value || ''
                                  );
                                }}
                                onBlur={() =>
                                  formik.setFieldTouched('gender', true)
                                }
                                className='bg-white'
                                isClearable
                              />
                              {formik.errors.gender &&
                                formik.touched.gender && (
                                  <span className='text-sm text-red-500'>
                                    {formik.errors.gender}
                                  </span>
                                )}
                            </label>
                          </section>

                          <label
                            className='w-full min-h-[80px] gap-[4px] flex flex-col'
                            htmlFor={'message'}>
                            <h2 className='text-base leading-[25.6px] text-[#1E1E1E] font-medium'>
                              Message
                            </h2>
                            <textarea
                              value={formik.values.message}
                              onBlur={formik.handleBlur}
                              id='message'
                              onChange={formik.handleChange}
                              placeholder={'Enter your message here'}
                              className='min-h-[93px] w-full border-[1px] bg-[#FAFAFA] border-[#D6DDEB] resize-none py-[12px] px-[16px] text-base leading-[25.6px] text-[#1E1E1E] outline-none font-normal placeholder:text-[#A8ADB7] disabled:cursor-not-allowed focus:outline-[1.5px] focus:outline-[#14b8a6] focus:outline-offset-0 rounded-[5px]'></textarea>
                          </label>
                          {formik.errors.message && formik.touched.message && (
                            <span className='text-sm text-red-500'>
                              {formik.errors.message}
                            </span>
                          )}

                          {/** */}
                          <div className='flex items-center gap-[10px] mt-[10px]'>
                            <input
                              title='checkbox'
                              style={{
                                accentColor: '#8DDB90',
                                backgroundColor: 'transparent',
                                width: '24px',
                                height: '24px',
                              }}
                              type='checkbox'
                              onChange={() => {
                                setAgreedToTermsUse(!agreedToTermsOfUse);
                              }}
                            />
                            <p className='text-base leading-[25.6px] text-[#0B423D] font-semibold'>
                              By submitting this form I agree to Terms of Use
                            </p>
                          </div>

                          <div className='flex md:justify-start md:items-start items-center justify-center'>
                            <Button
                              green={true}
                              type='submit'
                              onSubmit={formik.handleSubmit}
                              value='Submit for inspection'
                              className='text-base cursor-pointer leading-[25.6px] text-[#FFFFFF] font-bold w-[244px] min-h-[50px] py-[12px] px-[24px] mt-[10px]'
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='w-[30%] flex flex-col items-end'>
                  <div className='w-full lg:w-[282px] flex justify-center items-center'>
                    <div className='flex justify-between items-start container'>
                      <div className='w-full flex flex-col gap-[26px] h-[inherit]'>
                        <div className='flex flex-col flex-wrap bg-white gap-[10px] border-[1px] border-[#D6DDEB] w-full py-[15px] px-[10px] overflow-x-auto hide-scrollbar'>
                          <div className='flex gap-[10px] w-full'>
                            <span className='text-base text-[#7C8493]'>
                              Reference ID:
                            </span>{' '}
                            <span
                              //onClick={() => copy(details.owner)}
                              className={`${epilogue.className} text-lg text-clip text-[#25324B]`}>
                              {details.owner}
                            </span>
                          </div>
                          {/**Date Added */}
                          <div className='flex gap-[10px] w-full'>
                            <span className='text-base text-[#7C8493]'>
                              Date added:
                            </span>{' '}
                            <span
                              className={`${epilogue.className} text-lg text-[#25324B]`}>
                              {details.createdAt.split('T')[0]}
                            </span>
                          </div>
                          {/**Last Update */}
                          <div className='flex gap-[10px] w-full'>
                            <span className='text-base text-[#7C8493]'>
                              Last Update:
                            </span>{' '}
                            <span
                              className={`${epilogue.className} text-lg text-[#25324B]`}>
                              {details.updatedAt.split('T')[0]}
                            </span>
                          </div>
                          {/**Market Status */}
                          <div className='flex gap-[10px] w-full'>
                            <span className='text-base text-[#7C8493]'>
                              Market Status
                            </span>{' '}
                            <span
                              className={`${epilogue.className} text-lg text-[#25324B]`}>
                              {details.isAvailable
                                ? 'Available'
                                : 'Not Available'}
                            </span>
                          </div>
                        </div>

                        <div className='w-full lg:w-[282px] flex flex-col gap-[15px]'>
                          <h2 className='text-base text-black'>
                            Click here to view the selected brief for inspection
                          </h2>
                          <button
                            type='button'
                            className='w-full h-[60px] border-[1px] border-[#FF3D00] text-[#FF3D00] font-medium text-lg'>
                            2 selected brief
                          </button>
                        </div>
                        <div className='w-full items-end hidden h-full md:flex md:flex-col gap-[10px]'>
                          {data.map((property, idx: number) => {
                            return (
                              <Card
                                style={
                                  is_mobile
                                    ? { width: '100%' }
                                    : { width: '281px' }
                                }
                                images={property?.pictures}
                                onCardPageClick={() => {
                                  router.push(`/property/Rent/${property._id}`);
                                }}
                                // onClick={() =>
                                //   handlePropertiesSelection(idx.toLocaleString())
                                // }
                                cardData={[
                                  {
                                    header: 'Property Type',
                                    value: property.propertyType,
                                  },
                                  {
                                    header: 'Price',
                                    value: `₦${Number(
                                      property.rentalPrice
                                    ).toLocaleString()}`,
                                  },
                                  {
                                    header: 'Bedrooms',
                                    value: property.noOfBedrooms || 'N/A',
                                  },
                                  {
                                    header: 'Location',
                                    value: `${property.location.state}, ${property.location.localGovernment}`,
                                  },
                                  {
                                    header: 'Documents',
                                    value: `<ol class='' style='list-style: 'dics';'>${property?.docOnProperty?.map(
                                      (item: {
                                        _id: string;
                                        docName: string;
                                      }) =>
                                        `<li key={${item._id}>${item.docName}</li>`
                                    )}<ol>`,
                                  },
                                ]}
                                key={idx}
                                // isDisabled={uniqueProperties.has(idx.toLocaleString())}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}
    </Fragment>
  );
};

const Input = ({
  name,
  placeholder,
  type,
  formik,
  onChange,
  label,
}: {
  name: string;
  placeholder: string;
  type: string;
  formik: any;
  onChange?: (name: string, value: string) => void;
  label: string;
}) => {
  return (
    <label
      className='md:1/2 w-full min-h-[80px] gap-[4px] flex flex-col'
      htmlFor={name}>
      <h2 className='text-base leading-[25.6px] text-[#1E1E1E] font-medium'>
        {name}
      </h2>
      {type === 'number' ? (
        <PhoneInputField
          id='phoneNumber'
          name='phoneNumber'
          value={formik.values[name]}
          onChange={formik.setFieldValue}
          onBlur={formik.handleBlur}
          error={formik.errors[name]}
          touched={formik.touched[name]}
          // className='min-h-[50px] w-full border-[1px] bg-[#FAFAFA] border-[#D6DDEB] py-[12px] px-[16px] text-base leading-[25.6px] text-[#1E1E1E] outline-none font-normal placeholder:text-[#A8ADB7]'
          placeholder='Enter Your phone number'
        />
      ) : (
        <input
          type={type}
          id={label}
          value={formik.values[label]}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          name={label}
          placeholder={placeholder}
          className='min-h-[50px] w-full border-[1px] bg-[#FAFAFA] border-[#D6DDEB] py-[12px] px-[16px] text-base leading-[25.6px] text-[#1E1E1E] outline-none font-normal placeholder:text-[#A8ADB7]  disabled:cursor-not-allowed focus:outline-[1.5px] focus:outline-[#14b8a6] focus:outline-offset-0 rounded-[5px]'
        />
      )}

      {(formik.touched[label] || formik.errors[label]) && (
        <span className='text-sm text-red-500'>{formik.errors[label]}</span>
      )}
    </label>
  );
};

// components/PhoneInputField.tsx

interface PhoneInputFieldProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  defaultCountry?: Country | undefined;
  id: string;
  className?: string;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = 'Enter phone number',
  defaultCountry = 'NG', // Default country set to Nigeria
  className,
}) => {
  return (
    <div className='w-full'>
      <PhoneInput
        international
        defaultCountry={defaultCountry}
        placeholder={placeholder}
        value={value}
        onChange={(value) => onChange(name, value || '')}
        onBlur={onBlur}
        id={name}
        name={name}
        className='min-h-[50px] w-full border-[1px] bg-[#FAFAFA] border-[#D6DDEB] py-[12px] px-[16px] text-base leading-[25.6px] text-[#1E1E1E] outline-none font-normal placeholder:text-[#A8ADB7]'
      />
      {touched && error && (
        <span className='text-sm text-red-500'>{error}</span>
      )}
    </div>
  );
};

const ImageSwiper = ({ images }: { images: string[] }) => {
  //const images = [sampleImage.src, sampleImage.src];
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      loop={true}
      className='w-full lg:w-[837px]'>
      {images.map((src, i) => (
        <SwiperSlide key={i}>
          <img
            src={src}
            alt={`Slide ${i + 1}`}
            className='w-full object-cover lg:w-[837px] h-[422px]'
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const SimilarComponent = ({
  data,
  heading,
}: {
  data: string[];
  heading: string;
}) => {
  return (
    <div className='min-h-fit bg-[#F7F7F8] p-[15px] w-full flex flex-col gap-[24px]'>
      <h2
        className={`md:text-[24px] md:leading-[38.4px] text-[20px] leading-[32px] font-semibold font-epilogue`}>
        {heading}
      </h2>

      <div className='w-full grid grid-cols-subgrid gap-[8px]'>
        {data.map((item: string, idx: number) => {
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
  );
};

const BoxContainer = ({
  heading,
  subHeading,
}: {
  heading: string;
  subHeading: string;
}) => {
  return (
    <div className='w-[240px] bg-[#F7F7F8] h-[83px] py-[15px] px-[10px] flex justify-center flex-col border-[1px] border-[#D6DDEB]'>
      <h4 className='text-lg text-[#7C8493]'>{heading}</h4>
      <h3
        className={`text-lg font-medium text-[#25324B] ${epilogue.className}`}>
        {subHeading}
      </h3>
    </div>
  );
};

export default ProductDetailsPage;
