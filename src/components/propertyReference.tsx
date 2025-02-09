/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use clients';
import React, { Fragment, MouseEvent } from 'react';
import Button from './button';
import ReactSelect from 'react-select';
import { FormikErrors, FormikValues, useFormik } from 'formik';
import * as Yup from 'yup';
import { cardDataArray } from '@/data';
import toast from 'react-hot-toast';

interface OptionType {
  value: string;
  label: string;
}

type FormValues = {
  [key: string]: OptionType | null; // Allow dynamic keys for each select
};

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
  setAllCards,
}: PropertyReferenceDataProps) => {
  const formik = useFormik({
    initialValues: propertyReferenceData.reduce((acc, item) => {
      acc[item.heading] = null; // Initialize with null for each select
      return acc;
    }, {} as FormValues),
    validationSchema: Yup.object(
      propertyReferenceData.reduce((acc, item) => {
        acc[item.heading] = Yup.object().required(
          `${item.heading} field is required`
        );
        return acc;
      }, {} as { [key: string]: Yup.Schema<any> })
    ),
    onSubmit: (values) => {
      console.log(values);

      //simulating the data
      const limit = 5;
      setAllCards(cardDataArray.slice(0, limit));
      setFound({
        isFound: !found.isFound,
        count: limit,
      });
    },
  });

  const handleValidationBeforeSubmission = () => {
    formik.validateForm().then((errs: FormikErrors<FormikValues>) => {
      if (Object.keys(errs).length > 0) {
        Object.values(errs).forEach((err) => toast.error(err));
      } else {
        formik.handleSubmit();
      }
    });
  };

  const submitReference = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <Fragment>
      <div className='min-h-[250px] lg:min-h-[250px] py-[24px] px-[20px] lg:py-[30px] w-full lg:w-[1153px] lg:px-[45px] bg-[#FFFFFF]'>
        <form className='w-full flex flex-col gap-[37px]'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-[30px] lg:gap-[37px] items-end'>
            {propertyReferenceData.map((item, idx: number) => (
              <Select formik={formik} key={idx} {...item} />
            ))}
            <Button
              value='Search'
              green={true}
              type='button'
              onClick={handleValidationBeforeSubmission}
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
                <Crumb text={formik.values['Type of Property']?.value} />
                <Crumb text={formik.values['Usage Options']?.value} />
                <Crumb text={formik.values['Budget Range']?.value} />
                <Crumb text={formik.values['Preferred Location']?.value} />
                <Crumb text={formik.values['Land Size']?.value} />
                <Crumb text={formik.values['Document Type']?.value} />
                <Crumb text={formik.values['Desires Features']?.value} />
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
}

const Select: React.FC<SelectProps> = ({ heading, options, formik }) => {
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
        {heading}
      </h2>
      <ReactSelect
        name={heading}
        onChange={(selectedOption) =>
          formik.setFieldValue(heading, selectedOption)
        }
        onBlur={formik.handleBlur}
        value={formik.values[heading]}
        options={opts}
        styles={{
          control: (base) => ({
            ...base,
            height: '50px',
            background: '#FFFFFF00',
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
        <div className='bg-[#F7F7F8] min-h-[28px] min-w-fit py-[3px] px-[6px] text-[14px] text-[#0B0D0C] leading-[22.4px] font-normal tracking-[0.1px] font-ubuntu'>
          {text}
        </div>
      ) : null}
    </Fragment>
  );
};
