/** @format */

"use client";
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faFile,
  faTrash,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/general-components/button";
import toast from "react-hot-toast";

interface PaymentUploadProps {
  selectedProperties: any[];
  inspectionFee: number;
  onBack: () => void;
  onComplete: () => void;
}

const PaymentUpload: React.FC<PaymentUploadProps> = ({
  selectedProperties,
  inspectionFee,
  onBack,
  onComplete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bank details for payment
  const bankDetails = {
    bankName: "First Bank of Nigeria",
    accountNumber: "3074520381",
    accountName: "Khabi-Teq Limited",
    amount: inspectionFee,
  };

  const acceptedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = (file: File) => {
    if (!acceptedFileTypes.includes(file.type)) {
      toast.error("Please select a valid file type (JPG, PNG, PDF)");
      return;
    }

    if (file.size > maxFileSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    toast.success("Payment proof uploaded successfully");
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedFile) {
      toast.error("Please upload payment proof before submitting");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate API call for uploading payment proof
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Inspection request submitted successfully!");
      onComplete();
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Instructions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#09391C] mb-4">
          Payment Instructions
        </h3>

        <div className="space-y-4">
          <div className="bg-[#E4EFE7] border border-[#8DDB90] rounded-lg p-4">
            <h4 className="font-semibold text-[#09391C] mb-3">
              Bank Transfer Details
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#5A5D63]">Bank Name:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#24272C]">
                    {bankDetails.bankName}
                  </span>
                  <button
                    onClick={() => copyToClipboard(bankDetails.bankName)}
                    className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                    title="Copy bank name"
                  >
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="text-[#8DDB90]"
                      size="sm"
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#5A5D63]">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#24272C]">
                    {bankDetails.accountNumber}
                  </span>
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountNumber)}
                    className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                    title="Copy account number"
                  >
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="text-[#8DDB90]"
                      size="sm"
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#5A5D63]">Account Name:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#24272C]">
                    {bankDetails.accountName}
                  </span>
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountName)}
                    className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                    title="Copy account name"
                  >
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="text-[#8DDB90]"
                      size="sm"
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-[#5A5D63]">Amount to Pay:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#09391C] text-lg">
                    ₦{bankDetails.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(bankDetails.amount.toString())
                    }
                    className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                    title="Copy amount"
                  >
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="text-[#8DDB90]"
                      size="sm"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF3E0] border border-[#FFB74D] rounded-lg p-4">
            <h4 className="font-semibold text-[#E65100] mb-2">Important:</h4>
            <ul className="text-sm text-[#E65100] space-y-1">
              <li>• Make the transfer using the exact amount shown above</li>
              <li>
                • Use your full name as the transfer description/narration
              </li>
              <li>• Upload clear screenshot or receipt of the transaction</li>
              <li>• Inspection will be confirmed once payment is verified</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Proof Upload */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#09391C] mb-4">
          Upload Payment Proof
        </h3>

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
              className="text-[#8DDB90] text-3xl mb-4"
            />
            <p className="text-[#24272C] font-medium mb-1">
              Drop your payment receipt here, or click to browse
            </p>
            <p className="text-[#5A5D63] text-sm">
              Supports: JPG, PNG, PDF (Max 5MB)
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
                  <p className="text-[#24272C] font-medium">
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
                <FontAwesomeIcon icon={faTrash} className="text-red-500" />
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Inspection Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#09391C] mb-4">
          Final Summary
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#5A5D63]">Properties Selected:</span>
            <span className="text-[#24272C]">{selectedProperties.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A5D63]">Inspection Fee:</span>
            <span className="text-[#24272C]">
              ₦{inspectionFee.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5A5D63]">Payment Status:</span>
            <span
              className={selectedFile ? "text-[#8DDB90]" : "text-[#E65100]"}
            >
              {selectedFile ? "Proof Uploaded" : "Pending Upload"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-[#E9EBEB] text-[#5A5D63] rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Date Selection
        </button>

        <Button
          onClick={handleSubmitRequest}
          value={
            isUploading ? "Submitting Request..." : "Submit Inspection Request"
          }
          disabled={!selectedFile || isUploading}
          className="flex-1 px-6 py-3 bg-[#8DDB90] text-white rounded-lg font-medium hover:bg-[#76c77a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default PaymentUpload;
