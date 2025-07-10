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

  // Interactive Features
  isRealTimeEnabled: boolean;
  isExpired: boolean;

  // UI states
  contentTracker: ContentTracker;
  isNegotiated: boolean;
  isInteractive: boolean;

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
  | { type: "SET_REAL_TIME_STATUS"; payload: boolean }
  | { type: "SET_EXPIRED_STATUS"; payload: boolean }

  // UI Actions
  | { type: "SET_CONTENT_TRACKER"; payload: ContentTracker }
  | { type: "SET_IS_NEGOTIATED"; payload: boolean }
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
  negotiationType: "NORMAL",
  createdAt: null,
  dateTimeObj: { selectedDate: "", selectedTime: "" },
  counterDateTimeObj: { selectedDate: "", selectedTime: "" },
  inspectionStatus: null,
  inspectionDateStatus: null,
  currentUserId: null,
  currentUserType: null,

  // Interactive Features
  isRealTimeEnabled: false,
  isExpired: false,

  // UI states
  contentTracker: "Negotiation",
  isNegotiated: false,
  isInteractive: true,

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

    case "SET_REAL_TIME_STATUS":
      return { ...state, isRealTimeEnabled: action.payload };

    case "SET_EXPIRED_STATUS":
      return { ...state, isExpired: action.payload };

    case "SET_CONTENT_TRACKER":
      return { ...state, contentTracker: action.payload };

    case "SET_IS_NEGOTIATED":
      return { ...state, isNegotiated: action.payload };

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
  refreshData: () => Promise<void>;

  // Interactive Methods
  setExpiredStatus: (isExpired: boolean) => void;
  reopenInspection: () => Promise<any>;

  // Navigation Methods
  goToNextPage: (page: ContentTracker) => void;
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

  // API Methods
  acceptOffer: (
    inspectionId: string,
    userType: "seller" | "buyer",
    inspectionDate: string,
    inspectionTime: string,
    dateTimeCountered?: boolean,
  ) => Promise<any>;
  rejectOffer: (
    inspectionId: string,
    userType: "seller" | "buyer",
  ) => Promise<any>;
  submitCounterOffer: (
    inspectionId: string,
    counterPrice: number,
    userType: "seller" | "buyer",
    inspectionDate: string,
    inspectionTime: string,
    dateTimeCountered?: boolean,
  ) => Promise<any>;
  updateInspectionDateTime: (
    inspectionId: string,
    date: string,
    time: string,
    userType: "seller" | "buyer",
    dateTimeCountered?: boolean,
  ) => Promise<any>;

  // LOI Methods
  acceptLOI: (
    inspectionId: string,
    userType: "seller" | "buyer",
    newLoiFile?: File,
  ) => Promise<any>;
  rejectLOI: (
    inspectionId: string,
    userType: "seller" | "buyer",
  ) => Promise<any>;
  requestLOIChanges: (
    inspectionId: string,
    userType: "seller" | "buyer",
    feedback: string,
  ) => Promise<any>;
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
          `${URLS.BASE + URLS.validateInspectionAccess}/${userId}/${inspectionId}`,
        );
        const isValid = response?.success;
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
          `${URLS.BASE + URLS.getOneInspection}/${userId}/${inspectionId}/${userType}`,
        );

        if (response?.success) {
          dispatch({ type: "SET_DETAILS", payload: response.data });
          dispatch({ type: "SET_FORM_STATUS", payload: "success" });

          // Set negotiation type based on letterOfIntention
          const negotiationType = response.data.letterOfIntention
            ? "LOI"
            : "Normal";
          dispatch({
            type: "SET_NEGOTIATION_TYPE",
            payload: negotiationType === "Normal" ? "NORMAL" : negotiationType,
          });

          // Set created date
          if (response.data.createdAt) {
            dispatch({
              type: "SET_CREATED_AT",
              payload: response.data.createdAt,
            });
          }

          // Check if inspection has expired (48 hours)
          if (response.data.updatedAt) {
            const updateTime = new Date(response.data.updatedAt).getTime();
            const now = new Date().getTime();
            const elapsed = now - updateTime;
            const fortyEightHours = 48 * 60 * 60 * 1000;
            const isExpired = elapsed > fortyEightHours;

            dispatch({ type: "SET_EXPIRED_STATUS", payload: isExpired });
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

  const refreshData = useCallback(async () => {
    if (state.userId && state.inspectionId && state.currentUserType) {
      await fetchNegotiationDetails(
        state.userId,
        state.inspectionId,
        state.currentUserType,
      );
    }
  }, [
    state.userId,
    state.inspectionId,
    state.currentUserType,
    fetchNegotiationDetails,
  ]);

  // Expiry Methods
  const setExpiredStatus = useCallback((isExpired: boolean) => {
    dispatch({ type: "SET_EXPIRED_STATUS", payload: isExpired });
  }, []);

  const reopenInspection = useCallback(async () => {
    if (state.userId && state.inspectionId && state.currentUserType) {
      try {
        const response = await PUT_REQUEST(
          `${URLS.BASE + URLS.getOneInspection}/${state.inspectionId}/reopen`,
          {
            userType: state.currentUserType,
          },
        );

        if (response?.success) {
          // Refetch data to get updated state
          await fetchNegotiationDetails(
            state.userId,
            state.inspectionId,
            state.currentUserType,
          );
          setExpiredStatus(false);
        }

        return response;
      } catch (error) {
        console.error("Failed to reopen inspection:", error);
        throw error;
      }
    }
  }, [
    state.userId,
    state.inspectionId,
    state.currentUserType,
    fetchNegotiationDetails,
    setExpiredStatus,
  ]);

  const enableRealTime = useCallback(() => {
    dispatch({ type: "SET_REAL_TIME_STATUS", payload: true });
    // Removed auto-polling - users will use refresh button instead
  }, []);

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

  // API Action Methods
  const acceptOffer = useCallback(
    async (
      inspectionId: string,
      userType: "seller" | "buyer",
      inspectionDate: string,
      inspectionTime: string,
      dateTimeCountered: boolean = false,
    ) => {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "accepting", isLoading: true },
      });

      try {
        const response = await PUT_REQUEST(
          `${URLS.BASE + URLS.getOneInspection}/${inspectionId}/accept`,
          {
            userType,
            action: "accept",
            inspectionDate,
            inspectionTime,
            dateTimeCountered,
          },
        );

        if (response?.success) {
          // Refetch data to get updated state
          await fetchNegotiationDetails(state.userId!, inspectionId, userType);
        }

        return response;
      } catch (error) {
        console.error("Failed to accept offer:", error);
        throw error;
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { type: "accepting", isLoading: false },
        });
      }
    },
    [state.userId, fetchNegotiationDetails],
  );

  const rejectOffer = useCallback(
    async (inspectionId: string, userType: "seller" | "buyer") => {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "rejecting", isLoading: true },
      });

      try {
        const response = await PUT_REQUEST(
          `${URLS.BASE + URLS.getOneInspection}/${inspectionId}/reject`,
          {
            userType,
            action: "reject",
          },
        );

        if (response?.success) {
          // Refetch data to get updated state
          await fetchNegotiationDetails(state.userId!, inspectionId, userType);
        }

        return response;
      } catch (error) {
        console.error("Failed to reject offer:", error);
        throw error;
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { type: "rejecting", isLoading: false },
        });
      }
    },
    [state.userId, fetchNegotiationDetails],
  );

  const submitCounterOffer = useCallback(
    async (
      inspectionId: string,
      counterPrice: number,
      userType: "seller" | "buyer",
      inspectionDate: string,
      inspectionTime: string,
      dateTimeCountered: boolean = false,
    ) => {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "countering", isLoading: true },
      });

      try {
        const response = await PUT_REQUEST(
          `${URLS.BASE + URLS.getOneInspection}/${inspectionId}/counter`,
          {
            userType,
            action: "counter",
            counterPrice,
            inspectionDate,
            inspectionTime,
            dateTimeCountered,
          },
        );

        if (response?.success) {
          // Refetch data to get updated state
          await fetchNegotiationDetails(state.userId!, inspectionId, userType);
        }

        return response;
      } catch (error) {
        console.error("Failed to submit counter offer:", error);
        throw error;
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { type: "countering", isLoading: false },
        });
      }
    },
    [state.userId, fetchNegotiationDetails],
  );

  const updateInspectionDateTime = useCallback(
    async (
      inspectionId: string,
      date: string,
      time: string,
      userType: "seller" | "buyer",
      dateTimeCountered: boolean = false,
    ) => {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "submitting", isLoading: true },
      });

      try {
        const response = await PUT_REQUEST(
          `${URLS.BASE + URLS.getOneInspection}/${inspectionId}/schedule`,
          {
            userType,
            inspectionDate: date,
            inspectionTime: time,
            dateTimeCountered,
          },
        );

        if (response?.success) {
          // Refetch data to get updated state
          await fetchNegotiationDetails(state.userId!, inspectionId, userType);
        }

        return response;
      } catch (error) {
        console.error("Failed to update inspection date/time:", error);
        throw error;
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { type: "submitting", isLoading: false },
        });
      }
    },
    [state.userId, fetchNegotiationDetails],
  );

  // LOI Methods
  const acceptLOI = useCallback(
    async (
      inspectionId: string,
      userType: "seller" | "buyer",
      newLoiFile?: File,
    ) => {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "accepting", isLoading: true },
      });

      try {
        let loiUrl = null;

        // If buyer is uploading a new LOI file
        if (newLoiFile) {
          // Upload the new LOI file first
          const formData = new FormData();
          formData.append("file", newLoiFile);

          const uploadResponse = await POST_REQUEST(
            `${URLS.BASE + URLS.uploadImg}`,
            formData,
            { "Content-Type": "multipart/form-data" },
          );

          if (uploadResponse?.success) {
            loiUrl = uploadResponse.data.url;
          }
        }

        const response = await PUT_REQUEST(
          `${URLS.BASE + URLS.getOneInspection}/${inspectionId}/loi/accept`,
          {
            userType,
            action: "accept",
            newLoiUrl: loiUrl,
          },
        );

        if (response?.success) {
          await fetchNegotiationDetails(state.userId!, inspectionId, userType);
        }

        return response;
      } catch (error) {
        console.error("Failed to accept LOI:", error);
        throw error;
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { type: "accepting", isLoading: false },
        });
      }
    },
    [state.userId, fetchNegotiationDetails],
  );

  const rejectLOI = useCallback(
    async (inspectionId: string, userType: "seller" | "buyer") => {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "rejecting", isLoading: true },
      });

      try {
        const response = await PUT_REQUEST(
          `${URLS.BASE + URLS.getOneInspection}/${inspectionId}/loi/reject`,
          {
            userType,
            action: "reject",
          },
        );

        if (response?.success) {
          await fetchNegotiationDetails(state.userId!, inspectionId, userType);
        }

        return response;
      } catch (error) {
        console.error("Failed to reject LOI:", error);
        throw error;
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { type: "rejecting", isLoading: false },
        });
      }
    },
    [state.userId, fetchNegotiationDetails],
  );

  const requestLOIChanges = useCallback(
    async (
      inspectionId: string,
      userType: "seller" | "buyer",
      feedback: string,
    ) => {
      dispatch({
        type: "SET_LOADING",
        payload: { type: "submitting", isLoading: true },
      });

      try {
        const response = await PUT_REQUEST(
          `${URLS.BASE + URLS.getOneInspection}/${inspectionId}/loi/requestChanges`,
          {
            userType,
            action: "requestChanges",
            feedback,
          },
        );

        if (response?.success) {
          await fetchNegotiationDetails(state.userId!, inspectionId, userType);
        }

        return response;
      } catch (error) {
        console.error("Failed to request LOI changes:", error);
        throw error;
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { type: "submitting", isLoading: false },
        });
      }
    },
    [state.userId, fetchNegotiationDetails],
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
      refreshData,
      setExpiredStatus,
      reopenInspection,
      enableRealTime,
      disableRealTime,
      goToNextPage,
      toggleInteractiveMode,
      toggleSubmitOfferModal,
      toggleAcceptRejectModal,
      toggleMessageModal,
      setOfferPrice,
      setCounterOffer,
      setLoading,
      acceptOffer,
      rejectOffer,
      submitCounterOffer,
      updateInspectionDateTime,
      acceptLOI,
      rejectLOI,
      requestLOIChanges,
    }),
    [
      state,
      validateAccess,
      setAccessCredentials,
      fetchNegotiationDetails,
      setFormStatus,
      setInspectionStatus,
      setCurrentUser,
      refreshData,
      setExpiredStatus,
      reopenInspection,
      enableRealTime,
      disableRealTime,
      goToNextPage,
      toggleInteractiveMode,
      toggleSubmitOfferModal,
      toggleAcceptRejectModal,
      toggleMessageModal,
      setOfferPrice,
      setCounterOffer,
      setLoading,
      acceptOffer,
      rejectOffer,
      submitCounterOffer,
      updateInspectionDateTime,
      acceptLOI,
      rejectLOI,
      requestLOIChanges,
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
