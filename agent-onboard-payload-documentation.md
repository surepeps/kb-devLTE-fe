# Agent Onboard Form Payload Documentation

## Overview
This document describes the payload structure for the agent onboarding form submission in the Khabi-teq Realty application.

## API Endpoint
```
PUT /api/account-settings/onBoard
```

## Request Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

## Payload Structure

### Root Level Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `token` | string | Yes | Authentication token from cookies |
| `address` | object | Yes | Agent's residential address information |
| `regionOfOperation` | array | Yes | Areas where the agent will operate |
| `agentType` | string | Yes | Type of agent: "Individual" or "Company" |
| `companyAgent` | object | Conditional | Required only if agentType is "Company" |
| `govtId` | object | Yes | Government ID information |
| `firstName` | string | Yes | Agent's first name |
| `lastName` | string | Yes | Agent's last name |
| `phoneNumber` | string | Yes | Agent's phone number |
| `email` | string | Yes | Agent's email address |
| `meansOfId` | array | Yes | Array of uploaded documents |

### Address Object Structure
```json
{
  "address": {
    "homeNo": "string",      // House number
    "street": "string",      // Street name
    "state": "string",       // State name
    "localGovtArea": "string" // Local Government Area
  }
}
```

### Government ID Object Structure
```json
{
  "govtId": {
    "typeOfId": "string",    // Type of government ID
    "idNumber": "string"     // ID number
  }
}
```

### Company Agent Object Structure (Conditional)
```json
{
  "companyAgent": {
    "companyName": "string", // Company name
    "cacNumber": "string"    // CAC registration number
  }
}
```

### Means of ID Array Structure

#### For Individual Agents:
```json
{
  "meansOfId": [
    {
      "name": "string",      // Type of ID (e.g., "nin", "driver license")
      "docImg": ["string"]   // Array containing image URL
    },
    {
      "name": "utility bill",
      "docImg": ["string"]   // Array containing utility bill image URL
    }
  ]
}
```

#### For Company Agents:
```json
{
  "meansOfId": [
    {
      "name": "cac",
      "docImg": ["string"]   // Array containing CAC document URL
    },
    {
      "name": "govID", 
      "docImg": ["string"]   // Array containing government ID URL
    },
    {
      "name": "utility bill",
      "docImg": ["string"]   // Array containing utility bill URL
    }
  ]
}
```

## Complete Example Payloads

### Individual Agent Payload Example:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "address": {
    "homeNo": "15",
    "street": "Adeniyi Jones Avenue",
    "state": "Lagos",
    "localGovtArea": "Ikeja"
  },
  "regionOfOperation": ["Ikeja", "Victoria Island", "Lekki"],
  "agentType": "Individual",
  "govtId": {
    "typeOfId": "nin",
    "idNumber": "12345678901"
  },
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+2348012345678",
  "email": "john.doe@example.com",
  "meansOfId": [
    {
      "name": "nin",
      "docImg": ["https://cloudinary.com/uploads/nin_document.jpg"]
    },
    {
      "name": "utility bill",
      "docImg": ["https://cloudinary.com/uploads/utility_bill.pdf"]
    }
  ]
}
```

### Company Agent Payload Example:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "address": {
    "homeNo": "Plot 123",
    "street": "Ahmadu Bello Way",
    "state": "Abuja",
    "localGovtArea": "Garki"
  },
  "regionOfOperation": ["Garki", "Maitama", "Wuse"],
  "agentType": "Company",
  "companyAgent": {
    "companyName": "ABC Real Estate Ltd",
    "cacNumber": "RC123456"
  },
  "govtId": {
    "typeOfId": "international passport",
    "idNumber": "A12345678"
  },
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+2347012345678",
  "email": "jane.smith@abcrealestate.com",
  "meansOfId": [
    {
      "name": "cac",
      "docImg": ["https://cloudinary.com/uploads/cac_certificate.pdf"]
    },
    {
      "name": "govID",
      "docImg": ["https://cloudinary.com/uploads/passport.jpg"]
    },
    {
      "name": "utility bill",
      "docImg": ["https://cloudinary.com/uploads/company_utility_bill.pdf"]
    }
  ]
}
```

## Field Validation Rules

### Required Fields:
- All fields marked as "Required" in the table above
- At least one region in `regionOfOperation` array
- At least one document in `meansOfId` array

### ID Type Options:
- "international passport"
- "nin" 
- "driver license"
- "voter card"

### Agent Type Options:
- "Individual"
- "Company"

### File Upload Requirements:
- Supported formats: JPG, PNG, PDF
- Government ID must be clear and readable
- CAC certificate must be current and valid (for companies)
- Utility bill must be recent (within 3 months)

## Success Response
```json
{
  "success": true,
  "message": "Agent application submitted successfully",
  "token": "updated_jwt_token"
}
```

## Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Notes
- The token is refreshed upon successful submission
- Documents are uploaded via a separate file upload service before form submission
- The `regionOfOperation` array contains the names of local government areas where the agent will operate
- Company agents must provide both individual and company documentation
- Individual agents only need personal ID and utility bill documentation
