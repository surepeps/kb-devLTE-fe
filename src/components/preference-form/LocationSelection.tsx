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
  const { state, updateFormData, getValidationErrorsForField, goToNextStep } =
    usePreferenceForm();
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedLGAs, setSelectedLGAs] = useState<Option[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<Option[]>([]);
  const [customLocation, setCustomLocation] = useState<string>("");
  const [showCustomLocation, setShowCustomLocation] = useState<boolean>(false);
  const [lgaAreaMap, setLgaAreaMap] = useState<{ [lga: string]: Option[] }>({});
  const [customLGAs, setCustomLGAs] = useState<string>("");
  const [showCustomLGAs, setShowCustomLGAs] = useState<boolean>(false);

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
  }, []);

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

  // Check if state has LGAs
  const stateHasLGAs = useMemo(() => {
    if (!selectedState) return false;
    return lgaOptions.length > 0;
  }, [selectedState, lgaOptions]);

  // Build area options for each selected LGA separately
  useEffect(() => {
    if (!selectedState || selectedLGAs.length === 0) {
      setLgaAreaMap({});
      return;
    }

    const newLgaAreaMap: { [lga: string]: Option[] } = {};
    selectedLGAs.forEach((lga) => {
      const areas = getAreasByStateLGA(selectedState.value, lga.value);
      newLgaAreaMap[lga.value] = areas.map((area) => ({
        value: `${area} - ${lga.label}`,
        label: area,
      }));
    });
    setLgaAreaMap(newLgaAreaMap);
  }, [selectedLGAs, selectedState]);

  // Update context when values change
  useEffect(() => {
    let lgaValues: string[] = [];

    if (showCustomLGAs && customLGAs.trim()) {
      // Parse custom LGAs (comma-separated)
      lgaValues = customLGAs
        .split(",")
        .map((lga) => lga.trim())
        .filter(Boolean);
    } else {
      lgaValues = selectedLGAs.map((lga) => lga.value);
    }

    const locationData: LocationSelectionType = {
      state: selectedState?.value || "",
      lgas: lgaValues,
      areas: selectedAreas.map((area) => area.value),
      customLocation: showCustomLocation ? customLocation : undefined,
    };

    updateFormData({
      location: locationData,
    });

    // Auto-proceed if state is selected and either:
    // 1. State has no LGAs, OR
    // 2. Custom LGAs are entered and not empty, OR
    // 3. At least one LGA is selected from dropdown
    if (selectedState && (!stateHasLGAs || lgaValues.length > 0)) {
      // Small delay to ensure form validation is updated
      setTimeout(() => {
        if (state.currentStep === 0) {
          goToNextStep();
        }
      }, 100);
    }
  }, [
    selectedState,
    selectedLGAs,
    selectedAreas,
    customLocation,
    showCustomLocation,
    customLGAs,
    showCustomLGAs,
    stateHasLGAs,
    updateFormData,
    goToNextStep,
    state.currentStep,
  ]);

  // Handle state change
  const handleStateChange = useCallback((selected: SingleValue<Option>) => {
    setSelectedState(selected);
    setSelectedLGAs([]);
    setSelectedAreas([]);
    setShowCustomLocation(false);
    setCustomLocation("");
    setCustomLGAs("");
    setShowCustomLGAs(false);
    setLgaAreaMap({});
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

  // Handle custom LGAs toggle
  const handleCustomLGAsToggle = useCallback(() => {
    setShowCustomLGAs(!showCustomLGAs);
    if (!showCustomLGAs) {
      setSelectedLGAs([]);
      setSelectedAreas([]);
    } else {
      setCustomLGAs("");
    }
  }, [showCustomLGAs]);

  // Handle area change for specific LGA
  const handleAreaChangeForLGA = useCallback(
    (lgaValue: string, selectedOptions: MultiValue<Option>) => {
      const options = Array.from(selectedOptions);

      // Remove existing areas for this LGA and add new ones
      const otherLGAAreas = selectedAreas.filter(
        (area) => !area.value.includes(lgaValue),
      );

      const newAreas = [...otherLGAAreas, ...options];

      if (newAreas.length <= 3) {
        setSelectedAreas(newAreas);
        setShowCustomLocation(false);
        setCustomLocation("");
      }
    },
    [selectedAreas],
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

      {/* LGA Selection - Only show if state is selected */}
      {selectedState && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Local Government Areas <span className="text-red-500">*</span>
          </label>

          {stateHasLGAs ? (
            <>
              {!showCustomLGAs && (
                <Select
                  options={lgaOptions}
                  value={selectedLGAs}
                  onChange={handleLGAChange}
                  placeholder="Search and select LGAs..."
                  isMulti
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
                        borderColor:
                          lgaErrors.length > 0 ? "#EF4444" : "#10B981",
                      },
                      transition: "all 0.2s ease",
                    }),
                  }}
                  isSearchable
                  isClearable
                />
              )}

              {/* Custom LGA Toggle */}
              <button
                type="button"
                onClick={handleCustomLGAsToggle}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                {showCustomLGAs
                  ? "Select from LGAs above"
                  : "Can't find your LGA?"}
              </button>

              {/* Custom LGA Input */}
              <AnimatePresence>
                {showCustomLGAs && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      Enter LGAs (separate multiple with commas)
                    </label>
                    <input
                      type="text"
                      value={customLGAs}
                      onChange={(e) => setCustomLGAs(e.target.value)}
                      placeholder="e.g., Alimosho, Ikeja, Victoria Island"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                📍 This state doesn't have predefined LGAs in our system. Please
                enter your local government areas below:
              </p>
              <input
                type="text"
                value={customLGAs}
                onChange={(e) => setCustomLGAs(e.target.value)}
                placeholder="Enter your LGAs (separate multiple with commas)"
                className="mt-2 w-full px-3 py-2.5 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
              />
            </div>
          )}

          {lgaErrors.length > 0 && (
            <p className="text-sm text-red-500 font-medium">
              {lgaErrors[0].message}
            </p>
          )}
        </div>
      )}

      {/* Area Selection - Show separate selectors for each LGA */}
      {(selectedLGAs.length > 0 || (showCustomLGAs && customLGAs.trim())) && (
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-800">
            Preferred Areas <span className="text-gray-500">(Max 3 total)</span>
          </label>

          {!showCustomLocation && (
            <>
              {/* Show area selectors for each LGA */}
              {selectedLGAs.map((lga) => (
                <div key={lga.value} className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Areas in {lga.label}
                  </label>
                  <Select
                    options={lgaAreaMap[lga.value] || []}
                    value={selectedAreas.filter((area) =>
                      area.value.includes(lga.label),
                    )}
                    onChange={(selectedOptions) =>
                      handleAreaChangeForLGA(lga.value, selectedOptions)
                    }
                    placeholder={`Select areas in ${lga.label}...`}
                    isMulti
                    styles={{
                      ...customSelectStyles,
                      control: (provided: any, state: any) => ({
                        ...provided,
                        minHeight: "40px",
                        border: state.isFocused
                          ? "2px solid #10B981"
                          : "1px solid #E5E7EB",
                        borderRadius: "6px",
                      }),
                    }}
                    isSearchable
                    isClearable
                    isOptionDisabled={() => selectedAreas.length >= 3}
                  />
                </div>
              ))}

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
      {(selectedAreas.length > 0 || customLocation || customLGAs) && (
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
              {showCustomLGAs || !stateHasLGAs
                ? customLGAs || "Not specified"
                : selectedLGAs.map((lga) => lga.label).join(", ")}
            </p>
            {customLocation ? (
              <p>
                <span className="font-medium">Custom Location:</span>{" "}
                {customLocation}
              </p>
            ) : selectedAreas.length > 0 ? (
              <p>
                <span className="font-medium">Areas:</span>{" "}
                {getAreaDisplayText()}
              </p>
            ) : null}
          </div>
        </motion.div>
      )}

      {/* Auto-proceed info */}
      {selectedState &&
        (!stateHasLGAs ||
          selectedLGAs.length > 0 ||
          (showCustomLGAs && customLGAs.trim())) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <p className="text-sm text-green-700">
              ✅ Location selected! Proceeding to the next step...
            </p>
          </motion.div>
        )}
    </div>
  );
};

export default LocationSelectionComponent;
