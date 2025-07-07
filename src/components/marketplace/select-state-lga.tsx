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
  selectedArea?: string;
  locationDisplay?: string;
  location?: {
    state: string;
    localGovernment: string;
    area?: string;
  };
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
    if (input.length > 1) {
      const suggestions = searchLocations(input);
      setLocationSuggestions(suggestions);
      setShowLocationModal(suggestions.length > 0);
    } else if (input.length === 0) {
      // Show popular locations when empty
      const popularLocations = getPopularLocations();
      setLocationSuggestions(popularLocations);
      setShowLocationModal(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationModal(false);
    }
  };

  const getPopularLocations = () => {
    // Return some popular Nigerian locations for better UX
    return [
      { state: "Lagos", lga: "Lagos Island", area: "Victoria Island" },
      { state: "Lagos", lga: "Lagos Mainland", area: "Surulere" },
      { state: "Lagos", lga: "Ikeja", area: "Allen Avenue" },
      { state: "Abuja", lga: "Municipal", area: "Garki" },
      { state: "Abuja", lga: "Municipal", area: "Wuse" },
      { state: "Rivers", lga: "Port Harcourt", area: "GRA" },
      { state: "Kano", lga: "Kano Municipal", area: "Sabon Gari" },
      { state: "Oyo", lga: "Ibadan North", area: "Bodija" },
    ];
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
    formik.setFieldValue("selectedArea", location.area || "");

    // Update the input display value
    formik.setFieldValue("locationDisplay", locationString);

    // If there's a location property in formik, update it too
    if (formik.values.hasOwnProperty("location")) {
      formik.setFieldValue("location", {
        state: location.state || "",
        localGovernment: location.lga || "",
        area: location.area || "",
      });
    }

    // Close dropdown
    setShowLocationModal(false);
    setLocationSuggestions([]);

    // Update input value visually
    if (inputRef.current) {
      inputRef.current.value = locationString;
    }

    // Trigger formik handleChange to ensure all validations and effects run
    formik.handleChange({
      target: {
        name: "locationDisplay",
        value: locationString,
      },
    } as any);
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

            if (parts.length >= 1 && parts[0]) {
              formik.setFieldValue("selectedState", parts[0]);
            }
            if (parts.length >= 2 && parts[1]) {
              formik.setFieldValue("selectedLGA", parts[1]);
            }
            if (parts.length >= 3 && parts[2]) {
              formik.setFieldValue("selectedArea", parts[2]);
            }

            filterBasedOnText(value);
          }}
          onFocus={() => {
            const currentValue = formik.values.locationDisplay || "";
            if (currentValue.length <= 1) {
              const popularLocations = getPopularLocations();
              setLocationSuggestions(popularLocations);
              setShowLocationModal(true);
            } else {
              filterBasedOnText(currentValue);
            }
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
      {showLocationModal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-64 overflow-y-auto"
        >
          {locationSuggestions.length > 0 ? (
            <>
              {locationSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLocationSelect(suggestion);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 hover:border-l-4 hover:border-l-blue-500 border-b border-gray-100 last:border-b-0 transition-all duration-200 cursor-pointer"
                >
                  <div className="font-medium text-gray-900 mb-1">
                    {formatLocationString(
                      suggestion.state,
                      suggestion.lga,
                      suggestion.area,
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        suggestion.area
                          ? "bg-green-500"
                          : suggestion.lga
                            ? "bg-blue-500"
                            : "bg-gray-500"
                      }`}
                    ></span>
                    {suggestion.area
                      ? "Area"
                      : suggestion.lga
                        ? "LGA"
                        : "State"}
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <FaSearch className="mx-auto mb-2 text-gray-400" size={24} />
              <p>No locations found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </motion.div>
      )}
    </label>
  );
};

export default SelectStateLGA;
