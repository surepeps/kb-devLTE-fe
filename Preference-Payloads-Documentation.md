# Preference Payloads Documentation

This document outlines the complete payload structures for each preference type in the preference form feature, including all possible conditions and field variations.

## API Endpoint
`POST /buyers/submit-preference`

## Common Base Structure

All preference payloads share these common fields:

```json
{
  "preferenceType": "buy|rent|joint-venture|shortlet",
  "preferenceMode": "buy|tenant|developer|shortlet",
  "location": {
    "state": "string",
    "localGovernmentAreas": ["string"],
    "lgasWithAreas": [
      {
        "lgaName": "string",
        "areas": ["string"]
      }
    ],
    "customLocation": "string (optional)"
  },
  "budget": {
    "minPrice": 0,
    "maxPrice": 0,
    "currency": "NGN"
  },
  "features": {
    "baseFeatures": ["string"],
    "premiumFeatures": ["string"],
    "autoAdjustToFeatures": false
  }
}
```

---

## 1. BUY PREFERENCE PAYLOAD

### Complete Payload Structure

```json
{
  "preferenceType": "buy",
  "preferenceMode": "buy",
  "location": {
    "state": "Lagos",
    "localGovernmentAreas": ["Ikeja", "Victoria Island"],
    "lgasWithAreas": [
      {
        "lgaName": "Ikeja",
        "areas": ["Allen Avenue", "Ogba", "Omole"]
      },
      {
        "lgaName": "Victoria Island",
        "areas": ["Oniru", "Lekki Phase 1"]
      }
    ],
    "customLocation": "Near National Theatre"
  },
  "budget": {
    "minPrice": 5000000,
    "maxPrice": 50000000,
    "currency": "NGN"
  },
  "propertyDetails": {
    "propertyType": "residential|commercial|land",
    "buildingType": "bungalow|duplex-fully-detached|duplex-semi-detached|block-of-flats|terrace|mini-flat|self-con|boys-quarters|mansion|penthouse|townhouse|warehouse|office-space|shop|plaza|hotel|event-center|factory|filling-station|hospital|school|church|mosque",
    "minBedrooms": "1|2|3|4|5|6|More",
    "minBathrooms": 1,
    "propertyCondition": "new|renovated|old",
    "purpose": "For living|Resale|Development",
    "landSize": "500",
    "measurementUnit": "plot|sqm|hectares",
    "documentTypes": [
      "deed-of-assignment",
      "deed-of-ownership", 
      "deed-of-conveyance",
      "survey-plan",
      "governors-consent",
      "certificate-of-occupancy",
      "family-receipt",
      "contract-of-sale",
      "land-certificate",
      "gazette",
      "excision"
    ],
    "landConditions": [
      "fenced",
      "gated",
      "corner-piece",
      "waterfront",
      "elevated",
      "flat-terrain",
      "sloped",
      "rocky",
      "sandy-soil",
      "firm-soil"
    ]
  },
  "features": {
    "baseFeatures": [
      "parking-space",
      "security",
      "water-supply",
      "electricity",
      "good-road-access",
      "drainage-system"
    ],
    "premiumFeatures": [
      "swimming-pool",
      "gym",
      "garden",
      "solar-panels",
      "cctv",
      "intercom-system",
      "elevator",
      "generator",
      "air-conditioning",
      "fitted-kitchen",
      "wardrobes",
      "tiles",
      "pop-ceiling",
      "balcony"
    ],
    "autoAdjustToFeatures": false
  },
  "contactInfo": {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+2348012345678"
  },
  "nearbyLandmark": "Close to Shoprite Mall",
  "additionalNotes": "Looking for a property with good resale value"
}
```

### Property Type Conditions for Buy:

#### Residential Building Types:
- bungalow
- duplex-fully-detached  
- duplex-semi-detached
- block-of-flats
- terrace
- mini-flat
- self-con
- boys-quarters
- mansion
- penthouse
- townhouse

#### Commercial Building Types:
- warehouse
- office-space
- shop
- plaza
- hotel
- event-center
- factory
- filling-station
- hospital
- school
- church
- mosque

#### Land (No building type required)

#### Property Conditions:
- **Residential**: new, renovated, old
- **Commercial**: new, renovated, old

---

## 2. RENT PREFERENCE PAYLOAD

### Complete Payload Structure

```json
{
  "preferenceType": "rent",
  "preferenceMode": "tenant",
  "location": {
    "state": "Lagos",
    "localGovernmentAreas": ["Ikeja", "Surulere"],
    "lgasWithAreas": [
      {
        "lgaName": "Ikeja",
        "areas": ["Allen Avenue", "Ogba"]
      }
    ],
    "customLocation": ""
  },
  "budget": {
    "minPrice": 500000,
    "maxPrice": 2000000,
    "currency": "NGN"
  },
  "propertyDetails": {
    "propertyType": "residential|commercial",
    "buildingType": "self-con|mini-flat|1-bedroom-flat|2-bedroom-flat|3-bedroom-flat|4-bedroom-flat|duplex|bungalow|warehouse|office-space|shop|plaza",
    "minBedrooms": "1|2|3|4|5|More",
    "minBathrooms": 1,
    "leaseTerm": "6 Months|1 Year|2 Years|3 Years",
    "propertyCondition": "new|good-condition|renovation",
    "purpose": "Residential|Office|Commercial",
    "landSize": "300",
    "measurementUnit": "plot|sqm|hectares",
    "documentTypes": [
      "tenancy-agreement",
      "receipt-of-payment",
      "landlord-consent"
    ],
    "landConditions": [
      "fenced",
      "gated",
      "corner-piece"
    ]
  },
  "features": {
    "baseFeatures": [
      "parking-space",
      "security",
      "water-supply", 
      "electricity",
      "good-road-access"
    ],
    "premiumFeatures": [
      "swimming-pool",
      "gym",
      "garden",
      "cctv",
      "generator",
      "air-conditioning",
      "fitted-kitchen"
    ],
    "autoAdjustToFeatures": false
  },
  "contactInfo": {
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com", 
    "phoneNumber": "+2348087654321"
  },
  "nearbyLandmark": "Near Maryland Mall",
  "additionalNotes": "Looking for a quiet neighborhood"
}
```

### Property Type Conditions for Rent:

#### Residential Building Types:
- self-con
- mini-flat
- 1-bedroom-flat
- 2-bedroom-flat
- 3-bedroom-flat
- 4-bedroom-flat
- duplex
- bungalow

#### Commercial Building Types:
- warehouse
- office-space
- shop
- plaza

#### Property Conditions:
- **Residential**: new, good-condition, renovation
- **Commercial**: new, good-condition, renovation

#### Lease Terms:
- 6 Months
- 1 Year  
- 2 Years
- 3 Years

---

## 3. JOINT VENTURE PREFERENCE PAYLOAD

### Complete Payload Structure

```json
{
  "preferenceType": "joint-venture",
  "preferenceMode": "developer", 
  "location": {
    "state": "Lagos",
    "localGovernmentAreas": ["Lekki", "Ajah"],
    "lgasWithAreas": [
      {
        "lgaName": "Lekki",
        "areas": ["Lekki Phase 1", "Lekki Phase 2"]
      }
    ],
    "customLocation": ""
  },
  "budget": {
    "minPrice": 10000000,
    "maxPrice": 100000000,
    "currency": "NGN"
  },
  "developmentDetails": {
    "minLandSize": "1000",
    "measurementUnit": "plot|sqm|hectares",
    "jvType": "Equity Split|Lease-to-Build|Development Partner|Land-for-Equity|Revenue Share",
    "propertyType": "land|old-building|structure-to-demolish",
    "expectedStructureType": "mini-flats|luxury-duplexes|commercial-complex|mixed-development|residential-estate|office-complex|shopping-mall|hotel-resort",
    "timeline": "Ready Now|In 3 Months|Within 6 Months|Within 1 Year|1-2 Years|2+ Years",
    "budgetRange": "50000000",
    "documentTypes": [
      "deed-of-assignment",
      "survey-plan", 
      "governors-consent",
      "certificate-of-occupancy",
      "building-approval"
    ],
    "landConditions": [
      "fenced",
      "gated",
      "corner-piece",
      "waterfront",
      "elevated",
      "flat-terrain",
      "good-soil-condition"
    ],
    "buildingType": "residential-complex|commercial-complex|mixed-use|industrial",
    "propertyCondition": "new|renovated|uncompleted|to-demolish",
    "minBedrooms": "2",
    "minBathrooms": 2,
    "purpose": "Development|Investment|Partnership"
  },
  "features": {
    "baseFeatures": [
      "good-road-access",
      "electricity-available",
      "water-supply",
      "drainage-system",
      "security"
    ],
    "premiumFeatures": [
      "strategic-location",
      "high-appreciation-potential",
      "commercial-viability",
      "proximity-to-amenities",
      "future-development-plans"
    ],
    "autoAdjustToFeatures": false
  },
  "contactInfo": {
    "companyName": "ABC Development Limited",
    "contactPerson": "Michael Johnson",
    "email": "michael@abcdev.com",
    "phoneNumber": "+2348012345678",
    "cacRegistrationNumber": "RC123456"
  },
  "partnerExpectations": "Looking for a reliable partner with proven track record in real estate development",
  "nearbyLandmark": "Close to Lekki-Epe Expressway",
  "additionalNotes": "Interested in high-rise developments with modern amenities"
}
```

### Joint Venture Specific Conditions:

#### JV Types:
- Equity Split
- Lease-to-Build
- Development Partner
- Land-for-Equity
- Revenue Share

#### Property Types:
- land
- old-building
- structure-to-demolish

#### Expected Structure Types:
- mini-flats
- luxury-duplexes
- commercial-complex
- mixed-development
- residential-estate
- office-complex
- shopping-mall
- hotel-resort

#### Timelines:
- Ready Now
- In 3 Months
- Within 6 Months
- Within 1 Year
- 1-2 Years
- 2+ Years

#### Property Conditions:
- new
- renovated
- uncompleted
- to-demolish

---

## 4. SHORTLET PREFERENCE PAYLOAD

### Complete Payload Structure

```json
{
  "preferenceType": "shortlet",
  "preferenceMode": "shortlet",
  "location": {
    "state": "Lagos",
    "localGovernmentAreas": ["Victoria Island", "Ikoyi"],
    "lgasWithAreas": [
      {
        "lgaName": "Victoria Island",
        "areas": ["Oniru", "Tiamiyu Savage"]
      }
    ],
    "customLocation": ""
  },
  "budget": {
    "minPrice": 15000,
    "maxPrice": 100000,
    "currency": "NGN"
  },
  "bookingDetails": {
    "propertyType": "residential",
    "buildingType": "studio|1-bedroom-apartment|2-bedroom-flat|3-bedroom-flat|duplex|penthouse|villa|serviced-apartment",
    "minBedrooms": "1|2|3|4|More",
    "minBathrooms": 1,
    "numberOfGuests": 2,
    "checkInDate": "2024-03-15",
    "checkOutDate": "2024-03-20",
    "travelType": "business|leisure|vacation|family-visit|medical|education|relocation",
    "preferredCheckInTime": "14:00",
    "preferredCheckOutTime": "11:00",
    "propertyCondition": "new|good-condition|luxury",
    "purpose": "Business Trip|Vacation|Family Visit|Medical|Education|Relocation",
    "landSize": "",
    "measurementUnit": "",
    "documentTypes": [],
    "landConditions": []
  },
  "features": {
    "baseFeatures": [
      "wifi",
      "air-conditioning",
      "kitchen",
      "parking-space",
      "security",
      "24-7-electricity"
    ],
    "premiumFeatures": [
      "swimming-pool",
      "gym",
      "concierge",
      "housekeeping",
      "laundry-service",
      "netflix",
      "workspace",
      "balcony-view",
      "elevator",
      "generator-backup"
    ],
    "autoAdjustToFeatures": false
  },
  "contactInfo": {
    "fullName": "Sarah Wilson",
    "email": "sarah.wilson@example.com",
    "phoneNumber": "+2348098765432",
    "petsAllowed": false,
    "smokingAllowed": false,
    "partiesAllowed": false,
    "additionalRequests": "Need baby cot and high chair",
    "maxBudgetPerNight": 25000,
    "willingToPayExtra": true,
    "cleaningFeeBudget": 5000,
    "securityDepositBudget": 50000,
    "cancellationPolicy": "flexible|moderate|strict",
    "preferredCheckInTime": "14:00",
    "preferredCheckOutTime": "11:00"
  },
  "nearbyLandmark": "Near Eko Hotel",
  "additionalNotes": "Looking for family-friendly accommodation with baby facilities"
}
```

### Shortlet Specific Conditions:

#### Building Types:
- studio
- 1-bedroom-apartment
- 2-bedroom-flat
- 3-bedroom-flat
- duplex
- penthouse
- villa
- serviced-apartment

#### Travel Types:
- business
- leisure
- vacation
- family-visit
- medical
- education
- relocation

#### Property Conditions:
- new
- good-condition
- luxury

#### Cancellation Policies:
- flexible
- moderate
- strict

#### Check-in/Check-out Times:
- 08:00 to 22:00 (in 1-hour increments)

---

## Common Features Available Across All Preference Types

### Base Features:
- parking-space
- security
- water-supply
- electricity
- good-road-access
- drainage-system
- fenced
- gated
- borehole
- generator
- wifi (for shortlet)
- 24-7-electricity (for shortlet)

### Premium Features:
- swimming-pool
- gym
- garden
- solar-panels
- cctv
- intercom-system
- elevator
- air-conditioning
- fitted-kitchen
- wardrobes
- tiles
- pop-ceiling
- balcony
- concierge (for shortlet)
- housekeeping (for shortlet)
- laundry-service (for shortlet)

### Document Types by Preference:

#### Buy/Joint Venture:
- deed-of-assignment
- deed-of-ownership
- deed-of-conveyance
- survey-plan
- governors-consent
- certificate-of-occupancy
- family-receipt
- contract-of-sale
- land-certificate
- gazette
- excision

#### Rent:
- tenancy-agreement
- receipt-of-payment
- landlord-consent

#### Shortlet:
- Not applicable (no documents required)

---

## API Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Preference submitted successfully",
  "data": {
    "preferenceId": "pref_12345",
    "status": "active",
    "createdAt": "2024-03-15T10:30:00Z"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "budget.minPrice",
      "message": "Minimum price is required"
    }
  ]
}
```

---

## Validation Rules

### Required Fields by Preference Type:

#### All Types:
- preferenceType
- preferenceMode
- location.state
- location.localGovernmentAreas (at least 1)
- budget.minPrice
- budget.maxPrice
- contactInfo.fullName
- contactInfo.email
- contactInfo.phoneNumber

#### Buy Specific:
- propertyDetails.propertyType
- propertyDetails.purpose

#### Rent Specific:
- propertyDetails.propertyType
- propertyDetails.leaseTerm
- propertyDetails.purpose

#### Joint Venture Specific:
- developmentDetails.minLandSize
- developmentDetails.jvType
- developmentDetails.propertyType
- developmentDetails.expectedStructureType
- developmentDetails.timeline
- contactInfo.companyName
- contactInfo.contactPerson

#### Shortlet Specific:
- bookingDetails.propertyType
- bookingDetails.numberOfGuests
- bookingDetails.checkInDate
- bookingDetails.checkOutDate
- bookingDetails.travelType

### Conditional Requirements:
- If `propertyType` is not "land", then `buildingType` is required
- If `propertyType` is "land", then `landSize` and `measurementUnit` are required
- For shortlet: if `willingToPayExtra` is true, then budget fields for extra services are required
- For joint venture: if `jvType` is "Equity Split", then `budgetRange` is required

---

## Notes

1. All prices are in Nigerian Naira (NGN)
2. Phone numbers should be in international format (+234...)
3. Dates should be in ISO format (YYYY-MM-DD)
4. Email addresses must be valid
5. Arrays can be empty but should not contain null/undefined values
6. All string fields are trimmed and validated for length
7. Feature arrays are filtered to remove empty strings
8. Location areas are limited to 3 per LGA for optimal matching
