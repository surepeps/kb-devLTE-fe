"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserContext } from "@/context/user-context";
import { GET_REQUEST, POST_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  MapPin as MapPinIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  AlertCircle as AlertCircleIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Home as HomeIcon,
  FileText as FileTextIcon,
  Camera as CameraIcon,
  Save as SaveIcon,
  Send as SendIcon,
  ChevronLeft as ChevronLeftIcon,
  Star as StarIcon,
  Upload as UploadIcon,
} from "lucide-react";
import Loading from "@/components/loading-component/loading";
import Image from "next/image";

interface Property {
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  landSize: {
    measurementType: string;
    size: number;
  };
  additionalFeatures: {
    noOfBedroom: number;
    noOfBathroom: number;
    noOfToilet: number;
    noOfCarPark: number;
  };
  _id: string;
  features: string[];
  pictures: string[];
  propertyType: string;
  briefType: string;
  price: number;
  isAvailable: boolean;
}

interface RequestedBy {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface InspectionReport {
  buyerInterest: string | null;
  notes: string | null;
  status: string;
  wasSuccessful: boolean;
  buyerPresent: boolean | null;
  sellerPresent: boolean | null;
}

interface Inspection {
  _id: string;
  propertyId: Property;
  bookedBy: string;
  bookedByModel: string;
  inspectionDate: string;
  inspectionTime: string;
  status: string;
  requestedBy: RequestedBy;
  transaction: string;
  isNegotiating: boolean;
  isLOI: boolean;
  inspectionType: string;
  inspectionMode: string;
  inspectionStatus: string;
  negotiationPrice: number;
  letterOfIntention: any;
  owner: string;
  approveLOI: boolean;
  pendingResponseFrom: string;
  stage: string;
  counterCount: number;
  createdAt: string;
  updatedAt: string;
  assignedFieldAgent?: string;
  id: string;
  inspectionReport: InspectionReport;
}

interface FieldAgentReport {
  buyerPresent: boolean;
  sellerPresent: boolean;
  buyerInterest: "very-interested" | "interested" | "neutral" | "not-interested";
  notes: string;
}

export default function InspectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUserContext();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "report">("details");
  const [report, setReport] = useState<FieldAgentReport>({
    buyerPresent: false,
    sellerPresent: false,
    buyerInterest: "neutral",
    notes: "",
  });

  const inspectionId = params?.id as string;

  useEffect(() => {
    if (inspectionId) {
      fetchInspectionDetails();
    }
  }, [inspectionId]);

  const fetchInspectionDetails = async () => {
    try {
      setIsLoading(true);

      const response = await GET_REQUEST(
        `${URLS.BASE}/account/inspectionsFieldAgent/${inspectionId}`,
        Cookies.get("token")
      );

      if (response?.success && response.data) {
        setInspection(response.data);
        // Pre-populate report if exists
        if (response.data.inspectionReport) {
          const existingReport = response.data.inspectionReport;
          setReport({
            buyerPresent: existingReport.buyerPresent || false,
            sellerPresent: existingReport.sellerPresent || false,
            buyerInterest: existingReport.buyerInterest || "neutral",
            notes: existingReport.notes || "",
          });
        }
      } else {
        toast.error(response?.message || "Failed to load inspection details");
      }
    } catch (error) {
      console.error("Failed to fetch inspection details:", error);
      toast.error("Failed to load inspection details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportChange = (field: keyof FieldAgentReport, value: any) => {
    setReport(prev => ({ ...prev, [field]: value }));
  };


  const startInspection = async () => {
    try {
      setIsSubmitting(true);

      await POST_REQUEST(
        `${URLS.BASE}/account/inspectionsFieldAgent/${inspectionId}/startInspection`,
        {},
        undefined,
        Cookies.get("token")
      );

      if (inspection) {
        setInspection(prev => prev ? { ...prev, status: "in_progress" } : null);
        toast.success("Inspection started");
      }
    } catch (error) {
      console.error("Failed to start inspection:", error);
      toast.error("Failed to start inspection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stopInspection = async () => {
    try {
      setIsSubmitting(true);

      await POST_REQUEST(
        `${URLS.BASE}/account/inspectionsFieldAgent/${inspectionId}/stopInspection`,
        {},
        undefined,
        Cookies.get("token")
      );

      if (inspection) {
        setInspection(prev => prev ? { ...prev, status: "completed" } : null);
        toast.success("Inspection stopped");
      }
    } catch (error) {
      console.error("Failed to stop inspection:", error);
      toast.error("Failed to stop inspection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReport = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!report.notes.trim()) {
        toast.error("Please provide notes");
        return;
      }

      await POST_REQUEST(
        `${URLS.BASE}/account/inspectionsFieldAgent/${inspectionId}/submitReport`,
        report,
        undefined,
        Cookies.get("token")
      );

      toast.success("Inspection report submitted successfully!");
      router.push("/field-agent-inspections");
    } catch (error) {
      console.error("Failed to submit report:", error);
      toast.error("Failed to submit inspection report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!inspection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Inspection Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The inspection you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Inspection Details
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {inspection.propertyId.propertyType} - {inspection.propertyId.location.area}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(inspection.status)}`}>
                  {inspection.status.replace('_', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800`}>
                  {inspection.propertyId.briefType}
                </span>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="mt-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "details"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Inspection Details
                  </button>
                  <button
                    onClick={() => setActiveTab("report")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "report"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Inspection Report
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Information */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Property Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    <p className="text-gray-900">{inspection.propertyId.propertyType}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brief Type
                    </label>
                    <p className="text-gray-900">{inspection.propertyId.briefType}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <p className="text-gray-900">
                      {inspection.propertyId.location.area}, {inspection.propertyId.location.localGovernment}, {inspection.propertyId.location.state}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <p className="text-gray-900">
                      ₦{inspection.propertyId.price.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inspection Type
                    </label>
                    <p className="text-gray-900 capitalize">
                      {inspection.inspectionType} Inspection
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inspection Mode
                    </label>
                    <p className="text-gray-900 capitalize">
                      {inspection.inspectionMode.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Property Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{inspection.propertyId.additionalFeatures.noOfBedroom}</p>
                      <p className="text-sm text-gray-600">Bedrooms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{inspection.propertyId.additionalFeatures.noOfBathroom}</p>
                      <p className="text-sm text-gray-600">Bathrooms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{inspection.propertyId.additionalFeatures.noOfCarPark}</p>
                      <p className="text-sm text-gray-600">Parking</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">
                        {inspection.propertyId.landSize.size} {inspection.propertyId.landSize.measurementType}
                      </p>
                      <p className="text-sm text-gray-600">Land Size</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Additional Features</p>
                    <div className="flex flex-wrap gap-2">
                      {inspection.propertyId.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Schedule Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Schedule Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scheduled Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(inspection.inspectionDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scheduled Time
                    </label>
                    <p className="text-gray-900">{inspection.inspectionTime}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Buyer Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900">{inspection.requestedBy.fullName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <a
                      href={`tel:${inspection.requestedBy.phoneNumber}`}
                      className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <PhoneIcon className="w-4 h-4 mr-1" />
                      {inspection.requestedBy.phoneNumber}
                    </a>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <a
                      href={`mailto:${inspection.requestedBy.email}`}
                      className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <MailIcon className="w-4 h-4 mr-1" />
                      {inspection.requestedBy.email}
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Inspection Status
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Stage
                    </label>
                    <p className="text-gray-900 capitalize">{inspection.stage}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pending Response From
                    </label>
                    <p className="text-gray-900 capitalize">{inspection.pendingResponseFrom}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inspection Status
                    </label>
                    <p className="text-gray-900 capitalize">{inspection.inspectionStatus}</p>
                  </div>
                </div>
              </motion.div>

              {/* Status Update Actions */}
              {inspection.inspectionReport.status !== "completed" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Actions
                  </h2>

                  <div className="space-y-3">
                    {inspection.inspectionReport.status === "pending" && (
                      <>
                        <button
                          onClick={startInspection}
                          disabled={isSubmitting}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          Start Inspection
                        </button>
                        <button
                          onClick={stopInspection}
                          disabled={isSubmitting}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          Stop Inspection
                        </button>
                      </>
                    )}

                    {inspection.inspectionReport.status === "in_progress" && (
                      <p className="text-sm text-gray-600">
                        Complete the inspection report to mark as completed.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {activeTab === "report" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileTextIcon className="w-5 h-5 mr-2" />
                Inspection Report
              </h2>

              <div className="space-y-6">
                {/* Attendance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buyer Present
                    </label>
                    <select
                      value={report.buyerPresent.toString()}
                      onChange={(e) => handleReportChange("buyerPresent", e.target.value === "true")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seller Present
                    </label>
                    <select
                      value={report.sellerPresent.toString()}
                      onChange={(e) => handleReportChange("sellerPresent", e.target.value === "true")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                {/* Buyer Interest Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buyer Interest Level
                  </label>
                  <select
                    value={report.buyerInterest}
                    onChange={(e) => handleReportChange("buyerInterest", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="very-interested">Very Interested</option>
                    <option value="interested">Interested</option>
                    <option value="neutral">Neutral</option>
                    <option value="not-interested">Not Interested</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={report.notes}
                    onChange={(e) => handleReportChange("notes", e.target.value)}
                    rows={4}
                    placeholder="Provide notes about the inspection..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Issues Found */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issues Found
                  </label>
                  <div className="space-y-2">
                    {report.issuesFound.map((issue, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-800">
                          {issue}
                        </span>
                        <button
                          onClick={() => removeIssue(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newIssue}
                        onChange={(e) => setNewIssue(e.target.value)}
                        placeholder="Add new issue..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={addIssue}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recommended Repairs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recommended Repairs
                  </label>
                  <div className="space-y-2">
                    {report.recommendedRepairs.map((repair, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                          {repair}
                        </span>
                        <button
                          onClick={() => removeRepair(index)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newRepair}
                        onChange={(e) => setNewRepair(e.target.value)}
                        placeholder="Add recommended repair..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={addRepair}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estimated Repair Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Repair Cost (₦)
                  </label>
                  <input
                    type="number"
                    value={report.estimatedRepairCost}
                    onChange={(e) => handleReportChange("estimatedRepairCost", Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspection Photos
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadIcon className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> inspection photos
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {report.photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {report.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={URL.createObjectURL(photo)}
                                alt={`Inspection photo ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    value={report.additionalComments}
                    onChange={(e) => handleReportChange("additionalComments", e.target.value)}
                    rows={3}
                    placeholder="Any additional comments or observations..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={submitReport}
                    disabled={isSubmitting || !report.notes.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <SendIcon className="w-4 h-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
