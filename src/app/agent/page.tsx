/** @format */

'use client';
import React, { Fragment, useEffect } from 'react';
import HeroSection from '@/components/homepage/hero';
import Loading from '@/components/loading-component/loading';
import Section1 from '@/components/section1';
import Section3 from '@/components/homepage/section3';
import FAQs from '@/components/homepage/FAQs';
import HelpButton from '@/components/helpButton';
import { usePageContext } from '@/context/page-context';
import { useLoading } from '@/hooks/useLoading';
import agentImage from '@/assets/Agentpic.png';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/user-context';

const Agent = () => {
  //Simulating the loading page
  const isLoading = useLoading();
  const router = useRouter();

  const { isContactUsClicked, isModalOpened } = usePageContext();
  const { user } = useUserContext();

  useEffect(() => {
    //Redirecting to the login page if the user is not logged in
    if (!user) {
      return;
    } else if (!user.accountApproved) {
      router.push('/agent/under-review');
    } else {
      router.push('/agent/briefs');
    }
  }, [user, router]);

  if (isLoading) return <Loading />;

  return (
    <Fragment>
      <section
        className={`w-full  ${
          (isContactUsClicked || isModalOpened) &&
          'filter brightness-[30%] bg-[#EEF1F1] transition-all duration-500 overflow-hidden'
        }`}>
        <main className='w-full bg-[#EEF1F1]'>
          <HeroSection
            image={agentImage}
            headingText='Partner with'
            description='"Partner with Khabi-Teq for exclusive listings, referral commissions, and seamless transactions to grow your real estate business'
            buttonText1='Partner with us'
            buttonText2='Login'
            bgColor='#0A3E72'
            borderColor='#63A3BE'
          />
          <Section1
            headingColor='#000000'
            displayCounts={false}
            text={`Join our trusted network of agents and access exclusive property listings, connect with verified buyers and sellers, and grow your real estate business seamlessly`}
          />

          <Section3
            isAgentPage={true}
            isHomepage={false}
            heading='Benefit of partnering with Khabi-teq'
            headingColor='#000000'
          />
          <FAQs isHomePage={false} headingColor='#000000' />
          <HelpButton isHomePage={false} />
        </main>
      </section>
    </Fragment>
  );
};

export default Agent;
