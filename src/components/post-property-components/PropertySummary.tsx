import React from "react";
import Button from "@/components/general-components/button";

interface PropertySummaryProps {
  values: Record<string, any>;
  images: (string | null)[];
  onEdit: () => void;
  onSubmit: () => void;
}

const FIELD_LABELS: Record<string, string> = {
  propertyType: "Property Type",
  propertyCondition: "Property Condition",
  typeOfBuilding: "Type of Building",
  selectedState: "State",
  selectedLGA: "Local Government",
  selectedCity: "Area",
  landSize: "Land Size",
  measurementType: "Measurement Type",
  price: "Price",
  leaseHold: "Lease Hold",
  ownerFullName: "Owner Name",
  ownerPhoneNumber: "Owner Phone",
  ownerEmail: "Owner Email",
  noOfBedroom: "Number of Bedroom",
  noOfBathroom: "Number of Bathroom",
  noOfToilet: "Number of Toilet",
  noOfCarPark: "Number of Car Park",
    // Add array fields below:
  documents: "Documents on Property",
  features: "Features",
  jvConditions: "JV Conditions",
  tenantCriteria: "Tenant Criteria",
};

const PropertySummary: React.FC<PropertySummaryProps> = ({
  values,
  images,
  onEdit,
  onSubmit,
}) => {
  // 1. Get filtered entries
  const entries = Object.entries(FIELD_LABELS).filter(
    ([key]) => values[key]
  ).map(([key, label]) => [key, label] as [string, string]);

  // 2. Chunk into groups of 3
  const groupsOf3: [string, string][][] = [];
  for (let i = 0; i < entries.length; i += 3) {
    groupsOf3.push(entries.slice(i, i + 3));
  }

  // 3. Chunk those groups into pairs (2 columns per row)
  const rows: [[string, string][], [string, string][]?][] = [];
  for (let i = 0; i < groupsOf3.length; i += 2) {
    rows.push([groupsOf3[i], groupsOf3[i + 1]]);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded shadow p-6 my-10 w-[90%] mx-auto">
        <div className="flex flex-col gap-6">
          {rows.map((cols, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cols.map((group, colIdx) =>
                group ? (
                  <div key={colIdx} className="flex flex-col gap-2">
                    {group.map(([key, label]) => {
                      const value = values[key];
                      if (Array.isArray(value) && value.length > 0) {
                        return (
                          <div key={key} className="text-sm bg-[#F7F7F8] px-3 py-1">
                            {label}: <span className="font-semibold">{value.join(", ")}</span>
                          </div>
                        );
                      }
                      if (value && !Array.isArray(value)) {
                        return (
                          <div key={key} className="text-sm bg-[#F7F7F8] px-3 py-1">
                            {label}: <span className="font-semibold">{value}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ) : null
              )}
            </div>
          ))}
            {/* Additional Information as a full-width row */}
          {values.addtionalInfo && (
            <div className="w-full text-sm bg-[#F7F7F8] px-3 py-2 mt-2 rounded">
              <span className="font-semibold">Additional Information:</span>{" "}
              {values.addtionalInfo}
            </div>
          )}
          {/* Images Preview */}
          {images.filter(Boolean).length > 0 && (
            <div className="w-full">
              <span className="font-semibold">Images:</span>
              <div className="flex flex-wrap gap-4 mt-2">
                {images.filter(Boolean).map((img, idx) => (
                  <img
                    key={idx}
                    src={img as string}
                    alt={`Preview ${idx + 1}`}
                    className="w-24 sm:w-32 md:w-40 h-auto max-w-full object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Buttons outside the white container */}
      <div className="flex items-center mt-8 gap-5 justify-between">
        <Button
          value="Edit"
          type="button"
          onClick={onEdit}
          className="border-[1px] border-black w-[40%] text-black text-base font-bold min-h-[50px] py-[12px] px-[24px]"
        />
        <Button
          value="Submit"
          type="button"
          onClick={onSubmit}
          className="bg-[#8DDB90] w-[40%] text-white text-base font-bold min-h-[50px] py-[12px] px-[24px]"
        />
      </div>
    </div>
  );
};

export default PropertySummary;