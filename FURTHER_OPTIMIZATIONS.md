# Further Performance Optimization Opportunities

## Current Analysis Results

### 1. Icon Library Consolidation (CRITICAL)

**Current State**: 3 icon libraries being used simultaneously
- `lucide-react` - Heavily used (150+ imports detected)
- `react-icons` - Partially used (15+ imports detected)  
- `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` - Partially used (20+ imports detected)

**Issue**: Bundling 3 icon libraries significantly increases bundle size unnecessarily.

**Recommended Action**: Consolidate to `lucide-react` as primary library
- lucide-react is already heavily used and lighter than FontAwesome
- Can replace react-icons (fi prefix) with equivalent lucide-react icons
- Can replace FontAwesome icons with lucide-react equivalents

**Estimated Savings**: ~50-80KB gzip (removing 2 icon libraries)

**Files to Update**:
- All files importing from `react-icons` → migrate to `lucide-react`
- All files importing from `@fortawesome` → migrate to `lucide-react`
- Remove the two unused icon packages from package.json

**Priority**: HIGH - This is the single largest bundle optimization opportunity

---

### 2. Carousel Library Consolidation

**Current State**: 2 carousel libraries
- `embla-carousel-react` - Used in hero section
- `swiper` - Used in multiple image galleries and property cards

**Issue**: Two similar libraries doing the same job

**Recommended Action**: Standardize on one library
- Option A: Migrate all to `embla-carousel-react` (lighter, more modern)
- Option B: Migrate all to `swiper` (more feature-rich, if needed)

**Estimated Savings**: ~30-40KB gzip

**Files to Update**:
- `src/components/new-homepage/new-hero-section.tsx` - Currently uses embla
- `src/components/new-marketplace/ImageSwiper.tsx` - Currently uses swiper
- `src/components/general-components/card.tsx` - Currently uses swiper
- `src/app/property/[marketType]/[ID]/page.tsx` - Currently uses swiper

**Priority**: HIGH

---

### 3. React Context Optimization

**Current Issue**: Multiple contexts may cause unnecessary re-renders
- UserContext
- NotificationProvider
- ModalProvider
- NewMarketplaceProvider
- SelectedBriefsProvider
- GlobalPropertyActionsProvider
- NegotiationContextWrapper
- PromoProvider
- PageContextProvider

**Recommendation**: Use `useMemo` and `useCallback` in context providers to prevent child re-renders on non-state changes

**Priority**: MEDIUM

---

### 4. Code Splitting Opportunities

**Opportunity 1**: Lazy load heavy components
- Dashboard pages (agent.tsx, field-agent.tsx, landlord.tsx)
- Property detail pages
- Inspection pages

**Opportunity 2**: Route-based code splitting
- Agent marketplace
- Preferences and matching
- Payment flows

**Estimated Savings**: ~10-20% initial load reduction

**Priority**: MEDIUM

---

### 5. Form Library Optimization

**Current**: Using `formik` + `yup` for form validation
- formik: ~8KB gzip
- yup: ~7KB gzip

**Alternative**: `react-hook-form` + `zod`
- react-hook-form: ~3KB gzip (more performant)
- zod: ~4KB gzip (faster validation)

**Estimated Savings**: ~8KB gzip + improved form performance

**Priority**: MEDIUM (requires significant refactoring)

---

### 6. Date Library Optimization

**Current**: Using `date-fns`
- date-fns is ~13KB gzip but is very comprehensive

**Alternative**: `dayjs`
- dayjs: ~2KB gzip
- Supports most common operations

**Note**: Only optimize if you're not using advanced date-fns features

**Priority**: LOW (if minimal date operations are needed)

---

## Summary of All Optimizations Done ✅

### Phase 1 (Completed)
- ✅ Removed 7 unused npm dependencies
- ✅ Deleted 6 unused utility files
- ✅ Fixed promo placeholder spacing
- ✅ Lazy loaded WhatsApp widget
- ✅ Lazy loaded non-critical homepage sections
- ✅ Optimized image caching (31536000s TTL)
- ✅ Added image format optimization (AVIF, WebP)
- ✅ Enabled gzip compression
- ✅ Added font-display: swap for better font loading
- ✅ Optimized CSS with Next.js experimental feature
- ✅ Removed unused CSS files

**Current Bundle Size Reduction**: ~300-400KB (node_modules + unused code)

---

## Recommended Priority Order

1. **HIGH**: Icon library consolidation (50-80KB savings)
2. **HIGH**: Carousel library consolidation (30-40KB savings)
3. **MEDIUM**: React context optimization (better performance)
4. **MEDIUM**: Additional code splitting (10-20% initial load)
5. **MEDIUM**: Form library migration (8KB + performance)
6. **LOW**: Date library migration (if applicable)

---

## Testing & Validation

After implementing optimizations:

```bash
# Bundle analysis
ANALYZE=true npm run build

# Performance metrics
npm run build
npm start
# Use Chrome DevTools Lighthouse
```

**Key Metrics to Monitor**:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

---

## Notes

- Icon consolidation is the quickest win with highest impact
- Carousel consolidation requires careful testing for feature parity
- Context optimization requires understanding current re-render patterns
- Form library migration is time-intensive but worthwhile for complex forms
- All changes should be tested thoroughly to ensure no functionality regression
