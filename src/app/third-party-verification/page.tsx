"use client"
import React, { useState, useRef } from 'react';

export const metadata = {
  title: 'Third Party Document Verification - Khabi-Teq',
  description: 'Verify documents submitted for third-party verification',
};
import { CheckCircle, XCircle, Upload, FileText, Download, Eye, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

// Types for verification data
type DocumentStatus = 'pending' | 'validated' | 'rejected';

type Document = {
  id: string;
  type: string;
  fileName: string;
  uploadedAt: string;
  submittedBy: string;
  status: DocumentStatus;
  documentUrl?: string;
  thumbnailUrl?: string;
};

type RejectionData = {
  reason: string;
  report: string;
  expectedDocumentFile: File | null;
  expectedDocumentUrl: string;
};

// Mock document data (in real app, this would come from API)
const mockDocuments: Document[] = [
  {
    id: '1',
    type: 'Certificate of Occupancy',
    fileName: 'certificate_of_occupancy_lagos_001.pdf',
    uploadedAt: '2024-01-15T10:30:00Z',
    submittedBy: 'John Doe (john.doe@email.com)',
    status: 'pending',
    documentUrl: '/placeholder-property.svg',
    thumbnailUrl: '/placeholder-property.svg'
  },
  {
    id: '2',
    type: 'Deed of Assignment',
    fileName: 'deed_assignment_victoria_island.pdf',
    uploadedAt: '2024-01-15T09:15:00Z',
    submittedBy: 'Jane Smith (jane.smith@email.com)',
    status: 'pending',
    documentUrl: '/placeholder-property.svg',
    thumbnailUrl: '/placeholder-property.svg'
  }
];

const ThirdPartyVerificationPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionData, setRejectionData] = useState<RejectionData>({
    reason: '',
    report: '',
    expectedDocumentFile: null,
    expectedDocumentUrl: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidateDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowValidationModal(true);
  };

  const handleRejectDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowRejectionModal(true);
  };

  const confirmValidation = async () => {
    if (!selectedDocument) return;

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update document status
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === selectedDocument.id 
            ? { ...doc, status: 'validated' as DocumentStatus }
            : doc
        )
      );
      
      toast.success('Document validated successfully!');
      setShowValidationModal(false);
      setSelectedDocument(null);
    } catch (error) {
      toast.error('Failed to validate document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, JPEG, or PNG file');
        return;
      }

      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setRejectionData(prev => ({
        ...prev,
        expectedDocumentFile: file,
        expectedDocumentUrl: URL.createObjectURL(file)
      }));
      toast.success('Expected document uploaded');
    }
  };

  const confirmRejection = async () => {
    if (!selectedDocument || !rejectionData.reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update document status
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === selectedDocument.id 
            ? { ...doc, status: 'rejected' as DocumentStatus }
            : doc
        )
      );
      
      toast.success('Document rejected with feedback sent');
      setShowRejectionModal(false);
      setSelectedDocument(null);
      setRejectionData({
        reason: '',
        report: '',
        expectedDocumentFile: null,
        expectedDocumentUrl: ''
      });
    } catch (error) {
      toast.error('Failed to reject document');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'validated':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Validated
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Third Party Document Verification Page
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Review and verify documents submitted for third-party verification. 
            You can validate authentic documents or reject them with detailed feedback.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documents.filter(doc => doc.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Validated</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documents.filter(doc => doc.status === 'validated').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documents.filter(doc => doc.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Documents for Verification</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {documents.map((document) => (
              <div key={document.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Document Thumbnail */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {document.type}
                        </h3>
                        {getStatusBadge(document.status)}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        File: {document.fileName}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Submitted by: {document.submittedBy}
                      </p>
                      <p className="text-sm text-gray-500">
                        Uploaded: {formatDate(document.uploadedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    {/* Preview Button */}
                    <button
                      onClick={() => document.documentUrl && window.open(document.documentUrl, '_blank')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => document.documentUrl && window.open(document.documentUrl, '_blank')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>

                    {/* Action Buttons (only for pending documents) */}
                    {document.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleValidateDocument(document)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Validate
                        </button>

                        <button
                          onClick={() => handleRejectDocument(document)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500">There are no documents pending verification at this time.</p>
            </div>
          )}
        </div>
      </div>

      {/* Validation Confirmation Modal */}
      {showValidationModal && selectedDocument && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Validate Document
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to validate "{selectedDocument.type}"? 
                  This action will mark the document as verified and authentic.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmValidation}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Validation'}
                </button>
                <button
                  onClick={() => setShowValidationModal(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 mt-3 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedDocument && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 ml-4">
                  Reject Document: {selectedDocument.type}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Rejection Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Rejection *
                  </label>
                  <select
                    value={rejectionData.reason}
                    onChange={(e) => setRejectionData(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select a reason</option>
                    <option value="invalid-document">Invalid or Fake Document</option>
                    <option value="poor-quality">Poor Image Quality</option>
                    <option value="incomplete-information">Incomplete Information</option>
                    <option value="wrong-document-type">Wrong Document Type</option>
                    <option value="expired-document">Expired Document</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Upload Expected Document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Expected Document Type (Optional)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 cursor-pointer transition-colors"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    {rejectionData.expectedDocumentFile ? (
                      <div className="flex items-center justify-center">
                        <FileText className="h-8 w-8 text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          {rejectionData.expectedDocumentFile.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload an example of the expected document format
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supports PDF, JPEG, PNG files
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Full Report */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Report (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={rejectionData.report}
                    onChange={(e) => setRejectionData(prev => ({ ...prev, report: e.target.value }))}
                    placeholder="Provide detailed feedback about why this document was rejected and what the submitter should do to correct it..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRejection}
                  disabled={isProcessing || !rejectionData.reason.trim()}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThirdPartyVerificationPage;
