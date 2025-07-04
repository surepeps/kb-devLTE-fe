/** @format */
"use client";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/user-context";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import { GET_REQUEST, DELETE_REQUEST } from "@/utils/requests";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading-component/loading";
import PropertyCard from "@/components/general-components/property-card";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Plus, Home } from "lucide-react";
import Link from "next/link";

const MyListingPage = () => {
  const { user } = useUserContext();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // if (!user) {
    //   router.push("/auth/login");
    //   return;
    // }

    // // Allow both landlords and agents to access this page
    // if (user.userType !== "Landowners" && user.userType !== "Agent") {
    //   router.push("/");
    //   return;
    // }

    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await GET_REQUEST(
          URLS.BASE + URLS.getMyProperties,
          Cookies.get("token"),
        );
        console.log("Fetched properties:", response);

        // Add status labels to properties
        const propertiesWithStatus = (response?.data || response || []).map(
          (property: any) => ({
            ...property,
            statusLabel:
              property.isApproved === true
                ? "Approved"
                : property.isApproved === false
                  ? "Rejected"
                  : "Pending Review",
          }),
        );

        setProperties(propertiesWithStatus);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user, router]);

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await DELETE_REQUEST(
        `${URLS.BASE}/properties/${propertyId}`,
        Cookies.get("token"),
      );
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      toast.success("Property deleted successfully");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  const handleViewProperty = (propertyId: string) => {
    router.push(`/property/Buy/${propertyId}`);
  };

  const handleEditProperty = (propertyId: string) => {
    // Navigate to edit page or implement edit functionality
    toast.info("Edit functionality coming soon");
  };

  const handleShareProperty = (property: any) => {
    if (navigator.share) {
      navigator.share({
        title: `${property.propertyType} for ${property.briefType}`,
        text: `Check out this ${property.propertyType} in ${property.location.area}`,
        url: `${window.location.origin}/property/Buy/${property._id}`,
      });
    } else {
      // Fallback - copy to clipboard
      const url = `${window.location.origin}/property/Buy/${property._id}`;
      navigator.clipboard.writeText(url);
      toast.success("Property link copied to clipboard");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

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
              My Property Listings
            </h1>
            <p className="text-[#5A5D63] mt-2">
              Manage and view all your listed properties
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

        {/* Properties Grid */}
        {properties.length === 0 ? (
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
                No Properties Listed Yet
              </h3>
              <p className="text-[#5A5D63] mb-6">
                Start building your property portfolio by listing your first
                property
              </p>
              <Link
                href="/post_property"
                className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                List Your First Property
              </Link>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-[#09391C] mb-1">
                  {properties.length}
                </div>
                <div className="text-sm text-[#5A5D63]">Total Properties</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {
                    properties.filter((p) => p.statusLabel === "Approved")
                      .length
                  }
                </div>
                <div className="text-sm text-[#5A5D63]">Approved</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {
                    properties.filter((p) => p.statusLabel === "Pending Review")
                      .length
                  }
                </div>
                <div className="text-sm text-[#5A5D63]">Pending Review</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {
                    properties.filter((p) => p.statusLabel === "Rejected")
                      .length
                  }
                </div>
                <div className="text-sm text-[#5A5D63]">Rejected</div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  property={{
                    ...property,
                    status: property.status || "active",
                    statusLabel: property.statusLabel,
                    views:
                      property.views || Math.floor(Math.random() * 100) + 10,
                  }}
                  onView={() => handleViewProperty(property._id)}
                  onEdit={() => handleEditProperty(property._id)}
                  onDelete={() => handleDeleteProperty(property._id)}
                  onShare={() => handleShareProperty(property)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyListingPage;
