"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";
import { GET_REQUEST, POST_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  ArrowLeft as ArrowLeftIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  FileText as FileTextIcon,
  DollarSign as DollarSignIcon,
  User as UserIcon,
  Download as DownloadIcon,
  Eye as EyeIcon,
  MessageSquare as MessageSquareIcon,
  Edit as EditIcon,
} from "lucide-react";
import Loading from "@/components/loading-component/loading";

interface InspectionRequest {
  _id: string;
  propertyId: {
    location: {
      state: string;
      localGovernment: string;
      area: string;
    };
    _id: string;
    propertyType: string;
    briefType: string;
    price: number;
    owner: string;
    pictures: string[];
    thumbnail: string | null;
  };
  inspectionDate: string;
  inspectionTime: string;
  status: "active_negotiation" | "completed" | "cancelled" | "pending";
  requestedBy: {
    _id: string;
    fullName: string;
  };
  transaction: string;
  isNegotiating: boolean;
  negotiationPrice: number;
  letterOfIntention: string;
  owner: {
    _id: string;
    lastName: string;
    firstName: string;
    userType: string;
    id: string;
  };
  sellerCounterOffer: number;
  pendingResponseFrom: "seller" | "buyer";
  stage: "inspection" | "negotiation" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  inspectionStatus: "new" | "accept" | "reject" | "counter" | "request_changes";
  inspectionType: "price" | "LOI";
  isLOI: boolean;
  reason?: string;
}

export default function LandlordInspectionRequestsPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [inspectionRequests, setInspectionRequests] = useState<
    InspectionRequest[]
  >([]);
  const [filteredRequests, setFilteredRequests] = useState<InspectionRequest[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "new" | "active_negotiation" | "completed" | "cancelled"
  >("new");
  const [selectedRequest, setSelectedRequest] =
    useState<InspectionRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseReason, setResponseReason] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.userType !== "Landowners") {
      router.push("/");
      return;
    }

    fetchInspectionRequests();
  }, [user, router]);

  useEffect(() => {
    filterRequests();
  }, [inspectionRequests, searchTerm, activeTab]);

  const fetchInspectionRequests = async () => {
    try {
      setIsLoading(true);

      // Mock data based on the payload structure - filtered for landlord's properties
      const mockData: InspectionRequest[] = [
        {
          _id: "686d86db9705e4892949e703",
          propertyId: {
            location: {
              state: "Lagos",
              localGovernment: "Agege",
              area: "Ogba",
            },
            _id: "686929af479bb6092b23b20e",
            propertyType: "3 Bedroom Apartment",
            briefType: "Sale",
            price: 4999990,
            owner: "683cd1d3fd1239006afe1648",
            pictures: ["/api/placeholder/400/300"],
            thumbnail: null,
          },
          inspectionDate: "2025-07-14T00:00:00.000Z",
          inspectionTime: "8:00 AM",
          status: "active_negotiation",
          requestedBy: {
            _id: "686d86d99705e4892949e6f9",
            fullName: "Hassan Taiwo",
          },
          transaction: "686d86db9705e4892949e701",
          isNegotiating: true,
          negotiationPrice: 4500000,
          letterOfIntention:
            "https://res.cloudinary.com/dkqjneask/image/upload/v1752008313/property-images/1752008310576-property-image.jpg",
          owner: {
            _id: "683cd1d3fd1239006afe1648",
            lastName: "AYOWOLE",
            firstName: "AJAYI",
            userType: "Agent",
            id: "683cd1d3fd1239006afe1648",
          },
          sellerCounterOffer: 0,
          pendingResponseFrom: "seller",
          stage: "negotiation",
          createdAt: "2025-07-08T21:00:11.477Z",
          updatedAt: "2025-07-12T07:18:04.601Z",
          inspectionStatus: "new",
          inspectionType: "LOI",
          isLOI: true,
          reason: "Kindly re-upload the LOI doc",
        },
        {
          _id: "686d86db9705e4892949e704",
          propertyId: {
            location: {
              state: "Lagos",
              localGovernment: "Lekki",
              area: "Phase 1",
            },
            _id: "686929af479bb6092b23b20f",
            propertyType: "4 Bedroom Duplex",
            briefType: "Rent",
            price: 2500000,
            owner: "683cd1d3fd1239006afe1649",
            pictures: ["/api/placeholder/400/300"],
            thumbnail: null,
          },
          inspectionDate: "2025-07-16T00:00:00.000Z",
          inspectionTime: "10:00 AM",
          status: "pending",
          requestedBy: {
            _id: "686d86d99705e4892949e6fa",
            fullName: "Sarah Johnson",
          },
          transaction: "686d86db9705e4892949e702",
          isNegotiating: true,
          negotiationPrice: 2200000,
          letterOfIntention: "",
          owner: {
            _id: "683cd1d3fd1239006afe1649",
            lastName: "ADEBAYO",
            firstName: "KEMI",
            userType: "Landowner",
            id: "683cd1d3fd1239006afe1649",
          },
          sellerCounterOffer: 0,
          pendingResponseFrom: "seller",
          stage: "inspection",
          createdAt: "2025-07-09T14:30:00.000Z",
          updatedAt: "2025-07-12T09:45:00.000Z",
          inspectionStatus: "new",
          inspectionType: "price",
          isLOI: false,
        },
        {
          _id: "686d86db9705e4892949e705",
          propertyId: {
            location: {
              state: "Lagos",
              localGovernment: "Ikeja",
              area: "Allen",
            },
            _id: "686929af479bb6092b23b20g",
            propertyType: "2 Bedroom Flat",
            briefType: "Sale",
            price: 1800000,
            owner: "683cd1d3fd1239006afe164a",
            pictures: ["/api/placeholder/400/300"],
            thumbnail: null,
          },
          inspectionDate: "2025-07-10T00:00:00.000Z",
          inspectionTime: "2:00 PM",
          status: "completed",
          requestedBy: {
            _id: "686d86d99705e4892949e6fb",
            fullName: "Mike Okafor",
          },
          transaction: "686d86db9705e4892949e703",
          isNegotiating: false,
          negotiationPrice: 0,
          letterOfIntention: "",
          owner: {
            _id: "683cd1d3fd1239006afe164a",
            lastName: "IBRAHIM",
            firstName: "FATIMA",
            userType: "Landowner",
            id: "683cd1d3fd1239006afe164a",
          },
          sellerCounterOffer: 0,
          pendingResponseFrom: "buyer",
          stage: "completed",
          createdAt: "2025-07-05T11:15:00.000Z",
          updatedAt: "2025-07-10T16:30:00.000Z",
          inspectionStatus: "accept",
          inspectionType: "price",
          isLOI: false,
        },
      ];

      setInspectionRequests(mockData);
    } catch (error) {
      console.error("Failed to fetch inspection requests:", error);
      toast.error("Failed to load inspection requests");
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...inspectionRequests];

    // Filter by status tab - map tabs to actual statuses
    if (activeTab === "new") {
      filtered = filtered.filter(
        (request) =>
          request.inspectionStatus === "new" || request.status === "pending",
      );
    } else {
      filtered = filtered.filter((request) => request.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.propertyId.propertyType
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.requestedBy.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.propertyId.location.area
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredRequests(filtered);
  };

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: "accept" | "reject" | "counter" | "request_changes",
    reason?: string,
  ) => {
    try {
      // Update local state immediately for better UX
      setInspectionRequests((prev) =>
        prev.map((request) =>
          request._id === requestId
            ? {
                ...request,
                inspectionStatus: newStatus,
                updatedAt: new Date().toISOString(),
                reason: reason || request.reason,
              }
            : request,
        ),
      );

      toast.success(`Inspection request ${newStatus}ed successfully`);
      setShowResponseModal(false);
      setResponseReason("");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
      fetchInspectionRequests();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
      case "pending":
        return <AlertCircleIcon size={16} className="text-blue-500" />;
      case "active_negotiation":
        return <MessageSquareIcon size={16} className="text-orange-500" />;
      case "completed":
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case "cancelled":
        return <XCircleIcon size={16} className="text-red-500" />;
      default:
        return <AlertCircleIcon size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "active_negotiation":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRequestCount = (status: string) => {
    if (status === "new") {
      return inspectionRequests.filter(
        (req) => req.inspectionStatus === "new" || req.status === "pending",
      ).length;
    }
    return inspectionRequests.filter((req) => req.status === status).length;
  };

  const shouldShowBuyerDetails = (request: InspectionRequest) => {
    return !(
      request.pendingResponseFrom === "seller" &&
      request.inspectionStatus === "new"
    );
  };

  const openDetailModal = (request: InspectionRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const openResponseModal = (request: InspectionRequest) => {
    setSelectedRequest(request);
    setShowResponseModal(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-[#8DDB90] hover:text-[#7BC87F] font-medium"
            >
              <ArrowLeftIcon size={20} />
              Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#09391C] font-display">
                Property Inspection Requests
              </h1>
              <p className="text-[#5A5D63] mt-2">
                Manage inspection requests for your properties
              </p>
            </div>
            <div className="text-sm text-[#5A5D63] bg-white px-4 py-2 rounded-lg">
              {filteredRequests.length} of {inspectionRequests.length} requests
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: "new", label: "New Requests", icon: AlertCircleIcon },
              {
                key: "active_negotiation",
                label: "Active Negotiations",
                icon: MessageSquareIcon,
              },
              { key: "completed", label: "Completed", icon: CheckCircleIcon },
              { key: "cancelled", label: "Cancelled", icon: XCircleIcon },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    activeTab === tab.key
                      ? "bg-[#8DDB90] text-white"
                      : "bg-gray-50 hover:bg-gray-100 text-[#5A5D63]"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent size={16} />
                    <h3 className="font-medium text-sm">{tab.label}</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    {getRequestCount(tab.key)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Filter */}
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
          <div className="relative">
            <SearchIcon
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by property, buyer name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
            />
          </div>
        </div>

        {/* Inspection Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg p-8 sm:p-12 text-center shadow-sm">
            <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchTerm
                ? "No matching requests found"
                : `No ${activeTab === "new" ? "new" : activeTab} inspection requests yet`}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try adjusting your search criteria"
                : `${activeTab === "new" ? "New" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} inspection requests will appear here`}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Property Image */}
                    <div className="lg:w-48 lg:h-32 w-full h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {request.propertyId.pictures?.[0] ? (
                        <img
                          src={request.propertyId.pictures[0]}
                          alt={request.propertyId.propertyType}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPinIcon size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-[#09391C]">
                              {request.propertyId.propertyType}
                            </h3>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {request.propertyId.briefType}
                            </span>
                            {request.isLOI && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                LOI
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-2">
                            <MapPinIcon size={14} />
                            {request.propertyId.location.area},{" "}
                            {request.propertyId.location.localGovernment},{" "}
                            {request.propertyId.location.state}
                          </p>
                          <p className="text-base font-medium text-[#8DDB90]">
                            Listed Price: ₦
                            {request.propertyId.price.toLocaleString()}
                          </p>
                          {request.negotiationPrice > 0 && (
                            <p className="text-sm text-orange-600 font-medium">
                              Offered Price: ₦
                              {request.negotiationPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                          >
                            {request.status === "active_negotiation"
                              ? "Negotiating"
                              : request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {/* Buyer Info - Only show if conditions are met */}
                        {shouldShowBuyerDetails(request) && (
                          <div>
                            <h4 className="text-sm font-medium text-[#09391C] mb-2 flex items-center gap-2">
                              <UserIcon size={16} />
                              Interested Buyer
                            </h4>
                            <p className="text-sm text-[#5A5D63] mb-1">
                              {request.requestedBy.fullName}
                            </p>
                          </div>
                        )}

                        {/* Inspection Schedule */}
                        <div>
                          <h4 className="text-sm font-medium text-[#09391C] mb-2 flex items-center gap-2">
                            <CalendarIcon size={16} />
                            Requested Schedule
                          </h4>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-1">
                            <CalendarIcon size={12} />
                            {new Date(
                              request.inspectionDate,
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1">
                            <ClockIcon size={12} />
                            {request.inspectionTime}
                          </p>
                        </div>

                        {/* Request Info */}
                        <div>
                          <h4 className="text-sm font-medium text-[#09391C] mb-2">
                            Request Details
                          </h4>
                          <p className="text-sm text-[#5A5D63] mb-1">
                            Type: {request.inspectionType.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Stage: {request.stage}
                          </p>
                          {request.pendingResponseFrom === "seller" && (
                            <p className="text-xs text-orange-600 font-medium mt-1">
                              Action Required
                            </p>
                          )}
                        </div>
                      </div>

                      {/* LOI Document */}
                      {request.isLOI && request.letterOfIntention && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-[#09391C] mb-2 flex items-center gap-2">
                            <FileTextIcon size={16} />
                            Letter of Intention
                          </h4>
                          <div className="flex items-center gap-3">
                            <a
                              href={request.letterOfIntention}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                            >
                              <DownloadIcon size={14} />
                              View LOI Document
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Reason (if rejected or needs changes) */}
                      {request.reason && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-[#09391C] mb-2">
                            {request.inspectionStatus === "reject"
                              ? "Rejection Reason"
                              : "Requested Changes"}
                          </h4>
                          <p className="text-sm text-[#5A5D63] bg-red-50 p-3 rounded-lg border border-red-200">
                            {request.reason}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => openDetailModal(request)}
                          className="text-[#8DDB90] hover:text-[#7BC87F] font-medium text-sm flex items-center gap-2"
                        >
                          <EyeIcon size={16} />
                          View Full Details
                        </button>

                        {request.inspectionStatus === "new" &&
                          request.pendingResponseFrom === "seller" && (
                            <div className="flex flex-col sm:flex-row gap-3">
                              <button
                                onClick={() =>
                                  handleStatusUpdate(request._id, "accept")
                                }
                                className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                              >
                                <CheckCircleIcon size={16} />
                                Accept Request
                              </button>
                              <button
                                onClick={() => openResponseModal(request)}
                                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                              >
                                <EditIcon size={16} />
                                Respond
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#09391C]">
                  Inspection Request Details
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-[#09391C] mb-3">
                  Property Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Type:</span>
                    <p>{selectedRequest.propertyId.propertyType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Brief Type:
                    </span>
                    <p>{selectedRequest.propertyId.briefType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Listed Price:
                    </span>
                    <p>₦{selectedRequest.propertyId.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Location:</span>
                    <p>
                      {selectedRequest.propertyId.location.area},{" "}
                      {selectedRequest.propertyId.location.localGovernment}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#09391C] mb-3">
                  Request Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Stage:</span>
                    <p className="capitalize">{selectedRequest.stage}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <p className="capitalize">
                      {selectedRequest.inspectionStatus}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Type:</span>
                    <p>{selectedRequest.inspectionType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Pending Response:
                    </span>
                    <p className="capitalize">
                      {selectedRequest.pendingResponseFrom}
                    </p>
                  </div>
                </div>
              </div>

              {shouldShowBuyerDetails(selectedRequest) && (
                <div>
                  <h3 className="font-semibold text-[#09391C] mb-3">
                    Buyer Information
                  </h3>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium text-gray-600">Name:</span>{" "}
                      {selectedRequest.requestedBy.fullName}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-[#09391C] mb-3">Timeline</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Created:</span>
                    <p>
                      {new Date(selectedRequest.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Last Updated:
                    </span>
                    <p>
                      {new Date(selectedRequest.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#09391C]">
                Respond to Inspection Request
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedRequest._id, "accept")
                  }
                  className="w-full bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon size={16} />
                  Accept Request
                </button>

                <button
                  onClick={() =>
                    handleStatusUpdate(
                      selectedRequest._id,
                      "reject",
                      responseReason || "Request declined",
                    )
                  }
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <XCircleIcon size={16} />
                  Reject Request
                </button>

                <button
                  onClick={() =>
                    handleStatusUpdate(
                      selectedRequest._id,
                      "request_changes",
                      responseReason || "Please make the following changes",
                    )
                  }
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <EditIcon size={16} />
                  Request Changes
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={responseReason}
                  onChange={(e) => setResponseReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                  rows={3}
                  placeholder="Provide a reason for your response..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
