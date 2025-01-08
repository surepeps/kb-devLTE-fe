/** @format */

'use client';
import React, { Fragment, useEffect, useState } from 'react';
import HeroSection from '@/components/hero';
import Loading from '@/components/loading';
import Section1 from '@/components/section1';
import Section2 from '@/components/section2';
import Section3 from '@/components/section3';
import FAQs from '@/components/FAQs';
import Feedback from '@/components/feedback';
import HelpButton from '@/components/helpButton';
import { usePageContext } from '@/context/page-context';

const Homepage = () => {
  //Simulating the loading page
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isContactUsClicked } = usePageContext();

  useEffect(() => {
    const timeOutID = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeOutID);
  }, []);

  if (isLoading) return <Loading />;
  return (
    <Fragment>
      <section
        className={`w-full  ${
          isContactUsClicked &&
          'filter brightness-[30%] transition-all duration-500 overflow-hidden'
        }`}>
        <main className='w-full ]'>
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
