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
  console.log('User in My Listing Page:', user);

  useEffect(() => {
    if (!user) {
      window.location.href = '/auth/login';
    } else if (user.userType !== 'Landowners') {
      window.location.href = '/agent';
    } else {
    document.title = 'My Listing';

    const fetchBriefs = async () => {
      setLoading(true);
        try {
        const response = await GET_REQUEST(URLS.BASE + URLS.getMyProperties,
          Cookies.get('token')
          );
          setBriefs(response || []);
        } catch (err) {
          setBriefs([]);
        } finally {
          setLoading(false);
        }
      };
      fetchBriefs()
    }  
  }, [user]);

    // Only render if user exists
  if (!user) return null;
  
  return <MyListing briefs={briefs} loading={loading}/>;
};

export default page;
