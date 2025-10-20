import './globals.css';
import { PageContextProvider } from '@/context/page-context';
import HeaderFooterWrapper from '@/components/new-homepage/header_footer_wrapper';
import { epilogue, roboto, archivo, ubuntu } from '@/styles/font';
import { Toaster } from 'react-hot-toast';
import Body from '@/components/general-components/body';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from '@/context/user-context';
import { NotificationProvider } from '@/context/notification-context';
import { ModalProvider } from '@/context/modalContext';
import { NewMarketplaceProvider } from '@/context/new-marketplace-context';
import { SelectedBriefsProvider } from '@/context/selected-briefs-context';
import { GlobalPropertyActionsProvider } from '@/context/global-property-actions-context';
import NegotiationContextWrapper from '@/components/common/NegotiationContextWrapper';
import GlobalPropertyActionsFAB from '@/components/common/GlobalPropertyActionsFAB';
import SubscriptionFeaturesClient from '@/components/subscription/SubscriptionFeaturesClient';
import ChunkErrorHandler from '@/components/ChunkErrorHandler';
import { lazy, Suspense } from 'react';

// Lazy load WhatsApp widget - non-critical for initial render
const WhatsAppChatWidget = lazy(() => import('@/components/whatsapp-chat-widget'));

export const metadata = {
  title: 'Khabiteq',
  description:
    "Simplifying real estate transactions in Lagos. Buy, sell, rent, and manage properties with ease through Khabi-Teq's trusted platform",
  icons: {
    icon: '/khabi-teq.svg',
  },
};

import ReduxWrapper from '@/components/providers/ReduxWrapper';
import SubscriptionInitializer from '@/components/providers/SubscriptionInitializer';

// Promo provider
import { PromoProvider } from '@/context/promo-context';
// Promo mount client component
import PromoMount from '@/components/promo/PromoMount';
// FontAwesome configuration
import '@/utils/fontawesome';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'google-client-id-not-configured'}>
      <ReduxWrapper>
        <UserProvider>
          <SubscriptionInitializer />
          <NotificationProvider>
            <ModalProvider>
              <PageContextProvider>
                <SelectedBriefsProvider>
                  <NewMarketplaceProvider>
                    <GlobalPropertyActionsProvider>
                      <NegotiationContextWrapper>
                        <PromoProvider>
                          <html lang="en" suppressHydrationWarning>
                            <body
                              className={`${roboto.variable} ${archivo.variable} ${epilogue.variable} ${ubuntu.variable} antialiased`}
                            >
                              {/* Promo placeholder - no height reserved, only sized when ads exist */}
                              <div id="promo-top-placeholder" className="w-full overflow-hidden bg-transparent" />

                              <HeaderFooterWrapper>
                                <Body>{children}</Body>
                              </HeaderFooterWrapper>
                              {/* Client mounts BannerSlot into the placeholder without changing DOM structure during hydration */}
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
                        </PromoProvider>
                      </NegotiationContextWrapper>
                    </GlobalPropertyActionsProvider>
                  </NewMarketplaceProvider>
                </SelectedBriefsProvider>
            </PageContextProvider>
          </ModalProvider>
        </NotificationProvider>
        </UserProvider>
      </ReduxWrapper>
    </GoogleOAuthProvider>
  );
}
