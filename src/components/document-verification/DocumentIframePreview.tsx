"use client"
import React, { useState, useEffect } from 'react';
import { X, Download, RotateCw, ZoomIn, ZoomOut, Maximize2, Eye } from 'lucide-react';

type DocumentIframePreviewProps = {
  isOpen: boolean;
  onClose: () => void;
  file: File;
  documentName: string;
};

const DocumentIframePreview: React.FC<DocumentIframePreviewProps> = ({
  isOpen,
  onClose,
  file,
  documentName
}) => {
  const [fileUrl, setFileUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (file && isOpen) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setIsLoading(false);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file, isOpen]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetView = () => {
    setZoom(100);
    setRotation(0);
  };

  const getFileType = () => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension;
  };

  const renderFilePreview = () => {
    const fileType = getFileType();
    
    if (['pdf'].includes(fileType || '')) {
      return (
        <iframe
          src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
          className="w-full h-full border-0"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center center'
          }}
          title={`Preview of ${documentName}`}
        />
      );
    }

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileType || '')) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <img
            src={fileUrl}
            alt={documentName}
            className="max-w-full max-h-full object-contain"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          />
        </div>
      );
    }

    if (['doc', 'docx'].includes(fileType || '')) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50">
          <div className="text-center p-8">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Document Preview Not Available
            </h3>
            <p className="text-gray-500 mb-4">
              Direct preview is not supported for {fileType?.toUpperCase()} files in browser.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>File:</strong> {file.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <p className="text-sm text-gray-600">
                <strong>Type:</strong> {fileType?.toUpperCase()} Document
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Download to View
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-8">
          <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Preview Not Available
          </h3>
          <p className="text-gray-500">
            This file type cannot be previewed in the browser.
          </p>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div 
        className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full max-w-none max-h-none rounded-none' 
            : 'w-[95vw] h-[95vh] max-w-6xl max-h-[90vh]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {documentName}
            </h2>
            <p className="text-sm text-gray-500">
              {file.name} • {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(getFileType() || '') && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                
                <span className="text-sm text-gray-600 px-2">
                  {zoom}%
                </span>
                
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRotate}
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <div className="h-4 border-l border-gray-300 mx-2"></div>
              </>
            )}

            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative h-[calc(100%-80px)] overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading preview...</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              {renderFilePreview()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500">
            Use controls above to zoom, rotate, or download the document
          </div>
          
          {['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(getFileType() || '') && (
            <button
              onClick={resetView}
              className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded transition-colors"
            >
              Reset View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentIframePreview;
