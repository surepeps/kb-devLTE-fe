/** @format */

import React from "react";
import ModalWrapper from "../general-components/modal-wrapper";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { archivo } from "@/styles/font";
import Input from "../general-components/Input";
import toast from "react-hot-toast";
import {
  useNegotiationModals,
  useNegotiationData,
} from "@/context/negotiation-context";

const SubmitOffer: React.FC = () => {
  const { isSubmitting, closeSubmitOfferModal } = useNegotiationModals();

  const {
    details,
    negotiationType,
    createdAt,
    counterOffer,
    setCounterOffer,
    setInspectionStatus,
    goToNextPage,
    setNegotiated,
  } = useNegotiationData();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (counterOffer === undefined || counterOffer === 0) {
      return toast.error("Please, input a value before proceeding");
    }

    try {
      setInspectionStatus("countered");
      setNegotiated(true);
      goToNextPage("Confirm Inspection Date");
      closeSubmitOfferModal();
      toast.success("Offer submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit offer");
    } finally {
      //
    }
  };

  return (
    <ModalWrapper
      isOpen={true}
      onClose={closeSubmitOfferModal}
      title="Submit Counter Offer"
      size="md"
      showCloseButton={true}
    >
      <div className="p-4 sm:p-6">
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full flex flex-col gap-[26px]"
        >
          <div className="w-full flex flex-col gap-[32px] items-center justify-center">
            <div className="w-full flex flex-col gap-[8px] items-center justify-center">
              <p
                className={`text-center text-base text-[#515B6F] ${archivo.className}`}
              >
                Enter you amount you are willing to offer the buyer to acquire
                your property
              </p>
            </div>
            <div className="w-full flex flex-col gap-[20px]">
              <Input
                label={"Your posted property Price"}
                name="posted_property_price"
                type="text"
                value={Number(details?.propertyData?.price).toLocaleString()}
                isDisabled
              />
              <Input
                label={"Buyer Negotiated price"}
                name="buyer_negotiated_price"
                type="text"
                value={Number(details?.buyOffer).toLocaleString()}
                isDisabled
              />
              <Input
                label="Enter your Offer"
                name="offer"
                type="text"
                value={counterOffer?.toLocaleString() ?? ""}
                onChange={(event) => {
                  const rawValue = event.target.value.replace(/,/g, "");
                  const numericValue = parseFloat(rawValue);

                  if (!isNaN(numericValue)) {
                    setCounterOffer(numericValue);
                  } else if (rawValue === "") {
                    setCounterOffer(undefined);
                  }
                }}
              />
            </div>
            <div className="w-full flex flex-col gap-[15px]">
              <button
                onClick={handleSubmit}
                className={`w-full bg-[#8DDB90] text-white h-[57px] text-lg ${archivo.className} font-bold`}
                type="button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              <button
                onClick={closeSubmitOfferModal}
                className={`w-full border-[1px] border-[#FF2539] text-[#FF2539] h-[57px] text-lg ${archivo.className} font-bold`}
                type="button"
              >
                Not sure
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </ModalWrapper>
  );
};

export default SubmitOffer;
