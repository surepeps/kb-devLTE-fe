/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { 
  Building, 
  FileText, 
  Award, 
  Globe, 
  Briefcase, 
  Upload,
  Eye,
  Trash2,
  CheckCircle,
  Plus,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import ReactSelect from "react-select";
import toast from "react-hot-toast";
import AttachFile from "@/components/general-components/attach_file";
import {
  AgentKYCData,
  SPECIALIZATION_OPTIONS,
  SERVICE_OPTIONS,
  LANGUAGE_OPTIONS,
  AGENT_UPGRADE_CONSTANTS,
} from "@/types/agent-upgrade.types";

interface ExtendedProfileStepProps {
  data: Partial<AgentKYCData>;
  onDataChange: (data: Partial<AgentKYCData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ExtendedProfileStep: React.FC<ExtendedProfileStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrev,
}) => {
  const [formData, setFormData] = useState<Partial<AgentKYCData>>(data);
  const [idDocumentUrl, setIdDocumentUrl] = useState<string | null>(
    data.idUpload?.documentUrl || null
  );
  const [businessDocumentUrl, setBusinessDocumentUrl] = useState<string | null>(
    data.businessRegistration?.documentUrl || null
  );
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);
  const [achievements, setAchievements] = useState(data.achievements || []);

  useEffect(() => {
    // Update form data when dependencies change
    const updatedData = {
      ...formData,
      idUpload: {
        ...formData.idUpload,
        documentUrl: idDocumentUrl || "",
      },
      businessRegistration: {
        ...formData.businessRegistration,
        documentUrl: businessDocumentUrl || "",
      },
      achievements,
    };
    setFormData(updatedData);
    onDataChange(updatedData);
  }, [idDocumentUrl, businessDocumentUrl, achievements]);

  const handleInputChange = (field: string, value: any) => {
    const keys = field.split(".");
    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...(prev as any)[keys[0]],
          [keys[1]]: value,
        },
      }));
    }
  };

  const addAchievement = () => {
    setAchievements(prev => [
      ...prev,
      {
        title: "",
        description: "",
        certificateUrl: "",
        dateReceived: "",
      },
    ]);
  };

  const updateAchievement = (index: number, field: string, value: string) => {
    setAchievements(prev =>
      prev.map((achievement, i) =>
        i === index ? { ...achievement, [field]: value } : achievement
      )
    );
  };

  const removeAchievement = (index: number) => {
    setAchievements(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    // Validate required fields
    const requiredFields = [
      { field: "profileBio", label: "Profile Bio" },
      { field: "specializations", label: "Specializations" },
      { field: "languagesSpoken", label: "Languages Spoken" },
      { field: "servicesOffered", label: "Services Offered" },
      { field: "idUpload.type", label: "ID Type" },
      { field: "idUpload.documentNumber", label: "ID Number" },
    ];

    // Check bio length
    if (!formData.profileBio || formData.profileBio.length < AGENT_UPGRADE_CONSTANTS.MIN_BIO_LENGTH) {
      toast.error(`Profile bio must be at least ${AGENT_UPGRADE_CONSTANTS.MIN_BIO_LENGTH} characters`);
      return;
    }

    if (formData.profileBio.length > AGENT_UPGRADE_CONSTANTS.MAX_BIO_LENGTH) {
      toast.error(`Profile bio must be less than ${AGENT_UPGRADE_CONSTANTS.MAX_BIO_LENGTH} characters`);
      return;
    }

    // Check arrays
    if (!formData.specializations || formData.specializations.length === 0) {
      toast.error("Please select at least one specialization");
      return;
    }

    if (!formData.languagesSpoken || formData.languagesSpoken.length === 0) {
      toast.error("Please select at least one language");
      return;
    }

    if (!formData.servicesOffered || formData.servicesOffered.length < AGENT_UPGRADE_CONSTANTS.MIN_SERVICES) {
      toast.error(`Please select at least ${AGENT_UPGRADE_CONSTANTS.MIN_SERVICES} services`);
      return;
    }

    // Check ID upload
    if (!idDocumentUrl) {
      toast.error("Please upload your government-issued ID");
      return;
    }

    if (!formData.idUpload?.type) {
      toast.error("Please select your ID type");
      return;
    }

    if (!formData.idUpload?.documentNumber) {
      toast.error("Please enter your ID number");
      return;
    }

    // Update parent and proceed
    onDataChange({
      ...formData,
      idUpload: {
        ...formData.idUpload,
        documentUrl: idDocumentUrl || "",
      },
      businessRegistration: {
        ...formData.businessRegistration,
        documentUrl: businessDocumentUrl || "",
      },
      achievements,
    });
    onNext();
  };

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      border: "1px solid #D6DDEB",
      borderRadius: "8px",
      padding: "8px",
      fontSize: "14px",
      minHeight: "48px",
      "&:hover": {
        borderColor: "#8DDB90",
      },
      "&:focus": {
        borderColor: "#8DDB90",
        boxShadow: "0 0 0 2px rgba(141, 219, 144, 0.2)",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#8DDB90" : state.isFocused ? "#8DDB90/10" : "white",
      color: state.isSelected ? "white" : "#09391C",
      "&:hover": {
        backgroundColor: "#8DDB90/10",
      },
    }),
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Professional Bio */}
        <div>
          <h4 className="text-lg font-semibold text-[#09391C] mb-6 flex items-center gap-2 font-display">
            <Building size={20} />
            Professional Profile
          </h4>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#09391C] mb-2">
              Profile Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.profileBio || ""}
              onChange={(e) => handleInputChange("profileBio", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors resize-none"
              rows={4}
              placeholder="Tell potential clients about yourself, your experience, and what makes you unique as a real estate agent..."
            />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-[#5A5D63]">
                Minimum {AGENT_UPGRADE_CONSTANTS.MIN_BIO_LENGTH} characters
              </span>
              <span className={`${
                (formData.profileBio?.length || 0) > AGENT_UPGRADE_CONSTANTS.MAX_BIO_LENGTH
                  ? "text-red-500"
                  : "text-[#5A5D63]"
              }`}>
                {formData.profileBio?.length || 0}/{AGENT_UPGRADE_CONSTANTS.MAX_BIO_LENGTH}
              </span>
            </div>
          </div>

          {/* Specializations */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#09391C] mb-2">
              Specializations <span className="text-red-500">*</span>
            </label>
            <ReactSelect
              isMulti
              options={SPECIALIZATION_OPTIONS}
              value={SPECIALIZATION_OPTIONS.filter(opt =>
                formData.specializations?.includes(opt.value)
              )}
              onChange={(selectedOptions) => {
                const values = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];
                handleInputChange("specializations", values);
              }}
              styles={customSelectStyles}
              placeholder="Select your areas of specialization (max 5)"
              isSearchable
            />
            <p className="text-xs text-[#5A5D63] mt-1">
              Select up to {AGENT_UPGRADE_CONSTANTS.MAX_SPECIALIZATIONS} specializations
            </p>
          </div>

          {/* Languages Spoken */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#09391C] mb-2">
              Languages Spoken <span className="text-red-500">*</span>
            </label>
            <ReactSelect
              isMulti
              options={LANGUAGE_OPTIONS.map(lang => ({ value: lang, label: lang }))}
              value={formData.languagesSpoken?.map(lang => ({ value: lang, label: lang })) || []}
              onChange={(selectedOptions) => {
                const values = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];
                handleInputChange("languagesSpoken", values);
              }}
              styles={customSelectStyles}
              placeholder="Select languages you speak"
              isSearchable
            />
          </div>

          {/* Services Offered */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#09391C] mb-2">
              Services Offered <span className="text-red-500">*</span>
            </label>
            <ReactSelect
              isMulti
              options={SERVICE_OPTIONS}
              value={SERVICE_OPTIONS.filter(opt =>
                formData.servicesOffered?.includes(opt.value)
              )}
              onChange={(selectedOptions) => {
                const values = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];
                handleInputChange("servicesOffered", values);
              }}
              styles={customSelectStyles}
              placeholder="Select services you offer (minimum 2)"
              isSearchable
            />
            <p className="text-xs text-[#5A5D63] mt-1">
              Select at least {AGENT_UPGRADE_CONSTANTS.MIN_SERVICES} services you offer to clients
            </p>
          </div>
        </div>

        {/* Identity Verification */}
        <div>
          <h4 className="text-lg font-semibold text-[#09391C] mb-6 flex items-center gap-2 font-display">
            <FileText size={20} />
            Identity Verification
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                ID Type <span className="text-red-500">*</span>
              </label>
              <ReactSelect
                options={[
                  { value: "nin", label: "National ID (NIN)" },
                  { value: "drivers_license", label: "Driver's License" },
                  { value: "passport", label: "International Passport" },
                ]}
                value={formData.idUpload?.type ? {
                  value: formData.idUpload.type,
                  label: formData.idUpload.type === "nin" ? "National ID (NIN)" :
                         formData.idUpload.type === "drivers_license" ? "Driver's License" :
                         "International Passport"
                } : null}
                onChange={(selected) => handleInputChange("idUpload.type", selected?.value)}
                styles={customSelectStyles}
                placeholder="Select ID type"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                ID Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.idUpload?.documentNumber || ""}
                onChange={(e) => handleInputChange("idUpload.documentNumber", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                placeholder="Enter ID number"
              />
            </div>
          </div>

          <div className="mb-6">
            <AttachFile
              heading="Upload Government-Issued ID"
              setFileUrl={setIdDocumentUrl}
              id="id-upload"
            />
            {idDocumentUrl && (
              <div className="mt-3 flex items-center justify-between p-4 bg-[#8DDB90]/5 rounded-lg border border-[#8DDB90]/20">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-[#8DDB90]" />
                  <span className="text-sm text-[#09391C] font-medium">
                    ID document uploaded successfully
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageModalUrl(idDocumentUrl)}
                    className="p-2 text-[#8DDB90] hover:text-[#7BC87F] hover:bg-[#8DDB90]/10 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdDocumentUrl(null)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Business Registration (Optional) */}
        <div>
          <h4 className="text-lg font-semibold text-[#09391C] mb-6 flex items-center gap-2 font-display">
            <Award size={20} />
            Business Registration (Optional)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                CAC Number
              </label>
              <input
                type="text"
                value={formData.businessRegistration?.cacNumber || ""}
                onChange={(e) => handleInputChange("businessRegistration.cacNumber", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                placeholder="Enter CAC registration number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#09391C] mb-2">
                Agent License Number
              </label>
              <input
                type="text"
                value={formData.agentLicenseNumber || ""}
                onChange={(e) => handleInputChange("agentLicenseNumber", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                placeholder="Enter agent license number"
              />
            </div>
          </div>

          <div className="mb-6">
            <AttachFile
              heading="Upload Business Registration Document (Optional)"
              setFileUrl={setBusinessDocumentUrl}
              id="business-upload"
            />
            {businessDocumentUrl && (
              <div className="mt-3 flex items-center justify-between p-4 bg-[#8DDB90]/5 rounded-lg border border-[#8DDB90]/20">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-[#8DDB90]" />
                  <span className="text-sm text-[#09391C] font-medium">
                    Business document uploaded successfully
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageModalUrl(businessDocumentUrl)}
                    className="p-2 text-[#8DDB90] hover:text-[#7BC87F] hover:bg-[#8DDB90]/10 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBusinessDocumentUrl(null)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Achievements & Certifications */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-[#09391C] flex items-center gap-2 font-display">
              <Award size={20} />
              Achievements & Certifications (Optional)
            </h4>
            <button
              type="button"
              onClick={addAchievement}
              className="flex items-center gap-2 px-4 py-2 bg-[#8DDB90]/10 text-[#8DDB90] rounded-lg hover:bg-[#8DDB90]/20 transition-colors"
            >
              <Plus size={16} />
              Add Achievement
            </button>
          </div>

          {achievements.map((achievement, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-[#09391C]">Achievement #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#09391C] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={achievement.title}
                    onChange={(e) => updateAchievement(index, "title", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                    placeholder="e.g., Top Sales Agent 2023"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#09391C] mb-2">
                    Date Received
                  </label>
                  <input
                    type="date"
                    value={achievement.dateReceived}
                    onChange={(e) => updateAchievement(index, "dateReceived", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-[#09391C] mb-2">
                  Description
                </label>
                <textarea
                  value={achievement.description}
                  onChange={(e) => updateAchievement(index, "description", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent transition-colors resize-none"
                  rows={2}
                  placeholder="Brief description of the achievement"
                />
              </div>
            </div>
          ))}

          {achievements.length === 0 && (
            <div className="text-center py-8 text-[#5A5D63]">
              <Award size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No achievements added yet. Click "Add Achievement" to showcase your accomplishments.</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
          >
            ← Previous
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8DDB90]/50 focus:ring-offset-2 font-medium"
          >
            Continue to Inspection Fee
            <DollarSign size={16} />
          </button>
        </div>
      </motion.div>

      {/* Image Modal */}
      {imageModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-4 relative max-w-[90vw] max-h-[90vh] flex flex-col items-center border border-gray-200">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setImageModalUrl(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <img
              src={imageModalUrl}
              alt="Preview"
              className="max-w-full max-h-[70vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtendedProfileStep;
