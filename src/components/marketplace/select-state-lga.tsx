/** @format */

"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Option } from "./types/option";
import { FormikProps } from "formik";
import useClickOutside from "@/hooks/clickOutside";
import Image from "next/image";
import arrowIcon from "@/svgs/arrowDown.svg";
import { motion } from "framer-motion";
import {
  getStates,
  getLGAsByState,
  searchLocations,
  formatLocationString,
} from "@/utils/location-utils";

type SelectStateLGAProps = {
  id?: string;
  name?: string;
  title?: string;
  placeholder?: string;
  isDisabled?: boolean;
  heading?: string;
  formik: FormikProps<FormikType>;
};

interface FormikType {
  selectedLGA: string;
  selectedState: string;
}

const SelectStateLGA: FC<SelectStateLGAProps> = ({
  formik,
  placeholder,
  id,
  name,
  title,
  isDisabled,
  heading,
}) => {
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filterBasedOnText = (input: string) => {
    if (input.length > 2) {
      const suggestions = searchLocations(input);
      setLocationSuggestions(suggestions);
      setShowLocationModal(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationModal(false);
    }
  };

  const handleLocationSelect = (location: any) => {
    const locationString = formatLocationString(
      location.state,
      location.lga,
      location.area,
    );

    // Update formik values
    formik.setFieldValue("selectedState", location.state || "");
    formik.setFieldValue("selectedLGA", location.lga || "");

    // Update the input display value
    formik.setFieldValue("locationDisplay", locationString);

    // Close dropdown
    setShowLocationModal(false);
    setLocationSuggestions([]);

    // Update input value visually
    if (inputRef.current) {
      inputRef.current.value = locationString;
    }
  };

  useClickOutside(inputRef, () => setShowLocationModal(false));

  return (
    <label htmlFor="" className="flex flex-col w-full relative">
      {heading && (
        <h2 className="text-base text-[#1E1E1E] font-medium">{heading}</h2>
      )}
      <div className="flex items-center w-full h-[50px] border-[1px] border-[#D6DDEB] disabled:bg-gray-300 disabled:cursor-not-allowed">
        <input
          className="w-[85%] outline-none h-full px-[12px] text-base placeholder:text-[#A8ADB7] text-black"
          type="text"
          name={name}
          title={title}
          disabled={isDisabled}
          value={
            formik.values.locationDisplay ||
            (formik.values.selectedState || formik.values.selectedLGA
              ? `${formik.values.selectedState}${
                  formik.values.selectedLGA
                    ? `, ${formik.values.selectedLGA}`
                    : ""
                }`
              : "")
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;

            // Update the display value
            formik.setFieldValue("locationDisplay", value);

            // Parse the input for state and LGA
            const parts = value.split(",").map((part) => part.trim());

            if (parts.length >= 1) {
              formik.setFieldValue("selectedState", parts[0]);
            }
            if (parts.length >= 2) {
              formik.setFieldValue("selectedLGA", parts[1]);
            }

            filterBasedOnText(value);
          }}
          placeholder={placeholder}
          id={id}
          ref={inputRef}
        />
        <div className="w-[15%] h-full flex items-center justify-center">
          <FaSearch
            size={"sm"}
            width={16}
            height={16}
            className="w-[16px] h-[16px]"
          />
        </div>
      </div>

      {/* Location Suggestions Dropdown */}
      {showLocationModal && locationSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
        >
          {locationSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleLocationSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {formatLocationString(
                  suggestion.state,
                  suggestion.lga,
                  suggestion.area,
                )}
              </div>
              <div className="text-sm text-gray-500">
                {suggestion.area ? "Area" : suggestion.lga ? "LGA" : "State"}
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </label>
  );
};

export default SelectStateLGA;
