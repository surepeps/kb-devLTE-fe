# Public Access Page - Home Settings & Subscribe Settings API Payload

## Overview

This document outlines the payload structure for the new Home Settings and Subscribe Settings sections that can be sent to the backend API endpoints.

---

## 1. Home Settings Payload

### Endpoint
- **PUT** `/account/dealSite/{publicSlug}/homeSettings/update`

### Complete Payload Structure

```json
{
  "homeSettings": {
    "testimonials": {
      "title": "What Our Clients Say",
      "subTitle": "Real feedback from real clients",
      "testimonials": [
        {
          "rating": 5,
          "description": "This is an amazing service. I highly recommend it to everyone looking for quality properties.",
          "image": "https://res.cloudinary.com/demo/image/upload/v1730542398/default/testimonial-1.jpg",
          "name": "John Doe",
          "company": "ABC Realty Group"
        },
        {
          "rating": 4,
          "description": "Great experience working with this agent. Very professional and responsive.",
          "image": "https://res.cloudinary.com/demo/image/upload/v1730542398/default/testimonial-2.jpg",
          "name": "Jane Smith",
          "company": "XYZ Property Solutions"
        }
      ]
    },
    "whyChooseUs": {
      "title": "Why Choose Us",
      "subTitle": "We stand out from the rest",
      "items": [
        {
          "icon": "Check",
          "title": "Verified Listings",
          "content": "All our properties are thoroughly verified and documented for your peace of mind."
        },
        {
          "icon": "Shield",
          "title": "Secure Transactions",
          "content": "We ensure all transactions are secure and protected with legal agreements."
        },
        {
          "icon": "Award",
          "title": "Expert Team",
          "content": "Our experienced team is dedicated to helping you find the perfect property."
        }
      ]
    },
    "readyToFind": {
      "title": "Ready to Find Your Perfect Property?",
      "subTitle": "Start your journey today",
      "ctas": [
        {
          "bgColor": "#8DDB90",
          "text": "Browse Properties",
          "actionLink": "/market-place"
        },
        {
          "bgColor": "#09391C",
          "text": "Schedule Inspection",
          "actionLink": "/my-inspection-requests"
        }
      ],
      "items": [
        {
          "icon": "MapPin",
          "title": "Wide Coverage",
          "subTitle": "Properties across multiple cities",
          "content": "We have properties available in prime locations across the city and surrounding areas."
        },
        {
          "icon": "TrendingUp",
          "title": "Best Prices",
          "subTitle": "Competitive and transparent pricing",
          "content": "Get the best value for your investment with our competitive pricing and no hidden fees."
        }
      ]
    }
  }
}
```

### Field Descriptions

#### Testimonials Section

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Main heading for testimonials section |
| `subTitle` | string | Yes | Subtitle for testimonials section |
| `testimonials` | array | Yes | Array of testimonial objects (unlimited items) |
| `testimonials[].rating` | number | Yes | Star rating from 1-5 |
| `testimonials[].description` | string | Yes | Testimonial text/content |
| `testimonials[].image` | string | No | URL of testimonial image (uploaded via /upload-single-file) |
| `testimonials[].name` | string | Yes | Name of person giving testimonial |
| `testimonials[].company` | string | Yes | Company/organization of testimonial person |

#### Why Choose Us Section

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Main heading for section |
| `subTitle` | string | Yes | Subtitle for section |
| `items` | array | Yes | Array of feature items (unlimited items) |
| `items[].icon` | string | Yes | Lucide React icon name (e.g., "Check", "Shield", "Award") |
| `items[].title` | string | Yes | Feature title |
| `items[].content` | string | Yes | Feature description/content |

#### Ready to Find Section

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Main heading for section |
| `subTitle` | string | Yes | Subtitle for section |
| `ctas` | array | Yes | Array of CTA buttons (max 2 items) |
| `ctas[].bgColor` | string | Yes | Button background color in hex format (e.g., "#8DDB90") |
| `ctas[].text` | string | Yes | Button text/label |
| `ctas[].actionLink` | string | Yes | Link/route button navigates to (e.g., "/market-place") |
| `items` | array | Yes | Array of feature items (max 2 items) |
| `items[].icon` | string | Yes | Lucide React icon name |
| `items[].title` | string | Yes | Feature title |
| `items[].subTitle` | string | Yes | Feature subtitle |
| `items[].content` | string | Yes | Feature description/content |

---

## 2. Subscribe Settings Payload

### Endpoint
- **PUT** `/account/dealSite/{publicSlug}/subscribeSettings/update`

### Complete Payload Structure

```json
{
  "subscribeSettings": {
    "title": "Subscribe to Our Newsletter",
    "subTitle": "Get the latest updates and offers",
    "miniTitle": "Stay Updated",
    "backgroundColor": "#8DDB90",
    "cta": {
      "text": "Subscribe Now",
      "color": "#09391C"
    }
  }
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Main heading of the subscribe section |
| `subTitle` | string | Yes | Subtitle/description of the section |
| `miniTitle` | string | Yes | Small/secondary title text |
| `backgroundColor` | string | Yes | Section background color in hex format (e.g., "#8DDB90") |
| `cta.text` | string | Yes | Subscribe button text (e.g., "Subscribe Now", "Join Now") |
| `cta.color` | string | Yes | Subscribe button color in hex format (e.g., "#09391C") |

---

## 3. Icon Reference

The following icon names are available for use in `whyChooseUs` and `readyToFind` items:

```
Home, Star, Check, Shield, Lock, Zap, Award, Truck, MapPin, Users,
Heart, Briefcase, TrendingUp, DollarSign, Eye, Handshake, Target,
Lightbulb, Clock, Verified, Building, Search, Key, Anchor,
AlertCircle, Bookmark, Compass, Crown, Database, Fastforward, Gift,
Globe, Headphones, Hexagon, Inbox, Infinity, Layers, Maximize2,
Minimize2, Monitor, Moon, Move, Package, PieChart, Play, Pocket,
Power, Printer, RefreshCw, Repeat, Rocket, RotateCw, Save, Server,
Slack, Smile, Square, Sun, Trello, Unlock, Watch, Wifi, Wind, X
```

---

## 4. Complete Combined Payload Example

If updating both sections in a single request:

```json
{
  "homeSettings": {
    "testimonials": {
      "title": "What Our Clients Say",
      "subTitle": "Real feedback from real clients",
      "testimonials": [
        {
          "rating": 5,
          "description": "Excellent service and great support throughout the process.",
          "image": "https://example.com/testimonial1.jpg",
          "name": "John Doe",
          "company": "ABC Realty"
        }
      ]
    },
    "whyChooseUs": {
      "title": "Why Choose Us",
      "subTitle": "We stand out from the rest",
      "items": [
        {
          "icon": "Check",
          "title": "Verified Listings",
          "content": "All properties are thoroughly verified."
        },
        {
          "icon": "Shield",
          "title": "Secure Transactions",
          "content": "Your transactions are protected."
        }
      ]
    },
    "readyToFind": {
      "title": "Ready to Find Your Perfect Property?",
      "subTitle": "Start your journey today",
      "ctas": [
        {
          "bgColor": "#8DDB90",
          "text": "Browse Properties",
          "actionLink": "/market-place"
        }
      ],
      "items": [
        {
          "icon": "MapPin",
          "title": "Wide Coverage",
          "subTitle": "Multiple cities",
          "content": "Properties across prime locations."
        }
      ]
    }
  },
  "subscribeSettings": {
    "title": "Subscribe to Our Newsletter",
    "subTitle": "Get the latest updates and offers",
    "miniTitle": "Stay Updated",
    "backgroundColor": "#8DDB90",
    "cta": {
      "text": "Subscribe Now",
      "color": "#09391C"
    }
  }
}
```

---

## 5. Backend Implementation Notes

### Validation Rules

- **Icon values**: Must match one of the predefined icon names from the icon reference list
- **Color values**: Must be valid hex color codes (e.g., "#8DDB90")
- **Rating**: Must be a number between 1 and 5
- **Links**: Must be valid internal routes or absolute URLs
- **Max items**: 
  - `whyChooseUs.items`: Unlimited
  - `testimonials.testimonials`: Unlimited
  - `readyToFind.ctas`: Maximum 2 items
  - `readyToFind.items`: Maximum 2 items

### Image Handling

- Images are uploaded separately using the `/upload-single-file` endpoint
- The returned URL from the upload response should be stored in the `image` field of testimonials
- Images are optional for testimonials

### Database Schema Suggestions

```typescript
interface HomeSettings {
  testimonials?: {
    title: string;
    subTitle: string;
    testimonials: Array<{
      rating: number;
      description: string;
      image?: string;
      name: string;
      company: string;
    }>;
  };
  
  whyChooseUs?: {
    title: string;
    subTitle: string;
    items: Array<{
      icon?: string;
      title: string;
      content: string;
    }>;
  };
  
  readyToFind?: {
    title: string;
    subTitle: string;
    ctas: Array<{
      bgColor: string;
      text: string;
      actionLink: string;
    }>;
    items: Array<{
      icon?: string;
      title: string;
      subTitle: string;
      content: string;
    }>;
  };
}

interface SubscribeSettings {
  title: string;
  subTitle: string;
  miniTitle: string;
  backgroundColor: string;
  cta: {
    text: string;
    color: string;
  };
}
```

---

## 6. Error Responses

Expected error scenarios:

```json
{
  "success": false,
  "message": "Invalid icon name. Must be one of the predefined icons."
}
```

```json
{
  "success": false,
  "message": "Invalid hex color format."
}
```

```json
{
  "success": false,
  "message": "Ready to Find CTA buttons limited to maximum 2 items."
}
```

---

## 7. Success Response Example

```json
{
  "success": true,
  "message": "Home Settings updated successfully",
  "data": {
    "homeSettings": {
      "testimonials": { ... },
      "whyChooseUs": { ... },
      "readyToFind": { ... }
    }
  }
}
```

---

## Notes

- All section fields are optional at the top level (you can update only homeSettings or only subscribeSettings)
- Empty arrays are acceptable for dynamic items
- The frontend will handle maxing out CTA buttons and ready to find items at 2 items
- Icons are text names that map to Lucide React component names
- All timestamps should be handled server-side
