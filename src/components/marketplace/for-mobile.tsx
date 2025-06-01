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
import { useRouter } from 'next/navigation';
import MobileSelectedBottomBar from '@/components/marketplace/MobileSelectedBottomBar';
import axios, { AxiosError } from 'axios';
import { URLS } from '@/utils/URLS';
import { useVisibility } from '@/hooks/useVisibility';
import Loading from '../loading-component/loading';
import { useLoading } from '@/hooks/useLoading';
import toast from 'react-hot-toast';
import Filter from './filter-for-mobile';

const Mobile = ({
  selectedMarketPlace,
  renderBrief,
  selectedBriefs,
  onSelectBrief,
  selectedBriefsList,
  onSubmitForInspection,
  handleSearch,
  setPropertiesSelected,
  onRemoveAllBriefs
}: {
  selectedMarketPlace: string;
  renderBrief: (onSelectBrief: (id: string) => void) => React.JSX.Element;
  onSubmitForInspection: (selectedBriefsList: Set<any>) => void;
  selectedBriefs: number;
  onSelectBrief: (id: string) => void;
  selectedBriefsList: Set<any>;
  handleSearch?: (payload: any) => void;
  setPropertiesSelected: (type: any[]) => void;
   onRemoveAllBriefs: () => void; 
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
  const router = useRouter();

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

  const locationValue = [formik.values.selectedLGA, formik.values.selectedState]
    .filter(Boolean)
    .join(', ')
    .trim();

  const payload = {
    // usageOptions,
    location: locationValue !== '' ? locationValue : undefined,
    price:
      payloadFromFilter?.prices?.maxPrice > 0
        ? { $lte: payloadFromFilter?.prices?.maxPrice }
        : undefined,
    docsOnProperty: payloadFromFilter?.doc,
    bedroom: payloadFromFilter?.bedroom,
    bathroom: payloadFromFilter?.bathroom,
    landSize:
      payloadFromFilter?.landSize && payloadFromFilter?.landSize?.size
        ? payloadFromFilter?.landSize
        : undefined,
    desirerFeatures: payloadFromFilter?.desirer_features,
    briefType: 'Outright Sales',
  };

  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([_, v]) =>
        v !== undefined &&
        v !== '' &&
        !(Array.isArray(v) && v.length === 0) &&
        !(
          typeof v === 'object' &&
          v !== null &&
          !Array.isArray(v) &&
          Object.keys(v).length === 0
        )
    )
  );

  const isLoading = useLoading();
  if (isLoading) return <Loading />;

  return (
    <Fragment>
      <div className='w-full flex flex-col gap-[20px]'>
        <div className='py-[10px] bg-white w-full sticky top-0 z-20'>
            {selectedBriefs > 0 ? (
            <MobileSelectedBottomBar
              selectedBriefs={selectedBriefs}
              selectedBriefsList={Array.from(selectedBriefsList)}
              onRemoveAllBriefs={onRemoveAllBriefs} 
              onSubmitForInspection={() => {
                onSubmitForInspection(selectedBriefsList);
              }}
            />
            ) : (
            <article className='h-full w-full flex flex-col gap-[15px] px-[10px]'>
              {/**Preferred Location */}
              <SelectStateLGA
                placeholder='Enter state, lga, city....'
                formik={formik}
                heading=''
              />
              {/**other content */}
              <div className='flex w-full gap-[20px]'>
                <label htmlFor='market_place_type' className='flex-1'>
                  <select
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedType(event.target.value)
                    }
                    className='w-full h-[34px] px-[12px] border-[1px] border-[#D6DDEB] text-xs'
                    title='Select option'
                    name='market_place_type'
                    id='market_place_type'>
                    {[
                      'Buy a property',
                      'Find property for joint venture',
                      'Rent/Lease a property',
                    ].map((item: string, idx: number) => (
                      <option key={idx} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              <button
                title='List property'
                className='w-[30%] h-[34px] bg-[#8DDB90] text-white text-xs font-medium shadow-md shadow-[#a7e2a9] '
                type='button'
                onClick={() => router.push('/post_property')}
              >
                List Property
              </button>
              </div>

              <div className='grid grid-cols-2 gap-[10px]'>
                <button
                  onClick={() => handleSearch?.(cleanedPayload)}
                  className='h-[34px] w-full bg-[#8DDB90] px-[12px] text-white text-xs font-bold'
                  type='button'>
                  Search
                </button>
                <button
                  onClick={() => setIsFilterModalOpened(!isFilterModalOpened)}
                  className='border-[1px] px-[8px] border-[#09391C] w-full h-[34px] text-xs text-[#09391C]'
                  type='button'>
                  filter
                </button>
              </div>
            </article>     
          )}   
        </div>
        <div
          className='flex-1 overflow-y-auto px-5'
          style={{ maxHeight: 'calc(100dvh - 180px)', marginBottom: '20px' }}>
          {selectedMarketPlace && renderBrief(onSelectBrief)}
        </div>
      </div>
      <AnimatePresence>
        {isFilterModalOpened && (
          <Filter
            setPayloadFromFilter={setPayloadFromFilter}
            closeModal={setIsFilterModalOpened}
            selectedType={selectedType}
          />
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default Mobile;
