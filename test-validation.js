// Test validation logic for JV and rent properties

// Mock property data scenarios
const testCases = [
  {
    name: "JV - Residential with all required fields",
    propertyData: {
      propertyType: "jv",
      propertyCategory: "Residential",
      state: { value: "Lagos", label: "Lagos" },
      lga: { value: "Victoria Island", label: "Victoria Island" },
      area: "VI",
      price: "100000000",
      holdDuration: "5 years",
      propertyCondition: "New",
      typeOfBuilding: "Duplex",
      bedrooms: 4,
      measurementType: "Plot",
      landSize: "600"
    },
    shouldPass: true
  },
  {
    name: "JV - Land with all required fields",
    propertyData: {
      propertyType: "jv",
      propertyCategory: "Land",
      state: { value: "Lagos", label: "Lagos" },
      lga: { value: "Victoria Island", label: "Victoria Island" },
      area: "VI",
      price: "50000000",
      holdDuration: "5 years",
      measurementType: "Plot",
      landSize: "600"
    },
    shouldPass: true
  },
  {
    name: "JV - Residential missing land size",
    propertyData: {
      propertyType: "jv",
      propertyCategory: "Residential",
      state: { value: "Lagos", label: "Lagos" },
      lga: { value: "Victoria Island", label: "Victoria Island" },
      area: "VI",
      price: "100000000",
      holdDuration: "5 years",
      propertyCondition: "New",
      typeOfBuilding: "Duplex",
      bedrooms: 4,
      measurementType: "Plot"
      // landSize: missing
    },
    shouldPass: false
  },
  {
    name: "Rent - Commercial with all required fields",
    propertyData: {
      propertyType: "rent",
      propertyCategory: "Commercial",
      state: { value: "Lagos", label: "Lagos" },
      lga: { value: "Victoria Island", label: "Victoria Island" },
      area: "VI",
      price: "10000000",
      rentalType: "Rent",
      propertyCondition: "New",
      typeOfBuilding: "Offices",
      bedrooms: 1,
      measurementType: "Square Meter",
      landSize: "500"
    },
    shouldPass: true
  },
  {
    name: "Rent - Residential without land size (should pass)",
    propertyData: {
      propertyType: "rent",
      propertyCategory: "Residential",
      state: { value: "Lagos", label: "Lagos" },
      lga: { value: "Victoria Island", label: "Victoria Island" },
      area: "VI",
      price: "5000000",
      rentalType: "Rent",
      propertyCondition: "New",
      typeOfBuilding: "Duplex",
      bedrooms: 3
    },
    shouldPass: true
  },
  {
    name: "Rent - Commercial missing land size",
    propertyData: {
      propertyType: "rent",
      propertyCategory: "Commercial",
      state: { value: "Lagos", label: "Lagos" },
      lga: { value: "Victoria Island", label: "Victoria Island" },
      area: "VI",
      price: "10000000",
      rentalType: "Rent",
      propertyCondition: "New",
      typeOfBuilding: "Offices",
      bedrooms: 1
      // measurementType and landSize missing
    },
    shouldPass: false
  }
];

// Validation function (copied from the actual code)
const checkStep1RequiredFields = (propertyData) => {
  const requiredFields = ["propertyCategory", "state", "lga", "area", "price"];

  if (propertyData.propertyType === "rent") {
    requiredFields.push("rentalType");
    if (propertyData.propertyCategory !== "Land") {
      requiredFields.push("propertyCondition", "typeOfBuilding", "bedrooms");
    }
    if (propertyData.propertyCategory === "Commercial") {
      requiredFields.push("measurementType", "landSize");
    }
  }

  if (propertyData.propertyType === "jv") {
    requiredFields.push("holdDuration");
    if (propertyData.propertyCategory !== "Land") {
      requiredFields.push("propertyCondition", "typeOfBuilding", "bedrooms");
    }
    // JV ALWAYS requires land size for ALL property categories
    requiredFields.push("measurementType", "landSize");
  }

  if (propertyData.propertyCategory === "Land") {
    if (!requiredFields.includes("measurementType"))
      requiredFields.push("measurementType");
    if (!requiredFields.includes("landSize")) requiredFields.push("landSize");
  }

  return requiredFields.every((field) => {
    const value = propertyData[field];
    if (field === "state" || field === "lga") {
      return value && value.value && value.value !== "";
    }
    return value && value !== "" && value !== 0;
  });
};

// Run tests
console.log("Testing validation logic...\n");

testCases.forEach((testCase, index) => {
  const result = checkStep1RequiredFields(testCase.propertyData);
  const status = result === testCase.shouldPass ? "✅ PASS" : "❌ FAIL";
  
  console.log(`${index + 1}. ${testCase.name}`);
  console.log(`   Expected: ${testCase.shouldPass ? "Pass" : "Fail"}`);
  console.log(`   Actual: ${result ? "Pass" : "Fail"}`);
  console.log(`   ${status}\n`);
});
