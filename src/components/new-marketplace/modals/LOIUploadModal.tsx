/** @format */

"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faUpload,
  faFile,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/general-components/button";
import { archivo } from "@/styles/font";

interface LOIUploadModalProps {
  isOpen: boolean;
  property: any;
  onClose: () => void;
  onSubmit: (property: any, document: File) => void;
  existingDocument?: {
    propertyId: string;
    document: File | null;
    documentUrl?: string;
  } | null;
}

const LOIUploadModal: React.FC<LOIUploadModalProps> = ({
  isOpen,
  property,
  onClose,
  onSubmit,
  existingDocument,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(
    existingDocument?.document || null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = (file: File) => {
    if (!acceptedFileTypes.includes(file.type)) {
      alert("Please select a valid file type (PDF, DOC, DOCX, JPG, PNG)");
      return;
    }

    if (file.size > maxFileSize) {
      alert("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsSubmitting(true);
    try {
      onSubmit(property, selectedFile);
    } catch (error) {
      console.error("Error uploading LOI:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2
                className={`text-xl font-semibold text-[#24272C] ${archivo.className}`}
              >
                Upload Letter of Intent (LOI)
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FontAwesomeIcon icon={faClose} className="text-[#5A5D63]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Property Info */}
              <div className="bg-[#F7F7F8] rounded-lg p-4 mb-6">
                <h3
                  className={`font-medium text-[#24272C] mb-2 ${archivo.className}`}
                >
                  Joint Venture Opportunity
                </h3>
                <div className="space-y-1 text-sm text-[#5A5D63]">
                  <p>Type: {property?.propertyType || "N/A"}</p>
                  <p>
                    Location: {property?.location?.area || "N/A"},{" "}
                    {property?.location?.localGovernment || ""}
                  </p>
                  <p className="font-semibold text-[#24272C]">
                    Investment: ₦
                    {Number(
                      property?.investmentAmount || property?.price || 0,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* LOI Address Information */}
              <div className="bg-[#FFF3E0] border border-[#FFB74D] rounded-lg p-4 mb-6">
                <h4
                  className={`font-medium text-[#E65100] mb-2 ${archivo.className}`}
                >
                  Address your LOI to:
                </h4>
                <div className="text-sm text-[#E65100]">
                  <p className="font-semibold">Khabi-Teq Limited</p>
                  <p>Goldrim Plaza</p>
                  <p>Mokuolu Street, Ifako Agege</p>
                  <p>Lagos 101232, Nigeria</p>
                </div>
              </div>

              {/* File Upload Area */}
              <div className="mb-6">
                <label
                  className={`block text-base text-[#24272C] ${archivo.className} font-medium mb-2`}
                >
                  Upload LOI Document
                </label>

                {!selectedFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      dragActive
                        ? "border-[#8DDB90] bg-[#E4EFE7]"
                        : "border-[#E9EBEB] hover:border-[#8DDB90] hover:bg-[#F9F9F9]"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDrag}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FontAwesomeIcon
                      icon={faUpload}
                      className="text-[#8DDB90] text-2xl mb-4"
                    />
                    <p
                      className={`text-[#24272C] font-medium mb-1 ${archivo.className}`}
                    >
                      Drop your LOI document here, or click to browse
                    </p>
                    <p className="text-[#5A5D63] text-sm">
                      Supports: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="border border-[#E9EBEB] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon
                          icon={faFile}
                          className="text-[#8DDB90] text-xl"
                        />
                        <div>
                          <p
                            className={`text-[#24272C] font-medium ${archivo.className}`}
                          >
                            {selectedFile.name}
                          </p>
                          <p className="text-[#5A5D63] text-sm">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove file"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500"
                        />
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Submission Note */}
              <div className="bg-[#E4EFE7] border border-[#8DDB90] rounded-lg p-3 mb-6">
                <p className="text-[#09391C] text-xs">
                  <strong>Note:</strong> Uploading your LOI will automatically
                  add this property to your inspection list.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-[#E9EBEB] text-[#5A5D63] rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  value={isSubmitting ? "Uploading..." : "Upload LOI"}
                  disabled={isSubmitting || !selectedFile}
                  className="flex-1 py-3 px-4 bg-[#FF9800] text-white rounded-lg font-medium hover:bg-[#F57C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LOIUploadModal;
