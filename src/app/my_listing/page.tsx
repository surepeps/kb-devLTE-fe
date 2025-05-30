/** @format */
'use client';
import MyListing from '@/components/mylisting';
import React, { useEffect, useState } from 'react';
import { useUserContext } from '@/context/user-context';
import { URLS } from '@/utils/URLS';
import Cookies from 'js-cookie';
import { GET_REQUEST } from '@/utils/requests';

const page = () => {
  const { user } = useUserContext();
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Only run redirect logic after user context is loaded (not undefined/null)
  useEffect(() => {
    // Don't do anything until user context is loaded
    if (typeof user === 'undefined') return;

    // If user is null or falsy, redirect
    if (user === null) {
      // Only redirect if user is definitely not logged in
      window.location.href = '/auth';
      return;
    }

    // If userType is not Landowners, redirect
    if (user.userType !== 'Landowners') {
      window.location.href = '/agent';
      return;
    }

    // Otherwise, fetch briefs
    document.title = 'My Listing';

    const fetchBriefs = async () => {
      setLoading(true);
      try {
        const response = await GET_REQUEST(
          URLS.BASE + URLS.getMyProperties,
          Cookies.get('token')
        );
        setBriefs(response || []);
      } catch (err) {
        setBriefs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBriefs();
  }, [user]);

  // Only render if user is not undefined (context loaded)
  if (typeof user === 'undefined') return null;

  // Only render MyListing if user is valid and correct type
  if (!user || user.userType !== 'Landowners') return null;

  return <MyListing briefs={briefs} loading={loading} />;
};

export default page;
