"use client";
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import SubscriptionInitializer from './SubscriptionInitializer';

export default function ReduxWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SubscriptionInitializer />
      {children}
    </Provider>
  );
}
