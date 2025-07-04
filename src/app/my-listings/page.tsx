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
import { motion } from "framer-motion";
import { Plus, Home } from "lucide-react";
import Link from "next/link";
import MyListingSearch from "@/components/mylisting/my-listing-search";
import BriefCard from "@/components/mylisting/brief-card";
import EditBriefModal from "@/components/mylisting/edit-brief-modal";
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
  priceRange?: { min?: number; max?: number };
  documentType?: string[];
  bedroom?: number;
  bathroom?: number;
  landSizeType?: string;
  landSize?: number;
  desireFeature?: string[];
  homeCondition?: string;
  tenantCriteria?: string[];
  type?: string;
  briefType?: string;
  isPremium?: boolean;
  isPreference?: boolean;
  status?: "approved" | "pending" | "all";
}

const MyListingPage = () => {
  const { user } = useUserContext();
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [filteredBriefs, setFilteredBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const itemsPerPage = 12;

  useEffect(() => {
    fetchBriefs();
  }, [user, router]);

  const fetchBriefs = async (filters?: SearchFilters) => {
    if (filters) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        if (filters.location) queryParams.append("location", filters.location);
        if (filters.priceRange?.min)
          queryParams.append("priceMin", filters.priceRange.min.toString());
        if (filters.priceRange?.max)
          queryParams.append("priceMax", filters.priceRange.max.toString());
        if (filters.documentType?.length) {
          filters.documentType.forEach((doc) =>
            queryParams.append("documentType", doc),
          );
        }
        if (filters.bedroom)
          queryParams.append("bedroom", filters.bedroom.toString());
        if (filters.bathroom)
          queryParams.append("bathroom", filters.bathroom.toString());
        if (filters.landSizeType)
          queryParams.append("landSizeType", filters.landSizeType);
        if (filters.landSize)
          queryParams.append("landSize", filters.landSize.toString());
        if (filters.desireFeature?.length) {
          filters.desireFeature.forEach((feature) =>
            queryParams.append("desireFeature", feature),
          );
        }
        if (filters.homeCondition)
          queryParams.append("homeCondition", filters.homeCondition);
        if (filters.tenantCriteria?.length) {
          filters.tenantCriteria.forEach((criteria) =>
            queryParams.append("tenantCriteria", criteria),
          );
        }
        if (filters.type) queryParams.append("type", filters.type);
        if (filters.briefType)
          queryParams.append("briefType", filters.briefType);
        if (filters.isPremium !== undefined)
          queryParams.append("isPremium", filters.isPremium.toString());
        if (filters.isPreference !== undefined)
          queryParams.append("isPreference", filters.isPreference.toString());
        if (filters.status && filters.status !== "all")
          queryParams.append("status", filters.status);
      }

      const url = `${URLS.BASE}/user/briefs${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
      const response = await GET_REQUEST(url, Cookies.get("token"));

      if (response?.success && response?.data) {
        const briefsData = response.data;
        setBriefs(briefsData);
        setFilteredBriefs(briefsData);
        setTotalPages(Math.ceil(briefsData.length / itemsPerPage));
        setCurrentPage(1);

        if (filters) {
          toast.success("Search completed!");
        }
      } else {
        console.error("Error fetching briefs:", response);
        setBriefs([]);
        setFilteredBriefs([]);
        toast.error("Failed to fetch briefs");
      }
    } catch (err) {
      console.error("Error fetching briefs:", err);
      setBriefs([]);
      setFilteredBriefs([]);
      toast.error("Failed to fetch briefs");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    fetchBriefs(filters);
  };

  const handleEditBrief = (brief: Brief) => {
    setSelectedBrief(brief);
    setShowEditModal(true);
  };

  const handleDeleteBrief = (brief: Brief) => {
    setSelectedBrief(brief);
    setShowDeleteModal(true);
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

  const getCurrentPageBriefs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBriefs.slice(startIndex, endIndex);
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
    <div className="min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
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
            <h1 className="text-3xl font-bold text-[#09391C] font-display">
              My Property Briefs
            </h1>
            <p className="text-[#5A5D63] mt-2">
              Manage and view all your property briefs
            </p>
          </div>
          <Link
            href="/post_property"
            className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add New Property
          </Link>
        </div>

        {/* Search Component */}
        <div className="mb-8">
          <MyListingSearch onSearch={handleSearch} loading={searchLoading} />
        </div>

        {/* Properties Grid */}
        {briefs.length === 0 ? (
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="w-24 h-24 bg-[#8DDB90] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home size={40} className="text-[#8DDB90]" />
              </div>
              <h3 className="text-xl font-semibold text-[#09391C] mb-3">
                No Property Briefs Yet
              </h3>
              <p className="text-[#5A5D63] mb-6">
                Start building your property portfolio by creating your first
                brief
              </p>
              <Link
                href="/post_property"
                className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Create Your First Brief
              </Link>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-[#09391C] mb-1">
                  {briefs.length}
                </div>
                <div className="text-sm text-[#5A5D63]">Total Briefs</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stats.approved}
                </div>
                <div className="text-sm text-[#5A5D63]">Approved</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {stats.pending}
                </div>
                <div className="text-sm text-[#5A5D63]">Pending Review</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {stats.rejected}
                </div>
                <div className="text-sm text-[#5A5D63]">Rejected</div>
              </div>
            </div>

            {/* Briefs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getCurrentPageBriefs().map((brief, index) => (
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
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border rounded-lg ${
                          currentPage === page
                            ? "bg-[#8DDB90] text-white border-[#8DDB90]"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedBrief && (
          <EditBriefModal
            brief={selectedBrief}
            onClose={() => {
              setShowEditModal(false);
              setSelectedBrief(null);
            }}
            onSave={() => {
              setShowEditModal(false);
              setSelectedBrief(null);
              fetchBriefs(); // Refresh the list
              toast.success("Brief updated successfully!");
            }}
          />
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
              fetchBriefs(); // Refresh the list
              toast.success("Brief deleted successfully!");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MyListingPage;
