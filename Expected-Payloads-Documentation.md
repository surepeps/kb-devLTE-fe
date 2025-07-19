# Expected Payloads Documentation for Property Types

This document outlines the expected payload structures for each property type in the post_property feature.

## Common Fields

All property types share these common fields:

```json
{
  "propertyType": "string", // One of: "Residential", "Commercial", "Land"
  "location": {
    "state": "string",
    "localGovernment": "string",
    "area": "string"
  },
  "price": "string", // Formatted currency string
  "owner": {
    "fullName": "string",
    "phoneNumber": "string",
    "email": "string"
  },
  "areYouTheOwner": "boolean",
  "ownershipDocuments": ["string"], // Array of document names
  "description": "string",
  "addtionalInfo": "string",
  "pictures": ["string"], // Array of image URLs
  "videos": ["string"], // Array of video URLs
  "briefType": "string" // One of: "Outright Sales", "Rent", "Shortlet", "Joint Venture"
}
```

## 1. Sell Property Payload

### For Residential/Commercial Properties

```json
{
  "propertyType": "Residential", // or "Commercial"
  "propertyCondition": "Brand New", // "Brand New", "Fairly Used", "Old", "Under Construction"
  "typeOfBuilding": "Duplex", // Varies by category
  "features": ["Swimming Pool", "Garden"], // Array of selected features
  "docOnProperty": [
    {
      "docName": "Certificate of Occupancy",
      "isProvided": true
    },
    {
      "docName": "Survey Plan",
      "isProvided": true
    }
  ],
  "location": {
    "state": "Lagos",
    "localGovernment": "Lekki",
    "area": "Victoria Island"
  },
  "price": "₦50,000,000",
  "owner": {
    "fullName": "John Doe",
    "phoneNumber": "+2348012345678",
    "email": "john@example.com"
  },
  "areYouTheOwner": true,
  "ownershipDocuments": [],
  "landSize": {
    "measurementType": "Plot", // "Plot", "Acres", "Square Meter"
    "size": "2"
  },
  "briefType": "Outright Sales",
  "additionalFeatures": {
    "noOfBedroom": "4",
    "noOfBathroom": "3",
    "noOfToilet": "4",
    "noOfCarPark": "2"
  },
  "description": "Beautiful duplex in prime location",
  "addtionalInfo": "Near shopping mall and schools",
  "pictures": ["https://res.cloudinary.com/..."],
  "videos": [],
  "isTenanted": "No" // "Yes" or "No"
}
```

### For Land Properties

```json
{
  "propertyType": "Land",
  "propertyCondition": null,
  "typeOfBuilding": null,
  "features": ["Fenced", "Accessible Road"], // Land-specific features
  "docOnProperty": [
    {
      "docName": "Certificate of Occupancy",
      "isProvided": true
    }
  ],
  "location": {
    "state": "Lagos",
    "localGovernment": "Ibeju-Lekki",
    "area": "Ajah"
  },
  "price": "₦15,000,000",
  "owner": {
    "fullName": "Jane Smith",
    "phoneNumber": "+2348087654321",
    "email": "jane@example.com"
  },
  "areYouTheOwner": true,
  "ownershipDocuments": [],
  "landSize": {
    "measurementType": "Plot",
    "size": "2"
  },
  "briefType": "Outright Sales",
  "additionalFeatures": {
    "noOfBedroom": "0",
    "noOfBathroom": "0",
    "noOfToilet": "0",
    "noOfCarPark": "0"
  },
  "description": "Prime land for development",
  "addtionalInfo": "Close to major highway",
  "pictures": ["https://res.cloudinary.com/..."],
  "videos": [],
  "isTenanted": "No"
}
```

## 2. Rent Property Payload

### For Residential Properties

```json
{
  "propertyType": "Residential",
  "propertyCondition": "Fairly Used",
  "typeOfBuilding": "Flat",
  "rentalType": "Rent", // or "Lease"
  "features": ["Air Conditioning", "Furnished"],
  "docOnProperty": [], // Not required for rent
  "location": {
    "state": "Lagos",
    "localGovernment": "Ikeja",
    "area": "Allen Avenue"
  },
  "price": "₦2,400,000", // Annual rent
  "leaseHold": "2 years", // Only if rentalType is "Lease"
  "owner": {
    "fullName": "Mike Johnson",
    "phoneNumber": "+2348098765432",
    "email": "mike@example.com"
  },
  "areYouTheOwner": true,
  "ownershipDocuments": [],
  "landSize": {
    "measurementType": null,
    "size": null
  },
  "briefType": "Rent",
  "additionalFeatures": {
    "noOfBedroom": "3",
    "noOfBathroom": "2",
    "noOfToilet": "2",
    "noOfCarPark": "1"
  },
  "tenantCriteria": ["Working Professional", "Family"], // Array of tenant preferences
  "description": "Spacious 3-bedroom flat",
  "addtionalInfo": "Quiet neighborhood",
  "pictures": ["https://res.cloudinary.com/..."],
  "videos": [],
  "isTenanted": "No" // "Yes" or "No"
}
```

## 3. Shortlet Property Payload

```json
{
  "propertyType": "Residential", // Always residential for shortlet
  "propertyCondition": "Brand New",
  "typeOfBuilding": "Apartment",
  "shortletDuration": "Daily", // "Daily", "Weekly", "Monthly"
  "features": ["WiFi", "Kitchen Utensils", "TV"],
  "docOnProperty": [], // Not required for shortlet
  "location": {
    "state": "Lagos",
    "localGovernment": "Eti-Osa",
    "area": "Lekki Phase 1"
  },
  "price": "₦25,000", // Per night/week/month based on duration
  "owner": {
    "fullName": "Sarah Williams",
    "phoneNumber": "+2348076543210",
    "email": "sarah@example.com"
  },
  "areYouTheOwner": true,
  "ownershipDocuments": [],
  "landSize": {
    "measurementType": null,
    "size": null
  },
  "briefType": "Shortlet",
  "additionalFeatures": {
    "noOfBedroom": "2",
    "noOfBathroom": "2",
    "noOfToilet": "2",
    "noOfCarPark": "1"
  },
  "shortletDetails": {
    "streetAddress": "123 Admiralty Way, Lekki Phase 1",
    "maxGuests": 4,
    "availability": {
      "minStay": 1 // Minimum nights
    },
    "pricing": {
      "nightly": 25000,
      "weeklyDiscount": 10 // Percentage
    },
    "houseRules": {
      "checkIn": "3:00 PM",
      "checkOut": "11:00 AM"
    }
  },
  "description": "Luxury 2-bedroom apartment",
  "addtionalInfo": "Beach view and pool access",
  "pictures": ["https://res.cloudinary.com/..."],
  "videos": [],
  "isTenanted": "No"
}
```

## 4. Joint Venture Property Payload

### For Residential/Commercial Properties

```json
{
  "propertyType": "Residential", // or "Commercial"
  "propertyCondition": "Under Construction",
  "typeOfBuilding": "Estate",
  "features": ["Security", "Power Supply"],
  "docOnProperty": [
    {
      "docName": "Survey Plan",
      "isProvided": true
    }
  ],
  "location": {
    "state": "Lagos",
    "localGovernment": "Ikorodu",
    "area": "Ikorodu Town"
  },
  "price": "₦100,000,000", // Project value
  "holdDuration": "5 years", // How long to hold the investment
  "owner": {
    "fullName": "David Brown",
    "phoneNumber": "+2348065432109",
    "email": "david@example.com"
  },
  "areYouTheOwner": true,
  "ownershipDocuments": [],
  "landSize": {
    "measurementType": "Acres",
    "size": "2.5"
  },
  "briefType": "Joint Venture",
  "additionalFeatures": {
    "noOfBedroom": "0", // For development projects
    "noOfBathroom": "0",
    "noOfToilet": "0",
    "noOfCarPark": "0"
  },
  "jvConditions": ["50/50 Profit Split", "Investor Provides Capital"], // Array of JV terms
  "description": "Prime development opportunity",
  "addtionalInfo": "High ROI potential",
  "pictures": ["https://res.cloudinary.com/..."],
  "videos": [],
  "isTenanted": "No"
}
```

### For Land JV Properties

```json
{
  "propertyType": "Land",
  "propertyCondition": null,
  "typeOfBuilding": null,
  "features": ["Strategic Location", "Development Potential"],
  "docOnProperty": [
    {
      "docName": "Certificate of Occupancy",
      "isProvided": true
    },
    {
      "docName": "Survey Plan",
      "isProvided": true
    }
  ],
  "location": {
    "state": "Ogun",
    "localGovernment": "Sagamu",
    "area": "Sagamu Town"
  },
  "price": "₦50,000,000",
  "holdDuration": "3 years",
  "owner": {
    "fullName": "Grace Adebayo",
    "phoneNumber": "+2348054321098",
    "email": "grace@example.com"
  },
  "areYouTheOwner": true,
  "ownershipDocuments": [],
  "landSize": {
    "measurementType": "Acres",
    "size": "5"
  },
  "briefType": "Joint Venture",
  "additionalFeatures": {
    "noOfBedroom": "0",
    "noOfBathroom": "0",
    "noOfToilet": "0",
    "noOfCarPark": "0"
  },
  "jvConditions": ["60/40 Profit Split", "Joint Development"],
  "description": "Large parcel for joint development",
  "addtionalInfo": "Near proposed government projects",
  "pictures": ["https://res.cloudinary.com/..."],
  "videos": [],
  "isTenanted": "No"
}
```

## Field Validation Rules

### Required Fields by Property Type

#### Sell Properties

- **All types**: `propertyCategory`, `state`, `lga`, `area`, `price`, `measurementType`, `landSize`, `documents` (min 1), `contactInfo` (all fields), `isLegalOwner`
- **Non-Land**: Add `propertyCondition`, `typeOfBuilding`, `bedrooms`

#### Rent Properties

- **All types**: `propertyCategory`, `rentalType`, `state`, `lga`, `area`, `price`, `contactInfo` (all fields), `isLegalOwner`
- **Non-Land**: Add `propertyCondition`, `typeOfBuilding`, `bedrooms`

#### Shortlet Properties

- **Required**: `propertyCategory` (always "Residential"), `shortletDuration`, `propertyCondition`, `typeOfBuilding`, `bedrooms`, `streetAddress`, `maxGuests`, `state`, `lga`, `area`, `price`, `contactInfo` (all fields), `isLegalOwner`
- **Shortlet-specific**: `availability.minStay`, `pricing.nightly`, `houseRules.checkIn`, `houseRules.checkOut`

#### Joint Venture Properties

- **All types**: `propertyCategory`, `holdDuration`, `measurementType`, `landSize`, `documents` (min 1), `jvConditions` (min 1), `state`, `lga`, `area`, `price`, `contactInfo` (all fields), `isLegalOwner`
- **Non-Land**: Add `propertyCondition`, `typeOfBuilding`, `bedrooms`

### Data Types

- **Numbers**: `bedrooms`, `bathrooms`, `toilets`, `parkingSpaces`, `maxGuests`, `availability.minStay`, `pricing.nightly`
- **Strings**: Most text fields, formatted currency for `price`
- **Arrays**: `features`, `documents`, `jvConditions`, `tenantCriteria`, `pictures`, `videos`, `ownershipDocuments`
- **Objects**: `location`, `owner`, `landSize`, `additionalFeatures`, plus shortlet-specific nested objects
- **Booleans**: `areYouTheOwner`, `isProvided` (in documents)

## API Endpoint

**POST** `/api/properties/list`

**Headers**:

- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Response Success (200)**:

```json
{
  "success": true,
  "owner": {
    "fullName": "Property Owner Name",
    "email": "owner@example.com"
  },
  "propertyId": "prop_123456",
  "message": "Property listed successfully"
}
```

**Response Error (400/500)**:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Notes

1. **Image/Video URLs**: These are uploaded to Cloudinary automatically during form submission and the URLs are included in the payload
2. **Price Formatting**: Always formatted as Nigerian Naira currency string (e.g., "₦2,400,000")
3. **Document Structure**: Uses `docOnProperty` array with objects containing `docName` and `isProvided` boolean
4. **Conditional Fields**: Many fields are conditional based on `propertyType` and `propertyCategory`
5. **Validation**: Client-side validation using Yup schemas, server-side validation should mirror these rules
