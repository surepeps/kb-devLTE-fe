/** @format */

'use client';
import React, { Fragment } from 'react';
import HeroSection from '@/components/hero';
import Loading from '@/components/loading';
import Section1 from '@/components/section1';
import Section2 from '@/components/section2';
import Section3 from '@/components/section3';
import FAQs from '@/components/FAQs';
import Feedback from '@/components/feedback';
import HelpButton from '@/components/helpButton';
import { usePageContext } from '@/context/page-context';
import { useLoading } from '@/hooks/useLoading';

const Homepage = () => {
  //Simulating the loading page
  const isLoading = useLoading();

  const { isContactUsClicked } = usePageContext();
  if (isLoading) return <Loading />;

  return (
    <Fragment>
      <section
        className={`w-full  ${
          isContactUsClicked &&
          'filter brightness-[30%] bg-[#EEF1F1] transition-all duration-500 overflow-hidden'
        }`}>
        <main className='w-full bg-[#EEF1F1]'>
          <HeroSection />
          <Section1 />
          <Section2 />
          <Section3 />
          <FAQs />
          <Feedback />
          <HelpButton />
        </main>
      </section>
    </Fragment>
  );
};

export default Homepage;
