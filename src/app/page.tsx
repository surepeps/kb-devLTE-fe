/** @format */

'use client';

import { Fragment } from 'react';
import '@/styles/stylish.modules.css';
import Homepage from '@/app/homepage/page';
import ErrorBoundary from '@/components/general-components/ErrorBoundary';

export default function Home() {
  return (
    <Fragment>
      <ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Application Error
              </h1>
              <p className="text-gray-600 mb-4">
                There was an error loading the application. Please check the console for more details.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#09391C] text-white rounded-lg hover:bg-[#0a4220] transition-colors"
              >
                Reload Application
              </button>
            </div>
          </div>
        }
        onError={(error, errorInfo) => {
          console.error('Root page error:', error);
          console.error('Error info:', errorInfo);
        }}
      >
        <Homepage />
      </ErrorBoundary>
    </Fragment>
  );
}
