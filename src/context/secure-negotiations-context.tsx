/** @format */

"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { GET_REQUEST, POST_REQUEST, PUT_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";
import type {
  PotentialClientData,
  NegotiationType,
  DateTimeObj,
  ContentTracker,
} from "@/types/negotiation";
import { ApiSuccessResponse } from "@/types/api-responses";

// Enhanced Types for Secure Negotiations
type InspectionStatus =
  | "accept"
  | "reject"
  | "countered"
  | "pending"
  | "expired";
type InspectionDateStatus =
  | "none"
  | "available"
  | "unavailable"
  | "countered"
  | "confirmed";
type LoadingType =
  | "submitting"
  | "accepting"
  | "rejecting"
  | "countering"
  | "loading";
type ActivityType =
  | "offer_made"
  | "offer_countered"
  | "offer_accepted"
  | "offer_rejected"
  | "inspection_scheduled"
  | "inspection_completed"
  | "message_sent";

interface ActivityLog {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: Date;
  userId: string;
  userType: "seller" | "buyer";
  metadata?: any;
}

interface SecureNegotiationState {
  // Security & Identity
  userId: string | null;
  inspectionId: string | null;
  isValidAccess: boolean;
  accessToken: string | null;

  // Data states
  formStatus: "idle" | "success" | "failed" | "pending";
  details: any | null;
  negotiationType: NegotiationType;
  createdAt: string | null;
  dateTimeObj: DateTimeObj;
  counterDateTimeObj: DateTimeObj;
  inspectionStatus: InspectionStatus | null;
  inspectionDateStatus: InspectionDateStatus | null;
  currentUserId: string | null;
  currentUserType: "seller" | "buyer" | null;

  // Enhanced Interactive Features
  activityLog: ActivityLog[];
  unreadActivities: number;
  isRealTimeEnabled: boolean;
  lastSeen: Date | null;

  // UI states
  contentTracker: ContentTracker;
  isNegotiated: boolean;
  isInteractive: boolean;
  showActivityFeed: boolean;

  // Modal states
  showSubmitOfferModal: boolean;
  showAcceptRejectModal: boolean;
  showMessageModal: boolean;
  offerPrice: number | undefined;
  counterOffer: number | undefined;

  // Loading states
  loadingStates: {
    submitting: boolean;
    accepting: boolean;
    rejecting: boolean;
    countering: boolean;
    loading: boolean;
    sendingMessage: boolean;
  };
}

type SecureNegotiationAction =
  // Security Actions
  | {
      type: "SET_ACCESS_CREDENTIALS";
      payload: { userId: string; inspectionId: string; accessToken?: string };
    }
  | { type: "VALIDATE_ACCESS"; payload: { isValid: boolean } }

  // Data Actions
  | {
      type: "SET_FORM_STATUS";
      payload: "idle" | "success" | "failed" | "pending";
    }
  | { type: "SET_DETAILS"; payload: any }
  | { type: "SET_NEGOTIATION_TYPE"; payload: NegotiationType }
  | { type: "SET_CREATED_AT"; payload: string }
  | { type: "SET_DATE_TIME_OBJ"; payload: DateTimeObj }
  | { type: "SET_COUNTER_DATE_TIME_OBJ"; payload: DateTimeObj }
  | { type: "SET_INSPECTION_STATUS"; payload: InspectionStatus }
  | { type: "SET_INSPECTION_DATE_STATUS"; payload: InspectionDateStatus }
  | {
      type: "SET_CURRENT_USER";
      payload: { userId: string; userType: "seller" | "buyer" };
    }

  // Interactive Actions
  | { type: "ADD_ACTIVITY"; payload: ActivityLog }
  | { type: "MARK_ACTIVITIES_READ" }
  | { type: "SET_REAL_TIME_STATUS"; payload: boolean }
  | { type: "UPDATE_LAST_SEEN" }

  // UI Actions
  | { type: "SET_CONTENT_TRACKER"; payload: ContentTracker }
  | { type: "SET_IS_NEGOTIATED"; payload: boolean }
  | { type: "TOGGLE_ACTIVITY_FEED" }
  | { type: "TOGGLE_INTERACTIVE_MODE" }

  // Modal Actions
  | { type: "TOGGLE_SUBMIT_OFFER_MODAL" }
  | { type: "TOGGLE_ACCEPT_REJECT_MODAL" }
  | { type: "TOGGLE_MESSAGE_MODAL" }
  | { type: "SET_OFFER_PRICE"; payload: number }
  | { type: "SET_COUNTER_OFFER"; payload: number }

  // Loading Actions
  | {
      type: "SET_LOADING";
      payload: {
        type: keyof SecureNegotiationState["loadingStates"];
        isLoading: boolean;
      };
    };

const initialState: SecureNegotiationState = {
  // Security & Identity
  userId: null,
  inspectionId: null,
  isValidAccess: false,
  accessToken: null,

  // Data states
  formStatus: "idle",
  details: null,
  negotiationType: "Normal",
  createdAt: null,
  dateTimeObj: { date: "", time: "" },
  counterDateTimeObj: { date: "", time: "" },
  inspectionStatus: null,
  inspectionDateStatus: null,
  currentUserId: null,
  currentUserType: null,

  // Interactive Features
  activityLog: [],
  unreadActivities: 0,
  isRealTimeEnabled: false,
  lastSeen: null,

  // UI states
  contentTracker: "Negotiation",
  isNegotiated: false,
  isInteractive: true,
  showActivityFeed: false,

  // Modal states
  showSubmitOfferModal: false,
  showAcceptRejectModal: false,
  showMessageModal: false,
  offerPrice: undefined,
  counterOffer: undefined,

  // Loading states
  loadingStates: {
    submitting: false,
    accepting: false,
    rejecting: false,
    countering: false,
    loading: false,
    sendingMessage: false,
  },
};

function secureNegotiationReducer(
  state: SecureNegotiationState,
  action: SecureNegotiationAction,
): SecureNegotiationState {
  switch (action.type) {
    case "SET_ACCESS_CREDENTIALS":
      return {
        ...state,
        userId: action.payload.userId,
        inspectionId: action.payload.inspectionId,
        accessToken: action.payload.accessToken || null,
      };

    case "VALIDATE_ACCESS":
      return {
        ...state,
        isValidAccess: action.payload.isValid,
      };

    case "SET_FORM_STATUS":
      return { ...state, formStatus: action.payload };

    case "SET_DETAILS":
      return { ...state, details: action.payload };

    case "SET_NEGOTIATION_TYPE":
      return { ...state, negotiationType: action.payload };

    case "SET_CREATED_AT":
      return { ...state, createdAt: action.payload };

    case "SET_DATE_TIME_OBJ":
      return { ...state, dateTimeObj: action.payload };

    case "SET_COUNTER_DATE_TIME_OBJ":
      return { ...state, counterDateTimeObj: action.payload };

    case "SET_INSPECTION_STATUS":
      return { ...state, inspectionStatus: action.payload };

    case "SET_INSPECTION_DATE_STATUS":
      return { ...state, inspectionDateStatus: action.payload };

    case "SET_CURRENT_USER":
      return {
        ...state,
        currentUserId: action.payload.userId,
        currentUserType: action.payload.userType,
      };

    case "ADD_ACTIVITY":
      const newActivity = action.payload;
      const isCurrentUser = newActivity.userId === state.currentUserId;
      return {
        ...state,
        activityLog: [...state.activityLog, newActivity],
        unreadActivities: isCurrentUser
          ? state.unreadActivities
          : state.unreadActivities + 1,
      };

    case "MARK_ACTIVITIES_READ":
      return {
        ...state,
        unreadActivities: 0,
        lastSeen: new Date(),
      };

    case "SET_REAL_TIME_STATUS":
      return { ...state, isRealTimeEnabled: action.payload };

    case "UPDATE_LAST_SEEN":
      return { ...state, lastSeen: new Date() };

    case "SET_CONTENT_TRACKER":
      return { ...state, contentTracker: action.payload };

    case "SET_IS_NEGOTIATED":
      return { ...state, isNegotiated: action.payload };

    case "TOGGLE_ACTIVITY_FEED":
      return { ...state, showActivityFeed: !state.showActivityFeed };

    case "TOGGLE_INTERACTIVE_MODE":
      return { ...state, isInteractive: !state.isInteractive };

    case "TOGGLE_SUBMIT_OFFER_MODAL":
      return { ...state, showSubmitOfferModal: !state.showSubmitOfferModal };

    case "TOGGLE_ACCEPT_REJECT_MODAL":
      return { ...state, showAcceptRejectModal: !state.showAcceptRejectModal };

    case "TOGGLE_MESSAGE_MODAL":
      return { ...state, showMessageModal: !state.showMessageModal };

    case "SET_OFFER_PRICE":
      return { ...state, offerPrice: action.payload };

    case "SET_COUNTER_OFFER":
      return { ...state, counterOffer: action.payload };

    case "SET_LOADING":
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [action.payload.type]: action.payload.isLoading,
        },
      };

    default:
      return state;
  }
}

interface SecureNegotiationContextType {
  state: SecureNegotiationState;

  // Security Methods
  validateAccess: (userId: string, inspectionId: string) => Promise<boolean>;
  setAccessCredentials: (
    userId: string,
    inspectionId: string,
    accessToken?: string,
  ) => void;

  // Data Methods
  fetchNegotiationDetails: (
    userId: string,
    inspectionId: string,
    userType: "seller" | "buyer",
  ) => Promise<void>;
  setFormStatus: (status: "idle" | "success" | "failed" | "pending") => void;
  setInspectionStatus: (status: InspectionStatus) => void;
  setCurrentUser: (userId: string, userType: "seller" | "buyer") => void;

  // Interactive Methods
  addActivity: (activity: Omit<ActivityLog, "id" | "timestamp">) => void;
  markActivitiesAsRead: () => void;
  enableRealTime: () => void;
  disableRealTime: () => void;

  // Navigation Methods
  goToNextPage: (page: ContentTracker) => void;
  toggleActivityFeed: () => void;
  toggleInteractiveMode: () => void;

  // Modal Methods
  toggleSubmitOfferModal: () => void;
  toggleAcceptRejectModal: () => void;
  toggleMessageModal: () => void;
  setOfferPrice: (price: number) => void;
  setCounterOffer: (price: number) => void;

  // Loading Methods
  setLoading: (
    type: keyof SecureNegotiationState["loadingStates"],
    isLoading: boolean,
  ) => void;
}

const SecureNegotiationContext = createContext<
  SecureNegotiationContextType | undefined
>(undefined);

export const SecureNegotiationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(secureNegotiationReducer, initialState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Security Methods
  const validateAccess = useCallback(
    async (userId: string, inspectionId: string): Promise<boolean> => {
      try {
        const response = await GET_REQUEST(
          `${ URLS.BASE + URLS.validateInspectionAccess}/${userId}/${inspectionId}`,
        );
        const isValid = response?.status === "success";
        dispatch({ type: "VALIDATE_ACCESS", payload: { isValid } });
        return isValid;
      } catch (error) {
        console.error("Access validation failed:", error);
        dispatch({ type: "VALIDATE_ACCESS", payload: { isValid: false } });
        return false;
      }
    },
    [],
  );

  const setAccessCredentials = useCallback(
    (userId: string, inspectionId: string, accessToken?: string) => {
      dispatch({
        type: "SET_ACCESS_CREDENTIALS",
        payload: { userId, inspectionId, accessToken },
      });
    },
    [],
  );

  // Data Methods
  const fetchNegotiationDetails = useCallback(
    async (
      userId: string,
      inspectionId: string,
      userType: "seller" | "buyer",
    ) => {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "loading", isLoading: true },
      });
      dispatch({ type: "SET_FORM_STATUS", payload: "pending" });

      try {
        const response = await GET_REQUEST(
          `${ URLS.BASE + URLS.getOneInspection}/${userId}/${inspectionId}/${userType}`,
        ); 

        if (response?.status === "success") {
          dispatch({ type: "SET_DETAILS", payload: response.data });
          dispatch({ type: "SET_FORM_STATUS", payload: "success" });

          // Set negotiation type
          const negotiationType = response.data.letterOfIntention
            ? "LOI"
            : "Normal";
          dispatch({ type: "SET_NEGOTIATION_TYPE", payload: negotiationType });

          // Set created date
          if (response.data.createdAt) {
            dispatch({
              type: "SET_CREATED_AT",
              payload: response.data.createdAt,
            });
          }

          // Load activity log
          if (response.data.activityLog) {
            response.data.activityLog.forEach((activity: any) => {
              dispatch({
                type: "ADD_ACTIVITY",
                payload: {
                  id: activity.id,
                  type: activity.type,
                  message: activity.message,
                  timestamp: new Date(activity.timestamp),
                  userId: activity.userId,
                  userType: activity.userType,
                  metadata: activity.metadata,
                },
              });
            });
          }
        } else {
          dispatch({ type: "SET_FORM_STATUS", payload: "failed" });
        }
      } catch (error) {
        console.error("Failed to fetch negotiation details:", error);
        dispatch({ type: "SET_FORM_STATUS", payload: "failed" });
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { type: "loading", isLoading: false },
        });
      }
    },
    [],
  );

  const setFormStatus = useCallback(
    (status: "idle" | "success" | "failed" | "pending") => {
      dispatch({ type: "SET_FORM_STATUS", payload: status });
    },
    [],
  );

  const setInspectionStatus = useCallback((status: InspectionStatus) => {
    dispatch({ type: "SET_INSPECTION_STATUS", payload: status });
  }, []);

  const setCurrentUser = useCallback(
    (userId: string, userType: "seller" | "buyer") => {
      dispatch({ type: "SET_CURRENT_USER", payload: { userId, userType } });
    },
    [],
  );

  // Interactive Methods
  const addActivity = useCallback(
    (activity: Omit<ActivityLog, "id" | "timestamp">) => {
      const newActivity: ActivityLog = {
        ...activity,
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };
      dispatch({ type: "ADD_ACTIVITY", payload: newActivity });
    },
    [],
  );

  const markActivitiesAsRead = useCallback(() => {
    dispatch({ type: "MARK_ACTIVITIES_READ" });
  }, []);

  const enableRealTime = useCallback(() => {
    dispatch({ type: "SET_REAL_TIME_STATUS", payload: true });

    // Set up polling for real-time updates
    if (state.userId && state.inspectionId && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        // Poll for updates every 5 seconds
        fetchNegotiationDetails(
          state.userId!,
          state.inspectionId!,
          state.currentUserType!,
        );
      }, 5000);
    }
  }, [
    state.userId,
    state.inspectionId,
    state.currentUserType,
    fetchNegotiationDetails,
  ]);

  const disableRealTime = useCallback(() => {
    dispatch({ type: "SET_REAL_TIME_STATUS", payload: false });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Navigation Methods
  const goToNextPage = useCallback((page: ContentTracker) => {
    dispatch({ type: "SET_CONTENT_TRACKER", payload: page });
  }, []);

  const toggleActivityFeed = useCallback(() => {
    dispatch({ type: "TOGGLE_ACTIVITY_FEED" });
  }, []);

  const toggleInteractiveMode = useCallback(() => {
    dispatch({ type: "TOGGLE_INTERACTIVE_MODE" });
  }, []);

  // Modal Methods
  const toggleSubmitOfferModal = useCallback(() => {
    dispatch({ type: "TOGGLE_SUBMIT_OFFER_MODAL" });
  }, []);

  const toggleAcceptRejectModal = useCallback(() => {
    dispatch({ type: "TOGGLE_ACCEPT_REJECT_MODAL" });
  }, []);

  const toggleMessageModal = useCallback(() => {
    dispatch({ type: "TOGGLE_MESSAGE_MODAL" });
  }, []);

  const setOfferPrice = useCallback((price: number) => {
    dispatch({ type: "SET_OFFER_PRICE", payload: price });
  }, []);

  const setCounterOffer = useCallback((price: number) => {
    dispatch({ type: "SET_COUNTER_OFFER", payload: price });
  }, []);

  // Loading Methods
  const setLoading = useCallback(
    (
      type: keyof SecureNegotiationState["loadingStates"],
      isLoading: boolean,
    ) => {
      dispatch({ type: "SET_LOADING", payload: { type, isLoading } });
    },
    [],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      state,
      validateAccess,
      setAccessCredentials,
      fetchNegotiationDetails,
      setFormStatus,
      setInspectionStatus,
      setCurrentUser,
      addActivity,
      markActivitiesAsRead,
      enableRealTime,
      disableRealTime,
      goToNextPage,
      toggleActivityFeed,
      toggleInteractiveMode,
      toggleSubmitOfferModal,
      toggleAcceptRejectModal,
      toggleMessageModal,
      setOfferPrice,
      setCounterOffer,
      setLoading,
    }),
    [
      state,
      validateAccess,
      setAccessCredentials,
      fetchNegotiationDetails,
      setFormStatus,
      setInspectionStatus,
      setCurrentUser,
      addActivity,
      markActivitiesAsRead,
      enableRealTime,
      disableRealTime,
      goToNextPage,
      toggleActivityFeed,
      toggleInteractiveMode,
      toggleSubmitOfferModal,
      toggleAcceptRejectModal,
      toggleMessageModal,
      setOfferPrice,
      setCounterOffer,
      setLoading,
    ],
  );

  return (
    <SecureNegotiationContext.Provider value={contextValue}>
      {children}
    </SecureNegotiationContext.Provider>
  );
};

export const useSecureNegotiation = () => {
  const context = useContext(SecureNegotiationContext);
  if (context === undefined) {
    throw new Error(
      "useSecureNegotiation must be used within a SecureNegotiationProvider",
    );
  }
  return context;
};

export default SecureNegotiationProvider;
