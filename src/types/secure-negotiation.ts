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
  finalPrice?: number;
  buyOffer?: number;
  propertyTitle?: string;
  propertyLocation?: string;
  agreementTerms?: string[];
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
  inspectionDate?: string;
  inspectionTime?: string;
  reason?: string;
  rejectionReason?: string;
}

// Price negotiation payloads
export interface AcceptPricePayload extends BasePayload {
  action: "accept";
  inspectionType: "price";
}

export interface RejectPricePayload extends BasePayload {
  action: "reject";
  inspectionType: "price";
}

export interface CounterPricePayload extends BasePayload {
  action: "counter";
  inspectionType: "price";
  counterPrice: number;
}

// LOI negotiation payloads
export interface AcceptLOIPayload extends BasePayload {
  action: "accept";
  inspectionType: "LOI";
}

export interface RejectLOIPayload extends BasePayload {
  action: "reject";
  inspectionType: "LOI";
}

export interface RequestChangesLOIPayload extends BasePayload {
  action: "request_changes";
  inspectionType: "LOI";
  reason: string;
}

export interface CounterLOIPayload extends BasePayload {
  action: "counter";
  inspectionType: "LOI";
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
