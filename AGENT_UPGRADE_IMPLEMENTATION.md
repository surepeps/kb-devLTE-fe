# Khabiteq Realty - Agent Upgrade Flow Implementation

## Overview

This implementation provides a comprehensive agent upgrade system for Khabiteq Realty that allows agents to transition from "Free Agent" status to "Verified Agent" status through a subscription-based upgrade flow.

## Agent States

### 1. Free Agent (Default)
- **Permissions**: Can post listings (commission applies), browse all pages
- **Restrictions**: No public page, no verified badge, commission fees apply
- **Access**: Basic features only

### 2. Verified Agent (Active Subscription)
- **Permissions**: Verified badge, public profile, unlimited listings, no commission, inspection fee setup
- **Features**: All premium features unlocked
- **Access**: Full platform capabilities

### 3. Expired Subscription
- **Permissions**: Can post listings (commission applies), browse all pages
- **Restrictions**: Public page disabled, commission fees apply again, no verified badge
- **Access**: Reverted to free agent limitations

## Implementation Components

### 1. Core Types (`src/types/agent-upgrade.types.ts`)
- **AgentState**: Type definitions for agent states
- **AgentKYCData**: Extended profile and verification data
- **InspectionFeeSetup**: Inspection fee configuration
- **AgentSubscriptionPlan**: Subscription plan definitions
- **PublicAgentProfile**: Public profile data structure

### 2. Agent Upgrade Flow (`src/components/agent-upgrade/`)

#### Main Flow Component
- **`AgentUpgradeFlow.tsx`**: Main multi-step upgrade process
- **Route**: `/agent-upgrade`

#### Step Components
- **`BasicProfileStep.tsx`**: Personal information verification
- **`ExtendedProfileStep.tsx`**: KYC, branding, and professional details
- **`InspectionFeeStep.tsx`**: Inspection fee setup (₦1,000 - ₦100,000)
- **`SubscriptionPlanStep.tsx`**: Plan selection (Monthly/Quarterly/Yearly)
- **`PaymentStep.tsx`**: Payment processing
- **`ActivationSuccessStep.tsx`**: Success celebration and sharing

#### Upgrade Flow Process
1. **Basic Profile**: Verify personal information and address
2. **Extended Profile**: Complete KYC with ID upload, specializations, services
3. **Inspection Fee**: Set inspection fee (Khabiteq deducts ₦1,000 per booking)
4. **Subscription Plan**: Choose from 3 plans with discounts for longer terms
5. **Payment**: Secure payment processing
6. **Activation**: Success celebration and profile sharing

### 3. Public Agent Profile (`src/app/agent-profile/[agentId]/page.tsx`)
- **Features**: Comprehensive agent showcase
- **Sections**: Overview, listings, reviews, contact
- **Capabilities**: Contact agent, book inspections, share profile
- **Integration**: Social sharing, WhatsApp contact, profile metrics

### 4. Authentication & Guards (`src/logic/combinedAuthGuard.tsx`)
- **Enhanced Guards**: Support for agent state verification
- **New Props**:
  - `requireVerifiedAgent`: Requires verified status
  - `allowFreeAgents`: Controls free agent access
  - `allowExpiredAgents`: Controls expired agent access
  - `requireActiveSubscription`: Requires active subscription

### 5. Services (`src/services/agentVerificationService.ts`)
- **Agent Upgrade Submission**: Handle upgrade form data
- **Verification Status**: Get current agent state
- **Profile Management**: Update agent profile data
- **Inspection Fees**: Set and update inspection fees
- **Statistics**: Agent performance metrics
- **Sharing Utils**: Generate shareable links and QR codes

### 6. Subscription Integration (`src/types/subscription.types.ts`)
- **Updated Types**: Integration with agent verification
- **New Payloads**: Agent verification subscription data
- **Enhanced Responses**: Verification status and public profile URLs

### 7. Upgrade Promotion Components (`src/components/agent-upgrade/`)

#### Promotion Components
- **`AgentUpgradePromotion.tsx`**: Contextual upgrade prompts
- **`AgentUpgradeButton.tsx`**: Various upgrade buttons
- **`AgentSuccessComponents.tsx`**: Success modals and sharing

#### Specialized Components
- **`NavUpgradeButton`**: Navigation upgrade button
- **`DashboardUpgradeButton`**: Dashboard upgrade CTA
- **`FloatingUpgradeButton`**: Floating upgrade reminder
- **`AgentSuccessModal`**: Success celebration with sharing

### 8. Navigation & Dashboard Integration

#### Navigation (`src/components/navigation/AgentNavigationWithUpgrade.tsx`)
- **Agent Status Badge**: Shows current agent state
- **Upgrade Prompts**: For non-verified features
- **Floating Buttons**: Persistent upgrade reminders
- **Expiry Banners**: Subscription renewal reminders

#### Dashboard (`src/components/dashboard/EnhancedAgentDashboard.tsx`)
- **State-Aware Stats**: Different metrics for different states
- **Upgrade Promotions**: Contextual upgrade suggestions
- **Quick Actions**: Direct links to upgrade flow
- **Performance Insights**: Enhanced for verified agents

## Subscription Plans

### Monthly Plan
- **Price**: ₦25,000/month
- **Features**: Basic verified agent features

### Quarterly Plan (Popular)
- **Price**: ₦67,500 (Save 10%)
- **Features**: Enhanced features + priority support

### Yearly Plan
- **Price**: ₦240,000 (Save 20%)
- **Features**: All features + custom branding + dedicated support

## API Integration Points

### Required Endpoints
1. **`POST /agent/upgrade`**: Submit agent upgrade data
2. **`GET /agent/verification-status`**: Get current agent state
3. **`GET /agent/public-profile/:id`**: Get public profile data
4. **`PUT /agent/profile`**: Update agent profile
5. **`PUT /agent/inspection-fee`**: Set inspection fees
6. **`GET /agent/stats`**: Get agent statistics

### Payment Integration
- **Flow**: Upgrade form → Payment gateway → Verification → Activation
- **Gateway**: Returns `authorization_url` for redirect
- **Verification**: Payment confirmation triggers agent state update

## Usage Examples

### Protecting Verified-Only Features
```tsx
<CombinedAuthGuard
  requireAuth={true}
  allowedUserTypes={["Agent"]}
  requireVerifiedAgent={true}
>
  <VerifiedOnlyComponent />
</CombinedAuthGuard>
```

### Adding Upgrade Prompts
```tsx
// Dashboard context
<AgentUpgradePrompt context="dashboard" />

// Navigation context  
<AgentUpgradePrompt context="navigation" compact />

// Listing context
<AgentUpgradePrompt context="listings" />
```

### Using Upgrade Buttons
```tsx
// Primary upgrade button
<AgentUpgradeButton variant="primary" size="large" />

// Navigation button
<NavUpgradeButton mobile={isMobile} />

// Floating reminder
<FloatingUpgradeButton show={!isVerified} />
```

### Success Sharing
```tsx
<AgentSuccessModal
  isOpen={showSuccess}
  onClose={() => setShowSuccess(false)}
  shareableData={{
    profileUrl: "https://khabiteq.com/agent-profile/123",
    agentName: "John Doe",
    agentTitle: "Verified Real Estate Agent"
  }}
/>
```

## Key Features

### 1. Multi-Step Upgrade Process
- Intuitive step-by-step flow
- Progress tracking and validation
- Data persistence between steps

### 2. Comprehensive KYC
- Document upload with preview
- Professional profile building
- Achievement showcase

### 3. Flexible Inspection Fees
- Customizable fee structure
- Transparent fee breakdown
- Khabiteq commission disclosure

### 4. Social Sharing Integration
- Multiple platform support
- QR code generation
- Profile link sharing

### 5. State-Aware UI
- Context-sensitive prompts
- Permission-based access
- Upgrade reminders

### 6. Professional Profiles
- SEO-friendly public pages
- Contact integration
- Portfolio showcase

## Installation & Setup

1. **Install Dependencies**: All required packages are in `package.json`
2. **Environment Variables**: Configure API endpoints in `NEXT_PUBLIC_API_URL`
3. **Route Protection**: Update existing guards with new agent state props
4. **API Integration**: Implement backend endpoints for agent verification
5. **Payment Gateway**: Configure payment processing for subscriptions

## Customization

### Theming
- Colors use CSS custom properties with fallbacks
- Consistent with existing design system
- Easily customizable brand colors

### Content
- All text content is configurable
- Support for custom messages in components
- Internationalization ready

### Features
- Modular component design
- Feature flags support
- Extensible subscription plans

## Security Considerations

- **Document Upload**: Secure file handling with validation
- **Payment Processing**: PCI compliant payment flow
- **Profile Access**: Proper authentication and authorization
- **Data Protection**: KYC data encryption and compliance

## Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Automatic image compression
- **Code Splitting**: Route-based code splitting
- **Caching**: API response caching where appropriate

## Testing

### Component Testing
- All components include prop validation
- Error boundaries for fault tolerance
- Loading states for better UX

### Integration Testing
- Mock data for development
- API integration points clearly defined
- Payment flow testing with sandbox

## Deployment

### Prerequisites
- Next.js 15+ environment
- Payment gateway configuration
- File upload service setup
- Email service for notifications

### Environment Setup
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Support & Maintenance

### Monitoring
- Agent upgrade conversion tracking
- Payment success/failure monitoring
- Profile sharing analytics

### Updates
- Subscription plan adjustments
- Feature additions
- UI/UX improvements

This implementation provides a complete, production-ready agent upgrade system that enhances agent credibility, provides revenue through subscriptions, and improves the overall platform value proposition.
