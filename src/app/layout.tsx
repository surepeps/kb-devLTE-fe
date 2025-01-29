/** @format */
import type { Metadata } from 'next';
import './globals.css';
import { PageContextProvider } from '@/context/page-context';
import { epilogue, roboto, archivo } from '@/styles/font';
import HeaderFooterWrapper from '@/components/header_footer_wrapper';

export const metadata: Metadata = {
  title: 'Khabiteq',
  description: 'Simplifying real estate transactions in Lagos. Buy, sell, rent, and manage properties with ease through Khabi-Teq’s trusted platform',
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
        <body
          className={`${roboto.variable} ${archivo.variable} ${epilogue.variable} antialiased`}>
          {' '}
          {/*This was refactored to accomodate Admin routes without the Header and Footer  ||Gb */}
          <HeaderFooterWrapper>{children}</HeaderFooterWrapper>
        </body>
      </html>
    </PageContextProvider>
  );
}
