# API Payload Samples & Endpoints

## Authentication Endpoints

### 1. Google Sign In

**Endpoint:** `POST https://api.khabiteq.com/login/google`

**Request Payload:**

```json
{
  "googleToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4NzQ2NzJhZGI4YzQwZGM5MjQ4ZjIwMzMwYzZlMzEwZmFkY...",
  "deviceInfo": {
    "platform": "web",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "ipAddress": "192.168.1.100"
  },
  "rememberMe": true
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Google login successful",
  "data": {
    "user": {
      "id": "user_123456789",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://lh3.googleusercontent.com/...",
      "emailVerified": true,
      "accountType": "buyer",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

### 2. Facebook Sign In

**Endpoint:** `POST https://api.khabiteq.com/login/facebook`

**Request Payload:**

```json
{
  "facebookToken": "EAABwzLixnjYBAKZBQZCxNJZAgXoZBRfZCUWRvL8U5UZBgqGZCZBQZAhYOZCfHv...",
  "deviceInfo": {
    "platform": "web",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "ipAddress": "192.168.1.100"
  },
  "rememberMe": true
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Facebook login successful",
  "data": {
    "user": {
      "id": "user_987654321",
      "email": "user@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "profilePicture": "https://graph.facebook.com/12345678/picture",
      "emailVerified": true,
      "accountType": "seller",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

### 3. Google Sign Up

**Endpoint:** `POST https://api.khabiteq.com/signup/google`

**Request Payload:**

```json
{
  "googleToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4NzQ2NzJhZGI4YzQwZGM5MjQ4ZjIwMzMwYzZlMzEwZmFkY...",
  "accountType": "buyer",
  "referralCode": "REF12345",
  "marketingConsent": true,
  "termsAccepted": true,
  "privacyPolicyAccepted": true
}
```

### 4. Facebook Sign Up

**Endpoint:** `POST https://api.khabiteq.com/signup/facebook`

**Request Payload:**

```json
{
  "facebookToken": "EAABwzLixnjYBAKZBQZCxNJZAgXoZBRfZCUWRvL8U5UZBgqGZCZBQZAhYOZCfHv...",
  "accountType": "agent",
  "referralCode": "REF12345",
  "marketingConsent": true,
  "termsAccepted": true,
  "privacyPolicyAccepted": true
}
```

---

## Normal Negotiation Endpoints

### 1. Accept Offer (Normal Negotiation)

**Endpoint:** `PUT https://api.khabiteq.com/inspections/inspection-details/{inspectionId}/accept`

**Request Payload:**

```json
{
  "userType": "seller",
  "action": "accept",
  "inspectionDate": "2024-02-15",
  "inspectionTime": "2:00 PM",
  "dateTimeCountered": false,
  "acceptedAt": "2024-01-20T14:30:00Z",
  "notes": "Accepting the offer as proposed",
  "finalPrice": 25000000,
  "paymentTerms": {
    "method": "bank_transfer",
    "installments": false
  }
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Offer accepted successfully",
  "data": {
    "inspectionId": "insp_123456789",
    "status": "accepted",
    "negotiationStatus": "completed",
    "acceptedPrice": 25000000,
    "inspectionSchedule": {
      "date": "2024-02-15",
      "time": "2:00 PM",
      "address": "Plot 123, Victoria Island, Lagos",
      "contactPerson": {
        "name": "Agent Name",
        "phone": "+2348123456789"
      }
    },
    "nextSteps": [
      "Prepare necessary documents",
      "Attend inspection at scheduled time",
      "Proceed to payment processing"
    ],
    "updatedAt": "2024-01-20T14:30:00Z"
  }
}
```

### 2. Reject Offer (Normal Negotiation)

**Endpoint:** `PUT https://api.khabiteq.com/inspections/inspection-details/{inspectionId}/reject`

**Request Payload:**

```json
{
  "userType": "buyer",
  "action": "reject",
  "rejectionReason": "price_too_high",
  "rejectedAt": "2024-01-20T14:30:00Z",
  "comments": "The offered price exceeds our budget. Thank you for the opportunity.",
  "finalDecision": true
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Offer rejected successfully",
  "data": {
    "inspectionId": "insp_123456789",
    "status": "rejected",
    "negotiationStatus": "terminated",
    "rejectionReason": "price_too_high",
    "rejectedBy": "buyer",
    "rejectedAt": "2024-01-20T14:30:00Z",
    "finalDecision": true,
    "negotiationSummary": {
      "originalPrice": 30000000,
      "finalOfferPrice": 25000000,
      "totalNegotiationRounds": 2,
      "duration": "48 hours"
    }
  }
}
```

### 3. Counter Offer (Normal Negotiation)

**Endpoint:** `PUT https://api.khabiteq.com/inspections/inspection-details/{inspectionId}/counter`

**Request Payload:**

```json
{
  "userType": "seller",
  "action": "counter",
  "counterPrice": 27000000,
  "inspectionDate": "2024-02-20",
  "inspectionTime": "10:00 AM",
  "dateTimeCountered": true,
  "counterReason": "price_adjustment",
  "counterComments": "Willing to negotiate on price but prefer different inspection schedule",
  "validUntil": "2024-01-25T23:59:59Z",
  "paymentTerms": {
    "flexiblePayment": true,
    "installmentOption": true,
    "downPaymentPercent": 30
  }
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Counter offer submitted successfully",
  "data": {
    "inspectionId": "insp_123456789",
    "status": "countered",
    "negotiationStatus": "ongoing",
    "counterOfferPrice": 27000000,
    "previousPrice": 25000000,
    "priceDirection": "increased",
    "inspectionSchedule": {
      "date": "2024-02-20",
      "time": "10:00 AM",
      "dateChanged": true,
      "timeChanged": true
    },
    "counterRound": 3,
    "validUntil": "2024-01-25T23:59:59Z",
    "awaitingResponseFrom": "buyer",
    "responseDeadline": "2024-01-25T23:59:59Z"
  }
}
```

---

## LOI (Letter of Intention) Negotiation Endpoints

### 1. Accept LOI

**Endpoint:** `PUT https://api.khabiteq.com/inspections/inspection-details/{inspectionId}/loi/accept`

**Request Payload:**

```json
{
  "userType": "seller",
  "action": "accept",
  "loiId": "loi_789012345",
  "inspectionDate": "2024-03-01",
  "inspectionTime": "11:00 AM",
  "acceptedTerms": {
    "partnershipType": "joint_venture",
    "profitSharingRatio": "60:40",
    "investmentContribution": {
      "landValue": 100000000,
      "developmentCapital": 150000000
    },
    "projectTimeline": "24 months",
    "exitStrategy": "sale_and_split"
  },
  "acceptedAt": "2024-01-20T14:30:00Z",
  "nextStep": "legal_documentation"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "LOI accepted successfully",
  "data": {
    "inspectionId": "insp_123456789",
    "loiId": "loi_789012345",
    "status": "loi_accepted",
    "negotiationStatus": "loi_approved",
    "jointVentureDetails": {
      "partnershipType": "joint_venture",
      "profitSharingRatio": "60:40",
      "landOwnerShare": 60,
      "investorShare": 40,
      "estimatedProjectValue": 400000000,
      "estimatedROI": "200-250%"
    },
    "inspectionSchedule": {
      "date": "2024-03-01",
      "time": "11:00 AM",
      "purpose": "joint_venture_site_inspection",
      "attendees": ["landowner", "investor", "legal_advisor", "architect"]
    },
    "nextSteps": [
      "Legal documentation preparation",
      "Due diligence process",
      "Site inspection",
      "Partnership agreement signing"
    ],
    "acceptedAt": "2024-01-20T14:30:00Z"
  }
}
```

### 2. Reject LOI

**Endpoint:** `PUT https://api.khabiteq.com/inspections/inspection-details/{inspectionId}/loi/reject`

**Request Payload:**

```json
{
  "userType": "seller",
  "action": "reject",
  "loiId": "loi_789012345",
  "rejectionReason": "unfavorable_terms",
  "specificConcerns": [
    "profit_sharing_ratio",
    "timeline_too_aggressive",
    "insufficient_capital_commitment"
  ],
  "rejectedAt": "2024-01-20T14:30:00Z",
  "feedback": "The proposed profit sharing ratio doesn't align with our expectations. We would consider a 70:30 split in favor of the landowner.",
  "openToRenegotiation": true,
  "alternativeTerms": {
    "preferredProfitRatio": "70:30",
    "minimumCapitalCommitment": 200000000,
    "preferredTimeline": "30 months"
  }
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "LOI rejected successfully",
  "data": {
    "inspectionId": "insp_123456789",
    "loiId": "loi_789012345",
    "status": "loi_rejected",
    "negotiationStatus": "loi_terminated",
    "rejectionReason": "unfavorable_terms",
    "rejectedBy": "seller",
    "rejectedAt": "2024-01-20T14:30:00Z",
    "openToRenegotiation": true,
    "alternativeTermsProvided": true,
    "negotiationSummary": {
      "originalProposal": {
        "profitRatio": "60:40",
        "capitalCommitment": 150000000,
        "timeline": "24 months"
      },
      "requestedTerms": {
        "profitRatio": "70:30",
        "capitalCommitment": 200000000,
        "timeline": "30 months"
      }
    }
  }
}
```

### 3. Counter LOI

**Endpoint:** `PUT https://api.khabiteq.com/inspections/inspection-details/{inspectionId}/loi/counter`

**Request Payload:**

```json
{
  "userType": "seller",
  "action": "counter",
  "loiId": "loi_789012345",
  "counterTerms": {
    "partnershipType": "joint_venture",
    "profitSharingRatio": "65:35",
    "investmentContribution": {
      "landValue": 100000000,
      "developmentCapital": 180000000,
      "additionalRequirements": "Environmental impact assessment"
    },
    "projectTimeline": "27 months",
    "milestonePayments": true,
    "exitStrategy": "sale_and_split_or_rental_income"
  },
  "inspectionDate": "2024-03-05",
  "inspectionTime": "2:00 PM",
  "dateTimeCountered": true,
  "counterReason": "risk_adjustment",
  "counterComments": "Adjusted terms to better reflect market conditions and risk distribution",
  "validUntil": "2024-02-05T23:59:59Z",
  "attachments": [
    {
      "type": "market_analysis",
      "url": "https://docs.khabiteq.com/market_analysis_jan2024.pdf"
    },
    {
      "type": "financial_projection",
      "url": "https://docs.khabiteq.com/financial_projection_updated.xlsx"
    }
  ]
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "LOI counter proposal submitted successfully",
  "data": {
    "inspectionId": "insp_123456789",
    "loiId": "loi_789012345",
    "status": "loi_countered",
    "negotiationStatus": "loi_ongoing",
    "counterProposal": {
      "profitSharingRatio": "65:35",
      "previousRatio": "60:40",
      "capitalCommitment": 180000000,
      "previousCapital": 150000000,
      "timeline": "27 months",
      "previousTimeline": "24 months"
    },
    "inspectionSchedule": {
      "date": "2024-03-05",
      "time": "2:00 PM",
      "dateChanged": true,
      "timeChanged": false,
      "reason": "Accommodate updated terms review"
    },
    "counterRound": 2,
    "validUntil": "2024-02-05T23:59:59Z",
    "awaitingResponseFrom": "buyer",
    "responseDeadline": "2024-02-05T23:59:59Z",
    "attachments": [
      {
        "type": "market_analysis",
        "url": "https://docs.khabiteq.com/market_analysis_jan2024.pdf",
        "uploadedAt": "2024-01-20T14:30:00Z"
      },
      {
        "type": "financial_projection",
        "url": "https://docs.khabiteq.com/financial_projection_updated.xlsx",
        "uploadedAt": "2024-01-20T14:30:00Z"
      }
    ]
  }
}
```

---

## Common Error Responses

### 1. Unauthorized Access

```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired access token",
  "code": 401
}
```

### 2. Invalid Inspection ID

```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Inspection not found or access denied",
  "code": 404
}
```

### 3. Invalid Action

```json
{
  "success": false,
  "error": "INVALID_ACTION",
  "message": "Cannot perform this action on current negotiation state",
  "code": 400,
  "details": {
    "currentStatus": "expired",
    "allowedActions": ["reopen"]
  }
}
```

### 4. Validation Error

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid request data",
  "code": 422,
  "errors": [
    {
      "field": "counterPrice",
      "message": "Counter price must be a positive number"
    },
    {
      "field": "inspectionDate",
      "message": "Inspection date must be in the future"
    }
  ]
}
```

---

## Additional Endpoints

### Update Inspection Schedule Only

**Endpoint:** `PUT https://api.khabiteq.com/inspections/inspection-details/{inspectionId}/schedule`

**Request Payload:**

```json
{
  "userType": "buyer",
  "inspectionDate": "2024-02-25",
  "inspectionTime": "3:00 PM",
  "dateTimeCountered": true,
  "reason": "scheduling_conflict",
  "preferredAlternatives": [
    {
      "date": "2024-02-26",
      "time": "10:00 AM"
    },
    {
      "date": "2024-02-27",
      "time": "2:00 PM"
    }
  ]
}
```

### Validate Inspection Access

**Endpoint:** `GET https://api.khabiteq.com/inspections/validate-access/{userId}/{inspectionId}`

**Expected Response:**

```json
{
  "success": true,
  "message": "Access validated successfully",
  "data": {
    "hasAccess": true,
    "userType": "buyer",
    "inspectionStatus": "pending",
    "expiresAt": "2024-01-22T14:30:00Z"
  }
}
```

### Get Inspection Details

**Endpoint:** `GET https://api.khabiteq.com/inspections/inspection-details/{userId}/{inspectionId}/{userType}`

**Expected Response:**

```json
{
  "success": true,
  "message": "Inspection details retrieved successfully",
  "data": {
    "inspectionId": "insp_123456789",
    "propertyId": {
      "id": "prop_987654321",
      "title": "4 Bedroom Duplex in Lekki",
      "price": 50000000,
      "location": {
        "area": "Lekki Phase 1",
        "localGovernment": "Eti-Osa",
        "state": "Lagos"
      },
      "images": ["https://images.khabiteq.com/prop1.jpg"]
    },
    "negotiationPrice": 45000000,
    "sellerCounterOffer": 47000000,
    "inspectionDate": "2024-02-15",
    "inspectionTime": "2:00 PM",
    "status": "countered",
    "negotiationType": "NORMAL",
    "letterOfIntention": null,
    "createdAt": "2024-01-18T10:00:00Z",
    "updatedAt": "2024-01-20T14:30:00Z",
    "participants": {
      "buyer": {
        "id": "user_123456789",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "seller": {
        "id": "user_987654321",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    }
  }
}
```
