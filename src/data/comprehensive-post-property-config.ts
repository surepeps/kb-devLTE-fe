/** @format */

// Comprehensive Post Property Form Configuration
// Implements exact field names and conditions as specified in requirements

export const BRIEF_TYPES = {
  SELL: "sell",
  RENT: "rent",
  JV: "jv",
  SHORTLET: "shortlet",
} as const;

export const PROPERTY_CATEGORIES = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  LAND: "Land",
  MIXED_DEVELOPMENT: "Mixed Development",
} as const;

// Brief Type Configurations
export const briefTypeConfig = {
  [BRIEF_TYPES.SELL]: {
    label: "Sell Property (Outright Sale)",
    description: "I want to sell my property for an outright sale",
    icon: "🏡",
    propertyCategories: [
      PROPERTY_CATEGORIES.RESIDENTIAL,
      PROPERTY_CATEGORIES.COMMERCIAL,
      PROPERTY_CATEGORIES.LAND,
    ],
    commission: {
      landowner: 10,
      agent: 50, // 50% of agent's commission
    },
  },
  [BRIEF_TYPES.RENT]: {
    label: "Rent",
    description: "I want to rent out my property to tenants",
    icon: "🔑",
    propertyCategories: [
      PROPERTY_CATEGORIES.RESIDENTIAL,
      PROPERTY_CATEGORIES.COMMERCIAL,
      PROPERTY_CATEGORIES.LAND,
    ],
    commission: {
      landowner: 10,
      agent: 0, // No commission deducted by Khabiteq
    },
  },
  [BRIEF_TYPES.JV]: {
    label: "Joint Venture (JV)",
    description: "I want to partner with investors for development",
    icon: "🤝",
    propertyCategories: [
      PROPERTY_CATEGORIES.RESIDENTIAL,
      PROPERTY_CATEGORIES.COMMERCIAL,
      PROPERTY_CATEGORIES.LAND,
      PROPERTY_CATEGORIES.MIXED_DEVELOPMENT,
    ],
    commission: {
      landowner: 10,
      agent: 50,
    },
  },
  [BRIEF_TYPES.SHORTLET]: {
    label: "Shortlet",
    description: "I want to list my property for short-term rental",
    icon: "📅",
    propertyCategories: [PROPERTY_CATEGORIES.RESIDENTIAL],
    commission: {
      landowner: 5,
      agent: 50,
    },
  },
};

// Property Condition Options
export const propertyConditionOptions = [
  { value: "New", label: "New" },
  { value: "Good Condition", label: "Good Condition" },
];

// Building Type Options - Updated to match specifications
export const buildingTypeOptions = {
  residential: [
    { value: "Bungalow", label: "Bungalow" },
    { value: "Duplex", label: "Duplex" },
    { value: "Detached", label: "Detached" },
    { value: "Semi-Detached", label: "Semi-Detached" },
    { value: "Block of Flats", label: "Block of Flats" },
    { value: "Penthouse", label: "Penthouse" },
    { value: "Terrace", label: "Terrace" },
  ],
  commercial: [
    { value: "Offices", label: "Offices" },
    { value: "Studio", label: "Studio" },
    { value: "Retail Space", label: "Retail Space" },
    { value: "Showroom", label: "Showroom" },
    { value: "Warehouse", label: "Warehouse" },
    { value: "Shopping Complex", label: "Shopping Complex" },
  ],
  shortlet: [
    { value: "Apartment", label: "Apartment" },
    { value: "Duplex", label: "Duplex" },
    { value: "Studio", label: "Studio" },
    { value: "Bungalow", label: "Bungalow" },
    { value: "Penthouse", label: "Penthouse" },
  ],
};

// Document Types - Exact list from specifications
export const documentOptions = [
  { value: "Deed of Assignment", label: "Deed of Assignment" },
  { value: "Deed of Ownership", label: "Deed of Ownership" },
  { value: "Deed of Conveyance", label: "Deed of Conveyance" },
  { value: "Survey Plan", label: "Survey Plan" },
  { value: "Governor's Consent", label: "Governor's Consent" },
  { value: "Certificate of Occupancy", label: "Certificate of Occupancy" },
  { value: "Family Receipt", label: "Family Receipt" },
  { value: "Contract of Sale", label: "Contract of Sale" },
  { value: "Land Certificate", label: "Land Certificate" },
  { value: "Gazette", label: "Gazette" },
  { value: "Excision", label: "Excision" },
];

// Features & Amenities for Residential Properties - Exact list from specifications
export const residentialFeatures = [
  { value: "Gym", label: "Gym" },
  { value: "Kitchenette", label: "Kitchenette" },
  { value: "Security Cameras", label: "Security Cameras" },
  { value: "Swimming Pool", label: "Swimming Pool" },
  { value: "Children's Playground", label: "Children's Playground" },
  { value: "Rooftop Access", label: "Rooftop Access" },
  { value: "Walk-In Closet", label: "Walk-In Closet" },
  { value: "WiFi", label: "WiFi" },
  { value: "Library", label: "Library" },
  { value: "Home Office", label: "Home Office" },
  { value: "Cinema Room", label: "Cinema Room" },
  { value: "Bathtub", label: "Bathtub" },
  { value: "Tennis Court", label: "Tennis Court" },
  { value: "Garage", label: "Garage" },
  { value: "Elevator", label: "Elevator" },
  { value: "Staff Room", label: "Staff Room" },
  { value: "Pantry", label: "Pantry" },
  { value: "Electric Fencing", label: "Electric Fencing" },
  { value: "Inverter", label: "Inverter" },
  { value: "Built-In Cupboards", label: "Built-In Cupboards" },
  { value: "Security Post", label: "Security Post" },
  { value: "Access Gate", label: "Access Gate" },
  { value: "Sea View", label: "Sea View" },
  { value: "Air Conditioning", label: "Air Conditioning" },
  { value: "Wheelchair Accessible", label: "Wheelchair Accessible" },
  { value: "Garden", label: "Garden" },
  { value: "Jacuzzi", label: "Jacuzzi" },
  { value: "Open Floor Plan", label: "Open Floor Plan" },
];

// Features for Land Properties - Exact list from specifications
export const landFeatures = [
  { value: "Perimeter Fence", label: "Perimeter Fence" },
  { value: "Electricity Nearby", label: "Electricity Nearby" },
  { value: "Drainage System In Place", label: "Drainage System In Place" },
  { value: "Water Supply Available", label: "Water Supply Available" },
  { value: "Security Post or Nearby", label: "Security Post or Nearby" },
  {
    value: "Estate Land (Within a Gated Estate)",
    label: "Estate Land (Within a Gated Estate)",
  },
  { value: "Developed Neighborhood", label: "Developed Neighborhood" },
  { value: "Developing Neighborhood", label: "Developing Neighborhood" },
  { value: "High Foot Traffic Area", label: "High Foot Traffic Area" },
  {
    value: "Close to Major Landmark / Expressway",
    label: "Close to Major Landmark / Expressway",
  },
];

// Commercial Property Features - Organized by categories as in specifications
export const commercialFeatures = {
  structure: [
    { value: "Open Floor Plan", label: "Open Floor Plan" },
    { value: "Private Offices", label: "Private Offices" },
    {
      value: "Conference / Meeting Rooms",
      label: "Conference / Meeting Rooms",
    },
    { value: "Reception Area", label: "Reception Area" },
    { value: "Partitioned Spaces", label: "Partitioned Spaces" },
    { value: "Elevator / Lift Access", label: "Elevator / Lift Access" },
    { value: "Wheelchair Accessible", label: "Wheelchair Accessible" },
  ],
  utilities: [
    {
      value: "Industrial Power Connection",
      label: "Industrial Power Connection",
    },
    { value: "Prepaid Electricity Meter", label: "Prepaid Electricity Meter" },
    {
      value: "Borehole / Constant Water Supply",
      label: "Borehole / Constant Water Supply",
    },
    { value: "Air Conditioning", label: "Air Conditioning" },
  ],
  security: [
    { value: "Security Personnel Onsite", label: "Security Personnel Onsite" },
    { value: "Gated Compound", label: "Gated Compound" },
    { value: "CCTV Surveillance", label: "CCTV Surveillance" },
    {
      value: "Access Control / Smart Locks",
      label: "Access Control / Smart Locks",
    },
    {
      value: "Fire Safety Equipment (Alarms, Extinguishers)",
      label: "Fire Safety Equipment (Alarms, Extinguishers)",
    },
  ],
  parking: [
    { value: "Dedicated Parking Spaces", label: "Dedicated Parking Spaces" },
    { value: "Visitor Parking", label: "Visitor Parking" },
    { value: "Modern Glass Facade", label: "Modern Glass Facade" },
    { value: "Signage / Branding Space", label: "Signage / Branding Space" },
    { value: "Rooftop / Terrace Area", label: "Rooftop / Terrace Area" },
    {
      value: "Located in Central Business District (CBD)",
      label: "Located in Central Business District (CBD)",
    },
  ],
};

// Rental Conditions - Updated to match exact specifications
export const rentalConditions = [
  { value: "No Pets Allowed", label: "No Pets Allowed" },
  { value: "Must Provide Credit Report", label: "Must Provide Credit Report" },
  {
    value: "Tenant Responsible for Basic Maintenance",
    label: "Tenant Responsible for Basic Maintenance",
  },
];

// Employment Types - Exact list from specifications
export const employmentTypes = [
  { value: "Employee", label: "Employee" },
  { value: "Self Employed", label: "Self Employed" },
  { value: "Corporate Tenant", label: "Corporate Tenant" },
  { value: "Individual Tenant", label: "Individual Tenant" },
];

// Tenant Gender Preferences - Exact list from specifications
export const tenantGenderPreferences = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Both", label: "Both" },
];

// JV Conditions - Exact list from specifications
export const jvConditions = [
  { value: "Proof of Fund", label: "Proof of Fund" },
  { value: "Premium", label: "Premium" },
  { value: "Installment Plan", label: "Installment Plan" },
  { value: "None", label: "None" },
];

// Tenancy Status Options - Updated to match specifications exactly
export const tenancyStatusOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "I live in it", label: "I live in it" },
];

// Shortlet Specific Options - Comprehensive list from specifications
export const shortletOptions = {
  propertyTypes: [
    { value: "Apartment", label: "Apartment" },
    { value: "Duplex", label: "Duplex" },
    { value: "Studio", label: "Studio" },
    { value: "Bungalow", label: "Bungalow" },
    { value: "Penthouse", label: "Penthouse" },
  ],
  cancellationPolicies: [
    {
      value: "Flexible",
      label: "Flexible – Full refund 1 day before check-in",
    },
    {
      value: "Moderate",
      label: "Moderate – Full refund 5 days before check-in",
    },
    {
      value: "Strict",
      label: "Strict – 50% refund up to 7 days before check-in",
    },
  ],
  amenities: {
    general: [
      { value: "Air Conditioning", label: "Air Conditioning" },
      { value: "Wi-Fi", label: "Wi-Fi" },
      { value: "Smart TV", label: "Smart TV" },
      { value: "DSTV", label: "DSTV" },
      { value: "King Bed", label: "King Bed" },
      { value: "Balcony", label: "Balcony" },
      { value: "Work Desk", label: "Work Desk" },
      { value: "Inverter", label: "Inverter" },
    ],
    kitchen: [
      { value: "Gas Cooker", label: "Gas Cooker" },
      { value: "Refrigerator", label: "Refrigerator" },
      { value: "Microwave", label: "Microwave" },
      { value: "Coffee Maker", label: "Coffee Maker" },
      { value: "Kitchen Utensils", label: "Kitchen Utensils" },
    ],
    bathroom: [
      { value: "Ensuite", label: "Ensuite" },
      { value: "Bathtub", label: "Bathtub" },
      { value: "Water Heater", label: "Water Heater" },
      { value: "Hair Dryer", label: "Hair Dryer" },
      { value: "Towels", label: "Towels" },
      { value: "Toiletries", label: "Toiletries" },
    ],
    leisure: [
      { value: "Pool", label: "Pool" },
      { value: "Gym", label: "Gym" },
      { value: "Rooftop View", label: "Rooftop View" },
      { value: "Lounge Area", label: "Lounge Area" },
    ],
    transport: [
      { value: "Free Parking", label: "Free Parking" },
      { value: "Paid Parking", label: "Paid Parking" },
      { value: "Car Hire", label: "Car Hire" },
      { value: "Shuttle", label: "Shuttle" },
      { value: "Elevator", label: "Elevator" },
    ],
    laundry: [
      { value: "Washing Machine", label: "Washing Machine" },
      { value: "Dryer", label: "Dryer" },
      { value: "Ironing", label: "Ironing" },
    ],
    security: [
      { value: "24/7 Security", label: "24/7 Security" },
      { value: "CCTV", label: "CCTV" },
      { value: "Gated Estate", label: "Gated Estate" },
      { value: "Fire Extinguisher", label: "Fire Extinguisher" },
      { value: "Smoke Detector", label: "Smoke Detector" },
    ],
    family: [
      { value: "Baby Cot", label: "Baby Cot" },
      { value: "Kids Playground", label: "Kids Playground" },
      { value: "High Chair", label: "High Chair" },
    ],
    accessibility: [
      { value: "Wheelchair Access", label: "Wheelchair Access" },
      { value: "Step-Free Entry", label: "Step-Free Entry" },
    ],
    location: [
      { value: "Sea View", label: "Sea View" },
      { value: "Close to Mall", label: "Close to Mall" },
      { value: "Airport Proximity", label: "Airport Proximity" },
      { value: "Quiet Area", label: "Quiet Area" },
    ],
  },
};

// Payment methods for shortlet
export const paymentMethods = [
  { value: "Bank Transfer (NGN)", label: "Bank Transfer (NGN)" },
  { value: "MTN Momo", label: "MTN Momo" },
  { value: "Opay", label: "Opay" },
  { value: "Other Mobile Money", label: "Other Mobile Money" },
];

// Number options (for bedrooms, bathrooms, etc.)
export const numberOptions = Array.from({ length: 21 }, (_, i) => ({
  value: i.toString(),
  label: i.toString(),
}));

// Helper function to get features based on property category and brief type
export const getFeaturesByCategory = (category: string, briefType: string) => {
  switch (category) {
    case PROPERTY_CATEGORIES.RESIDENTIAL:
      if (briefType === BRIEF_TYPES.SHORTLET) {
        // Flatten all shortlet amenities
        return [
          ...shortletOptions.amenities.general,
          ...shortletOptions.amenities.kitchen,
          ...shortletOptions.amenities.bathroom,
          ...shortletOptions.amenities.leisure,
          ...shortletOptions.amenities.transport,
          ...shortletOptions.amenities.laundry,
          ...shortletOptions.amenities.security,
          ...shortletOptions.amenities.family,
          ...shortletOptions.amenities.accessibility,
          ...shortletOptions.amenities.location,
        ];
      }
      return residentialFeatures;
    case PROPERTY_CATEGORIES.COMMERCIAL:
      if (briefType === BRIEF_TYPES.SHORTLET) {
        return [
          ...shortletOptions.amenities.general,
          ...shortletOptions.amenities.kitchen,
          ...shortletOptions.amenities.bathroom,
          ...shortletOptions.amenities.leisure,
          ...shortletOptions.amenities.transport,
          ...shortletOptions.amenities.laundry,
          ...shortletOptions.amenities.security,
          ...shortletOptions.amenities.family,
          ...shortletOptions.amenities.accessibility,
          ...shortletOptions.amenities.location,
        ];
      }
      return [
        ...commercialFeatures.structure,
        ...commercialFeatures.utilities,
        ...commercialFeatures.security,
        ...commercialFeatures.parking,
      ];
    case PROPERTY_CATEGORIES.LAND:
      return landFeatures;
    default:
      return [];
  }
};

// Helper function to check if field should be displayed
export const shouldShowField = (
  fieldId: string,
  briefType: string,
  propertyCategory: string,
  dependencies?: Record<string, any>,
) => {
  const rules: Record<string, any> = {
        // Property Condition - only for Residential/Commercial (not Land), and NEVER for JV
    propertyCondition:
      briefType !== BRIEF_TYPES.JV &&
      (briefType === BRIEF_TYPES.SELL ||
        briefType === BRIEF_TYPES.RENT ||
        briefType === BRIEF_TYPES.SHORTLET) &&
      (propertyCategory === PROPERTY_CATEGORIES.RESIDENTIAL ||
        propertyCategory === PROPERTY_CATEGORIES.COMMERCIAL),

        // Building Type - only for Residential/Commercial, but NEVER for JV
    typeOfBuilding:
      briefType !== BRIEF_TYPES.JV &&
      (propertyCategory === PROPERTY_CATEGORIES.RESIDENTIAL ||
        propertyCategory === PROPERTY_CATEGORIES.COMMERCIAL),

        // Room Details - only for Residential/Commercial, but NEVER for JV
    bedrooms:
      briefType !== BRIEF_TYPES.JV &&
      (propertyCategory === PROPERTY_CATEGORIES.RESIDENTIAL ||
        propertyCategory === PROPERTY_CATEGORIES.COMMERCIAL),
    bathrooms:
      briefType !== BRIEF_TYPES.JV &&
      (propertyCategory === PROPERTY_CATEGORIES.RESIDENTIAL ||
        propertyCategory === PROPERTY_CATEGORIES.COMMERCIAL),
    toilets:
      briefType !== BRIEF_TYPES.JV &&
      (propertyCategory === PROPERTY_CATEGORIES.RESIDENTIAL ||
        propertyCategory === PROPERTY_CATEGORIES.COMMERCIAL),

        // Land Size - for all Sell properties, for Commercial Rent, and all JV
    landSize:
      briefType === BRIEF_TYPES.SELL ||
      (briefType === BRIEF_TYPES.RENT &&
        propertyCategory === PROPERTY_CATEGORIES.COMMERCIAL) ||
      briefType === BRIEF_TYPES.JV,

    // Rental Type - only for Rent
    rentalType: briefType === BRIEF_TYPES.RENT,

    // Lease Hold - only for Rent when Lease is selected
    leaseHold:
      briefType === BRIEF_TYPES.RENT && dependencies?.rentalType === "Lease",

    // Documents - for Sell and JV
    documents: briefType === BRIEF_TYPES.SELL || briefType === BRIEF_TYPES.JV,

    // JV Conditions - only for JV
    jvConditions: briefType === BRIEF_TYPES.JV,

    // Rental Conditions - for Rent (except Land)
    rentalConditions:
      briefType === BRIEF_TYPES.RENT &&
      propertyCategory !== PROPERTY_CATEGORIES.LAND,

    // Employment Type - for Rent (except Land)
    employmentType:
      briefType === BRIEF_TYPES.RENT &&
      propertyCategory !== PROPERTY_CATEGORIES.LAND,

    // Tenant Gender Preference - for Rent (except Land)
    tenantGenderPreference:
      briefType === BRIEF_TYPES.RENT &&
      propertyCategory !== PROPERTY_CATEGORIES.LAND,

    // Shortlet specific fields
    shortletDuration: briefType === BRIEF_TYPES.SHORTLET,
    streetAddress: briefType === BRIEF_TYPES.SHORTLET,
    maxGuests: briefType === BRIEF_TYPES.SHORTLET,
    minStay: briefType === BRIEF_TYPES.SHORTLET,
    maxStay: briefType === BRIEF_TYPES.SHORTLET,
    nightly: briefType === BRIEF_TYPES.SHORTLET,
    weeklyDiscount: briefType === BRIEF_TYPES.SHORTLET,
    monthlyDiscount: briefType === BRIEF_TYPES.SHORTLET,
    cleaningFee: briefType === BRIEF_TYPES.SHORTLET,
    securityDeposit: briefType === BRIEF_TYPES.SHORTLET,
    cancellationPolicy: briefType === BRIEF_TYPES.SHORTLET,
    checkIn: briefType === BRIEF_TYPES.SHORTLET,
    checkOut: briefType === BRIEF_TYPES.SHORTLET,
    smokingAllowed: briefType === BRIEF_TYPES.SHORTLET,
    petsAllowed: briefType === BRIEF_TYPES.SHORTLET,
    partiesAllowed: briefType === BRIEF_TYPES.SHORTLET,
    paymentMethod: briefType === BRIEF_TYPES.SHORTLET,
    bankDetails: briefType === BRIEF_TYPES.SHORTLET,
  };

  return rules[fieldId] !== undefined ? rules[fieldId] : true;
};

// Function to get fields that should be cleared when property category changes
export const getFieldsToClearOnCategoryChange = (briefType: string) => {
  return [
    // Clear price and location fields
    "price",
    "state",
    "lga",
    "area",
    "streetAddress",

    // Clear property details
    "propertyCondition",
    "typeOfBuilding",
    "bedrooms",
    "bathrooms",
    "toilets",
    "parkingSpaces",
    "maxGuests",

    // Clear size and measurement
    "landSize",
    "measurementType",

    // Clear rental/lease specific
    "rentalType",
    "leaseHold",
    "holdDuration",

    // Clear shortlet specific
    "shortletDuration",
    "availability",
    "pricing",
    "houseRules",

    // Clear features and conditions
    "features",
    "documents",
    "jvConditions",
    "rentalConditions",
    "employmentType",
    "tenantGenderPreference",
    "isTenanted",

    // Clear descriptions
    "additionalInfo",
    "description",
  ];
};

// Function to get commission text
export const getCommissionText = (
  briefType: string,
  userType: "landowner" | "agent",
  userName: string,
) => {
  const config = briefTypeConfig[briefType as keyof typeof briefTypeConfig];
  if (!config) return "";

  if (userType === "landowner") {
    const rate = config.commission.landowner;
    if (briefType === BRIEF_TYPES.SHORTLET) {
      return `I, ${userName}, agree that Khabiteq Realty shall earn ${rate}% of the total value generated from this transaction when the deal is closed.`;
    } else if (briefType === BRIEF_TYPES.RENT) {
      return `I, ${userName}, agree that Khabiteq Realty shall earn ${rate}% of the final rental deal value as commission when the deal is closed.`;
    } else if (briefType === BRIEF_TYPES.SELL) {
      return `I, ${userName}, agree that Khabiteq Realty shall earn ${rate}% of the total value generated from this transaction as commission when the deal is closed.`;
    } else {
      return `I, ${userName}, agree that Khabiteq Realty shall earn ${rate}% of the total value generated from this transaction as commission when the deal is closed.`;
    }
  } else {
    // Agent
    if (briefType === BRIEF_TYPES.RENT) {
      return `I understand that Khabiteq does not collect commission on agent rental deals.`;
    } else {
      const rate = config.commission.agent;
      return `I, ${userName}, agree that Khabiteq Realty shall earn ${rate}% of the total commission accrued to me when the deal is closed.`;
    }
  }
};
