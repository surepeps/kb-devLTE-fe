/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use clients';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import Button from './button';
import { useFormik } from 'formik';
import ReactSelect, { components } from 'react-select';
import Input from './Input';
import naijaStates from 'naija-state-local-government';
import axios from 'axios';
import { URLS } from '@/utils/URLS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowDownUpLock,
  faArrowLeft,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import MultiSelectionProcess from './multiSelectionProcess';
import customStyles from '@/styles/inputStyle';
import { useUserContext } from '@/context/user-context';

interface RentalReferenceDataProps {
  rentalReferenceData: { heading: string; options: string[] }[];
  isDisabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  // setFound: ({ isFound, count }: { isFound: boolean; count: number }) => void;
  // found: { isFound: boolean; count: number };
}

interface valuesProps {
  propertyType: string;
  budgetRange: string;
  state: string;
  landSize: string;
  docOnProperty: [];
  desireFeatures: [];
  selectedLGA: string | null;
  selectedState: '';
  bedroom: number | undefined | string;
}

interface Option {
  value: string;
  label: string;
}

const RentalReference = ({
  rentalReferenceData,
  isDisabled,
  onClick,
}: RentalReferenceDataProps) => {
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [formStatus, setFormStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const { user } = useUserContext();

  const formik = useFormik({
    initialValues: {
      propertyType: '',
      budgetRange: '',
      state: '',
      landSize: '',
      docOnProperty: [],
      desireFeatures: [],
      selectedState: '',
      selectedLGA: '',
      bedroom: '',
    },
    onSubmit: async (values: valuesProps) => {
      const payload = {
        location: {
          state: values.selectedState,
          localGovernment: values.selectedLGA
            ? values.selectedLGA.split(',')[1]?.trimStart() ?? ''
            : '',
          area: 'N/A',
        },
        propertyCondition: 'New Building',
        propertyType: 'Residential', // values.propertyType
        budgetRange: values.budgetRange.trimStart() || '',
        // docOnProperty: values.docOnProperty,
        // desireFeatures: values.desireFeatures,
        rentalPrice: 4000000,
        noOfBedrooms: Number(values.bedroom),
        areYouTheOwner: true,
        owner: {
          fullName: user?.firstName + ' ' + user?.lastName,
          phoneNumber: user?.phoneNumber,
          email: user?.email,
        },
      };
      console.log(payload);
      setFormStatus('pending');
      try {
        const response = await axios.post(
          URLS.BASE + '/properties/rents/rent/new',
          payload
        );
        console.log(response);
        setFormStatus('success');
      } catch (error) {
        console.log(error);
        setFormStatus('error');
      }
      console.log(values);
    },
  });

  // const handleStateChange = (selected: Option | null) => {
  //   //console.log('Selected State:', selected);
  //   formik.setFieldValue('state', selected?.value);
  //   setSelectedState?.(selected);
  // };

  // useEffect(() => {
  //   console.log(formik.values);
  // }, [formik.values]);

  useEffect(() => {
    // Load Nigerian states correctly
    setStateOptions(
      naijaStates.states().map((state: string) => ({
        value: state,
        label: state,
      }))
    );
  }, []);
  return (
    <form
      onSubmit={formik.handleSubmit}
      className='min-h-[398px] lg:min-h-[257px] py-[24px] px-[20px] lg:py-[30px] w-full lg:w-[1153px] lg:px-[45px] bg-[#FFFFFF]'>
      <div className='w-full flex flex-col gap-[37px]'>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-[30px] lg:gap-[37px] items-end'>
          {/**Type of Property */}
          <Select
            allowMultiple={false}
            heading={'propertyType'}
            formik={formik}
            name={'Type of Home'}
            options={[
              'Residential',
              'Duplex',
              'Commercial Spaces (Office, Shop)',
            ]}
            placeholder='Select'
            isDisabled={formStatus === 'pending'}
          />

          {/**Home Condition */}
          <Select
            allowMultiple={false}
            heading={'homeCondition'}
            formik={formik}
            name='Home Condition'
            options={[
              'Brand New',
              'Good Condition',
              'Fairly Used',
              'Needs Renovation',
            ]}
            placeholder='Select'
            isDisabled={formStatus === 'pending'}

            // selectedState={selectedState}
            // stateOptions={stateOptions}
            // setSelectedState={handleStateChange}
          />

          {/**Budget Range */}
          <Select
            allowMultiple={false}
            heading={'budgetRange'}
            formik={formik}
            name={rentalReferenceData[1].heading}
            options={[
              `₦2.5 Million - ₦5 Million/year`,
              `₦5 Million - ₦10 Million/year`,
              `Above ₦10 Million/year`,
            ]}
            placeholder='Select'
            isDisabled={formStatus === 'pending'}
          />

          {/**Preferred Location */}

          <div className='flex flex-col gap-[10px]'>
            <label htmlFor='selectedLGA' className='flex flex-col gap-[4px]'>
              <span className='text-base leading-[25.6px] font-medium text-[#1E1E1E]'>
                Preferred Location
              </span>{' '}
              <div className='flex items-center'>
                <input
                  id='selectedLGA'
                  placeholder='select location'
                  disabled={formStatus === 'pending'}
                  onClick={() => {
                    setShowLocationModal(!showLocationModal);
                  }}
                  className={`w-full outline-none min-h-[50px] border-[1px] py-[12px] px-[16px] bg-white disabled:bg-[#FAFAFA] border-[#D6DDEB] placeholder:text-[#A8ADB7] text-black text-base leading-[25.6px] disabled:cursor-not-allowed cursor-pointer rounded-[5px] ${
                    showLocationModal &&
                    'focus:outline-[1.5px] focus:outline-[#14b8a6] focus:outline-offset-0'
                  }`}
                  readOnly
                  value={
                    formik.values.selectedLGA
                      ? `${formik.values.selectedLGA}`
                      : ''
                  }
                />
                {/* <FontAwesomeIcon
                  icon={faCaretDown}
                  size='lg'
                  color={`${showLocationModal ? '#8DDB90' : 'gray'}`}
                  className={`absolute ml-[210px] hover:text-[#09391C] cursor-pointer transition-all duration-500`}
                /> */}
              </div>
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

          {/**Number of Bedrooms */}
          {/* <Select
            allowMultiple={false}
            heading={'landSize'}
            formik={formik}
            name={rentalReferenceData[3].heading}
            options={rentalReferenceData[3].options}
            placeholder='Select'
          /> */}
          <Input
            label='Number of Bedroom'
            name='bedroom'
            type='number'
            onChange={() => {
              formik.setFieldValue('bedroom', formik.values.bedroom);
            }}
            placeholder='This is placeholder'
            // formik={formik}
            isDisabled={formStatus === 'pending'}
            // selectedState={selectedState}
            // stateOptions={stateOptions}
            // setSelectedState={handleStateChange}
          />

          {/**Document Type */}
          {/* <Select
            allowMultiple={true}
            heading={'docOnProperty'}
            formik={formik}
            name={rentalReferenceData[4].heading}
            options={rentalReferenceData[4].options}
            placeholder='Select'
          /> */}
          {/**Desires Features */}
          <Select
            allowMultiple={true}
            heading={'desireFeatures'}
            formik={formik}
            name={rentalReferenceData[5].heading}
            options={rentalReferenceData[5].options}
            placeholder='Select'
            isDisabled={formStatus === 'pending'}
          />

          {/**Tenant Criteria */}
          <Select
            allowMultiple={true}
            heading={'tenantCriteria'}
            formik={formik}
            name='Tenant Criteria'
            options={[
              'Self Employed',
              'Employee',
              'Families',
              'Corporate Tenants',
              'Students',
              'No Pets Allowed',
              'Male',
              'Female',
              'Both Genders',
              'Individual Tenant',
              'Must Provide Credit Report',
              'Tenant Responsible for Basic Maintenance',
            ]}
            isDisabled={formStatus === 'pending'}
          />

          {/* {rentalReferenceData.map((item, idx: number) => (
            <Select formik={formik} key={idx} {...item} />
            //  <Select
            //   allowMultiple={false}
            //   heading={'propertyType'}
            //   formik={formik}
            //   name={propertyReferenceData[0].heading}
            //   options={propertyReferenceData[0].options}
            //   placeholder='Select'
            // />
          ))} */}

          <Button
            value={`${formStatus === 'pending' ? 'Searching...' : 'Search'}`}
            type='submit'
            onClick={isDisabled ? undefined : onClick}
            className={`hover:bg-[#09391C] text-[#FFFFFF] text-base leading-[25.6px] font-bold h-[50px] py-[12px] px-[24px] w-full ${
              formStatus === 'pending' ? 'bg-[#09391C]' : 'bg-[#8DDB90]'
            }`}
          />
        </div>
      </div>
    </form>
  );
};

export default RentalReference;

interface SelectProps {
  heading: string;
  placeholder?: string;
  options: any[];
  formik: any;
  allowMultiple?: boolean;
  name: string;
  isDisabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  heading,
  options,
  formik,
  allowMultiple,
  name,
  isDisabled,
}) => {
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
        isDisabled={isDisabled}
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
        styles={customStyles}
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
