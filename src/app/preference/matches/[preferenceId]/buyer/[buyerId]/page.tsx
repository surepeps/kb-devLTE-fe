"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Property } from '@/types/property.types';
import GlobalPropertyCard from '@/components/common/property-cards/GlobalPropertyCard';
import GlobalJVPropertyCard from '@/components/common/property-cards/GlobalJVPropertyCard';
import { ClipLoader } from 'react-spinners';

interface MatchedProperty extends Property {
  propertyType?: string;
  marketType?: string;
}

const PreferenceMatchesPage: React.FC = () => {
  const params = useParams();
  const preferenceId = params.preferenceId as string;
  const buyerId = params.buyerId as string;

  const [matchedProperties, setMatchedProperties] = useState<MatchedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchedProperties = async () => {
      if (!preferenceId || !buyerId) {
        setError('Missing preference ID or buyer ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `/api/preferences/getMatchedProps/${buyerId}/${preferenceId}`
        );
        
        if (response.data && response.data.success) {
          setMatchedProperties(response.data.data || []);
        } else {
          setMatchedProperties([]);
        }
      } catch (err: any) {
        console.error('Error fetching matched properties:', err);
        setError(err.response?.data?.message || 'Failed to fetch matched properties');
        setMatchedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedProperties();
  }, [preferenceId, buyerId]);

  const generateCardData = (property: MatchedProperty) => {
    return [
      { header: 'Price', value: property.price ? `₦${Number(property.price).toLocaleString()}` : 'Contact for price' },
      { header: 'Location', value: property.location || 'Location not specified' },
      { header: 'Bedrooms', value: property.bedroom?.toString() || 'N/A' },
      { header: 'Bathrooms', value: property.bathroom?.toString() || 'N/A' },
      { header: 'Type', value: property.propertyType || property.type || 'Property' },
    ];
  };

  const isJointVenture = (property: MatchedProperty) => {
    return property.marketType === 'joint-venture' || 
           property.propertyType?.toLowerCase().includes('joint') ||
           property.type?.toLowerCase().includes('joint');
  };

  const renderProperty = (property: MatchedProperty, index: number) => {
    const cardData = generateCardData(property);
    const images = property.images || [];
    
    if (isJointVenture(property)) {
      return (
        <GlobalJVPropertyCard
          key={property._id || index}
          property={property}
          cardData={cardData}
          images={images}
          isPremium={false}
          onPropertyClick={() => {
            // Handle property click navigation if needed
            console.log('Property clicked:', property._id);
          }}
          className="h-full"
        />
      );
    }

    return (
      <GlobalPropertyCard
        key={property._id || index}
        tab="buy"
        property={property}
        cardData={cardData}
        images={images}
        isPremium={false}
        onPropertyClick={() => {
          // Handle property click navigation if needed
          console.log('Property clicked:', property._id);
        }}
        className="h-full"
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ClipLoader size={40} color="#10B981" />
          <p className="mt-4 text-gray-600">Loading matched properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Matches</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Matches</h1>
          <p className="text-gray-600">
            Properties that match your preferences (Preference ID: {preferenceId})
          </p>
        </div>

        {/* Content */}
        {matchedProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H5m0 0h4m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No matches found</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any properties that match your current preferences. 
              Try adjusting your criteria or check back later for new listings.
            </p>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6">
              <p className="text-gray-700">
                Found <span className="font-semibold">{matchedProperties.length}</span> matching properties
              </p>
            </div>

            {/* Properties grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {matchedProperties.map((property, index) => renderProperty(property, index))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PreferenceMatchesPage;
