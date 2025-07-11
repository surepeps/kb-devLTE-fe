/** @format */

"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { usePreferenceForm } from "@/context/preference-form-context";
import { LocationSelection as LocationSelectionType } from "@/types/preference-form";
import {
  getStates,
  getLGAsByState,
  getAreasByStateLGA,
} from "@/utils/location-utils";

// Types
interface Option {
  value: string;
  label: string;
}

// Custom select styles
const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: "48px",
    border:
      state.hasValue && !state.selectProps.hasError
        ? "2px solid #10B981"
        : state.selectProps.hasError
          ? "2px solid #EF4444"
          : state.isFocused
            ? "2px solid #10B981"
            : "1px solid #E5E7EB",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    boxShadow: "none",
    "&:hover": {
      borderColor: state.selectProps.hasError ? "#EF4444" : "#10B981",
    },
    transition: "all 0.2s ease",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: "8px 12px",
    fontSize: "15px",
  }),
  input: (provided: any) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#9CA3AF",
    fontSize: "15px",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#D1FAE5",
    borderRadius: "6px",
    border: "1px solid #10B981",
    maxWidth: "150px",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#047857",
    fontSize: "13px",
    fontWeight: "500",
    padding: "2px 6px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#047857",
    "&:hover": {
      backgroundColor: "#10B981",
      color: "white",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#10B981"
      : state.isFocused
        ? "#F3F4F6"
        : "white",
    color: state.isSelected ? "white" : "#374151",
    padding: "10px 12px",
    fontSize: "15px",
    "&:hover": {
      backgroundColor: state.isSelected ? "#10B981" : "#F3F4F6",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    zIndex: 50,
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: "4px",
    borderRadius: "8px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#6B7280",
    "&:hover": {
      color: "#10B981",
    },
  }),
};

interface LocationSelectionProps {
  className?: string;
}

const LocationSelectionComponent: React.FC<LocationSelectionProps> = ({
  className = "",
}) => {
  const { state, updateFormData, getValidationErrorsForField } =
    usePreferenceForm();
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedLGAs, setSelectedLGAs] = useState<Option[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<Option[]>([]);
  const [customLocation, setCustomLocation] = useState<string>("");
  const [showCustomLocation, setShowCustomLocation] = useState<boolean>(false);

  // Get validation errors
  const stateErrors = getValidationErrorsForField("location.state");
  const lgaErrors = getValidationErrorsForField("location.lgas");
  const areaErrors = getValidationErrorsForField("location.areas");

  // Initialize from context data ONLY ONCE
  useEffect(() => {
    if (state.formData.location) {
      const location = state.formData.location;

      if (location.state && !selectedState) {
        setSelectedState({ value: location.state, label: location.state });
      }

      if (location.lgas && selectedLGAs.length === 0) {
        const lgaOptions = location.lgas.map((lga) => ({
          value: lga,
          label: lga,
        }));
        setSelectedLGAs(lgaOptions);
      }

      if (location.areas && selectedAreas.length === 0) {
        const areaOptions = location.areas.map((area) => ({
          value: area,
          label: area,
        }));
        setSelectedAreas(areaOptions);
      }

      if (location.customLocation && !customLocation) {
        setCustomLocation(location.customLocation);
        setShowCustomLocation(true);
      }
    }
  }, []); // Empty dependency array - only run once on mount

  // Memoized options
  const stateOptions = useMemo(
    () =>
      getStates().map((state: string) => ({
        value: state,
        label: state,
      })),
    [],
  );

  const lgaOptions = useMemo(() => {
    if (!selectedState) return [];
    const lgas = getLGAsByState(selectedState.value);
    return lgas.map((lga: string) => ({
      value: lga,
      label: lga,
    }));
  }, [selectedState]);

  const areaOptions = useMemo(() => {
    if (selectedLGAs.length === 0 || !selectedState) return [];

    const allAreas: Option[] = [];
    selectedLGAs.forEach((lga) => {
      const areas = getAreasByStateLGA(selectedState.value, lga.value);
      areas.forEach((area) => {
        allAreas.push({
          value: `${area} - ${lga.label}`,
          label: `${area} - ${lga.label}`,
        });
      });
    });

    return allAreas;
  }, [selectedLGAs, selectedState]);

  // Update context when values change - separated to avoid infinite loop
  useEffect(() => {
    const locationData: LocationSelectionType = {
      state: selectedState?.value || "",
      lgas: selectedLGAs.map((lga) => lga.value),
      areas: selectedAreas.map((area) => area.value),
      customLocation: showCustomLocation ? customLocation : undefined,
    };

    updateFormData({
      location: locationData,
    });
  }, [
    selectedState,
    selectedLGAs,
    selectedAreas,
    customLocation,
    showCustomLocation,
    updateFormData,
  ]);

  // Handle state change
  const handleStateChange = useCallback((selected: SingleValue<Option>) => {
    setSelectedState(selected);
    setSelectedLGAs([]);
    setSelectedAreas([]);
    setShowCustomLocation(false);
    setCustomLocation("");
  }, []);

  // Handle LGA change
  const handleLGAChange = useCallback(
    (selectedOptions: MultiValue<Option>) => {
      const options = Array.from(selectedOptions);
      setSelectedLGAs(options);

      // Reset areas that are not in the selected LGAs
      const validAreas = selectedAreas.filter((area) => {
        return options.some((lga) => area.value.includes(lga.label));
      });
      setSelectedAreas(validAreas);
    },
    [selectedAreas],
  );

  // Handle area change with max 3 limit
  const handleAreaChange = useCallback(
    (selectedOptions: MultiValue<Option>) => {
      const options = Array.from(selectedOptions);

      if (options.length <= 3) {
        setSelectedAreas(options);
        setShowCustomLocation(false);
        setCustomLocation("");
      }
    },
    [],
  );

  // Handle custom location toggle
  const handleCustomLocationToggle = useCallback(() => {
    setShowCustomLocation(!showCustomLocation);
    if (!showCustomLocation) {
      setSelectedAreas([]);
    } else {
      setCustomLocation("");
    }
  }, [showCustomLocation]);

  // Generate area display text
  const getAreaDisplayText = useCallback(() => {
    if (selectedAreas.length === 0) return "";

    if (selectedAreas.length <= 3) {
      return selectedAreas.map((area) => area.label.split(" - ")[0]).join(", ");
    }

    const first3 = selectedAreas
      .slice(0, 3)
      .map((area) => area.label.split(" - ")[0]);
    const remaining = selectedAreas.length - 3;
    return `${first3.join(", ")} +${remaining} more`;
  }, [selectedAreas]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* State Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          State <span className="text-red-500">*</span>
        </label>
        <Select
          options={stateOptions}
          value={selectedState}
          onChange={handleStateChange}
          placeholder="Search and select state..."
          styles={{
            ...customSelectStyles,
            control: (provided: any, state: any) => ({
              ...provided,
              minHeight: "48px",
              border:
                state.hasValue && stateErrors.length === 0
                  ? "2px solid #10B981"
                  : stateErrors.length > 0
                    ? "2px solid #EF4444"
                    : state.isFocused
                      ? "2px solid #10B981"
                      : "1px solid #E5E7EB",
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              boxShadow: "none",
              "&:hover": {
                borderColor: stateErrors.length > 0 ? "#EF4444" : "#10B981",
              },
              transition: "all 0.2s ease",
            }),
          }}
          isSearchable
          isClearable
        />
        {stateErrors.length > 0 && (
          <p className="text-sm text-red-500 font-medium">
            {stateErrors[0].message}
          </p>
        )}
      </div>

      {/* LGA Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Local Government Areas <span className="text-red-500">*</span>
        </label>
        <Select
          options={lgaOptions}
          value={selectedLGAs}
          onChange={handleLGAChange}
          placeholder="Search and select LGAs..."
          isMulti
          isDisabled={!selectedState}
          styles={{
            ...customSelectStyles,
            control: (provided: any, state: any) => ({
              ...provided,
              minHeight: "48px",
              border:
                state.hasValue && lgaErrors.length === 0
                  ? "2px solid #10B981"
                  : lgaErrors.length > 0
                    ? "2px solid #EF4444"
                    : state.isFocused
                      ? "2px solid #10B981"
                      : "1px solid #E5E7EB",
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
              boxShadow: "none",
              "&:hover": {
                borderColor: lgaErrors.length > 0 ? "#EF4444" : "#10B981",
              },
              transition: "all 0.2s ease",
            }),
          }}
          isSearchable
          isClearable
        />
        {lgaErrors.length > 0 && (
          <p className="text-sm text-red-500 font-medium">
            {lgaErrors[0].message}
          </p>
        )}
      </div>

      {/* Area Selection */}
      {selectedLGAs.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Preferred Areas <span className="text-gray-500">(Max 3)</span>
          </label>

          {!showCustomLocation && (
            <>
              <Select
                options={areaOptions}
                value={selectedAreas}
                onChange={handleAreaChange}
                placeholder="Search and select areas..."
                isMulti
                styles={{
                  ...customSelectStyles,
                  control: (provided: any, state: any) => ({
                    ...provided,
                    minHeight: "48px",
                    border:
                      state.hasValue && areaErrors.length === 0
                        ? "2px solid #10B981"
                        : areaErrors.length > 0
                          ? "2px solid #EF4444"
                          : state.isFocused
                            ? "2px solid #10B981"
                            : "1px solid #E5E7EB",
                    borderRadius: "8px",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor:
                        areaErrors.length > 0 ? "#EF4444" : "#10B981",
                    },
                    transition: "all 0.2s ease",
                  }),
                }}
                isSearchable
                isClearable
                isOptionDisabled={() => selectedAreas.length >= 3}
              />

              {/* Selected areas display */}
              {selectedAreas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                >
                  <span className="text-sm font-medium text-emerald-700">
                    Selected: {getAreaDisplayText()}
                  </span>
                </motion.div>
              )}
            </>
          )}

          {/* Custom Location Toggle */}
          <button
            type="button"
            onClick={handleCustomLocationToggle}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            {showCustomLocation
              ? "Select from areas above"
              : "Can't find your location?"}
          </button>

          {/* Custom Location Input */}
          <AnimatePresence>
            {showCustomLocation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Enter your location
                </label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Enter your specific location or landmark"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {areaErrors.length > 0 && (
            <p className="text-sm text-red-500 font-medium">
              {areaErrors[0].message}
            </p>
          )}
        </div>
      )}

      {/* Location Summary */}
      {(selectedAreas.length > 0 || customLocation) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-50 rounded-lg border"
        >
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            Location Summary
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">State:</span> {selectedState?.label}
            </p>
            <p>
              <span className="font-medium">LGAs:</span>{" "}
              {selectedLGAs.map((lga) => lga.label).join(", ")}
            </p>
            {customLocation ? (
              <p>
                <span className="font-medium">Custom Location:</span>{" "}
                {customLocation}
              </p>
            ) : (
              <p>
                <span className="font-medium">Areas:</span>{" "}
                {getAreaDisplayText()}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LocationSelectionComponent;
