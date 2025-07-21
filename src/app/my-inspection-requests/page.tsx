"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
  ArrowLeft as ArrowLeftIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  FileText as FileTextIcon,
  DollarSign as DollarSignIcon,
  User as UserIcon,
  Eye as EyeIcon,
  MessageSquare as MessageSquareIcon,
  Filter as FilterIcon,
  RefreshCw as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Building as BuildingIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  MoreHorizontal as MoreHorizontalIcon,
} from "lucide-react";
import Loading from "@/components/loading-component/loading";
import AuthGuard from "@/components/common/AuthGuard";

interface InspectionData {
  _id: string;
  propertyId: {
    _id: string;
    title: string;
    price: number;
    propertyType: string;
    propertyCategory: string;
    location: {
      state: string;
      localGovernment: string;
      area: string;
    };
  };
  bookedBy: string;
  bookedByModel: "Buyer" | "Agent";
  inspectionDate: string;
  inspectionTime: string;
  status: string;
  inspectionType: "price" | "LOI";
  inspectionMode: "in_person" | "virtual";
  inspectionStatus: string;
  negotiationPrice?: number;
  isNegotiating: boolean;
  isLOI: boolean;
  letterOfIntention?: string | null;
  reason?: string;
  owner: string;
  requestedBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  transaction: {
    _id: string;
    status: string;
    amountPaid: number;
  };
  pendingResponseFrom: "seller" | "buyer";
  stage: string;
  counterCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: InspectionData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface MetricsData {
  totalInspections: number;
  pendingInspections: number;
  approvedInspections: number;
  completedInspections: number;
  totalEarnings: number;
  averageResponseTime: string;
}

const STATUS_FILTERS = [
  { value: "", label: "All Status" },
  { value: "inspection_approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rejected", label: "Rejected" },
];

const TYPE_FILTERS = [
  { value: "", label: "All Types" },
  { value: "price", label: "Price Negotiation" },
  { value: "LOI", label: "Letter of Intention" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "status", label: "Status" },
];

export default function MyInspectionRequestsPage() {
  const router = useRouter();
  const { user } = useUserContext();
  
  const [inspections, setInspections] = useState<InspectionData[]>([]);
  const [filteredInspections, setFilteredInspections] = useState<InspectionData[]>([]);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInspection, setSelectedInspection] = useState<InspectionData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    status: "",
    inspectionType: "",
    sortBy: "newest",
    dateFrom: "",
    dateTo: "",
    priceRange: { min: "", max: "" },
  });

  // Fetch inspections from API
  const fetchInspections = useCallback(async (page = 1, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    if (!showLoading) setIsRefreshing(true);

    try {
      const url = `${URLS.BASE}/user/my-inspections/fetchAll?page=${page}&limit=10`;
      const token = Cookies.get("token");
      
      if (!token) {
        toast.error("Please login to continue");
        router.push("/auth/login");
        return;
      }

      const response = await GET_REQUEST(url, token);
      
      if (response.success) {
        setInspections(response.data || []);
        setTotalPages(response.meta?.totalPages || 1);
        setTotalCount(response.meta?.total || 0);
        setCurrentPage(response.meta?.page || 1);
        
        // Calculate metrics from the data
        calculateMetrics(response.data || []);
      } else {
        throw new Error(response.message || "Failed to fetch inspections");
      }
    } catch (error) {
      console.error("Failed to fetch inspections:", error);
      toast.error("Failed to load inspection requests");
      setInspections([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  // Calculate metrics from inspection data
  const calculateMetrics = useCallback((data: InspectionData[]) => {
    const metrics: MetricsData = {
      totalInspections: data.length,
      pendingInspections: data.filter(item => item.status === "pending").length,
      approvedInspections: data.filter(item => item.status === "inspection_approved").length,
      completedInspections: data.filter(item => item.status === "completed").length,
      totalEarnings: data.reduce((sum, item) => sum + (item.transaction?.amountPaid || 0), 0),
      averageResponseTime: "2.3 hours", // This would come from backend calculation
    };
    setMetrics(metrics);
  }, []);

  // Filter inspections based on search and filters
  const filterInspections = useCallback(() => {
    let filtered = [...inspections];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (inspection) =>
          inspection.propertyId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inspection.requestedBy.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inspection.propertyId.location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inspection.propertyId.location.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((inspection) => inspection.status === filters.status);
    }

    // Inspection type filter
    if (filters.inspectionType) {
      filtered = filtered.filter((inspection) => inspection.inspectionType === filters.inspectionType);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (inspection) => new Date(inspection.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (inspection) => new Date(inspection.createdAt) <= new Date(filters.dateTo)
      );
    }

    // Price range filter
    if (filters.priceRange.min) {
      filtered = filtered.filter(
        (inspection) => inspection.propertyId.price >= parseInt(filters.priceRange.min)
      );
    }

    if (filters.priceRange.max) {
      filtered = filtered.filter(
        (inspection) => inspection.propertyId.price <= parseInt(filters.priceRange.max)
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
      case "price_high":
        filtered.sort((a, b) => b.propertyId.price - a.propertyId.price);
        break;
      case "price_low":
        filtered.sort((a, b) => a.propertyId.price - b.propertyId.price);
        break;
      case "status":
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
    }

    setFilteredInspections(filtered);
  }, [inspections, searchTerm, filters]);

  // Initialize data
  useEffect(() => {
    if (user) {
      fetchInspections(1);
    }
  }, [user, fetchInspections]);

  // Apply filters when they change
  useEffect(() => {
    filterInspections();
  }, [filterInspections]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchInspections(currentPage, false);
  }, [fetchInspections, currentPage]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchInspections(page);
  }, [fetchInspections]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      status: "",
      inspectionType: "",
      sortBy: "newest",
      dateFrom: "",
      dateTo: "",
      priceRange: { min: "", max: "" },
    });
    setSearchTerm("");
  }, []);

  // Get status styling
  const getStatusStyles = useCallback((status: string) => {
    switch (status) {
      case "inspection_approved":
        return { bg: "bg-green-100", text: "text-green-800", icon: CheckCircleIcon };
      case "pending":
        return { bg: "bg-yellow-100", text: "text-yellow-800", icon: AlertCircleIcon };
      case "completed":
        return { bg: "bg-blue-100", text: "text-blue-800", icon: CheckCircleIcon };
      case "cancelled":
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-800", icon: XCircleIcon };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", icon: AlertCircleIcon };
    }
  }, []);

  // Format status text
  const formatStatus = useCallback((status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  }, []);

  // Handle view details
  const handleViewDetails = useCallback((inspection: InspectionData) => {
    setSelectedInspection(inspection);
    setShowDetailModal(true);
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <AuthGuard requireAuth allowedUserTypes={["Landowners", "Agent"]}>
        <Loading />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth allowedUserTypes={["Landowners", "Agent"]}>
      <div className="min-h-screen bg-[#EEF1F1] py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-[#8DDB90] hover:text-[#7BC87F] font-medium transition-colors"
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
                  {user?.userType === "Agent" 
                    ? "Manage inspection requests for your properties and clients"
                    : "Manage inspection requests for your properties"
                  }
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#09391C] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <RefreshIcon size={16} className={isRefreshing ? "animate-spin" : ""} />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
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
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BuildingIcon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-[#09391C]">{metrics.totalInspections}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertCircleIcon size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{metrics.pendingInspections}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircleIcon size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{metrics.approvedInspections}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CheckCircleIcon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-blue-600">{metrics.completedInspections}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <DollarSignIcon size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Earnings</p>
                    <p className="text-xl font-bold text-emerald-600">₦{metrics.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ClockIcon size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response</p>
                    <p className="text-lg font-bold text-purple-600">{metrics.averageResponseTime}</p>
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
              className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100 overflow-hidden"
            >
              <h3 className="text-lg font-semibold text-[#09391C] mb-4">Advanced Filters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                  >
                    {STATUS_FILTERS.map((option) => (
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
                    {TYPE_FILTERS.map((option) => (
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
                    {SORT_OPTIONS.map((option) => (
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
                  className="px-4 py-2 text-[#5A5D63] hover:text-[#09391C] font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}

          {/* Search Bar */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <div className="relative">
              <SearchIcon
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by property title, buyer name, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent text-lg"
              />
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-[#5A5D63]">
                {filteredInspections.length} of {totalCount} inspections
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
              <div className="text-sm text-[#5A5D63]">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {/* Inspections List */}
          {filteredInspections.length === 0 ? (
            <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-sm border border-gray-100">
              <BuildingIcon size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                {searchTerm || Object.values(filters).some(f => f && f !== "newest")
                  ? "No matching inspection requests found"
                  : "No inspection requests yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || Object.values(filters).some(f => f && f !== "newest")
                  ? "Try adjusting your search criteria or filters"
                  : "Inspection requests will appear here when buyers request to inspect your properties"}
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
              {filteredInspections.map((inspection, index) => {
                const statusStyles = getStatusStyles(inspection.status);
                const StatusIcon = statusStyles.icon;
                
                return (
                  <motion.div
                    key={inspection._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Property Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold text-[#09391C]">
                                  {inspection.propertyId.title}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                                  {formatStatus(inspection.status)}
                                </span>
                                {inspection.isLOI && (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    LOI
                                  </span>
                                )}
                                {inspection.counterCount > 0 && (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    {inspection.counterCount} Counter{inspection.counterCount !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-2">
                                <MapPinIcon size={14} />
                                {inspection.propertyId.location.area}, {inspection.propertyId.location.localGovernment}, {inspection.propertyId.location.state}
                              </p>
                              <p className="text-lg font-medium text-[#8DDB90] mb-2">
                                Listed Price: ₦{inspection.propertyId.price.toLocaleString()}
                              </p>
                              {inspection.negotiationPrice && (
                                <p className="text-sm text-orange-600 font-medium">
                                  Offered Price: ₦{inspection.negotiationPrice.toLocaleString()}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <StatusIcon size={20} className={statusStyles.text.replace('text-', 'text-').replace('-800', '-600')} />
                              <span className="text-xs text-gray-500">
                                {inspection.propertyId.propertyType} • {inspection.inspectionMode}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            {/* Buyer Information */}
                            <div>
                              <h4 className="text-sm font-medium text-[#09391C] mb-2 flex items-center gap-2">
                                <UserIcon size={16} />
                                Requested By
                              </h4>
                              <p className="text-sm text-[#5A5D63] mb-1 font-medium">
                                {inspection.requestedBy.fullName}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MailIcon size={12} />
                                {inspection.requestedBy.email}
                              </p>
                            </div>

                            {/* Inspection Schedule */}
                            <div>
                              <h4 className="text-sm font-medium text-[#09391C] mb-2 flex items-center gap-2">
                                <CalendarIcon size={16} />
                                Scheduled For
                              </h4>
                              <p className="text-sm text-[#5A5D63] flex items-center gap-1 mb-1">
                                <CalendarIcon size={12} />
                                {new Date(inspection.inspectionDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-[#5A5D63] flex items-center gap-1">
                                <ClockIcon size={12} />
                                {inspection.inspectionTime}
                              </p>
                            </div>

                            {/* Transaction Info */}
                            <div>
                              <h4 className="text-sm font-medium text-[#09391C] mb-2 flex items-center gap-2">
                                <DollarSignIcon size={16} />
                                Transaction
                              </h4>
                              <p className="text-sm text-[#5A5D63] mb-1">
                                ₦{inspection.transaction.amountPaid.toLocaleString()} paid
                              </p>
                              <p className="text-xs text-gray-500">
                                Status: {inspection.transaction.status}
                              </p>
                            </div>
                          </div>

                          {/* Additional Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-[#09391C] mb-2">Request Details</h4>
                              <div className="space-y-1 text-sm text-[#5A5D63]">
                                <p>Type: {inspection.inspectionType.toUpperCase()}</p>
                                <p>Stage: {inspection.stage}</p>
                                <p>Mode: {inspection.inspectionMode}</p>
                                {inspection.pendingResponseFrom && (
                                  <p className="text-orange-600 font-medium">
                                    Pending response from: {inspection.pendingResponseFrom}
                                  </p>
                                )}
                              </div>
                            </div>

                            {inspection.reason && (
                              <div>
                                <h4 className="text-sm font-medium text-[#09391C] mb-2">Reason/Notes</h4>
                                <p className="text-sm text-[#5A5D63] bg-gray-50 p-3 rounded-lg border">
                                  {inspection.reason}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => handleViewDetails(inspection)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors text-sm font-medium"
                            >
                              <EyeIcon size={16} />
                              View Details
                            </button>
                            
                            {inspection.status === "pending" && (
                              <button
                                onClick={() => router.push(`/secure-seller-response/${inspection.requestedBy._id}/${inspection._id}`)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                <MessageSquareIcon size={16} />
                                Respond
                              </button>
                            )}
                            
                            <button
                              onClick={() => router.push(`/property/${inspection.propertyId.propertyCategory}/${inspection.propertyId._id}`)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#09391C] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                            >
                              <HomeIcon size={16} />
                              View Property
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl p-6 mt-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} results
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            page === currentPage
                              ? "bg-[#8DDB90] text-white"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedInspection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-[#09391C]">
                    Inspection Request Details
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircleIcon size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Property Information */}
                <div>
                  <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Property Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-600">Title:</span>
                      <p className="mt-1">{selectedInspection.propertyId.title}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <p className="mt-1">{selectedInspection.propertyId.propertyType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Category:</span>
                      <p className="mt-1">{selectedInspection.propertyId.propertyCategory}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Price:</span>
                      <p className="mt-1 font-medium text-[#8DDB90]">₦{selectedInspection.propertyId.price.toLocaleString()}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-600">Location:</span>
                      <p className="mt-1">
                        {selectedInspection.propertyId.location.area}, {selectedInspection.propertyId.location.localGovernment}, {selectedInspection.propertyId.location.state}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inspection Details */}
                <div>
                  <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Inspection Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-600">Date:</span>
                      <p className="mt-1">{new Date(selectedInspection.inspectionDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Time:</span>
                      <p className="mt-1">{selectedInspection.inspectionTime}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Mode:</span>
                      <p className="mt-1 capitalize">{selectedInspection.inspectionMode}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <p className="mt-1">{selectedInspection.inspectionType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <p className="mt-1 capitalize">{formatStatus(selectedInspection.status)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Stage:</span>
                      <p className="mt-1 capitalize">{selectedInspection.stage}</p>
                    </div>
                  </div>
                </div>

                {/* Buyer Information */}
                <div>
                  <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Buyer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-600">Name:</span>
                      <p className="mt-1">{selectedInspection.requestedBy.fullName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <p className="mt-1">{selectedInspection.requestedBy.email}</p>
                    </div>
                  </div>
                </div>

                {/* Negotiation Information */}
                {selectedInspection.isNegotiating && (
                  <div>
                    <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Negotiation Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-blue-50 p-4 rounded-lg">
                      {selectedInspection.negotiationPrice && (
                        <div>
                          <span className="font-medium text-blue-700">Offered Price:</span>
                          <p className="mt-1 font-medium text-blue-900">₦{selectedInspection.negotiationPrice.toLocaleString()}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-blue-700">Counter Count:</span>
                        <p className="mt-1">{selectedInspection.counterCount}</p>
                      </div>
                      <div>
                        <span className="font-medium text-blue-700">Pending Response From:</span>
                        <p className="mt-1 capitalize">{selectedInspection.pendingResponseFrom}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transaction Information */}
                <div>
                  <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Transaction Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-600">Amount Paid:</span>
                      <p className="mt-1 font-medium text-emerald-600">₦{selectedInspection.transaction.amountPaid.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Transaction Status:</span>
                      <p className="mt-1 capitalize">{selectedInspection.transaction.status}</p>
                    </div>
                  </div>
                </div>

                {/* Reason/Notes */}
                {selectedInspection.reason && (
                  <div>
                    <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Reason/Notes</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{selectedInspection.reason}</p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="font-semibold text-[#09391C] mb-3 text-lg">Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-600">Created:</span>
                      <p className="mt-1">{new Date(selectedInspection.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Last Updated:</span>
                      <p className="mt-1">{new Date(selectedInspection.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  {selectedInspection.status === "pending" && (
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        router.push(`/secure-seller-response/${selectedInspection.requestedBy._id}/${selectedInspection._id}`);
                      }}
                      className="px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors"
                    >
                      Respond to Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
