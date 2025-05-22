/** @format */
'use client';
import MyListing from '@/components/mylisting';
import React, { useEffect } from 'react';
import { useUserContext } from '@/context/user-context';

const page = () => {
  const { user } = useUserContext();

  useEffect(() => {
    if (!user) {
      window.location.href = '/auth';
    } else if (user.userType !== 'Landowners') {
      window.location.href = '/agent';
    }
    document.title = 'My Listing';
  }, [user]);

    // Only render if user exists
  if (!user) return null;
  
  return <MyListing />;
};

export default page;
