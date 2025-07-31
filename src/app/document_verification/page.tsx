"use client"
import React, { useState, useRef } from 'react';
import { X, Paperclip, File as FileIcon, Trash2, Download, Eye, Upload, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDocumentVerification } from '@/context/document-verification-context';
import { URLS } from '@/utils/URLS';
import toast from 'react-hot-toast';

// Define the document types as a union type
const documentOptions = [
  'Certificate of Occupancy',
  'Deed of Partition',
  'Deed of Assignment',
  "Governor's Consent",
  'Survey plan',
  'Deed of Lease',
] as const;

type DocumentType = typeof documentOptions[number];

type DocumentNumbers = {
  [key in DocumentType]: string;
};

type UploadedFile = {
  file: File;
  url: string;
  uploadStatus: 'uploading' | 'success' | 'error';
};

type ContactInfo = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
};

type PaymentDetails = {
  amountPaid: number;
  receiptFile: File | null;
};

const initialDocumentNumbers: DocumentNumbers = {
  'Certificate of Occupancy': '',
  'Deed of Partition': '',
  'Deed of Assignment': '',
  "Governor's Consent": '',
  'Survey plan': '',
  'Deed of Lease': '',
};

const DocumentVerificationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showGuideline, setShowGuideline] = useState<boolean>(false);
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>([]);
  const [documentNumbers, setDocumentNumbers] = useState<DocumentNumbers>(initialDocumentNumbers);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key in DocumentType]?: UploadedFile }>({});
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
  });
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    amountPaid: 0,
    receiptFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRefs = useRef<{ [key in DocumentType]?: HTMLInputElement | null }>({});
  const router = useRouter();

  const {
    setDocumentsMetadata,
    setDocumentFiles,
    setContactInfo: setContextContactInfo,
    setReceiptFile,
    setAmountPaid,
    reset,
  } = useDocumentVerification();

  const handleDocumentToggle = (document: DocumentType) => {
    if (selectedDocuments.includes(document)) {
      setSelectedDocuments(selectedDocuments.filter(doc => doc !== document));
      // Remove uploaded file for this document
      const newUploadedFiles = { ...uploadedFiles };
      delete newUploadedFiles[document];
      setUploadedFiles(newUploadedFiles);
    } else if (selectedDocuments.length < 2) {
      setSelectedDocuments([...selectedDocuments, document]);
    }
  };

  const handleDocumentNumberChange = (document: DocumentType, value: string) => {
    setDocumentNumbers(prev => ({
      ...prev,
      [document]: value
    }));
  };

  const getDocumentDisplayName = (document: DocumentType): string => {
    const displayNames: Record<DocumentType, string> = {
      'Certificate of Occupancy': 'Certificate of Occupancy',
      'Deed of Partition': 'Deed of Partition',
      'Deed of Assignment': 'Deed of Assignment',
      "Governor's Consent": "Governor's Consent",
      'Survey plan': 'Survey plan',
      'Deed of Lease': 'Deed of Lease',
    };
    return displayNames[document] || document;
  };

  const calculateFee = (): number => {
    if (selectedDocuments.length === 0) return 20000;
    return selectedDocuments.length === 1 ? 20000 : 40000;
  };

  const validateFileType = (file: File): boolean => {
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(fileExtension || '');
  };

  const uploadFile = async (file: File, document: DocumentType): Promise<string> => {
    // Validate file type before upload
    if (!validateFileType(file)) {
      throw new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('for', 'property-file');

    try {
      const response = await fetch(`${URLS.BASE}${URLS.uploadSingleImg}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.data?.url) {
        return result.data.url;
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file');
    }
  };

  const handleFileChange = async (document: DocumentType, fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      const file = fileList[0];
      
      // Update state to show uploading
      setUploadedFiles(prev => ({
        ...prev,
        [document]: {
          file,
          url: '',
          uploadStatus: 'uploading'
        }
      }));

      try {
        const uploadedUrl = await uploadFile(file, document);
        
        // Update state with successful upload
        setUploadedFiles(prev => ({
          ...prev,
          [document]: {
            file,
            url: uploadedUrl,
            uploadStatus: 'success'
          }
        }));

        toast.success(`${getDocumentDisplayName(document)} uploaded successfully`);
      } catch (error) {
        // Update state with error
        setUploadedFiles(prev => ({
          ...prev,
          [document]: {
            file,
            url: '',
            uploadStatus: 'error'
          }
        }));

        toast.error(`Failed to upload ${getDocumentDisplayName(document)}`);
      }
    }
  };

  const handleRemoveFile = (document: DocumentType) => {
    const newUploadedFiles = { ...uploadedFiles };
    delete newUploadedFiles[document];
    setUploadedFiles(newUploadedFiles);
    
    if (fileInputRefs.current[document]) {
      fileInputRefs.current[document]!.value = '';
    }
  };

  const handleUploadClick = (document: DocumentType) => {
    fileInputRefs.current[document]?.click();
  };

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreviewFile = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  const validateStep1 = (): boolean => {
    if (selectedDocuments.length === 0) {
      toast.error('Please select at least one document');
      return false;
    }

    for (const doc of selectedDocuments) {
      if (!uploadedFiles[doc] || uploadedFiles[doc]?.uploadStatus !== 'success') {
        toast.error(`Please upload ${getDocumentDisplayName(doc)}`);
        return false;
      }
    }

    return true;
  };

  const validateStep2 = (): boolean => {
    const { fullName, phoneNumber, email, address } = contactInfo;
    if (!fullName || !phoneNumber || !email || !address) {
      toast.error('Please fill in all contact information fields');
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (!paymentDetails.receiptFile) {
      toast.error('Please upload payment receipt');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      setPaymentDetails(prev => ({ ...prev, amountPaid: calculateFee() }));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleContactInfoChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReceiptUpload = (fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      setPaymentDetails(prev => ({
        ...prev,
        receiptFile: fileList[0]
      }));
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    try {
      // Prepare data for submission
      const docsMeta = selectedDocuments.map((doc) => ({
        documentType: doc,
        documentNumber: documentNumbers[doc],
        uploadedUrl: uploadedFiles[doc]?.url || '',
      }));

      const files = selectedDocuments
        .map((doc) => uploadedFiles[doc]?.file)
        .filter(Boolean) as File[];

      // Use context to store data
      setDocumentsMetadata(docsMeta);
      setDocumentFiles(files);
      setContextContactInfo(contactInfo);
      setReceiptFile(paymentDetails.receiptFile);
      setAmountPaid(paymentDetails.amountPaid);

      // Submit to the final endpoint (if needed)
      const formData = new FormData();
      formData.append('fullName', contactInfo.fullName);
      formData.append('email', contactInfo.email);
      formData.append('phoneNumber', contactInfo.phoneNumber);
      formData.append('address', contactInfo.address);
      formData.append('amountPaid', paymentDetails.amountPaid.toString());
      formData.append('documentsMetadata', JSON.stringify(docsMeta));
      if (paymentDetails.receiptFile) {
        formData.append('receipt', paymentDetails.receiptFile);
      }
      files.forEach(file => formData.append('documents', file));

      const response = await fetch('https://khabiteq-realty.onrender.com/api/submit-docs', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setShowSuccessModal(true);
        reset();
      } else {
        toast.error('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 text-gray-400'
            }`}>
              {currentStep > step ? <Check size={20} /> : step}
            </div>
            {step < 3 && (
              <ChevronRight className={`w-5 h-5 ${
                currentStep > step ? 'text-green-500' : 'text-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 1: Select & Upload Documents</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Document Type
        </label>
        
        {/* Selected Documents Display */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedDocuments.map((document) => (
            <div
              key={document}
              className="flex items-center bg-gray-100 rounded-md px-3 py-2 text-sm"
            >
              <span className="mr-2">{getDocumentDisplayName(document)}</span>
              <button
                onClick={() => handleDocumentToggle(document)}
                className="text-gray-500 hover:text-gray-700"
                title={`Remove ${getDocumentDisplayName(document)}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Document Selection Dropdown */}
        {selectedDocuments.length < 2 && (
          <div className="relative">
            <select
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onChange={(e) => {
                const value = e.target.value as DocumentType;
                if (value && !selectedDocuments.includes(value)) {
                  handleDocumentToggle(value);
                }
                e.target.value = '';
              }}
              value=""
            >
              <option value="">Select all the documents you wish to verify</option>
              {documentOptions
                .filter(doc => !selectedDocuments.includes(doc))
                .map((document) => (
                  <option key={document} value={document}>
                    {getDocumentDisplayName(document)}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Upload Documents Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Upload your document or enter the Document number
        </h3>

        {selectedDocuments.map((document, index) => (
          <div key={document} className="mb-6 p-4 border border-gray-200 rounded-lg">
            {/* Document Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload your {getDocumentDisplayName(document)}
              </label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={el => { fileInputRefs.current[document] = el; }}
                onChange={e => handleFileChange(document, e.target.files)}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  uploadedFiles[document]?.uploadStatus === 'success' 
                    ? 'border-green-300 bg-green-50' 
                    : uploadedFiles[document]?.uploadStatus === 'uploading'
                    ? 'border-blue-300 bg-blue-50'
                    : uploadedFiles[document]?.uploadStatus === 'error'
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleUploadClick(document)}
              >
                {uploadedFiles[document]?.uploadStatus === 'uploading' ? (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-blue-500 mb-2 animate-pulse" />
                    <span className="text-blue-500 font-medium">Uploading...</span>
                  </>
                ) : uploadedFiles[document]?.uploadStatus === 'success' ? (
                  <>
                    <Check className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <span className="text-green-500 font-medium">Upload Successful</span>
                  </>
                ) : uploadedFiles[document]?.uploadStatus === 'error' ? (
                  <>
                    <X className="mx-auto h-8 w-8 text-red-500 mb-2" />
                    <span className="text-red-500 font-medium">Upload Failed - Click to retry</span>
                  </>
                ) : (
                  <>
                    <Paperclip className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-green-500 font-medium">
                      Attach document {selectedDocuments.length > 1 ? index + 1 : ''}
                    </span>
                  </>
                )}
              </div>
              
              {/* File Actions */}
              {uploadedFiles[document] && uploadedFiles[document]?.uploadStatus === 'success' && (
                <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 truncate">
                    {uploadedFiles[document]?.file.name}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePreviewFile(uploadedFiles[document]!.file)}
                      className="p-2 text-blue-500 hover:bg-blue-100 rounded-md"
                      title="Preview file"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDownloadFile(uploadedFiles[document]!.file)}
                      className="p-2 text-green-500 hover:bg-green-100 rounded-md"
                      title="Download file"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveFile(document)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-md"
                      title="Remove file"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Document Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter {getDocumentDisplayName(document)} number
              </label>
              <input
                type="text"
                placeholder="Document number"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={documentNumbers[document]}
                onChange={(e) => handleDocumentNumberChange(document, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Fee Information */}
      {selectedDocuments.length > 1 && (
        <div className="text-center text-sm text-blue-600 mb-4">
          The fee has increased because you selected two documents for verification.
        </div>
      )}

      <div className="text-center mb-6">
        <p className="text-red-500 font-medium">
          Verify your documents for a one-time fee of{' '}
          <span className="font-bold">₦{calculateFee().toLocaleString()}</span>
          —fast and secure.
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 2: Contact Information</h2>
      <p className="text-gray-600 mb-6">
        Please provide your contact details so we can get back to you.
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Full name of the buyer"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={contactInfo.fullName}
              onChange={(e) => handleContactInfoChange('fullName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Active phone number for follow-up"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={contactInfo.phoneNumber}
              onChange={(e) => handleContactInfoChange('phoneNumber', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="for communication"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={contactInfo.email}
            onChange={(e) => handleContactInfoChange('email', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            placeholder="Residential or business address"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={contactInfo.address}
            onChange={(e) => handleContactInfoChange('address', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 3: Payment Information</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Details */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Make payment</h3>
          <div className="mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-4">₦{paymentDetails.amountPaid.toLocaleString()}</div>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800">Account details</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank</span>
                <span className="text-gray-900 font-medium">FCMB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number</span>
                <span className="text-gray-900 font-medium">2004766765</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name</span>
                <span className="text-gray-900 font-medium">Khabiteq limited</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-600 text-sm">
              Note that this process is subject to Approval by khabiteq realty
            </p>
          </div>
        </div>

        {/* Receipt Upload */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Provide receipt Details</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Paid
              </label>
              <input
                type="number"
                value={paymentDetails.amountPaid}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload your receipt
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <input
                  type="file"
                  id="receipt"
                  accept="image/*,.pdf"
                  onChange={(e) => handleReceiptUpload(e.target.files)}
                  className="hidden"
                />
                <label
                  htmlFor="receipt"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Paperclip className="w-8 h-8 text-green-500 mb-2" />
                  <span className="text-green-600 font-medium">
                    {paymentDetails.receiptFile ? paymentDetails.receiptFile.name : 'Attach Receipt'}
                  </span>
                  {!paymentDetails.receiptFile && (
                    <span className="text-gray-500 text-sm mt-1">
                      Click to upload or drag and drop
                    </span>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-green-400">Verify</span>{' '}
            <span className="text-gray-800">Your Document</span>
          </h1>
          <p className="text-gray-600 mb-6">
            Need to verify a document? Upload it and we&apos;ll handle the verification for you—fast, secure, and independent
          </p>
          
          <div className="mb-4">
            <span className="font-semibold text-gray-800">Verification Report:</span>
            <span className="text-gray-600">You will receive a verification report with a certified true copy (CTC)</span>
          </div>

          {/* Report Guideline Section */}
          {!showGuideline ? (
            <button
              onClick={() => setShowGuideline(true)}
              className="text-blue-500 hover:text-blue-600 underline mb-6"
            >
              Report guideline
            </button>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left relative">
              <button
                onClick={() => setShowGuideline(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              
              <h3 className="font-semibold text-gray-800 mb-4">Report guideline</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">What the Report Will Show</h4>
                <p className="text-gray-600 text-sm mb-3">
                  When you use our service, you&apos;ll receive a comprehensive report that breaks down critical information about your land document. Here&apos;s what&apos;s included:
                </p>
                
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium">Document Authenticity:</span> We verify whether your document is genuine and properly registered with the relevant state authorities in Nigeria. This ensures you&apos;re not dealing with a forged or invalid document.
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium">Ownership Information:</span> The report provides details on the current owner of the land and, where applicable, a history of previous owners. This helps you confirm who legally holds the title.
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium">Expert Recommendations:</span> Our legal team offers clear advice on what to do next—whether it&apos;s safe to proceed with a transaction or if further investigation is required. This guidance is tailored to your situation.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 mb-8">
            <span className="font-medium">Note:</span> This only applies to{' '}
            <span className="font-semibold">Lagos</span> and{' '}
            <span className="font-semibold">Ogun State</span> users
          </div>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            <ChevronLeft size={20} className="mr-2" />
            Back
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors"
            >
              Next
              <ChevronRight size={20} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <div className="mb-4">
              <Check size={48} className="mx-auto text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Documents sent for verification</h2>
            <p className="mb-6">Your documents have been submitted successfully. We will contact you soon.</p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md"
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/document_verification');
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVerificationPage;
