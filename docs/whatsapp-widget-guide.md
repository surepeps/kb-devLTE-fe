# WhatsApp Chat Widget Documentation

## Overview
The WhatsApp Chat Widget provides a floating chat interface positioned at the bottom-left of the application, allowing users to quickly contact support via WhatsApp.

## Features
- **Fixed Position**: Positioned at bottom-left of the screen
- **Expandable Interface**: Click to open detailed chat options
- **Quick Actions**: Pre-configured messages for common support topics
- **Business Hours**: Shows online/offline status based on configured business hours
- **Responsive Design**: Works on both desktop and mobile devices
- **Customizable**: Configurable through `whatsapp-config.ts`

## Usage

### Basic Implementation
The widget is automatically included in the main layout (`src/app/layout.tsx`) and appears on all pages.

### Configuration
Edit `src/config/whatsapp-config.ts` to customize:

```typescript
export const WHATSAPP_CONFIG = {
  phoneNumber: "+2348012345678", // Your WhatsApp number
  defaultMessages: {
    general: "Hi! I need help with Khabi-Teq services.",
    documentVerification: "I need help with document verification",
    // ... more predefined messages
  },
  businessHours: {
    start: "09:00",
    end: "18:00",
    timezone: "Africa/Lagos",
    workdays: [1, 2, 3, 4, 5], // Monday to Friday
  },
  appearance: {
    primaryColor: "#25D366", // WhatsApp green
    hoverColor: "#22C55E",
    // ... more appearance options
  }
};
```

### Custom Usage
You can also use the widget with custom props on specific pages:

```tsx
import WhatsAppChatWidget from '@/components/whatsapp-chat-widget';

// Custom implementation
<WhatsAppChatWidget 
  phoneNumber="+1234567890"
  message="Custom message for this page"
/>
```

## Quick Actions
The widget includes predefined quick actions for:
- Document Verification Help
- Payment Support
- Technical Support

## Business Hours
The widget automatically detects business hours and shows:
- **Online** status during business hours
- **Offline** status outside business hours
- Animated green dot when online
- Gray dot when offline

## Mobile Responsiveness
The widget is fully responsive and adapts to:
- Small screens (mobile devices)
- Touch interfaces
- Different screen orientations

## Customization Options

### Colors
- Primary color (default: WhatsApp green #25D366)
- Hover color (default: #22C55E)
- All colors can be customized in the config file

### Position
Currently positioned at bottom-left, but can be changed in the config:
```typescript
appearance: {
  position: "bottom-left", // or "bottom-right"
}
```

### Messages
All default messages can be customized in the `defaultMessages` object in the config file.

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful fallback for older browsers

## Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Focus management

## Performance
- Lightweight component (~5KB gzipped)
- No external dependencies beyond React and Lucide icons
- Lazy loading for optimal performance
- Optimized animations and transitions

## Troubleshooting

### Widget not appearing
1. Check that the component is imported in `layout.tsx`
2. Verify no CSS is hiding the fixed positioning
3. Check browser console for any JavaScript errors

### WhatsApp links not working
1. Verify phone number format in config (international format)
2. Check that message encoding is working properly
3. Test on different devices/browsers

### Business hours not accurate
1. Check timezone setting in config
2. Verify workdays array (0 = Sunday, 6 = Saturday)
3. Ensure time format is correct (24-hour format)

## Support
For technical issues with the widget, contact the development team or refer to the main application documentation.
