/** @format */

import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import Mainbar from './main-bar';
import axios from 'axios';
import { URLS } from '@/utils/URLS';
import Cookies from 'js-cookie';
import { usePageContext } from '@/context/page-context';
import { userDetailsProperties } from '@/types';
import Loading from '../loading';

const Settings = () => {
  const { userDetails, setUserDetails } = usePageContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formikStatus, setFormikStatus] = useState<
    'pending' | 'success' | 'failed' | 'initial'
  >('initial');
  /**
   * fetch all necessary details for settings page
   * @getUserAccount - An asynchronous function that gets the user details from
   * the backend
   * @params - No parameters
   * @returns - void
   */
  const getUserAccount = async () => {
    setIsLoading(true);
    setFormikStatus('pending');
    try {
      const response = await axios.get(URLS.BASE + URLS.userAccount, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      console.log(response);
      if (response.status === 200) {
        setIsLoading(false);
        setFormikStatus('success');
        const userAccount: userDetailsProperties = response.data.user;
        if (userAccount._id) {
          /**
           * fill the userDetails contextAPI with the values from the backend
           *
           */
          setUserDetails({
            ...userDetails,
            name: `${userAccount.lastName} ${userAccount.firstName}`,
            accountApproved: userAccount.accountApproved,
            accountStatus: userAccount.accountStatus,
            address: userAccount.address,
            agentType: userAccount.agentType,
            email: userAccount.email,
            firstName: userAccount.firstName,
            lastName: userAccount.lastName,
            id: userAccount.id,
            individualAgent: userAccount.individualAgent,
            isAccountVerified: userAccount.isAccountVerified,
            isInUpgrade: userAccount.isInUpgrade,
            meansOfId: userAccount.meansOfId,
            phoneNumber: userAccount.phoneNumber,
            regionOfOperation: userAccount.regionOfOperation,
            upgradeData: userAccount.upgradeData,
            _id: userAccount._id,
            profile_picture: userAccount.profile_picture,
          });
        }
        console.log(userDetails);
      } else {
        setFormikStatus('failed');
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setFormikStatus('failed');
    }
  };

  useEffect(() => {
    getUserAccount();
  }, []);
  return (
    <section className='w-full flex justify-center flex-col'>
      {formikStatus === 'pending' && <Loading />}
      {formikStatus === 'success' && (
        <div className='container lg:w-[1180px] mt-[40px] flex lg:flex-row flex-col gap-[20px] justify-between overflow-hidden'>
          <Sidebar />
          <Mainbar />
        </div>
      )}
      {formikStatus === 'failed' && (
        <div className='flex flex-col items-center justify-center h-[500px] container lg:w-[1180px]'>
          <h1 className='text-3xl font-bold text-gray-600'>Failed to load</h1>
          <p className='text-gray-500'>Check your internet connection.</p>
        </div>
      )}
    </section>
  );
};

export default Settings;

/**
 * <Loading />
 *
 */
