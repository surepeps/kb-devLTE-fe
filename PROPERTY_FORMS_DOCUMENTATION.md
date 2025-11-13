# Property Forms Documentation

## Table of Contents
1. [Overview](#overview)
2. [Preference Forms](#preference-forms)
3. [Property Listing Forms](#property-listing-forms)
4. [Common Form Fields](#common-form-fields)
5. [Validation Rules](#validation-rules)
6. [Feature Definitions](#feature-definitions)

---

## Overview

This document provides comprehensive details for all property type forms in the Khabiteq Realty platform. Forms are categorized into:

1. **Preference Forms** - For buyers/renters/investors to specify their property preferences
2. **Property Listing Forms** - For sellers/landlords/developers to list properties
3. **Shortlet Forms** - For booking short-term accommodations

Each form includes field specifications, validation rules, data types, and API payload structures.

---

## Preference Forms

Preference forms allow users to specify their property requirements. The platform supports 4 preference types.

### 1. Buy Preference Form

**Preference Type:** `buy`
**Preference Mode:** `buy`
**API Endpoint:** `/api/preferences`

#### Form Steps
1. **Location & Area** - Location selection
2. **Property Details & Budget** - Property specifications and budget range
3. **Features & Amenities** - Desired features (optional)
4. **Contact & Preferences** - Contact information and additional notes

#### Form Fields

##### Step 1: Location & Area
```typescript
location: {
  state: string;              // Required, e.g., "Lagos"
  lgas: string[];             // Required, Array of Local Government Areas, Max 3
  areas: string[];            // Optional, Array of areas within selected LGAs, Max 3 per LGA
  customLocation?: string;    // Optional, If area not found in system
}
```

**Validation:**
- `state` is required
- `lgas` must have at least 1 item, maximum 3 items
- `areas` maximum 3 areas per LGA
- At least one area or custom location must be provided

##### Step 2: Property Details & Budget

**Property Details (Sub-section)**
```typescript
propertyDetails: {
  propertyType: "Land" | "Residential" | "Commercial";  // Required
  buildingType?: "Detached" | "Semi-Detached" | "Block of Flats"; // Required for residential
  minBedrooms: number | "More";   // Required for residential, Min 1, Max 10 or "More"
  minBathrooms: number;           // Optional for residential
  propertyCondition: "New" | "Renovated" | "Any";  // Required for non-land
  purpose: "For living" | "Resale" | "Development";  // Required
  measurementUnit?: "plot" | "sqm" | "hectares";      // Required for land
  landSize?: number;                                  // Required for land
  documentTypes?: string[];                           // Optional
}
```

**Budget (Sub-section)**
```typescript
budget: {
  minPrice: number;           // Required, Minimum in NGN, must be >= location threshold
  maxPrice: number;           // Required, Maximum in NGN, must be > minPrice
  currency: "NGN";            // Fixed value
}
```

**Nearby Landmark**
```typescript
nearbyLandmark?: string;      // Optional, Landmark near property
```

**Validation:**
- For Land: `propertyType` required, `measurementUnit` required, `landSize` required
- For Residential: `buildingType` required, `minBedrooms` required, `propertyCondition` required
- For Commercial: `propertyCondition` required
- `minPrice` and `maxPrice` are required
- `minPrice` must be >= location minimum threshold
- `maxPrice` must be > `minPrice`
- Budget thresholds by location:
  - Lagos Buy: ₦5,000,000 minimum
  - Lagos Rent: ₦200,000 minimum
  - Abuja Buy: ₦8,000,000 minimum
  - Abuja Rent: ₦300,000 minimum

##### Step 3: Features & Amenities

```typescript
features: {
  basicFeatures: string[];    // Array of selected basic features
  premiumFeatures: string[];  // Array of selected premium features
  autoAdjustToBudget: boolean; // Auto-adjust features to budget
}
```

**Available Features for Buy Residential:**

**Basic Features:**
- Kitchenette, Security Cameras, Children Playground, Open Floor Plan, Walk-in Closet, WiFi, Library, Home Office, Bathtub, Garage, Staff Room, Pantry, Built-in Cupboards, Security Post, Access Gate, Air Conditioner, Wheelchair Friendly, Garden

**Premium Features:**
- Gym House, Swimming Pool, Outdoor Kitchen, Rooftops, In-house Cinema, Tennis Court, Elevator, Electric Fencing, Inverter, Sea View, Jacuzzi

**Available Features for Buy Commercial:**

**Basic Features:**
- Power Supply, Water Supply, Air Conditioning, Parking Space, Security, Internet (Wi-Fi), Reception Area, Elevator, Standby Generator

**Premium Features:**
- Central Cooling System, Fire Safety Equipment, Industrial Lift, CCTV Monitoring System, Conference Room, Fiber Optic Internet, Backup Solar/Inverter, Loading Dock, Smart Building Automation

##### Step 4: Contact & Preferences

```typescript
contactInfo: {
  fullName: string;         // Required, User's full name
  email: string;            // Required, Valid email format
  phoneNumber: string;      // Required, Valid phone number
}

additionalNotes?: string;   // Optional, Additional preferences or notes
```

**Validation:**
- `fullName` is required, must not be empty
- `email` is required, must be valid email format (pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
- `phoneNumber` is required

#### Example Buy Preference Payload

```json
{
  "preferenceType": "buy",
  "preferenceMode": "buy",
  "location": {
    "state": "Lagos",
    "localGovernmentAreas": ["Ikoyi", "Victoria Island"],
    "selectedAreas": ["Ikoyi", "Banana Island"]
  },
  "propertyDetails": {
    "propertyType": "Residential",
    "buildingType": "Detached",
    "minBedrooms": 4,
    "minBathrooms": 3,
    "propertyCondition": "New",
    "purpose": "For living",
    "documentTypes": ["Certificate of Occupancy", "Survey Document"]
  },
  "budget": {
    "minPrice": 250000000,
    "maxPrice": 500000000,
    "currency": "NGN"
  },
  "features": {
    "baseFeatures": ["Gym House", "Swimming Pool", "Security Cameras"],
    "premiumFeatures": ["Elevator", "Smart Building Automation"],
    "autoAdjustToFeatures": false
  },
  "contactInfo": {
    "fullName": "Adebayo Akanji",
    "email": "adebayo@example.com",
    "phoneNumber": "+2348012345678"
  },
  "nearbyLandmark": "Close to Lekki Mall",
  "additionalNotes": "Need property close to good schools"
}
```

---

### 2. Rent Preference Form

**Preference Type:** `rent`
**Preference Mode:** `tenant`
**API Endpoint:** `/api/preferences`

#### Form Steps
1. **Location & Area** - Location selection
2. **Property Details & Budget** - Property specifications and budget range
3. **Features & Amenities** - Desired features (optional)
4. **Contact & Preferences** - Contact information and additional notes

#### Form Fields

##### Step 1: Location & Area
Same as Buy Preference Form

##### Step 2: Property Details & Budget

**Property Details (Sub-section)**
```typescript
propertyDetails: {
  propertyType: "Self-con" | "Flat" | "Mini Flat" | "Bungalow";  // Required
  minBedrooms: number | "More";   // Required, Min 1, Max 10 or "More"
  minBathrooms?: number;          // Optional
  leaseTerm: "6 Months" | "1 Year";  // Required
  propertyCondition: "New" | "Renovated";  // Required
  purpose: "Residential" | "Office";  // Required
}
```

**Budget (Sub-section)**
Same as Buy Preference Form

**Validation:**
- `propertyType` is required
- `minBedrooms` is required, min 1
- `leaseTerm` is required
- `propertyCondition` is required
- `purpose` is required
- Budget validation same as Buy form
- Rent budget thresholds:
  - Lagos: ₦200,000 minimum
  - Abuja: ₦300,000 minimum
  - Default: ₦100,000 minimum

##### Step 3: Features & Amenities

**Available Features for Rent Residential:**

**Basic Features:**
- Kitchenette, Security Cameras, Children Playground, Open Floor Plan, Walk-in Closet, WiFi, Library, Home Office, Bathtub, Garage, Staff Room, Pantry, Built-in Cupboards, Security Post, Access Gate, Air Conditioner, Wheelchair Friendly, Garden

**Premium Features:**
- Gym House, Swimming Pool, Outdoor Kitchen, Rooftops, In-house Cinema, Tennis Court, Elevator, Electric Fencing, Inverter, Sea View, Jacuzzi

##### Step 4: Contact & Preferences

Same as Buy Preference Form

#### Example Rent Preference Payload

```json
{
  "preferenceType": "rent",
  "preferenceMode": "tenant",
  "location": {
    "state": "Lagos",
    "localGovernmentAreas": ["Yaba", "Surulere"],
    "selectedAreas": ["Yaba", "Onipanu"]
  },
  "propertyDetails": {
    "propertyType": "Flat",
    "minBedrooms": 3,
    "minBathrooms": 2,
    "leaseTerm": "1 Year",
    "propertyCondition": "New",
    "purpose": "Residential"
  },
  "budget": {
    "minPrice": 500000,
    "maxPrice": 1200000,
    "currency": "NGN"
  },
  "features": {
    "baseFeatures": ["Security Cameras", "WiFi", "Air Conditioner"],
    "premiumFeatures": ["Gym House"],
    "autoAdjustToFeatures": false
  },
  "contactInfo": {
    "fullName": "Chioma Okafor",
    "email": "chioma@example.com",
    "phoneNumber": "+2348098765432"
  },
  "additionalNotes": "Prefer gated estate with good security"
}
```

---

### 3. Joint Venture Preference Form

**Preference Type:** `joint-venture`
**Preference Mode:** `developer`
**API Endpoint:** `/api/preferences`

#### Form Steps
1. **Developer Information** - Company and contact details
2. **Development Type** - Type of development interested
3. **Land Requirements** - Land specifications and location
4. **JV Terms & Proposal** - Joint venture terms
5. **Title & Documentation** - Document requirements

#### Form Fields

##### Step 1: Developer Information

```typescript
contactInfo: {
  companyName: string;           // Required
  contactPerson: string;         // Required
  email: string;                 // Required, Valid email format
  phoneNumber: string;           // Required
  cacRegistrationNumber?: string; // Optional, Company CAC registration
}
```

**Validation:**
- `companyName` is required
- `contactPerson` is required
- `email` is required, valid format
- `phoneNumber` is required

##### Step 2: Development Type

```typescript
developmentDetails: {
  developmentTypes: string[];     // Required, Array of development types interested in
}
```

**Available Development Types:**
- Mini Flats
- Luxury Duplexes
- Mixed Development
- Commercial Complex
- Residential Estate

##### Step 3: Land Requirements

```typescript
location: {
  state: string;              // Required
  lgas: string[];             // Required, Min 1, Max 3
  areas: string[];            // Optional, Max 3 per LGA
  customLocation?: string;    // Optional
}

developmentDetails: {
  minLandSize: string;           // Required
  measurementUnit: "plot" | "sqm" | "hectares";  // Required
  propertyType: "Land" | "Old Building" | "Structure to demolish";  // Required
  landConditions?: string[];     // Optional
}
```

**Available Land Conditions:**
- Proof of Funds
- Premium
- Installment Payment

**Budget (Sub-section)**
```typescript
budget: {
  minPrice: number;           // Required for JV
  maxPrice: number;           // Required for JV
  currency: "NGN";
}
```

**Validation:**
- `state` is required
- `lgas` must have at least 1, max 3
- `minLandSize` is required
- `measurementUnit` is required
- `propertyType` is required
- Budget thresholds:
  - Lagos JV: ₦10,000,000 minimum
  - Abuja JV: ₦15,000,000 minimum
  - Default: ₦5,000,000 minimum

##### Step 4: JV Terms & Proposal

```typescript
developmentDetails: {
  jvType: "Equity Split" | "Lease-to-Build" | "Development Partner";  // Required
  preferredSharingRatio: string;  // Required, e.g., "60-40" or "70-30"
  timeline: "Ready Now" | "In 3 Months" | "Within 1 Year";  // Required
}

partnerExpectations?: string;   // Optional
```

**Validation:**
- `jvType` is required
- `preferredSharingRatio` is required
- `timeline` is required

##### Step 5: Title & Documentation

```typescript
developmentDetails: {
  minimumTitleRequirements: string[];  // Required, Array of document types
}
```

**Available Document Types:**
- Certificate of Occupancy
- Survey Document
- Deed of Assignment
- Deed of Ownership
- Deed of Conveyance
- Governor's Consent
- Land Certificate
- Gazette
- Excision
- Family Receipt
- Contract of Sale

#### Features & Amenities

**Available Features for Joint Venture Residential:**

**Basic Features:**
- Kitchenette, Security Cameras, Children Playground, Open Floor Plan, Walk-in Closet, WiFi, Library, Home Office, Bathtub, Garage, Staff Room, Pantry, Built-in Cupboards, Security Post, Access Gate, Air Conditioner, Wheelchair Friendly, Garden

**Premium Features:**
- Gym House, Swimming Pool, Outdoor Kitchen, Rooftops, In-house Cinema, Tennis Court, Elevator, Electric Fencing, Inverter, Sea View, Jacuzzi

#### Example Joint Venture Preference Payload

```json
{
  "preferenceType": "joint-venture",
  "preferenceMode": "developer",
  "location": {
    "state": "Lagos",
    "localGovernmentAreas": ["Ibeju-Lekki"],
    "selectedAreas": ["Ibeju-Lekki"]
  },
  "developmentDetails": {
    "developmentTypes": ["Luxury Duplexes", "Mini Flats"],
    "minLandSize": "50",
    "measurementUnit": "plot",
    "propertyType": "Land",
    "landConditions": ["Proof of Funds"],
    "jvType": "Equity Split",
    "preferredSharingRatio": "60-40",
    "timeline": "Within 1 Year",
    "minimumTitleRequirements": ["Certificate of Occupancy", "Survey Document"]
  },
  "budget": {
    "minPrice": 500000000,
    "maxPrice": 2000000000,
    "currency": "NGN"
  },
  "features": {
    "baseFeatures": ["Security Cameras", "Access Gate"],
    "premiumFeatures": ["Swimming Pool"],
    "autoAdjustToFeatures": false
  },
  "contactInfo": {
    "companyName": "Build Developers Ltd",
    "contactPerson": "John Adekunle",
    "email": "john@build-dev.com",
    "phoneNumber": "+2349012345678",
    "cacRegistrationNumber": "RC1234567"
  },
  "partnerExpectations": "Looking for verified land owners with clear titles in Lekki axis"
}
```

---

### 4. Shortlet Preference Form

**Preference Type:** `shortlet`
**Preference Mode:** `shortlet`
**API Endpoint:** `/api/preferences`

#### Form Steps
1. **Location & Area** - Location selection
2. **Property Details & Booking Details** - Property specs and booking dates
3. **Features & Amenities** - Desired features (optional)
4. **Contact & Preferences** - Contact information

#### Form Fields

##### Step 1: Location & Area
Same as Buy Preference Form

##### Step 2: Property Details & Booking

**Property Details (Sub-section)**
```typescript
bookingDetails: {
  propertyType: "Studio" | "1-Bed Apartment" | "2-Bed Flat";  // Required
  minBedrooms: number | "More";   // Required, Min 1
  numberOfGuests: number;         // Required, Min 1
  checkInDate: string;            // Required, ISO 8601 format (YYYY-MM-DD)
  checkOutDate: string;           // Required, ISO 8601 format (YYYY-MM-DD)
}
```

**Budget (Sub-section)**
```typescript
budget: {
  minPrice: number;           // Per night in NGN
  maxPrice: number;           // Per night in NGN
  currency: "NGN";
}
```

**Validation:**
- `propertyType` is required
- `minBedrooms` is required
- `numberOfGuests` is required, min 1
- `checkInDate` is required, must be valid date
- `checkOutDate` is required, must be valid date
- `checkOutDate` must be after `checkInDate`
- Budget thresholds:
  - Lagos Shortlet: ₦15,000 per night minimum
  - Abuja Shortlet: ₦25,000 per night minimum
  - Default: ₦10,000 per night minimum

##### Step 3: Features & Amenities

**Available Features for Shortlet:**

**Basic Features:**
- Wi-Fi, Air Conditioning, Power Supply, Security, Parking, Clean Water, Kitchen, Clean Bathroom

**Comfort Features:**
- Laundry, Smart TV / Netflix, Balcony, Housekeeping, Breakfast Included, Private Entrance, POP Ceiling, Access Gate

**Premium Features:**
- Gym Access, Swimming Pool, Inverter / Solar Backup, Rooftop Lounge, Jacuzzi, Sea View, Pet-Friendly, Outdoor Kitchen, Smart Lock, Close to Major Attractions

##### Step 4: Contact & Preferences

```typescript
contactInfo: {
  fullName: string;         // Required
  email: string;            // Required, Valid email format
  phoneNumber: string;      // Required
}

additionalNotes?: string;   // Optional
```

#### Example Shortlet Preference Payload

```json
{
  "preferenceType": "shortlet",
  "preferenceMode": "shortlet",
  "location": {
    "state": "Lagos",
    "localGovernmentAreas": ["Ikoyi"],
    "selectedAreas": ["Ikoyi"]
  },
  "bookingDetails": {
    "propertyType": "1-Bed Apartment",
    "minBedrooms": 1,
    "numberOfGuests": 2,
    "checkInDate": "2024-03-15",
    "checkOutDate": "2024-03-22"
  },
  "budget": {
    "minPrice": 50000,
    "maxPrice": 150000,
    "currency": "NGN"
  },
  "features": {
    "baseFeatures": ["Wi-Fi", "Air Conditioning", "Kitchen"],
    "premiumFeatures": ["Smart TV / Netflix", "Pet-Friendly"],
    "autoAdjustToFeatures": false
  },
  "contactInfo": {
    "fullName": "Tunde Williams",
    "email": "tunde@example.com",
    "phoneNumber": "+2347012345678"
  },
  "additionalNotes": "Prefer apartments with kitchen and good WiFi for remote work"
}
```

---

## Property Listing Forms

Property listing forms allow sellers/landlords/developers to list properties for sale, rent, joint venture, or shortlet.

### 1. Outright Sales (Buy) Property Form

**Category:** `sale` / `outright_sales`
**API Endpoint:** `/api/properties` or `/api/properties/brief`

#### Form Structure

**Step 1: Basic Details**
```typescript
{
  title: string;                          // Required, Property title/name
  description: string;                    // Required, Detailed description
  propertyType: "Land" | "Residential" | "Commercial";  // Required
  propertyCondition: "New" | "Renovated" | "Old";       // Required for non-land
}
```

**Step 2: Property Details**
```typescript
{
  buildingType?: "Detached" | "Semi-Detached" | "Block of Flats";  // For residential
  bedrooms?: number;                      // For residential, Min 0
  bathrooms?: number;                     // For residential, Min 0
  toilets?: number;                       // Optional
  parkingSpaces?: number;                 // Optional
  landSize?: string;                      // Required for land
  measurementUnit?: "plot" | "sqm" | "hectares";  // Required for land
  buildingSize?: string;                  // Optional
  furnished?: boolean;                    // Default false
  serviced?: boolean;                     // Default false
}
```

**Step 3: Location**
```typescript
{
  state: string;                          // Required
  lga: string;                            // Required
  area: string;                           // Required
  detailedAddress?: string;               // Optional, Street address
}
```

**Step 4: Pricing**
```typescript
{
  price: number;                          // Required, in NGN
  currency: "NGN";                        // Fixed
  negotiable: boolean;                    // Default false
  paymentPlans?: string[];                // Optional array of payment plan types
}
```

**Step 5: Features & Amenities**
```typescript
{
  securityFeatures?: string[];            // Array of security features
  amenities?: string[];                   // Array of amenities
  keyFeatures?: string[];                 // Array of key features
}
```

**Step 6: Documents**
```typescript
{
  documentTypes?: string[];               // Array of document type names
}
```

**Available Document Types:**
- Certificate of Occupancy (C of O)
- Survey Document
- Receipt
- Governor's Consent
- Contract of Sale
- Gazette
- Excision
- Deed of Assignment
- Land Certificate
- Deed of Ownership
- Registered Deed of Conveyance

**Step 7: Images**
```typescript
{
  images: File[];                         // Required, Min 1 image
}
```

**Step 8: Contact Information**
```typescript
{
  contactInfo: {
    name: string;                         // Required
    email: string;                        // Required, Valid email
    phone: string;                        // Required
    whatsapp?: string;                    // Optional
    preferredContactMethod: "email" | "phone" | "whatsapp";  // Required
    contactTimes?: string[];              // Optional
  }
}
```

**Step 9: Ownership Declaration**
```typescript
{
  ownershipDeclaration: {
    isOwner: boolean;                     // Required
    hasRightToSell: boolean;              // Required
    noLegalDisputes: boolean;             // Required
    accurateInformation: boolean;         // Required
  }
}
```

#### Example Outright Sales Property Payload

```json
{
  "title": "Luxury 4-Bedroom Detached House in Ikoyi",
  "description": "Well-maintained luxury detached house with modern amenities in prime Ikoyi location",
  "propertyType": "Residential",
  "propertySubtype": "residential",
  "buildingType": "Detached",
  "propertyCondition": "New",
  "bedrooms": 4,
  "bathrooms": 3,
  "toilets": 1,
  "parkingSpaces": 2,
  "furnished": true,
  "serviced": true,
  "location": {
    "state": "Lagos",
    "lga": "Ikoyi",
    "area": "Ikoyi",
    "detailedAddress": "12 Banana Island Road, Ikoyi"
  },
  "price": 350000000,
  "currency": "NGN",
  "negotiable": true,
  "paymentPlans": ["Full Payment", "Installment Payment"],
  "features": {
    "securityFeatures": ["CCTV", "Security Post", "Electric Fencing"],
    "amenities": ["Gym", "Swimming Pool", "Garden"],
    "keyFeatures": ["Elevator", "Home Office", "Staff Room"]
  },
  "documentTypes": ["Certificate of Occupancy", "Survey Document"],
  "contactInfo": {
    "name": "Adebayo Akanji",
    "email": "adebayo@example.com",
    "phone": "+2348012345678",
    "whatsapp": "+2348012345678",
    "preferredContactMethod": "whatsapp",
    "contactTimes": ["9:00 AM - 5:00 PM"]
  },
  "ownershipDeclaration": {
    "isOwner": true,
    "hasRightToSell": true,
    "noLegalDisputes": true,
    "accurateInformation": true
  }
}
```

---

### 2. Rent Property Form

**Category:** `rent`
**API Endpoint:** `/api/properties` or `/api/properties/brief`

#### Form Structure

**Step 1: Basic Details**
```typescript
{
  title: string;                          // Required
  description: string;                    // Required
  propertyType: "Self-con" | "Flat" | "Mini Flat" | "Bungalow";  // Required
  propertyCondition: "New" | "Good Condition" | "Renovation";    // Required
}
```

**Step 2: Property Details**
```typescript
{
  bedrooms: number;                       // Required, Min 0
  bathrooms: number;                      // Required, Min 0
  toilets?: number;                       // Optional
  parkingSpaces?: number;                 // Optional
  buildingSize?: string;                  // Optional
  furnished?: boolean;                    // Default false
  serviced?: boolean;                     // Default false
  employmentType?: string;                // Optional, e.g., "Employed", "Self-employed", "Student"
}
```

**Step 3: Location**
```typescript
{
  state: string;                          // Required
  lga: string;                            // Required
  area: string;                           // Required
  detailedAddress?: string;               // Optional
}
```

**Step 4: Pricing**
```typescript
{
  price: number;                          // Required, Monthly rental in NGN
  currency: "NGN";                        // Fixed
  negotiable: boolean;                    // Default false
  paymentPlans?: string[];                // Optional
}
```

**Step 5: Features & Amenities**
```typescript
{
  securityFeatures?: string[];            // Array of security features
  amenities?: string[];                   // Array of amenities
  keyFeatures?: string[];                 // Array of key features
}
```

**Step 6: Images**
```typescript
{
  images: File[];                         // Required, Min 1 image
}
```

**Step 7: Contact Information**
```typescript
{
  contactInfo: {
    name: string;                         // Required
    email: string;                        // Required
    phone: string;                        // Required
    whatsapp?: string;                    // Optional
    preferredContactMethod: "email" | "phone" | "whatsapp";
    contactTimes?: string[];              // Optional
  }
}
```

**Step 8: Ownership Declaration**
```typescript
{
  ownershipDeclaration: {
    isOwner: boolean;                     // Required
    hasRightToSell: boolean;              // For rent, right to let
    noLegalDisputes: boolean;             // Required
    accurateInformation: boolean;         // Required
  }
}
```

#### Example Rent Property Payload

```json
{
  "title": "Spacious 3-Bedroom Flat in Yaba",
  "description": "Well-maintained 3-bedroom flat with excellent security in peaceful Yaba community",
  "propertyType": "Flat",
  "propertySubtype": "residential",
  "propertyCondition": "New",
  "bedrooms": 3,
  "bathrooms": 2,
  "toilets": 1,
  "parkingSpaces": 1,
  "furnished": false,
  "serviced": true,
  "employmentType": "Employed",
  "location": {
    "state": "Lagos",
    "lga": "Yaba",
    "area": "Yaba",
    "detailedAddress": "45 Ajayi Street, Yaba"
  },
  "price": 750000,
  "currency": "NGN",
  "negotiable": false,
  "features": {
    "securityFeatures": ["CCTV Cameras", "Security Gate"],
    "amenities": ["Water Supply", "Power Supply"],
    "keyFeatures": ["Kitchen", "Balcony"]
  },
  "contactInfo": {
    "name": "Tunde Williams",
    "email": "tunde@example.com",
    "phone": "+2347012345678",
    "preferredContactMethod": "phone",
    "contactTimes": ["10:00 AM - 6:00 PM"]
  },
  "ownershipDeclaration": {
    "isOwner": true,
    "hasRightToSell": true,
    "noLegalDisputes": true,
    "accurateInformation": true
  }
}
```

---

### 3. Joint Venture Property Form

**Category:** `joint-venture`
**API Endpoint:** `/api/properties` or `/api/properties/brief`

#### Form Structure

**Step 1: Basic Details**
```typescript
{
  title: string;                          // Required
  description: string;                    // Required
  propertyType: "Land" | "Old Building" | "Structure to demolish";  // Required
  propertyCondition: "New" | "Renovated" | "Uncompleted";  // Required for buildings
}
```

**Step 2: Property Details**
```typescript
{
  landSize: string;                       // Required for land
  measurementUnit: "plot" | "sqm" | "hectares";  // Required for land
  bedrooms?: number;                      // Optional, for buildings
  bathrooms?: number;                     // Optional, for buildings
  buildingSize?: string;                  // Optional, for buildings
}
```

**Step 3: Location**
```typescript
{
  state: string;                          // Required
  lga: string;                            // Required
  area: string;                           // Required
  detailedAddress?: string;               // Optional
}
```

**Step 4: Pricing & Terms**
```typescript
{
  price: number;                          // Optional for JV, value/asking price
  currency: "NGN";                        // Fixed
  negotiable: boolean;                    // Default true for JV
}
```

**Step 5: Documents**
```typescript
{
  documentTypes?: string[];               // Array of available documents
}
```

**Step 6: Images**
```typescript
{
  images: File[];                         // Required, Min 1 image
}
```

**Step 7: Contact Information**
```typescript
{
  contactInfo: {
    name: string;                         // Required
    email: string;                        // Required
    phone: string;                        // Required
    whatsapp?: string;                    // Optional
    preferredContactMethod: "email" | "phone" | "whatsapp";
    contactTimes?: string[];              // Optional
  }
}
```

**Step 8: Ownership Declaration**
```typescript
{
  ownershipDeclaration: {
    isOwner: boolean;                     // Required
    hasRightToSell: boolean;              // Required
    noLegalDisputes: boolean;             // Required
    accurateInformation: boolean;         // Required
  }
}
```

#### Example Joint Venture Property Payload

```json
{
  "title": "Prime Land in Ibeju-Lekki for Development",
  "description": "50-plot prime land in Ibeju-Lekki suitable for residential or mixed-use development with clear title",
  "propertyType": "Land",
  "propertySubtype": "land",
  "landSize": "50",
  "measurementUnit": "plot",
  "location": {
    "state": "Lagos",
    "lga": "Ibeju-Lekki",
    "area": "Ibeju-Lekki",
    "detailedAddress": "Coastal Road, Ibeju-Lekki"
  },
  "price": 750000000,
  "currency": "NGN",
  "negotiable": true,
  "documentTypes": ["Certificate of Occupancy", "Survey Document", "Deed of Ownership"],
  "contactInfo": {
    "name": "Chioma Okafor",
    "email": "chioma@example.com",
    "phone": "+2348098765432",
    "preferredContactMethod": "email"
  },
  "ownershipDeclaration": {
    "isOwner": true,
    "hasRightToSell": true,
    "noLegalDisputes": true,
    "accurateInformation": true
  }
}
```

---

### 4. Shortlet Property Form

**Category:** `shortlet`
**API Endpoint:** `/api/properties` or `/api/properties/shortlet`

#### Form Structure

**Step 1: Basic Details**
```typescript
{
  title: string;                          // Required, e.g., "Cozy Studio in Lekki"
  description: string;                    // Required, Detailed description
  propertyType: "Studio" | "1-Bed Apartment" | "2-Bed Flat" | "3-Bed Apartment";  // Required
  propertyCondition: "New" | "Renovated" | "Good Condition";  // Required
}
```

**Step 2: Property Details**
```typescript
{
  bedrooms: number;                       // Required, 0 for studio
  bathrooms: number;                      // Required, Min 1
  toilets?: number;                       // Optional
  parkingSpaces?: number;                 // Optional
  buildingSize?: string;                  // Optional
  furnished?: boolean;                    // Usually true for shortlet
  serviced?: boolean;                     // Usually true for shortlet
  maxGuests: number;                      // Required, maximum guests allowed
  travelType?: string;                    // Optional, e.g., "Business", "Leisure", "Family"
}
```

**Step 3: Location**
```typescript
{
  state: string;                          // Required
  lga: string;                            // Required
  area: string;                           // Required
  detailedAddress?: string;               // Optional
}
```

**Step 4: Pricing**
```typescript
{
  price: number;                          // Required, per night in NGN
  currency: "NGN";                        // Fixed
  negotiable: boolean;                    // Optional
  weeklyRate?: number;                    // Optional, discounted weekly rate
  monthlyRate?: number;                   // Optional, discounted monthly rate
}
```

**Step 5: Features & Amenities**
```typescript
{
  securityFeatures?: string[];            // Array of security features
  amenities?: string[];                   // Array of amenities
  keyFeatures?: string[];                 // Array of key features
}
```

**Recommended Shortlet Features:**
- **Basic:** WiFi, Air Conditioning, Kitchen, Bathroom, Power Supply, Water Supply
- **Comfort:** Smart TV, Laundry Service, Housekeeping, Breakfast, Private Entrance
- **Premium:** Pool Access, Gym, Rooftop Lounge, Pet-Friendly, Smart Lock

**Step 6: House Rules & Policies**
```typescript
{
  checkInTime?: string;                   // e.g., "2:00 PM"
  checkOutTime?: string;                  // e.g., "10:00 AM"
  minimumStayDays?: number;               // Minimum stay in days
  cancellationPolicy?: string;            // Cancellation policy description
  housePolicies?: string[];               // Array of house rules
}
```

**Step 7: Images**
```typescript
{
  images: File[];                         // Required, Min 3 images
}
```

**Step 8: Contact Information**
```typescript
{
  contactInfo: {
    name: string;                         // Required
    email: string;                        // Required
    phone: string;                        // Required
    whatsapp?: string;                    // Optional, but recommended
    preferredContactMethod: "email" | "phone" | "whatsapp";
    contactTimes?: string[];              // Optional
  }
}
```

**Step 9: Ownership Declaration**
```typescript
{
  ownershipDeclaration: {
    isOwner: boolean;                     // Required
    hasRightToSell: boolean;              // For shortlet, right to lease
    noLegalDisputes: boolean;             // Required
    accurateInformation: boolean;         // Required
  }
}
```

#### Example Shortlet Property Payload

```json
{
  "title": "Luxury 2-Bedroom Apartment in Lekki",
  "description": "Fully furnished and serviced 2-bedroom apartment with stunning city views, perfect for business travelers and families",
  "propertyType": "2-Bed Apartment",
  "propertySubtype": "shortlet",
  "propertyCondition": "New",
  "bedrooms": 2,
  "bathrooms": 2,
  "toilets": 2,
  "parkingSpaces": 1,
  "furnished": true,
  "serviced": true,
  "maxGuests": 4,
  "travelType": "Business",
  "location": {
    "state": "Lagos",
    "lga": "Lekki",
    "area": "Lekki Phase 1",
    "detailedAddress": "Block A, 123 Lekki Road"
  },
  "price": 100000,
  "currency": "NGN",
  "negotiable": true,
  "weeklyRate": 650000,
  "monthlyRate": 2500000,
  "features": {
    "securityFeatures": ["24/7 Security", "CCTV", "Electric Gate"],
    "amenities": ["WiFi", "Air Conditioning", "Kitchen", "Washer/Dryer"],
    "keyFeatures": ["Smart TV", "Balcony", "Generator"]
  },
  "housePolicies": [
    "No smoking indoors",
    "Quiet hours after 10 PM",
    "Maximum 4 guests",
    "No pets allowed"
  ],
  "checkInTime": "3:00 PM",
  "checkOutTime": "10:00 AM",
  "minimumStayDays": 2,
  "cancellationPolicy": "Free cancellation up to 7 days before arrival",
  "contactInfo": {
    "name": "Amirah Hassan",
    "email": "amirah@example.com",
    "phone": "+2349123456789",
    "whatsapp": "+2349123456789",
    "preferredContactMethod": "whatsapp",
    "contactTimes": ["9:00 AM - 9:00 PM"]
  },
  "ownershipDeclaration": {
    "isOwner": true,
    "hasRightToSell": true,
    "noLegalDisputes": true,
    "accurateInformation": true
  }
}
```

---

## Common Form Fields

### Location Fields

**State Selection**
- Type: `string` (dropdown/select)
- Required: `true`
- Example: "Lagos", "Abuja", "Rivers", etc.

**Local Government Area (LGA)**
- Type: `string[]` (multi-select)
- Required: `true`
- Max Items: `3`
- Dependent on State selection

**Area/District**
- Type: `string[]` (multi-select)
- Required: `true` (unless custom location provided)
- Max Items: `3` per LGA
- Dependent on LGA selection

**Custom Location**
- Type: `string` (text input)
- Required: `false`
- Used when area not found in system
- Max Length: `200` characters

**Detailed Address**
- Type: `string` (text input)
- Required: `false`
- Additional address details
- Max Length: `500` characters

### Price Fields

**Minimum Price / Starting Price**
- Type: `number`
- Required: `true`
- Min Value: `0`
- Unit: Nigerian Naira (NGN)
- For rent/shortlet: per month/night
- For sales: total price

**Maximum Price / Maximum Budget**
- Type: `number`
- Required: `true`
- Min Value: > minimum price
- Unit: Nigerian Naira (NGN)

**Currency**
- Type: `string` (fixed select)
- Value: `"NGN"`
- Required: `true`

**Negotiable**
- Type: `boolean`
- Default: `false`
- Indicates if price can be negotiated

### Contact Fields

**Full Name / Contact Person**
- Type: `string` (text input)
- Required: `true`
- Max Length: `100` characters
- Pattern: Must not be empty or whitespace

**Email Address**
- Type: `string` (email input)
- Required: `true`
- Pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- Max Length: `255` characters

**Phone Number**
- Type: `string` (tel input)
- Required: `true`
- Pattern: Valid Nigerian phone number
- Example: `+2348012345678`, `08012345678`

**WhatsApp Number**
- Type: `string` (tel input)
- Required: `false`
- Same format as phone number

**Preferred Contact Method**
- Type: `string` (select)
- Options: `["email", "phone", "whatsapp"]`
- Required: `true`

### Feature/Amenity Fields

**Features Array**
- Type: `string[]` (multi-select or checkbox group)
- Required: `false`
- Each item is a feature name
- Variations by property type

**Security Features**
- Type: `string[]`
- Examples: "CCTV", "Security Gate", "Guard House", "Electric Fencing"

**Amenities**
- Type: `string[]`
- Examples: "Swimming Pool", "Gym", "Garden", "Parking"

### Document Fields

**Document Types**
- Type: `string[]` (multi-select)
- Required: `false` (true for buy/JV)
- Available types for buy/rent:
  - Certificate of Occupancy (C of O)
  - Survey Document
  - Receipt
  - Governor's Consent
  - Contract of Sale
  - Gazette
  - Excision
  - Deed of Assignment
  - Land Certificate
  - Deed of Ownership
  - Registered Deed of Conveyance

### Image/Media Fields

**Images**
- Type: `File[]` (file upload)
- Required: `true`
- Min Items: `1`
- Max Items: `20`
- Supported Formats: `jpg`, `jpeg`, `png`, `webp`
- Max File Size: `10 MB` per image

**Document Files**
- Type: `File` (file upload)
- Required: `false`
- Supported Formats: `pdf`, `jpg`, `jpeg`, `png`
- Max File Size: `5 MB` per document

---

## Validation Rules

### Global Validation Rules

#### Text Fields
- Minimum Length: `1` character (required fields)
- Maximum Length: `500-1000` characters depending on field
- Trimmed: Whitespace trimmed
- No HTML tags allowed

#### Number Fields
- Type: `number` (integer for counts, decimal for prices)
- Minimum: `0` or field-specific minimum
- Maximum: Field-specific maximum
- Non-negative: All numbers must be >= 0

#### Email Validation
- Pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- TLD must have at least 2 characters
- No spaces allowed

#### Phone Validation
- Format: Valid Nigerian phone number
- Accepted formats:
  - `+2347xxxxxxxxxx` (11 digits with +234 country code)
  - `07xxxxxxxxxx` (11 digits starting with 0)
  - `2347xxxxxxxxxx` (13 digits)

#### Date Validation
- Format: ISO 8601 (`YYYY-MM-DD`)
- Check-out date must be >= Check-in date
- Must be valid date (not Feb 30, etc.)
- For past dates: May be required or restricted based on property type

### Property Type Specific Validation

#### Buy Property
- `propertyType` is required
- For `Land`: `measurementUnit` and `landSize` required
- For `Residential/Commercial`: `buildingType` and `propertyCondition` required
- `bedrooms` required for residential (min: 1)
- At least one document type recommended

#### Rent Property
- `propertyType` is required
- `bedrooms` required (min: 0 for studios if available)
- `bathrooms` required (min: 1)
- `leaseTerm` required
- `propertyCondition` required
- `purpose` required

#### Joint Venture Property
- `propertyType` required
- For `Land`: `measurementUnit` and `landSize` required
- At least one development type selected
- At least one JV term specified
- Document types recommended

#### Shortlet Property
- `propertyType` required
- `maxGuests` required (min: 1)
- `checkInDate` and `checkOutDate` required
- `checkOutDate` > `checkInDate`
- Minimum stay days optional but recommended
- At least 3 images required

### Ownership Declaration Validation

All fields must be `true`:
- `isOwner`: Property owner declaration
- `hasRightToSell` (or `hasRightToLet`): Authorization to sell/rent
- `noLegalDisputes`: No legal issues declaration
- `accurateInformation`: Information accuracy declaration

If any field is `false`, form submission is blocked.

### Budget Validation Rules

**Minimum Budget Thresholds by Location & Type:**

**Buy Properties:**
- Lagos: ₦5,000,000
- Abuja: ₦8,000,000
- Default: ₦2,000,000

**Rent Properties:**
- Lagos: ₦200,000
- Abuja: ₦300,000
- Default: ₦100,000

**Joint Venture:**
- Lagos: ₦10,000,000
- Abuja: ₦15,000,000
- Default: ₦5,000,000

**Shortlet (per night):**
- Lagos: ₦15,000
- Abuja: ₦25,000
- Default: ₦10,000

---

## Feature Definitions

### Feature Categories

#### Basic Features
Generally affordable and common amenities available at lower budgets.

#### Premium Features
Higher-end amenities that command premium pricing.

#### Comfort Features (Shortlet only)
Convenience features for short-term stays.

### Buy Residential Features

**Basic (18 features):**
Kitchenette, Security Cameras, Children Playground, Open Floor Plan, Walk-in Closet, WiFi, Library, Home Office, Bathtub, Garage, Staff Room, Pantry, Built-in Cupboards, Security Post, Access Gate, Air Conditioner, Wheelchair Friendly, Garden

**Premium (11 features):**
Gym House, Swimming Pool, Outdoor Kitchen, Rooftops, In-house Cinema, Tennis Court, Elevator, Electric Fencing, Inverter, Sea View, Jacuzzi

### Buy Commercial Features

**Basic (9 features):**
Power Supply, Water Supply, Air Conditioning, Parking Space, Security, Internet (Wi-Fi), Reception Area, Elevator, Standby Generator

**Premium (9 features):**
Central Cooling System, Fire Safety Equipment, Industrial Lift, CCTV Monitoring System, Conference Room, Fiber Optic Internet, Backup Solar/Inverter, Loading Dock, Smart Building Automation

### Rent Residential Features

**Basic:** Same as Buy Residential
**Premium:** Same as Buy Residential

### Rent Commercial Features

**Basic:** Same as Buy Commercial
**Premium:** Same as Buy Commercial

### Joint Venture Features

**Residential:** Same as Buy Residential (with same basic/premium split)
**Commercial:** Same as Buy Commercial (with same basic/premium split)

### Shortlet Features

**Basic (8 features):**
Wi-Fi, Air Conditioning, Power Supply, Security, Parking, Clean Water, Kitchen, Clean Bathroom

**Comfort (8 features):**
Laundry, Smart TV / Netflix, Balcony, Housekeeping, Breakfast Included, Private Entrance, POP Ceiling, Access Gate

**Premium (10 features):**
Gym Access, Swimming Pool, Inverter / Solar Backup, Rooftop Lounge, Jacuzzi, Sea View, Pet-Friendly, Outdoor Kitchen, Smart Lock, Close to Major Attractions

---

## API Response Examples

### Successful Preference Form Submission

```json
{
  "success": true,
  "message": "Preference submitted successfully",
  "data": {
    "preferenceId": "pref_1234567890",
    "userId": "user_1234567890",
    "preferenceType": "buy",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "matchedPropertiesCount": 5
  }
}
```

### Successful Property Listing Submission

```json
{
  "success": true,
  "message": "Property listed successfully",
  "data": {
    "propertyId": "prop_1234567890",
    "title": "Luxury 4-Bedroom Detached House in Ikoyi",
    "category": "sale",
    "status": "pending-verification",
    "createdAt": "2024-01-15T10:30:00Z",
    "listingFee": 5000,
    "estimatedDuration": "30 days"
  }
}
```

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "budget.minPrice",
      "message": "₦5,000,000 is the minimum required for this location"
    },
    {
      "field": "contactInfo.email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

---

## Form Submission Workflow

### Preference Form Submission Flow

1. **User selects preference type** (Buy/Rent/JV/Shortlet)
2. **Multi-step form rendered** with appropriate steps
3. **User completes each step** with validation on step change
4. **Final validation** before submission
5. **API request** to `/api/preferences` with payload
6. **Success notification** and redirect to preferences dashboard
7. **Matched properties** displayed if available

### Property Listing Submission Flow

1. **User selects listing category** (Sale/Rent/JV/Shortlet)
2. **Multi-step form rendered** (typically 8-9 steps)
3. **User uploads images** (minimum 1-3 required)
4. **User fills contact information** and ownership declaration
5. **Preview step** showing complete listing details
6. **Final validation** of all required fields
7. **API request** to `/api/properties` with full payload
8. **Payment or fee calculation** (if applicable)
9. **Listing goes to verification** status
10. **Success notification** and listing dashboard redirect

---

## Notes for Developers

1. **Field Ordering:** Always follow the specified field order in forms for better UX
2. **Validation Timing:** Validate on step change, not on every keystroke
3. **Budget Thresholds:** Always validate against location-based thresholds
4. **Feature Display:** Show available features based on selected preference type
5. **Document Support:** Upload documents as separate files, not embedded
6. **Image Processing:** Resize and compress images before upload
7. **Phone Validation:** Accept multiple phone formats (with/without country code)
8. **Email Confirmation:** Optional: Send verification email after preference/listing creation
9. **Contact Methods:** Respect preferred contact method when reaching out
10. **Data Persistence:** Save form progress locally during multi-step process

---

## Related Documentation

- API Payload Documentation: See `API_PAYLOAD_DOCUMENTATION.md`
- Preference Form Context: `src/context/preference-form-context.tsx`
- Preference Form Types: `src/types/preference-form.ts`
- Post-Property Types: `src/types/post-property.types.ts`
- Property Types: `src/types/property.types.ts`

---

**Last Updated:** January 2024
**Version:** 1.0
