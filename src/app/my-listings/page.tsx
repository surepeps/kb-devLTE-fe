/** @format */
"use client";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/user-context";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import { GET_REQUEST } from "@/utils/requests";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading-component/loading";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import Link from "next/link";
import SimplifiedMyListingFilters from "@/components/mylisting/filters/SimplifiedMyListingFilters";
import BriefCard from "@/components/mylisting/brief-card";
import Pagination from "@/components/mylisting/Pagination";
import NoBriefsPlaceholder from "@/components/mylisting/NoBriefsPlaceholder";
import DeleteConfirmationModal from "@/components/mylisting/delete-confirmation-modal";

interface Brief {
  _id: string;
  propertyType: string;
  propertyCondition: string;
  briefType: string;
  price: number;
  features: string[];
  tenantCriteria: string[];
  owner: string;
  areYouTheOwner: boolean;
  isAvailable: string;
  pictures: string[];
  isApproved: boolean;
  isRejected: boolean;
  docOnProperty: Array<{
    docName: string;
    isProvided: boolean;
    _id: string;
  }>;
  isPreference: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
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
    additionalFeatures: string[];
    noOfBedroom?: string;
    noOfBathroom?: string;
    noOfToilet?: string;
    noOfCarPark?: string;
  };
}

interface SearchFilters {
  location?: string;
  type?: string[];
  briefType?: string[];
  status?: "approved" | "pending" | "rejected" | "all";
}

const MyListingPage = () => {
  const { user } = useUserContext();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [filteredBriefs, setFilteredBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBriefs, setTotalBriefs] = useState(0);
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const router = useRouter();

  const itemsPerPage = 12;
  const [serverFilters, setServerFilters] = useState<SearchFilters>({});

  useEffect(() => {
    fetchBriefs();
  }, [user, router]);

  const fetchBriefs = async (filters?: SearchFilters, page: number = 1) => {
    if (filters) {
      setSearchLoading(true);
      setServerFilters(filters);
    } else {
      setLoading(true);
    }

    try {
      const queryParams = new URLSearchParams();
      let filtersApplied = false;

      // Add pagination
      queryParams.append("page", page.toString());
      queryParams.append("limit", itemsPerPage.toString());

      const activeFilters = filters || serverFilters;
      if (activeFilters) {
        if (activeFilters.location?.trim()) {
          queryParams.append("location", activeFilters.location.trim());
          filtersApplied = true;
        }
        if (activeFilters.type?.length) {
          queryParams.append("type", activeFilters.type.join(","));
          filtersApplied = true;
        }
        if (activeFilters.briefType?.length) {
          queryParams.append("briefType", activeFilters.briefType.join(","));
          filtersApplied = true;
        }
        if (activeFilters.status && activeFilters.status !== "all") {
          queryParams.append("status", activeFilters.status);
          filtersApplied = true;
        }
      }

      setHasActiveFilters(filtersApplied);

      const url = `${URLS.BASE}/user/briefs?${queryParams.toString()}`;
      const response = await GET_REQUEST(url, Cookies.get("token"));

      if (response?.success) {
        const briefsData = response.data?.briefs || response.data || [];
        const pagination = response.data?.pagination;

        setBriefs(briefsData);
        setFilteredBriefs(briefsData);
        setTotalBriefs(pagination?.total || briefsData.length);
        setTotalPages(
          pagination?.totalPages || Math.ceil(briefsData.length / itemsPerPage),
        );

        if (filters) {
          setCurrentPage(1);
        } else {
          setCurrentPage(page);
        }

        if (filters && filtersApplied) {
          toast.success(
            `Found ${pagination?.total || briefsData.length} brief${(pagination?.total || briefsData.length) !== 1 ? "s" : ""}`,
          );
        }
      } else {
        console.error("Error fetching briefs:", response);
        setBriefs([]);
        setFilteredBriefs([]);
        setTotalPages(1);
        setTotalBriefs(0);
        if (filters && filtersApplied) {
          toast.error("No briefs found matching your criteria");
        } else {
          toast.error("Failed to fetch briefs");
        }
      }
    } catch (err) {
      console.error("Error fetching briefs:", err);
      setBriefs([]);
      setFilteredBriefs([]);
      setTotalPages(1);
      setTotalBriefs(0);
      toast.error("Failed to fetch briefs");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    fetchBriefs(filters, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBriefs(undefined, page);
  };

  const handleClearFilters = () => {
    setHasActiveFilters(false);
    fetchBriefs({});
  };

  const handleDeleteBrief = (brief: Brief) => {
    setSelectedBrief(brief);
    setShowDeleteModal(true);
  };

  const handleEditBrief = (brief: Brief) => {
    router.push(`/my-listings/edit/${brief._id}`);
  };

  const handleViewBrief = (brief: Brief) => {
    const briefType =
      brief.briefType === "Outright Sales"
        ? "Buy"
        : brief.briefType === "Rent"
          ? "Rent"
          : "JV";
    router.push(`/property/${briefType}/${brief._id}`);
  };

  const handleShareBrief = (brief: Brief) => {
    const briefType =
      brief.briefType === "Outright Sales"
        ? "Buy"
        : brief.briefType === "Rent"
          ? "Rent"
          : "JV";
    const url = `${window.location.origin}/property/${briefType}/${brief._id}`;

    if (navigator.share) {
      navigator.share({
        title: `${brief.propertyType} for ${brief.briefType}`,
        text: `Check out this ${brief.propertyType} in ${brief.location.area}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Property link copied to clipboard");
    }
  };

  // Remove client-side pagination since we're using server-side
  const getCurrentPageBriefs = () => {
    return filteredBriefs;
  };

  const getApprovalStats = () => {
    const approved = briefs.filter((b) => b.isApproved && !b.isRejected).length;
    const rejected = briefs.filter((b) => b.isRejected).length;
    const pending = briefs.filter((b) => !b.isApproved && !b.isRejected).length;

    return { approved, rejected, pending };
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const stats = getApprovalStats();

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex-1">
            <nav className="text-sm text-[#5A5D63] mb-4">
              <button
                onClick={() => router.push("/")}
                className="hover:text-[#09391C]"
              >
                Home
              </button>
              <span className="mx-2">›</span>
              <span className="text-[#09391C] font-medium">My Listings</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#09391C] font-display">
              My Property Briefs
            </h1>
            <p className="text-[#5A5D63] mt-2 text-sm sm:text-base">
              Manage and view all your property briefs
            </p>
          </div>
          <Link
            href="/post_property"
            className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Add New Property</span>
            <span className="sm:hidden">Add Property</span>
          </Link>
        </div>

        {/* Filter Component */}
        <div className="mb-8">
          <SimplifiedMyListingFilters
            onSearch={handleSearch}
            loading={searchLoading}
          />
        </div>

        {/* Content */}
        {filteredBriefs.length === 0 ? (
          <NoBriefsPlaceholder
            isFiltered={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="text-xl sm:text-2xl font-bold text-[#09391C] mb-1">
                  {totalBriefs}
                </div>
                <div className="text-xs sm:text-sm text-[#5A5D63]">
                  {hasActiveFilters ? "Filtered" : "Total"} Briefs
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1">
                  {stats.approved}
                </div>
                <div className="text-xs sm:text-sm text-[#5A5D63]">
                  Approved
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="text-xl sm:text-2xl font-bold text-amber-600 mb-1">
                  {stats.pending}
                </div>
                <div className="text-xs sm:text-sm text-[#5A5D63]">
                  Under Review
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="text-xl sm:text-2xl font-bold text-red-600 mb-1">
                  {stats.rejected}
                </div>
                <div className="text-xs sm:text-sm text-[#5A5D63]">
                  Rejected
                </div>
              </div>
            </div>

            {/* Results Info */}
            {hasActiveFilters && (
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-blue-700 font-medium">
                      Showing {filteredBriefs.length} of {totalBriefs} result
                      {totalBriefs !== 1 ? "s" : ""} (Page {currentPage} of{" "}
                      {totalPages})
                    </span>
                  </div>
                  <button
                    onClick={handleClearFilters}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium underline self-start sm:self-auto"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            )}

            {/* Briefs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {getCurrentPageBriefs().map((brief) => (
                <BriefCard
                  key={brief._id}
                  brief={brief}
                  onView={() => handleViewBrief(brief)}
                  onEdit={() => handleEditBrief(brief)}
                  onDelete={() => handleDeleteBrief(brief)}
                  onShare={() => handleShareBrief(brief)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  disabled={searchLoading}
                />
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedBrief && (
          <DeleteConfirmationModal
            brief={selectedBrief}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedBrief(null);
            }}
            onConfirm={() => {
              setShowDeleteModal(false);
              setSelectedBrief(null);
              fetchBriefs();
              toast.success("Brief deleted successfully!");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MyListingPage;
