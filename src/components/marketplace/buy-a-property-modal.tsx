/** @format */

'use client';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import SelectStateLGA from './select-state-lga';
import Input from '../general-components/Input';
import PriceRange from './price-range';
import BedroomComponent from './bedroom';
import MoreFilter from './more-filter';
import DocumentTypeComponent from './document-type';
import React from 'react';
import RadioCheck from '../general-components/radioCheck';

const BuyAPropertySearchModal = ({
  selectedBriefs,
  className = '',
  style = {},
}: {
  selectedBriefs: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [usageOptions, setUsageOptions] = useState<string[]>([]);
  const formik = useFormik({
    initialValues: {
      selectedLGA: '',
      selectedState: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const [isPriceRangeModalOpened, setIsPriceRangeModalOpened] =
    useState<boolean>(false);
  const [priceRadioValue, setPriceRadioValue] = useState<string>('');
  const [isDocumentModalOpened, setIsDocumentModalOpened] =
    useState<boolean>(false);
  const [documentsSelected, setDocumentsSelected] = useState<string[]>([]);
  const [isBedroomModalOpened, setIsBedroomModalOpened] =
    useState<boolean>(false);
  const [noOfBedrooms, setNoOfBedrooms] = useState<number | undefined>(
    undefined
  );
  const [isMoreFilterModalOpened, setIsMoreFilterModalOpened] =
    useState<boolean>(false);
  const [filters, setFilters] = useState<{
    bathroom: number | undefined | string;
    landSize: {
      type: string;
      size: undefined | number;
    };
    desirer_features: string[];
  }>({
    bathroom: undefined,
    landSize: {
      type: 'plot',
      size: undefined,
    },
    desirer_features: [],
  });

  const handleSubmit = () => {
    const payload = {
      usageOptions,
      location: {
        state: formik.values.selectedState,
        lga: formik.values.selectedLGA,
      },
      price: {
        minPrice: priceFormik.values.minPrice,
        maxPrice: priceFormik.values.maxPrice,
        actualRadioPrice: priceRadioValue,
      },
      docsOnProperty: documentsSelected,
      bedroom: noOfBedrooms,
      bathroom: filters.bathroom,
      landSize: filters.landSize,
      desirerFeatures: filters.desirer_features,
    };
    console.log(payload);
  };

  const priceFormik = useFormik({
    initialValues: {
      minPrice: 0,
      maxPrice: 0,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(
    () => handleSubmit(),
    [priceRadioValue, formik.values, priceFormik.values, documentsSelected]
  );

  const docsValues = documentsSelected.map((item: string) => item);
  return (
    <form
      onSubmit={formik.handleSubmit}
      className='container min-h-[181px] hidden md:flex flex-col gap-[25px] py-[25px] px-[30px] bg-[#FFFFFF] sticky top-0 z-20'>
      <div className='w-full pb-[10px] flex justify-between items-center gap-[53px] border-b-[1px] border-[#C7CAD0]'>
        <div className='flex gap-[15px]'>
          <h3 className='font-semibold text-[#1E1E1E]'>Usage Options</h3>
          {['All', 'Land', 'Residential', 'Commercial'].map(
            (item: string, idx: number) => (
              <RadioCheck
                key={idx}
                type='checkbox'
                name='usageOptions'
                value={item}
                handleChange={() => {
                  const uniqueValues = new Set(usageOptions as Array<string>);
                  if (uniqueValues.has(item)) {
                    uniqueValues.delete(item);
                    setUsageOptions([...uniqueValues]);
                  } else {
                    uniqueValues.add(item);
                    setUsageOptions([...uniqueValues]);
                  }
                }}
              />
            )
          )}
        </div>
        <div className='flex gap-[30px]'>
          <button
            className='h-[34px] w-[133px] bg-[#8DDB90] text-white shadow-md font-medium text-sm'
            type='button'>
            List property
          </button>
          <button
            className='h-[34px] w-[133px] bg-transparent text-[#FF3D00] border-[1px] border-[#FF3D00] font-medium text-sm'
            type='button'>
            {selectedBriefs} selected briefs
          </button>
        </div>
      </div>
      <div className='flex gap-[20px] items-end'>
        {/**Preferred Location */}
        <SelectStateLGA
          placeholder='Enter state, lga, city....'
          formik={formik}
          heading='Preferred Location'
        />
        {/**Price Range */}
        <div className='flex flex-col gap-[10px]'>
          <Input
            className='w-[189px]'
            placeholder='Price Range'
            type='text'
            label=''
            readOnly
            showDropdownIcon={true}
            value={
              priceRadioValue !== ''
                ? priceRadioValue
                : priceFormik.values.minPrice === 0 &&
                  priceFormik.values.maxPrice === 0
                ? undefined // Allow placeholder to show
                : `${Number(
                    priceFormik.values.minPrice
                  ).toLocaleString()} - ${Number(
                    priceFormik.values.maxPrice
                  ).toLocaleString()}`
            }
            name=''
            onClick={() => setIsPriceRangeModalOpened(true)}
          />
          {isPriceRangeModalOpened && (
            <PriceRange
              setSlectedRadioValue={setPriceRadioValue}
              formik={priceFormik}
              closeModal={setIsPriceRangeModalOpened}
              heading='Price Range'
            />
          )}
        </div>
        {/**Document Type */}
        <div className='flex flex-col gap-[10px]'>
          <Input
            className='w-[189px] text-sm'
            placeholder='Document Type'
            type='text'
            label=''
            readOnly
            showDropdownIcon={true}
            name=''
            value={docsValues.toString()}
            onClick={() => setIsDocumentModalOpened(true)}
          />
          {isDocumentModalOpened && (
            <DocumentTypeComponent
              docsSelected={documentsSelected}
              setDocsSelected={setDocumentsSelected}
              closeModal={setIsDocumentModalOpened}
            />
          )}
        </div>
        {/**Bedroom Component */}
        <div className='flex flex-col gap-[10px]'>
          <Input
            className='w-[189px] text-sm'
            placeholder='bedroom'
            type='text'
            label=''
            readOnly
            showDropdownIcon={true}
            name=''
            value={noOfBedrooms}
            onClick={() => setIsBedroomModalOpened(true)}
          />
          {isBedroomModalOpened && (
            <BedroomComponent
              noOfBedrooms={noOfBedrooms}
              closeModal={setIsBedroomModalOpened}
              setNumberOfBedrooms={setNoOfBedrooms}
            />
          )}
        </div>
        {/**Buttons ~ More Filter and Search */}
        <div className='flex gap-[20px]'>
          <div className='flex flex-col gap-[10px]'>
            <button
              type='button'
              onClick={() => setIsMoreFilterModalOpened(true)}
              className='w-[133px] h-[50px] border-[1px] border-[#09391C] text-base text-[#09391C]'>
              More filter
            </button>
            {isMoreFilterModalOpened && (
              <MoreFilter
                filters={filters}
                setFilters={setFilters}
                closeModal={setIsMoreFilterModalOpened}
              />
            )}
          </div>
          <button
            type='button'
            className='w-[153px] h-[50px] bg-[#8DDB90] text-base text-white font-bold'>
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default BuyAPropertySearchModal;
