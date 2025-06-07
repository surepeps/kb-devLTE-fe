/** @format */

'use client';
import { archivo, epilogue } from '@/styles/font';
import {
  faArrowDown,
  faArrowLeft,
  faArrowUp,
  faEllipsis,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import Select, { SingleValue } from 'react-select';
import customStyles from '@/styles/inputStyle';
import Image from 'next/image';
import filterIcon from '@/svgs/filterIcon.svg';
import useClickOutside from '@/hooks/clickOutside';

type PreferenceManagementProps = {};
const PreferenceManagement: React.FC<PreferenceManagementProps> = ({}) => {
  const [selectedTable, setSelectedTable] = useState<string>('Buyer');
  const [pageStatus, setPageStatus] = useState<'home' | 'is edit' | 'is view'>(
    'home'
  );
  const [trackNav, setTrackNav] = useState<string[] | null>(null);

  const Home = ({
    pageStatus,
    setPageStatus,
    setTracker,
    tracker,
  }: {
    pageStatus: 'home' | 'is edit' | 'is view';
    setPageStatus: (type: 'home' | 'is edit' | 'is view') => void;
    tracker?: string[] | null;
    setTracker: (type: string[] | null) => void;
  }): React.JSX.Element => {
    return (
      <aside className='w-full flex flex-col gap-[35px]'>
        <div className='min-h-[64px] w-full flex md:flex-row flex-col items-start justify-between md:items-center gap-[20px]'>
          <div className='flex flex-col gap-[4px]'>
            <h2
              className={`${archivo.className} text-3xl font-semibold text-dark`}>
              Preference Management
            </h2>
            <span
              className={`${archivo.className} text-sm font-normal text-gray-400`}>
              Showing your Account metrics for July 19, 2021 - July 25, 2021
            </span>
          </div>
          <button
            type='button'
            className='h-[50px] w-[163px] bg-[#8DDB90] rounded-[5px] flex justify-center items-center gap-2'>
            <FontAwesomeIcon
              icon={faPlus}
              width={24}
              height={24}
              className='w-[24px] h-[24px]'
              color='white'
            />
            <span
              className={`text-base ${archivo.className} font-bold text-white`}>
              Send invite
            </span>
          </button>
        </div>

        <div className='flex gap-[30px] overflow-x-auto hide-scrollbar whitespace-nowrap'>
          <Rectangle
            heading='Buyer Preference'
            headerStyling={{ color: '#0B423D' }}
            value={3000}
            status={{
              position: 'fallen',
              percentage: 5.7,
            }}
          />
          <Rectangle
            heading='Tenant Preference'
            value={30000}
            status={{
              position: 'fallen',
              percentage: 5.7,
            }}
          />
          <Rectangle
            heading='Developer Contact'
            value={4}
            status={{
              position: 'fallen',
              percentage: 5.7,
            }}
          />
        </div>

        <div className='flex gap-[45px] h-[37px] border-b-[1px] border-[#D6DDEB]'>
          {['Buyer', 'Tenant', 'Developer'].map((item: string) => {
            const isSelected = selectedTable === item;

            return (
              <motion.span
                key={item}
                onClick={() => {
                  setSelectedTable(item);
                }}
                className={`relative px-2 cursor-pointer text-base ${
                  archivo.className
                } ${
                  isSelected
                    ? 'text-[#181336] font-semibold'
                    : 'text-[#515B6F] font-normal'
                }`}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                {item}
                {isSelected && (
                  <motion.div
                    layoutId='underline'
                    className='absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#8DDB90]'
                  />
                )}
              </motion.span>
            );
          })}
        </div>

        <div className='w-full'>
          <Table
            tracker={tracker}
            setTracker={setTrackNav}
            pageStatus={pageStatus}
            setPageStatus={setPageStatus}
            data={dummyData}
            heading={selectedTable}
          />
        </div>
      </aside>
    );
  };

  const renderContentDynamically = (): React.JSX.Element => {
    switch (pageStatus) {
      case 'home':
        return (
          <Home
            setTracker={setTrackNav}
            pageStatus={pageStatus}
            setPageStatus={setPageStatus}
          />
        );
      case 'is edit':
        return <Details setPageStatus={setPageStatus} navHeading={trackNav} />;
      case 'is view':
        return <Details setPageStatus={setPageStatus} navHeading={trackNav} />;
      default:
        return <></>;
    }
  };
  return <Fragment>{pageStatus && renderContentDynamically()}</Fragment>;
};

type RectangleProps = {
  heading: string;
  headerStyling?: React.CSSProperties;
  value: number;
  valueStyling?: React.CSSProperties;
  status?: {
    percentage: number;
    position: 'risen' | 'fallen';
  };
};

const Rectangle = ({
  heading,
  headerStyling,
  value,
  valueStyling,
  status,
}: RectangleProps): React.JSX.Element => {
  return (
    <div className='w-[356px] h-[127px] shrink-0 flex flex-col gap-[35px] justify-center px-[25px] bg-[#FFFFFF] border-[1px] border-[#E4DFDF] rounded-[4px]'>
      <h3
        style={headerStyling}
        className={`text-base font-medium ${archivo.className}`}>
        {heading}
      </h3>
      <div className='flex justify-between items-center'>
        <h2
          style={valueStyling}
          className={`${archivo.className} text-3xl font-semibold`}>
          {Number(value).toLocaleString()}
        </h2>
        {status ? (
          <div className='flex gap-[4px]'>
            <FontAwesomeIcon
              style={
                status.position === 'fallen'
                  ? { color: '#DA1010', transform: 'rotate(30deg)' }
                  : { color: 'green' }
              }
              width={17}
              height={17}
              className='w-[17px] h-[17px]'
              icon={status.position === 'risen' ? faArrowUp : faArrowDown}
            />
            <span className='text-sm text-black font-archivo'>
              {status.percentage}%
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

type PropertyListing = {
  id: string;
  name: string;
  listingType: 'Rent' | 'Sale' | 'Lease';
  propertyType: string;
  location: {
    state: string;
    lga: string;
    area: string;
  };
  priceRange: string;
};

type DataTable = PropertyListing[];

const dummyData: DataTable = [
  {
    id: 'KA4556',
    name: 'Cozy Family Apartment',
    listingType: 'Rent',
    propertyType: 'Apartment',
    location: {
      state: 'Lagos',
      lga: 'Ikeja',
      area: 'Magodo',
    },
    priceRange: '₦500,000 - ₦700,000',
  },
  {
    id: 'KA4556',
    name: 'Spacious 3 Bedroom Duplex',
    listingType: 'Sale',
    propertyType: 'Duplex',
    location: {
      state: 'Abuja',
      lga: 'Garki',
      area: 'Phase 2',
    },
    priceRange: '₦45,000,000 - ₦50,000,000',
  },
  {
    id: 'KA4556',
    name: 'Commercial Office Space',
    listingType: 'Lease',
    propertyType: 'Office',
    location: {
      state: 'Rivers',
      lga: 'Port Harcourt',
      area: 'GRA',
    },
    priceRange: '₦2,000,000 per annum',
  },
  {
    id: 'KA4556',
    name: 'Modern Studio Apartment',
    listingType: 'Rent',
    propertyType: 'Studio',
    location: {
      state: 'Ogun',
      lga: 'Abeokuta South',
      area: 'Idi-Aba',
    },
    priceRange: '₦250,000 - ₦400,000',
  },
  {
    id: 'KA4556',
    name: 'Luxury 5 Bedroom Mansion',
    listingType: 'Sale',
    propertyType: 'Mansion',
    location: {
      state: 'Lagos',
      lga: 'Lekki',
      area: 'Chevron',
    },
    priceRange: '₦250,000,000 - ₦300,000,000',
  },
  {
    id: 'KA4556',
    name: 'Modern Studio Apartment',
    listingType: 'Rent',
    propertyType: 'Studio',
    location: {
      state: 'Ogun',
      lga: 'Abeokuta South',
      area: 'Idi-Aba',
    },
    priceRange: '₦250,000 - ₦400,000',
  },
  {
    id: 'KA4556',
    name: 'Luxury 5 Bedroom Mansion',
    listingType: 'Sale',
    propertyType: 'Mansion',
    location: {
      state: 'Lagos',
      lga: 'Lekki',
      area: 'Chevron',
    },
    priceRange: '₦250,000,000 - ₦300,000,000',
  },
  {
    id: 'KA4556',
    name: 'Modern Studio Apartment',
    listingType: 'Rent',
    propertyType: 'Studio',
    location: {
      state: 'Ogun',
      lga: 'Abeokuta South',
      area: 'Idi-Aba',
    },
    priceRange: '₦250,000 - ₦400,000',
  },
  {
    id: 'KA4556',
    name: 'Luxury 5 Bedroom Mansion',
    listingType: 'Sale',
    propertyType: 'Mansion',
    location: {
      state: 'Lagos',
      lga: 'Lekki',
      area: 'Chevron',
    },
    priceRange: '₦250,000,000 - ₦300,000,000',
  },
];

type TableProps = {
  heading: string;
  data: DataTable;
  pageStatus: 'home' | 'is edit' | 'is view';
  setPageStatus: (type: 'home' | 'is edit' | 'is view') => void;
  tracker?: string[] | null;
  setTracker: (type: string[] | null) => void;
};
const Table = ({
  heading,
  data,
  pageStatus,
  setPageStatus,
  setTracker,
}: TableProps) => {
  const controls = useAnimation();
  const [originalData, setOriginalData] = useState(data);
  const [stateData, parsedStateData] = useState<DataTable>(data);
  const [isActionModalClicked, setIsActionModalClicked] =
    useState<boolean>(false);
  const [rowSelected, setRowSelected] = useState<string | number | null>(null);

  type propertyType = 'Rent' | 'Lease' | 'Sale' | 'All';

  const filterBy = (type: propertyType) => {
    if (type === 'All') {
      return parsedStateData(originalData);
    } else {
      const filteredStateData = originalData.filter(
        (item) => item.listingType === type
      );
      parsedStateData(filteredStateData);
      console.log(type);
    }
  };

  useEffect(() => {
    controls.start({
      x: [30, 0],
      opacity: [0, 1],
      transition: { duration: 0.4, ease: 'easeOut' },
    });
  }, [heading]);
  return (
    <div className='w-full bg-white border-[1px] border-[#E4DFDF] rounded-[4px] flex flex-col gap-[39px] overflow-hidden items-start justify-start py-[30px] px-[32px]'>
      <AnimatePresence>
        <motion.h2
          animate={controls}
          className='text-xl font-semibold text-[#181336]'>
          {heading}
        </motion.h2>
      </AnimatePresence>
      <div className='min-h-[400px] w-full flex flex-col gap-[15px]'>
        <div className='h-[50px] flex justify-between items-center'>
          <Select
            className='w-[160px]'
            styles={customStyles}
            onChange={(
              event: SingleValue<{
                value: string;
                label: string;
              }>
            ) => {
              filterBy(event?.label as propertyType);
            }}
            options={[
              { value: 'Rent', label: 'Rent' },
              { value: 'Sale', label: 'Sale' },
              { value: 'Lease', label: 'Lease' },
              { value: 'All', label: 'All' },
            ]}
          />

          <div className='flex gap-4 w-[96px] items-center justify-center rounded-[5px] border-[1px] border-gray-300 h-[50px]'>
            <Image
              alt='filter'
              width={24}
              height={24}
              src={filterIcon}
              className='w-[24px] h-[24px]'
            />
            <h3 className={`text-base font-medium ${archivo.className}`}>
              filter
            </h3>
          </div>
        </div>
        <div className='overflow-x-auto hide-scrollbar w-full'>
          <table className='min-w-[1000px] max-w-full divide-y divide-gray-200 text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-2 text-left font-medium text-gray-700 flex items-center gap-2'>
                  <input
                    type='checkbox'
                    name='check'
                    id='check'
                    title='check'
                  />{' '}
                  ID
                </th>
                <th className='px-4 py-2 text-left font-medium text-gray-700'>
                  Name
                </th>
                <th className='px-4 py-2 text-left font-medium text-gray-700'>
                  Listing Type
                </th>
                <th className='px-4 py-2 text-left font-medium text-gray-700'>
                  Property Type
                </th>
                <th className='px-4 py-2 text-left font-medium text-gray-700'>
                  Location
                </th>
                <th className='px-4 py-2 text-left font-medium text-gray-700'>
                  Price Range
                </th>
                <th className='px-4 py-2 text-left font-medium text-gray-700'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {stateData.map((item, idx: number) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 ${archivo.className}`}>
                  <td className='px-4 py-2 font-archivo flex gap-2 items-center'>
                    <input
                      type='checkbox'
                      name='check'
                      id='check'
                      title='check'
                    />{' '}
                    {item.id}
                  </td>
                  <td className='px-4 py-2 font-archivo'>{item.name}</td>
                  <td className='px-4 py-2 font-archivo'>
                    <span
                      className={`inline-block px-2 py-1 rounded text-black text-xs font-semibold font-archivo`}>
                      {item.listingType}
                    </span>
                  </td>
                  <td className='px-4 py-2 font-archivo'>
                    {item.propertyType}
                  </td>
                  <td className='px-4 py-2 font-archivo'>
                    <div className='text-xs text-gray-700'>
                      <div className='font-archivo'>{item.location.state}</div>
                      {/* <div>
                      {item.location.lga}, {item.location.state}
                    </div> */}
                    </div>
                  </td>
                  <td className='px-4 py-2 font-medium text-gray-900 font-archivo'>
                    {item.priceRange}
                  </td>
                  <td className='px-4 py-2 font-medium text-gray-900 font-archivo'>
                    <div className='flex flex-col items-center justify-center gap-[5px]'>
                      <FontAwesomeIcon
                        onClick={() => {
                          setRowSelected(idx);
                          //setIsActionModalClicked(true);
                        }}
                        icon={faEllipsis}
                        width={24}
                        height={24}
                        color='#181336'
                        className='w-[24px] h-[24px] cursor-pointer'
                      />
                      {rowSelected !== null && rowSelected === idx && (
                        <ToggleBox
                          editDetails={() => {
                            setPageStatus('is edit');
                            setTracker([heading]);
                          }}
                          viewDetails={() => {
                            setPageStatus('is view');
                            setTracker([heading]);
                          }}
                          deleteDetails={() => {}}
                          setCloseModal={setRowSelected}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

type ToggleBoxProps = {
  setCloseModal: (type: string | null | number) => void;
  editDetails: () => void;
  viewDetails: () => void;
  deleteDetails: () => void;
};

const ToggleBox: React.FC<ToggleBoxProps> = ({
  setCloseModal,
  editDetails,
  viewDetails,
  deleteDetails,
}) => {
  const toggleRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(toggleRef, () => setCloseModal(null));
  return (
    <motion.div
      ref={toggleRef}
      className='w-[127px] h-[136px] p-[20px] rounded-[5px] bg-white shadow-md flex flex-col gap-[15px] absolute mt-[200px] -ml-[200px]'
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ delay: 0.2 }}>
      <span
        onClick={viewDetails}
        className={`font-archivo text-sm text-black font-normal cursor-pointer`}>
        View details
      </span>
      <span
        onClick={editDetails}
        className={`font-archivo text-sm text-black font-normal cursor-pointer`}>
        Edit details
      </span>
      <span
        onClick={deleteDetails}
        className={`font-archivo text-sm text-black font-normal cursor-pointer`}>
        Delete details
      </span>
    </motion.div>
  );
};

type DetailsProps = {
  navHeading: string[] | null;
  setPageStatus: (type: 'home' | 'is edit' | 'is view') => void;
};

const Details = ({
  navHeading,
  setPageStatus,
}: DetailsProps): React.JSX.Element => {
  const generateRandomColor = (): string => {
    const colors = [
      'red',
      'green',
      'teal',
      'darkgoldenrod',
      'maroon',
      '#CDA4FF',
    ];
    const shuffleIndex = Math.floor(Math.random() * colors['length']);

    return colors[shuffleIndex];
  };
  return (
    <div className='flex flex-col gap-[20px] w-full'>
      <nav className='flex items-center gap-[30px]'>
        <button onClick={() => setPageStatus('home')} type='button'>
          <FontAwesomeIcon
            icon={faArrowLeft}
            width={24}
            height={24}
            color='#404040'
            className='w-[24px] h-[24px]'
            title='Back'
          />
          {''}
        </button>
        <div className='flex gap-3'>
          <span className='text-xl text-neutral-700'>
            Preference Management
          </span>
          <span className={`text-xl text-neutral-900 ${epilogue.className}`}>
            {navHeading !== null && navHeading.map((item: string) => item)}
          </span>
        </div>
      </nav>

      <div className='h-[64px] flex justify-between items-center'>
        <div className='flex gap-[14px]'>
          <div
            style={{
              background: generateRandomColor(),
            }}
            className='w-[64px] h-[64px] rounded-full flex justify-center items-center'>
            <span className='text-[#181336] font-archivo font-bold'>WA</span>
          </div>
          <div className='flex flex-col gap-2'>
            <h3>Wale Tunde</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceManagement;
