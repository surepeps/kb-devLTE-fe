# Document Verification System - API Payloads Documentation

This document outlines the payload structures and API endpoints used in the redesigned document verification system.

## Overview

The document verification system consists of three main steps:
1. **Document Selection & Upload** - Users select and upload documents using individual file uploads
2. **Contact Information** - Users provide contact details for follow-up
3. **Payment Information** - Users upload payment receipt and complete the process

## API Endpoints

### 1. File Upload Endpoint

**Endpoint:** `POST /upload-single-file`  
**Purpose:** Upload individual document files during Step 1

#### Request Payload
```json
{
  "file": "File object (multipart/form-data)",
  "for": "property-file"
}
```

#### Response Payload
```json
{
  "success": true,
  "data": {
    "url": "https://storage.example.com/path/to/uploaded/file.pdf",
    "filename": "certificate-of-occupancy.pdf",
    "size": 1024567,
    "mimetype": "application/pdf"
  },
  "message": "File uploaded successfully"
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Upload failed",
  "message": "File size exceeds maximum limit"
}
```

### 2. Final Submission Endpoint

**Endpoint:** `POST /api/submit-docs`  
**Purpose:** Submit complete document verification request

#### Request Payload (FormData)
```javascript
const formData = new FormData();

// Contact Information
formData.append('fullName', 'John Doe');
formData.append('email', 'john.doe@example.com');
formData.append('phoneNumber', '+2348012345678');
formData.append('address', '123 Main Street, Lagos, Nigeria');

// Payment Information
formData.append('amountPaid', '20000');
formData.append('receipt', receiptFile); // File object

// Document Metadata (JSON string)
formData.append('documentsMetadata', JSON.stringify([
  {
    "documentType": "Certificate of Occupancy",
    "documentNumber": "COO/LAG/2023/001234",
    "uploadedUrl": "https://storage.example.com/path/to/coo.pdf"
  },
  {
    "documentType": "Survey plan",
    "documentNumber": "SP/LAG/2023/005678",
    "uploadedUrl": "https://storage.example.com/path/to/survey.pdf"
  }
]));

// Document Files
documents.forEach(file => formData.append('documents', file));
```

#### Response Payload
```json
{
  "success": true,
  "data": {
    "submissionId": "DOC_VERIFY_2024_001234",
    "status": "pending_review",
    "estimatedCompletionDate": "2024-01-15T10:00:00Z"
  },
  "message": "Documents submitted successfully for verification"
}
```

## Data Structures

### Document Types
Available document types for verification:
```javascript
const documentTypes = [
  'Certificate of Occupancy',
  'Deed of Partition',
  'Deed of Assignment',
  "Governor's Consent",
  'Survey plan',
  'Deed of Lease'
];
```

### Document Metadata Structure
```typescript
interface DocumentMetadata {
  documentType: string;           // One of the valid document types
  documentNumber: string;         // User-entered document number
  uploadedUrl: string;           // URL returned from upload endpoint
}
```

### Contact Information Structure
```typescript
interface ContactInfo {
  fullName: string;              // User's full name
  phoneNumber: string;           // Active phone number for follow-up
  email: string;                 // Email for communication
  address: string;               // Residential or business address
}
```

### Upload File Structure
```typescript
interface UploadedFile {
  file: File;                    // Original file object
  url: string;                   // URL returned from server
  uploadStatus: 'uploading' | 'success' | 'error';  // Upload status
}
```

## Frontend State Management

### Step 1 - Document Selection & Upload
```typescript
// Selected documents (max 2)
const selectedDocuments: DocumentType[] = [];

// Document numbers entered by user
const documentNumbers: { [key in DocumentType]: string } = {};

// Uploaded files with their status
const uploadedFiles: { [key in DocumentType]?: UploadedFile } = {};
```

### Step 2 - Contact Information
```typescript
const contactInfo: ContactInfo = {
  fullName: '',
  phoneNumber: '',
  email: '',
  address: ''
};
```

### Step 3 - Payment Information
```typescript
const paymentDetails = {
  amountPaid: 20000,             // Calculated based on document count
  receiptFile: null              // Payment receipt file
};
```

## Validation Rules

### Step 1 Validation
- At least one document must be selected
- Each selected document must be successfully uploaded
- Document numbers are optional but recommended

### Step 2 Validation
- All contact information fields are required
- Email must be in valid format
- Phone number must be in valid format

### Step 3 Validation
- Payment receipt file is required
- Amount paid matches the calculated fee

## Fee Calculation

```typescript
const calculateFee = (documentCount: number): number => {
  return documentCount === 1 ? 20000 : 40000;  // ₦20,000 for 1 doc, ₦40,000 for 2 docs
};
```

## Error Handling

### Upload Errors
```javascript
// Handle upload failure
if (uploadStatus === 'error') {
  toast.error(`Failed to upload ${documentType}`);
  // Allow user to retry upload
}
```

### Validation Errors
```javascript
// Step validation errors
const validateStep1 = () => {
  if (selectedDocuments.length === 0) {
    toast.error('Please select at least one document');
    return false;
  }
  
  for (const doc of selectedDocuments) {
    if (!uploadedFiles[doc] || uploadedFiles[doc]?.uploadStatus !== 'success') {
      toast.error(`Please upload ${doc}`);
      return false;
    }
  }
  
  return true;
};
```

### Submission Errors
```javascript
// Handle final submission errors
try {
  const response = await submitDocuments(formData);
  if (!response.success) {
    toast.error('Submission failed. Please try again.');
  }
} catch (error) {
  toast.error('Network error. Please check your connection.');
}
```

## File Upload Specifications

### Accepted File Types
- **Images:** JPEG, PNG, GIF, WebP
- **Documents:** PDF
- **MIME Types:** `image/*`, `application/pdf`

### File Size Limits
- Maximum file size: 10MB per file
- Recommended: Compress large files before upload

### File Naming Convention
- Original filename is preserved
- Server may append timestamp or UUID for uniqueness

## Security Considerations

### File Upload Security
- Files are scanned for malicious content
- Only whitelisted file types are accepted
- Files are stored in secure cloud storage with limited access

### Data Privacy
- Personal information is encrypted in transit and at rest
- Document access is restricted to authorized personnel only
- Compliance with data protection regulations

## Integration Notes

### Frontend Implementation
```javascript
// Example upload function
const uploadFile = async (file, document) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('for', 'property-file');

  try {
    const response = await fetch(`${URLS.BASE}${URLS.uploadSingleImg}`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (response.ok && result.data?.url) {
      return result.data.url;
    } else {
      throw new Error(result.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
};
```

### Backend Requirements
- Implement file upload endpoint with proper validation
- Store uploaded files securely
- Process document verification requests
- Send confirmation emails to users
- Provide status tracking for submissions

## Status Tracking

Document verification submissions go through these statuses:
1. **pending_review** - Initial submission received
2. **in_progress** - Verification process started
3. **completed** - Verification completed with report
4. **rejected** - Documents rejected with reason

## Notifications

Users receive notifications at key stages:
- Email confirmation upon submission
- SMS/Email updates on verification progress
- Final report delivery via email
- Follow-up communication as needed
