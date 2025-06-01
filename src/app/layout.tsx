/** @format */

import type { Metadata } from 'next';
import './globals.css';
import { PageContextProvider } from '@/context/page-context';
import HeaderFooterWrapper from '@/components/homepage/header_footer_wrapper';
//import Header from '@/components/header';
import { epilogue, roboto, archivo, ubuntu } from '@/styles/font';
import { Toaster } from 'react-hot-toast';
import Body from '@/components/general-components/body';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from '@/context/user-context';
import { CreateBriefProvider } from '@/context/create-brief-context';
import { SelectedBriefsProvider } from '@/context/selected-briefs-context';
import Homepage from '@/app/homepage/page';
import Countdown from './coming-soon-modal/page';
import { GoogleAnalytics } from '@next/third-parties/google';

const SHOW_COMING_SOON = true;

export const metadata: Metadata = {
  title: 'Khabiteq',
  description:
    'Simplifying real estate transactions in Lagos. Buy, sell, rent, and manage properties with ease through Khabi-Teq’s trusted platform',
  icons: {
    icon: '/khabi-teq.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (SHOW_COMING_SOON) {
    return (
      <UserProvider>
        <PageContextProvider>
          <CreateBriefProvider>
            <SelectedBriefsProvider>
              <html lang="en">
                <body
                  className={`${roboto.variable} ${archivo.variable} ${epilogue.variable} ${ubuntu.variable} antialiased`}
                >
                  {' '}
                  {/*This was refactored to accomodate Admin routes without the Header and Footer  ||Gb */}
                  <HeaderFooterWrapper isComingSoon={SHOW_COMING_SOON}>
                    <Homepage isComingSoon={SHOW_COMING_SOON} />
                    <Countdown />
                  </HeaderFooterWrapper>
                  <Toaster />
                </body>
                <GoogleAnalytics gaId="G-9Y0M3GTLDT" />
              </html>
            </SelectedBriefsProvider>
          </CreateBriefProvider>
        </PageContextProvider>
      </UserProvider>
    );
  }
  return (
    <UserProvider>
      <PageContextProvider>
        <CreateBriefProvider>
          <SelectedBriefsProvider>
            <html lang="en">
              <body
                className={`${roboto.variable} ${archivo.variable} ${epilogue.variable} ${ubuntu.variable} antialiased`}
              >
                {' '}
                {/*This was refactored to accomodate Admin routes without the Header and Footer  ||Gb */}
                <HeaderFooterWrapper>
                  <Body>
                    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                      {children}
                    </GoogleOAuthProvider>
                  </Body>
                </HeaderFooterWrapper>
                <Toaster />
              </body>
              <GoogleAnalytics gaId="G-9Y0M3GTLDT" />
            </html>
          </SelectedBriefsProvider>
        </CreateBriefProvider>
      </PageContextProvider>
    </UserProvider>
  );
}
