"use client"
import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, XCircle, Upload, FileText, Download, Eye, AlertTriangle, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { URLS } from '@/utils/URLS';
import { POST_REQUEST, POST_REQUEST_FILE_UPLOAD, GET_REQUEST } from '@/utils/requests';

// Types for verification data
type DocumentStatus = 'pending' | 'validated' | 'rejected';

type Document = {
  documentType: string;
  documentNumber: string;
  documentUrl: string;
};

type DocumentDetails = {
  _id: string;
  customId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  amountPaid: number;
  documents: Document[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

type ReportDocument = {
  originalDocumentType: string;
  newDocumentUrl?: string;
  description: string;
  status: 'verified' | 'rejected';
};

type RejectionData = {
  reason: string;
  report: string;
  expectedDocumentFile: File | null;
  expectedDocumentUrl: string;
};

type TokenValidationResponse = {
  isValid: boolean;
  documents: Document[];
  message?: string;
};

const ThirdPartyVerificationPage: React.FC = () => {
  const params = useParams();
  const documentID = params.documentID as string;
  
  // Token validation state
  const [isTokenValidated, setIsTokenValidated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isValidatingToken, setIsValidatingToken] = useState(false);

  // Document verification state
  const [documentDetails, setDocumentDetails] = useState<DocumentDetails | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reports, setReports] = useState<ReportDocument[]>([]);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateToken = async () => {
    if (!accessCode.trim()) {
      toast.error('Please enter the access code');
      return;
    }

    setIsValidatingToken(true);
    try {
      const response = await POST_REQUEST(`${URLS.BASE}${URLS.verifyAccessCode}`, {
        documentId: documentID,
        accessCode
      });

      if (response.success) {
        // Fetch document details after successful access code verification
        await fetchDocumentDetails();
        setIsTokenValidated(true);
        toast.success('Access code verified successfully!');
      } else {
        toast.error(response.message || 'Invalid access code. Please check your email for the correct code.');
      }
    } catch (error) {
      console.error('Access code validation error:', error);
      toast.error('Failed to validate access code. Please try again.');
    } finally {
      setIsValidatingToken(false);
    }
  };

  const fetchDocumentDetails = async () => {
    try {
      const response = await GET_REQUEST(`${URLS.BASE}${URLS.getDocumentDetails}/${documentID}`);

      if (response.success && response.data) {
        setDocumentDetails(response.data);
        // Initialize reports array based on documents
        const initialReports = response.data.documents.map((doc: Document) => ({
          originalDocumentType: doc.documentType,
          description: '',
          status: 'verified' as const
        }));
        setReports(initialReports);
      } else {
        toast.error('Failed to fetch document details');
      }
    } catch (error) {
      console.error('Error fetching document details:', error);
      toast.error('Failed to fetch document details');
    }
  };

  const handleCreateReport = () => {
    setShowReportModal(true);
  };

  const handleReportChange = (index: number, field: keyof ReportDocument, value: string) => {
    setReports(prev => prev.map((report, i) =>
      i === index ? { ...report, [field]: value } : report
    ));
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, JPEG, or PNG file');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('for', 'verification-report');

      const uploadResponse = await POST_REQUEST_FILE_UPLOAD(`${URLS.BASE}${URLS.uploadSingleImg}`, formData);

      if (uploadResponse.success) {
        handleReportChange(index, 'newDocumentUrl', uploadResponse.data.url);
        toast.success('Document uploaded successfully');
      } else {
        toast.error('Failed to upload document');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    }
  };

  const confirmValidation = async () => {
    if (!selectedDocument) return;

    setIsProcessing(true);
    try {
      const response = await POST_REQUEST(`${URLS.BASE}${URLS.validateDocument}`, {
        documentId: selectedDocument.id,
        documentType: selectedDocument.type,
        verificationToken: token
      });

      if (response.success) {
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
      } else {
        toast.error(response.message || 'Failed to validate document');
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to validate document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, JPEG, or PNG file');
        return;
      }

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
      // Upload expected document if provided
      let expectedDocumentUrl = '';
      if (rejectionData.expectedDocumentFile) {
        const formData = new FormData();
        formData.append('file', rejectionData.expectedDocumentFile);
        formData.append('for', 'verification-expected');

        const uploadResponse = await POST_REQUEST_FILE_UPLOAD(`${URLS.BASE}${URLS.uploadSingleImg}`, formData);
        if (uploadResponse.success) {
          expectedDocumentUrl = uploadResponse.data.url;
        }
      }

      const response = await POST_REQUEST(`${URLS.BASE}${URLS.rejectDocument}`, {
        documentId: selectedDocument.id,
        documentType: selectedDocument.type,
        verificationToken: token,
        rejectionReason: rejectionData.reason,
        report: rejectionData.report,
        expectedDocumentUrl
      });

      if (response.success) {
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
      } else {
        toast.error(response.message || 'Failed to reject document');
      }
    } catch (error) {
      console.error('Rejection error:', error);
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

  // Token validation view
  if (!isTokenValidated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Document Verification Access
              </h1>
              <p className="text-gray-600">
                Please enter the verification token sent to your email to access the documents.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Token
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your verification token"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && validateToken()}
                  />
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button
                onClick={validateToken}
                disabled={isValidatingToken || !token.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidatingToken ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Validating...
                  </div>
                ) : (
                  'Validate Token'
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Document ID: <span className="font-mono font-medium">{documentID}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Document verification view (after token validation)
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
          <div className="mt-4 text-sm text-gray-500">
            Document ID: <span className="font-mono font-medium">{documentID}</span>
          </div>
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
            <h2 className="text-lg font-medium text-gray-900">
              Documents for Verification ({documents.length} document{documents.length !== 1 ? 's' : ''})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {documents.map((document) => (
              <div key={document.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>

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

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => document.documentUrl && window.open(document.documentUrl, '_blank')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </button>

                    <button
                      onClick={() => document.documentUrl && window.open(document.documentUrl, '_blank')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>

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
              <p className="text-gray-500">There are no documents associated with this verification request.</p>
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
