# Document Verification Pages Updates

## Overview

Updated the document verification and third-party verification pages to integrate with the system settings API and improve officer workflow based on verification status.

## Changes Made

### 1. Document Verification Page (`/document-verification`)

#### **Dynamic Pricing Integration**
- **Before**: Hardcoded pricing (₦20,000 for 1 document, ₦40,000 for 2 documents)
- **After**: Dynamic pricing from `document-verification` system settings category

#### **Implementation Details**
- Added `useDocumentVerificationSettings()` hook
- Updated `calculateFee()` function to use:
  - `verification_price` - for single document verification
  - `multi_document_price` - for multiple documents verification
- Added loading state for pricing display
- Maintains fallback to original prices if API is unavailable

#### **System Settings Fields Used**
```typescript
{
  verification_price: number;      // Price for single document
  multi_document_price: number;    // Price for multiple documents  
}
```

### 2. Third-Party Verification Page (`/third-party-verification/[documentID]`)

#### **Enhanced Verification Status Control**
- **Before**: Officer could submit reports when document status was "in-progress" or "successful"
- **After**: Officer can only submit reports when `verificationReports.status === "pending"`

#### **Updated Logic Based on API Response**
The page now properly handles the API response structure:
```typescript
{
  "data": {
    "_id": "68a1b29912926deae36c19d7",
    "buyerId": "68a1b298f24293957767998a",
    "docCode": "PE484M",
    "amountPaid": 40000,
    "transaction": "68a1b29812926deae36c19d5",
    "documents": { ... },
    "status": "payment-approved",
    "verificationReports": {
      "status": "pending",        // ← Controls officer action availability
      "selfVerification": false
    },
    // ... other fields
  }
}
```

#### **New Features**
1. **Status-Based Workflow**:
   - ✅ `verificationReports.status === "pending"` → Show verification report form
   - ⏸️ Other statuses → Show informational message
   - ✅ `verificationReports.status === "completed"` → Show completion message

2. **Enhanced UI Indicators**:
   - Display both document status and verification reports status
   - Clear messaging about officer action requirements
   - Status-specific styling and icons

3. **Improved User Experience**:
   - Clear indication when verification is pending officer action
   - Informative messages for non-pending states
   - Better status visualization

### 3. Type Safety Updates

#### **Updated TypeScript Types**
```typescript
// New verification reports type
type VerificationReports = {
  status: 'pending' | 'completed' | 'in-progress';
  selfVerification: boolean;
};

// Updated document details type to match API
type DocumentDetails = {
  _id: string;
  buyerId: string;
  docCode: string;
  amountPaid: number;
  transaction: string;
  documents: Document[] | Document;
  status: string;
  docType: string;
  verificationReports: VerificationReports;  // ← New field
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// Enhanced document verification settings
interface DocumentVerificationSettings {
  verification_price?: number;
  multi_document_price?: number;  // ← New field
}
```

## Workflow Examples

### Document Verification Pricing
```typescript
// Dynamic pricing calculation
const calculateFee = (): number => {
  const singleDocPrice = docVerificationSettings.verification_price || 20000;
  const multiDocPrice = docVerificationSettings.multi_document_price || 40000;
  
  if (selectedDocuments.length === 0) return singleDocPrice;
  return selectedDocuments.length === 1 ? singleDocPrice : multiDocPrice;
};
```

### Officer Report Submission Control
```typescript
// Only show report form when verification is pending
const canSubmitReport = documentDetails?.verificationReports?.status === 'pending';

if (canSubmitReport) {
  // Show verification report form
} else {
  // Show status message explaining why form is not available
}
```

## Benefits

1. **Administrative Control**: Document verification pricing can be updated without code changes
2. **Proper Workflow**: Officers can only submit reports when verification is truly pending
3. **Better UX**: Clear status indicators and messaging for all verification states
4. **Type Safety**: Full TypeScript support for new API response structure
5. **Fallback Support**: System works even when settings API is unavailable

## Testing

- ✅ Document verification page loads with dynamic pricing
- ✅ Fallback pricing works when API is unavailable  
- ✅ Third-party verification correctly shows/hides report form based on status
- ✅ Status indicators display correctly for all verification states
- ✅ TypeScript compilation passes without errors
- ✅ No runtime errors in development server

## Configuration

To configure document verification pricing, update the system settings via the API:

```json
{
  "category": "document-verification",
  "settings": [
    {
      "key": "verification_price",
      "value": 25000,
      "description": "Price for single document verification"
    },
    {
      "key": "multi_document_price", 
      "value": 45000,
      "description": "Price for multiple document verification"
    }
  ]
}
```
