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
  Filter as FilterIcon,
  RefreshCw as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Building as BuildingIcon,
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
    title?: string;
  };
  inspectionDate: string;
  inspectionTime: string;
  status: "active_negotiation" | "completed" | "cancelled" | "pending";
  requestedBy: {
    _id: string;
    fullName: string;
    email?: string;
    phoneNumber?: string;
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
  priority?: "high" | "medium" | "low";
  counterCount?: number;
}

interface MetricsData {
  totalRequests: number;
  newRequests: number;
  activeNegotiations: number;
  completedRequests: number;
  averageResponseTime: string;
  conversionRate: string;
}

const FILTER_OPTIONS = {
  status: [
    { value: "", label: "All Status" },
    { value: "new", label: "New Requests" },
    { value: "active_negotiation", label: "Active Negotiations" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ],
  priority: [
    { value: "", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ],
  inspectionType: [
    { value: "", label: "All Types" },
    { value: "price", label: "Price Negotiation" },
    { value: "LOI", label: "Letter of Intention" },
  ],
  sortBy: [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "priority", label: "Priority" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "price_low", label: "Price: Low to High" },
  ],
};

export default function MyInspectionRequestsPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [inspectionRequests, setInspectionRequests] = useState<InspectionRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<InspectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"new" | "active_negotiation" | "completed" | "cancelled">("new");
  const [selectedRequest, setSelectedRequest] = useState<InspectionRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseReason, setResponseReason] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  
  // Advanced filters
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    inspectionType: "",
    sortBy: "newest",
    dateFrom: "",
    dateTo: "",
    priceRange: { min: "", max: "" },
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Allow both landlords and agents to access this page
    if (!["Landowners", "Agent"].includes(user.userType)) {
      router.push("/");
      return;
    }

    fetchInspectionRequests();
    fetchMetrics();
  }, [user, router]);

  useEffect(() => {
    filterRequests();
  }, [inspectionRequests, searchTerm, activeTab, filters]);

  const fetchMetrics = async () => {
    try {
      // Mock metrics data - replace with actual API call
      const mockMetrics: MetricsData = {
        totalRequests: 45,
        newRequests: 12,
        activeNegotiations: 8,
        completedRequests: 20,
        averageResponseTime: "2.3 hours",
        conversionRate: "68%",
      };
      setMetrics(mockMetrics);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  const fetchInspectionRequests = async () => {
    try {
      setIsLoading(true);

      // Enhanced mock data with more properties for better demonstration
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
            title: "Luxury 3BR Apartment in Ogba",
          },
          inspectionDate: "2025-07-14T00:00:00.000Z",
          inspectionTime: "8:00 AM",
          status: "active_negotiation",
          requestedBy: {
            _id: "686d86d99705e4892949e6f9",
            fullName: "Hassan Taiwo",
            email: "hassan.taiwo@email.com",
            phoneNumber: "+234 803 123 4567",
          },
          transaction: "686d86db9705e4892949e701",
          isNegotiating: true,
          negotiationPrice: 4500000,
          letterOfIntention: "https://res.cloudinary.com/dkqjneask/image/upload/v1752008313/property-images/1752008310576-property-image.jpg",
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
          priority: "high",
          counterCount: 2,
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
            title: "Modern 4BR Duplex in Lekki Phase 1",
          },
          inspectionDate: "2025-07-16T00:00:00.000Z",
          inspectionTime: "10:00 AM",
          status: "pending",
          requestedBy: {
            _id: "686d86d99705e4892949e6fa",
            fullName: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            phoneNumber: "+234 805 987 6543",
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
          priority: "medium",
          counterCount: 0,
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
            title: "Cozy 2BR Flat in Allen Avenue",
          },
          inspectionDate: "2025-07-10T00:00:00.000Z",
          inspectionTime: "2:00 PM",
          status: "completed",
          requestedBy: {
            _id: "686d86d99705e4892949e6fb",
            fullName: "Mike Okafor",
            email: "mike.okafor@email.com",
            phoneNumber: "+234 802 456 7890",
          },
          transaction: "686d86db9705e4892949e703",
          isNegotiating: false,
          negotiationPrice: 1750000,
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
          priority: "low",
          counterCount: 1,
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
    if (activeTab === "new") {
      filtered = filtered.filter(
        (request) => request.inspectionStatus === "new" || request.status === "pending"
      );
    } else {
      filtered = filtered.filter((request) => request.status === activeTab);
    }

    // Apply advanced filters
    if (filters.status && filters.status !== activeTab) {
      filtered = filtered.filter((request) => request.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter((request) => request.priority === filters.priority);
    }

    if (filters.inspectionType) {
      filtered = filtered.filter((request) => request.inspectionType === filters.inspectionType);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (request) => new Date(request.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (request) => new Date(request.createdAt) <= new Date(filters.dateTo)
      );
    }

    if (filters.priceRange.min) {
      filtered = filtered.filter(
        (request) => request.propertyId.price >= parseInt(filters.priceRange.min)
      );
    }

    if (filters.priceRange.max) {
      filtered = filtered.filter(
        (request) => request.propertyId.price <= parseInt(filters.priceRange.max)
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.propertyId.propertyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.requestedBy.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.propertyId.location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.propertyId.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => (priorityOrder[b.priority || "low"] || 1) - (priorityOrder[a.priority || "low"] || 1));
        break;
      case "price_high":
        filtered.sort((a, b) => b.propertyId.price - a.propertyId.price);
        break;
      case "price_low":
        filtered.sort((a, b) => a.propertyId.price - b.propertyId.price);
        break;
    }

    setFilteredRequests(filtered);
  };

  const handleStatusUpdate = async (
    requestId: string,
    newStatus: "accept" | "reject" | "counter" | "request_changes",
    reason?: string
  ) => {
    try {
      setInspectionRequests((prev) =>
        prev.map((request) =>
          request._id === requestId
            ? {
                ...request,
                inspectionStatus: newStatus,
                updatedAt: new Date().toISOString(),
                reason: reason || request.reason,
              }
            : request
        )
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

  const getPriorityColor = (priority?: string) => {
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

  const getRequestCount = (status: string) => {
    if (status === "new") {
      return inspectionRequests.filter(
        (req) => req.inspectionStatus === "new" || req.status === "pending"
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

  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      inspectionType: "",
      sortBy: "newest",
      dateFrom: "",
      dateTo: "",
      priceRange: { min: "", max: "" },
    });
    setSearchTerm("");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
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

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#09391C] font-display mb-2">
                My Inspection Requests
              </h1>
              <p className="text-[#5A5D63] text-lg">
                {user.userType === "Agent" 
                  ? "Manage inspection requests for your properties and clients"
                  : "Manage inspection requests for your properties"
                }
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => fetchInspectionRequests()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#09391C] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshIcon size={16} />
                Refresh
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors"
              >
                <FilterIcon size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Dashboard */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BuildingIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-[#09391C]">{metrics.totalRequests}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircleIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">New</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.newRequests}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquareIcon size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.activeNegotiations}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.completedRequests}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ClockIcon size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response</p>
                  <p className="text-lg font-bold text-purple-600">{metrics.averageResponseTime}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUpIcon size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion</p>
                  <p className="text-lg font-bold text-emerald-600">{metrics.conversionRate}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100 overflow-hidden"
          >
            <h3 className="text-lg font-semibold text-[#09391C] mb-4">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                >
                  {FILTER_OPTIONS.priority.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filters.inspectionType}
                  onChange={(e) => setFilters({...filters, inspectionType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                >
                  {FILTER_OPTIONS.inspectionType.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                >
                  {FILTER_OPTIONS.sortBy.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (₦)</label>
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => setFilters({...filters, priceRange: {...filters.priceRange, min: e.target.value}})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (₦)</label>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters({...filters, priceRange: {...filters.priceRange, max: e.target.value}})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                  placeholder="∞"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-[#5A5D63] hover:text-[#09391C] font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Status Tabs */}
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: "new", label: "New Requests", icon: AlertCircleIcon },
              { key: "active_negotiation", label: "Active Negotiations", icon: MessageSquareIcon },
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
              placeholder="Search by property, buyer name, location, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent text-lg"
            />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-[#5A5D63]">
              {filteredRequests.length} of {inspectionRequests.length} requests
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
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
                ? "Try adjusting your search criteria or filters"
                : `${activeTab === "new" ? "New" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} inspection requests will appear here`}
            </p>
            {(searchTerm || Object.values(filters).some(f => f && f !== "newest")) && (
              <button
                onClick={clearFilters}
                className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear All Filters
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
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
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
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-[#09391C]">
                              {request.propertyId.title || request.propertyId.propertyType}
                            </h3>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {request.propertyId.briefType}
                            </span>
                            {request.isLOI && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                LOI
                              </span>
                            )}
                            {request.priority && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                {request.priority?.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-2">
                            <MapPinIcon size={14} />
                            {request.propertyId.location.area}, {request.propertyId.location.localGovernment}, {request.propertyId.location.state}
                          </p>
                          <p className="text-base font-medium text-[#8DDB90]">
                            Listed Price: ₦{request.propertyId.price.toLocaleString()}
                          </p>
                          {request.negotiationPrice > 0 && (
                            <p className="text-sm text-orange-600 font-medium">
                              Offered Price: ₦{request.negotiationPrice.toLocaleString()}
                            </p>
                          )}
                          {request.counterCount !== undefined && request.counterCount > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Counter offers: {request.counterCount}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusIcon(request.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status === "active_negotiation" ? "Negotiating" : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {/* Buyer Info */}
                        {shouldShowBuyerDetails(request) && (
                          <div>
                            <h4 className="text-sm font-medium text-[#09391C] mb-2 flex items-center gap-2">
                              <UserIcon size={16} />
                              Interested Buyer
                            </h4>
                            <p className="text-sm text-[#5A5D63] mb-1">
                              {request.requestedBy.fullName}
                            </p>
                            {request.requestedBy.phoneNumber && (
                              <p className="text-xs text-gray-500">
                                {request.requestedBy.phoneNumber}
                              </p>
                            )}
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
                            {new Date(request.inspectionDate).toLocaleDateString()}
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

                      {/* Reason */}
                      {request.reason && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-[#09391C] mb-2">
                            {request.inspectionStatus === "reject" ? "Rejection Reason" : "Requested Changes"}
                          </h4>
                          <p className="text-sm text-[#5A5D63] bg-red-50 p-3 rounded-lg border border-red-200">
                            {request.reason}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => router.push(`/secure-seller-response/${request.requestedBy._id}/${request._id}`)}
                          className="text-[#8DDB90] hover:text-[#7BC87F] font-medium text-sm flex items-center gap-2"
                        >
                          <EyeIcon size={16} />
                          View Details & Respond
                        </button>

                        {request.inspectionStatus === "new" && request.pendingResponseFrom === "seller" && (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => router.push(`/secure-seller-response/${request.requestedBy._id}/${request._id}`)}
                              className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                              <MessageSquareIcon size={16} />
                              Respond to Request
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
    </div>
  );
}
