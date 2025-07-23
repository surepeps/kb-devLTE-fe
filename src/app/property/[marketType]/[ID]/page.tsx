/** @format */
"use client";

import React, { useEffect, useState, Fragment } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, MapPin, Calendar, Share2, Heart, Phone, Mail, Star, Bed, Bath, Car, Maximize, CheckCircle, ExternalLink, Camera, ArrowLeft, ArrowRight, X, Eye, Clock, Home, User, FileText, Shield } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { URLS } from "@/utils/URLS";
import { usePageContext } from "@/context/page-context";
import { useSelectedBriefs } from "@/context/selected-briefs-context";
import { useGlobalPropertyActions } from "@/context/global-property-actions-context";
import { epilogue } from "@/styles/font";
import sampleImage from "@/assets/Rectangle.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import Loading from "@/components/loading-component/loading";

interface PropertyDetails {
  _id: string;
  propertyId: string;
  price: number;
  propertyType: string;
  bedRoom: number;
  propertyStatus: string;
  location: {
    state: string;
    localGovernment: string;
    area: string;
  };
  landSize: {
    measurementType: string;
    size: number | null;
  };
  additionalFeatures: {
    additionalFeatures: string[];
    noOfBedrooms?: number;
    noOfBathrooms?: number;
    noOfToilets?: number;
    noOfCarParks?: number;
  };
  features: string[];
  tenantCriteria: { _id: string; criteria: string }[];
  areYouTheOwner: boolean;
  isAvailable: boolean | string;
  isApproved?: boolean;
  isRejected?: boolean;
  isPreference?: boolean;
  isPremium?: boolean;
  pictures: string[];
  createdAt: string;
  updatedAt: string;
  owner: string;
  docOnProperty: { isProvided: boolean; _id: string; docName: string }[];
  briefType?: string;
  propertyCondition?: string;
  noOfCarParks?: number;
  noOfBathrooms?: number;
  noOfToilets?: number;
}

// Image Gallery Component
const ImageGallery = ({ images }: { images: string[] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { setImageData, setViewImage } = usePageContext();

  const validImages = images.length > 0 ? images : [sampleImage.src];

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Swiper */}
      <div className="relative group">
        <Swiper
          modules={[Navigation, Pagination, Thumbs, Autoplay]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={validImages.length > 1}
          className="w-full aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-lg"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {validImages.map((image, index) => (
            <SwiperSlide key={index} className="relative">
              <Image
                src={image}
                alt={`Property image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
              />
              <button
                onClick={() => openLightbox(index)}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <Camera className="w-5 h-5" />
              </button>
            </SwiperSlide>
          ))}
          
          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
            <ArrowRight className="w-5 h-5" />
          </button>
        </Swiper>
      </div>

      {/* Thumbnail Gallery */}
      {validImages.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={4}
          breakpoints={{
            640: { slidesPerView: 5 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 7 },
          }}
          watchSlidesProgress
          className="thumbnail-swiper"
        >
          {validImages.map((image, index) => (
            <SwiperSlide key={index} className="cursor-pointer">
              <div className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                index === activeIndex ? 'ring-2 ring-blue-500 opacity-100' : 'opacity-70 hover:opacity-100'
              }`}>
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={validImages[activeIndex]}
                alt={`Property image ${activeIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Property Stats Component
const PropertyStats = ({ details }: { details: PropertyDetails }) => {
  const stats = [
    {
      icon: <Bed className="w-5 h-5" />,
      label: "Bedrooms",
      value: details.additionalFeatures?.noOfBedrooms || details.bedRoom || 0,
    },
    {
      icon: <Bath className="w-5 h-5" />,
      label: "Bathrooms",
      value: details.additionalFeatures?.noOfBathrooms || details.noOfBathrooms || 0,
    },
    {
      icon: <Car className="w-5 h-5" />,
      label: "Parking",
      value: details.additionalFeatures?.noOfCarParks || details.noOfCarParks || 0,
    },
    {
      icon: <Maximize className="w-5 h-5" />,
      label: "Land Size",
      value: details.landSize?.size ? `${details.landSize.size} ${details.landSize.measurementType || ''}` : 'N/A',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-center text-blue-600 mb-2">
            {stat.icon}
          </div>
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="font-semibold text-gray-900">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

// Feature List Component
const FeatureList = ({ features, title }: { features: string[]; title: string }) => {
  if (!features.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Property Info Card Component
const PropertyInfoCard = ({ details }: { details: PropertyDetails }) => {
  const infoItems = [
    { label: "Property Type", value: details.propertyType, icon: <Home className="w-4 h-4" /> },
    { label: "Listing Type", value: details.briefType || "Standard", icon: <FileText className="w-4 h-4" /> },
    { label: "Condition", value: details.propertyCondition || "Good", icon: <Shield className="w-4 h-4" /> },
    { label: "Owner", value: details.areYouTheOwner ? "Owner" : "Agent", icon: <User className="w-4 h-4" /> },
    { label: "Date Listed", value: new Date(details.createdAt).toLocaleDateString(), icon: <Calendar className="w-4 h-4" /> },
    { label: "Last Updated", value: new Date(details.updatedAt).toLocaleDateString(), icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center text-gray-600">
              {item.icon}
              <span className="ml-2 text-sm">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Documents Component
const DocumentsList = ({ documents }: { documents: PropertyDetails['docOnProperty'] }) => {
  if (!documents || documents.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2" />
        Available Documents
      </h3>
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">{doc.docName}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              doc.isProvided
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {doc.isProvided ? 'Available' : 'Not Available'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Action Buttons Component
const ActionButtons = ({ details, onInspection, onNegotiation, isSelected }: {
  details: PropertyDetails;
  onInspection: () => void;
  onNegotiation: () => void;
  isSelected: boolean;
}) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="space-y-4">
      {/* Price */}
      <div className="text-center md:text-left">
        <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          ₦{details.price ? Number(details.price).toLocaleString() : 'Contact for price'}
        </div>
        <div className="flex items-center justify-center md:justify-start text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {details.location.area}, {details.location.localGovernment}, {details.location.state}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onInspection}
          className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center ${
            isSelected
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          <Eye className="w-5 h-5 mr-2" />
          {isSelected ? "Remove from Inspection" : "Add to Inspection"}
        </button>
        <button
          onClick={onNegotiation}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Price Negotiation
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`flex-1 border-2 ${isLiked ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-600'} hover:border-red-500 hover:text-red-500 font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center`}
        >
          <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
          {isLiked ? 'Saved' : 'Save'}
        </button>
        <button className="flex-1 border-2 border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center">
          <Share2 className="w-5 h-5 mr-2" />
          Share
        </button>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center md:justify-start">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          details.isAvailable 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {details.isAvailable ? 'Available' : 'Not Available'}
        </span>
      </div>
    </div>
  );
};

const ProductDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [details, setDetails] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const { setPropertySelectedForInspection, setIsComingFromPriceNeg } = usePageContext();
  const { selectedBriefs } = useSelectedBriefs();
  const { toggleInspectionSelection, isSelectedForInspection } = useGlobalPropertyActions();

  const marketType = params?.marketType ?? "";
  const id = params?.ID ?? "";

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${URLS.BASE}/properties/${id}/getOne`);

        if (response.status === 200 && response.data.success) {
          const propertyData = response.data.data;
          setDetails({
            _id: propertyData._id,
            propertyId: propertyData._id,
            price: propertyData.price,
            propertyType: propertyData.typeOfBuilding || propertyData.propertyType,
            bedRoom: propertyData.additionalFeatures?.noOfBedroom || 0,
            propertyStatus: propertyData.propertyCondition || "",
            location: propertyData.location,
            landSize: propertyData.landSize || { measurementType: "", size: null },
            additionalFeatures: {
              additionalFeatures: propertyData.features || [],
              noOfBedrooms: propertyData.additionalFeatures?.noOfBedroom || 0,
              noOfBathrooms: propertyData.additionalFeatures?.noOfBathroom || 0,
              noOfToilets: propertyData.additionalFeatures?.noOfToilet || 0,
              noOfCarParks: propertyData.additionalFeatures?.noOfCarPark || 0,
            },
            features: propertyData.features || [],
            tenantCriteria: propertyData.tenantCriteria || [],
            areYouTheOwner: propertyData.areYouTheOwner ?? false,
            isAvailable: propertyData.isAvailable,
            isApproved: propertyData.isApproved ?? false,
            isRejected: propertyData.isRejected ?? false,
            isPreference: false,
            isPremium: false,
            pictures: propertyData.pictures && propertyData.pictures.length > 0
              ? propertyData.pictures
              : [sampleImage.src],
            createdAt: propertyData.createdAt,
            updatedAt: propertyData.updatedAt,
            owner: propertyData.owner,
            docOnProperty: propertyData.docOnProperty || [],
            briefType: propertyData.propertyCategory === "for_sale" ? "Outright Sales" :
                      propertyData.propertyCategory === "for_rent" ? "Rent" : "Unknown",
            propertyCondition: propertyData.propertyCondition || "",
            noOfCarParks: propertyData.additionalFeatures?.noOfCarPark || 0,
            noOfBathrooms: propertyData.additionalFeatures?.noOfBathroom || 0,
            noOfToilets: propertyData.additionalFeatures?.noOfToilet || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  // Fetch similar properties
  useEffect(() => {
    const fetchSimilarProperties = async () => {
      try {
        const response = await axios.get(`${URLS.BASE}/properties/rents/all`);
        if (response.status === 200) {
          setSimilarProperties(response.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching similar properties:", error);
      }
    };

    fetchSimilarProperties();
  }, []);

  const handleInspection = () => {
    if (details) {
      // Determine the tab based on property category
      const sourceTab = details.briefType === "Joint Venture" ? "jv" :
                       details.briefType === "Rent" ? "rent" : "buy";

      toggleInspectionSelection(details, sourceTab, "property-details");

      // Check if now selected for inspection
      if (isSelectedForInspection(details._id)) {
        toast.success("Property added to inspection");
      } else {
        toast.success("Property removed from inspection");
      }
    }
  };

  const handleNegotiation = () => {
    if (details) {
      // This would open the price negotiation modal
      // For now, we'll just show a message
      toast.success("Price negotiation feature coming soon!");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">ID: {details.owner.slice(-8)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ImageGallery images={details.pictures} />
            </motion.div>

            {/* Property Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <PropertyStats details={details} />
            </motion.div>

            {/* Property Features */}
            {details.features.length > 0 && (
              <FeatureList features={details.features} title="Property Features" />
            )}

            {/* Tenant Criteria */}
            {details.tenantCriteria.length > 0 && (
              <FeatureList 
                features={details.tenantCriteria.map(c => c.criteria)} 
                title="Tenant Requirements" 
              />
            )}

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 text-sm leading-relaxed">
                  This property is managed by Khabi-Teq Realty. All transactions are secure and verified. 
                  For more information about this property, please contact us directly or schedule an inspection.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <ActionButtons
                details={details}
                onInspection={handleInspection}
                onNegotiation={handleNegotiation}
                isSelected={isSelectedForInspection(details._id)}
              />
            </motion.div>

            {/* Property Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <PropertyInfoCard details={details} />
            </motion.div>

            {/* Selected Briefs */}
            {Array.from(selectedBriefs).length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Briefs</h3>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <p className="text-orange-800 font-medium">
                    {Array.from(selectedBriefs).length} brief{Array.from(selectedBriefs).length !== 1 ? 's' : ''} selected
                  </p>
                  <button className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </motion.div>
            )}

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Properties</h3>
                <div className="space-y-4">
                  {similarProperties.slice(0, 2).map((property, index) => (
                    <div
                      key={index}
                      onClick={() => router.push(`/property/Rent/${property._id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex space-x-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image
                            src={property.pictures?.[0] || sampleImage.src}
                            alt="Property thumbnail"
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {property.propertyType}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">
                            {property.location.state}, {property.location.localGovernment}
                          </p>
                          <p className="text-sm font-semibold text-green-600">
                            ₦{Number(property.rentalPrice || property.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
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

export default ProductDetailsPage;
