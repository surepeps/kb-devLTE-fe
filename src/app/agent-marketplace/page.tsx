"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMagnifyingGlass, faArrowLeft, faMapMarkerAlt, faFileAlt, faBed, faTag } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/user-context';
import { GET_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';
import toast from 'react-hot-toast';
import Loading from '@/components/loading-component/loading';
import Cookies from 'js-cookie';

interface Buyer {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  id: string;
}

interface Location {
  state: string;
  localGovernmentAreas?: string[];
  lgasWithAreas?: Array<{
    lgaName: string;
    areas: string[];
    _id: string;
    id: string;
  }>;
}

interface Budget {
  minPrice: number;
  maxPrice: number;
  currency: string;
}

interface ContactInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  partiesAllowed?: boolean;
  willingToPayExtra?: boolean;
}

interface PropertyDetails {
  purpose?: string;
  propertyType?: string;
  buildingType?: string;
  minBedrooms?: string;
  minBathrooms?: number;
  propertyCondition?: string;
  landSize?: string;
  measurementUnit?: string;
  documentTypes?: string[];
}

interface BookingDetails {
  propertyType?: string;
  minBedrooms?: string;
  minBathrooms?: number;
  numberOfGuests?: number;
  checkInDate?: string;
  checkOutDate?: string;
  travelType?: string;
  preferredCheckInTime?: string;
  preferredCheckOutTime?: string;
}

interface Features {
  baseFeatures?: string[];
  premiumFeatures?: string[];
  autoAdjustToFeatures?: boolean;
}

interface Preference {
  preferenceId: string;
  buyer: Buyer;
  status: string;
  preferenceType: string;
  preferenceMode: string;
  location: Location;
  budget: Budget;
  features?: Features;
  contactInfo: ContactInfo;
  propertyDetails?: PropertyDetails;
  bookingDetails?: BookingDetails;
  nearbyLandmark?: string;
  additionalNotes?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Preference[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

const AgentMarketplace = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [preferenceMode, setPreferenceMode] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [propertyCondition, setPropertyCondition] = useState('');
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const limit = 12; // Items per page

  // Fetch approved preferences from API
  useEffect(() => {
    const fetchApprovedPreferences = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Check if URLS.BASE is available
        if (!URLS.BASE || URLS.BASE.includes('undefined') || URLS.BASE === 'undefined') {
          console.error('NEXT_PUBLIC_API_URL environment variable is not set');
          throw new Error('API base URL is not configured properly. Please check environment configuration.');
        }

        // Build query params from filters
        const params = new URLSearchParams();
        params.append('page', String(currentPage));
        params.append('limit', String(limit));
        if (searchTerm) params.append('search', searchTerm);
        if (preferenceMode) params.append('preferenceMode', preferenceMode);
        if (documentType) params.append('documentType', documentType);
        if (propertyCondition) params.append('propertyCondition', propertyCondition);

        const url = `${URLS.BASE}/preferences/getApprovedForAgent?${params.toString()}`;
        console.log('Fetching from URL:', url);

        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await GET_REQUEST<ApiResponse>(url, token);

        if (response?.success && response?.data && Array.isArray(response.data)) {
          setPreferences(response.data);
          
          // Set pagination info from backend response
          if (response.pagination) {
            setTotalPages(response.pagination.pages || 1);
            setTotalItems(response.pagination.total || response.data.length);
          } else {
            setTotalPages(1);
            setTotalItems(response.data.length);
          }
        } else {
          console.log('No data received from API or unexpected format');
          console.log('Response structure:', response);
          setError('No buyer preferences found');
          setPreferences([]);
          setTotalPages(0);
          setTotalItems(0);
        }
      } catch (error) {
        console.error('Error fetching buyer preferences:', error);

        // Provide more specific error messages
        let errorMessage = 'Failed to load buyer preferences';
        if (error instanceof Error) {
          if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error: Unable to connect to server. Please check your internet connection.';
          } else if (error.message.includes('Authentication')) {
            errorMessage = 'Authentication error: Please log in again.';
          } else if (error.message.includes('API base URL')) {
            errorMessage = 'Configuration error: API endpoint not available.';
          } else {
            errorMessage = `Error: ${error.message}`;
          }
        }

        setError(errorMessage);
        setPreferences([]);
        setTotalPages(0);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
        setIsPaginationLoading(false);
      }
    };

    // Only fetch if we have the basic requirements
    if (typeof window !== 'undefined') {
      fetchApprovedPreferences();
      if (!hasInitialized) {
        setHasInitialized(true);
      }
    }
  }, [currentPage, searchTerm, documentType, propertyCondition, preferenceMode, hasInitialized]);

  const handleSearch = () => {
    setCurrentPage(1);
    console.log('Search triggered with filters:', {
      searchTerm,
      documentType,
      propertyCondition,
      preferenceMode
    });
  };

  const handleIHaveIt = (preferenceId: string) => {
    if (!user) {
      // Store the intended destination for redirect after login
      sessionStorage.setItem('redirectAfterLogin', `/post-property-by-preference?preferenceId=${preferenceId}`);
      router.push('/auth/login');
    } else {
      router.push(`/post-property-by-preference?preferenceId=${preferenceId}`);
    }
  };

  const formatPrice = (price: number, currency: string = 'NGN') => {
    return `${currency === 'NGN' ? '₦' : currency}${price.toLocaleString('en-US')}`;
  };

  const formatLocation = (location: Location) => {
    if (!location) return 'N/A';

    let locationStr = location.state || '';

    if (location.lgasWithAreas && location.lgasWithAreas.length > 0) {
      const lgas = location.lgasWithAreas.map(lga => lga.lgaName).join(', ');
      locationStr += lgas ? `, ${lgas}` : '';
    } else if (location.localGovernmentAreas && location.localGovernmentAreas.length > 0) {
      locationStr += `, ${location.localGovernmentAreas.join(', ')}`;
    }

    return locationStr.replace(/^,\s*/, '') || 'N/A';
  };

  // Get matched properties with fallback data
  const getMatchedProperties = () => {
    // First try to get recently matched preferences from current data
    const recentMatches = preferences.slice(0, 4).map((pref, index) => ({
      id: pref.preferenceId || `recent-${index}`,
      type: pref.preferenceType === 'buy' ? 'Buy' :
            pref.preferenceType === 'rent' ? 'Rent' :
            pref.preferenceType === 'shortlet' ? 'Shortlet' :
            pref.preferenceType,
      location: formatLocation(pref.location),
      status: 'Active'
    }));

    if (recentMatches.length > 0) {
      return recentMatches;
    }

    // Fallback data if no API data is available
    return [
      {
        id: 'match1',
        type: 'Buy',
        location: 'Lagos, Ikeja',
        status: 'Active'
      },
      {
        id: 'match2',
        type: 'Rent',
        location: 'Abuja, Wuse',
        status: 'Active'
      },
      {
        id: 'match3',
        type: 'Shortlet',
        location: 'Lagos, Victoria Island',
        status: 'Active'
      },
      {
        id: 'match4',
        type: 'Buy',
        location: 'Port Harcourt, GRA',
        status: 'Active'
      }
    ];
  };

  const PreferenceCard = ({ preference }: { preference: Preference }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Property Details Table */}
      <div className="bg-[#F7F7F9] flex-1">
        <table className="w-full border-collapse h-full">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-500 text-sm font-normal w-1/2">Type</td>
              <td className="py-3 px-4 text-black text-sm font-bold text-right">
                {preference.preferenceType === 'buy' ? 'Buy' : 
                 preference.preferenceType === 'rent' ? 'Rent' : 
                 preference.preferenceType === 'shortlet' ? 'Shortlet' : 
                 preference.preferenceType}
              </td>
            </tr>
            
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-500 text-sm font-normal">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3 mr-1" />
                Location
              </td>
              <td className="py-3 px-4 text-black text-sm font-bold text-right">
                {formatLocation(preference.location)}
              </td>
            </tr>

            {preference.propertyDetails?.minBedrooms && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-500 text-sm font-normal">
                  <FontAwesomeIcon icon={faBed} className="w-3 h-3 mr-1" />
                  Bedrooms
                </td>
                <td className="py-3 px-4 text-black text-sm font-bold text-right">
                  {preference.propertyDetails.minBedrooms}+
                </td>
              </tr>
            )}

            {preference.bookingDetails?.minBedrooms && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-500 text-sm font-normal">
                  <FontAwesomeIcon icon={faBed} className="w-3 h-3 mr-1" />
                  Bedrooms
                </td>
                <td className="py-3 px-4 text-black text-sm font-bold text-right">
                  {preference.bookingDetails.minBedrooms}+
                </td>
              </tr>
            )}
            
            <tr className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-500 text-sm font-normal">
                <FontAwesomeIcon icon={faTag} className="w-3 h-3 mr-1" />
                Budget
              </td>
              <td className="py-3 px-4 text-black text-sm font-bold text-right">
                {formatPrice(preference.budget.minPrice)} - {formatPrice(preference.budget.maxPrice)}
              </td>
            </tr>

            {preference.propertyDetails?.documentTypes && preference.propertyDetails.documentTypes.length > 0 && (
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-500 text-sm font-normal">
                  <FontAwesomeIcon icon={faFileAlt} className="w-3 h-3 mr-1" />
                  Documents
                </td>
                <td className="py-3 px-4 text-black text-sm font-bold text-right">
                  {preference.propertyDetails.documentTypes.slice(0, 2).join(', ')}
                  {preference.propertyDetails.documentTypes.length > 2 && '...'}
                </td>
              </tr>
            )}

            {preference.propertyDetails?.propertyCondition && (
              <tr>
                <td className="py-3 px-4 text-gray-500 text-sm font-normal">Condition</td>
                <td className="py-3 px-4 text-black text-sm font-bold text-right">
                  {preference.propertyDetails.propertyCondition}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View More Button */}
      <div className="bg-[#F7F7F9] py-4 text-center border-t border-gray-200">
        <button 
          onClick={() => router.push(`/agent-marketplace/${preference.preferenceId}`)}
          className="text-black text-sm font-medium underline hover:no-underline cursor-pointer"
        >
          View more
        </button>
      </div>

      {/* Action Button */}
      <div className="bg-white py-6 text-center">
        <div className="px-4">
          <button 
            onClick={() => handleIHaveIt(preference.preferenceId)}
            className="bg-[#8DDB90] hover:bg-[#7BC97F] text-white py-3 text-sm font-medium w-full rounded cursor-pointer transition-colors"
          >
            I have it
          </button>
        </div>
      </div>
    </div>
  );

  // Early return for initial loading state
  if (!hasInitialized && isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Error boundary for critical errors
  if (error && error.includes('Configuration error')) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#8DDB90] text-white rounded hover:bg-[#7BC97F] transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-gray-600 mb-4">
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>•</span>
            <span className="text-gray-900">agent marketplace</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-extrabold text-[#09391C] mb-2">Agent Marketplace</h1>
          <p className="text-gray-600">Connect with Serious Buyers—Submit Now.</p>
        </div>

        {/* Featured Matched Buyers Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#8DDB90]/10 via-[#8DDB90]/5 to-transparent rounded-2xl p-8 mb-12 border border-[#8DDB90]/20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#8DDB90] rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#09391C] rounded-full translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#8DDB90] rounded-full opacity-30"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8DDB90]/10 rounded-full text-[#09391C] text-sm font-medium mb-4">
                <div className="w-2 h-2 bg-[#8DDB90] rounded-full animate-pulse"></div>
                Hot Opportunities
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#09391C] mb-3">
                🎯 Buyers Just Got Matched!
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Fresh opportunities waiting for the right properties.
                <span className="text-[#8DDB90] font-semibold"> Submit now to get featured</span> and connect with serious buyers.
              </p>
            </div>

            {/* Matched Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {getMatchedProperties().map((property, idx) => (
                <div
                  key={property.id || property._id || `matched-${idx}`}
                  className="group relative bg-white rounded-xl border-2 border-[#8DDB90]/20 hover:border-[#8DDB90]/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  {/* Status badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      Active
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-[#F7F7F9] p-3 rounded-lg">
                        <span className="text-gray-500 text-sm font-medium">Type</span>
                        <span className="text-[#09391C] text-sm font-bold">{property.type}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#F7F7F9] p-3 rounded-lg">
                        <span className="text-gray-500 text-sm font-medium">Location</span>
                        <span className="text-[#09391C] text-sm font-bold">{property.location}</span>
                      </div>
                    </div>

                    {/* Action indicator */}
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center gap-2 text-green-600 text-sm font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="group-hover:text-green-700 transition-colors">Ready to Match</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="inline-flex flex-col md:flex-row items-center gap-4 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-[#8DDB90]/30">
                <div className="flex-1 text-left">
                  <h3 className="font-display text-lg font-semibold text-[#09391C] mb-1">
                    Don't Miss Out!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Be the first to submit matching properties and get premium visibility
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-[#8DDB90] to-[#7BC97F] hover:from-[#7BC97F] hover:to-[#6AB86E] text-white font-semibold rounded-lg transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap">
                  🚀 Submit Your Property
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter state, lga, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10 py-3 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={preferenceMode}
              onChange={(e) => setPreferenceMode(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Preference Mode</option>
              <option value="buy">Buyer</option>
              <option value="tenant">Tenant</option>
              <option value="developer">Developer</option>
              <option value="shortlet">Shortlet</option>
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Document Type</option>
              <option value="certificate-of-occupancy">Certificate of Occupancy</option>
              <option value="deed-of-assignment">Deed of Assignment</option>
              <option value="deed-of-ownership">Deed of Ownership</option>
              <option value="deed-of-conveyance">Deed of Conveyance</option>
              <option value="land-certificate">Land Certificate</option>
              <option value="governor-consent">Governor Consent</option>
              <option value="registered-deed-of-conveyance">Registered Deed of Conveyance</option>
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={propertyCondition}
              onChange={(e) => setPropertyCondition(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Property Condition</option>
              <option value="new">New</option>
              <option value="renovated">Renovated</option>
              <option value="old">Old</option>
              <option value="under-construction">Under Construction</option>
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <button 
            onClick={handleSearch}
            className="px-8 py-3 bg-[#8DDB90] hover:bg-[#7BC97F] text-white rounded-lg font-medium transition-colors"
          >
            Search
          </button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <Loading />
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-[#8DDB90] text-white rounded hover:bg-[#7BC97F] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : preferences.length > 0 ? (
            preferences.map((preference: Preference, idx: number) => (
              <PreferenceCard key={preference.preferenceId || idx} preference={preference} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No preferences found</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => {
                setIsPaginationLoading(true);
                setCurrentPage((p) => Math.max(1, p - 1));
              }}
              disabled={currentPage === 1 || isPaginationLoading}
              className="px-4 py-2 rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {(() => {
              const pageButtons = [];
              const windowSize = 2;
              let start = Math.max(2, currentPage - windowSize);
              let end = Math.min(totalPages - 1, currentPage + windowSize);
              
              if (currentPage <= 3) {
                start = 2;
                end = Math.min(5, totalPages - 1);
              }
              if (currentPage >= totalPages - 2) {
                start = Math.max(2, totalPages - 4);
                end = totalPages - 1;
              }
              
              // Always show first page
              pageButtons.push(
                <button
                  key={1}
                  onClick={() => {
                    if (currentPage !== 1) {
                      setIsPaginationLoading(true);
                      setCurrentPage(1);
                    }
                  }}
                  disabled={isPaginationLoading}
                  className={`px-3 py-2 rounded border ${currentPage === 1 ? 'bg-[#8DDB90] text-white' : 'bg-white hover:bg-gray-50'} disabled:opacity-50 transition-colors`}
                >
                  1
                </button>
              );
              
              // Ellipsis if needed
              if (start > 2) {
                pageButtons.push(<span key="start-ellipsis" className="px-2">...</span>);
              }
              
              // Middle page numbers
              for (let i = start; i <= end; i++) {
                pageButtons.push(
                  <button
                    key={i}
                    onClick={() => {
                      if (currentPage !== i) {
                        setIsPaginationLoading(true);
                        setCurrentPage(i);
                      }
                    }}
                    disabled={isPaginationLoading}
                    className={`px-3 py-2 rounded border ${currentPage === i ? 'bg-[#8DDB90] text-white' : 'bg-white hover:bg-gray-50'} disabled:opacity-50 transition-colors`}
                  >
                    {i}
                  </button>
                );
              }
              
              // Ellipsis if needed
              if (end < totalPages - 1) {
                pageButtons.push(<span key="end-ellipsis" className="px-2">...</span>);
              }
              
              // Always show last page if more than 1
              if (totalPages > 1) {
                pageButtons.push(
                  <button
                    key={totalPages}
                    onClick={() => {
                      if (currentPage !== totalPages) {
                        setIsPaginationLoading(true);
                        setCurrentPage(totalPages);
                      }
                    }}
                    disabled={isPaginationLoading}
                    className={`px-3 py-2 rounded border ${currentPage === totalPages ? 'bg-[#8DDB90] text-white' : 'bg-white hover:bg-gray-50'} disabled:opacity-50 transition-colors`}
                  >
                    {totalPages}
                  </button>
                );
              }
              return pageButtons;
            })()}
            
            <button
              onClick={() => {
                setIsPaginationLoading(true);
                setCurrentPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={currentPage === totalPages || isPaginationLoading}
              className="px-4 py-2 rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Display pagination info */}
        {totalItems > 0 && (
          <div className="text-center mt-4 text-gray-600">
            Showing {Math.min(limit, preferences.length)} of {totalItems} preferences (Page {currentPage} of {totalPages})
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentMarketplace;
