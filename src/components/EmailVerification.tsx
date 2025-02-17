"use strict";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { URLS } from '@/utils/URLS';
import { GET_REQUEST } from '@/utils/requests';
import Cookies from 'js-cookie';

const EmailVerification = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('access_token')) {
      const url = URLS.BASE + URLS.agent + URLS.verifyEmail + `?access_token=${searchParams.get('access_token')}`;

      (async () => {
        await GET_REQUEST(url).then((response) => {
          console.log('response from email verification', response);
          if ((response as unknown as { id: string; token: string }).id) {
            Cookies.set('token', (response as unknown as { token: string }).token);
            router.push('/');
          }
        });
      })();
    }
  }, [router, searchParams]);

  return null;
};

export default EmailVerification;