/** @format */

"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import AttachFile from "@/components/general-components/attach_file";
import { archivo } from "@/styles/font";
import toast from "react-hot-toast";
import { POST_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";

type LetterOfIntentionProps = {
  setIsModalClosed: (type: boolean) => void;
  closeSelectPreferableModal: (type: boolean) => void;
  propertyId: string;
  submitInspectionPayload: any;
  setSubmitInspectionPayload: (payload: any) => void;
};

const LetterOfIntention: React.FC<LetterOfIntentionProps> = ({
  setIsModalClosed,
  closeSelectPreferableModal,
  propertyId,
  submitInspectionPayload,
  setSubmitInspectionPayload,
}) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitLOI = async () => {
    if (!fileUrl) {
      toast.error("Please upload your Letter of Intention document");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare LOI submission payload
      const loiPayload = {
        propertyId,
        letterOfIntention: fileUrl,
        message:
          "Letter of Intention submitted for joint venture consideration",
        type: "LOI_SUBMISSION",
      };

      // Submit LOI to the backend
      const response = await POST_REQUEST(
        `${URLS.BASE}/loi/submit`,
        loiPayload,
        Cookies.get("token"),
      );

      if (response) {
        toast.success("Letter of Intention submitted successfully!");

        // Update inspection payload
        setSubmitInspectionPayload({
          ...submitInspectionPayload,
          propertyId,
          letterOfIntention: fileUrl,
          loiSubmitted: true,
          transaction: {
            ...submitInspectionPayload.transaction,
          },
        });

        // Close modal and proceed
        setIsModalClosed(false);
        closeSelectPreferableModal(true);
      } else {
        toast.error("Failed to submit Letter of Intention");
      }
    } catch (error) {
      console.error("Error submitting LOI:", error);
      toast.error("An error occurred while submitting your LOI");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalClosed(false);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.1 }}
      viewport={{ once: true }}
      className="w-full max-w-[615px] mx-auto"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 py-6 space-y-4 sm:space-y-6 max-h-[500px] overflow-y-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2
            className={`font-bold text-[#09391C] text-lg sm:text-xl md:text-2xl ${archivo.className}`}
          >
            Upload your Letter of Intention
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#5A5D63] leading-relaxed">
            Please address your letter to{" "}
            <span className="font-bold text-black">Khabi-Teq Limited</span> and
            include our office address: Goldrim Plaza, Mokuolu Street, Ifako
            Agege Lagos 101232, Nigeria
          </p>
        </div>

        {/* LOI Guidelines */}
        <div className="bg-[#E8F3FE] border border-[#A8ADB7] rounded-lg p-3 sm:p-4 space-y-3">
          <h3 className="font-semibold text-[#09391C] text-sm sm:text-base">
            📋 LOI Guidelines:
          </h3>
          <ul className="text-xs sm:text-sm text-[#5A5D63] space-y-1 sm:space-y-2 list-disc list-inside">
            <li>State your intention for joint venture partnership</li>
            <li>Include proposed terms and profit-sharing arrangement</li>
            <li>Specify your financial contribution or expertise</li>
            <li>Mention property address and reference ID</li>
            <li>Provide contact information and company details</li>
            <li>Sign and date the document</li>
          </ul>
        </div>

        {/* Sample Format */}
        <div className="bg-gray-50 border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
          <h4 className="font-semibold text-[#09391C] text-sm sm:text-base">
            📝 Sample Letter Format:
          </h4>
          <div className="text-xs sm:text-sm text-[#5A5D63] bg-white p-3 rounded border italic leading-relaxed">
            <p>Dear Khabi-Teq Limited,</p>
            <p className="mt-2">
              I express my intention to enter into a joint venture for the
              property at [Property Address]...
            </p>
            <p className="mt-2">My contribution: [Financial/Expertise]</p>
            <p>Profit sharing: [Percentage/Terms]</p>
            <p className="mt-2">Contact: [Your details]</p>
            <p className="mt-2">Sincerely, [Your Name & Signature]</p>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <label className="block">
            <span className="text-[#24272C] font-medium text-sm">
              Upload LOI Document <span className="text-red-500">*</span>
            </span>
            <div className="mt-2">
              <AttachFile
                style={{ width: "100%" }}
                id="loi_attachment"
                setFileUrl={setFileUrl}
                heading=""
                acceptedFileTypes=".pdf,.doc,.docx"
              />
            </div>
          </label>
        </div>

        {/* Status Message */}
        {fileUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-xs sm:text-sm text-green-600 bg-green-50 rounded-lg p-2 sm:p-3">
              ✓ LOI document uploaded successfully
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleSubmitLOI}
            disabled={!fileUrl || isSubmitting}
            className={`
              flex-1 h-[50px] sm:h-[57px] rounded font-semibold text-white transition-colors text-sm sm:text-base
              ${
                !fileUrl || isSubmitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#8DDB90] hover:bg-[#7BC87F]"
              }
            `}
          >
            {isSubmitting ? "Submitting..." : "Submit LOI"}
          </button>

          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className={`
              flex-1 h-[50px] sm:h-[57px] rounded font-semibold border-2 border-[#5A5D63] text-[#5A5D63]
              hover:bg-[#5A5D63] hover:text-white transition-colors text-sm sm:text-base
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LetterOfIntention;
