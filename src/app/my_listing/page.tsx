/** @format */
'use client';
import MyListing from '@/components/mylisting';
import React, { useEffect, useState } from 'react';
import { useUserContext } from '@/context/user-context';
import { URLS } from '@/utils/URLS';
import Cookies from 'js-cookie';
import { GET_REQUEST } from '@/utils/requests';
import { useRouter } from 'next/navigation';

const page = () => {
  const { user } = useUserContext();
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else if (user.userType !== 'Landowners') {
      router.push('/agent');
    } else {
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
    }
  }, [user]);

  // Only render if user exists
  if (!user) return null;

  return <MyListing briefs={briefs} loading={loading} />;
};

export default page;
