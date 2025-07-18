"use client"
import React, { useState, useRef } from 'react';
import { X, Paperclip, File as FileIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDocumentVerification } from '@/context/document-verification-context';

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

const initialDocumentNumbers: DocumentNumbers = {
  'Certificate of Occupancy': '',
  'Deed of Partition': '',
  'Deed of Assignment': '',
  "Governor's Consent": '',
  'Survey plan': '',
  'Deed of Lease': '',
};

const DocumentVerificationPage: React.FC = () => {
  const [showGuideline, setShowGuideline] = useState<boolean>(false);
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>(['Certificate of Occupancy']);
  const [documentNumbers, setDocumentNumbers] = useState<DocumentNumbers>(initialDocumentNumbers);
  const [selectedFiles, setSelectedFiles] = useState<{ [key in DocumentType]?: File | null }>({});
  const [filePreviews, setFilePreviews] = useState<{ [key in DocumentType]?: string }>({});
  const fileInputRefs = useRef<{ [key in DocumentType]?: HTMLInputElement | null }>({});
  const router = useRouter();
  const {
    setDocumentsMetadata,
    setDocumentFiles,
  } = useDocumentVerification();

  const handleDocumentToggle = (document: DocumentType) => {
    if (selectedDocuments.includes(document)) {
      setSelectedDocuments(selectedDocuments.filter(doc => doc !== document));
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

  const calculateFee = (): string => {
    return selectedDocuments.length === 1 ? '₦20,000' : '₦40,000';
  };

  const handleFileChange = (document: DocumentType, fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      const file = fileList[0];
      setSelectedFiles(prev => ({ ...prev, [document]: file }));
      // Generate preview if image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreviews(prev => ({ ...prev, [document]: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreviews(prev => ({ ...prev, [document]: '' }));
      }
    }
  };

  const handleRemoveFile = (document: DocumentType) => {
    setSelectedFiles(prev => ({ ...prev, [document]: null }));
    setFilePreviews(prev => ({ ...prev, [document]: '' }));
    if (fileInputRefs.current[document]) {
      fileInputRefs.current[document]!.value = '';
    }
  };

  const handleUploadClick = (document: DocumentType) => {
    fileInputRefs.current[document]?.click();
  };

  const handleNext = () => {
    // Gather metadata and files
    const docsMeta = selectedDocuments.map((doc) => ({
      documentType: doc,
      documentNumber: documentNumbers[doc],
    }));
    const files = selectedDocuments.map((doc) => selectedFiles[doc]).filter(Boolean) as File[];
    setDocumentsMetadata(docsMeta);
    setDocumentFiles(files);
    router.push('/document_verification/contact_information');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
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
            <span className="font-semibold text-gray-800">Verification Report:</span>{' '}
            <span className="text-gray-600">You will receive a verification report with a certified true copy (CTC)</span>
          </div>

          {/* Report Guideline Section */}
          {!showGuideline ? (
            <button
              onClick={() => setShowGuideline(true)}
              className="text-blue-500 hover:text-blue-600 underline mb-6"
              title="Show report guideline"
            >
              Report guideline
            </button>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left relative">
              <button
                onClick={() => setShowGuideline(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                title="Close guideline"
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

        {/* Document Selection Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
                  title="Select document type"
                  aria-label="Select document type"
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
                  {/* Hidden file input */}
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={el => { fileInputRefs.current[document] = el; }}
                    onChange={e => handleFileChange(document, e.target.files)}
                    accept="application/pdf,image/*"
                    title={`Select file for ${getDocumentDisplayName(document)}`}
                    placeholder="Select a file"
                  />
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                    onClick={() => handleUploadClick(document)}
                    tabIndex={0}
                    role="button"
                    title={`Attach file for ${getDocumentDisplayName(document)}`}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') handleUploadClick(document);
                    }}
                  >
                    <Paperclip className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-green-500 font-medium">
                      Attach document {selectedDocuments.length > 1 ? index + 1 : ''}
                    </span>
                  </div>
                  {/* File preview */}
                  {selectedFiles[document] && (
                    <div className="relative mt-4 w-32 h-32 rounded-lg overflow-hidden shadow border border-gray-200 bg-white flex items-center justify-center">
                      {/* Remove button */}
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-100 z-10"
                        onClick={() => handleRemoveFile(document)}
                        aria-label="Remove file"
                        title="Remove file"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                      {/* File preview or icon */}
                      {filePreviews[document] && selectedFiles[document]?.type.startsWith('image/') ? (
                        <img
                          src={filePreviews[document]}
                          alt={selectedFiles[document]?.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <FileIcon size={48} className="text-gray-400" />
                      )}
                      {/* Overlay for view file */}
                      <a
                        href={filePreviews[document] && selectedFiles[document]?.type.startsWith('image/') ? filePreviews[document] : selectedFiles[document] ? URL.createObjectURL(selectedFiles[document] as File) : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded hover:bg-opacity-80 transition"
                        style={{ textDecoration: 'none' }}
                      >
                        view file
                      </a>
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
                    placeholder="This is placeholder"
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
              <span className="font-bold">{calculateFee()}</span>
              —fast and secure.
            </p>
          </div>

          {/* Next Button */}
          <button
            className="w-full bg-green-400 hover:bg-green-500 text-white font-medium py-3 px-6 rounded-md transition-colors"
            title="Proceed to next step"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerificationPage;