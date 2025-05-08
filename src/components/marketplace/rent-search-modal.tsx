/** @format */
'use client';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import SelectStateLGA from './select-state-lga';
import Input from '../general-components/Input';
import PriceRange from './price-range';
import DocumentTypeComponent from './document-type';
import BedroomComponent from './bedroom';
import MoreFilter from './more-filter';
import RadioCheck from '../general-components/radioCheck';
import BedsAndBathModal from './beds-and-bath-modal';

const RentSearchModal = () => {
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
  const [isBedAndBathModalOpened, setIsBedAndBathModalOpened] =
    useState<boolean>(false);
  const [bedsAndBath, setBedsAndBath] = useState<{
    bath: undefined | number | string;
    bed: undefined | number | string;
  }>({
    bath: undefined,
    bed: undefined,
  });

  const handleSubmit = () => {
    console.log(formik.values);
    console.log(priceFormik.values);
    console.log(priceRadioValue);
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
    [priceRadioValue, formik.values, priceFormik.values]
  );
  return (
    <form
      onSubmit={formik.handleSubmit}
      className='container min-h-[181px] flex flex-col gap-[25px] py-[25px] px-[30px] bg-[#FFFFFF]'>
      <div className='w-full pb-[10px] flex justify-between items-center gap-[53px] border-b-[1px] border-[#C7CAD0]'>
        <div className='flex gap-[15px]'>
          <h3 className='font-semibold text-[#1E1E1E]'>Filter by</h3>
          {['All', 'Land', 'Residential', 'Commercial', 'Duplex'].map(
            (item: string, idx: number) => (
              <label
                htmlFor='usageOptions'
                key={idx}
                className='flex gap-[17px]'>
                <input
                  className='w-[24px] h-[24px]'
                  style={{
                    accentColor: '#8DDB90',
                  }}
                  title={item}
                  type='checkbox'
                  name='checkbox'
                  id='usageOptions'
                />
                <span className='text-base text-[#000000]'>{item}</span>
              </label>
            )
          )}
        </div>
        <div className='flex gap-[30px]'>
          <button
            className='h-[34px] w-[133px] bg-[#8DDB90] text-white shadow-md font-medium text-sm'
            type='button'>
            Post property
          </button>
        </div>
      </div>
      {/**Home Condition */}
      <div className='w-full flex items-center gap-[15px]'>
        <h3 className='text-base font-medium text-[#1E1E1E]'>
          Home Condition:{' '}
        </h3>
        {[
          'All',
          'Brand new',
          'Good condition',
          'Fairly used',
          'Need Renovation',
        ].map((item: string, idx: number) => (
          <RadioCheck
            key={idx}
            value={item}
            name='home_condition'
            type='radio'
          />
        ))}
      </div>

      {/**Third section */}
      <div className='flex gap-[20px] items-end'>
        {/**Preferred Location */}
        <SelectStateLGA
          placeholder='Enter state, lga, city....'
          formik={formik}
          heading='Location'
        />
        {/**Price Range */}
        <div className='flex flex-col gap-[10px]'>
          <Input
            className='w-[189px]'
            placeholder='Price Range'
            type='text'
            label='Price'
            readOnly
            value={
              priceRadioValue !== ''
                ? priceRadioValue
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
        {/**Beds and Bath */}
        <div className='flex flex-col gap-[10px]'>
          <Input
            className='w-[189px] text-sm'
            placeholder='Beds & Baths'
            type='text'
            label='Beds & Baths'
            readOnly
            name=''
            value={`${
              bedsAndBath.bed !== undefined && 'Bed: ' + bedsAndBath.bed + ' &'
            } ${
              bedsAndBath.bath !== undefined && 'Bath: ' + bedsAndBath.bath
            } `}
            onClick={() => setIsBedAndBathModalOpened(true)}
          />
          {isBedAndBathModalOpened && (
            <BedsAndBathModal
              bedAndBath={bedsAndBath}
              setBedAndBath={setBedsAndBath}
              closeModal={setIsBedAndBathModalOpened}
            />
          )}
        </div>
        {/**Bedroom Component */}
        <div className='flex flex-col gap-[10px]'>
          <Input
            className='w-[189px] text-sm'
            placeholder='bedroom'
            type='text'
            label='Bedroom'
            readOnly
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

export default RentSearchModal;
