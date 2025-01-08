/** @format */
'use client';
import Loading from '@/components/loading';
import { useVisibility } from '@/hooks/useVisibility';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import '@/styles/stylish.modules.css';
import { data, servicesData } from '@/data/about_us_data';
import AboutUsUnit from '@/components/aboutus_unit';
import { usePageContext } from '@/context/page-context';
import CEO from '@/components/displayCEO';

const AboutUs = () => {
  //Simulating the loading page
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const divRef = useRef<HTMLHeadingElement>(null);
  const { isContactUsClicked } = usePageContext();

  const isDivVisible = useVisibility(divRef);

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
        className={`w-full bg-white flex justify-center items-center min-h-[1050px] ${
          isContactUsClicked &&
          'filter brightness-[30%] transition-all duration-500 overflow-hidden'
        }`}>
        <div className='container min-h-[1000px] flex flex-col items-center lg:px-[40px] overflow-hidden py-[60px]'>
          <h2
            className={`min-h-[66px] font-semibold md:text-[60px] md:leading-[66px] text-[#000000] ${'slide-from-right'}`}>
            About <span className='text-[#8DDB90]'>Khabiteq</span>
          </h2>
          <p className='font-normal text-[#5A5D63] text-[24px] leading-[38px] tracking-[5%] text-center mt-[40px] slide-from-left'>
            With a passion for delivering exceptional real estate experiences,
            our team has worked tirelessly to exceed client expectations. Over
            the past five years, we&apos;ve successfully navigated the
            ever-changing landscape of Lagos&apos; property market, adapting
            innovative strategies to stay ahead
          </p>
          <hr className='border-[1px] w-full border-[#D9D9D9] mt-[50px]' />

          <div className='flex flex-col gap-[40px] mt-[40px] slide-from-bottom'>
            {data.map((item: { heading: string; description: string }, idx) => (
              <AboutUsUnit key={idx} {...item} />
            ))}
          </div>

          <div className='flex flex-col min-h-[373px] gap-[24px] mt-[50px] w-[870px]'>
            <h2
              className={`${'slide-from-left'} font-bold text-[35px] leading-[41px] text-[#09391C]`}>
              Our Services
            </h2>
            {servicesData.map(
              (item: { heading: string; description: string }, idx: number) => {
                return (
                  <div key={idx} className='flex gap-[20px]'>
                    <span>
                      <span className='text-[20px] leading-[28px] font-semibold tracking-[5%] text-[#0B423D]'>
                        {item.heading}: &nbsp;
                      </span>
                      <span className='text-[20px] leading-[28px] font-normal tracking-[5%] text-[#5A5D63]'>
                        {item.description}
                      </span>
                    </span>
                  </div>
                );
              }
            )}
          </div>

          {/**Meet Our Team */}
          <div className='border-2 border-dashed min-h-[995px] lg:w-[1203px] bg-[#8DDB901A] mt-[60px] px-[70px] py-[50px] flex flex-col items-center gap-[40px]'>
            <h2 className='lg:text-[42px] font-semibold leading-[46px] text-[#09391C]'>
              Meet Our Team
            </h2>
            <div className='w-full h-[369px] gap-[20px] flex'>
              <div className='h-[369px] lg:w-[736px] bg-[#D9D9D9]'></div>
              <div className='h-[369px] lg:w-[301px] bg-[#D9D9D9]'></div>
            </div>
            <div className='w-full gap-[20px] flex'>
              <div className='h-[369px] lg:w-[50%] bg-[#D9D9D9]'></div>
              <div className='h-[369px] lg:w-[50%] bg-[#D9D9D9]'></div>
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
