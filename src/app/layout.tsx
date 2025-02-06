/** @format */
/* eslint-disable @next/next/no-page-custom-font */

import type { Metadata } from 'next';
import './globals.css';
import { PageContextProvider } from '@/context/page-context';
import HeaderFooterWrapper from '@/components/header_footer_wrapper';
//import Header from '@/components/header';
import { epilogue, roboto, archivo, ubuntu } from '@/styles/font';
import { Toaster } from 'react-hot-toast';

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
  return (
    <PageContextProvider>
      <html lang='en'>
        <head>
          <link
            href='https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600&display=swap'
            rel='stylesheet'
          />
        </head>
        <body
          className={`${roboto.variable} ${archivo.variable} ${epilogue.variable} ${ubuntu.variable} antialiased`}>
          {' '}
          {/*This was refactored to accomodate Admin routes without the Header and Footer  ||Gb */}
          <HeaderFooterWrapper>{children}</HeaderFooterWrapper>
          <Toaster />
        </body>
      </html>
    </PageContextProvider>
  );
}
