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

  const submitReport = async () => {
    // Validate all reports have descriptions
    const hasEmptyDescriptions = reports.some(report => !report.description.trim());
    if (hasEmptyDescriptions) {
      toast.error('Please provide descriptions for all documents');
      return;
    }

    setIsSubmittingReport(true);
    try {
      const response = await POST_REQUEST(`${URLS.BASE}${URLS.submitReport}/${documentID}`, {
        reports
      });

      if (response.success) {
        toast.success('Report submitted successfully!');
        setShowReportModal(false);
        // Refresh document details to show updated status
        await fetchDocumentDetails();
      } else {
        toast.error(response.message || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Submit report error:', error);
      toast.error('Failed to submit report');
    } finally {
      setIsSubmittingReport(false);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
    }
  };

  // Token validation view
  if (!isTokenValidated) {
    return (
      <div className="min-h-full bg-gray-50">
        <div className="flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Document Verification Access
                </h1>
                <p className="text-gray-600">
                  Please enter the access code sent to your email to verify the documents.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Enter your access code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                      onKeyPress={(e) => e.key === 'Enter' && validateToken()}
                    />
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={validateToken}
                  disabled={isValidatingToken || !accessCode.trim()}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isValidatingToken ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Access Code'
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
      </div>
    );
  }

  // Document verification view (after token validation)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="flex items-center">
              <img
                src="/khabi-teq.svg"
                alt="Khabi-Teq"
                className="h-8 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-gray-900">
                Khabi-Teq - Document Verification
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Third Party Document Verification Page
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Review and verify the documents submitted for third-party verification.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Document ID: <span className="font-mono font-medium">{documentID}</span>
          </div>
        </div>

        {/* Client Information Card */}
        {documentDetails && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-sm text-gray-900">{documentDetails.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{documentDetails.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-sm text-gray-900">{documentDetails.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                {getStatusBadge(documentDetails.status)}
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-sm text-gray-900">{documentDetails.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Amount Paid</p>
                <p className="text-sm text-gray-900">₦{documentDetails.amountPaid.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Submitted</p>
                <p className="text-sm text-gray-900">{formatDate(documentDetails.createdAt)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Documents for Verification ({documentDetails?.documents.length || 0} document{(documentDetails?.documents.length || 0) !== 1 ? 's' : ''})
            </h2>
            {documentDetails?.status === 'in-progress' && (
              <button
                onClick={handleCreateReport}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="w-4 h-4 mr-1" />
                Create Verification Report
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {documentDetails?.documents.map((document, index) => (
              <div key={index} className="p-6">
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
                          {document.documentType}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        Document Number: {document.documentNumber || 'Not provided'}
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
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!documentDetails?.documents.length && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500">There are no documents associated with this verification request.</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Document Verification Report
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {reports.map((report, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Document {index + 1}: {report.originalDocumentType}
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Status Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Verification Status *
                        </label>
                        <select
                          value={report.status}
                          onChange={(e) => handleReportChange(index, 'status', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Document Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Verified Document (Optional)
                        </label>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(index, file);
                          }}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        {report.newDocumentUrl && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ Document uploaded successfully
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Verification Description *
                        </label>
                        <textarea
                          rows={4}
                          value={report.description}
                          onChange={(e) => handleReportChange(index, 'description', e.target.value)}
                          placeholder={
                            report.status === 'verified'
                              ? "Describe the verification process and findings (e.g., 'Document verified against official records. All details match and are authentic.')"
                              : "Describe why the document was rejected and what issues were found (e.g., 'Document does not match official records. Inconsistencies found in...')"
                          }
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowReportModal(false)}
                  disabled={isSubmittingReport}
                  className="px-6 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  disabled={isSubmittingReport}
                  className="px-6 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                >
                  {isSubmittingReport ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Report'
                  )}
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
