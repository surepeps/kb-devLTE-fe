/** @format */

export const URLS = {
  BASE: `${process.env.NEXT_PUBLIC_API_URL}`,

  /**
   * Upload Image
   */
  uploadImg: "/upload-image",
  uploadSingleImg: "/upload-single-file",

  deleteUploadedSingleImg: "/delete-single-file",

  submitVerificationDocs: "/submitVerificationDocs",
  verifyPayment: "/verify-payment",

  /**
   * Upload file
   */
  uploadFile: "/upload-file",
  /**
   * Property Endpoints
   */
  propertyBaseUrl: "/properties",
  /**
   * Settings
   */
  accountSettingsBaseUrl: "/account",

  /**
   * Preference Endpoints
   */
  preferenceBaseUrl: "/preferences",

  /**
   * Request for inspection
   */
  requestInspection: "/inspections/request-inspection",

  /**
   * Testimonials Url
   */
  testimonialsURL: "/testimonials",

  /**
   * Secure Negotition Base Url
   */
  inspectionBaseUrl: "/inspections",

  /**
   * Account endpoints
   */
  accountInspectionBaseUrl: "/account/my-inspections", 
  accountPropertyBaseUrl: "/account/properties", // Create, edit, delete, getOne
  fetchDashboardStats: "/account/dashboard",

  /**
   * Auth Endpoints
   */
  authLogin: "/auth/login",
  authRegister: "/auth/register",
  authGoogle: "/auth/googleAuth",
  authFacebook: "/auth/facebookAuth",
  authVerifyPasswordResetCode: "/auth/verifyPasswordResetCode",
  authResendResetPasswordToken: "/auth/resendPasswordCode",
  authRequestResetPassword: "/auth/resetPasswordRequest",
  authResendVerficationToken: "/auth/resendVerificationToken",
  authResetPassword: "/auth/resetPassword",
  authVerifyAccount: "/auth/verifyAccount",

  /**
   * Subscription Endpoints
   */
  subscriptionBaseUrl: "/subscriptions",
  getAgentSubscriptions: "/subscriptions/agent",
  createSubscription: "/subscriptions/create",
  renewSubscription: "/subscriptions/renew",
  cancelSubscription: "/subscriptions/cancel",
  getSubscriptionPlans: "/subscriptions/plans",
  getSubscriptionTransactions: "/subscriptions/transactions",

  /**
   * Third Party Verification Endpoints
   */
  thirdPartyVerificationBaseUrl: "/third-party-verification",
  validateVerificationToken: "/third-party-verification/validate-token",
  getVerificationDocuments: "/third-party-verification/documents",
  validateDocument: "/third-party-verification/validate",
  rejectDocument: "/third-party-verification/reject",
};
