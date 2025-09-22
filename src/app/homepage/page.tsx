/** @format */

"use client";
import React, { Fragment, Suspense} from "react";
import Loading from "@/components/loading-component/loading";
import Section2 from "@/components/homepage/home_section2";
import SeeWhatOthers from "@/components/homepage/section2";
import Section3 from "@/components/homepage/section3";
import FAQs from "@/components/homepage/FAQs";
import HelpButton from "@/components/homepage/home_helpbutton";
import { useLoading } from "@/hooks/useLoading";
import HeroSection from "@/components/homepage/homepage_hero";
import Section1 from "@/components/homepage/home_section1";
import EmailVerification from "@/components/EmailVerification";
import HowItWorksSection from "@/components/homepage/how-it-works-section";
import ConnectBuyersSection from "@/components/homepage/connect-buyers-section";
import ClientTestimonials from "@/components/homepage/client-testimonials";
import ErrorBoundary from "@/components/general-components/ErrorBoundary";
import Link from "next/link";
import { motion } from "framer-motion";
import PromoMount from '@/components/promo/PromoMount';

/**
 * @Homepage - A function that returns the web homepage
 * @param - no parameters
 *
 * @returns - Homepage contents
 */

interface VerifiedUser {
  id: string;
  token: string;
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  accountApproved: boolean;
  userType: string;
}

const Homepage = ({
  isComingSoon = false,
}: { isComingSoon?: boolean } = {}) => {
  //Simulating the loading page
  const isLoading = useLoading();

  /**
   * if else statement to simulate the loading page for 3 secs then return the actual homepage
   */
  if (isLoading) return <Loading />;

  return (
    <Fragment>
      {/* Homepage top banner placeholder */}
      <div id="promo-homepage-top" className="w-full overflow-hidden bg-transparent h-36 mb-4">
        <div className="container mx-auto px-4 h-full flex items-center justify-center bg-[#F8FAFC] border border-dashed border-gray-200">
          <div className="flex items-center gap-4">
            <img src="/khabi-teq.svg" alt="promo-sample" className="h-20 w-auto object-contain" />
            <div>
              <div className="text-lg font-semibold">Promote with Khabi-Teq</div>
              <div className="text-sm text-gray-500">Your banner could appear here — contact us to advertise</div>
            </div>
          </div>
        </div>
      </div>
      <PromoMount slot="homepage-top" targetId="promo-homepage-top" height="h-36" />
      <section className={`w-full filter ${isComingSoon && "blur-sm"}`}>
        <main className="w-full bg-[#EEF1F1]">
          {/**
           * Hero Section Component ~ Takes no props
           */}
          <HeroSection />

          {/* Inline homepage banner after hero */}
          <div id="promo-homepage-inline" className="w-full overflow-hidden bg-transparent h-28 my-6">
            <div className="container mx-auto px-4 h-full flex items-center justify-center bg-[#FFFFFF] border border-dashed border-gray-200">
              <div className="flex items-center gap-4">
                <img src="/check.svg" alt="promo-sample" className="h-12 w-auto object-contain" />
                <div>
                  <div className="text-sm font-semibold">Advert slot</div>
                  <div className="text-xs text-gray-500">This space is available for promotions</div>
                </div>
              </div>
            </div>
          </div>
          <PromoMount slot="homepage-inline" targetId="promo-homepage-inline" height="h-28" />
          {/**Details About website Componet ~ Takes no props */}
          <Section1 />
          {/**
           * Why Khabi-Teq Is Your Trusted Real Estate Partner Component
           * Takes no props
           */}
          <Section2 />
          <div className="flex justify-center items-center">
            <div className="container min-h-[135px] flex md:flex-row flex-col gap-[10px] items-start py-[20px] md:items-center justify-between bg-[#093B6D] px-[20px] md:px-[30px]">
              <div className="flex flex-col gap-[10px]">
                <motion.h2
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-3xl text-[#FFFFFF] font-bold"
                >
                  Find Your Ideal Property, Effortlessly
                </motion.h2>
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-lg md:text-xl font-bold text-[#FFFFFF]"
                >
                  Tell us what you need — we&apos;ll show you matching
                  properties.
                </motion.h3>
              </div>
              <Link href={"/preference"}>
                <motion.button
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  type="button"
                  className="h-[50px] lg:w-[275px] px-[12px] md:px-0 bg-[#8DDB90] text-base font-bold text-white"
                >
                  Submit Your Preference
                </motion.button>
              </Link>
            </div>
          </div>
          {/* <NewSection /> */}
          <HowItWorksSection />
          <ErrorBoundary
            fallback={
              <div className="w-full bg-[#8DDB901A] py-16">
                <div className="container mx-auto px-4 text-center">
                  <p className="text-gray-600">
                    Unable to load property listings at the moment.
                  </p>
                </div>
              </div>
            }
          >
            <SeeWhatOthers />
          </ErrorBoundary>
          <ConnectBuyersSection />
          <Section3
            isHomepage={true}
            isAgentPage={false}
            heading="Highlight of our real estate expertise"
            headingColor="#09391C"
          />
          <FAQs isHomePage={true} />
          <ErrorBoundary
            fallback={
              <div className="w-full bg-[#F5F7F9] py-16">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-[35px] text-[#09391C] font-bold mb-4">
                    What our clients are saying
                  </h2>
                  <p className="text-gray-600">
                    Unable to load testimonials at the moment.
                  </p>
                </div>
              </div>
            }
          >
            <ClientTestimonials />
          </ErrorBoundary>
          {/* <Feedback /> */}
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
