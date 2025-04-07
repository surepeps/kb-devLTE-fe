/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use clients';
import React, { Fragment, MouseEvent, useEffect, useState } from 'react';
import Button from './button';
import ReactSelect, { components } from 'react-select';
import { useFormik } from 'formik';
//import * as Yup from 'yup';
//import { cardDataArray } from '@/data';
// import { POST_REQUEST } from '@/utils/requests';
import Input from '@/components/Input';
import toast from 'react-hot-toast';
import { usePageContext } from '@/context/page-context';
import { URLS } from '@/utils/URLS';
import axios from 'axios';
import naijaStates from 'naija-state-local-government';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import MultiSelectionProcess from './multiSelectionProcess';

interface valuesProps {
  propertyType: string;
  usageOption: any[];
  budgetRange: string;
  state: string;
  selectedLGA: string;
  landSize: number;
  landType: string;
  docOnProperty: [];
  desireFeatures: [];
  bedroom: number;
  typeOfMeasurement: '';
}

interface PropertyReferenceDataProps {
  propertyReferenceData: { heading: string; options: string[] }[];
  setFound: ({ isFound, count }: { isFound: boolean; count: number }) => void;
  found: { isFound: boolean; count: number };
  setAllCards: ([]: { header: string; value: string }[][]) => void;
  usageOption?: string;
}

const PropertyReference = ({
  propertyReferenceData,
  found,
  setFound,
  setAllCards,
  usageOption,
}: PropertyReferenceDataProps) => {
  const { setPropertyReference, setRentPage } = usePageContext();
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      propertyType: '',
      usageOption: usageOption ? [usageOption] : [],
      budgetRange: '',
      state: '',
      selectedLGA: '',
      landSize: 0,
      landType: '',
      docOnProperty: [],
      desireFeatures: [],
      bedroom: 0,
      typeOfMeasurement: '',
    },
    // validationSchema,
    onSubmit: async (values: valuesProps) => {
      // console.log(values);
      const payload = {
        propertyType: values.propertyType,
        state: formik.values.selectedLGA.split(',')[0].trimStart(),
        localGovernment: values.selectedLGA, //assumption, no local govt input on the design
        area: 'N/A', //assumption, same,
        minPrice: 0,
        maxPrice: 1000000000,
        usageOptions: formik.values.usageOption,
        additionalFeatures: formik.values.desireFeatures,
        minBedrooms: 1,
        maxBedrooms: formik.values.bedroom,
        // typeOfMeasurement: formik.values.typeOfMeasurement
      };
      //check if it has vvalues otherwise don't run
      // if (
      //   !values.bedroom ||
      //   !values.propertyType ||
      //   !values.state ||
      //   !values.usageOption ||
      //   !values.budgetRange ||
      //   !values.desireFeatures ||
      //   !values.docOnProperty ||
      //   !values.landSize
      // ) {
      //   toast.error('Please fill all fields');
      //   return;
      // } //now updated - All fields must be optional
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          URLS.BASE + URLS.buyersSearchBrief,
          payload
        );
        if (response.status === 200) {
          setFound({ isFound: true, count: response.data.length });
          setAllCards(response.data);
          setIsSubmitting(false);
          toast.success('' + response.data.length + ' properties found');
        } else {
          setFound({ isFound: false, count: 0 });
          setIsSubmitting(false);
        }
        console.log(response);
      } catch (error) {
        console.log(error);
        setIsSubmitting(false);
        toast.error('An error occured');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const submitReference = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    //reducing through the property documents to get the required object format
    const propertyDoc = formik.values.docOnProperty.reduce(
      (acc: { docName: string; isProvided: boolean }[], item: string) => {
        acc.push({ docName: item, isProvided: true });
        return acc;
      },
      []
    );

    const payload = {
      propertyType: formik.values.propertyType,
      areYouTheOwner: true, //assumption
      usageOptions: formik.values.usageOption,
      pictures: [], //no pictures required in the design,
      budgetRange: formik.values.budgetRange,
      location: {
        state: formik.values.selectedLGA.split(',')[0].trimStart(),
        localGovernment: formik.values.selectedLGA, //assumption, no local govt input on the design
        area: 'N/A', //assumption, same,
      },
      price: 2048344930, //assumption, supposing we are using the budget range instead
      docOnProperty: propertyDoc,
      propertyFeatures: {
        additionalFeatures: formik.values.desireFeatures,
        noOfBedrooms: formik.values.bedroom,
      },
      // typeOfMeasurment: formik.values.typeOfMeasurement
    };

    console.log(payload);
    setPropertyReference(payload);
    setRentPage({
      submitPreference: true,
      isSubmitForInspectionClicked: false,
    });
  };

  interface Option {
    value: string;
    label: string;
  }

  const [stateOptions, setStateOptions] = useState<Option[]>([]);

  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showLandSize, setShowLandSize] = useState<boolean>(false);

  useEffect(() => {
    // Load Nigerian states correctly
    setStateOptions(
      naijaStates.states().map((state: string) => ({
        value: state,
        label: state,
      }))
    );
  }, []);

  React.useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);

  return (
    <Fragment>
      <div className='min-h-[250px] lg:min-h-[250px] py-[24px] px-[20px] lg:py-[30px] w-full lg:w-[1153px] lg:px-[45px] bg-[#FFFFFF]'>
        <form
          onSubmit={formik.handleSubmit}
          className='w-full flex flex-col gap-[37px]'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] lg:gap-[37px] items-end'>
            {/**Type of Property */}
            <Select
              allowMultiple={false}
              heading={'propertyType'}
              formik={formik}
              name={propertyReferenceData[0].heading}
              options={propertyReferenceData[0].options}
              placeholder='Select'
            />
            {/**usage Option */}
            <Select
              allowMultiple={!usageOption}
              heading={'usageOption'}
              formik={formik}
              name={propertyReferenceData[1].heading}
              options={propertyReferenceData[1].options}
              placeholder='Select'
            />
            {/**Budget Range */}
            <Select
              allowMultiple={false}
              heading={'budgetRange'}
              formik={formik}
              name={propertyReferenceData[2].heading}
              options={propertyReferenceData[2].options}
              placeholder='Select'
            />

            {/**Preferred Location */}
            <div className='flex flex-col gap-[10px]'>
              <label htmlFor='selectedLGA' className='flex flex-col gap-[4px]'>
                <span className='text-base leading-[25.6px] font-medium text-[#1E1E1E]'>
                  Preferred Location
                </span>{' '}
                <input
                  id='selectedLGA'
                  placeholder='select location'
                  onClick={() => {
                    setShowLocationModal(!showLocationModal);
                  }}
                  className='w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-white disabled:bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px] disabled:cursor-not-allowed cursor-pointer'
                  readOnly
                  value={
                    formik.values.selectedLGA ? formik.values.selectedLGA : ''
                  }
                />
              </label>
              {showLocationModal && (
                <MultiSelectionProcess
                  name='selectedState'
                  formik={formik}
                  options={stateOptions}
                  closeModalFunction={setShowLocationModal}
                  heading='location'
                  type='Preferred Location'
                />
              )}
            </div>

            {/**Measurment */}
            {/* <Select
              allowMultiple={false}
              heading={'typeOfMeasurement'}
              formik={formik}
              name={propertyReferenceData[8].heading}
              options={propertyReferenceData[8].options}
              placeholder='Select'
            /> */}
            {/**Land Size */}
            {/* <Input
              value={formik.values.landSize}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder=''
              name='landSize'
              type='number'
              id='landSize'
              isDisabled={formik.values.typeOfMeasurement === ''}
              label={propertyReferenceData[4].heading}
            /> */}

            <div className='flex flex-col gap-[10px]'>
              <label htmlFor='landSize' className='flex flex-col gap-[4px]'>
                <span className='text-base leading-[25.6px] font-medium text-[#1E1E1E]'>
                  Land Size
                </span>{' '}
                <input
                  id='landSize'
                  placeholder='select land size'
                  onClick={() => {
                    setShowLandSize(!showLandSize);
                  }}
                  className='w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-white disabled:bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px] disabled:cursor-not-allowed cursor-pointer'
                  readOnly
                  value={formik.values.landSize ? formik.values.landSize : ''}
                />
              </label>
              {showLandSize && (
                <MultiSelectionProcess
                  name='landSize'
                  formik={formik}
                  options={propertyReferenceData[8].options.map(
                    (item: string) => ({ label: item, value: item })
                  )}
                  closeModalFunction={setShowLandSize}
                  heading='Land size'
                  type='Land Size'
                />
              )}
            </div>

            {/**Document Type */}
            <Select
              allowMultiple={true}
              heading={'docOnProperty'}
              formik={formik}
              name={propertyReferenceData[5].heading}
              options={propertyReferenceData[5].options}
              placeholder='Select'
            />
            {/**Desires Features */}
            <Select
              allowMultiple={true}
              heading={'desireFeatures'}
              formik={formik}
              name={propertyReferenceData[6].heading}
              options={propertyReferenceData[6].options}
              placeholder='Select'
            />
            {/**Bedroom */}

            <Input
              label='Bedroom'
              name='bedroom'
              type='number'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder='Input number of bedrooms'
              value={formik.values.bedroom}
            />

            <Button
              value={isSubmitting ? 'Searching...' : 'Search'}
              green={true}
              isDisabled={isSubmitting}
              type='submit'
              className='bg-[#8DDB90] text-[#FFFFFF] text-base leading-[25.6px] font-bold h-[50px] py-[12px] px-[24px] lg:w-[243.25px] w-full'
            />
          </div>
          {/* <div className='w-full justify-end items-end flex'></div> */}
        </form>
      </div>
      {found.isFound && (
        <div className='min-h-[106px] w-full lg:w-[1153px] py-[23px] px-[20px] md:px-[40px] gap-[10px] bg-white'>
          <div className='w-full min-h-[60px] flex md:flex-row flex-col gap-[20px] justify-between md:gap-0'>
            <div className='flex flex-col'>
              <h2 className='text-[18px] text-[#09391C] leading-[28.8px] font-medium'>
                Can&apos;t find the brief you&apos;re looking for? Don&apos;t
                worry! We&apos;ll provide a reference brief for you
              </h2>
              <div className='flex gap-[5px] flex-wrap'>
                {Object.entries(formik.values).map(([, items], idx: number) => {
                  if (typeof items === 'object') {
                    return (
                      <Crumb
                        key={idx}
                        text={Object.values(items)
                          .map((item) => item)
                          .join(', ')}
                      />
                    );
                  }
                  return <Crumb key={idx} text={items} />;
                })}
              </div>
            </div>
            <button
              type='button'
              onClick={submitReference}
              className='text-base leading-[25.6px] font-bold text-[#09391C] lg:min-w-[245px] h-[58px] border-[1px] py-[12px] px-[24px] border-[#09391C]'>
              Submit your preferences
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default PropertyReference;

interface SelectProps {
  heading: string;
  placeholder?: string;
  options: any[];
  formik: any;
  allowMultiple: boolean;
  name: string;
}

const Select: React.FC<SelectProps> = ({
  heading,
  options,
  formik,
  allowMultiple,
  name,
}) => {
  // const [valueSelected, setValueSelected] =
  //   useState<SingleValue<OptionType>>(null);

  const opts = options.map((item) => ({
    value: typeof item === 'string' ? item.toLowerCase() : `${item} Bedroom`,
    label: typeof item === 'number' ? Number(item) : item,
  }));
  return (
    <label
      htmlFor='select'
      className='min-h-[80px] lg:w-[243.25px] w-full flex flex-col gap-[4px]'>
      <h2 className='text-base font-medium leading-[25.6px] text-[#1E1E1E]'>
        {name}
      </h2>
      <ReactSelect
        isMulti={allowMultiple}
        name={name}
        components={{ MenuList: ComponentMenuList(`Filter by ${name}`) }}
        onChange={(selectedOption) =>
          allowMultiple
            ? formik.setFieldValue(
                heading,
                [
                  ...(Array.isArray(selectedOption)
                    ? selectedOption.map((opt: any) => opt.label)
                    : []),
                ].filter(Boolean) // Removes undefined values
              )
            : formik.setFieldValue(heading, selectedOption?.label ?? '')
        }
        /** const selectedLabels = selectedOption ? selectedOption.map(opt => opt.label) : [];
    formik.setFieldValue(heading, selectedLabels); */
        onBlur={formik.handleBlur}
        value={formik.values[heading]?.label}
        options={opts}
        className={`w-full`}
        styles={{
          control: (base) => ({
            ...base,
            height: '50px',
            background: '#FFFFFF00',
            overflow: 'hidden',
            display: 'flex',
            width: '100%',
          }),
        }}
        placeholder='Select'
      />
      {/* <select
        onChange={(e) => {
          setValueSelected(e.target.value);
        }}
        value={valueSelected}
        className='min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FFFFFF00] border-[#D6DDEB]'
        name='select'
        id='select'>
        {options.map((option: string, idx: number) => (
          <option value={option} key={idx}>
            {option}
          </option>
        ))}
      </select> */}
    </label>
  );
};

const Crumb = ({ text }: { text: any }) => {
  return (
    <Fragment>
      {text ? (
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          className='bg-[#F7F7F8] min-h-[28px] min-w-fit py-[3px] px-[6px] text-[14px] text-[#0B0D0C] leading-[22.4px] font-normal tracking-[0.1px] cursor-not-allowed font-ubuntu rounded-[5px] hover:bg-[#e1e1e1] transition-all duration-300'
        />
      ) : null}
    </Fragment>
  );
};

/**
 * Component Menu List
 */

const ComponentMenuList = (heading: string) => {
  const WrappedMenuList = (props: any) => (
    <components.MenuList {...props}>
      {heading && (
        <div
          className='flex gap-[10px] justify-start items-center border-[#8D9096] border-b-[1px] w-[95%] mx-auto'
          style={{ padding: '8px 12px', fontWeight: 'bold', color: '#555' }}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size='sm'
            color='black'
            className='cursor-pointer'
          />
          <span className='text-[#000000] text-sm font-medium'>{heading}</span>
        </div>
      )}
      {props.children}
    </components.MenuList>
  );

  WrappedMenuList.displayName = 'ComponentMenuList';

  return WrappedMenuList;
};
