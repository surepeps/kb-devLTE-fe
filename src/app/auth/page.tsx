/** @format */
'use client';

import React, { useState, useEffect } from 'react';
import facebookIcon from '@/svgs/facebookIcon.svg';
import googleIcon from '@/svgs/googleIcon.svg';
import Button from '@/components/general-components/button';
import Link from 'next/link';
import { usePageContext } from '@/context/page-context';
import { useLoading } from '@/hooks/useLoading';
import Loading from '@/components/loading-component/loading';
import '@/styles/stylish.modules.css';
import { RegisterWith } from '@/components/general-components/registerWith';
import { UserType } from '@/components/general-components/userType';
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { URLS } from '@/utils/URLS';
import { POST_REQUEST } from '@/utils/requests';

const Register = () => {
  const { isContactUsClicked, rentPage, isModalOpened } = usePageContext();
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [hideLandownerText, setHideLandownerText] = useState(false);
  const isLoading = useLoading();

  const router = useRouter();

  const handleUserTypeSelect = (type: string) => {
    setSelectedUserType(type);
  };

  useEffect(() => {
    const fromHeader = window.localStorage.getItem('signupFromHeader');
    if (fromHeader === 'true') {
      setSelectedUserType('landlord');
      setHideLandownerText(true);
      window.localStorage.removeItem('signupFromHeader');
    } else {
      setSelectedUserType('agent');
      setHideLandownerText(false);
    }
  }, []);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const url = URLS.BASE + URLS.agent + URLS.googleSignup;

      await POST_REQUEST(url, { code: codeResponse.code }).then(
        async (response) => {
          if ((response as unknown as { id: string }).id) {
            Cookies.set(
              'token',
              (response as unknown as { token: string }).token
            );

            router.push('/agent/onboard');
          }
          console.log('response', response);
        }
      );
    },
    onError: (errorResponse) => console.error(errorResponse),
  });

  if (isLoading) return <Loading />;

  return (
    <section
      className={`min-h-[500px] overflow-hidden bg-[#EEF1F1] flex justify-center items-center w-full transition-all duration-500 my-20 ${
        (isContactUsClicked ||
          rentPage.isSubmitForInspectionClicked ||
          isModalOpened) &&
        'brightness-[30%]'
      }`}>
      <div className='container slide-from-right min-h-[400px] lg:w-[603px] w-full flex flex-col justify-center gap-[40px] items-center px-[20px] '>
        <div>
          <h2 className='text-[#09391C] text-[24px] leading-[38.4px] font-semibold font-display text-center'>
            Register with{' '}
            <span className='text-[#8DDB90] font-display'>Khabiteq realty</span>
          </h2>
          <p className='text-[#5A5D63] text-[16px] mt-1 text-center'>
            How do you want to sign up an agent or land owner
          </p>
          {!hideLandownerText && (
            <p className='text-[#5A5D63] text-[16px] mt-1 text-center'>
              Are you a landowner looking to sell, rent, or explore joint
              ventures? <br />
              Register with us today and start closing deals!
            </p>
          )}
        </div>

        <div className='w-full min-h-[237px] flex flex-col justify-center items-center gap-[19px]'>
          <div className='min-h-[147px] flex flex-col gap-[22px] w-full'>
            {/**Google | Facebook */}
            <div className='flex justify-between lg:flex-row flex-col gap-[15px]'>
              <UserType
                text="I'm a Landlord"
                onClick={() => handleUserTypeSelect('landlord')}
                bgColor={selectedUserType === 'landlord' ? '#8DDB90' : ''}
              />
              <UserType
                text="I'm an Agent"
                onClick={() => handleUserTypeSelect('agent')}
                bgColor={selectedUserType === 'agent' ? '#8DDB90' : ''}
              />
            </div>
            <div className='flex justify-between lg:flex-row flex-col gap-[23px] mt-5'>
              <RegisterWith
                icon={googleIcon}
                text='Continue with Google'
                onClick={googleLogin}
              />
              <RegisterWith icon={facebookIcon} text='Continue with Facebook' />
            </div>
            {/**Register Via E-mails or phone */}
            <Button
              type='button'
              value='Register Via E-mails or phone'
              onClick={() => {
                if (selectedUserType === 'landlord') {
                  window.location.href = '/auth/register?type=Landowners';
                } else if (selectedUserType === 'agent') {
                  window.location.href = '/auth/register?type=Agent';
                } else {
                  window.location.href = '/auth/register';
                }
              }}
              className='bg-[#8DDB90] h-[65px] w-full py-[12px] px-[24px] text-[16px] leading-[25.6px] font-bold text-[#FAFAFA]'
            />
          </div>
          <span className='text-base text-center leading-[25.6px] font-normal'>
            Already have an account?{' '}
            <Link className='font-semibold text-[#09391C]' href={'/auth/login'}>
              Sign In
            </Link>
          </span>
          <span className='text-base text-center leading-[25.6px] font-normal'>
            By Continuing you agree to the Khabi-Teq realty{' '}
            <Link
              className='font-semibold text-[#09391C]'
              href={'/policies_page'}>
              policy and Rules
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Register;
