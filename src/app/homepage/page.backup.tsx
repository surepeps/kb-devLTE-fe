/** @format */

"use client";
import React, { Fragment, Suspense, useEffect } from "react";
import Loading from "@/components/loading-component/loading";
import Section2 from "@/components/homepage/home_section2";
import SeeWhatOthers from "@/components/homepage/section2";
import Section3 from "@/components/homepage/section3";
import FAQs from "@/components/homepage/FAQs";
import Feedback from "@/components/homepage/feedback";
import HelpButton from "@/components/homepage/home_helpbutton";
import { useLoading } from "@/hooks/useLoading";
import HeroSection from "@/components/homepage/homepage_hero";
import Section1 from "@/components/homepage/home_section1";
import EmailVerification from "@/components/EmailVerification";
import AgentMarket from "@/components/homepage/agent_marketplace";
import { useRouter, useSearchParams } from "next/navigation";
import { URLS } from "@/utils/URLS";
import { GET_REQUEST } from "@/utils/requests";
import Cookies from "js-cookie";
import { useUserContext } from "@/context/user-context";
import HowItWorksSection from "@/components/homepage/how-it-works-section";
import ConnectBuyersSection from "@/components/homepage/connect-buyers-section";
import ClientTestimonials from "@/components/homepage/client-testimonials";
import ErrorBoundary from "@/components/general-components/ErrorBoundary";
import Link from "next/link";
import { motion } from "framer-motion";
import Countdown from "../coming-soon-modal/page";
import Agent from "../agent/page";

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

const Homepage = ({ isComingSoon }: { isComingSoon?: boolean }) => {
  //Simulating the loading page
  const isLoading = useLoading();

  const searchParams = useSearchParams();

  /**
   * using the useRouter from the next/navigation to simulate between pages
   */
  const router = useRouter();

  /**
   * UserContextAPI to store users information that could be accessed
   * globally in all the pages
   */
  const { setUser } = useUserContext();

  useEffect(() => {
    if (searchParams && searchParams?.get("access_token")) {
      const url =
        URLS.BASE +
        URLS.user +
        URLS.verifyEmail +
        `?access_token=${searchParams?.get("access_token")}`;

      (async () => {
        await GET_REQUEST(url).then((response: VerifiedUser) => {
          if ((response as unknown as { id: string; token: string }).id) {
            Cookies.set(
              "token",
              (response as unknown as { token: string }).token,
            );

            const user = response as unknown as {
              id: string;
              email: string;
              password: string;
              lastName: string;
              firstName: string;
              phoneNumber: string;
              accountApproved: boolean;
              userType: string;
            };

            setUser(user);
            if (user.userType === "Landowners") {
              router.push("/auth/login");
            }
            if (user.userType === "Agent") {
              router.push("/agent/onboard");
            } else {
              router.push("/dashboard");
            }
          }
        });
      })();
    }
  });

  if (isComingSoon) {
    return <Countdown />;
  }

  return (
    <Fragment>
      <section className="w-full h-full">
        <main className="w-full h-full">
          <HeroSection />
          <div className="w-full bg-[#FEFEFE] relative z-[1]">
            <div className="w-full py-8 px-4 text-center">
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

const HomepageWrapper = ({ isComingSoon }: { isComingSoon?: boolean }) => (
  <Suspense fallback={<Loading />}>
    <Homepage isComingSoon={isComingSoon} />
  </Suspense>
);

export default HomepageWrapper;
