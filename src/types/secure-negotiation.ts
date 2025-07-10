// Updated types based on new secure negotiation system specifications

export type InspectionType = "price" | "LOI";
export type InspectionStage =
  | "negotiation"
  | "inspection"
  | "completed"
  | "cancelled";
export type PendingResponseFrom = "buyer" | "seller" | "admin";
export type InspectionStatus =
  | "new"
  | "pending_transaction"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

// Property location structure
export interface PropertyLocation {
  state: string;
  localGovernment: string;
  area: string;
}

// Property details from API response
export interface PropertyDetails {
  location: PropertyLocation;
  _id: string;
  propertyType: string;
  briefType: string;
  price: number;
  owner: string;
  pictures: string[];
  thumbnail: string | null;
}

// User information structures
export interface RequestedBy {
  _id: string;
  fullName: string;
}

export interface Owner {
  _id: string;
  lastName?: string;
  firstName?: string;
  userType?: string;
  id: string;
}

// Main inspection details from API response
export interface InspectionDetails {
  _id: string;
  propertyId: PropertyDetails;
  inspectionDate: string;
  inspectionTime: string;
  status: InspectionStatus;
  requestedBy: RequestedBy;
  transaction: string;
  isNegotiating: boolean;
  negotiationPrice: number;
  letterOfIntention?: string;
  owner: Owner;
  sellerCounterOffer: number;
  pendingResponseFrom: PendingResponseFrom;
  stage: InspectionStage;
  createdAt: string;
  updatedAt: string;
  __v: number;
  inspectionStatus: string;
  inspectionType: InspectionType;
  isLOI: boolean;
}

// API response structure
export interface InspectionDetailsResponse {
  success: boolean;
  data: InspectionDetails;
}

// Access validation response
export interface AccessValidationResponse {
  status: string;
  success: boolean;
  role: "seller" | "buyer";
  message: string;
}

// Base payload for all actions
export interface BasePayload {
  action: "accept" | "reject" | "counter" | "request_changes";
  inspectionType: InspectionType;
  userType: "buyer" | "seller";
  inspectionDate?: string;
  inspectionTime?: string;
  rejectionReason?: string;
}

// Price negotiation payloads
export interface AcceptPricePayload extends BasePayload {
  action: "accept";
  inspectionType: "price";
  userType: "buyer" | "seller";
}

export interface RejectPricePayload extends BasePayload {
  action: "reject";
  inspectionType: "price";
  userType: "buyer" | "seller";
}

export interface CounterPricePayload extends BasePayload {
  action: "counter";
  inspectionType: "price";
  userType: "buyer" | "seller";
  counterPrice: number;
}

// LOI negotiation payloads
export interface AcceptLOIPayload extends BasePayload {
  action: "accept";
  inspectionType: "LOI";
  userType: "buyer" | "seller";
}

export interface RejectLOIPayload extends BasePayload {
  action: "reject";
  inspectionType: "LOI";
  userType: "buyer" | "seller";
}

export interface RequestChangesLOIPayload extends BasePayload {
  action: "request_changes";
  inspectionType: "LOI";
  userType: "seller";
  reason: string;
}

export interface CounterLOIPayload extends BasePayload {
  action: "counter";
  inspectionType: "LOI";
  userType: "buyer";
  documentUrl: string;
}

// Union type for all possible payloads
export type NegotiationPayload =
  | AcceptPricePayload
  | RejectPricePayload
  | CounterPricePayload
  | AcceptLOIPayload
  | RejectLOIPayload
  | RequestChangesLOIPayload
  | CounterLOIPayload;

// Upload response for LOI documents
export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
  };
}
