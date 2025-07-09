# Secure Negotiation API Payloads

This document outlines the payload structures for the secure negotiation system endpoints.

## Base URL Structure

All endpoints follow this pattern:

```
{BASE_URL}/inspections/inspection-details/{inspectionId}/{action}
```

## Date/Time Change Detection

The system now detects if the inspection date or time has been changed from the original and includes this information in the payload:

- **dateTimeCountered**: Boolean indicating if date/time was modified
  - `true`: User changed either date, time, or both
  - `false`: User kept original date and time

## Negotiation Flow

The negotiation follows this flow:

1. **Price Negotiation Step**: User chooses Accept, Counter, or Reject
2. **Inspection Date/Time Step**: If Accept/Counter chosen, user selects inspection schedule
3. **Final Submission**: Accept/Counter submitted with inspection date/time and change detection

## 1. Accept Offer (with Inspection Schedule)

**Endpoint:** `PUT {BASE_URL}/inspections/inspection-details/{inspectionId}/accept`

**Payload:**

```json
{
  "userType": "seller",
  "action": "accept",
  "inspectionDate": "2025-01-15",
  "inspectionTime": "2:30 PM",
  "dateTimeCountered": false
}
```

**Example (with date/time change):**

```json
{
  "userType": "buyer",
  "action": "accept",
  "inspectionDate": "2025-01-16",
  "inspectionTime": "10:00 AM",
  "dateTimeCountered": true
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
    "dateTimeCountered": false,
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

**Note:** Reject offers do not include inspection date/time or dateTimeCountered fields.

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
  "inspectionTime": "2:30 PM",
  "dateTimeCountered": false
}
```

**Example (Seller Counter with modified schedule):**

```json
{
  "userType": "seller",
  "action": "counter",
  "counterPrice": 4500000,
  "inspectionDate": "2025-01-17",
  "inspectionTime": "11:30 AM",
  "dateTimeCountered": true
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
    "inspectionDate": "2025-01-17T00:00:00.000Z",
    "inspectionTime": "11:30 AM",
    "dateTimeCountered": true,
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
  "inspectionTime": "10:00 AM",
  "dateTimeCountered": true
}
```

**Note:** This endpoint is used when only updating the inspection schedule without accepting/countering an offer. dateTimeCountered is always true for this endpoint since the user is explicitly changing the schedule.

## 5. Reopen Expired Inspection

**Endpoint:** `PUT {BASE_URL}/inspections/inspection-details/{inspectionId}/reopen`

**Payload:**

```json
{
  "userType": "seller"
}
```

## Date/Time Change Detection Logic

### When dateTimeCountered = true:

1. User explicitly clicked "Update Schedule" and selected new date/time
2. User confirmed existing schedule but had previously modified it in the form
3. Any change from the original inspection date or time

### When dateTimeCountered = false:

1. User confirmed the original inspection date and time without changes
2. User selected the same date and time as originally proposed

## Mobile Responsiveness Features

The system now includes:

- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Touch-Friendly**: Larger buttons and touch targets on mobile
- **Collapsible Sections**: Property details collapsed by default on mobile
- **Reduced Shadows**: Minimal shadow usage for better mobile performance
- **Flexible Layouts**: Grid layouts adapt to screen size

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
- `dateTimeCountered`: Boolean

### Required for Counter:

- `userType`: "seller" or "buyer"
- `action`: "counter"
- `counterPrice`: Number (price in base currency unit)
- `inspectionDate`: YYYY-MM-DD format
- `inspectionTime`: 12-hour format string
- `dateTimeCountered`: Boolean

### Required for Reject:

- `userType`: "seller" or "buyer"
- `action`: "reject"
- **No inspection fields or dateTimeCountered required**

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

1. **Accept and Counter** actions always require inspection date/time and dateTimeCountered
2. **Reject** action never includes inspection date/time or dateTimeCountered
3. **dateTimeCountered** helps the backend understand if the user modified the schedule
4. The system automatically detects changes by comparing with original values
5. All inspection times are in 12-hour format for user-friendly display
6. Mobile-responsive design ensures usability across all devices
7. Property details are collapsible and collapsed by default for better mobile UX
