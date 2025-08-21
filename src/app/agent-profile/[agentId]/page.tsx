/** @format */

"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, 
  Copy, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Building, 
  Calendar, 
  ExternalLink,
  User,
  Award,
  TrendingUp,
  CheckCircle,
  Eye,
  MessageCircle
} from 'lucide-react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

interface AgentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
  bio: string;
  location: string;
  specializations: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  propertiesSold: number;
  propertiesRented: number;
  joinDate: string;
  isVerified: boolean;
  languages: string[];
  services: string[];
  achievements: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  location: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
}

const AgentProfilePage = () => {
  const params = useParams();
  const agentId = params.agentId as string;
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const fetchAgentProfile = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock agent data
        setAgentProfile({
          id: agentId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@khabiteq.com',
          phoneNumber: '+234 803 123 4567',
          profileImage: '/placeholder-property.svg',
          bio: 'Experienced real estate agent with over 8 years in the Nigerian property market. Specializing in luxury homes, commercial properties, and investment opportunities across Lagos and Abuja.',
          location: 'Lagos, Nigeria',
          specializations: ['Luxury Homes', 'Commercial Properties', 'Investment Properties', 'First-time Buyers'],
          experience: 8,
          rating: 4.8,
          totalReviews: 127,
          propertiesSold: 89,
          propertiesRented: 156,
          joinDate: '2016-03-15',
          isVerified: true,
          languages: ['English', 'Yoruba', 'Igbo'],
          services: ['Property Consultation', 'Market Analysis', 'Property Management', 'Investment Advisory'],
          achievements: ['Top Agent 2023', 'Customer Choice Award', 'Million Dollar Club'],
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            website: 'https://johndoe-realestate.com'
          }
        });

        // Mock featured properties
        setFeaturedProperties([
          {
            id: '1',
            title: '4 Bedroom Duplex in Lekki',
            type: 'For Sale',
            price: 85000000,
            location: 'Lekki, Lagos',
            images: ['/placeholder-property.svg'],
            bedrooms: 4,
            bathrooms: 5,
            sqft: 3200
          },
          {
            id: '2',
            title: 'Modern Office Space',
            type: 'For Rent',
            price: 2500000,
            location: 'Victoria Island, Lagos',
            images: ['/placeholder-property.svg'],
            sqft: 1800
          }
        ]);

        setViewCount(1247);
      } catch (error) {
        console.error('Failed to fetch agent profile:', error);
        toast.error('Failed to load agent profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (agentId) {
      fetchAgentProfile();
    }
  }, [agentId]);

  const copyProfileLink = async () => {
    const profileUrl = `${window.location.origin}/agent-profile/${agentId}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareProfile = async () => {
    const profileUrl = `${window.location.origin}/agent-profile/${agentId}`;
    const shareData = {
      title: `${agentProfile?.firstName} ${agentProfile?.lastName} - Khabiteq Agent`,
      text: `Check out this verified real estate agent on Khabiteq`,
      url: profileUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        copyProfileLink();
      }
    } else {
      copyProfileLink();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EEF1F1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8DDB90] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  if (!agentProfile) {
    return (
      <div className="min-h-screen bg-[#EEF1F1] flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Agent Not Found</h1>
          <p className="text-gray-600 mb-6">The agent profile you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/agent-marketplace" 
            className="bg-[#8DDB90] text-white px-6 py-3 rounded-lg hover:bg-[#7BC87F] transition-colors">
            Browse Agents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF1F1]">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#09391C] to-[#0B423D] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Profile Image and Basic Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 border-4 border-white/20">
                  {agentProfile.profileImage ? (
                    <Image
                      src={agentProfile.profileImage}
                      alt={`${agentProfile.firstName} ${agentProfile.lastName}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-white/60" />
                    </div>
                  )}
                </div>
                {agentProfile.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-[#8DDB90] rounded-full p-2">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {agentProfile.firstName} {agentProfile.lastName}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{agentProfile.location}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{agentProfile.rating} ({agentProfile.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{viewCount} views</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-auto flex flex-col sm:flex-row gap-3">
              <button
                onClick={shareProfile}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                <Share2 className="w-5 h-5" />
                Share Profile
              </button>
              <button
                onClick={copyProfileLink}
                className="flex items-center gap-2 px-6 py-3 bg-[#8DDB90] rounded-lg hover:bg-[#7BC87F] transition-colors">
                <Copy className="w-5 h-5" />
                Copy Link
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-[#09391C] mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{agentProfile.bio}</p>
              
              {/* Specializations */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#09391C] mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {agentProfile.specializations.map((spec, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-[#8DDB90]/10 text-[#09391C] rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="font-semibold text-[#09391C] mb-3">Services Offered</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {agentProfile.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8DDB90]" />
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Featured Properties */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#09391C]">Featured Properties</h2>
                <Link 
                  href={`/agent-listings/${agentId}`}
                  className="text-[#8DDB90] hover:text-[#7BC87F] font-medium flex items-center gap-1">
                  View All
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredProperties.map((property) => (
                  <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-200 relative">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-[#8DDB90] text-white px-2 py-1 rounded text-sm">
                        {property.type}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#09391C] mb-2">{property.title}</h3>
                      <p className="text-2xl font-bold text-[#8DDB90] mb-2">
                        {formatCurrency(property.price)}
                        {property.type === 'For Rent' && '/year'}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </div>
                      {(property.bedrooms || property.bathrooms || property.sqft) && (
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {property.bedrooms && <span>{property.bedrooms} beds</span>}
                          {property.bathrooms && <span>{property.bathrooms} baths</span>}
                          {property.sqft && <span>{property.sqft} sqft</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#09391C] mb-4">Performance Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#8DDB90]" />
                    <span className="text-gray-700">Properties Sold</span>
                  </div>
                  <span className="font-bold text-[#09391C]">{agentProfile.propertiesSold}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#8DDB90]" />
                    <span className="text-gray-700">Properties Rented</span>
                  </div>
                  <span className="font-bold text-[#09391C]">{agentProfile.propertiesRented}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#8DDB90]" />
                    <span className="text-gray-700">Years Experience</span>
                  </div>
                  <span className="font-bold text-[#09391C]">{agentProfile.experience}</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#09391C] mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#8DDB90]" />
                  <a 
                    href={`tel:${agentProfile.phoneNumber}`}
                    className="text-gray-700 hover:text-[#8DDB90] transition-colors">
                    {agentProfile.phoneNumber}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#8DDB90]" />
                  <a 
                    href={`mailto:${agentProfile.email}`}
                    className="text-gray-700 hover:text-[#8DDB90] transition-colors">
                    {agentProfile.email}
                  </a>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-[#8DDB90] text-white py-3 rounded-lg hover:bg-[#7BC87F] transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Send Message
              </button>
            </motion.div>

            {/* Languages Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#09391C] mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {agentProfile.languages.map((language, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {language}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Achievements Card */}
            {agentProfile.achievements.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-[#09391C] mb-4">Achievements</h3>
                <div className="space-y-3">
                  {agentProfile.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-[#FFB800]" />
                      <span className="text-gray-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfilePage;
