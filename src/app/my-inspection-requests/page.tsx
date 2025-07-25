"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";
import { GET_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  ArrowLeft as ArrowLeftIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  DollarSign as DollarSignIcon,
  Eye as EyeIcon,
  MessageSquare as MessageSquareIcon,
  Filter as FilterIcon,
  RefreshCw as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  BarChart3 as BarChart3Icon,
  Activity as ActivityIcon,
  Home as HomeIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  MoreHorizontal as MoreHorizontalIcon,
  X as XIcon,
  Grid2X2 as GridIcon,
  List as ListIcon,
  Timer,
  Users,
  Building,
  Video,
  User,
  FileText,
  Clock3,
  ArrowUpRight,
  Zap,
  Target,
  Badge,
  CheckCircle2,
  Package,
  Clock4,
  XCircle,
} from "lucide-react";
import Loading from "@/components/loading-component/loading";
import AuthGuard from "@/components/common/AuthGuard";

interface Property {
  id: string;
  title: string;
  price: number;
  image: string;
  status: string;
  briefType: string;
  isAvailable: boolean;
}

interface InspectionData {
  id: string;
  property: Property | null;
  inspectionDate: string;
  inspectionTime: string;
  inspectionType: "price" | "LOI";
  inspectionMode: "in_person" | "virtual";
  inspectionStatus: string;
  status: string;
  isNegotiating: boolean;
  isLOI: boolean;
  owner: string;
  negotiationPrice: number;
  counterCount: number;
  reason: string | null;
  pendingResponseFrom: "buyer" | "seller" | "admin";
  stage: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: InspectionData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface StatsResponse {
  success: boolean;
  data: {
    totalInspections: number;
    pendingInspections: number;
    completedInspections: number;
    cancelledInspections: number;
    averageResponseTimeInHours: number;
  };
}

const STATUS_CONFIG = {
  pending_transaction: {
    label: "Pending Transaction",
    color: "bg-[#8DDB90]",
    textColor: "text-amber-800",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    icon: Timer,
  },
  inspection_approved: {
    label: "Inspection Approved",
    color: "bg-[#8DDB90]",
    textColor: "text-green-800",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    icon: CheckCircleIcon,
  },
  new: {
    label: "New Request",
    color: "bg-[#8DDB90]",
    textColor: "text-blue-800",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    icon: AlertCircleIcon,
  },
  completed: {
    label: "Completed",
    color: "bg-[#8DDB90]",
    textColor: "text-blue-800",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    icon: CheckCircleIcon,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-[#8DDB90]",
    textColor: "text-red-800",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    icon: XCircleIcon,
  },
  pending: {
    label: "Pending",
    color: "bg-[#8DDB90]",
    textColor: "text-yellow-800",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    icon: AlertCircleIcon,
  },
};

const TYPE_CONFIG = {
  price: {
    label: "Price Negotiation",
    icon: DollarSignIcon,
    color: "bg-[#8DDB90]",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  LOI: {
    label: "Letter of Intent",
    icon: FileText,
    color: "bg-[#8DDB90]",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
  },
};

const MODE_CONFIG = {
  in_person: {
    label: "In Person",
    icon: Users,
    color: "text-[#09391C]",
  },
  virtual: {
    label: "Virtual",
    icon: Video,
    color: "text-[#8DDB90]",
  },
};

export default function MyInspectionRequestsPage() {
  const router = useRouter();
  const { user } = useUserContext();

  const [inspections, setInspections] = useState<InspectionData[]>([]);
  const [stats, setStats] = useState<StatsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInspection, setSelectedInspection] = useState<InspectionData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    inspectionType: "",
    inspectionMode: "",
    sortBy: "newest",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch inspections from API
  const fetchInspections = useCallback(
    async (page = 1, showLoading = true) => {
      if (showLoading) setIsLoading(true);
      if (!showLoading) setIsRefreshing(true);

      try {
        const url = `${URLS.BASE}/account/my-inspections/fetchAll?page=${page}&limit=10`;
        const token = Cookies.get("token");

        if (!token) {
          toast.error("Please login to continue");
          router.push("/auth/login");
          return;
        }

        const response = await GET_REQUEST(url, token);

        if (response.success) {
          setInspections(response.data || []);
          setTotalPages(response.pagination?.totalPages || 1);
          setTotalCount(response.pagination?.total || 0);
          setCurrentPage(response.pagination?.page || 1);
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
    },
    [router]
  );

  // Fetch stats from API
  const fetchStats = useCallback(async () => {
    try {
      const url = `${URLS.BASE}/account/my-inspections/stats`;
      const token = Cookies.get("token");

      if (!token) return;

      const response = await GET_REQUEST(url, token);

      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    if (user) {
      fetchInspections(1);
      fetchStats();
    }
  }, [user, fetchInspections, fetchStats]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchInspections(currentPage, false);
    fetchStats();
  }, [fetchInspections, fetchStats, currentPage]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchInspections(page);
    },
    [fetchInspections]
  );

  // Filter inspections
  const filteredInspections = inspections.filter((inspection) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        inspection.property?.title?.toLowerCase().includes(searchLower) ||
        inspection.inspectionType.toLowerCase().includes(searchLower) ||
        inspection.status.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.status && inspection.status !== filters.status) return false;
    if (filters.inspectionType && inspection.inspectionType !== filters.inspectionType) return false;
    if (filters.inspectionMode && inspection.inspectionMode !== filters.inspectionMode) return false;

    return true;
  });

  // Handle view details
  const handleViewDetails = useCallback((inspection: InspectionData) => {
    setSelectedInspection(inspection);
    setShowDetailModal(true);
  }, []);

  // Get status config
  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
  };

  // Get type config
  const getTypeConfig = (type: string) => {
    return TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.price;
  };

  // Get mode config
  const getModeConfig = (mode: string) => {
    return MODE_CONFIG[mode as keyof typeof MODE_CONFIG] || MODE_CONFIG.in_person;
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: "",
      inspectionType: "",
      inspectionMode: "",
      sortBy: "newest",
      dateFrom: "",
      dateTo: "",
    });
    setSearchTerm("");
  };

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
      <div className="min-h-screen bg-[#EEF1F1]">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-[#8DDB90] hover:text-[#09391C] font-medium transition-colors"
              >
                <ArrowLeftIcon size={20} />
                Back to Dashboard
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#09391C] font-display mb-3">
                  My Inspection Requests
                </h1>
                <p className="text-[#5A5D63] text-lg">
                  Monitor and manage all your property inspection requests in one place
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#09391C] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <RefreshIcon
                    size={16}
                    className={isRefreshing ? "animate-spin" : ""}
                  />
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

          {/* Stats Dashboard */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-[#09391C]">{stats.totalInspections}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertCircleIcon size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingInspections}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircleIcon size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completedInspections}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <XCircleIcon size={24} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cancelled</p>
                    <p className="text-2xl font-bold text-red-600">{stats.cancelledInspections}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ClockIcon size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response</p>
                    <p className="text-lg font-bold text-purple-600">{stats.averageResponseTimeInHours.toFixed(1)}h</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white rounded-xl p-6 mb-6 border border-gray-100 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[#09391C] flex items-center gap-2">
                    <FilterIcon size={20} />
                    Advanced Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#5A5D63] hover:text-[#09391C] transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    >
                      <option value="">All Status</option>
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={filters.inspectionType}
                      onChange={(e) => setFilters({ ...filters, inspectionType: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      <option value="price">Price Negotiation</option>
                      <option value="LOI">Letter of Intent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode
                    </label>
                    <select
                      value={filters.inspectionMode}
                      onChange={(e) => setFilters({ ...filters, inspectionMode: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    >
                      <option value="">All Modes</option>
                      <option value="in_person">In Person</option>
                      <option value="virtual">Virtual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="status">By Status</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search and View Controls */}
          <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by property title, type, or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent text-lg"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-white text-[#8DDB90]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <GridIcon size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-white text-[#8DDB90]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <ListIcon size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm text-[#5A5D63]">
              <div>
                {filteredInspections.length} of {totalCount} inspections
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
              <div>Page {currentPage} of {totalPages}</div>
            </div>
          </div>

          {/* Inspections List */}
          {filteredInspections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 sm:p-12 text-center border border-gray-100"
            >
              <Building size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                {searchTerm || Object.values(filters).some((f) => f)
                  ? "No matching inspection requests found"
                  : "No inspection requests yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || Object.values(filters).some((f) => f)
                  ? "Try adjusting your search criteria or filters"
                  : "Inspection requests will appear here when buyers request to inspect your properties"}
              </p>
              {(searchTerm || Object.values(filters).some((f) => f)) && (
                <button
                  onClick={clearFilters}
                  className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-4"}>
              {filteredInspections.map((inspection, index) => {
                const statusConfig = getStatusConfig(inspection.status);
                const typeConfig = getTypeConfig(inspection.inspectionType);
                const modeConfig = getModeConfig(inspection.inspectionMode);
                const StatusIcon = statusConfig.icon;
                const TypeIcon = typeConfig.icon;
                const ModeIcon = modeConfig.icon;

                return (
                  <motion.div
                    key={inspection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-all duration-200 ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    {/* Property Image for Grid View */}
                    {viewMode === "grid" && inspection.property?.image && (
                      <div className="h-48 relative overflow-hidden">
                        <img
                          src={inspection.property.image}
                          alt={inspection.property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color} text-white`}>
                            {statusConfig.label}
                          </span>
                          {inspection.isLOI && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                              LOI
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Property Image for List View */}
                    {viewMode === "list" && inspection.property?.image && (
                      <div className="w-32 h-32 relative overflow-hidden">
                        <img
                          src={inspection.property.image}
                          alt={inspection.property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-6 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-[#09391C] mb-1 truncate">
                            {inspection.property?.title || "Property Unavailable"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-[#5A5D63]">
                            <MapPinIcon size={14} />
                            <span>Inspection Request</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {viewMode === "grid" && (
                            <>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                                <StatusIcon size={12} className="inline mr-1" />
                                {statusConfig.label}
                              </span>
                              {inspection.isLOI && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                  LOI
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* List View Status for List Mode */}
                      {viewMode === "list" && (
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                            <StatusIcon size={12} className="inline mr-1" />
                            {statusConfig.label}
                          </span>
                          {inspection.isLOI && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                              LOI
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price Information */}
                      {inspection.property?.price && (
                        <div className="mb-4">
                          <p className="text-lg font-semibold text-[#8DDB90]">
                            ₦{inspection.property.price.toLocaleString()}
                          </p>
                          {inspection.negotiationPrice > 0 && (
                            <p className="text-sm text-orange-600 font-medium">
                              Offered: ₦{inspection.negotiationPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Inspection Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-[#5A5D63] mb-1">
                            <CalendarIcon size={14} />
                            <span>Date & Time</span>
                          </div>
                          <p className="text-sm font-medium text-[#09391C]">
                            {new Date(inspection.inspectionDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-[#5A5D63]">{inspection.inspectionTime}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-[#5A5D63] mb-1">
                            <TypeIcon size={14} />
                            <span>Type & Mode</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}>
                              {typeConfig.label}
                            </span>
                            <span className={`text-xs ${modeConfig.color}`}>
                              <ModeIcon size={12} className="inline mr-1" />
                              {modeConfig.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-[#5A5D63]">
                          <span>Stage: </span>
                          <span className="font-medium capitalize">{inspection.stage}</span>
                        </div>
                        {inspection.counterCount > 0 && (
                          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-orange-100 text-orange-700">
                            {inspection.counterCount} Counter{inspection.counterCount !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {/* Reason */}
                      {inspection.reason && (
                        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm text-[#5A5D63]">{inspection.reason}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleViewDetails(inspection)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#8DDB90] text-white rounded-lg hover:bg-[#7BC87F] transition-colors text-sm font-medium"
                        >
                          <EyeIcon size={16} />
                          View Details
                        </button>

                        {inspection.status === "new" && (
                          <button
                            onClick={() =>
                              router.push(
                                `/secure-seller-response/${inspection.owner}/${inspection.id}`
                              )
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            <MessageSquareIcon size={16} />
                            Respond
                          </button>
                        )}

                        {inspection.property && (
                          <button
                            onClick={() =>
                              router.push(`/property/buy/${inspection.property!.id}`)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#09391C] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            <HomeIcon size={16} />
                            View Property
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 mt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(currentPage * 10, totalCount)} of {totalCount} results
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon size={16} />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
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
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                    <ChevronRightIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedInspection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-slate-800">
                      Inspection Request Details
                    </h2>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <XIcon size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Property Information */}
                  {selectedInspection.property && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-3 text-lg">
                        Property Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <div>
                          <span className="font-medium text-slate-600">Title:</span>
                          <p className="mt-1">{selectedInspection.property.title}</p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-600">Price:</span>
                          <p className="mt-1 font-medium text-emerald-600">
                            ₦{selectedInspection.property.price.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-600">Status:</span>
                          <p className="mt-1 capitalize">{selectedInspection.property.status}</p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-600">Type:</span>
                          <p className="mt-1">{selectedInspection.property.briefType}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inspection Details */}
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3 text-lg">
                      Inspection Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 border border-slate-200 p-4 rounded-xl">
                      <div>
                        <span className="font-medium text-slate-600">Date:</span>
                        <p className="mt-1">
                          {new Date(selectedInspection.inspectionDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Time:</span>
                        <p className="mt-1">{selectedInspection.inspectionTime}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Mode:</span>
                        <p className="mt-1 capitalize">{selectedInspection.inspectionMode}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Type:</span>
                        <p className="mt-1">{selectedInspection.inspectionType}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Status:</span>
                        <p className="mt-1 capitalize">{selectedInspection.status}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Stage:</span>
                        <p className="mt-1 capitalize">{selectedInspection.stage}</p>
                      </div>
                    </div>
                  </div>

                  {/* Negotiation Information */}
                  {selectedInspection.isNegotiating && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-3 text-lg">
                        Negotiation Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-blue-50 border border-blue-200 p-4 rounded-xl">
                        {selectedInspection.negotiationPrice > 0 && (
                          <div>
                            <span className="font-medium text-blue-700">Offered Price:</span>
                            <p className="mt-1 font-medium text-blue-900">
                              ₦{selectedInspection.negotiationPrice.toLocaleString()}
                            </p>
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

                  {/* Reason/Notes */}
                  {selectedInspection.reason && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-3 text-lg">
                        Reason/Notes
                      </h3>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <p className="text-sm text-slate-700">{selectedInspection.reason}</p>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3 text-lg">Timeline</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 border border-slate-200 p-4 rounded-xl">
                      <div>
                        <span className="font-medium text-slate-600">Created:</span>
                        <p className="mt-1">
                          {new Date(selectedInspection.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Last Updated:</span>
                        <p className="mt-1">
                          {new Date(selectedInspection.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-6 py-2 text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200"
                    >
                      Close
                    </button>
                    {selectedInspection.status === "new" && (
                      <button
                        onClick={() => {
                          setShowDetailModal(false);
                          router.push(
                            `/secure-seller-response/${selectedInspection.owner}/${selectedInspection.id}`
                          );
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                      >
                        Respond to Request
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}
