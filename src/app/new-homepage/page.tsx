/** @format */

"use client";
import React, { Fragment, Suspense } from "react";
import Loading from "@/components/loading-component/loading";
import { useLoading } from "@/hooks/useLoading";
import ErrorBoundary from "@/components/general-components/ErrorBoundary";
import EmailVerification from "@/components/EmailVerification";

// New landing page components
import NewHeroSection from "@/components/homepage/new-hero-section";
import KeyFeaturesSection from "@/components/homepage/key-features-section";
import ValuePropositionSection from "@/components/homepage/value-proposition-section";
import FeaturedPropertiesSection from "@/components/homepage/featured-properties-section";
import SocialProofSection from "@/components/homepage/social-proof-section";
import ForAgentsSection from "@/components/homepage/for-agents-section";
import SecurityTransparencySection from "@/components/homepage/security-transparency-section";
import FinalCTASection from "@/components/homepage/final-cta-section";
import NewFooter from "@/components/homepage/new-footer";
import EnhancedHeader from "@/components/homepage/enhanced-header";

/**
 * @NewHomepage - Modern, redesigned landing page following the new specifications
 * Features: Clean design, mobile-first, Nigerian real estate focus
 * Design feel: Airbnb meets Nigerian real estate flavor
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

const NewHomepage = ({
  isComingSoon = false,
}: { isComingSoon?: boolean } = {}) => {
  // Simulating the loading page
  const isLoading = useLoading();

  /**
   * Loading state - show loading component for 3 seconds then render the page
   */
  if (isLoading) return <Loading />;

  return (
    <Fragment>
      {/* Enhanced Header */}
      {/* <EnhancedHeader isComingSoon={isComingSoon} /> */}

      <section className={`w-full filter ${isComingSoon && "blur-sm"}`}>
        <main className="w-full bg-white">
          
          {/* 1. ABOVE THE FOLD (First Screen View) */}
          <ErrorBoundary
            fallback={
              <div className="w-full min-h-[600px] bg-[#0B423D] flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl font-bold mb-4">Find the Perfect Property</h1>
                  <p className="text-xl">Unable to load hero section at the moment.</p>
                </div>
              </div>
            }>
            <NewHeroSection />
          </ErrorBoundary>

          {/* 2. QUICK VALUE PROPOSITION SECTION */}
          <ErrorBoundary
            fallback={
              <div className="w-full py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl font-bold text-[#09391C] mb-4">Why Choose Khabiteq?</h2>
                  <p className="text-gray-600">Unable to load value proposition section.</p>
                </div>
              </div>
            }>
            <ValuePropositionSection />
          </ErrorBoundary>

          {/* 3. HOW KHABITEQ WORKS */}
          <ErrorBoundary
            fallback={
              <div className="w-full py-16 bg-[#0B423D]">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">How Khabiteq Works</h2>
                  <p className="text-gray-200">Unable to load how it works section.</p>
                </div>
              </div>
            }>
            <NewHowItWorksSection />
          </ErrorBoundary>

          {/* 4. SOCIAL PROOF & TRUST SIGNALS */}
          <ErrorBoundary
            fallback={
              <div className="w-full py-16 bg-[#F5F7F9]">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl font-bold text-[#09391C] mb-4">Trusted by Thousands</h2>
                  <p className="text-gray-600">Unable to load testimonials and stats.</p>
                </div>
              </div>
            }>
            <SocialProofSection />
          </ErrorBoundary>

          {/* 5. FOR AGENTS SECTION */}
          <ErrorBoundary
            fallback={
              <div className="w-full py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl font-bold text-[#09391C] mb-4">For Real Estate Agents</h2>
                  <p className="text-gray-600">Unable to load agent information.</p>
                </div>
              </div>
            }>
            <ForAgentsSection />
          </ErrorBoundary>

          {/* 6. SECURITY & TRANSPARENCY SECTION */}
          <ErrorBoundary
            fallback={
              <div className="w-full py-16 bg-[#09391C]">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">Security & Transparency</h2>
                  <p className="text-gray-200">Unable to load security information.</p>
                </div>
              </div>
            }>
            <SecurityTransparencySection />
          </ErrorBoundary>

          {/* 7. FINAL CALL TO ACTION (BOTTOM) */}
          <ErrorBoundary
            fallback={
              <div className="w-full py-16 bg-[#8DDB90]">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-4xl font-bold text-white mb-6">Get Started Today</h2>
                  <button className="bg-[#09391C] text-white px-8 py-4 rounded-full font-bold">
                    Get Started Now
                  </button>
                </div>
              </div>
            }>
            <FinalCTASection />
          </ErrorBoundary>
        </main>

        {/* 8. FOOTER */}
        <ErrorBoundary
          fallback={
            <footer className="w-full bg-[#0B423D] py-16">
              <div className="container mx-auto px-4 text-center">
                <p className="text-white">© 2024 Khabiteq Realty Limited. All rights reserved.</p>
              </div>
            </footer>
          }>
          <NewFooter isComingSoon={isComingSoon} />
        </ErrorBoundary>
      </section>

      {/* Email Verification Modal */}
      <Suspense fallback={<Loading />}>
        <EmailVerification />
      </Suspense>
    </Fragment>
  );
};

const NewHomepageWrapper = () => (
  <Suspense fallback={<Loading />}>
    <NewHomepage />
  </Suspense>
);

export default NewHomepageWrapper;
