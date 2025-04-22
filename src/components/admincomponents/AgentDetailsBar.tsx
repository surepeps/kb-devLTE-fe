/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { GET_REQUEST, POST_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import Loading from '@/components/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClose,
  faDownload,
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons';
import { downloadImage } from '@/utils/downloadImage';
import { archivo, ubuntu } from '@/styles/font';
import Toggle from '../toggle';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Select from 'react-select';
import customStyles from '@/styles/inputStyle';
import filterIcon from '@/svgs/filterIcon.svg';
import Cookies from 'js-cookie';

type TableProps = {
  id: string;
  location: {
    state: string;
    lga: string;
    area: string;
  };
  landSize: string;
  amount: number;
  documents: { docName: string }[];
};

export default function AgentDetailsBar({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TableProps[]>(dummyTableData);
  const [agentBrief, setAgentBrief] = useState<TableProps[]>(dummyTableData);
  const [isLoadingDetails, setIsLoadingDetails] = useState({
    isLoading: false,
    message: '',
  });
  const [isAgentInactive, setIsAgentInactive] = useState(!user?.isInActive); // Set active if isInActive is false

  const closeModal = () => {
    setSelectedImage(null);
    setIsLoading(false);
  };

  useEffect(() => {
    // console.log('User details' + user);

    const getAgentBrief = async (agentId: string) => {
      setIsLoadingDetails({
        isLoading: true,
        message: 'Loading...',
      });
      try {
        const response = await GET_REQUEST(
          `${URLS.BASE}/admin/agent/${agentId}/properties?page=1&limit=10`,
          Cookies.get('token')
        );
  
        if (response?.success === false) {
          toast.error('Failed to get data');
          return setIsLoadingDetails({
            isLoading: false,
            message: 'Failed to get data',
          });
        }
  
        const data = response.properties?.data || [];
        // console.log('Agent brief data:', data);
        setIsLoadingDetails({
          isLoading: false,
          message: 'Data Loaded',
        });
        setAgentBrief(data);
      } catch (error: any) {
        setIsLoadingDetails({
          isLoading: false,
          message: 'Failed to get data',
        });
      } finally {
        setIsLoadingDetails({
          isLoading: false,
          message: '',
        });
      }
    };

    getAgentBrief(user?.id);
  }, [user]);

  const activateAgent = async (agentId?: string) => {
    try {
      const url = URLS.BASE + URLS.deActivateAccount;

      const payload = {
        agentId: agentId || '',
        inActiveSatatus: isAgentInactive,
        reason: !isAgentInactive ? 'Agent is now active' : 'Agent is not active',
      };

      // console.log('Payload:', payload);

      await toast.promise(
        POST_REQUEST(url, payload).then((response) => {
          if ((response as any).success) {
            toast.success(
              !isAgentInactive
                ? 'Agent activated successfully'
                : 'Agent deactivated successfully'
            );
            setIsAgentInactive(!isAgentInactive); // Update the state
            return !isAgentInactive
              ? 'Agent activated successfully'
              : 'Agent deactivated successfully';
          } else {
            const errorMessage = (response as any).error || 'Action failed';
            toast.error(errorMessage);
            throw new Error(errorMessage);
          }
        }),
        {
          loading: !isAgentInactive ? 'Activating ...' : 'Deactivating ...',
        }
      );
    } catch (error) {
      // console.error(error);
      toast.error('An error occurred, please try again');
    }
  };

  const handleImageClick = (docImg: string, docName: string) => {
    setIsLoading(true);
    setSelectedImage({
      image: docImg,
      name: docName,
    });
  };

  const [selectedTab, setSelectedTab] = useState<string>('Total transaction');

  return (
    <div className='fixed top-0 right-0 h-full lg:w-[837px] w-[90%] bg-white shadow-lg z-50 p-[40px]'>
      <div className='w-full flex flex-col gap-[20px]'>
        {/**Close Modal Section */}
        <div className='w-full flex items-center'>
          <button
            title='Close'
            onClick={onClose}
            type='button'
            className='w-[41px] h-[41px] cursor-pointer rounded-full bg-gray-100 flex justify-center items-center'>
            {' '}
            <FontAwesomeIcon icon={faClose} size='xl' />
          </button>
        </div>
        {/**User */}
        <div className='min-h-[64px] w-full flex flex-wrap gap-[10px] items-center justify-between'>
          <div className='flex md:flex-row flex-col items-start md:items-center gap-[14px]'>
            {/**Image user section */}
            <div
              className={`w-16 h-16 bg-[#CDA4FF] rounded-full flex items-center justify-center text-xl font-bold text-[#181336] ${archivo.className}`}>
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt='Profile'
                  className='w-16 h-16 rounded-full object-cover'
                />
              ) : user?.legalName ? (
                user.legalName
                  .split(' ')
                  .map((name: string) => name[0])
                  .join('')
                  .toUpperCase()
              ) : user?.firstName && user?.lastName ? (
                `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
              ) : user?.fullName ? (
                user.fullName
                  .split(' ')
                  .map((name: string) => name[0])
                  .join('')
                  .toUpperCase()
              ) : (
                '-'
              )}
            </div>
            {/**Name and other details */}
            <div className='flex flex-col'>
              <div className='flex gap-2'>
                <h2
                  className={`text-[#000000] font-bold text-lg ${ubuntu.className}`}>
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.fullName || '--'}
                </h2>{' '}
                <span
                  className={`text-[#000000] font-bold text-lg ${ubuntu.className}`}>
                  /
                </span>
                <span
                  className={`text-[#45D884] font-bold text-lg ${ubuntu.className}`}>
                  {user?.agentType}
                </span>
              </div>
              {/**Referrer */}
              <div className='flex gap-1'>
                <span
                  className={`text-[#707281] text-sm font-semibold ${ubuntu.className}`}>
                  Referrer:
                </span>
                {/**Referrer Name */}
                <span
                  className={`text-sm text-[#000000] font-semibold underline`}>
                  {user?.referralName ? user?.referralName : '-----'}
                </span>
              </div>
            </div>
          </div>
          <div className='flex gap-[15px]'>
            <Toggle
              name={isAgentInactive ? 'Deactivate Agent' : 'Activate Agent'}
              onClick={() => activateAgent(user?.id)}
              isActive={isAgentInactive}
            />
            <Toggle name='Flag Agent' onClick={() => {}} />
          </div>
        </div>
        {/**Box Notifications */}
        <div className='w-full flex gap-[15px] overflow-x-auto hide-scrollbar border-t-[1px] pt-[10px] border-[#CFD0D5]'>
          {BoxData.map((item, idx: number) => (
            <BoxNotification {...item} key={idx} />
          ))}
        </div>
        {/**Tabs to select */}
        <div className='h-[34px] border-b-[1px] border-[#B8C9C9] flex gap-[25px] overflow-x-auto hide-scrollbar items-center'>
          {[
            'Total transaction',
            'Agent referred',
            'Briefs',
            'Notification',
            'Details',
          ].map((tab: string, idx: number) => (
            <span
              onClick={() => {
                setSelectedTab(tab);
              }}
              className={`cursor-pointer shrink-0 border- ${
                archivo.className
              } text-base ${
                selectedTab === tab
                  ? 'font-bold underline text-[#181336] underline-offset-8 decoration-[#8DDB90] decoration-[3px]'
                  : 'font-normal text-[#515B6F]'
              }`}
              key={idx}>
              {tab}
            </span>
          ))}
        </div>
        {/**Table */}
        <div>
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className='p-4 border rounded-md bg-white w-full mr-2 overflow-hidden md:overflow-x-auto'>
            <h3 className='text-[#2E2C34] text-xl font-semibold py-2'>
              {selectedTab}
            </h3>
            <div className='flex md:flex-row flex-col gap-2 justify-between'>
              <Select
                className='text-[#2E2C34] text-sm ml-1'
                styles={customStyles}
                options={statsOptions}
                defaultValue={statsOptions}
                // value={formik.values.selectedStat}
                // onChange={(options) => {
                //   formik.setFieldValue('selectedStat', options);
                // }}
              />
              <div className='flex md:w-[initial] w-fit gap-3 cursor-pointer border px-3 justify-center items-center rounded-md h-[40px] md:h-[initial]'>
                <Image
                  src={filterIcon}
                  alt='filter icon'
                  width={24}
                  height={24}
                  className='w-[24px] h-[24px]'
                />
                <span className='text-[#2E2C34]'>Filter</span>
              </div>
            </div>
            <div className='w-full min-h-fit overflow-y-auto mt-6'>
              <table className='min-w-[900px] md:w-full border-collapse'>
                <thead className='bg-[#fafafa] text-left text-sm font-medium text-gray-600'>
                  <tr className='border-b'>
                    <th className='p-3'>
                      <input title='checkbox' type='checkbox' />
                    </th>
                    <th className='p-3'>ID</th>
                    <th className='p-3'>Location</th>
                    <th className='p-3'>Land Size</th>
                    <th className='p-3'>Amount</th>
                    <th className='p-3'>Documents</th>
                    <th className='p-3'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item: TableProps, idx: number) => (
                    <tr key={idx}>
                      <td className='p-3'>
                        <input title='checkbox' type='checkbox' />
                      </td>
                      <td className='p-3'>{item.id}</td>
                      <td className='p-3'>
                        {item.location.state.split(' ')[0]},{item.location.lga}
                      </td>
                      <td className='p-3'>{item.landSize}</td>
                      <td className='p-3'>
                        N{Number(item.amount).toLocaleString()}
                      </td>
                      <td className='p-3 text-ellipsis'>
                        {item.documents.map(({ docName }) => docName)}
                      </td>
                      <FontAwesomeIcon
                        icon={faEllipsis}
                        width={24}
                        height={24}
                        title={'See full details'}
                        className='w-[24px] h-[24px] cursor-pointer'
                        color={'#181336'}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

type BoxNotificationProps = {
  heading: string;
  amount: number;
};

const BoxNotification: React.FC<BoxNotificationProps> = ({
  heading,
  amount,
}) => {
  return (
    <div className='w-[178px] h-[79px] shrink-0 flex flex-col gap-[7px] p-[13px] bg-[#FAFAFA]'>
      <p className={`text-[#515B6F] text-sm ${archivo.className}`}>{heading}</p>
      <h3
        className={`font-semibold text-[#000000] ${archivo.className} text-base`}>
        {heading.includes('Close') ? '₦ ' : null}
        {Number(amount).toLocaleString()}
      </h3>
    </div>
  );
};

const BoxData: BoxNotificationProps[] = [
  {
    heading: 'Total Transaction Close',
    amount: 0,
  },
  {
    heading: 'Total Profit',
    amount: 0,
  },
  {
    heading: 'Total Briefs',
    amount: 0,
  },
  {
    heading: 'Total Referred',
    amount: 0,
  },
];

const headerData: string[] = [
  'Date',
  'Property Type',
  'Location',
  'Property price',
  'Document',
  'Full details',
];

const statsOptions = [
  { value: '1', label: 'Individual' },
  { value: '2', label: 'Incoporated' },
];

const dummyTableData: TableProps[] = [
  {
    id: 'KA4556',
    location: {
      state: 'Lagos state',
      lga: 'Kosofe',
      area: 'oworoshoki',
    },
    landSize: '5000ms',
    amount: 300000000,
    documents: [
      {
        docName: 'C of O',
      },
      {
        docName: 'Government Consent',
      },
    ],
  },
  {
    id: 'KB4852',
    location: {
      state: 'Lagos state',
      lga: 'Agege',
      area: 'ifaki',
    },
    landSize: '8000ms',
    amount: 23545890000,
    documents: [
      {
        docName: 'C of O',
      },
      {
        docName: 'Government Consent',
      },
    ],
  },
];
