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
import DesiresFeaturesModal from './desires-features-modal';
import TenantFeaturesModal from './tenant-criteria';

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
  const [filters, setFilters] = useState<string[]>([]);
  const [homeCondition, setHomeCondition] = useState<string>('');
  const [isBedAndBathModalOpened, setIsBedAndBathModalOpened] =
    useState<boolean>(false);
  const [bedsAndBath, setBedsAndBath] = useState<{
    bath: undefined | number | string;
    bed: undefined | number | string;
  }>({
    bath: undefined,
    bed: undefined,
  });

  const [isDesiresFeaturesModalOpened, setIsDesiresFeaturesModalOpened] =
    useState<boolean>(false);
  const [desiresFeatures, setDesiresFeatures] = useState<string[]>([]);

  const [isTenantCriteriaModalOpened, setIsTenantCriteriaModalOpened] =
    useState<boolean>(false);
  const [tenatCriteria, setTenantCriteria] = useState<string[]>([]);

  //Where we will be making the http requests
  const handleSubmit = () => {
    const payload = {
      filters,
      homeCondition,
      location: {
        state: formik.values.selectedState,
        lga: formik.values.selectedLGA,
      },
      price: {
        minPrice: priceFormik.values.minPrice,
        maxPrice: priceFormik.values.maxPrice,
        actualRadioPrice: priceRadioValue,
      },
      bedroom: bedsAndBath.bed,
      bathroom: bedsAndBath.bath,
      desiresFeatures,
      tenatCriteria,
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
    [priceRadioValue, formik.values, priceFormik.values]
  );
  return (
    <form
      onSubmit={formik.handleSubmit}
      className='container min-h-[181px] hidden md:flex flex-col gap-[25px] py-[25px] px-[30px] bg-[#FFFFFF]'>
      <div className='w-full pb-[10px] flex justify-between items-center gap-[53px] border-b-[1px] border-[#C7CAD0]'>
        <div className='flex gap-[15px]'>
          <h3 className='font-semibold text-[#1E1E1E]'>Filter by</h3>
          {['All', 'Land', 'Residential', 'Commercial', 'Duplex'].map(
            (item: string, idx: number) => (
              <RadioCheck
                key={idx}
                type='checkbox'
                name='filterBy'
                value={item}
                handleChange={() => {
                  const uniqueValues = new Set(filters as Array<string>);
                  if (uniqueValues.has(item)) {
                    uniqueValues.delete(item);
                    setFilters([...uniqueValues]);
                  } else {
                    uniqueValues.add(item);
                    setFilters([...uniqueValues]);
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
            handleChange={() => {
              setHomeCondition(item);
            }}
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
              bedsAndBath.bed !== undefined
                ? 'Bed: ' + bedsAndBath.bed + ' &'
                : ''
            } ${
              bedsAndBath.bath !== undefined ? 'Bath: ' + bedsAndBath.bath : ''
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
        {/**Desires Features Component */}
        <div className='flex flex-col gap-[10px]'>
          <Input
            className='w-[189px] text-sm'
            placeholder='bedroom'
            type='text'
            label='Desires Features'
            readOnly
            name=''
            // value={noOfBedrooms}
            onClick={() => setIsDesiresFeaturesModalOpened(true)}
          />
          {isDesiresFeaturesModalOpened && (
            <DesiresFeaturesModal
              values={desiresFeatures}
              setValues={setDesiresFeatures}
              closeModal={setIsDesiresFeaturesModalOpened}
            />
          )}
        </div>
        {/**Buttons ~ More Filter and Search */}
        <div className='flex gap-[20px]'>
          <div className='flex flex-col gap-[10px]'>
            <button
              type='button'
              onClick={() => setIsTenantCriteriaModalOpened(true)}
              className='w-[133px] h-[50px] border-[1px] border-[#09391C] text-base text-[#09391C]'>
              More filter
            </button>
            {isTenantCriteriaModalOpened && (
              <TenantFeaturesModal
                values={tenatCriteria}
                setValues={setTenantCriteria}
                closeModal={setIsTenantCriteriaModalOpened}
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
