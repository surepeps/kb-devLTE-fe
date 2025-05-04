/** @format */
'use client';
import Loading from '@/components/loading-component/loading';
import { useVisibility } from '@/hooks/useVisibility';
import React, { Fragment, useRef } from 'react';
import '@/styles/stylish.modules.css';
import { data, servicesData } from '@/data/about_us_data';
import AboutUsUnit from '@/components/aboutus_unit';
import { usePageContext } from '@/context/page-context';
import CEO from '@/components/displayCEO';
import { useLoading } from '@/hooks/useLoading';

const AboutUs = () => {
  //Simulating the loading page
  const isLoading = useLoading();
  const divRef = useRef<HTMLHeadingElement>(null);
  const { isContactUsClicked, isModalOpened } = usePageContext();

  const isDivVisible = useVisibility(divRef);

  if (isLoading) return <Loading />;

  return (
    <Fragment>
      <section
        className={`w-full bg-[#EEF1F1] flex justify-center items-center min-h-[1050px] ${
          (isContactUsClicked || isModalOpened) &&
          'filter brightness-[30%] transition-all duration-500 overflow-hidden'
        }`}>
        <div className='container min-h-[1000px] flex flex-col items-center lg:px-[40px] overflow-hidden py-[30px] lg:py-[60px] px-[20px]'>
          <h2
            className={`min-h-[66px] font-semibold lg:text-[60px] lg:leading-[66px] text-[30px] leading-[33px] text-[#000000] ${'slide-from-right'} font-display`}>
            About <span className='text-[#8DDB90] font-display'>Khabiteq</span>
          </h2>
          <p className='font-normal text-[#5A5D63] lg:text-[24px] lg:leading-[38px] text-base leading-[25.6px] tracking-[5%] text-center lg:mt-[40px] slide-from-left'>
            With a passion for delivering exceptional real estate experiences,
            our team has worked tirelessly to exceed client expectations. Over
            the past five years, we&apos;ve successfully navigated the
            ever-changing landscape of Lagos&apos; property market, adapting
            innovative strategies to stay ahead
          </p>
          {/* <hr className='border-[1px] w-full border-[#D9D9D9] mt-[50px]' /> */}

          <div className='flex flex-col mt-[40px] slide-from-bottom'>
            {data.map((item: { heading: string; description: string }, idx) => (
              <AboutUsUnit key={idx} {...item} />
            ))}
          </div>

          <div className='flex flex-col min-h-[373px] gap-[24px] mt-[20px] lg:mt-[50px] lg:w-[870px]'>
            <h2
              className={`${'slide-from-left'} font-bold lg:text-[35px] text-[24px] leading-[28.13px] lg:leading-[41px] text-[#09391C]`}>
              Our Services
            </h2>
            {servicesData.map(
              (item: { heading: string; description: string }, idx: number) => {
                return (
                  <div key={idx} className='flex gap-[20px]'>
                    <span className='lg:text-[20px] lg:leading-[28px] text-base leading-[22.4px] font-semibold tracking-[5%]'>
                      <span className='md:text-[#0B423D] text-[#8DDB90]'>
                        {item.heading}: &nbsp;
                      </span>
                      <span className='font-normal text-[#5A5D63]'>
                        {item.description}
                      </span>
                    </span>
                  </div>
                );
              }
            )}
          </div>

          {/**Meet Our Team */}
          <div className='lg:min-h-[995px] min-h-[783px] w-full lg:w-[1203px] bg-[#8DDB901A] mt-[60px] lg:px-[70px] px-[20px] py-[30px] lg:py-[50px] flex flex-col items-center gap-[20px] lg:gap-[40px]'>
            <h2 className='lg:text-[42px] text-[24px] leading-[26.4px] font-semibold lg:leading-[46px] text-[#09391C]'>
              Meet Our Team
            </h2>
            <div className='w-full h-[357px] lg:h-[369px] gap-[20px] flex lg:flex-row flex-col'>
              <div className='h-[357px] lg:h-[369px] lg:w-[736px] w-full bg-[#D9D9D9]'></div>
              <div className='h-[357px] lg:h-[369px] lg:w-[301px] w-full bg-[#D9D9D9]'></div>
            </div>
            <div className='w-full gap-[20px] flex'>
              <div className='h-[357px] lg:h-[369px] w-[50%] bg-[#D9D9D9]'></div>
              <div className='h-[357px] lg:h-[369px] w-[50%] bg-[#D9D9D9]'></div>
            </div>
          </div>

          {/**CEO */}
          <div
            ref={divRef}
            className={`flex justify-center items-center mt-[60px] ${
              isDivVisible && 'slide-from-left'
            }`}>
            <CEO
              name='Oladipo Onakoya'
              text='As the CEO of Khabi-Teq, my vision is to redefine real estate in Nigeria by providing seamless, transparent, and innovative solutions for all our clients. With a passion for excellence and a commitment to integrity, my goal is to build a platform that connects people to opportunities, transforms lives, and drives growth in the real estate industry'
              title='CEO/Founder'
            />
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default AboutUs;
