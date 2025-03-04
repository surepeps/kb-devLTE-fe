export const URLS = {
  BASE: `${process.env.NEXT_PUBLIC_API_URL}`,
  agent: '/agent',
  agentSignup: '/agent/signup',
  agentLogin: '/agent/login',
  uploadImg: '/upload-image',
  agentOnboarding: '/agent/onboard',
  agentProfile: '/agent/profile',
  googleSignup: '/signup/google',
  googleLogin: '/login/google',
  verifyEmail: '/verify-email',
  agentCreateBrief: '/properties/sell/new',
  agentfetchTotalBriefs: '/agent/properties', // for agent total briefs
  landLordCreateBrief: '/properties/rents/rent/new',
  buyersFetchBriefs: '/properties/sell/all',
  rentersFetchBriefs: '/properties/rents/all', // to fetch rent briefs on the rent page
  buyersSearchBrief: '/properties/buy/request/search',
}