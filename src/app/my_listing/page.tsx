/** @format */
'use client';
import MyListing from '@/components/mylisting';
import React, { useEffect } from 'react';
import { useUserContext } from '@/context/user-context';

const page = () => {
  const { user } = useUserContext();
  console.log('User in My Listing Page:', user);

  useEffect(() => {
    if (!user) {
      window.location.href = '/auth/login';
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
