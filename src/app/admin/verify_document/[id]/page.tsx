import React, { useState } from 'react';
import { ArrowLeft, Paperclip, Mail, X, Download } from 'lucide-react';

interface FormData {
  certificateNumber: string;
  deedNumber: string;
  thirdPartyEmail: string;
}

type ImageType = 'certificate' | 'deed' | null;

const SubmittedDocumentPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    certificateNumber: '445566977954',
    deedNumber: '445566977954',
    thirdPartyEmail: 'third-party@gmail.com'
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<ImageType>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewImage = (imageType: ImageType) => {
    setCurrentImage(imageType);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentImage(null);
  };

  const handleDownload = () => {
    // Handle download logic here
    console.log('Download clicked for:', currentImage);
  };

  const handleCancel = () => {
    // Handle cancel action
    console.log('Cancel clicked');
  };

  const handleSend = () => {
    // Handle send action
    console.log('Send clicked', formData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button className="mr-4 p-2 hover:bg-gray-100 rounded-full" title="Go back">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Verify Document • <span className="font-bold">Submitted Document</span>
          </h1>
        </div>
      </div>

      {/* User Info Section */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mr-4">
          <span className="text-purple-700 font-semibold text-sm">WT</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Wale Tunde</h2>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-1">E:</span>
            <span className="mr-4">yourmail@gmail.com</span>
            <span>•</span>
            <span className="ml-2">09056697456</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
            Ban contact
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
            Flagged contact
          </button>
        </div>
      </div>

      {/* Submit Information Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Submit Information</h3>
        
        <div className="space-y-8">
          {/* Certificate of Occupancy Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Uploaded Certificate of Occupancy
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Paperclip className="w-5 h-5 text-blue-500 mr-2" />
                <button 
                  onClick={() => handleViewImage('certificate')}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  view Image
                </button>
              </div>
            </div>
          </div>

          {/* Certificate Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Certificate of Occupancy number
            </label>
            <input
              type="text"
              value={formData.certificateNumber}
              onChange={(e) => handleInputChange('certificateNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter certificate number"
            />
          </div>

          {/* Deed of Lease Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Uploaded Deed of lease
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Paperclip className="w-5 h-5 text-blue-500 mr-2" />
                <button 
                  onClick={() => handleViewImage('deed')}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  view Image
                </button>
              </div>
            </div>
          </div>

          {/* Deed Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Deed of lease number
            </label>
            <input
              type="text"
              value={formData.deedNumber}
              onChange={(e) => handleInputChange('deedNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter deed number"
            />
          </div>

          {/* Third Party Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Third party email address
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.thirdPartyEmail}
                onChange={(e) => handleInputChange('thirdPartyEmail', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter third party email"
              />
              <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
          >
            Send
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {currentImage === 'certificate' ? 'Certificate of Occupancy' : 'Deed of Lease'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Modern Building"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              {/* Download Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedDocumentPage;