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
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="font-bold text-[#09391C] text-xl md:text-2xl font-display">
            Upload your Letter of Intention
          </h2>
          <p className="text-sm md:text-base text-[#5A5D63] max-w-2xl mx-auto">
            Please address your letter to{" "}
            <span className="font-bold text-black">Khabi-Teq Limited</span> and
            include our office address: Goldrim Plaza, Mokuolu Street, Ifako
            Agege Lagos 101232, Nigeria
          </p>
        </div>

        {/* LOI Guidelines */}
        <div className="bg-[#E8F3FE] border border-[#A8ADB7] rounded-lg p-4 md:p-6 space-y-4">
          <h3 className="font-semibold text-[#09391C] text-lg">
            LOI Guidelines:
          </h3>
          <ul className="text-sm md:text-base text-[#5A5D63] space-y-2 list-disc list-inside">
            <li>Clearly state your intention for joint venture partnership</li>
            <li>Include your proposed terms and profit-sharing arrangement</li>
            <li>Specify your financial contribution or expertise offering</li>
            <li>Mention the property address and reference ID if available</li>
            <li>Provide your contact information and company details</li>
            <li>Sign and date the document</li>
          </ul>
        </div>

        {/* Sample Format */}
        <div className="bg-gray-50 border rounded-lg p-4 md:p-6 space-y-3">
          <h4 className="font-semibold text-[#09391C]">
            Sample Letter Format:
          </h4>
          <div className="text-sm text-[#5A5D63] bg-white p-4 rounded border italic">
            <p>"Dear Khabi-Teq Limited,</p>
            <br />
            <p>
              I hereby express my intention to enter into a joint venture
              partnership for the property located at [Property Address]...
            </p>
            <br />
            <p>My proposed contribution: [Financial/Expertise]</p>
            <p>Proposed profit sharing: [Percentage/Terms]</p>
            <br />
            <p>Contact: [Your details]</p>
            <br />
            <p>Sincerely, [Your Name & Signature]"</p>
          </div>
        </div>

        {/* File Upload */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <AttachFile
              style={{ width: "100%" }}
              id="loi_attachment"
              setFileUrl={setFileUrl}
              heading="Upload your LOI Document (PDF, DOC, DOCX)"
              acceptedFileTypes=".pdf,.doc,.docx"
            />
          </div>
        </div>

        {/* Status Message */}
        {fileUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-sm text-green-600 bg-green-50 rounded-lg p-2">
              ✓ LOI document uploaded successfully
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={handleSubmitLOI}
            disabled={!fileUrl || isSubmitting}
            className={`
              px-8 py-3 rounded-lg font-semibold text-white transition-colors min-w-[150px]
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
              px-8 py-3 rounded-lg font-semibold border-2 border-[#5A5D63] text-[#5A5D63] 
              hover:bg-[#5A5D63] hover:text-white transition-colors min-w-[150px]
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LetterOfIntention;
