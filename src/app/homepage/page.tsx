/** @format */

'use client';
import React, { Fragment, Suspense, useEffect } from 'react';
import Loading from '@/components/loading-component/loading';
import Section2 from '@/components/homepage/home_section2';
import SeeWhatOthers from '@/components/homepage/section2';
import Section3 from '@/components/homepage/section3';
import FAQs from '@/components/homepage/FAQs';
import Feedback from '@/components/homepage/feedback';
import HelpButton from '@/components/homepage/home_helpbutton';
import { useLoading } from '@/hooks/useLoading';
import HeroSection from '@/components/homepage/homepage_hero';
import Section1 from '@/components/homepage/home_section1';
import EmailVerification from '@/components/EmailVerification';
import { useRouter, useSearchParams } from 'next/navigation';
import { URLS } from '@/utils/URLS';
import { GET_REQUEST } from '@/utils/requests';
import Cookies from 'js-cookie';
import { useUserContext } from '@/context/user-context';
import HowItWorksSection from '@/components/homepage/how-it-works-section';

/**
 * @Homepage - A function that returns the web homepage
 * @param - no parameters
 *
 * @returns - Homepage contents
 */
const Homepage = () => {
  //Simulating the loading page
  const isLoading = useLoading();

  const searchParams = useSearchParams();

  /**
   * using the useRouter from the next/navigation to simulate between pages
   */
  const router = useRouter();

  /**
   * UserContextAPI to store users information that could be accessed
   * globally in all the pages
   */
  const { setUser } = useUserContext();

  useEffect(() => {
    if (searchParams.get('access_token')) {

      const url =
        URLS.BASE +
        URLS.user +
        URLS.verifyEmail +
        `?access_token=${searchParams.get('access_token')}`;

      (async () => {
        await GET_REQUEST(url).then((response) => {
          if ((response as unknown as { id: string; token: string }).id) {
            Cookies.set(
              'token',
              (response as unknown as { token: string }).token
            );

            const user = response as unknown as {
              id: string;
              email: string;
              password: string;
              lastName: string;
              firstName: string;
              phoneNumber: string;
              accountApproved: boolean;
              userType: string;
            };
            // const user = {
            //   id: (response as any).id,
            //   email: (response as any).email,
            //   name: (response as any).name,
            //   phoneNumber: (response as any).phone,
            //   role: (response as any).role,
            // };

            setUser(user);
            if (user.userType === 'Landowners') {
              router.push('/auth/login');
            }
            if (user.userType === 'Agent') {
              router.push('/agent/onboard');
          }
        }
        });
      })();
    }
  }, [router, searchParams, setUser]);

  /**
   * if else statement to simulate the loading page for 3 secs then return the actual homepage
   */
  if (isLoading) return <Loading />;

  return (
    <Fragment>
      <section className={`w-full`}>
        <main className='w-full bg-[#EEF1F1]'>
          {/**
           * Hero Section Component ~ Takes no props
           */}
          <HeroSection />
          {/**Details About website Componet ~ Takes no props */}
          <Section1 />
          {/**
           * Why Khabi-Teq Is Your Trusted Real Estate Partner Component
           * Takes no props
           */}
          <Section2 />
          {/* <NewSection /> */}
          <HowItWorksSection />
          <SeeWhatOthers />
          <Section3
            isHomepage={true}
            isAgentPage={false}
            heading='Highlight of our real estate expertise'
            headingColor='#09391C'
          />
          <FAQs isHomePage={true} />
          <Feedback />
          <HelpButton />
        </main>
      </section>
      <Suspense fallback={<Loading />}>
        <EmailVerification />
      </Suspense>
      {/* {viewImage && <ViewImage />} */}
    </Fragment>
  );
};

const HomepageWrapper = () => (
  <Suspense fallback={<Loading />}>
    <Homepage />
  </Suspense>
);

export default HomepageWrapper;
