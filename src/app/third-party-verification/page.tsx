"use client"
import { AlertTriangle, FileX, ExternalLink } from 'lucide-react';

export default function DocumentVerificationNotFound() {
  return (
    <div className="min-h-screen bg-[#EEF1F1] flex items-center justify-center py-8 px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6">
            <FileX className="h-10 w-10 text-red-500" />
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Document Verification Not Found
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            The document verification URL you're trying to access is invalid or the document ID is missing.
            Please check your verification link or contact support for assistance.
          </p>

          {/* Error Details */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-sm font-medium text-amber-800 mb-1">
                  Valid URL Format Required
                </h3>
                <p className="text-sm text-amber-700">
                  Document verification URLs should follow this format:<br />
                  <code className="bg-amber-100 px-2 py-1 rounded text-xs font-mono">
                    /third-party-verification/[document-id]
                  </code>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="text-sm text-gray-500 mb-4">
              If you have a verification link, please use the complete URL provided in your email.
            </div>

            {/* Contact Support */}
            <div className="bg-[#0B423D] text-white p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <span>Email:</span>
                  <a
                    href="mailto:verification@khabi-teq.com"
                    className="text-[#8DDB90] hover:underline font-medium"
                  >
                    verification@khabi-teq.com
                  </a>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>Phone:</span>
                  <a
                    href="tel:+2348012345678"
                    className="text-[#8DDB90] hover:underline font-medium"
                  >
                    +234 (0) 801 234 5678
                  </a>
                </div>
              </div>
            </div>

            {/* Return to Main Site */}
            <a
              href="https://khabi-teq.com"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-[#0B423D] transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Return to Khabi-Teq Main Site</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
