import './globals.css';
import { PageContextProvider } from '@/context/page-context';
import HeaderFooterWrapper from '@/components/homepage/header_footer_wrapper';
import { epilogue, roboto, archivo, ubuntu } from '@/styles/font';
import { Toaster } from 'react-hot-toast';
import Body from '@/components/general-components/body';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from '@/context/user-context';
import { CreateBriefProvider } from '@/context/create-brief-context';
import { SelectedBriefsProvider } from '@/context/selected-briefs-context';
import Homepage from '@/app/homepage/page';
import Countdown from './coming-soon-modal/page';
import { NotificationProvider } from '@/context/notification-context';
import { ModalProvider } from '@/context/modalContext';
import { NewMarketplaceProvider } from '@/context/new-marketplace-context';

import { GlobalPropertyActionsProvider } from '@/context/global-property-actions-context';
import NegotiationContextWrapper from '@/components/common/NegotiationContextWrapper';
import GlobalPropertyActionsFAB from '@/components/common/GlobalPropertyActionsFAB';
import SubscriptionFeaturesClient from '@/components/subscription/SubscriptionFeaturesClient';
import ChunkErrorHandler from '@/components/ChunkErrorHandler';
import WhatsAppChatWidget from '@/components/whatsapp-chat-widget';

const SHOW_COMING_SOON = false;

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (SHOW_COMING_SOON) {
    return (
      <ReduxWrapper>
        <UserProvider>
          <SubscriptionInitializer />
          <PageContextProvider>
            <CreateBriefProvider>
              <SelectedBriefsProvider>
                <html lang="en" suppressHydrationWarning>
                  <body
                    className={`${roboto.variable} ${archivo.variable} ${epilogue.variable} ${ubuntu.variable} antialiased`}
                  >
                    <HeaderFooterWrapper isComingSoon={SHOW_COMING_SOON}>
                      <Homepage />
                      <Countdown />
                    </HeaderFooterWrapper>
                    <WhatsAppChatWidget />
                    <Toaster />
                  </body>
                </html>
              </SelectedBriefsProvider>
            </CreateBriefProvider>
          </PageContextProvider>
        </UserProvider>
      </ReduxWrapper>
    );
  }
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'google-client-id-not-configured'}>
      <ReduxWrapper>
        <UserProvider>
          <SubscriptionInitializer />
          <NotificationProvider>
            <ModalProvider>
              <PageContextProvider>
                <CreateBriefProvider>
                  <SelectedBriefsProvider>
                  <NewMarketplaceProvider>
                    <GlobalPropertyActionsProvider>
                      <NegotiationContextWrapper>
                        <PromoProvider>
                          <html lang="en" suppressHydrationWarning>
                            <body
                              className={`${roboto.variable} ${archivo.variable} ${epilogue.variable} ${ubuntu.variable} antialiased`}
                            >
                              {/* Server-rendered placeholder for top promo banner to avoid hydration mismatch */}
                              <div id="promo-top-placeholder" className="w-full overflow-hidden bg-transparent h-20">
                                <div className="container mx-auto px-4 h-full flex items-center justify-center bg-[#F8FAFC] border border-dashed border-gray-200">
                                  <div className="flex items-center gap-4">
                                    <img src="/placeholder-property.svg" alt="promo-sample" className="h-12 w-auto object-contain" />
                                    <div>
                                      <div className="text-sm font-semibold">Place your advert here</div>
                                      <div className="text-xs text-gray-500">Reach thousands of visitors — contact us to advertise</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <HeaderFooterWrapper>
                                <Body>{children}</Body>
                              </HeaderFooterWrapper>
                              {/* Client mounts BannerSlot into the placeholder without changing DOM structure during hydration */}
                              <PromoMount slot="top-header" targetId="promo-top-placeholder" className="mb-2" height="h-20" />
                              <GlobalPropertyActionsFAB />
                              <SubscriptionFeaturesClient />
                              <WhatsAppChatWidget />
                              <Toaster />
                              <ChunkErrorHandler />
                            </body>
                          </html>
                        </PromoProvider>
                      </NegotiationContextWrapper>
                    </GlobalPropertyActionsProvider>
                  </NewMarketplaceProvider>
                </SelectedBriefsProvider>
              </CreateBriefProvider>
            </PageContextProvider>
          </ModalProvider>
        </NotificationProvider>
        </UserProvider>
      </ReduxWrapper>
    </GoogleOAuthProvider>
  );
}
