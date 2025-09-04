/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Share2,
  CheckCircle,
  Award,
  Calendar,
  DollarSign,
  MessageCircle,
  ExternalLink,
  Copy,
  Building,
  Users,
  TrendingUp,
  Heart,
  Eye,
  Filter,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { PublicAgentProfile } from "@/types/agent-upgrade.types";
import AgentVerificationService from "@/services/agentVerificationService";
import { useUserContext } from "@/context/user-context";

interface AgentProfilePageProps {
  params: {
    agentId: string;
  };
}

// Mock data - in real implementation, this would come from the API
const mockAgentProfile: PublicAgentProfile = {
  agentId: "agent-123",
  firstName: "John",
  lastName: "Doe",
  displayName: "John Doe",
  profilePicture: "",
  bio: "I am a dedicated real estate professional with over 5 years of experience in helping clients find their dream homes. I specialize in residential properties and luxury estates, providing personalized service and expert market knowledge to ensure the best outcomes for my clients.",
  specializations: ["luxury_properties", "residential_sales", "investment_properties"],
  languagesSpoken: ["English", "Yoruba", "Hausa"],
  servicesOffered: ["property_consultation", "market_analysis", "investment_advisory", "financing_assistance"],
  inspectionFee: {
    inspectionFee: 15000,
    currency: "NGN",
    description: "Comprehensive property inspection including detailed report and photos",
    terms: "Fee is refundable if you purchase the property through me"
  },
  phoneNumber: "+234 801 234 5678",
  email: "john.doe@email.com",
  location: {
    state: "Lagos",
    localGovtArea: "Victoria Island"
  },
  agentLicenseNumber: "REA/2023/001234",
  businessRegistration: {
    companyName: "JD Properties Ltd",
    cacNumber: "RC123456"
  },
  metrics: {
    totalListings: 45,
    activeListing: 12,
    completedDeals: 33,
    yearsOfExperience: 5,
    rating: 4.8,
    reviewCount: 28
  },
  featuredListings: [
    {
      propertyId: "prop-1",
      title: "3 Bedroom Apartment in Victoria Island",
      price: 85000000,
      location: "Victoria Island, Lagos",
      imageUrl: "/placeholder-property.svg",
      propertyType: "Apartment"
    },
    {
      propertyId: "prop-2", 
      title: "4 Bedroom Duplex in Lekki",
      price: 120000000,
      location: "Lekki, Lagos",
      imageUrl: "/placeholder-property.svg",
      propertyType: "Duplex"
    },
    {
      propertyId: "prop-3",
      title: "2 Bedroom Flat in Ikeja",
      price: 45000000,
      location: "Ikeja, Lagos",
      imageUrl: "/placeholder-property.svg",
      propertyType: "Apartment"
    }
  ],
  achievements: [
    {
      title: "Top Sales Agent 2023",
      description: "Achieved highest sales volume in Q3 2023",
      dateReceived: "2023-10-15"
    },
    {
      title: "Customer Excellence Award",
      description: "Recognized for outstanding customer service",
      dateReceived: "2023-07-20"
    }
  ],
  socialLinks: {
    whatsapp: "+2348012345678",
    linkedin: "johndoe-realestate",
    facebook: "johndoeproperties"
  },
  verifiedAt: "2023-12-01T10:00:00Z",
  lastActive: "2024-01-15T14:30:00Z",
  joinedAt: "2022-01-10T09:00:00Z"
};

const AgentProfilePage: React.FC<AgentProfilePageProps> = ({ params }) => {
  const { agentId } = useParams() as { agentId: string };
  const router = useRouter();
  const { user } = useUserContext();
  const [agentProfile, setAgentProfile] = useState<PublicAgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showContactModal, setShowContactModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAgentProfile();
  }, [agentId]);

  const fetchAgentProfile = async () => {
    try {
      setLoading(true);
      // For now, use mock data. In real implementation:
      // const profile = await AgentVerificationService.getAgentPublicProfile(agentId);
      // setAgentProfile(profile);
      
      // Simulate API delay
      setTimeout(() => {
        setAgentProfile(mockAgentProfile);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch agent profile:", error);
      toast.error("Failed to load agent profile");
      setLoading(false);
    }
  };

  const handleShareProfile = async () => {
    if (!agentProfile) return;

    const shareLinks = AgentVerificationService.generateShareableLinks(
      agentProfile.agentId,
      agentProfile.displayName
    );

    // Try to use Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${agentProfile.displayName} - Verified Real Estate Agent`,
          text: `Check out ${agentProfile.displayName}'s verified agent profile on Khabiteq Realty`,
          url: shareLinks.profileUrl,
        });
        return;
      } catch (error) {
        // Fallback to copy link
      }
    }

    // Fallback: Copy link to clipboard
    try {
      await navigator.clipboard.writeText(shareLinks.profileUrl);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleContactAgent = () => {
    if (!agentProfile) return;
    
    const message = `Hi ${agentProfile.firstName}, I found your profile on Khabiteq Realty and I'm interested in your real estate services. Can we discuss my requirements?`;
    const whatsappUrl = `https://wa.me/${agentProfile.phoneNumber.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleBookInspection = () => {
    if (!user) {
      toast.error("Please login to book an inspection");
      router.push("/auth/login");
      return;
    }
    
    // In real implementation, this would open a booking modal or redirect to booking page
    toast.success("Inspection booking feature coming soon!");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8DDB90] mx-auto mb-4"></div>
          <p className="text-[#5A5D63]">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  if (!agentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Not Found</h1>
          <p className="text-gray-600 mb-4">The agent profile you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#8DDB90] text-white px-6 py-2 rounded-lg hover:bg-[#7BC87F] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#09391C] to-[#8DDB90] text-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-center lg:items-start gap-8"
          >
            {/* Profile Picture & Basic Info */}
            <div className="text-center lg:text-left">
              <div className="relative mb-6">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto lg:mx-0 overflow-hidden border-4 border-white/20">
                  {agentProfile.profilePicture ? (
                    <img
                      src={agentProfile.profilePicture}
                      alt={agentProfile.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl lg:text-5xl font-bold text-white">
                      {agentProfile.firstName[0]}{agentProfile.lastName[0]}
                    </div>
                  )}
                </div>
                
                {/* Verified Badge */}
                <div className="absolute -bottom-2 -right-2 bg-[#8DDB90] text-white p-2 rounded-full border-4 border-white">
                  <CheckCircle size={24} />
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-2 font-display">
                {agentProfile.displayName}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <CheckCircle size={20} className="text-[#8DDB90]" />
                <span className="text-xl">Verified Real Estate Agent</span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-4 text-white/80 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{agentProfile.location.localGovtArea}, {agentProfile.location.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400" />
                  <span>{agentProfile.metrics.rating} ({agentProfile.metrics.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleContactAgent}
                  className="flex items-center justify-center gap-2 bg-white text-[#09391C] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle size={20} />
                  Contact Agent
                </button>
                
                <button
                  onClick={handleBookInspection}
                  className="flex items-center justify-center gap-2 bg-[#8DDB90] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7BC87F] transition-colors border border-white/20"
                >
                  <Calendar size={20} />
                  Book Inspection
                </button>
                
                <button
                  onClick={handleShareProfile}
                  className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
                >
                  {copied ? <CheckCircle size={20} /> : <Share2 size={20} />}
                  {copied ? "Copied!" : "Share"}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 lg:ml-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold mb-1">{agentProfile.metrics.activeListing}</div>
                  <div className="text-sm text-white/80">Active Listings</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold mb-1">{agentProfile.metrics.completedDeals}</div>
                  <div className="text-sm text-white/80">Deals Closed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold mb-1">{agentProfile.metrics.yearsOfExperience}</div>
                  <div className="text-sm text-white/80">Years Experience</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold mb-1">{formatCurrency(agentProfile.inspectionFee.inspectionFee)}</div>
                  <div className="text-sm text-white/80">Inspection Fee</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "listings", label: "Listings", icon: Building },
                { id: "reviews", label: "Reviews", icon: Star },
                { id: "contact", label: "Contact", icon: Phone },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#8DDB90] text-[#8DDB90]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#09391C] mb-4 flex items-center gap-2">
                    <User size={20} />
                    About {agentProfile.firstName}
                  </h3>
                  <p className="text-[#5A5D63] leading-relaxed">{agentProfile.bio}</p>
                </div>

                {/* Specializations */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#09391C] mb-4 flex items-center gap-2">
                    <Award size={20} />
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {agentProfile.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="bg-[#8DDB90]/10 text-[#8DDB90] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {spec.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Services Offered */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#09391C] mb-4 flex items-center gap-2">
                    <Building size={20} />
                    Services Offered
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {agentProfile.servicesOffered.map((service) => (
                      <div key={service} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-[#8DDB90] flex-shrink-0" />
                        <span className="text-[#5A5D63]">
                          {service.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                {agentProfile.achievements.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-[#09391C] mb-4 flex items-center gap-2">
                      <Trophy size={20} />
                      Achievements & Awards
                    </h3>
                    <div className="space-y-4">
                      {agentProfile.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <Award className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                          <div>
                            <h4 className="font-semibold text-[#09391C] mb-1">{achievement.title}</h4>
                            <p className="text-[#5A5D63] text-sm mb-2">{achievement.description}</p>
                            {achievement.dateReceived && (
                              <p className="text-xs text-gray-500">
                                Received: {formatDate(achievement.dateReceived)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#09391C] mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-[#8DDB90]" />
                      <span className="text-[#5A5D63]">{agentProfile.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-[#8DDB90]" />
                      <span className="text-[#5A5D63]">{agentProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-[#8DDB90]" />
                      <span className="text-[#5A5D63]">
                        {agentProfile.location.localGovtArea}, {agentProfile.location.state}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inspection Fee Details */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#09391C] mb-4 flex items-center gap-2">
                    <DollarSign size={20} />
                    Inspection Service
                  </h3>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-[#8DDB90]/10 rounded-lg">
                      <div className="text-2xl font-bold text-[#8DDB90] mb-1">
                        {formatCurrency(agentProfile.inspectionFee.inspectionFee)}
                      </div>
                      <div className="text-sm text-[#5A5D63]">Inspection Fee</div>
                    </div>
                    {agentProfile.inspectionFee.description && (
                      <p className="text-sm text-[#5A5D63]">{agentProfile.inspectionFee.description}</p>
                    )}
                    {agentProfile.inspectionFee.terms && (
                      <p className="text-xs text-gray-500 italic">{agentProfile.inspectionFee.terms}</p>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#09391C] mb-4 flex items-center gap-2">
                    <Globe size={20} />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {agentProfile.languagesSpoken.map((language) => (
                      <span
                        key={language}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Professional Details */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#09391C] mb-4">Professional Details</h3>
                  <div className="space-y-3 text-sm">
                    {agentProfile.agentLicenseNumber && (
                      <div>
                        <span className="font-medium text-[#09391C]">License:</span>
                        <span className="text-[#5A5D63] ml-2">{agentProfile.agentLicenseNumber}</span>
                      </div>
                    )}
                    {agentProfile.businessRegistration?.companyName && (
                      <div>
                        <span className="font-medium text-[#09391C]">Company:</span>
                        <span className="text-[#5A5D63] ml-2">{agentProfile.businessRegistration.companyName}</span>
                      </div>
                    )}
                    {agentProfile.businessRegistration?.cacNumber && (
                      <div>
                        <span className="font-medium text-[#09391C]">CAC Number:</span>
                        <span className="text-[#5A5D63] ml-2">{agentProfile.businessRegistration.cacNumber}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-[#09391C]">Member Since:</span>
                      <span className="text-[#5A5D63] ml-2">{formatDate(agentProfile.joinedAt)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-[#09391C]">Verified:</span>
                      <span className="text-[#5A5D63] ml-2">{formatDate(agentProfile.verifiedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "listings" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#09391C]">Featured Listings</h2>
                <span className="text-[#5A5D63]">{agentProfile.featuredListings.length} properties</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agentProfile.featuredListings.map((listing) => (
                  <div key={listing.propertyId} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-medium text-[#09391C]">
                        {listing.propertyType}
                      </div>
                      <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-colors">
                        <Heart size={16} className="text-gray-600" />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-[#09391C] mb-2 line-clamp-2">{listing.title}</h3>
                      <div className="flex items-center gap-1 text-[#5A5D63] text-sm mb-3">
                        <MapPin size={14} />
                        <span>{listing.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-[#8DDB90]">
                          {formatCurrency(listing.price)}
                        </span>
                        <button className="text-[#8DDB90] hover:text-[#7BC87F] transition-colors">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {agentProfile.metrics.totalListings > agentProfile.featuredListings.length && (
                <div className="text-center mt-8">
                  <button className="bg-[#8DDB90] text-white px-6 py-3 rounded-lg hover:bg-[#7BC87F] transition-colors font-medium">
                    View All {agentProfile.metrics.totalListings} Listings
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#09391C]">Reviews & Ratings</h2>
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-yellow-400" />
                  <span className="text-xl font-semibold">{agentProfile.metrics.rating}</span>
                  <span className="text-[#5A5D63]">({agentProfile.metrics.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="text-center py-12">
                  <Star size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reviews Coming Soon</h3>
                  <p className="text-gray-600">Client reviews and ratings will be displayed here.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-[#09391C] mb-6">Get in Touch</h2>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#8DDB90]/10 rounded-lg flex items-center justify-center">
                        <Phone size={20} className="text-[#8DDB90]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#09391C]">Phone</div>
                        <div className="text-[#5A5D63]">{agentProfile.phoneNumber}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#8DDB90]/10 rounded-lg flex items-center justify-center">
                        <Mail size={20} className="text-[#8DDB90]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#09391C]">Email</div>
                        <div className="text-[#5A5D63]">{agentProfile.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#8DDB90]/10 rounded-lg flex items-center justify-center">
                        <MapPin size={20} className="text-[#8DDB90]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#09391C]">Location</div>
                        <div className="text-[#5A5D63]">
                          {agentProfile.location.localGovtArea}, {agentProfile.location.state}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleContactAgent}
                      className="w-full bg-[#8DDB90] text-white py-3 px-4 rounded-lg hover:bg-[#7BC87F] transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={20} />
                      Contact via WhatsApp
                    </button>
                    
                    <button
                      onClick={handleBookInspection}
                      className="w-full bg-white border border-[#8DDB90] text-[#8DDB90] py-3 px-4 rounded-lg hover:bg-[#8DDB90]/5 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Calendar size={20} />
                      Book Inspection
                    </button>
                    
                    <div className="text-center text-sm text-[#5A5D63]">
                      Response time: Usually within 2 hours
                    </div>
                  </div>
                </div>
                
                {/* Contact Form Placeholder */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-[#09391C] mb-4">Send a Message</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Subject"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent"
                    />
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DDB90] focus:border-transparent resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => toast.success("Message sending feature coming soon!")}
                      className="bg-[#8DDB90] text-white py-3 px-6 rounded-lg hover:bg-[#7BC87F] transition-colors font-medium"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AgentProfilePage;
