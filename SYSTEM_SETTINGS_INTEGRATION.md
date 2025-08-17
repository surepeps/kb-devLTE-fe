# System Settings Integration

This document outlines the implementation of system settings integration in the Khabiteq application.

## Overview

The system settings integration allows the application to dynamically fetch and use configuration values from the backend instead of hardcoded values. This enables administrators to update application settings without requiring code changes.

## Implementation

### 1. API Endpoints

The system uses the `/getSystemSettings` endpoint with optional category filtering:

- `GET /getSystemSettings` - Fetch all settings
- `GET /getSystemSettings?category=subscription` - Fetch subscription settings
- `GET /getSystemSettings?category=home-page` - Fetch home page settings
- `GET /getSystemSettings?category=document-verification` - Fetch document verification settings
- `GET /getSystemSettings?category=continue-inspection` - Fetch inspection settings

### 2. File Structure

```
src/
├── types/
│   └── system-settings.ts          # TypeScript types for system settings
├── services/
│   └── systemSettingsService.ts    # API service functions
├── hooks/
│   └── useSystemSettings.ts        # Custom React hooks
└── components/
    └── homepage/
        ├── for-agents-section.tsx      # Uses subscription settings
        ├── new-hero-section.tsx        # Uses home page settings
        ├── key-features-section.tsx    # Uses home page settings
        └── FeatureCard.tsx             # Reusable component for features
```

### 3. Components Updated

#### ForAgentsSection
- **Dynamic subscription pricing**: Uses `subscription_fee_monthly` from API
- **Dynamic features list**: Uses `subscription_features` from API (newline-separated string)
- **Fallback values**: Maintains existing hardcoded values as fallbacks

#### NewHeroSection
- **Dynamic hero video**: Uses `hero_video_url` from home-page settings
- **Fallback video**: Uses default video path if API value is not available

#### KeyFeaturesSection
- **Dynamic feature videos**: Uses feature-specific video URLs from home-page settings:
  - `document_verification_video_url`
  - `submit_preference_video_url` 
  - `agent_marketplace_video_url`
  - `subscription_plan_video_url`
  - `post_property_video_url`

### 4. Error Handling

The implementation includes comprehensive error handling:

- **API unavailable**: Components gracefully fallback to default values
- **Network errors**: Retry logic and user-friendly error messages
- **Loading states**: Skeleton loaders while fetching settings
- **Type safety**: Full TypeScript support with proper error boundaries

### 5. Custom Hooks

```typescript
// Usage examples
const { settings, loading, error } = useSubscriptionSettings();
const { settings, loading, error } = useHomePageSettings();
const { settings, loading, error } = useDocumentVerificationSettings();
const { settings, loading, error } = useInspectionSettings();
```

### 6. Benefits

- **Dynamic content**: Administrators can update pricing, features, and videos without code deployments
- **Flexibility**: Easy to add new settings categories and fields
- **Performance**: Efficient caching and loading states
- **Maintainability**: Centralized settings management
- **Fallback support**: Application works even when API is unavailable

## Usage Example

```typescript
// In a component
const ForAgentsSection = () => {
  const { settings: subscriptionSettings, loading } = useSubscriptionSettings();
  
  const monthlyFee = subscriptionSettings.monthly_fee || 25000; // Fallback
  const features = subscriptionSettings.features 
    ? formatSubscriptionFeatures(subscriptionSettings.features)
    : defaultFeatures;
  
  return (
    <div>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div>
          <h3>₦{monthlyFee.toLocaleString()}/month</h3>
          {features.map(feature => <li key={feature}>{feature}</li>)}
        </div>
      )}
    </div>
  );
};
```

## Future Enhancements

1. **Caching**: Implement local storage caching for settings
2. **Real-time updates**: WebSocket integration for live settings updates
3. **Admin interface**: Build admin panel for managing system settings
4. **Validation**: Add schema validation for settings values
5. **A/B testing**: Support for multiple setting configurations
