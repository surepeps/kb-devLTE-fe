/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use clients';
import React, { Fragment, MouseEvent } from 'react';
import Button from './button';
import ReactSelect from 'react-select';
import { useFormik } from 'formik';
//import * as Yup from 'yup';
//import { cardDataArray } from '@/data';
//import toast from 'react-hot-toast';
import { URLS } from '@/utils/URLS';
import { POST_REQUEST } from '@/utils/requests';
import Input from '@/components/Input';

// interface OptionType {
//   value: string;
//   label: string;
// }

// type FormValues = {
//   [key: string]: OptionType | null; // Allow dynamic keys for each select
// };

interface valuesProps {
  propertyType: string;
  usageOption: any[];
  budgetRange: string;
  state: string;
  landSize: string;
  docOnProperty: [];
  desireFeatures: [];
}

interface PropertyReferenceDataProps {
  propertyReferenceData: { heading: string; options: string[] }[];
  setFound: ({ isFound, count }: { isFound: boolean; count: number }) => void;
  found: { isFound: boolean; count: number };
  setAllCards: ([]: { header: string; value: string }[][]) => void;
}

const PropertyReference = ({
  propertyReferenceData,
  found,
  setFound,
}: PropertyReferenceDataProps) => {
  // const validationSchema = Yup.object({
  //   propertyType: Yup.string().required('Property Type is Required'),
  //   usageOption: Yup.array()
  //     .min(1, 'Usage Option is required')
  //     .required('Usage Option is required'),
  //   budgetRange: Yup.string().required('Budget Range is required'),
  //   state: Yup.string().required('State is required'),
  //   landSize: Yup.string().required('Land size is required'),
  //   docOnProperty: Yup.array()
  //     .min(1, 'At least one Document Type is required')
  //     .required('Document Type is required'),
  //   desireFeatures: Yup.object().shape({
  //     additionalFeatures: Yup.array(),
  //     noOfBedroom: Yup.number()
  //       .min(1, 'Must have at least 1 bedroom')
  //       .required('Number of bedrooms is required'),
  //   }),
  // });
  const formik = useFormik({
    initialValues: {
      propertyType: '',
      usageOption: [],
      budgetRange: '',
      state: '',
      landSize: '',
      docOnProperty: [],
      desireFeatures: [],
    },
    // validationSchema,
    onSubmit: (values: valuesProps) => {
      console.log(values);
      setFound({
        isFound: !found.isFound,
        count: 6,
      });
    },
  });
  // const formik = useFormik({
  //   initialValues: propertyReferenceData.reduce((acc, item) => {
  //     acc[item.heading] = null; // Initialize with null for each select
  //     return acc;
  //   }, {} as FormValues),
  //   validationSchema: Yup.object(
  //     propertyReferenceData.reduce((acc, item) => {
  //       acc[item.heading] = Yup.object().required(
  //         `${item.heading} field is required`
  //       );
  //       return acc;
  //     }, {} as { [key: string]: Yup.Schema<any> })
  //   ),
  //   onSubmit: (values) => {
  //     console.log(values);

  //     //simulating the data
  //     const limit = 5;

  //     setFound({
  //       isFound: !found.isFound,
  //       count: limit,
  //     });
  //   },
  // });

  const submitReference = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload = {
      propertyType: formik.values.propertyType,
      // usageOptions: formik.values.usageOption,
      budgetRange: formik.values.budgetRange,
      location: {
        state: formik.values.state,
      },
      // desiresFeatures: formik.values.desireFeatures,
      // docOnProperty: formik.values.docOnProperty,
    };
    try {
      const response = await POST_REQUEST(
        URLS.BASE + '/properties/buy/request/new',
        payload
      );
      if (response.success) {
      }
    } catch (error) {
      console.log('error', error);
    }
    console.log('submitted', payload);
  };

  return (
    <Fragment>
      <div className='min-h-[250px] lg:min-h-[250px] py-[24px] px-[20px] lg:py-[30px] w-full lg:w-[1153px] lg:px-[45px] bg-[#FFFFFF]'>
        <form
          onSubmit={formik.handleSubmit}
          className='w-full flex flex-col gap-[37px]'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-[30px] lg:gap-[37px] items-end'>
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
              allowMultiple={true}
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
            <Input
              label='Preferred Location'
              name='selectedState'
              selectedState={{
                value: formik.values?.state,
                label: formik.values?.state,
              }}
              setSelectedState={(option) => {
                formik.setFieldValue('state', option?.label);
              }}
              forState={true}
              type='text'
              placeholder='Select State'
            />
            {/**Land Size */}
            <Select
              allowMultiple={false}
              heading={'landSize'}
              formik={formik}
              name={propertyReferenceData[4].heading}
              options={propertyReferenceData[4].options}
              placeholder='Select'
            />
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

            <Button
              value='Search'
              green={true}
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
                <Crumb text={formik.values.propertyType} />
                <Crumb text={formik.values.usageOption.map((item) => item)} />
                <Crumb text={formik.values.budgetRange} />
                <Crumb text={formik.values.state} />
                <Crumb text={formik.values.landSize} />
                <Crumb text={formik.values.docOnProperty.map((item) => item)} />
                <Crumb
                  text={formik.values.desireFeatures?.map((item) => item)}
                />
              </div>
            </div>
            <button
              type='button'
              onClick={submitReference}
              className='text-base leading-[25.6px] font-bold text-[#09391C] lg:w-[245px] min-h-[58px] border-[1px] py-[12px] px-[24px] border-[#09391C]'>
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
  options: string[];
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
    value: item.toLowerCase(),
    label: item,
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
        onChange={(selectedOption) =>
          allowMultiple
            ? formik.setFieldValue(heading, [
                ...selectedOption.map((opt: any) => opt.label),
                selectedOption?.label,
              ])
            : formik.setFieldValue(heading, selectedOption?.label)
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
          className='bg-[#F7F7F8] min-h-[28px] min-w-fit py-[3px] px-[6px] text-[14px] text-[#0B0D0C] leading-[22.4px] font-normal tracking-[0.1px] font-ubuntu'
        />
      ) : null}
    </Fragment>
  );
};
