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
import HelpButton from '@/components/helpButton';
import { usePageContext } from '@/context/page-context';
import { useLoading } from '@/hooks/useLoading';
//import homeImage from '@/assets/assets.png';
import HeroSection from '@/components/homepage_hero';
import Section1 from '@/components/home_section1';
import NewSection from '@/components/new_section';

const Homepage = () => {
  //Simulating the loading page
  const isLoading = useLoading();

  const { isContactUsClicked, isModalOpened } = usePageContext();
  if (isLoading) return <Loading />;

  return (
    <Fragment>
      <section
        className={`w-full  ${
          (isContactUsClicked || isModalOpened) &&
          'filter brightness-[30%] bg-[#EEF1F1] transition-all duration-500 overflow-hidden'
        }`}>
        <main className='w-full bg-[#EEF1F1]'>
          {/* <HeroSection
            image={homeImage}
            headingText='Embrace The Future With'
            description="Tell us what you're looking for! Submit your property
            preferences below and let us find the perfect match for you"
            buttonText='Enter Preference'
            bgColor='#0B423D'
            borderColor='#63A3BE'
          /> */}
          <HeroSection />
          {/* <Section1
            headingColor='#09391C'
            displayCounts={true}
            text={` Your trusted partner in Lagos' real estate market. Since 2020,
            we've been delivering expert solutions with integrity and
            personalized service, helping you navigate property sales, rentals,
            and more. Let us help you find your perfect property today`}
          /> */}
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
          <HelpButton isHomePage={true} />
        </main>
      </section>
    </Fragment>
  );
};

export default Homepage;
