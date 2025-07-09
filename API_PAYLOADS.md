# Secure Negotiation API Payloads

This document outlines the payload structures for the secure negotiation system endpoints.

## Base URL Structure

All endpoints follow this pattern:

```
{BASE_URL}/inspections/inspection-details/{inspectionId}/{action}
```

## 1. Accept Offer

**Endpoint:** `PUT {BASE_URL}/inspections/inspection-details/{inspectionId}/accept`

**Payload:**

```json
{
  "userType": "seller",
  "action": "accept"
}
```

**Example:**

```json
{
  "userType": "seller",
  "action": "accept"
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
    "updatedAt": "2025-01-08T15:30:00.000Z"
  }
}
```

## 2. Reject Offer

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

## 3. Counter Offer

**Endpoint:** `PUT {BASE_URL}/inspections/inspection-details/{inspectionId}/counter`

**Payload:**

```json
{
  "userType": "seller",
  "action": "counter",
  "counterPrice": 4500000
}
```

**Example (Seller Counter):**

```json
{
  "userType": "seller",
  "action": "counter",
  "counterPrice": 4500000
}
```

**Example (Buyer Counter):**

```json
{
  "userType": "buyer",
  "action": "counter",
  "counterPrice": 4200000
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
    "updatedAt": "2025-01-08T15:30:00.000Z"
  }
}
```

## 4. Update Inspection Schedule

**Endpoint:** `PUT {BASE_URL}/inspections/inspection-details/{inspectionId}/schedule`

**Payload:**

```json
{
  "userType": "seller",
  "inspectionDate": "2025-01-15",
  "inspectionTime": "10:00 AM"
}
```

**Example:**

```json
{
  "userType": "buyer",
  "inspectionDate": "2025-01-15",
  "inspectionTime": "2:30 PM"
}
```

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
    "inspectionTime": "2:30 PM",
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

**Example:**

```json
{
  "userType": "buyer"
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

## Common Response Fields

All responses include these common fields:

- **success**: Boolean indicating if the operation was successful
- **message**: Human-readable message describing the result
- **data**: Object containing updated inspection details

### Data Object Fields:

- **inspectionId**: Unique identifier for the inspection
- **status**: Current status of the inspection/negotiation
- **pendingResponseFrom**: Which party needs to respond next ("seller" or "buyer")
- **stage**: Current stage of the process ("negotiation", "inspection", "completed", "cancelled")
- **updatedAt**: Timestamp when the inspection was last updated

## Status Values

### Negotiation Statuses:

- `pending_negotiation` - Initial state, waiting for negotiation
- `negotiation_countered` - A counter offer has been made
- `negotiation_accepted` - Offer has been accepted
- `offer_rejected` - Offer has been rejected

### Inspection Statuses:

- `pending_inspection` - Waiting for inspection confirmation
- `inspection_scheduled` - Inspection date/time confirmed
- `inspection_completed` - Inspection has been completed

### Final Statuses:

- `completed` - Transaction completed successfully
- `cancelled` - Transaction was cancelled

## Error Responses

If an error occurs, the response will have this structure:

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

## Notes

1. **userType** field should always be either "seller" or "buyer"
2. **counterPrice** should be a number representing the price in the base currency unit
3. **inspectionDate** should be in YYYY-MM-DD format
4. **inspectionTime** should be in 12-hour format (e.g., "10:00 AM", "2:30 PM")
5. All endpoints require valid user and inspection IDs in the URL path
6. The system automatically updates the **pendingResponseFrom** field based on who made the last action
