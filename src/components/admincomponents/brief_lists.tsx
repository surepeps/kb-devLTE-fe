/**
 * eslint-disable @typescript-eslint/no-unused-vars
 *
 * @format
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */
'use client';
import { Fragment, useEffect, useState, useRef } from 'react';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import filterIcon from '@/svgs/filterIcon.svg';
import Select from 'react-select';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import AgentSidebar from './AgentDetailsBar';
import BriefDetailsBar from './briefDetailsBar';
import { POST_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import Loading from '@/components/loading';
import { calculateAgentCounts } from '@/utils/agentUtils';
import { truncateId } from '@/utils/stringUtils';

interface Agent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  address: {
    street: string;
    state: string;
    localGovtArea: string;
  };
  agentType: string;
  accountStatus: string;
  isAccountVerified: boolean;
  createdAt: string;
  updatedAt: string;
  meansOfId: {
    docImg: string[];
    name: string;
  }[];
  regionOfOperation: string[];
  isInActive: boolean;
  isFlagged: boolean;
  isDeleted: boolean;
  accountApproved: boolean;
  profile_picture: string;
}

export default function BriefLists({ setBriefTotals }: { setBriefTotals: (totals: Record<string, number>) => void }) {
  const [active, setActive] = useState('Incoming Briefs');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedBrief, setSelectedBrief] = useState<any | null>(null);
  const [incomingBriefsData, setIncomingBriefsData] = useState<any[]>([]);
  const [agentsBriefsData, setAgentsBriefsData] = useState<any[]>([]);
  const [sellerBriefsData, setSellerBriefsData] = useState<any[]>([]);
  const [transactedBriefsData, setTransactedBriefsData] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState({
    isLoading: false,
    message: '',
  });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isMounted = useRef(false); // Track if the component is mounted

  const fetchIncomingBriefs = async () => {
    try {
      const payload = {
        propertyType: 'all',
        ownerType: 'PropertyOwner',
        page: currentPage,
        limit: 10,
      };
      const response = await POST_REQUEST(
        URLS.BASE + URLS.adminGetAllBriefs,
        payload
      );

      if (response?.success === false) {
        toast.error('Failed to fetch Incoming Briefs');
        return [];
      }

      const rents = response?.properties?.data?.rents || [];
      const sells = response?.properties?.data?.sells || [];

      const mappedRents = rents
        .filter((item: any) => item.isApproved === false)
        .map((item: any) => ({
          id: item._id?.slice(0, 8) || '--',
          legalName: item.owner
            ? item.owner.fullName ||
              `${item.owner.firstName || ''} ${
                item.owner.lastName || ''
              }`.trim() ||
              '--'
            : '--',
          email: item.owner?.email || '--',
          phoneNumber: item.owner?.phoneNumber || '--',
          agentType: item.owner
            ? item.owner.agentType === 'Company'
              ? 'Incorporated Agent'
              : item.owner.agentType || '--'
            : '--',
          location: item.location
            ? `${item.location.state || '--'}, ${
                item.location.localGovernment || '--'
              }`
            : '--',
          landSize:
            item.landSize && item.landSize.size !== 'N/A'
              ? `${item.landSize.size || '--'} ${
                  item.landSize.measurementType || '--'
                }`
              : '--',
          amount: item.rentalPrice
            ? `₦${item.rentalPrice.toLocaleString()}`
            : '--',
          document: '--',
          createdAt: item.createdAt || '--',
          propertyId: item._id || '--',
          briefType: 'rent',
          propertyType: item.propertyType || '--',
          isApproved: item.isApproved || false,
          isRejected: item.isRejected || false,
          usageOptions:
            Array.isArray(item.usageOptions) && item.usageOptions.length > 0
              ? item.usageOptions.join(', ')
              : '--',
          noOfBedrooms: item.noOfBedrooms || '--',
          features:
            Array.isArray(item.features) && item.features.length > 0
              ? item.features
                  .map((feature: any) => feature.featureName || '--')
                  .join(', ')
              : '--',
          tenantCriteria:
            Array.isArray(item.tenantCriteria) && item.tenantCriteria.length > 0
              ? item.tenantCriteria
                  .map(
                    (tenantCriterium: any) => tenantCriterium.criteria || '--'
                  )
                  .join(', ')
              : '--',
          propertyCondition: item.propertyCondition || '--',
          pictures:
            Array.isArray(item.pictures) && item.pictures.length > 0
              ? item.pictures
              : [],
        }));

      const mappedSells = sells
        .filter((item: any) => item.isApproved === false)
        .map((item: any) => ({
          id: item._id?.slice(0, 8) || '--',
          legalName: item.owner
            ? item.owner.fullName ||
              `${item.owner.firstName || ''} ${
                item.owner.lastName || ''
              }`.trim() ||
              '--'
            : '--',
          email: item.owner?.email || '--',
          phoneNumber: item.owner?.phoneNumber || '--',
          agentType: item.owner
            ? item.owner.agentType === 'Company'
              ? 'Incorporated Agent'
              : item.owner.agentType || '--'
            : '--',
          location: item.location
            ? `${item.location.state || '--'}, ${
                item.location.localGovernment || '--'
              }, ${item.location.area || '--'}`
            : '--',
          landSize:
            item.landSize && item.landSize.size !== 'N/A'
              ? `${item.landSize.size || '--'} ${
                  item.landSize.measurementType || '--'
                }`
              : '--',
          amount: item.price ? `₦${item.price.toLocaleString()}` : '--',
          document: item.docOnProperty?.length
            ? item.docOnProperty
                .filter((doc: any) => doc?.isProvided)
                .map((doc: any) => doc?.docName)
                .join(', ') || '--'
            : '--',
          createdAt: item.createdAt || '--',
          propertyId: item._id || '--',
          propertyType: item.propertyType || '--',
          isApproved: item.isApproved || '',
          isRejected: item.isRejected || '',
          briefType: 'sell',
          usageOptions:
            Array.isArray(item.usageOptions) && item.usageOptions.length > 0
              ? item.usageOptions.join(', ')
              : '--',
          noOfBedrooms: item.propertyFeatures.noOfBedrooms || '--',
          features:
            Array.isArray(item.propertyFeatures.additionalFeatures) &&
            item.propertyFeatures.additionalFeatures.length > 0
              ? item.propertyFeatures.additionalFeatures.join(', ')
              : '--',
          pictures:
            Array.isArray(item.pictures) && item.pictures.length > 0
              ? item.pictures
              : [],
        }));

      return [...mappedRents, ...mappedSells].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching Incoming Briefs:', error);
      return [];
    }
  };

  const fetchAgentsBriefs = async () => {
    try {
      const payload = {
        propertyType: 'sell',
        ownerType: 'Agent',
        page: currentPage,
        limit: 10,
      };

      const response = await POST_REQUEST(
        URLS.BASE + URLS.adminGetAllBriefs,
        payload
      );

      if (response?.success === false) {
        toast.error('Failed to fetch Agents Briefs');
        return [];
      }

      const briefs = response?.properties?.data || [];
      const mappedBriefs = briefs.map((item: any) => ({
        id: item._id?.slice(0, 8) || '--',
        legalName: item.owner
          ? item.owner.fullName ||
            `${item.owner.firstName || ''} ${
              item.owner.lastName || ''
            }`.trim() ||
            '--'
          : '--',
        email: item.owner?.email || '--',
        phoneNumber: item.owner?.phoneNumber || '--',
        agentType: item.owner
          ? item.owner.agentType === 'Company'
            ? 'Incorporated Agent'
            : item.owner.agentType || '--'
          : '--',
        location: item.location
          ? `${item.location.state || '--'}, ${
              item.location.localGovernment || '--'
            }, ${item.location.area || '--'}`
          : '--',
        landSize:
          item.landSize && item.landSize.size !== 'N/A'
            ? `${item.landSize.size || '--'} ${
                item.landSize.measurementType || '--'
              }`
            : '--',
        amount: item.price ? `₦${item.price.toLocaleString()}` : '--',
        document: item.docOnProperty?.length
          ? item.docOnProperty
              .filter((doc: any) => doc?.isProvided)
              .map((doc: any) => doc?.docName)
              .join(', ') || '--'
          : '--',
        createdAt: item.createdAt || '--',
        propertyId: item._id || '--',
        briefType: 'sell',
        isApproved: item.isApproved || false,
        isRejected: item.isRejected || false,
        noOfBedrooms: item.noOfBedrooms || '--',
        usageOptions:
          Array.isArray(item.usageOptions) && item.usageOptions.length > 0
            ? item.usageOptions.join(', ')
            : '--',
        features:
          Array.isArray(item.propertyFeatures.additionalFeatures) &&
          item.propertyFeatures.additionalFeatures.length > 0
            ? item.propertyFeatures.additionalFeatures.join(', ')
            : '--',
        pictures:
          Array.isArray(item.pictures) && item.pictures.length > 0
            ? item.pictures
            : [],
      }));
      return mappedBriefs.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching Agents Briefs:', error);
      return [];
    }
  };

  const fetchSellerBriefs = async () => {
    try {
      const payload = {
        propertyType: 'sell',
        ownerType: 'PropertyOwner',
        page: currentPage,
        limit: 10,
      };
      const response = await POST_REQUEST(
        URLS.BASE + URLS.adminGetAllBriefs,
        payload
      );

      if (response?.success === false) {
        toast.error('Failed to fetch Seller Briefs');
        return [];
      }

      const briefs = response?.properties?.data || [];
      const mappedBriefs = briefs.map((item: any) => ({
        id: item._id?.slice(0, 8) || '--',
        legalName: item.owner
          ? item.owner.fullName ||
            `${item.owner.firstName || ''} ${
              item.owner.lastName || ''
            }`.trim() ||
            '--'
          : '--',
        email: item.owner?.email || '--',
        phoneNumber: item.owner?.phoneNumber || '--',
        agentType:
          item.ownerModel === 'PropertyOwner'
            ? 'Property Owner'
            : item.ownerModel || '--',
        location: item.location
          ? `${item.location.state || '--'}, ${
              item.location.localGovernment || '--'
            }, ${item.location.area || '--'}`
          : '--',
        landSize:
          item.landSize && item.landSize.size !== 'N/A'
            ? `${item.landSize.size || '--'} ${
                item.landSize.measurementType || '--'
              }`
            : '--',
        amount: item.price ? `₦${item.price.toLocaleString()}` : '--',
        document: item.docOnProperty?.length
          ? item.docOnProperty
              .filter((doc: any) => doc?.isProvided)
              .map((doc: any) => doc?.docName)
              .join(', ') || '--'
          : '--',
        createdAt: item.createdAt || '--',
        propertyId: item._id || '--',
        briefType: 'sell',
        isApproved: item.isApproved || false,
        isRejected: item.isRejected || false,
        noOfBedrooms: item.propertyFeatures.noOfBedrooms || '--',
        features:
          Array.isArray(item.propertyFeatures.additionalFeatures) &&
          item.propertyFeatures.additionalFeatures.length > 0
            ? item.propertyFeatures.additionalFeatures.join(', ')
            : '--',
        usageOptions:
          Array.isArray(item.usageOptions) && item.usageOptions.length > 0
            ? item.usageOptions.join(', ')
            : '--',
        propertyType: item.propertyType || '--',
        pictures:
          Array.isArray(item.pictures) && item.pictures.length > 0
            ? item.pictures
            : [],
      }));

      return mappedBriefs.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching Seller Briefs:', error);
      return [];
    }
  };

  const fetchTransactedBriefs = async () => {
    try {
      const payload = {
        propertyType: 'all',
        ownerType: 'PropertyOwner',
        page: currentPage,
        limit: 10,
      };
      const response = await POST_REQUEST(
        URLS.BASE + URLS.adminGetAllBriefs,
        payload
      );

      if (response?.success === false) {
        toast.error('Failed to fetch Transacted Briefs');
        return [];
      }

      const rents = response?.properties?.data?.rents || [];
      const mappedRents = rents.map((item: any) => ({
        id: item._id?.slice(0, 8) || '--',
        legalName: item.owner
          ? item.owner.fullName ||
            `${item.owner.firstName || ''} ${
              item.owner.lastName || ''
            }`.trim() ||
            '--'
          : '--',
        email: item.owner?.email || '--',
        phoneNumber: item.owner?.phoneNumber || '--',
        agentType:
          item.ownerModel === 'PropertyOwner'
            ? 'Property Owner'
            : item.ownerModel || '--',
        location: item.location
          ? `${item.location.state || '--'}, ${
              item.location.localGovernment || '--'
            }`
          : '--',
        landSize:
          item.landSize && item.landSize.size !== ''
            ? `${item.landSize.size || '--'} ${
                item.landSize.measurementType || '--'
              }`
            : '--',
        amount: item.rentalPrice
          ? `₦${item.rentalPrice.toLocaleString()}`
          : '--',
        document: '--',
        createdAt: item.createdAt || '--',
        propertyId: item._id || '--',
        briefType: 'rent',
        isApproved: item.isApproved || false,
        pictures:
          Array.isArray(item.pictures) && item.pictures.length > 0
            ? item.pictures
            : [],
      }));

      return mappedRents.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching Transacted Briefs:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllBriefs = async () => {
      setIsLoading(true);
      try {
        const [incomingBriefs, agentsBriefs, sellerBriefs, transactedBriefs] = await Promise.all([
          fetchIncomingBriefs(),
          fetchAgentsBriefs(),
          fetchSellerBriefs(),
          fetchTransactedBriefs(),
        ]);

        // Avoid redundant state updates by checking if data has changed
        setIncomingBriefsData((prev) => (JSON.stringify(prev) !== JSON.stringify(incomingBriefs) ? incomingBriefs : prev));
        setAgentsBriefsData((prev) => (JSON.stringify(prev) !== JSON.stringify(agentsBriefs) ? agentsBriefs : prev));
        setSellerBriefsData((prev) => (JSON.stringify(prev) !== JSON.stringify(sellerBriefs) ? sellerBriefs : prev));
        setTransactedBriefsData((prev) => (JSON.stringify(prev) !== JSON.stringify(transactedBriefs) ? transactedBriefs : prev));

        // Calculate totals and pass them to the parent component
        const totals = {
          'Incoming Briefs': incomingBriefs.length,
          'Agents Briefs': agentsBriefs.length,
          'Sellers Briefs': sellerBriefs.length,
          'Transacted Briefs': transactedBriefs.length,
        };

        setBriefTotals(totals);
      } catch (error) {
        console.error('Error fetching briefs:', error);
        toast.error('Failed to fetch briefs');
      } finally {
        setIsLoading(false);
      }
    };

    // Prevent fetching on initial render
    if (isMounted.current) {
      fetchAllBriefs();
    } else {
      isMounted.current = true;
    }
  }, [currentPage, setBriefTotals]); // Ensure dependencies are minimal and necessary

  const handleTabClick = (tab: string) => {
    setActive(tab);
  };

  const handleActionClick = (brief: any) => {
    const briefDetails = {
      legalName: brief.legalName || '--',
      location: brief.location || '--',
      propertyType: brief.propertyType || '--',
      price: brief.amount || '--',
      usageOptions: brief.usageOptions || '--',
      documents: brief.document || '--',
      bedrooms: brief.bedrooms || '--',
      desiredFeatures: brief.desiredFeatures || '--',
      pictures: brief.pictures || [],
      createdAt: brief.createdAt || '--',
      email: brief.email || '--',
      noOfBedrooms: brief.noOfBedrooms || '--',
      additionalFeatures: brief.additionalFeatures || '--',
      agentType: brief.agentType || '--',
      features: brief.features || '--',
      propertyCondition: brief.propertyCondition || '--',
      tenantCriteria: brief.tenantCriteria || '--',
      briefType: brief.briefType || '--',
      propertyId: brief.propertyId || '--',
      isApproved: brief.isApproved || false,
      isRejected: brief.isRejected || false,
    };
    setSelectedBrief(briefDetails);
  };

  const closeSidebar = () => {
    setSelectedBrief(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage); // Update page only if it has changed
    }
  };

  const renderDynamicComponent = () => {
    let dataToRender = [];
    if (active === 'Incoming Briefs') {
      dataToRender = incomingBriefsData;
    } else if (active === 'Agents Briefs') {
      dataToRender = agentsBriefsData;
    } else if (active === 'Sellers Briefs') {
      dataToRender = sellerBriefsData;
    } else if (active === 'Transacted Briefs') {
      dataToRender = transactedBriefsData;
    }

    const tableContent = (
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className='mt-6 p-4 border rounded-md bg-white w-full lg:max-w-[1128px] px-8 mr-2 overflow-hidden md:overflow-x-auto'>
        <h3 className='text-[#2E2C34] text-xl font-semibold py-6'>{active}</h3>
        <div className='flex md:flex-row flex-col gap-2 justify-between'>
          <Select
            className='text-[#2E2C34] text-sm ml-1'
            styles={{
              control: (styles) => ({
                ...styles,
                boxShadow: 'none',
                cursor: 'pointer',
                outline: 'none',
                backgroundColor: '#F9FAFB',
                border: '1px solid #D6DDEB',
                minWidth: '160px',
              }),
            }}
            options={statsOptions}
            defaultValue={statsOptions}
            value={formik.values.selectedStat}
            onChange={(options) => {
              formik.setFieldValue('selectedStat', options);
            }}
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
        <div className='w-full overflow-x-auto md:overflow-clip mt-6'>
          <table className='min-w-[900px] md:w-full border-collapse'>
            <thead>
              <tr className='border-b bg-[#fafafa] text-center text-sm font-medium text-gray-600'>
                <th className='p-3' style={{ width: '5%' }}>
                  <input title='checkbox' type='checkbox' />
                </th>
                <th className='p-3' style={{ width: '5%' }}>
                  ID
                </th>
                <th className='p-3' style={{ width: '10%' }}>
                  Legal Name
                </th>
                {!['Seller Briefs'].includes(active) && (
                  <th className='p-3' style={{ width: '10%' }}>
                    Agent Type
                  </th>
                )}
                <th className='p-3' style={{ width: '15%' }}>
                  Location
                </th>
                <th className='p-3' style={{ width: '5%' }}>
                  Land Size
                </th>
                <th className='p-3' style={{ width: '10%' }}>
                  Amount
                </th>
                <th className='p-3' style={{ width: '15%' }}>
                  Document
                </th>
                <th className='p-3' style={{ width: '5%' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dataToRender.map((item, index) => (
                <tr
                  key={index}
                  className='border-b text-sm text-center text-gray-700 hover:bg-gray-50'>
                  <td className='p-3'>
                    <input title='checkbox' type='checkbox' />
                  </td>
                  <td className='p-3'>{item.id}</td>
                  <td className='p-3'>{item.legalName}</td>
                  {!['Seller Briefs'].includes(active) && (
                    <td
                      className={`p-3 font-semibold ${
                        item.agentType === 'Individual'
                          ? 'text-red-500'
                          : item.agentType === 'Incoporated Agent'
                          ? 'text-green-500'
                          : 'text-blue-500'
                      }`}>
                      {item.agentType}
                    </td>
                  )}
                  <td className='p-3'>{item.location}</td>
                  <td className='p-3'>{item.landSize}</td>
                  <td className='p-3 font-bold'>{item.amount}</td>
                  <td className='p-3'>{item.document}</td>
                  <td className='p-3 cursor-pointer text-2xl'>
                    <FontAwesomeIcon
                      onClick={() => handleActionClick(item)}
                      icon={faEllipsis}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );

    return tableContent;
  };

  const formik = useFormik({
    initialValues: {
      selectedStat: {
        value: '1',
        label: 'Type',
      },
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Fragment>
      {isLoading && <Loading />}
      <div>
        <div className='flex text-lg w-full gap-4 md:gap-8 mt-6'>
          {tabs.map((item, index) => (
            <TabButton
              key={index}
              text={item.text}
              onClick={() => handleTabClick(item.text)}
              active={active}
            />
          ))}
        </div>
        <div className='w-full'>{renderDynamicComponent()}</div>
      </div>
      {selectedBrief && (
        <BriefDetailsBar user={selectedBrief} onClose={closeSidebar} />
      )}
    </Fragment>
  );
}

const TabButton = ({
  text,
  onClick,
  active,
}: {
  text: string;
  onClick: () => void;
  active: string;
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`relative rounded-sm  ${
        active === text
          ? 'border-b-4 border-[#8DDB90]  text-[#181336] font-semibold'
          : 'text-[#515B6F]'
      }`}>
      {text}
    </button>
  );
};

const tabs = [
  { text: 'Incoming Briefs' },
  { text: 'Agents Briefs' },
  { text: 'Sellers Briefs' },
  { text: 'Transacted Briefs' },
];

const statsOptions = [
  { value: '1', label: 'Individual' },
  { value: '2', label: 'Incoporated' },
];
