"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";
import { GET_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  User as UserIcon,
  ArrowLeft as ArrowLeftIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
} from "lucide-react";
import Loading from "@/components/loading-component/loading";

interface InspectionRequest {
  _id: string;
  property: {
    _id: string;
    propertyType: string;
    title: string;
    location: {
      state: string;
      localGovernment: string;
      area: string;
    };
    price: number;
    pictures: string[];
  };
  client: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  requestedDate: string;
  requestedTime: string;
  message?: string;
  status: "new" | "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export default function InspectionRequestsPage() {
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
    "new" | "active" | "completed" | "cancelled"
  >("active");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.userType !== "Agent") {
      router.push("/");
      return;
    }

    if (!user.accountApproved) {
      router.push("/agent/under-review");
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

      // Mock data for demonstration - replace with actual API call
      const mockData: InspectionRequest[] = [
        {
          _id: "1",
          property: {
            _id: "prop1",
            propertyType: "3 Bedroom Apartment",
            title: "Luxury Apartment in Victoria Island",
            location: {
              state: "Lagos",
              localGovernment: "Lagos Island",
              area: "Victoria Island",
            },
            price: 25000000,
            pictures: ["/api/placeholder/400/300"],
          },
          client: {
            _id: "client1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@email.com",
            phoneNumber: "+234 803 123 4567",
          },
          requestedDate: "2024-01-15",
          requestedTime: "10:00 AM",
          message:
            "I'm interested in viewing this property this weekend. Please confirm availability.",
          status: "active",
          createdAt: "2024-01-10T10:00:00.000Z",
          updatedAt: "2024-01-10T10:00:00.000Z",
        },
        {
          _id: "2",
          property: {
            _id: "prop2",
            propertyType: "4 Bedroom Duplex",
            title: "Modern Duplex in Lekki",
            location: {
              state: "Lagos",
              localGovernment: "Eti-Osa",
              area: "Lekki Phase 1",
            },
            price: 45000000,
            pictures: ["/api/placeholder/400/300"],
          },
          client: {
            _id: "client2",
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah.johnson@email.com",
            phoneNumber: "+234 801 987 6543",
          },
          requestedDate: "2024-01-12",
          requestedTime: "2:00 PM",
          status: "new",
          createdAt: "2024-01-08T14:00:00.000Z",
          updatedAt: "2024-01-09T09:30:00.000Z",
        },
        {
          _id: "3",
          property: {
            _id: "prop3",
            propertyType: "2 Bedroom Flat",
            title: "Cozy Flat in Ikeja",
            location: {
              state: "Lagos",
              localGovernment: "Ikeja",
              area: "Allen Avenue",
            },
            price: 18000000,
            pictures: ["/api/placeholder/400/300"],
          },
          client: {
            _id: "client3",
            firstName: "Michael",
            lastName: "Brown",
            email: "michael.brown@email.com",
            phoneNumber: "+234 802 456 7890",
          },
          requestedDate: "2024-01-08",
          requestedTime: "11:00 AM",
          status: "completed",
          createdAt: "2024-01-05T16:00:00.000Z",
          updatedAt: "2024-01-08T12:00:00.000Z",
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

    // Filter by status tab
    filtered = filtered.filter((request) => request.status === activeTab);

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.property.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.client.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.client.lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.property.location.area
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredRequests(filtered);
  };

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: "active" | "completed" | "cancelled",
  ) => {
    try {
      // Update local state immediately for better UX
      setInspectionRequests((prev) =>
        prev.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : request,
        ),
      );

      // Here you would make the actual API call
      // await POST_REQUEST(`${URLS.BASE}/agent/inspection-requests/${requestId}/status`,
      //   { status: newStatus }, Cookies.get("agentToken") || Cookies.get("token"));

      toast.success(`Inspection request ${newStatus} successfully`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
      // Revert local state on error
      fetchInspectionRequests();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircleIcon size={16} className="text-blue-500" />;
      case "active":
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case "cancelled":
        return <XCircleIcon size={16} className="text-red-500" />;
      case "completed":
        return <CheckCircleIcon size={16} className="text-purple-500" />;
      default:
        return <AlertCircleIcon size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "new":
        return <AlertCircleIcon size={16} />;
      case "active":
        return <CheckCircleIcon size={16} />;
      case "completed":
        return <CheckCircleIcon size={16} />;
      case "cancelled":
        return <XCircleIcon size={16} />;
      default:
        return <AlertCircleIcon size={16} />;
    }
  };

  const getRequestCount = (status: string) => {
    return inspectionRequests.filter((req) => req.status === status).length;
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
              href="/agent/dashboard"
              className="inline-flex items-center gap-2 text-[#8DDB90] hover:text-[#7BC87F] font-medium"
            >
              <ArrowLeftIcon size={20} />
              Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#09391C] font-display">
                Inspection Requests
              </h1>
              <p className="text-[#5A5D63] mt-2">
                Manage property inspection requests from potential clients
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
            {["new", "active", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`p-4 rounded-lg text-left transition-colors ${
                  activeTab === tab
                    ? "bg-[#8DDB90] text-white"
                    : "bg-gray-50 hover:bg-gray-100 text-[#5A5D63]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {getTabIcon(tab)}
                  <h3 className="font-medium capitalize">{tab} Requests</h3>
                </div>
                <p className="text-2xl font-bold">{getRequestCount(tab)}</p>
              </button>
            ))}
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
              placeholder="Search by property, client name, or location..."
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
              {searchTerm || statusFilter !== "all"
                ? "No matching requests found"
                : "No inspection requests yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Inspection requests from clients will appear here"}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear Filters
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
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Property Image */}
                    <div className="lg:w-48 lg:h-32 w-full h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {request.property.pictures?.[0] ? (
                        <img
                          src={request.property.pictures[0]}
                          alt={request.property.title}
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
                          <h3 className="text-lg font-semibold text-[#09391C] mb-1">
                            {request.property.title}
                          </h3>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-2">
                            <MapPinIcon size={14} />
                            {request.property.location.area},{" "}
                            {request.property.location.localGovernment}
                          </p>
                          <p className="text-base font-medium text-[#8DDB90]">
                            ₦{request.property.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-[#09391C] mb-2 flex items-center gap-2">
                            <UserIcon size={16} />
                            Client Details
                          </h4>
                          <p className="text-sm text-[#5A5D63] mb-1">
                            {request.client.firstName} {request.client.lastName}
                          </p>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-1">
                            <MailIcon size={12} />
                            {request.client.email}
                          </p>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1">
                            <PhoneIcon size={12} />
                            {request.client.phoneNumber}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-[#09391C] mb-2 flex items-center gap-2">
                            <CalendarIcon size={16} />
                            Requested Schedule
                          </h4>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-1">
                            <CalendarIcon size={12} />
                            {new Date(
                              request.requestedDate,
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1">
                            <ClockIcon size={12} />
                            {request.requestedTime}
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      {request.message && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-[#09391C] mb-2">
                            Message
                          </h4>
                          <p className="text-sm text-[#5A5D63] bg-gray-50 p-3 rounded-lg">
                            {request.message}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      {request.status === "pending" && (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() =>
                              handleStatusUpdate(request._id, "approved")
                            }
                            className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircleIcon size={16} />
                            Approve Request
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(request._id, "rejected")
                            }
                            className="bg-white hover:bg-gray-50 text-red-600 border border-red-300 px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <XCircleIcon size={16} />
                            Reject Request
                          </button>
                        </div>
                      )}

                      {request.status === "approved" && (
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Inspection approved!</strong> Contact the
                            client to confirm final details.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
