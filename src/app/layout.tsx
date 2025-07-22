import type { Metadata } from 'next';
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
import GlobalInspectionFAB from '@/components/common/GlobalInspectionFAB';

const SHOW_COMING_SOON = false;

export const metadata: Metadata = {
  title: 'Khabiteq',
  description:
    "Simplifying real estate transactions in Lagos. Buy, sell, rent, and manage properties with ease through Khabi-Teq's trusted platform",
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
                  <HeaderFooterWrapper isComingSoon={SHOW_COMING_SOON}>
                    <Homepage />
                    <Countdown />
                  </HeaderFooterWrapper>
                  <Toaster />
                </body>
              </html>
            </SelectedBriefsProvider>
          </CreateBriefProvider>
        </PageContextProvider>
      </UserProvider>
    );
  }
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <UserProvider>
        <NotificationProvider>
          <ModalProvider>
            <PageContextProvider>
              <CreateBriefProvider>
                                <SelectedBriefsProvider>
                  <NewMarketplaceProvider>
                    <NegotiationContextWrapper>
                      <html lang="en">
                        <body
                          className={`${roboto.variable} ${archivo.variable} ${epilogue.variable} ${ubuntu.variable} antialiased`}
                        >
                          <HeaderFooterWrapper>
                            <Body>{children}</Body>
                          </HeaderFooterWrapper>
                          {/* GlobalInspectionFAB removed since inspection functionality was removed */}
                          <Toaster />
                        </body>
                      </html>
                    </NegotiationContextWrapper>
                  </NewMarketplaceProvider>
                </SelectedBriefsProvider>
              </CreateBriefProvider>
            </PageContextProvider>
          </ModalProvider>
        </NotificationProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}
