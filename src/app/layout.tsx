import './globals.css';
import HeaderFooterWrapper from '@/components/new-homepage/header_footer_wrapper';
import { epilogue, roboto, archivo, ubuntu } from '@/styles/font';
import { Toaster } from 'react-hot-toast';
import Body from '@/components/general-components/body';
import GlobalPropertyActionsFAB from '@/components/common/GlobalPropertyActionsFAB';
import SubscriptionFeaturesClient from '@/components/subscription/SubscriptionFeaturesClient';
import ChunkErrorHandler from '@/components/ChunkErrorHandler';
import { Suspense } from 'react';
import { lazy } from 'react';
import ReduxWrapper from '@/components/providers/ReduxWrapper';
import SubscriptionInitializer from '@/components/providers/SubscriptionInitializer';
import PromoMount from '@/components/promo/PromoMount';
import { ClientProviders } from '@/components/providers/ClientProviders';

// Lazy load WhatsApp widget - non-critical for initial render
const WhatsAppChatWidget = lazy(() => import('@/components/whatsapp-chat-widget'));

export const metadata = {
  title: 'Khabiteq',
  description:
    "Simplifying real estate transactions in Lagos. Buy, sell, rent, and manage properties with ease through Khabi-Teq's trusted platform",
  icons: {
    icon: '/khabi-teq.svg',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'https://www.khabiteqrealty.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxWrapper>
      <ClientProviders>
        <SubscriptionInitializer />
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${roboto.variable} ${archivo.variable} ${epilogue.variable} ${ubuntu.variable} antialiased`}
          >
            <div id="promo-top-placeholder" className="w-full overflow-hidden bg-transparent" />
            <HeaderFooterWrapper>
              <Body>{children}</Body>
            </HeaderFooterWrapper>
            <PromoMount slot="top-header" targetId="promo-top-placeholder" className="mb-2" height="h-20" />
            <GlobalPropertyActionsFAB />
            <SubscriptionFeaturesClient />
            <Suspense fallback={null}>
              <WhatsAppChatWidget />
            </Suspense>
            <Toaster />
            <ChunkErrorHandler />
          </body>
        </html>
      </ClientProviders>
    </ReduxWrapper>
  );
}
