/** @format */
'use client';
import Loading from '@/components/loading-component/loading';
import { useVisibility } from '@/hooks/useVisibility';
import React, { Fragment, useRef } from 'react';
import '@/styles/stylish.modules.css';
import { data, reasonData, servicesData } from '@/data/about_us_data';
import AboutUsUnit from '@/components/aboutus_unit';
import { usePageContext } from '@/context/page-context';
import CEO from '@/components/general-components/displayCEO';
import { useLoading } from '@/hooks/useLoading';
import team1 from '@/assets/Team1.png';
import team2 from '@/assets/Team2.png';
import Image from 'next/image';
import abisoyeImage from '@/assets/Abisoye.png';
import abolanleImage from '@/assets/Abolanle.png';
import adesayoImage from '@/assets/Adesayo.png';
import oladipoImage from '@/assets/Oladipo.png';
import ayowoleImage from '@/assets/Ayowole.png';
import fasimoye from '@/assets/Fasimoye.png';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

const AboutUs = () => {
  //Simulating the loading page
  const isLoading = useLoading();
  const divRef = useRef<HTMLHeadingElement>(null);
  const { isContactUsClicked, isModalOpened } = usePageContext();

  const isDivVisible = useVisibility(divRef);

  if (isLoading) return <Loading />;

  return (
    <section
      className={`w-full bg-[#EEF1F1] flex justify-center items-center min-h-[1050px] ${
        (isContactUsClicked || isModalOpened) &&
        'filter brightness-[30%] transition-all duration-500 overflow-hidden'
      }`}>
      <div className='container min-h-[1000px] flex flex-col items-center pb-[40px] overflow-hidden'>
        <h2
          className={`min-h-[66px] font-semibold lg:text-4xl lg:leading-[66px] text-[30px] leading-[33px] text-[#000000] ${'slide-from-right'} font-display`}>
          About <span className='text-[#8DDB90] font-display'>Khabiteq</span>
        </h2>
        <p className='font-normal text-[#5A5D63] lg:text-xl text-base text-center md:mt-4 slide-from-left lg:px-[40px] px-[20px]'>
          At Khabiteq Realty, we are more than just a real estate company we are
          a community builder, a lifestyle curator, and a trusted partner on
          your property journey. Founded with a bold vision to transform how
          Nigerians experience real estate, Khabiteq Realty operates at the
          intersection of innovation, trust, and service. Our company combines
          deep industry expertise with a passion for connecting people with
          properties that not only meet their needs but also exceed their
          expectations.
        </p>
        {/* <hr className='border-[1px] w-full border-[#D9D9D9] mt-[50px]' /> */}

        <div className='flex flex-col mt-[40px] slide-from-bottom lg:px-[40px] px-[20px]'>
          {data.map((item: { heading: string; description: string }, idx) => (
            <AboutUsUnit key={idx} {...item} />
          ))}
        </div>

        <div className='flex flex-col min-h-[373px] gap-[24px] mt-[20px] lg:mt-[50px] lg:w-[870px] lg:px-[40px] px-[20px]'>
          <h2
            className={`${'slide-from-left'} font-bold lg:text-3xl text-[24px] leading-[28.13px] lg:leading-[41px] text-[#09391C]`}>
            What We Do
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

        <div className='flex flex-col min-h-[373px] gap-[24px] mt-[20px] lg:mt-[50px] lg:w-[870px] lg:px-[40px] px-[20px]'>
          <h2
            className={`${'slide-from-left'} font-bold lg:text-3xl text-[24px] leading-[28.13px] lg:leading-[41px] text-[#09391C]`}>
            What Choose Us?
          </h2>
          {reasonData.map(
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
          <div className='container flex flex-col gap-[50px]'>
            <div className='flex flex-col gap-[18px] w-full'>
              <div className='min-h-[289px] w-full flex md:flex-row flex-col gap-[20px] justify-between'>
                <Image
                  src={team1}
                  alt='Team'
                  className='md:w-1/2 w-full object-cover'
                />
                <Image
                  src={team2}
                  alt='Team'
                  className='md:w-1/2 w-full object-cover'
                />
              </div>
              <p className='text-center text-base md:text-lg text-[#09391C]'>
                Meet the minds behind Khabi-teq Realty a passionate, driven team
                working together to reshape the future of real estate with
                transparency, trust, and technology at the core of everything we
                do.
              </p>
            </div>
            <div className='w-full px-[10px] flex justify-center items-center'>
              <div className='grid md:grid-cols-3 md:gap-[40px] gap-[20px]'>
                {teamMembers.map(
                  (
                    member: {
                      image: StaticImport;
                      name: string;
                      positionHeld: string;
                    },
                    idx: number
                  ) => (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      exit={{ y: 20, opacity: 0 }}
                      key={idx}
                      className='flex flex-col items-center justify-center gap-[9px] lg:w-[305px]'>
                      <Image
                        title={`${member.name}, ${member.positionHeld}`}
                        src={member.image}
                        alt={member.name}
                        className='h-[317px] w-full object-cover cursor-pointer'
                      />
                      <div className='flex items-center justify-center flex-col'>
                        <h3 className='text-lg font-semibold text-[#09391C] text-center'>
                          {member.name}
                        </h3>
                        <h3 className='text-lg text-center text-[#09391C]'>
                          {member.positionHeld}
                        </h3>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/**CEO */}
        <div
          ref={divRef}
          className={`flex justify-center items-center mt-[60px] lg:px-[40px] px-[20px]`}>
          <AnimatePresence>
            <CEO
              name='Oladipo Onakoya'
              text='As the CEO of Khabi-Teq, my vision is to redefine real estate in Nigeria by providing seamless, transparent, and innovative solutions for all our clients. With a passion for excellence and a commitment to integrity, my goal is to build a platform that connects people to opportunities, transforms lives, and drives growth in the real estate industry'
              title='CEO/Founder'
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const teamMembers: {
  image: StaticImport;
  name: string;
  positionHeld: string;
}[] = [
  {
    image: oladipoImage,
    name: 'Oladipo Onakoya',
    positionHeld: 'CEO/Founder',
  },
  {
    image: abisoyeImage,
    name: 'Abisoye Onakoya',
    positionHeld: 'Head of Operation',
  },

  {
    image: ayowoleImage,
    name: 'Ayowole Ajayi',
    positionHeld: 'CTO',
  },
  {
    image: fasimoye,
    name: 'Fasimoye Olatunji',
    positionHeld: 'Product Consultant',
  },
  {
    image: abolanleImage,
    name: 'Abolanle Okunade',
    positionHeld: 'Executive Assistant',
  },
  {
    image: adesayoImage,
    name: 'Adesayo Okubajo',
    positionHeld: `Business  Development
& Strategy Lead`,
  },
];

export default AboutUs;
