/** @format */

'use client';
//import Image from "next/image";
import { Fragment, useEffect, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import '@/styles/stylish.modules.css';
import HeroSection from '@/components/hero';
import Loading from '@/components/loading';
import Section1 from '@/components/section1';
import Section2 from '@/components/section2';
import Section3 from '@/components/section3';
import Section4 from '@/components/section4';
import Feedback from '@/components/feedback';

export default function Home() {
  //Simulating the loading page
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeOutID = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeOutID);
  }, []);

  if (isLoading) return <Loading />;
  return (
    <Fragment>
      <Header />
      <main className='w-full pb-[30px]'>
        <HeroSection />
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Feedback />
      </main>
      <Footer />
    </Fragment>
  );
}
