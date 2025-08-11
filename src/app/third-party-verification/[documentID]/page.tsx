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

  // Validate document ID format
  const isValidDocumentID = documentID && documentID.length >= 5 && documentID !== 'sample-doc-123';

  if (!isValidDocumentID) {
    return (
      <div className="min-h-screen bg-[#EEF1F1] flex items-center justify-center py-8 px-4">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-gray-100">
            <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-red-50 mb-6">
              <XCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Invalid Document ID
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The document ID "{documentID}" is not valid. Please check your verification link.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-700">
                Valid document IDs are typically 10+ characters long and provided in your verification email.
              </p>
            </div>
            <div className="bg-[#0B423D] text-white p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Need Help?</p>
              <p className="text-xs sm:text-sm">
                Contact: <span className="text-[#8DDB90]">verification@khabi-teq.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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
      // Check if API base URL is configured
      if (!URLS.BASE || URLS.BASE === 'undefined') {
        console.warn('API base URL not configured, using mock validation');
        // Mock validation for demo purposes
        if (accessCode.length >= 6) {
          setIsTokenValidated(true);
          // Set mock document details
          setDocumentDetails({
            _id: documentID,
            customId: documentID,
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phoneNumber: '+234 801 234 5678',
            address: '123 Main Street, Lagos',
            amountPaid: 15000,
            documents: [
              {
                documentType: 'Certificate of Occupancy',
                documentNumber: 'C/O/12345/2024',
                documentUrl: '/placeholder-property.svg'
              },
              {
                documentType: 'Survey Plan',
                documentNumber: 'SP/67890/2024',
                documentUrl: '/placeholder-property.svg'
              }
            ],
            status: 'in-progress',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          const initialReports = [
            { originalDocumentType: 'Certificate of Occupancy', description: '', status: 'verified' as const },
            { originalDocumentType: 'Survey Plan', description: '', status: 'verified' as const }
          ];
          setReports(initialReports);
          toast.success('Access code verified successfully! (Demo Mode)');
          return;
        } else {
          toast.error('Invalid access code. Please enter at least 6 characters.');
          return;
        }
      }

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
      // Check if API base URL is configured
      if (!URLS.BASE || URLS.BASE === 'undefined') {
        console.warn('API base URL not configured, using mock data');
        return; // Mock data already set in validateToken
      }

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
      // Check if API base URL is configured
      if (!URLS.BASE || URLS.BASE === 'undefined') {
        console.warn('API base URL not configured, using mock submission');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update document status to completed
        if (documentDetails) {
          setDocumentDetails({
            ...documentDetails,
            status: 'completed'
          });
        }

        toast.success('Report submitted successfully! (Demo Mode)');
        setShowReportModal(false);
        return;
      }

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
      <div className="min-h-screen bg-[#EEF1F1] py-6 sm:py-12 px-4">
        <div className="flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-[#0B423D] to-[#8DDB90] mb-6">
                  <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Document Verification Access
                </h1>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Please enter the access code sent to your email to verify the documents.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Access Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Enter your access code"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8DDB90] focus:border-[#8DDB90] pl-12 text-lg font-mono tracking-wider"
                      onKeyPress={(e) => e.key === 'Enter' && validateToken()}
                    />
                    <Mail className="absolute left-4 top-4.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={validateToken}
                  disabled={isValidatingToken || !accessCode.trim()}
                  className="w-full bg-gradient-to-r from-[#0B423D] to-[#8DDB90] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isValidatingToken ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Verifying Access Code...
                    </div>
                  ) : (
                    'Verify Access Code'
                  )}
                </button>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs sm:text-sm text-gray-500 text-center">
                  Document ID: <span className="font-mono font-medium text-[#0B423D]">{documentID}</span>
                </p>
                <div className="flex items-center justify-center mt-2">
                  <div className="w-2 h-2 bg-[#8DDB90] rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-gray-500">Secure Connection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Document verification view (after token validation)
  return (
    <div className="min-h-screen bg-[#EEF1F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Document Verification Portal
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Review and verify the documents submitted for third-party verification.
          </p>
          <div className="mt-4 p-3 bg-white rounded-lg shadow-sm inline-block">
            <span className="text-xs sm:text-sm text-gray-500">Document ID: </span>
            <span className="font-mono font-medium text-[#0B423D] text-sm sm:text-base">{documentID}</span>
          </div>
        </div>

        {/* Client Information Card */}
        {documentDetails && (
          <div className="bg-white rounded-2xl shadow-lg mb-6 sm:mb-8 p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Client Information</h2>
              {getStatusBadge(documentDetails.status)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Full Name</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900">{documentDetails.fullName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Email</p>
                <p className="text-sm sm:text-base text-gray-900 break-all">{documentDetails.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Phone</p>
                <p className="text-sm sm:text-base text-gray-900">{documentDetails.phoneNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl sm:col-span-2 lg:col-span-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Amount Paid</p>
                <p className="text-lg sm:text-xl font-bold text-[#8DDB90]">₦{documentDetails.amountPaid.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl sm:col-span-2">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Address</p>
                <p className="text-sm sm:text-base text-gray-900">{documentDetails.address}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Submitted</p>
                <p className="text-sm sm:text-base text-gray-900">{formatDate(documentDetails.createdAt)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Documents for Verification
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {documentDetails?.documents.length || 0} document{(documentDetails?.documents.length || 0) !== 1 ? 's' : ''} submitted
                </p>
              </div>
              {documentDetails?.status === 'in-progress' && (
                <button
                  onClick={handleCreateReport}
                  className="inline-flex items-center px-4 sm:px-6 py-3 bg-gradient-to-r from-[#0B423D] to-[#8DDB90] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] w-full sm:w-auto justify-center"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Create Verification Report
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {documentDetails?.documents.map((document, index) => (
              <div key={index} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Document Icon and Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0B423D] to-[#8DDB90] rounded-xl flex items-center justify-center shadow-lg">
                        <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                          {document.documentType}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8DDB90] text-[#0B423D]">
                            Document #{index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Document Number:</span> {document.documentNumber || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
                    <button
                      onClick={() => document.documentUrl && window.open(document.documentUrl, '_blank')}
                      className="inline-flex items-center justify-center px-4 py-2.5 border-2 border-[#8DDB90] text-[#0B423D] font-medium rounded-xl hover:bg-[#8DDB90] hover:text-white transition-all duration-200 text-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Document
                    </button>

                    <button
                      onClick={() => document.documentUrl && window.open(document.documentUrl, '_blank')}
                      className="inline-flex items-center justify-center px-4 py-2.5 bg-[#0B423D] text-white font-medium rounded-xl hover:bg-[#0B423D]/90 transition-all duration-200 text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>

                {/* Document Preview Area */}
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="flex items-center justify-center text-gray-500">
                    <FileText className="w-8 h-8 mr-3" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Document Preview</p>
                      <p className="text-xs">Click "Preview Document" to view in full screen</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!documentDetails?.documents.length && (
            <div className="text-center py-12 sm:py-16">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                There are no documents associated with this verification request.
              </p>
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
