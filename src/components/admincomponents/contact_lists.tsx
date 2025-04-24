/**
 * eslint-disable @typescript-eslint/no-unused-vars
 *
 * @format
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */
'use client';
import { Fragment, useEffect, useState } from 'react';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import filterIcon from '@/svgs/filterIcon.svg';
import Select from 'react-select';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import BriefDetailsBar from './briefDetailsBar';
import { POST_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import toast from 'react-hot-toast';
import Loading from '@/components/loading';

interface Property {
  _id: string;
  propertyType: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  price: number;
  docOnProperty: {
    _id: string;
    docName: string;
    isProvided: boolean;
  }[];
  propertyFeatures: {
    additionalFeatures: string[];
    noOfBedrooms: number | null;
  };
  owner: string;
  ownerModel: string;
  areYouTheOwner: boolean;
  usageOptions: string[];
  isAvailable: boolean;
  pictures: string[];
  isApproved: boolean;
  isRejected: boolean;
  landSize: {
    measurementType: string;
    size: number | null;
  };
  createdAt: string;
  updatedAt: string;
}

interface SellerContact {
  ownerInfo: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  ownerId: string;
  properties: Property[];
}

export default function ContactLists({ setTotals }: { setTotals: (totals: { [key: string]: number }) => void }) {
  const [active, setActive] = useState('Sellers Contacts');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<SellerContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<{ legalName: string; createdAt: string; email: string } | null>(null);
  const [totalContacts, setTotalContacts] = useState<number>(0);
  const [sellersContacts, setSellersContacts] = useState<SellerContact[]>([]);
  const [buyersContacts, setBuyersContacts] = useState<SellerContact[]>([]);
  const [rentersContacts, setRentersContacts] = useState<SellerContact[]>([]);
  const [landlordsContacts, setLandlordsContacts] = useState<SellerContact[]>([]);

  const fetchContacts = async (userType: string) => {
    try {
      const payload = {
        userType,
        page: 1,
        limit: 10,
      };
      const response = await POST_REQUEST(URLS.BASE + URLS.fetchUsersData, payload);

      if (response?.success === false) {
        toast.error(`Failed to fetch ${userType} contacts`);
        return [];
      }

      // Return the correct data based on userType
      if (userType === 'buyer') {
        return response?.sellPreferences || response?.rentPrefencees || [];
      } else if (userType === 'seller' || userType === 'landlord') {
        return response || [];
      }

      return [];
    } catch (error) {
      // console.error(`Error fetching ${userType} contacts:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllContacts = async () => {
      setIsLoading(true);
      try {
        const [sellers, buyers, renters, landlords] = await Promise.all([
          fetchContacts('seller'),
          fetchContacts('buyer'),
          fetchContacts('buyer'),
          fetchContacts('landlord'),
        ]);

        setSellersContacts(sellers);
        setBuyersContacts(buyers);
        setRentersContacts(renters);
        setLandlordsContacts(landlords);

        const totals = {
          'Sellers Contacts': sellers.length,
          'Buyers Contacts': buyers.length,
          'Renters Contacts': renters.length,
          'Landlord Contacts': landlords.length,
        };

        setTotals(totals); // Update totals in the parent component

        // Set initial contacts for the active tab
        if (active === 'Sellers Contacts') {
          setContacts(sellers);
          setTotalContacts(sellers.length);
        } else if (active === 'Buyers Contacts') {
          setContacts(buyers);
          setTotalContacts(buyers.length);
        } else if (active === 'Renters Contacts') {
          setContacts(renters);
          setTotalContacts(renters.length);
        } else if (active === 'Landlord Contacts') {
          setContacts(landlords);
          setTotalContacts(landlords.length);
        }
      } catch (error) {
        toast.error('Failed to fetch contacts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllContacts();

    const handleFocus = () => {
      fetchAllContacts();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [active]);

  const handleTabClick = (tab: string) => {
    setActive(tab);
    setContacts([]);
    setIsLoading(true);

    if (tab === 'Sellers Contacts') {
      setContacts(sellersContacts);
      setTotalContacts(sellersContacts.length);
    } else if (tab === 'Buyers Contacts') {
      setContacts(buyersContacts);
      setTotalContacts(buyersContacts.length);
    } else if (tab === 'Renters Contacts') {
      setContacts(rentersContacts);
      setTotalContacts(rentersContacts.length);
    } else if (tab === 'Landlord Contacts') {
      setContacts(landlordsContacts);
      setTotalContacts(landlordsContacts.length);
    }

    setIsLoading(false);
  };

  const handleActionClick = (contact: SellerContact) => {
    const contactDetails = {
      legalName: contact.ownerInfo.fullName || '--',
      createdAt: contact.ownerInfo.createdAt || '--',
      email: contact.ownerInfo.email || '--',
    };
    setSelectedContact(contactDetails);
  };

  const closeSidebar = () => {
    setSelectedContact(null);
  };

  const renderDynamicComponent = () => {
    return (
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className='mt-6 p-4 border rounded-md bg-white w-full lg:max-w-[1128px] px-8 mr-2 overflow-hidden md:overflow-x-auto'>
        <h3 className='text-[#2E2C34] text-xl font-semibold py-6'>{active}</h3>
        <div className='w-full overflow-x-auto md:overflow-clip mt-6'>
          <table className='min-w-[900px] md:w-full border-collapse'>
            <thead>
              <tr className='border-b bg-[#fafafa] text-center text-sm font-medium text-gray-600'>
                <th className='p-3'>ID</th>
                <th className='p-3'>Full Name</th>
                <th className='p-3'>Email</th>
                <th className='p-3'>Phone Number</th>
                <th className='p-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr
                  key={index}
                  className='border-b text-sm text-center text-gray-700 hover:bg-gray-50'>
                  <td className='p-3'>{contact.ownerInfo._id.slice(0, 8)}</td>
                  <td className='p-3'>{contact.ownerInfo.fullName}</td>
                  <td className='p-3'>{contact.ownerInfo.email}</td>
                  <td className='p-3'>{contact.ownerInfo.phoneNumber}</td>
                  <td className='p-3 cursor-pointer text-2xl'>
                    <FontAwesomeIcon
                      onClick={() => handleActionClick(contact)}
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
  };

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
        <div className='w-full'>
          {renderDynamicComponent()}
        </div>
      </div>
      {selectedContact && (
        <BriefDetailsBar user={selectedContact} onClose={closeSidebar} hideButtons={true} hideDetails />
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
  { text: 'Sellers Contacts' },
  { text: 'Buyers Contacts' },
  { text: 'Renters Contacts' },
  { text: 'Landlord Contacts' },
];