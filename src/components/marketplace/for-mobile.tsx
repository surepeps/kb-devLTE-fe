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
}: {
  selectedMarketPlace: string;
  renderBrief: (onSelectBrief: (id: string) => void) => React.JSX.Element;
  onSubmitForInspection: (selectedBriefsList: Set<any>) => void;
  selectedBriefs: number;
  onSelectBrief: (id: string) => void;
  selectedBriefsList: Set<any>;
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
        <div className='py-[10px] bg-white w-full sticky top-0 z-20'>
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
                title='List property'
                className='w-[30%] h-[34px] bg-[#8DDB90] text-white text-xs font-medium shadow-md shadow-[#a7e2a9] '
                type='button'>
                List Property
              </button>
            </div>

            <div className='grid grid-cols-2 gap-[10px]'>
              <button
                onClick={handleSubmit}
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
        </div>
        <div
          className='flex-1 overflow-y-auto'
          style={{ maxHeight: 'calc(100dvh - 180px)', marginBottom: '20px' }}>
          {selectedMarketPlace && renderBrief(onSelectBrief)}
        </div>
      </div>
      <AnimatePresence>
        {isFilterModalOpened && (
          <Filter
            setPayloadFromFilter={setPayloadFromFilter}
            closeModal={setIsFilterModalOpened}
          />
        )}
      </AnimatePresence>

      <MobileSelectedBottomBar
        selectedBriefs={selectedBriefs}
        selectedBriefsList={Array.from(selectedBriefsList)}
        onViewBrief={() => {
          console.log('View Briefs', selectedBriefsList);
        }}
        onSubmitForInspection={() => {
          onSubmitForInspection(selectedBriefsList);
        }}
      />
    </Fragment>
  );
};

export default Mobile;
