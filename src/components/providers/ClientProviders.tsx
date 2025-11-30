'use client';

import { Suspense, ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from '@/context/user-context';
import { NotificationProvider } from '@/context/notification-context';
import { ModalProvider } from '@/context/modalContext';
import { NewMarketplaceProvider } from '@/context/new-marketplace-context';
import { SelectedBriefsProvider } from '@/context/selected-briefs-context';
import { GlobalPropertyActionsProvider } from '@/context/global-property-actions-context';
import NegotiationContextWrapper from '@/components/common/NegotiationContextWrapper';
import { PromoProvider } from '@/context/promo-context';
import { PageContextProvider } from '@/context/page-context';

interface ClientProvidersProps {
  children: ReactNode;
}

/**
 * Critical providers loaded immediately (user auth, OAuth)
 * These are essential for initial page load
 */
function CriticalProviders({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'google-client-id-not-configured'}>
      <UserProvider>
        {children}
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

/**
 * Deferred providers loaded with Suspense
 * These are non-critical UI state providers that can load after initial render
 */
function DeferredProviders({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <NotificationProvider>
        <ModalProvider>
          <PageContextProvider>
            <SelectedBriefsProvider>
              <NewMarketplaceProvider>
                <GlobalPropertyActionsProvider>
                  <NegotiationContextWrapper>
                    <PromoProvider>
                      {children}
                    </PromoProvider>
                  </NegotiationContextWrapper>
                </GlobalPropertyActionsProvider>
              </NewMarketplaceProvider>
            </SelectedBriefsProvider>
          </PageContextProvider>
        </ModalProvider>
      </NotificationProvider>
    </Suspense>
  );
}

/**
 * Root client providers composition
 * Splits critical and deferred providers to optimize initial load time
 */
export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CriticalProviders>
      <DeferredProviders>
        {children}
      </DeferredProviders>
    </CriticalProviders>
  );
}
