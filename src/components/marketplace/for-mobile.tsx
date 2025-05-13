/** @format */

'use client';
import React, {
  ChangeEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'react';
import SelectStateLGA from './select-state-lga';
import { useFormik } from 'formik';
import { usePageContext } from '@/context/page-context';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import PriceRange from './price-range';
import RadioCheck from '../general-components/radioCheck';
import axios, { AxiosError } from 'axios';
import { URLS } from '@/utils/URLS';
import { featuresData } from '@/data/landlord';
import { useVisibility } from '@/hooks/useVisibility';
import Loading from '../loading-component/loading';
import { useLoading } from '@/hooks/useLoading';
import toast from 'react-hot-toast';

const Mobile = ({
  selectedMarketPlace,
  renderBrief,
}: {
  selectedMarketPlace: string;
  renderBrief: () => React.JSX.Element;
}) => {
  const { selectedType, setSelectedType } = usePageContext();
  const [isFilterModalOpened, setIsFilterModalOpened] =
    useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      selectedLGA: '',
      selectedState: '',
    },
    onSubmit: (values) => console.log(values),
  });
  const [payloadFromFilter, setPayloadFromFilter] = useState<any>();

  const handleSubmit = async () => {
    const payload = {
      ...payloadFromFilter,
      location: {
        state: formik.values.selectedState,
        lga: formik.values.selectedLGA,
      },
    };
    console.log(payload);
    // try {

    // } catch (error) {
    //  console.log(error)
    // }
  };

  const isLoading = useLoading();
  if (isLoading) return <Loading />;

  return (
    <Fragment>
      <div className='w-full flex flex-col gap-[20px]'>
        <div className='py-[25px] px-[30px] bg-white w-full sticky top-0 z-20'>
          <article className='h-full w-full flex flex-col gap-[15px]'>
            {/**List Property */}
            <div className='flex items-end justify-end'>
              <button
                title='List property'
                className='w-[133px] h-[34px] bg-[#8DDB90] text-white text-sm font-medium shadow-md shadow-[#a7e2a9]'
                type='button'>
                List Property
              </button>
            </div>
            {/**Preferred Location */}
            <SelectStateLGA
              placeholder='Enter state, lga, city....'
              formik={formik}
              heading='Preferred Location'
            />
            {/**other content */}
            <div className='grid grid-cols-2 min-h-[115px] w-full gap-[30px]'>
              <label htmlFor='market_place_type'>
                <select
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedType(event.target.value)
                  }
                  className='w-full h-[50px] px-[12px] border-[1px] border-[#D6DDEB] text-xs'
                  title='Select option'
                  name='market_place_type'
                  id='market_place_type'>
                  {[
                    'Buy a property',
                    'Find property for Joint Venture',
                    'Rent/Lease a property',
                  ].map((item: string, idx: number) => (
                    <option key={idx} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={() => setIsFilterModalOpened(!isFilterModalOpened)}
                className='border-[1px] px-[12px] border-[#09391C] w-full h-[50px] text-base text-[#09391C]'
                type='button'>
                filter
              </button>
              <button
                onClick={handleSubmit}
                className='h-[50px] w-full bg-[#8DDB90] px-[12px] col-span-2 text-white text-base font-bold'
                type='button'>
                Search
              </button>
            </div>
          </article>
        </div>
        <div
          className='flex-1 overflow-y-auto'
          style={{ maxHeight: 'calc(100dvh - 180px)', marginBottom: '30px' }} // adjust 180px as needed for your header height
        >
          {selectedMarketPlace && renderBrief()}
        </div>
      </div>
      {isFilterModalOpened && (
        <Filter
          setPayloadFromFilter={setPayloadFromFilter}
          closeModal={setIsFilterModalOpened}
        />
      )}
    </Fragment>
  );
};

const Filter = ({
  closeModal,
  setPayloadFromFilter,
}: {
  closeModal: (type: boolean) => void;
  setPayloadFromFilter: (type: any) => void;
}) => {
  const [radioValue, setRadioValue] = useState<string>('');
  const formik = useFormik({
    initialValues: {
      minPrice: 0,
      maxPrice: 0,
    },
    onSubmit: (values) => console.log(values),
  });
  const [buildingTypeValues, setBuildingTypeValues] = useState<string[]>([]);
  const [docValues, setDocValues] = useState<string[]>([]);
  const [bedroom, setBedroom] = useState<string[]>([]);
  const [bathroom, setBathroom] = useState<string | number>('');
  const [landSize, setLandSize] = useState<{
    type: string;
    size: undefined | number;
  }>({
    type: '',
    size: undefined,
  });
  const [selectedLandType, setSelectedLandType] =
    React.useState<string>('plot');
  const [desirerFeatures, setDesirerFeatures] = useState<string[]>([]);
  const lastDivRef = useRef<HTMLDivElement>(null);
  const visible = useVisibility(lastDivRef);

  const handleSubmit = () => {
    const payload = {
      actualPrice: radioValue,
      prices: {
        minPrice: formik.values.minPrice,
        maxPrice: formik.values.maxPrice,
      },
      building: buildingTypeValues,
      doc: docValues,
      bedroom: Number(bedroom[0]),
      bathroom,
    };
    console.log(payload);
    setPayloadFromFilter(payload);

    toast.success('Changes applied');
    closeModal(false);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      viewport={{ once: true }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      exit={{ opacity: 0, y: 20 }}
      className='w-full h-full bg-[#EEF1F1] z-20 fixed top-0 left-0 overflow-y-scroll hide-scrollbar px-[20px] pt-[40px] pb-[150px] flex flex-col gap-[20px]'>
      <div className='flex justify-between items-end pb-[20px] border-b-[1px] border-[#5A5D63]'>
        <h2 className='font-medium text-[#000000] text-xl'>Filter</h2>
        <FontAwesomeIcon
          icon={faClose}
          onClick={() => closeModal(false)}
          size='sm'
          className='w-[24px] h-[24px]'
          color='#504F54'
        />
      </div>
      {/**Price Range */}
      <div className='bg-white w-full min-h-fit p-[19px] flex flex-col gap-[25px] shadow-sm'>
        <h2 className='text-base font-medium text-black'>Price Range</h2>
        <div className='h-[47px] w-full flex justify-between'>
          <label
            htmlFor='min'
            className='w-[50%] border-[1px] border-[#D6DDEB] px-[12px] flex items-center justify-evenly'>
            <span className='text-base text-black'>min</span>
            <input
              type='number'
              name='min'
              value={formik.values.minPrice}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              id='min'
              className='h-full w-[50px] text-center outline-none'
            />
            <span className='text-base text-black'>N</span>
          </label>
          <label
            htmlFor='max'
            className='w-[50%] border-[1px] border-[#D6DDEB] px-[12px] flex items-center justify-evenly'>
            <span className='text-base text-black'>max</span>
            <input
              type='number'
              name='max'
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.maxPrice}
              id='max'
              className='h-full w-[50px] text-center outline-none'
            />
            <span className='text-base text-black'>N</span>
          </label>
        </div>
        {/**Radios */}
        <div className='flex gap-[5px] flex-wrap w-full'>
          {[
            '500k - 1million',
            '2million - 4million',
            '5million - 6million',
            '10million above',
          ].map((item: string, idx: number) => (
            <RadioCheck
              modifyStyle={{
                fontSize: '14px',
              }}
              key={idx}
              type='radio'
              isChecked={item === radioValue}
              onClick={() => {
                setRadioValue(item);
                formik.setFieldValue('minPrice', '');
                formik.setFieldValue('maxPrice', '');
              }}
              value={item}
              name='prices'
            />
          ))}
        </div>
      </div>
      {/**Building Type */}
      <SimilarComponent
        heading='Building Type'
        type='checkbox'
        data={[
          'Bungalow',
          'Duplex',
          'Semi detach',
          'Deed of Assignment',
          'Land certificate',
        ]}
        selectedValues={buildingTypeValues}
        setSelectedValues={setBuildingTypeValues}
      />
      {/**Document type */}
      <SimilarComponent
        heading='Document Type'
        type='checkbox'
        data={[
          'C of O',
          'Government Consent',
          'Receipt',
          'Deed of Assignment',
          'Land certificate',
          'Registered deed of conveyance',
        ]}
        selectedValues={docValues}
        setSelectedValues={setDocValues}
      />
      {/**Bedroom count */}
      <SimilarComponent
        type='radio'
        heading='Bedroom'
        data={Array.from({ length: 5 })}
        selectedValues={bedroom}
        setSelectedValues={setBedroom}
      />
      {/**More filter */}
      <div className='w-full min-h-fit flex flex-col p-[19px] gap-[25px] bg-white shadow-sm'>
        <h2 className='text-black text-base font-medium'>More Filter</h2>
        {/**Bathroom */}
        <div className='min-h-[90px] w-full flex flex-col gap-[10px]'>
          <h2 className='font-medium text-sm text-[#5A5D63]'>Bathroom</h2>
          <div className='flex gap-[10px] flex-wrap'>
            {Array.from({ length: 10 }).map((__, idx: number) => {
              if (idx === 9) {
                return (
                  <RadioCheck
                    modifyStyle={{
                      fontSize: '14px',
                    }}
                    type='radio'
                    value={'more'}
                    key={idx + 1}
                    name='bathroom'
                    isChecked={bathroom === 'more'}
                    onClick={() => setBathroom('more')}
                  />
                );
              }
              return (
                <RadioCheck
                  modifyStyle={{
                    fontSize: '14px',
                  }}
                  type='radio'
                  value={Number(idx + 1).toLocaleString()}
                  key={idx + 1}
                  name='bathroom'
                  isChecked={bathroom === idx + 1}
                  onClick={() => setBathroom(idx + 1)}
                />
              );
            })}
          </div>
        </div>

        {/**Land Size */}
        <div
          ref={lastDivRef}
          className='h-[135px] w-full flex flex-col gap-[15px]'>
          <h2 className='text-sm text-[#5A5D63] font-medium'>Land Size</h2>
          <div className='flex gap-[15px]'>
            {['plot', 'Acres', 'Sqr Meter'].map((item: string, idx: number) => (
              <button
                type='button'
                key={idx}
                onClick={() => setSelectedLandType(item)}
                className={`w-1/3 px-[15px] text-xs h-[36px] ${
                  selectedLandType === item
                    ? 'bg-[#8DDB90] font-medium text-white'
                    : 'bg-transparent text-[#5A5D63]'
                } border-[1px] border-[#C7CAD0]`}>
                {item}
              </button>
            ))}
          </div>
          <div className='h-[47px] border-[1px] border-[#D6DDEB] w-full flex justify-between items-center px-[12px] py-[16px]'>
            <span>min</span>
            <label htmlFor='landSize'>
              <input
                type='number'
                name='landSize'
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setLandSize({
                    type: selectedLandType,
                    size: Number(event.target.value),
                  });
                }}
                id='landSize'
                value={landSize.size}
                title='Land size'
                className='outline-none h-full w-full text-center'
              />
            </label>
            <span className='text-sm text-black'>{selectedLandType}</span>
          </div>
        </div>
        <div className='flex flex-col gap-[15px]'>
          <h2 className='text-[#5A5D63] text-sm font-medium'>
            Desirer Features
          </h2>
          <div className='flex flex-col gap-[10px]'>
            {featuresData.map((item: string, idx: number) => (
              <RadioCheck
                key={idx}
                modifyStyle={{
                  fontSize: '14px',
                }}
                value={item}
                type='checkbox'
                name='features'
                isChecked={desirerFeatures.some(
                  (text: string) => text === item
                )}
                onClick={() => {
                  const uniqueFeatures: Set<string> = new Set([
                    ...desirerFeatures,
                  ]);
                  if (uniqueFeatures.has(item)) {
                    uniqueFeatures.delete(item);
                  }
                  uniqueFeatures.add(item);
                  setDesirerFeatures(Array.from(uniqueFeatures));
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/**Reset all features and apply features button */}
      <AnimatePresence>
        {
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.4 }}
            whileInView={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className='fixed border-[1px] border-[#5A5D63] left-0 w-full bottom-0 bg-white px-[18px] py-[26px] flex gap-[20px] items-center justify-center'>
            <button
              onClick={() => {
                console.log('resetted');
                formik.setFieldValue('minPrice', '');
                formik.setFieldValue('maxPrice', '');
                setDesirerFeatures([]);
                setLandSize({
                  size: 0,
                  type: '',
                });
                setBathroom('');
                setBedroom([]);
                setDocValues([]);
                setBuildingTypeValues([]);
                setRadioValue('');
              }}
              className='w-[145px] h-[50px] border-[1px] border-[#5A5D63] text-base font-medium text-[#1E1E1E]'
              type='button'>
              Reset all filter
            </button>
            <button
              onClick={handleSubmit}
              type='button'
              className='border-[1px] border-[#8DDB90] bg-[#8DDB90] h-[50px] w-[231px] text-white text-base font-medium'>
              Apply
            </button>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>
  );
};

const SimilarComponent = ({
  heading,
  data,
  selectedValues,
  setSelectedValues,
  type,
}: {
  heading: string;
  data: string[];
  selectedValues: string[];
  setSelectedValues: (type: string[]) => void;
  type: 'checkbox' | 'radio';
}) => {
  const renderData = () => {
    if (data['length'] !== 0) {
      return data;
    }
    throw new Error('Array has no content');
  };

  return (
    <div className='w-full bg-white min-h-fit p-[19px] flex flex-col gap-[13px] shadow-sm'>
      <h2 className='text-black font-medium text-base'>{heading}</h2>
      <div className='flex gap-[10px] flex-wrap'>
        {data &&
          renderData().map((item: string, idx: number) => (
            <RadioCheck
              isChecked={selectedValues.some((text: string) => item === text)}
              modifyStyle={{
                fontSize: '14px',
              }}
              type={type}
              onClick={() => {
                if (type === 'checkbox') {
                  const uniqueValues = new Set([...selectedValues]);
                  if (uniqueValues.has(item)) {
                    uniqueValues.delete(item);
                    setSelectedValues(Array.from(uniqueValues));
                  } else {
                    uniqueValues.add(item);
                    setSelectedValues(Array.from(uniqueValues));
                  }
                } else if (type === 'radio') {
                  setSelectedValues([(idx + 1).toString()]);
                } else {
                  return null;
                }
              }}
              key={idx}
              value={item ?? idx + 1}
              name={heading}
            />
          ))}
      </div>
    </div>
  );
};

export default Mobile;
