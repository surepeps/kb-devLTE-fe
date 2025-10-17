/** @format */

"use client";
import React, { Fragment, Suspense } from "react";
import Loading from "@/components/loading-component/loading";
import { useLoading } from "@/hooks/useLoading";
import { useHomePageSettings } from "@/hooks/useSystemSettings";
import ErrorBoundary from "@/components/general-components/ErrorBoundary";
import EmailVerification from "@/components/EmailVerification";
import DevelopmentNotice from "@/components/general-components/DevelopmentNotice";
   
// New landing page components
import NewHeroSection from "@/components/new-homepage/new-hero-section";
import KeyFeaturesSection from "@/components/new-homepage/key-features-section";
import ValuePropositionSection from "@/components/new-homepage/value-proposition-section";
import FeaturedPropertiesSection from "@/components/new-homepage/featured-properties-section";
import SocialProofSection from "@/components/new-homepage/social-proof-section";
import ForAgentsSection from "@/components/new-homepage/for-agents-section";
import SecurityTransparencySection from "@/components/new-homepage/security-transparency-section";
import FinalCTASection from "@/components/new-homepage/final-cta-section";

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
  // Get settings loading state 
  const { loading: settingsLoading } = useHomePageSettings();

  /**
   * Loading state - show loading component for 3 seconds OR until settings are loaded
   */
  if (isLoading || settingsLoading) return <Loading />;

  return (
    <Fragment>

      <section className={`w-full filter ${isComingSoon && "blur-sm"}`}>
        <main className="w-full bg-[#FFFEFB]">

          {/* 1. HERO SECTION */}
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

          {/* 2. KEY FEATURES SECTION */}
          <ErrorBoundary
            fallback={
              <div className="w-full py-16 bg-[#FFFEFB]">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl font-bold text-[#09391C] mb-4">Key Features</h2>
                  <p className="text-gray-600">Unable to load key features section.</p>
                </div>
              </div>
            }>
            <KeyFeaturesSection />
          </ErrorBoundary>

          {/* 3. VALUE PROPOSITION SECTION (Replacement from Section 2) */}
          <ErrorBoundary
            fallback={
              <div className="w-full py-16 bg-[#FFFEFB]">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl font-bold text-[#09391C] mb-4">Why Choose Khabiteq?</h2>
                  <p className="text-gray-600">Unable to load value proposition section.</p>
                </div>
              </div>
            }>
            <ValuePropositionSection />
          </ErrorBoundary>

          {/* 4. FEATURED PROPERTIES SECTION */}
          <ErrorBoundary
            fallback={
              <div className="w-full py-16 bg-[#FFFEFB]">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl font-bold text-[#09391C] mb-4">Featured Properties</h2>
                  <p className="text-gray-600">Unable to load featured properties section.</p>
                </div>
              </div>
            }>
            <FeaturedPropertiesSection />
          </ErrorBoundary>

          {/* 5. REVIEWS & COUNTERS (SOCIAL PROOF & TRUST SIGNALS) */}
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

          {/* 6. FOR REAL ESTATE AGENTS SECTION */}
          <ErrorBoundary
            fallback={
              <div className="w-full py-16 bg-[#FFFEFB]">
                <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl font-bold text-[#09391C] mb-4">For Real Estate Agents</h2>
                  <p className="text-gray-600">Unable to load agent information.</p>
                </div>
              </div>
            }>
            <ForAgentsSection />
          </ErrorBoundary>

          {/* 7. SECURITY & TRANSPARENCY SECTION */}
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

          {/* 8. FINAL CALL TO ACTION (BOTTOM) */}
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
      </section>

      {/* Email Verification Modal */}
      <Suspense fallback={<Loading />}>
        <EmailVerification />
      </Suspense>

      {/* Development Notice */}
      <DevelopmentNotice />
    </Fragment>
  );
};

const NewHomepageWrapper = () => (
  <Suspense fallback={<Loading />}>
    <NewHomepage />
  </Suspense>
);

export default NewHomepageWrapper;
