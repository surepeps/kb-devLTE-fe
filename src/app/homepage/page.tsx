/** @format */

'use client';
import React, { Fragment } from 'react';
//import HeroSection from '@/components/hero';
import Loading from '@/components/loading';
//import Section1 from '@/components/section1';
import Section2 from '@/components/home_section2';
import SeeWhatOthers from '@/components/section2';
import Section3 from '@/components/section3';
import FAQs from '@/components/FAQs';
import Feedback from '@/components/feedback';
import HelpButton from '@/components/home_helpbutton';
import { useLoading } from '@/hooks/useLoading';
//import homeImage from '@/assets/assets.png';
import HeroSection from '@/components/homepage_hero';
import Section1 from '@/components/home_section1';
import NewSection from '@/components/new_section';

const Homepage = () => {
  //Simulating the loading page
  const isLoading = useLoading();
  if (isLoading) return <Loading />;

  return (
    <Fragment>
      <section className={`w-full`}>
        <main className='w-full bg-[#EEF1F1]'>
          <HeroSection />
          <Section1 />
          <Section2 />
          <NewSection />
          <SeeWhatOthers />
          <Section3
            isHomepage={true}
            isAgentPage={false}
            heading='Highlight of Our Real Estate Expertise'
            headingColor='#09391C'
          />
          <FAQs isHomePage={true} />
          <Feedback />
          <HelpButton />
        </main>
      </section>
      {/* {viewImage && <ViewImage />} */}
    </Fragment>
  );
};

export default Homepage;
