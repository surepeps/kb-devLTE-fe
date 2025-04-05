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
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import MultiSelectionProcess from './multiSelectionProcess';

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
  selectedLGA: '';
  selectedState: '';
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
    },
    onSubmit: async (values: valuesProps) => {
      console.log(values);
      const payload = {
        location: {
          state: values.selectedState,
          localGovernment: values.selectedLGA.split(',')[1].trimStart(),
          area: 'N/A',
        },
        propertyCondition: 'New Building',
        propertyType: values.propertyType,
        budgetRange: values.budgetRange.trimStart(),
        docOnProperty: values.docOnProperty,
        desireFeatures: values.desireFeatures,
        rentalPrice: 4000000,
      };
      console.log(payload);
      try {
        const response = await axios.post(
          URLS.BASE + '/properties/rents/rent/new',
          payload
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
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
      className='min-h-[398px] lg:min-h-[344px] py-[24px] px-[20px] lg:py-[30px] w-full lg:w-[1153px] lg:px-[45px] bg-[#FFFFFF]'>
      <div className='w-full min-h-[284px] flex flex-col gap-[37px]'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-[30px] lg:gap-[37px]'>
          {/**Type of Property */}
          <Select
            allowMultiple={false}
            heading={'propertyType'}
            formik={formik}
            name={'Type of Home'}
            options={rentalReferenceData[0].options}
            placeholder='Select'
          />

          {/**Budget Range */}
          <Select
            allowMultiple={false}
            heading={'budgetRange'}
            formik={formik}
            name={rentalReferenceData[1].heading}
            options={rentalReferenceData[1].options}
            placeholder='Select'
          />
          {/**Home Condition */}
          <Input
            label='Home condition'
            name='homeCondition'
            type='text'
            placeholder='This is place holder'
            formik={formik}
            // selectedState={selectedState}
            // stateOptions={stateOptions}
            // setSelectedState={handleStateChange}
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
                  formik.values.selectedLGA
                    ? `${formik.values.selectedLGA}`
                    : ''
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
            placeholder='This is placeholder'
            formik={formik}
            // selectedState={selectedState}
            // stateOptions={stateOptions}
            // setSelectedState={handleStateChange}
          />

          {/**Document Type */}
          <Select
            allowMultiple={true}
            heading={'docOnProperty'}
            formik={formik}
            name={rentalReferenceData[4].heading}
            options={rentalReferenceData[4].options}
            placeholder='Select'
          />
          {/**Desires Features */}
          <Select
            allowMultiple={true}
            heading={'desireFeatures'}
            formik={formik}
            name={rentalReferenceData[5].heading}
            options={rentalReferenceData[5].options}
            placeholder='Select'
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
        </div>
        <div className='w-full justify-end items-end flex'>
          <Button
            value='Search'
            green={true}
            type='submit'
            onClick={isDisabled ? undefined : onClick}
            className='bg-[#8DDB90] text-[#FFFFFF] text-base leading-[25.6px] font-bold min-h-[50px] py-[12px] px-[24px] lg:w-[334px] w-full'
          />
        </div>
      </div>
    </form>
  );
};

export default RentalReference;

// interface SelectProps {
//   heading: string;
//   placeholder?: string;
//   options: string[];
//   formik: any;
// }

// const Select: React.FC<SelectProps> = ({ heading, options, formik }) => {
//   // const [valueSelected, setValueSelected] = useState<string>('');
//   return (
//     <label
//       htmlFor='select'
//       className='min-h-[80px] lg:w-[334.33px] w-full flex flex-col gap-[4px]'>
//       <h2 className='text-base font-medium leading-[25.6px] text-[#1E1E1E]'>
//         {heading}
//       </h2>
//       <select
//         onChange={formik.handleChange}
//         value={formik.values[heading]}
//         onBlur={formik.handleBlur}
//         className='min-h-[50px] border-[1px] py-[12px] px-[16px] bg-[#FFFFFF00] border-[#D6DDEB]'
//         name={heading}
//         id={heading}>
//         {options.map((option: string, idx: number) => (
//           <option value={option} key={idx}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </label>
//   );
// };

interface SelectProps {
  heading: string;
  placeholder?: string;
  options: any[];
  formik: any;
  allowMultiple?: boolean;
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
