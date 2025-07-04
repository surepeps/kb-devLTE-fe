/** @format */

"use client";
import React from "react";
import ModalWrapper from "../general-components/modal-wrapper";
import { motion } from "framer-motion";
import { archivo } from "@/styles/font";
import { useNegotiationModals } from "@/context/negotiation-context";

type AcceptRejectOfferModalProps = {
  heading?: string;
  passContent?: string | React.ReactNode;
  handleSubmitFunction?: () => void;
  headerTextStyling?: React.CSSProperties;
};

const AcceptRejectOfferModal = ({
  heading = "Accept offer",
  passContent,
  handleSubmitFunction,
  headerTextStyling,
}: AcceptRejectOfferModalProps) => {
  const {
    isAcceptingOffer,
    isRejectingOffer,
    closeAcceptRejectModal,
    acceptRejectModal,
  } = useNegotiationModals();

  const isSubmitting = isAcceptingOffer || isRejectingOffer;

  return (
    <ModalWrapper
      isOpen={acceptRejectModal?.isOpen || false}
      onClose={closeAcceptRejectModal}
      size="lg"
      showCloseButton={true}
      title={heading}
    >
      <div className="p-4 sm:p-6">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center justify-center gap-6"
        >
          <div className="flex flex-col gap-[4px] items-center justify-center">
            {typeof passContent !== "string" ? (
              <div className="text-center w-full">{passContent}</div>
            ) : (
              <p
                className={`text-[#515B6F] ${archivo.className} text-base md:text-lg text-center mt-2`}
              >
                {passContent}
              </p>
            )}
          </div>
          <div className="w-full flex flex-col gap-[15px]">
            <button
              onClick={handleSubmitFunction}
              className={`w-full bg-[#8DDB90] hover:bg-[#7BC87F] text-white h-[57px] text-lg ${archivo.className} font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              type="button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              onClick={closeAcceptRejectModal}
              className={`w-full border-[1px] border-[#FF2539] text-[#FF2539] hover:bg-[#FF2539] hover:text-white h-[57px] text-lg ${archivo.className} font-bold rounded-lg transition-colors`}
              type="button"
            >
              Back
            </button>
          </div>
        </motion.div>
      </div>
    </ModalWrapper>
  );
};

export default AcceptRejectOfferModal;
