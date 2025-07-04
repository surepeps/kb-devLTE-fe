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
  Plus as PlusIcon,
  Home as HomeIcon,
  Eye as EyeIcon,
  BarChart3 as ChartBarIcon,
  DollarSign as CurrencyDollarIcon,
  Clock as ClockIcon,
  Users as UserGroupIcon,
} from "lucide-react";
import Loading from "@/components/loading-component/loading";

interface Property {
  _id: string;
  propertyType: string;
  price: number;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  images: string[];
  status: "active" | "pending" | "sold" | "rented";
  createdAt: string;
  views?: number;
}

interface Brief {
  _id: string;
  propertyType: string;
  price: number;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  createdAt: string;
  status: "active" | "assigned" | "completed";
}

interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  soldProperties: number;
  rentedProperties: number;
  totalViews: number;
  totalEarnings: number;
}

export default function LandlordDashboard() {
  const router = useRouter();
  const { user } = useUserContext();
  const [properties, setProperties] = useState<Property[]>([]);
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeListings: 0,
    soldProperties: 0,
    rentedProperties: 0,
    totalViews: 0,
    totalEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.userType !== "Landowners") {
      router.push("/");
      return;
    }

    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch user's properties - try multiple endpoints
      const endpoints = [
        `${URLS.BASE}${URLS.myPropertyListings}`,
        `${URLS.BASE}/properties/user/${user?._id}`,
        `${URLS.BASE}/properties/owner`,
        `${URLS.BASE}/briefs/user`,
      ];

      let userProperties = [];
      let fetchSuccessful = false;

      for (const endpoint of endpoints) {
        try {
          const propertiesResponse = await GET_REQUEST(
            endpoint,
            Cookies.get("token"),
          );

          if (propertiesResponse?.data || propertiesResponse) {
            userProperties = Array.isArray(propertiesResponse?.data)
              ? propertiesResponse.data
              : Array.isArray(propertiesResponse)
                ? propertiesResponse
                : [];
            fetchSuccessful = true;
            break;
          }
        } catch (error) {
          console.log(`Failed to fetch from ${endpoint}:`, error);
          continue;
        }
      }

      if (fetchSuccessful) {
        // Filter properties to only include ones belonging to the current user
        const filteredProperties = userProperties.filter(
          (property: any) =>
            property.owner?.email === user?.email ||
            property.ownerId === user?._id ||
            property.userId === user?._id,
        );

        setProperties(filteredProperties);

        // Calculate stats
        const totalProperties = filteredProperties.length;
        const activeListings = filteredProperties.filter(
          (p: any) => p.status === "active" || p.isApproved === true,
        ).length;
        const soldProperties = filteredProperties.filter(
          (p: any) => p.status === "sold",
        ).length;
        const rentedProperties = filteredProperties.filter(
          (p: any) => p.status === "rented",
        ).length;
        const pendingProperties = filteredProperties.filter(
          (p: any) => p.status === "pending" || p.isApproved === false,
        ).length;
        const totalViews = filteredProperties.reduce(
          (sum: number, p: any) => sum + (p.views || 0),
          0,
        );

        setStats({
          totalProperties,
          activeListings,
          soldProperties,
          rentedProperties,
          totalViews,
          totalEarnings: soldProperties * 50000, // Mock calculation
        });
      } else {
        // No properties found
        setProperties([]);
        setStats({
          totalProperties: 0,
          activeListings: 0,
          soldProperties: 0,
          rentedProperties: 0,
          totalViews: 0,
          totalEarnings: 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: HomeIcon,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Active Listings",
      value: stats.activeListings,
      icon: ChartBarIcon,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Properties Sold",
      value: stats.soldProperties,
      icon: CurrencyDollarIcon,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: EyeIcon,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EEF1F1] py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#09391C] font-display">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-[#5A5D63] mt-2">
              Manage your properties and track your real estate portfolio
            </p>
          </div>
          <Link
            href="/post_property"
            className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <PlusIcon size={20} />
            List New Property
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#5A5D63] mb-1">
                      {card.title}
                    </p>
                    <p className={`text-2xl font-bold ${card.textColor}`}>
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                    <IconComponent size={24} className={card.textColor} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#09391C]">
                Recent Properties
              </h2>
              <Link
                href="/my_listing"
                className="text-[#8DDB90] hover:text-[#7BC87F] font-medium"
              >
                View All
              </Link>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="p-12 text-center">
              <HomeIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No Properties Listed Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by listing your first property to manage your real estate
                portfolio
              </p>
              <Link
                href="/post_property"
                className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <PlusIcon size={20} />
                List Your First Property
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {properties.slice(0, 5).map((property, index) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {property.images?.[0] ? (
                          <img
                            src={property.images[0]}
                            alt={property.propertyType}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <HomeIcon size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#09391C] capitalize">
                          {property.propertyType}
                        </h3>
                        <p className="text-sm text-[#5A5D63]">
                          {property.location.area},{" "}
                          {property.location.localGovernment}
                        </p>
                        <p className="text-sm text-[#8DDB90] font-medium">
                          ₦{property.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          property.status === "active"
                            ? "bg-green-100 text-green-800"
                            : property.status === "sold"
                              ? "bg-blue-100 text-blue-800"
                              : property.status === "rented"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {property.status}
                      </span>
                      <p className="text-xs text-[#5A5D63] mt-1 flex items-center gap-1">
                        <ClockIcon size={12} />
                        {new Date(property.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#09391C] mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/post_property"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#8DDB90] bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors">
                  <PlusIcon size={24} className="text-[#8DDB90]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#09391C]">
                    List Property
                  </h3>
                  <p className="text-sm text-[#5A5D63]">
                    Add a new property to your portfolio
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/my_listing"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors">
                  <HomeIcon size={24} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#09391C]">
                    View Listings
                  </h3>
                  <p className="text-sm text-[#5A5D63]">
                    Manage your property listings
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/preference"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors">
                  <UserGroupIcon size={24} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#09391C]">Settings</h3>
                  <p className="text-sm text-[#5A5D63]">
                    Update your preferences
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
