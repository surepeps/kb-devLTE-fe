import mongoose, { Schema, Document } from 'mongoose';

/**
 * Property Schema
 * 
 * Represents property listings for Buy, Rent, Joint Venture, and Shortlet
 * Designed to be auto-populated from Preference documents
 * Maintains similar structure to PreferenceSchema for seamless data mapping
 */

// Contact Info Interface
interface IPropertyContactInfo {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp';
  contactTimes?: string[];
}

// Owner/Agent Info Interface
interface IPropertyOwnerInfo {
  id?: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  agentType?: 'individual' | 'agent' | 'agency';
  cacRegistrationNumber?: string;
}

// Location Interface - Aligned with Preference
interface IPropertyLocation {
  state: string;
  lga: string;
  area?: string;
  detailedAddress?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Price Interface
interface IPropertyPrice {
  amount: number;
  currency: string;
  negotiable: boolean;
  paymentPlans?: string[];
  weeklyRate?: number;
  monthlyRate?: number;
}

// Features Interface
interface IPropertyFeatures {
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  parkingSpaces?: number;
  landSize?: string;
  measurementUnit?: string;
  buildingSize?: string;
  furnished?: boolean;
  serviced?: boolean;
  maxGuests?: number;
  travelType?: string;
}

// Amenities Interface
interface IPropertyAmenities {
  securityFeatures?: string[];
  amenities?: string[];
  keyFeatures?: string[];
}

// Buy Property Details
interface IBuyPropertyDetails {
  propertySubtype: 'land' | 'residential' | 'commercial';
  buildingType?: 'detached' | 'semi-detached' | 'block-of-flats';
  propertyCondition?: 'new' | 'renovated' | 'old';
  purpose?: 'for-living' | 'resale' | 'development';
  documentTypes?: string[];
}

// Rent Property Details
interface IRentPropertyDetails {
  propertySubtype: 'self-con' | 'flat' | 'mini-flat' | 'bungalow';
  propertyCondition?: 'new' | 'good-condition' | 'renovation';
  purpose?: 'residential' | 'office';
  employmentType?: string;
  documentTypes?: string[];
}

// Shortlet Property Details
interface IShortletPropertyDetails {
  propertySubtype: 'studio' | '1-bed' | '2-bed' | '3-bed';
  propertyCondition?: 'new' | 'renovated' | 'good-condition';
  checkInTime?: string;
  checkOutTime?: string;
  minimumStayDays?: number;
  cancellationPolicy?: string;
  housePolicies?: string[];
}

// Joint Venture Property Details
interface IJointVenturePropertyDetails {
  propertySubtype: 'land' | 'old-building' | 'structure-to-demolish';
  developmentTypes?: string[];
  landConditions?: string[];
  jvType?: 'equity-split' | 'lease-to-build' | 'development-partner';
  preferredSharingRatio?: string;
  timeline?: 'ready-now' | 'in-3-months' | 'within-1-year';
  minimumTitleRequirements?: string[];
}

// Document Interface
interface IPropertyDocument {
  type: string;
  verified: boolean;
  url?: string;
  uploadedAt?: Date;
}

// Image Interface
interface IPropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

// Ownership Declaration
interface IOwnershipDeclaration {
  isOwner: boolean;
  hasRightToSell: boolean;
  noLegalDisputes: boolean;
  accurateInformation: boolean;
}

// Main Property Document
interface IProperty extends Document {
  // Basic Information
  title: string;
  description: string;
  category: 'sale' | 'rent' | 'shortlet' | 'joint-venture';
  status: 'draft' | 'pending-verification' | 'active' | 'sold' | 'rented' | 'suspended';
  
  // Location & Geography
  location: IPropertyLocation;
  
  // Pricing
  price: IPropertyPrice;
  
  // Property Features
  features: IPropertyFeatures;
  amenities: IPropertyAmenities;
  
  // Property Type Specific Details
  propertyDetails?: IBuyPropertyDetails | IRentPropertyDetails | IShortletPropertyDetails | IJointVenturePropertyDetails;
  
  // Media & Documents
  images: IPropertyImage[];
  documents: IPropertyDocument[];
  
  // Contact & Ownership
  contactInfo: IPropertyContactInfo;
  owner: IPropertyOwnerInfo;
  agent?: IPropertyOwnerInfo;
  ownershipDeclaration: IOwnershipDeclaration;
  
  // Preference Reference (for auto-generation tracking)
  sourcePreferenceId?: string;
  preferenceType?: 'buy' | 'rent' | 'joint-venture' | 'shortlet';
  
  // Engagement Metrics
  views: number;
  likes: number;
  inquiries: number;
  
  // Verification & Approval
  verified: boolean;
  featured: boolean;
  verificationNotes?: string;
  verifiedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  
  // Additional Fields
  notes?: string;
}

// Contact Info Schema
const contactInfoSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 255,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  whatsapp: {
    type: String,
    trim: true,
  },
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'whatsapp'],
    required: true,
  },
  contactTimes: {
    type: [String],
    default: [],
  },
}, { _id: false });

// Owner/Agent Info Schema
const ownerInfoSchema = new Schema({
  id: String,
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  agentType: {
    type: String,
    enum: ['individual', 'agent', 'agency'],
  },
  cacRegistrationNumber: String,
}, { _id: false });

// Location Schema - Aligned with Preference
const locationSchema = new Schema({
  state: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  lga: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  area: {
    type: String,
    trim: true,
  },
  detailedAddress: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
}, { _id: false });

// Price Schema
const priceSchema = new Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'NGN',
    enum: ['NGN', 'USD', 'GBP'],
  },
  negotiable: {
    type: Boolean,
    default: false,
  },
  paymentPlans: {
    type: [String],
    default: [],
  },
  weeklyRate: Number,
  monthlyRate: Number,
}, { _id: false });

// Features Schema
const featuresSchema = new Schema({
  bedrooms: Number,
  bathrooms: Number,
  toilets: Number,
  parkingSpaces: Number,
  landSize: String,
  measurementUnit: {
    type: String,
    enum: ['plot', 'sqm', 'hectares', null],
  },
  buildingSize: String,
  furnished: Boolean,
  serviced: Boolean,
  maxGuests: Number,
  travelType: String,
}, { _id: false });

// Amenities Schema
const amenitiesSchema = new Schema({
  securityFeatures: {
    type: [String],
    default: [],
  },
  amenities: {
    type: [String],
    default: [],
  },
  keyFeatures: {
    type: [String],
    default: [],
  },
}, { _id: false });

// Buy Property Details Schema
const buyPropertyDetailsSchema = new Schema({
  propertySubtype: {
    type: String,
    enum: ['land', 'residential', 'commercial'],
    required: true,
  },
  buildingType: {
    type: String,
    enum: ['detached', 'semi-detached', 'block-of-flats', null],
  },
  propertyCondition: {
    type: String,
    enum: ['new', 'renovated', 'old', null],
  },
  purpose: {
    type: String,
    enum: ['for-living', 'resale', 'development', null],
  },
  documentTypes: {
    type: [String],
    default: [],
  },
}, { _id: false });

// Rent Property Details Schema
const rentPropertyDetailsSchema = new Schema({
  propertySubtype: {
    type: String,
    enum: ['self-con', 'flat', 'mini-flat', 'bungalow'],
    required: true,
  },
  propertyCondition: {
    type: String,
    enum: ['new', 'good-condition', 'renovation', null],
  },
  purpose: {
    type: String,
    enum: ['residential', 'office', null],
  },
  employmentType: String,
  documentTypes: {
    type: [String],
    default: [],
  },
}, { _id: false });

// Shortlet Property Details Schema
const shortletPropertyDetailsSchema = new Schema({
  propertySubtype: {
    type: String,
    enum: ['studio', '1-bed', '2-bed', '3-bed'],
    required: true,
  },
  propertyCondition: {
    type: String,
    enum: ['new', 'renovated', 'good-condition', null],
  },
  checkInTime: String,
  checkOutTime: String,
  minimumStayDays: Number,
  cancellationPolicy: String,
  housePolicies: {
    type: [String],
    default: [],
  },
}, { _id: false });

// Joint Venture Property Details Schema
const jvPropertyDetailsSchema = new Schema({
  propertySubtype: {
    type: String,
    enum: ['land', 'old-building', 'structure-to-demolish'],
    required: true,
  },
  developmentTypes: {
    type: [String],
    default: [],
  },
  landConditions: {
    type: [String],
    default: [],
  },
  jvType: {
    type: String,
    enum: ['equity-split', 'lease-to-build', 'development-partner', null],
  },
  preferredSharingRatio: String,
  timeline: {
    type: String,
    enum: ['ready-now', 'in-3-months', 'within-1-year', null],
  },
  minimumTitleRequirements: {
    type: [String],
    default: [],
  },
}, { _id: false });

// Document Schema
const documentSchema = new Schema({
  type: String,
  verified: {
    type: Boolean,
    default: false,
  },
  url: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

// Image Schema
const imageSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    maxlength: 200,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

// Ownership Declaration Schema
const ownershipDeclarationSchema = new Schema({
  isOwner: Boolean,
  hasRightToSell: Boolean,
  noLegalDisputes: Boolean,
  accurateInformation: Boolean,
}, { _id: false });

// Main Property Schema
const PropertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: ['sale', 'rent', 'shortlet', 'joint-venture'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'pending-verification', 'active', 'sold', 'rented', 'suspended'],
      default: 'pending-verification',
      index: true,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    price: {
      type: priceSchema,
      required: true,
    },
    features: {
      type: featuresSchema,
      default: () => ({}),
    },
    amenities: {
      type: amenitiesSchema,
      default: () => ({
        securityFeatures: [],
        amenities: [],
        keyFeatures: [],
      }),
    },
    propertyDetails: Schema.Types.Mixed,
    images: {
      type: [imageSchema],
      default: [],
      validate: {
        validator: function(v: any[]) {
          return v && v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    documents: {
      type: [documentSchema],
      default: [],
    },
    contactInfo: {
      type: contactInfoSchema,
      required: true,
    },
    owner: {
      type: ownerInfoSchema,
      required: true,
    },
    agent: ownerInfoSchema,
    ownershipDeclaration: {
      type: ownershipDeclarationSchema,
      required: true,
    },
    sourcePreferenceId: {
      type: String,
      index: true,
    },
    preferenceType: {
      type: String,
      enum: ['buy', 'rent', 'joint-venture', 'shortlet', null],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationNotes: String,
    verifiedAt: Date,
    expiresAt: {
      type: Date,
      index: true,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimized queries
PropertySchema.index({ category: 1, status: 1 });
PropertySchema.index({ 'location.state': 1, category: 1 });
PropertySchema.index({ 'location.lga': 1, 'location.state': 1 });
PropertySchema.index({ verified: 1, status: 1 });
PropertySchema.index({ featured: 1, status: 1, createdAt: -1 });
PropertySchema.index({ 'price.amount': 1, category: 1 });
PropertySchema.index({ sourcePreferenceId: 1 });
PropertySchema.index({ createdAt: -1 });

// Text search index
PropertySchema.index({ title: 'text', description: 'text' });

// Export
export default mongoose.model<IProperty>('Property', PropertySchema);
export {
  IProperty,
  IPropertyContactInfo,
  IPropertyOwnerInfo,
  IPropertyLocation,
  IPropertyPrice,
  IPropertyFeatures,
  IPropertyAmenities,
  IBuyPropertyDetails,
  IRentPropertyDetails,
  IShortletPropertyDetails,
  IJointVenturePropertyDetails,
};
