/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { POST_REQUEST } from '@/utils/requests';
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
  //const [isActive, setIsActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TableProps[]>(dummyTableData);

  const closeModal = () => {
    setSelectedImage(null);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('User details' + user);
  }, [user]);

  const onSubmit = async (
    status?: boolean,
    propertyId?: string,
    briefType?: string
  ) => {
    try {
      const isBrief = !!user?.legalName; // Determine if it's a brief based on legalName
      const url = isBrief
        ? URLS.BASE + URLS.approveBrief // Use approveBrief URL for briefs
        : URLS.BASE + URLS.agentApproval; // Use agentApproval URL for agents

      const payload = isBrief
        ? {
            propertyId: propertyId || user?.propertyId || '',
            propertyType: briefType || user?.briefType || '',
            status,
          }
        : {
            agentId: user?.id || '',
            approved: true,
          };

      await toast.promise(
        POST_REQUEST(url, payload).then((response) => {
          if ((response as any).success) {
            toast.success(
              isBrief
                ? status
                  ? 'Brief approved successfully'
                  : 'Brief rejected successfully'
                : 'Agent approved successfully'
            );
            window.location.href = '/admin';
            return isBrief
              ? status
                ? 'Brief approved successfully'
                : 'Brief rejected successfully'
              : 'Agent approved successfully';
          } else {
            const errorMessage = (response as any).error || 'Approval failed';
            toast.error(errorMessage);
            throw new Error(errorMessage);
          }
        }),
        {
          loading: isBrief
            ? status
              ? 'Approving brief...'
              : 'Rejecting brief...'
            : 'Submitting approval...',
        }
      );
    } catch (error) {
      console.error(error);
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
                  {user.firstName} {user.lastName}
                </h2>{' '}
                <span
                  className={`text-[#000000] font-bold text-lg ${ubuntu.className}`}>
                  /
                </span>
                <span
                  className={`text-[#45D884] font-bold text-lg ${ubuntu.className}`}>
                  incorporated
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
                  John Doe
                </span>
              </div>
            </div>
          </div>
          <div className='flex gap-[15px]'>
            <Toggle name='Deactivate Agent' onClick={() => {}} />
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
      {/* {isLoading && <Loading />}
      {selectedImage && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='relative bg-white p-4 rounded-lg w-[60%] h-[50%] overflow-auto my-auto hide-scrollbar'>
            <button
              type='button'
              onClick={closeModal}
              className='absolute top-2 right-2 text-black hover:bg-gray-300 p-2 rounded-full'>
              <FaTimes size={20} />
              {''}
            </button>
            <img
              src={selectedImage.image}
              alt='Document'
              className='max-w-[80%] h-[90%] max-h-screen mx-auto my-auto'
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                toast.error('Failed to load image');
              }}
            />
            <div className='flex items-center mb-[20px]'>
              <button
                title='Download'
                type='button'
                onClick={() => {
                  downloadImage(selectedImage.image, selectedImage.name);
                }}
                className='flex items-center gap-2 rounded-[5px] bg-gray-100 hover:bg-gray-200 px-2 py-[2px] border-[1px] border-gray-200'>
                <span>Download</span>
                <FontAwesomeIcon icon={faDownload} size='sm' />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='h-full flex flex-col'>
        <button
          type='button'
          onClick={onClose}
          className='absolute top-4 left-4 text-black hover:bg-gray-300 p-2 rounded-full'>
          <FaTimes size={25} />
          {''}
        </button>

        <div className='h-full overflow-y-auto py-14 px-10'>
          <div className='bg-[#FAFAFA] p-6 flex flex-col items-center justify-center gap-4'>
            <div className='w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white'>
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt='Profile'
                  className='w-full h-full rounded-full object-cover'
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
            <div className='text-center'>
              <p className='text-2xl md:text-xl sm:text-lg font-semibold'>
                {user?.legalName
                  ? user.legalName
                  : user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.fullName && !(user?.firstName && user?.lastName)
                  ? user.fullName
                  : '-'}
              </p>
              <p
                className={`text-lg md:text-base sm:text-sm font-semibold ${
                  user?.agentType === 'individual'
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}>
                {user?.agentType || '--'}
              </p>
              <p className='text-sm md:text-xs sm:text-[10px] text-gray-600'>
                {user?.email || 'N/A'}
              </p>
            </div>
          </div>

          <div className='h-4'></div>

          <div className='bg-[#FAFAFA] p-5'>
            <div className='space-y-4'>
              {user?.createdAt && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Date:</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {user?.email && user.email !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Email:</span>
                  <span>{user.email}</span>
                </div>
              )}
              {user?.address?.street &&
                user?.address?.localGovtArea &&
                user?.address?.state && (
                  <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                    <span className='font-normal'>Address:</span>
                    <span>{`${user.address.street}, ${user.address.localGovtArea}, ${user.address.state}`}</span>
                  </div>
                )}
              {user?.regionOfOperation?.length > 0 && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Areas of Operation:</span>
                  <span>{user.regionOfOperation.join(', ')}</span>
                </div>
              )}
              {user?.referral && user.referral !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Referral:</span>
                  <span>{user.referral}</span>
                </div>
              )}
              {user?.agentType && user.agentType !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Type of Agent:</span>
                  <span>{user.agentType}</span>
                </div>
              )}
              {user?.agentType?.toLowerCase() === 'incorporated' && (
                <>
                  {user?.companyName && user.companyName !== '--' && (
                    <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                      <span className='font-normal'>Company Name:</span>
                      <span>{user.companyName}</span>
                    </div>
                  )}
                  {user?.registrationNumber &&
                    user.registrationNumber !== '--' && (
                      <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                        <span className='font-normal'>
                          Registration Number:
                        </span>
                        <span>{user.registrationNumber}</span>
                      </div>
                    )}
                </>
              )}
              {user?.meansOfId?.length > 0 && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Documents:</span>
                  <span className='space-x-2'>
                    {user.meansOfId.map((doc: any, index: number) => (
                      <a
                        key={index}
                        href='#'
                        onClick={(e) => {
                          e.preventDefault();
                          handleImageClick(
                            doc?.docImg?.[0] || '',
                            doc?.name || ''
                          );
                        }}
                        className='text-blue-500 underline'>
                        {doc?.name || 'N/A'}
                      </a>
                    ))}
                  </span>
                </div>
              )}
              {user?.location && user.location !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Location:</span>
                  <span>{user.location}</span>
                </div>
              )}
              {user?.propertyType && user.propertyType !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Property Type:</span>
                  <span>{user.propertyType}</span>
                </div>
              )}
              {user?.propertyCondition && user.propertyCondition !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Property Condition:</span>
                  <span>{user.propertyCondition}</span>
                </div>
              )}
              {user?.price && user.price !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Price:</span>
                  <span>{user.price}</span>
                </div>
              )}
              {user?.usageOptions?.trim() && user.usageOptions !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Usage Options:</span>
                  <span>{user.usageOptions}</span>
                </div>
              )}
              {user?.noOfBedrooms && user.noOfBedrooms !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Number of Bedrooms:</span>
                  <span>{user.noOfBedrooms}</span>
                </div>
              )}
              {user?.features && user.features !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Desired Features:</span>
                  <span>{user.features}</span>
                </div>
              )}
              {user?.tenantCriteria && user.tenantCriteria !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Tenant Criteria:</span>
                  <span>{user.tenantCriteria}</span>
                </div>
              )}
              {user?.documents && user.documents !== '--' && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Documents:</span>
                  <span>{user.documents}</span>
                </div>
              )}
              {user?.pictures?.length > 0 && (
                <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                  <span className='font-normal'>Pictures:</span>
                  <span>
                    {user.pictures.map((pic: string, index: number) => (
                      <a
                        key={index}
                        href='#'
                        onClick={(e) => {
                          e.preventDefault();
                          handleImageClick(pic, `Picture ${index + 1}`);
                        }}
                        className='text-blue-500 underline'>
                        Picture {index + 1}
                      </a>
                    ))}
                  </span>
                </div>
              )}
            </div>
            <hr className='my-4' />

            {user?.legalName && (
              <div className='flex justify-between text-base md:text-sm sm:text-xs'>
                <span className='font-normal'>Awaiting Confirmation</span>
                <span
                  className={`flex items-center gap-2 font-semibold ${
                    user?.isApproved ? 'text-green-500' : 'text-red-500'
                  }`}>
                  {user?.isApproved ? 'Approved' : 'Pending'}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user?.isApproved ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                </span>
              </div>
            )}

            <div className='mt-14'>
              {user?.legalName ? (
                <>
                  <button
                    onClick={() =>
                      onSubmit(true, user?.propertyId, user?.briefType)
                    }
                    disabled={user?.isApproved}
                    className={`w-full py-4 text-base md:text-sm sm:text-xs transition duration-300 mb-2 ${
                      user?.isApproved
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#8DDB90] text-white hover:bg-green-900'
                    }`}>
                    Approve Brief
                  </button>
                  <div className='flex gap-4'>
                    <button
                      onClick={() => onSubmit(false)}
                      disabled={user?.isRejected}
                      className={`w-full py-4 text-base md:text-sm sm:text-xs transition duration-300 border-2 ${
                        user?.isRejected
                          ? 'border-red-300 text-red-300 cursor-not-allowed'
                          : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                      }`}>
                      Reject Brief
                    </button>
                    <button
                      onClick={() => {}}
                      disabled={user?.isApproved}
                      className={`w-full py-4 text-base md:text-sm sm:text-xs transition duration-300 border-2 border-[#1976D2] text-[#1976D2] hover:bg-blue-900 hover:text-white`}>
                      Edit Brief
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={
                    !user?.accountApproved ? () => onSubmit() : undefined
                  }
                  disabled={false}
                  className={`w-full py-4 text-base md:text-sm sm:text-xs bg-white border ${
                    user?.accountApproved
                      ? 'border-gray-500 text-gray-500'
                      : 'border-green-500 text-green-500'
                  } rounded-md ${
                    user?.accountApproved
                      ? 'cursor-not-allowed'
                      : 'hover:bg-green-500 hover:text-white'
                  } transition duration-300`}>
                  {user?.accountApproved ? 'Agent Approved' : 'Approve Agent'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div> */}
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
    amount: 500000000,
  },
  {
    heading: 'Total Profit',
    amount: 25000000,
  },
  {
    heading: 'Total Briefs',
    amount: 30,
  },
  {
    heading: 'Total Referred',
    amount: 200,
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
