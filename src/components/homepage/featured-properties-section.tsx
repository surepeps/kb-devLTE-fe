/** @format */

'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GET_REQUEST } from '@/utils/requests';
import { URLS } from '@/utils/URLS';

interface Property {
  _id: string;
  title: string;
  briefType: string;
  state: string;
  localGovernmentArea: string;
  address: string;
  price: number;
  images: string[];
  userID: string;
  createdAt: string;
}

const FeaturedPropertiesSection = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch featured properties from marketplace
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        
        // Fetch a mix of different property types
        const buyResponse = await GET_REQUEST(`${URLS.BASE}/briefs/buy?page=1&limit=2`);
        const rentResponse = await GET_REQUEST(`${URLS.BASE}/briefs/rent?page=1&limit=2`);
        
        const allProperties = [];
        
        if (buyResponse.success && buyResponse.data?.briefs) {
          allProperties.push(...buyResponse.data.briefs.slice(0, 2));
        }
        
        if (rentResponse.success && rentResponse.data?.briefs) {
          allProperties.push(...rentResponse.data.briefs.slice(0, 2));
        }
        
        setProperties(allProperties.slice(0, 4)); // Limit to 4 properties
        
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Unable to load properties');
        
        // Fallback to sample data
        setProperties([
          {
            _id: 'sample-1',
            title: '3 Bedroom Apartment in Lekki',
            briefType: 'rent',
            state: 'Lagos',
            localGovernmentArea: 'Lekki',
            address: 'Lekki Phase 1, Lagos',
            price: 2500000,
            images: ['/placeholder-property.svg'],
            userID: 'sample-user',
            createdAt: new Date().toISOString()
          },
          {
            _id: 'sample-2',
            title: '4 Bedroom Duplex in Ikeja',
            briefType: 'sale',
            state: 'Lagos',
            localGovernmentArea: 'Ikeja',
            address: 'GRA Ikeja, Lagos',
            price: 45000000,
            images: ['/placeholder-property.svg'],
            userID: 'sample-user',
            createdAt: new Date().toISOString()
          },
          {
            _id: 'sample-3',
            title: '2 Bedroom Flat in Victoria Island',
            briefType: 'rent',
            state: 'Lagos',
            localGovernmentArea: 'Lagos Island',
            address: 'Victoria Island, Lagos',
            price: 1800000,
            images: ['/placeholder-property.svg'],
            userID: 'sample-user',
            createdAt: new Date().toISOString()
          },
          {
            _id: 'sample-4',
            title: '5 Bedroom Mansion in Banana Island',
            briefType: 'sale',
            state: 'Lagos',
            localGovernmentArea: 'Lagos Island',
            address: 'Banana Island, Lagos',
            price: 120000000,
            images: ['/placeholder-property.svg'],
            userID: 'sample-user',
            createdAt: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const formatPropertyType = (briefType: string) => {
    switch (briefType.toLowerCase()) {
      case 'sale':
      case 'buy':
        return 'For Sale';
      case 'rent':
      case 'lease':
        return 'For Rent';
      case 'shortlet':
        return 'Shortlet';
      case 'joint-venture':
        return 'Joint Venture';
      default:
        return briefType;
    }
  };

  const getPropertyUrl = (property: Property) => {
    const marketType = property.briefType.toLowerCase() === 'sale' || property.briefType.toLowerCase() === 'buy' ? 'buy' : property.briefType.toLowerCase();
    return `/property/${marketType}/${property._id}`;
  };

  if (loading) {
    return (
      <section className='w-full py-16 md:py-24 bg-[#FFFEFB]'>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#8DDB90] mx-auto'></div>
            <p className='text-gray-600 mt-4'>Loading featured properties...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='w-full py-16 md:py-24 bg-[#FFFEFB]'>
      <div className='container mx-auto px-4 md:px-8'>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-[#09391C] mb-6 font-display'>
            Featured Properties
          </h2>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto'>
            Discover hand-picked properties from our marketplace that match various needs and budgets.
          </p>
        </motion.div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {properties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105'>
                
                {/* Property Image */}
                <div className='aspect-[4/3] relative overflow-hidden'>
                  <img 
                    src={property.images?.[0] || '/placeholder-property.svg'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Property Type Badge */}
                  <div className='absolute top-4 left-4'>
                    <span className='bg-[#8DDB90] text-white px-3 py-1 rounded-full text-sm font-medium'>
                      {formatPropertyType(property.briefType)}
                    </span>
                  </div>
                  
                  {/* Price Badge */}
                  <div className='absolute top-4 right-4'>
                    <span className='bg-white/90 backdrop-blur-sm text-[#09391C] px-3 py-1 rounded-full text-sm font-bold'>
                      {formatPrice(property.price)}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className='p-6'>
                  {/* Title */}
                  <h3 className='text-lg font-bold text-[#09391C] mb-2 line-clamp-2 group-hover:text-[#8DDB90] transition-colors duration-300'>
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className='flex items-center gap-2 text-gray-600 mb-4'>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className='text-sm'>{property.localGovernmentArea}, {property.state}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-2'>
                    <Link href={getPropertyUrl(property)} className='flex-1'>
                      <button className='w-full bg-[#8DDB90] hover:bg-[#7BC87F] text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 text-sm'>
                        Negotiate
                      </button>
                    </Link>
                    <Link href={getPropertyUrl(property)} className='flex-1'>
                      <button className='w-full border-2 border-[#8DDB90] text-[#8DDB90] hover:bg-[#8DDB90] hover:text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 text-sm'>
                        Book Inspection
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-600 mb-4'>No featured properties available at the moment.</p>
          </div>
        )}

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className='text-center mt-12'>
          <Link href="/market-place">
            <button className='bg-white border-2 border-[#8DDB90] text-[#8DDB90] hover:bg-[#8DDB90] hover:text-white px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl'>
              View More Properties
            </button>
          </Link>
        </motion.div>

        {error && (
          <div className='text-center mt-8'>
            <p className='text-red-600 text-sm'>
              {error} - Showing sample properties
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default FeaturedPropertiesSection;
