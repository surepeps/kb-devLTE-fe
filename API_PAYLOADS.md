# Secure Negotiation API Payloads

This document outlines the payload structures for the secure negotiation system endpoints.

## Base URL Structure

All endpoints follow this pattern:

```
{BASE_URL}/inspections/inspection-details/{inspectionId}/{action}
```

## Negotiation Flow

The negotiation follows this flow:

1. **Price Negotiation Step**: User chooses Accept, Counter, or Reject
2. **Inspection Date/Time Step**: If Accept/Counter chosen, user selects inspection schedule
3. **Final Submission**: Accept/Counter submitted with inspection date/time included

## 1. Accept Offer (with Inspection Schedule)

**Endpoint:** `PUT {BASE_URL}/inspections/inspection-details/{inspectionId}/accept`

**Payload:**

```json
{
  "userType": "seller",
  "action": "accept",
  "inspectionDate": "2025-01-15",
  "inspectionTime": "2:30 PM"
}
```

**Example:**

```json
{
  "userType": "buyer",
  "action": "accept",
  "inspectionDate": "2025-01-15",
  "inspectionTime": "10:00 AM"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Offer accepted successfully",
  "data": {
    "inspectionId": "686d86db9705e4892949e703",
    "status": "negotiation_accepted",
    "pendingResponseFrom": "buyer",
    "stage": "inspection",
    "inspectionDate": "2025-01-15T00:00:00.000Z",
    "inspectionTime": "2:30 PM",
    "updatedAt": "2025-01-08T15:30:00.000Z"
  }
}
```

## 2. Reject Offer (No Inspection Schedule Required)

**Endpoint:** `PUT {BASE_URL}/inspections/inspection-details/{inspectionId}/reject`

**Payload:**

```json
{
  "userType": "seller",
  "action": "reject"
}
```

**Example:**

```json
{
  "userType": "buyer",
  "action": "reject"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Offer rejected successfully",
  "data": {
    "inspectionId": "686d86db9705e4892949e703",
    "status": "offer_rejected",
    "stage": "cancelled",
    "updatedAt": "2025-01-08T15:30:00.000Z"
  }
}
```

## 3. Counter Offer (with Inspection Schedule)

**Endpoint:** `PUT {BASE_URL}/inspections/inspection-details/{inspectionId}/counter`

**Payload:**

```json
{
  "userType": "seller",
  "action": "counter",
  "counterPrice": 4500000,
  "inspectionDate": "2025-01-15",
  "inspectionTime": "2:30 PM"
}
```

**Example (Seller Counter):**

```json
{
  "userType": "seller",
  "action": "counter",
  "counterPrice": 4500000,
  "inspectionDate": "2025-01-16",
  "inspectionTime": "11:30 AM"
}
```

**Example (Buyer Counter):**

```json
{
  "userType": "buyer",
  "action": "counter",
  "counterPrice": 4200000,
  "inspectionDate": "2025-01-17",
  "inspectionTime": "3:00 PM"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Counter offer submitted successfully",
  "data": {
    "inspectionId": "686d86db9705e4892949e703",
    "status": "negotiation_countered",
    "pendingResponseFrom": "buyer",
    "stage": "negotiation",
    "sellerCounterOffer": 4500000,
    "negotiationPrice": 4000000,
    "inspectionDate": "2025-01-15T00:00:00.000Z",
    "inspectionTime": "2:30 PM",
    "updatedAt": "2025-01-08T15:30:00.000Z"
  }
}
```

## 4. Update Inspection Schedule Only

**Endpoint:** `PUT {BASE_URL}/inspections/inspection-details/{inspectionId}/schedule`

**Payload:**

```json
{
  "userType": "seller",
  "inspectionDate": "2025-01-15",
  "inspectionTime": "10:00 AM"
}
```

**Note:** This endpoint is used when only updating the inspection schedule without accepting/countering an offer.

**Response:**

```json
{
  "success": true,
  "message": "Inspection schedule updated successfully",
  "data": {
    "inspectionId": "686d86db9705e4892949e703",
    "status": "pending_inspection",
    "pendingResponseFrom": "seller",
    "stage": "inspection",
    "inspectionDate": "2025-01-15T00:00:00.000Z",
    "inspectionTime": "10:00 AM",
    "updatedAt": "2025-01-08T15:30:00.000Z"
  }
}
```

## 5. Reopen Expired Inspection

**Endpoint:** `PUT {BASE_URL}/inspections/inspection-details/{inspectionId}/reopen`

**Payload:**

```json
{
  "userType": "seller"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Inspection reopened successfully",
  "data": {
    "inspectionId": "686d86db9705e4892949e703",
    "status": "pending_negotiation",
    "pendingResponseFrom": "seller",
    "stage": "negotiation",
    "updatedAt": "2025-01-08T15:30:00.000Z"
  }
}
```

## Key Differences in Flow

### Accept/Counter Flow:

1. User selects "Accept" or "Counter" → Goes to inspection date/time selection
2. User selects/confirms inspection date and time
3. **Final payload includes both the negotiation action AND inspection details**

### Reject Flow:

1. User selects "Reject" → **Immediately submits rejection**
2. **No inspection date/time selection required**
3. **Payload only includes the rejection action**

## Date/Time Constraints

### Available Dates:

- Next 15 days (excluding Sundays)
- Show first 10 days by default
- "View More" reveals remaining 5 days

### Available Times:

- 8:00 AM to 6:00 PM
- 30-minute intervals
- 12-hour format (e.g., "10:00 AM", "2:30 PM")

## Payload Field Requirements

### Required for Accept:

- `userType`: "seller" or "buyer"
- `action`: "accept"
- `inspectionDate`: YYYY-MM-DD format
- `inspectionTime`: 12-hour format string

### Required for Counter:

- `userType`: "seller" or "buyer"
- `action`: "counter"
- `counterPrice`: Number (price in base currency unit)
- `inspectionDate`: YYYY-MM-DD format
- `inspectionTime`: 12-hour format string

### Required for Reject:

- `userType`: "seller" or "buyer"
- `action`: "reject"
- **No inspection fields required**

## Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

## Important Notes

1. **Accept and Counter** actions always require inspection date/time
2. **Reject** action never includes inspection date/time
3. The flow ensures users select inspection details before final submission
4. Sundays are automatically excluded from available dates
5. Time slots are restricted to business hours (8 AM - 6 PM)
6. All inspection times are in 12-hour format for user-friendly display
